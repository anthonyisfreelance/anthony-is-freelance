// The runner: a job queue in D1, so the work fits the Workers Free limits (10 ms of CPU and 50
// subrequests per invocation; waiting on OpenAI doesn't count as CPU).
//
//   1. Starting a run inserts one pending answer per prompt per attempt, in one query.
//   2. The cron (every 5 minutes) claims a small batch (INSIGHTS_BATCH, default 4), asks the engine,
//      saves the answer and scores it. Run now does the first batch straight away, and the open
//      progress page asks for the next batch every few seconds, so a run finishes in minutes when
//      it is being watched, or a couple of hours on the cron alone.
//   3. The same cron starts each brand's weekly run on its weekday (after INSIGHTS_RUN_HOUR, UK
//      time, default 6), once per ISO week.
//   4. A failed answer is retried twice, then marked failed. Rate limits don't use up a try.
//      A run is complete when nothing in it is pending; failures are counted, not hidden.
//   5. With nothing to do, the cron stops after one query.
//
// Claiming is a single UPDATE ... RETURNING, so the cron and an open progress page never take the
// same answer. An answer claimed but not saved within 10 minutes (a worker that died) goes back in
// the queue.

import { db, now, brandOf, parse } from './db.js';
import { engineFor, enginesOn, engineName, EngineError } from './engine.js';
import { scoreAnswer } from './score.js';
import { takeScreen, homepageOf } from './screen.js';

export const MAX_TRIES = 3;
const STALE_MS = 10 * 60 * 1000;
const COUNTRY = 'GB';

export const batchSize = (env) => Math.min(8, Math.max(1, Number(env.INSIGHTS_BATCH) || 4));

export class RunError extends Error {}

// One run per engine. Starts ChatGPT, and Google AI Mode when it's set up; returns the ChatGPT run.
// A Google run that can't start (one already going) doesn't stop the ChatGPT one.
export async function startRuns(env, brand, opts = {}) {
  const [first, ...rest] = enginesOn(env);
  const run = await startRun(env, brand, { ...opts, engine: first });
  for (const engine of rest) await startRun(env, brand, { ...opts, engine }).catch((e) => console.error('[insights] run', engine, brand.slug, e.message));
  return run;
}

export async function startRun(env, brand, { kind = 'manual', week = null, engine = 'chatgpt' } = {}) {
  const d = db(env);
  const busy = await d.prepare(`SELECT id FROM runs WHERE brand_id = ? AND engine = ? AND status = 'running' LIMIT 1`).bind(brand.id, engine).first();
  if (busy) throw new RunError(`A ${engineName(engine)} run for this brand is still going. Wait for it to finish, or stop it first.`);
  const attempts = Math.min(10, Math.max(1, Number(brand.asks_per_week) || 3));
  const at = now();
  const run = await d
    .prepare(`INSERT INTO runs (brand_id, kind, week, engine, country, attempts, status, started_at) VALUES (?, ?, ?, ?, ?, ?, 'running', ?) RETURNING id`)
    .bind(brand.id, kind, week, engine, COUNTRY, attempts, at)
    .first();
  const inserted = await d
    .prepare(`WITH RECURSIVE n(k) AS (SELECT 1 UNION ALL SELECT k + 1 FROM n WHERE k < ?)
      INSERT INTO answers (run_id, brand_id, prompt_id, prompt_text, grp, attempt, status, engine, created_at)
      SELECT ?, p.brand_id, p.id, p.text, p.grp, n.k, 'pending', ?, ? FROM prompts p CROSS JOIN n
      WHERE p.brand_id = ? AND p.active = 1 ORDER BY p.position, n.k`)
    .bind(attempts, run.id, engine, at, brand.id)
    .run();
  const total = inserted.meta?.changes || 0;
  if (!total) {
    await d.prepare(`DELETE FROM runs WHERE id = ?`).bind(run.id).run();
    throw new RunError('This brand has no prompts yet. Add the prompt list first.');
  }
  await d.prepare(`UPDATE runs SET total = ? WHERE id = ?`).bind(total, run.id).run();
  return { id: run.id, total };
}

// Asks and scores up to `limit` answers. Returns what it did.
export async function processBatch(env, { limit = batchSize(env), runId = null } = {}) {
  const d = db(env);
  const at = now();
  const stale = new Date(Date.now() - STALE_MS).toISOString();
  // A watched run's page works on its own run first; the cron takes whatever is next.
  const { results: claimed } = await d
    .prepare(`UPDATE answers SET status = 'working', claimed_at = ?, tries = tries + 1
      WHERE id IN (SELECT id FROM answers WHERE (status = 'pending' OR (status = 'working' AND claimed_at < ?))
        ORDER BY ${runId ? 'run_id = ? DESC,' : ''} id LIMIT ?)
      RETURNING id, run_id, brand_id, prompt_id, prompt_text, grp, attempt, tries, engine`)
    .bind(...[at, stale, ...(runId ? [runId] : []), limit])
    .all();

  const done = { asked: 0, failed: 0, retry: 0, rescored: 0 };
  if (claimed.length) {
    const brands = await brandsById(env, claimed.map((a) => a.brand_id));
    // A rate limit pauses only the engine that hit it.
    const paused = new Set();
    await Promise.all(
      claimed.map(async (a) => {
        const brand = brands.get(a.brand_id);
        if (!brand) return fail(d, a, 'The brand was not found.', done);
        if (a.tries > MAX_TRIES) return fail(d, a, 'Timed out on every try.', done);
        if (paused.has(a.engine)) return requeue(d, a, true, done);
        try {
          const r = await engineFor(env, a.engine).ask({ prompt: a.prompt_text, country: COUNTRY, brand, attempt: a.attempt });
          const answer = { ...a, text: r.text, citations: r.citations };
          const s = await scoreAnswer(env, answer, brand);
          await d.batch([
            d.prepare(`UPDATE answers SET status = 'done', model = ?, text = ?, citations = ?, searches = ?, input_tokens = ?, output_tokens = ?, error = NULL, asked_at = ? WHERE id = ?`)
              .bind(r.model, r.text, JSON.stringify(r.citations), r.searches, r.usage.input, r.usage.output, now(), a.id),
            saveScore(d, a, s),
          ]);
          done.asked++;
        } catch (e) {
          if (e instanceof EngineError && e.rateLimited) {
            paused.add(a.engine);
            return requeue(d, a, true, done);
          }
          if (e instanceof EngineError && e.retry && a.tries < MAX_TRIES) return requeue(d, a, false, done, e.message);
          return fail(d, a, e.message || String(e), done);
        }
      }),
    );
  }

  // Spare room in the batch goes to answers waiting to be scored again.
  const room = limit - claimed.length;
  if (room > 0) done.rescored = await rescoreBatch(env, room, stale);

  if (claimed.length || done.rescored) await completeRuns(env);
  return { claimed: claimed.length, ...done };
}

async function brandsById(env, ids) {
  const unique = [...new Set(ids)];
  const { results } = await db(env)
    .prepare(`SELECT * FROM brands WHERE id IN (${unique.map(() => '?').join(',')})`)
    .bind(...unique)
    .all();
  return new Map(results.map((b) => [b.id, brandOf(b)]));
}

function requeue(d, a, free, done, error = null) {
  done.retry++;
  return d.prepare(`UPDATE answers SET status = 'pending', tries = tries - ?, error = ? WHERE id = ?`).bind(free ? 1 : 0, error, a.id).run();
}

function fail(d, a, error, done) {
  done.failed++;
  return d.prepare(`UPDATE answers SET status = 'failed', error = ? WHERE id = ?`).bind(String(error).slice(0, 300), a.id).run();
}

function saveScore(d, a, s) {
  return d
    .prepare(`INSERT INTO scores (answer_id, run_id, version, status, tries, brand_named, brand_position, domain_cited, cited_domains, recommended, above, flags, model, input_tokens, output_tokens, error, scored_at)
      VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(answer_id) DO UPDATE SET version = excluded.version, status = excluded.status, tries = scores.tries + 1,
        brand_named = excluded.brand_named, brand_position = excluded.brand_position, domain_cited = excluded.domain_cited,
        cited_domains = excluded.cited_domains, recommended = excluded.recommended, above = excluded.above, flags = excluded.flags,
        model = excluded.model, input_tokens = excluded.input_tokens, output_tokens = excluded.output_tokens, error = excluded.error, scored_at = excluded.scored_at`)
    .bind(
      a.id, a.run_id, s.version, s.status, s.brand_named, s.brand_position, s.domain_cited,
      JSON.stringify(s.cited_domains), JSON.stringify(s.recommended), JSON.stringify(s.above), JSON.stringify(s.flags),
      s.model, s.usage?.input || 0, s.usage?.output || 0, s.error, now(),
    );
}

// Scores waiting for the model layer: after Re-score, or after a scorer call failed (up to three
// tries). Claimed the same way as answers.
async function rescoreBatch(env, limit, stale) {
  const d = db(env);
  const { results: claimed } = await d
    .prepare(`UPDATE scores SET status = 'scoring', scored_at = ?
      WHERE answer_id IN (SELECT answer_id FROM scores WHERE ((status IN ('pending', 'partial') AND tries < ?) OR (status = 'scoring' AND scored_at < ?)) ORDER BY answer_id LIMIT ?)
      RETURNING answer_id`)
    .bind(now(), MAX_TRIES, stale, limit)
    .all();
  if (!claimed.length) return 0;
  const ids = claimed.map((c) => c.answer_id);
  const { results: answers } = await d
    .prepare(`SELECT id, run_id, brand_id, prompt_text, text, citations FROM answers WHERE id IN (${ids.map(() => '?').join(',')})`)
    .bind(...ids)
    .all();
  const brands = await brandsById(env, answers.map((a) => a.brand_id));
  await Promise.all(
    answers.map(async (a) => {
      const brand = brands.get(a.brand_id);
      if (!brand) return;
      const s = await scoreAnswer(env, { ...a, citations: parse(a.citations, []) }, brand);
      await saveScore(d, a, s).run();
    }),
  );
  return answers.length;
}

export async function completeRuns(env) {
  await db(env)
    .prepare(`UPDATE runs SET status = 'complete', completed_at = ?
      WHERE status = 'running' AND NOT EXISTS (SELECT 1 FROM answers a WHERE a.run_id = runs.id AND a.status IN ('pending', 'working'))
        AND NOT EXISTS (SELECT 1 FROM scores s WHERE s.run_id = runs.id AND s.status IN ('pending', 'scoring'))`)
    .bind(now())
    .run();
}

export async function runProgress(env, runId) {
  const row = await db(env)
    .prepare(`SELECT r.id, r.status, r.total, r.started_at, r.completed_at,
      sum(a.status = 'done') AS done, sum(a.status = 'failed') AS failed, sum(a.status = 'cancelled') AS cancelled,
      sum(a.status IN ('pending', 'working')) AS waiting,
      (SELECT count(*) FROM scores s WHERE s.run_id = r.id AND s.status IN ('pending', 'scoring')) AS scoring
      FROM runs r LEFT JOIN answers a ON a.run_id = r.id WHERE r.id = ? GROUP BY r.id`)
    .bind(runId)
    .first();
  return row;
}

// Stops a run: answers not yet asked are cancelled; any being asked right now still finish.
export async function stopRun(env, runId) {
  await db(env).prepare(`UPDATE answers SET status = 'cancelled' WHERE run_id = ? AND status = 'pending'`).bind(runId).run();
  await completeRuns(env);
}

// Queues every answer in a run to be scored again from its saved text.
export async function rescoreRun(env, runId) {
  const r = await db(env).prepare(`UPDATE scores SET status = 'pending', tries = 0 WHERE run_id = ?`).bind(runId).run();
  await db(env).prepare(`UPDATE runs SET status = 'running', completed_at = NULL WHERE id = ? AND status = 'complete'`).bind(runId).run();
  return r.meta?.changes || 0;
}

/* ---------- The cron ---------- */

const TZ = 'Europe/London';

// The UK date, weekday (0 Sunday to 6 Saturday), hour and ISO week of a moment.
export function ukClock(date = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23', weekday: 'short' })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  );
  const day = `${parts.year}-${parts.month}-${parts.day}`;
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday);
  return { day, weekday, hour: Number(parts.hour), week: isoWeek(day) };
}

export function isoWeek(day) {
  const d = new Date(`${day}T12:00:00Z`);
  const dow = (d.getUTCDay() + 6) % 7; // Monday 0
  d.setUTCDate(d.getUTCDate() - dow + 3); // the Thursday of this week decides the year
  const year = d.getUTCFullYear();
  const week = Math.ceil(((d - Date.UTC(year, 0, 1, 12)) / 864e5 + 1) / 7);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

export async function cron(env, when = new Date()) {
  const d = db(env);
  const clock = ukClock(when);
  const hourOk = clock.hour >= (Number(env.INSIGHTS_RUN_HOUR) || 6);
  // One query decides whether there is anything to do.
  const s = await d
    .prepare(`SELECT
      (SELECT count(*) FROM answers WHERE status = 'pending' OR status = 'working') AS answers,
      (SELECT count(*) FROM scores WHERE (status IN ('pending', 'partial') AND tries < ?) OR status = 'scoring') AS scores,
      (SELECT count(*) FROM brands b WHERE b.active = 1 AND b.run_weekday = ? AND ? = 1
        AND NOT EXISTS (SELECT 1 FROM runs r WHERE r.brand_id = b.id AND r.kind = 'weekly' AND r.week = ?)) AS due`)
    .bind(MAX_TRIES, clock.weekday, hourOk ? 1 : 0, clock.week)
    .first();
  const out = { started: [], batch: null };
  if (s.due) {
    const { results } = await d
      .prepare(`SELECT * FROM brands b WHERE b.active = 1 AND b.run_weekday = ?
        AND NOT EXISTS (SELECT 1 FROM runs r WHERE r.brand_id = b.id AND r.kind = 'weekly' AND r.week = ?)`)
      .bind(clock.weekday, clock.week)
      .all();
    for (const b of results) {
      try {
        const brand = brandOf(b);
        out.started.push(await startRuns(env, brand, { kind: 'weekly', week: clock.week }));
        // A fresh phone screenshot of the homepage with each weekly run.
        if (homepageOf(brand)) await takeScreen(env, brand).catch((e) => console.error('[insights] screenshot', brand.slug, e.message));
      } catch (e) {
        console.error('[insights] weekly run', b.slug, e.message);
      }
    }
  }
  if (s.answers || s.scores || out.started.length) out.batch = await processBatch(env);
  return out;
}
