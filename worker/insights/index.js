// Insights on insights.anthonyis.uk: how AI engines talk about a brand (phase 1), and later GA4
// audits, before-and-after reports and scheduled dates. How it fits together: worker/insights/README.md.
//
//   /                                    redirects to anthonyis.uk
//   /admin/                              login, then the brands list
//   /admin/brands/new/                   add a brand
//   /admin/brands/<slug>/                the brand page: AI visibility tab (?run=, ?group=, ?prompt=)
//   /admin/brands/<slug>/ga4/            GA4 tab (phase 3)
//   /admin/brands/<slug>/reports/        Reports tab (phase 2)
//   /admin/brands/<slug>/schedule/       Schedule tab
//   /admin/brands/<slug>/settings/       brand settings and the prompt list
//   /admin/brands/<slug>/answers/<id>/   one answer in full
//   /admin/samples/                      a made-up brand with a canned run, for checking the design
//   POST /admin/code, /admin/verify, /admin/logout, /admin/action   (JSON, from this site only)
//
// The cron (worker/index.js `scheduled`) calls `insightsCron` every 5 minutes.
//
// Security: the docs rules apply (worker/docs/README.md, Security). Login is a one-time code to
// ADMIN_EMAIL with a notice after every login; cookies are separate from docs and marked for
// insights, so a docs login never opens insights or the other way round.

import { esc, fmtDateTime, masthead, eyebrow, COMPANY } from '../docs/shared.js';
import { seal, unseal, hmac, newCode, newToken, getCookie, cookie, same } from '../docs/auth.js';
import { page as html, headers, allowed, codeAllowed } from '../docs/security.js';
import { resend } from '../docs/mail.js';
import { ensureSchema, db, getBrand, listBrands, getPrompts, now } from './db.js';
import { parsePromptList, savePromptList } from './prompts.js';
import { startRun, processBatch, runProgress, stopRun, rescoreRun, cron, ukClock, RunError } from './runner.js';
import { visibilityContent, progressOf, answerBody } from './dashboard.js';
import { loginPage, brandsPage, brandSettings, brandShell, placeholderTab, scheduleTab, insightsShell } from './pages.js';
import { insightsCodeEmail, insightsLoginNotice } from './emails.js';
import { flagKey } from './score.js';
import { list } from './text.js';
import { samples } from './samples.js';

const CODE_MINUTES = 10;
const ADMIN_DAYS = 14;
const SESSION = 'ins_admin';
const PENDING = 'ins_admin_code';
// Every rate limit is shared with docs' bindings but counted separately (the key carries this).
const RL = 'insights';

const adminEmail = (env) => env.ADMIN_EMAIL || COMPANY.email;
const clip = (v, n) => String(v ?? '').trim().slice(0, n);
const fromHere = (request, url) => request.headers.get('origin') === url.origin;

function json(data, status = 200, extra = {}) {
  const h = new Headers({ 'content-type': 'application/json', ...headers() });
  for (const [k, v] of Object.entries(extra)) for (const one of [].concat(v)) h.append(k, one);
  return new Response(JSON.stringify(data), { status, headers: h });
}

function message(base, title, text, status = 404) {
  const body = `${masthead('Insights', '')}<h1>${eyebrow('Anthony is Freelance')}${esc(title)}</h1><p>${esc(text)}</p>`;
  return html(insightsShell({ base, title, body }), status);
}

const tooMany = (request, base) =>
  request.method === 'GET'
    ? message(base, 'Too many requests', 'Please wait a minute and try again.', 429)
    : json({ ok: false, error: 'Too many tries in a short time. Please wait a minute and try again.' }, 429);

// Is this request from a logged-in insights admin? Also used by the comment tool on the samples.
export async function insightsSession(request, env) {
  const s = await unseal(env.DOCS_SECRET, getCookie(request, SESSION));
  return Boolean(s && s.app === 'insights');
}

async function readJson(request) {
  if (!(request.headers.get('content-type') || '').includes('application/json')) return null;
  try {
    return await request.json();
  } catch {
    return null;
  }
}

// Returns null for paths that aren't insights pages, so the site's files (fonts, icons) still load.
export async function insights(request, env, ctx) {
  const url = new URL(request.url);
  const base = url.origin;
  const parts = url.pathname.split('/').filter(Boolean);
  try {
    if (!parts.length) return Response.redirect('https://anthonyis.uk/', 302);
    if (parts[0] === 'admin') return await admin(request, env, url, parts.slice(1), ctx);
    // Reports (/report/<token>/) arrive in phase 2.
    if (parts[0] === 'report') return message(base, 'Not found', 'This link is not a report.');
    return null;
  } catch (e) {
    if (!(e instanceof RunError)) console.error('[insights]', e);
    const text = 'Something went wrong. Please try again in a minute.';
    if (request.method === 'POST') return json({ ok: false, error: e instanceof RunError ? e.message : text }, e instanceof RunError ? 400 : 500);
    return message(base, 'Something went wrong', text, 500);
  }
}

async function admin(request, env, url, parts, ctx) {
  const base = url.origin;
  const session = await insightsSession(request, env);
  const action = parts[0] || '';

  if (request.method === 'GET') {
    if (!(await allowed(env, 'DOCS_RL_READ', request, RL))) return tooMany(request, base);
    if (!url.pathname.endsWith('/')) return Response.redirect(`${base}${url.pathname}/${url.search}`, 301);
    if (!session) {
      // Keep the address, so a bookmarked page opens once the code is entered.
      return html(loginPage({ base, to: adminEmail(env) }));
    }
    if (action === 'samples') return samples(request, env, url, parts.slice(1));
    await ensureSchema(env);
    if (!action) return html(brandsPage({ base, brands: await listBrands(env) }));
    if (action === 'brands' && parts[1] === 'new' && parts.length === 2) return html(brandSettings({ base, isNew: true }));
    if (action === 'brands' && parts[1]) {
      const brand = await getBrand(env, parts[1]);
      if (!brand) return message(base, 'Brand not found', 'There is no brand at this address.');
      return brandPages(env, url, brand, parts.slice(2));
    }
    return message(base, 'Not found', 'There is no page here.');
  }

  // POSTs: JSON from a page on this site only.
  if (request.method !== 'POST') return json({ ok: false, error: 'Not found' }, 404);
  if (!fromHere(request, url)) return json({ ok: false, error: 'Not allowed.' }, 403);
  if (!(await allowed(env, 'DOCS_RL_POST', request, RL))) return tooMany(request, base);
  const body = await readJson(request);
  if (!body) return json({ ok: false, error: 'The request could not be read.' }, 400);
  if (!env.DOCS_SECRET) return json({ ok: false, error: 'DOCS_SECRET is not set yet.' }, 503);

  const ip = request.headers.get('cf-connecting-ip') || '';
  const place = [request.cf?.city, request.cf?.country].filter(Boolean).join(', ');

  if (action === 'code') {
    const code = newCode();
    const sealed = await seal(env.DOCS_SECRET, { app: 'insights', n: newToken(8), h: await hmac(env.DOCS_SECRET, `insights|${code}`), a: 0 }, CODE_MINUTES * 60);
    await resend(env, { to: adminEmail(env), ...insightsCodeEmail({ code, ip, place }) });
    return json({ ok: true, to: adminEmail(env), ...(env.INSIGHTS_DEV === '1' ? { devCode: code } : {}) }, 200, { 'set-cookie': cookie(PENDING, sealed, CODE_MINUTES * 60) });
  }
  if (action === 'verify') {
    const pending = await unseal(env.DOCS_SECRET, getCookie(request, PENDING));
    if (!pending || pending.app !== 'insights') return json({ ok: false, error: 'That code has expired. Please send a new one.' }, 400);
    if (pending.a >= 5) return json({ ok: false, error: 'Too many tries. Please send a new code.' }, 429);
    if (!(await codeAllowed(env, `${RL}|${pending.n}`))) return json({ ok: false, error: 'Too many tries. Please wait a minute, or send a new code.' }, 429);
    if (!same(await hmac(env.DOCS_SECRET, `insights|${clip(body.code, 6)}`), pending.h)) {
      const retry = await seal(env.DOCS_SECRET, { app: 'insights', n: pending.n, h: pending.h, a: (pending.a || 0) + 1 }, Math.max(1, Math.round((pending.exp - Date.now()) / 1000)));
      return json({ ok: false, error: "That code isn't right." }, 400, { 'set-cookie': cookie(PENDING, retry, CODE_MINUTES * 60) });
    }
    const sessionCookie = await seal(env.DOCS_SECRET, { app: 'insights', admin: 1 }, ADMIN_DAYS * 24 * 3600);
    // A notice on every login, so a login that wasn't Anthony is spotted straight away.
    const notice = resend(env, {
      to: adminEmail(env),
      ...insightsLoginNotice({ host: url.host, when: fmtDateTime(new Date().toISOString()), ip, place, ua: clip(request.headers.get('user-agent'), 200) }),
    }).catch((e) => console.error('[insights] login notice', e));
    if (ctx?.waitUntil) ctx.waitUntil(notice);
    return json({ ok: true }, 200, { 'set-cookie': [cookie(SESSION, sessionCookie, ADMIN_DAYS * 24 * 3600), cookie(PENDING, '', 0)] });
  }
  if (action === 'logout') return json({ ok: true }, 200, { 'set-cookie': cookie(SESSION, '', 0) });

  if (!session) return json({ ok: false, error: 'Please log in again.' }, 401);
  if (action !== 'action') return json({ ok: false, error: 'Not found' }, 404);
  await ensureSchema(env);
  return act(env, body, ctx);
}

/* ---------- Brand pages ---------- */

async function brandPages(env, url, brand, rest) {
  const base = url.origin;
  const tab = rest[0] || '';
  if (tab === 'settings' && rest.length === 1) {
    return html(brandSettings({ base, brand, prompts: await getPrompts(env, brand.id) }));
  }
  if (tab === 'answers' && rest[1] && rest.length === 2) {
    const a = await db(env)
      .prepare(`SELECT a.*, s.status AS s_status, s.version AS s_version, s.error AS s_error, s.brand_named, s.brand_position, s.domain_cited, s.recommended, s.above, s.flags
        FROM answers a LEFT JOIN scores s ON s.answer_id = a.id WHERE a.id = ? AND a.brand_id = ?`)
      .bind(Number(rest[1]) || 0, brand.id)
      .first();
    if (!a) return message(base, 'Answer not found', 'There is no answer at this address.');
    const back = `/admin/brands/${brand.slug}/?run=${a.run_id}&prompt=${a.prompt_id}#answers`;
    return html(brandShell({ base, brand, active: '', content: answerBody(a, brand, { back }) }));
  }
  if (tab === 'ga4' || tab === 'reports') return html(brandShell({ base, brand, active: tab, content: placeholderTab(tab, brand) }));
  if (tab === 'schedule') return html(brandShell({ base, brand, active: tab, content: scheduleTab(brand, { nextRun: nextRunDay(brand) }) }));
  if (tab) return message(base, 'Not found', 'There is no page here.');
  return html(brandShell({ base, brand, active: '', content: await visibilityTab(env, url, brand) }));
}

function nextRunDay(brand) {
  const c = ukClock();
  let days = (Number(brand.run_weekday) - c.weekday + 7) % 7;
  if (days === 0 && c.hour >= 6) days = 7;
  const d = new Date(`${c.day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const TREND_SQL = `SELECT r.id, r.kind, r.status, r.started_at, r.completed_at, r.attempts, r.total,
  count(s.answer_id) AS n, coalesce(sum(s.brand_named), 0) AS named, avg(s.brand_position) AS pos,
  coalesce(sum(a.grp = 'A'), 0) AS na, coalesce(sum(CASE WHEN a.grp = 'A' THEN s.brand_named END), 0) AS nameda,
  coalesce(sum(a.grp = 'B'), 0) AS nb, coalesce(sum(CASE WHEN a.grp = 'B' THEN s.brand_named END), 0) AS namedb
  FROM runs r LEFT JOIN answers a ON a.run_id = r.id AND a.status = 'done' LEFT JOIN scores s ON s.answer_id = a.id
  WHERE r.brand_id = ? GROUP BY r.id ORDER BY r.started_at DESC LIMIT 26`;

async function visibilityTab(env, url, brand) {
  const d = db(env);
  const { results: trend } = await d.prepare(TREND_SQL).bind(brand.id).all();
  const pick = Number(url.searchParams.get('run')) || null;
  const run = (pick && trend.find((r) => r.id === pick)) || trend.find((r) => r.status === 'running') || trend.find((r) => r.status === 'complete') || trend[0];
  const promptCount = (await d.prepare(`SELECT count(*) AS n FROM prompts WHERE brand_id = ? AND active = 1`).bind(brand.id).first()).n;
  if (!run) return visibilityContent({ brand, trend, run: null, promptCount });
  const group = (url.searchParams.get('group') || '').slice(0, 1) || null;
  const prompt = Number(url.searchParams.get('prompt')) || null;
  const { results: rows } = await d
    .prepare(`SELECT a.id, a.prompt_id, a.prompt_text, a.grp, a.attempt, a.status, a.error, a.model, a.citations, a.searches, a.input_tokens, a.output_tokens,
      ${prompt ? 'CASE WHEN a.prompt_id = ? THEN a.text END AS text,' : ''}
      s.status AS s_status, s.brand_named, s.brand_position, s.domain_cited, s.recommended, s.above, s.flags
      FROM answers a LEFT JOIN scores s ON s.answer_id = a.id WHERE a.run_id = ? ORDER BY a.id`)
    .bind(...(prompt ? [prompt, run.id] : [run.id]))
    .all();
  const link = (change) => {
    const q = new URLSearchParams();
    const next = { run: run.id, group, prompt, ...change };
    if (next.run && next.run !== trend[0]?.id) q.set('run', next.run);
    if (next.group) q.set('group', next.group);
    if (next.prompt) q.set('prompt', next.prompt);
    const s = q.toString();
    return `/admin/brands/${brand.slug}/${s ? `?${s}` : ''}${change.group !== undefined || change.prompt !== undefined ? '#answers' : ''}`;
  };
  const answerHref = (id) => `/admin/brands/${brand.slug}/answers/${id}/`;
  const progress = run.status === 'running' ? await runProgress(env, run.id) : null;
  return visibilityContent({ brand, trend, run, rows, group, prompt, link, answerHref, progress, promptCount });
}

/* ---------- Actions ---------- */

function brandFields(f, { isNew }) {
  const name = clip(f.name, 120);
  if (!name) return { error: 'Please add the brand name.' };
  const slug = isNew ? (clip(f.slug, 40) || name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) : null;
  if (isNew && (!slug || slug === 'new')) return { error: 'Please choose a different short name.' };
  const flags = [];
  for (const line of String(f.flags || '').split(/\r?\n/)) {
    const t = line.trim();
    if (!t) continue;
    const i = t.indexOf(':');
    const label = clip(i > 0 ? t.slice(0, i) : t, 60);
    const description = clip(i > 0 ? t.slice(i + 1) : '', 300);
    const key = flagKey(label);
    if (label && !flags.some((x) => x.key === key)) flags.push({ key, label, description });
    if (flags.length >= 12) break;
  }
  const domains = String(f.match_domains || '').split(/[\n,]+/).map((s) => s.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '')).filter((s) => /^[a-z0-9.-]+\.[a-z]{2,}$/.test(s)).slice(0, 20);
  const launch = /^\d{4}-\d{2}-\d{2}$/.test(String(f.launch_date || '')) ? f.launch_date : null;
  return {
    slug,
    name,
    match_names: JSON.stringify(list(f.match_names, 20).map((s) => s.slice(0, 120))),
    match_domains: JSON.stringify([...new Set(domains)]),
    facts: clip(f.facts, 4000),
    flags: JSON.stringify(flags),
    launch_date: launch,
    ga4_property: clip(f.ga4_property, 20).replace(/[^0-9]/g, ''),
    uk_only: f.uk_only ? 1 : 0,
    asks_per_week: Math.min(10, Math.max(1, Math.round(Number(f.asks_per_week) || 3))),
    run_weekday: Math.min(6, Math.max(0, Math.round(Number(f.run_weekday ?? 1)))),
    active: f.active === undefined ? 1 : f.active ? 1 : 0,
  };
}

async function act(env, body, ctx) {
  const d = db(env);
  const token = clip(body.token, 60);
  const f = body.fields && typeof body.fields === 'object' ? body.fields : {};
  if (token === 'SAMPLE') return json({ ok: false, error: 'This is a sample, so the buttons do nothing here.' }, 400);

  if (body.action === 'brand-add') {
    const v = brandFields(f, { isNew: true });
    if (v.error) return json({ ok: false, error: v.error }, 400);
    if (await getBrand(env, v.slug)) return json({ ok: false, error: 'A brand with that short name already exists.' }, 409);
    const at = now();
    await d
      .prepare(`INSERT INTO brands (slug, name, match_names, match_domains, facts, flags, launch_date, ga4_property, uk_only, asks_per_week, run_weekday, active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`)
      .bind(v.slug, v.name, v.match_names, v.match_domains, v.facts, v.flags, v.launch_date, v.ga4_property, v.uk_only, v.asks_per_week, v.run_weekday, at, at)
      .run();
    return json({ ok: true, message: 'Brand added. Now paste in the prompt list.', go: `/admin/brands/${v.slug}/settings/` });
  }

  if (body.action === 'brand-save' || body.action === 'prompts-save' || body.action === 'run-now') {
    const brand = await getBrand(env, token);
    if (!brand) return json({ ok: false, error: 'Brand not found.' }, 404);
    if (body.action === 'brand-save') {
      const v = brandFields(f, { isNew: false });
      if (v.error) return json({ ok: false, error: v.error }, 400);
      await d
        .prepare(`UPDATE brands SET name = ?, match_names = ?, match_domains = ?, facts = ?, flags = ?, launch_date = ?, ga4_property = ?, uk_only = ?, asks_per_week = ?, run_weekday = ?, active = ?, updated_at = ? WHERE id = ?`)
        .bind(v.name, v.match_names, v.match_domains, v.facts, v.flags, v.launch_date, v.ga4_property, v.uk_only, v.asks_per_week, v.run_weekday, v.active, now(), brand.id)
        .run();
      return json({ ok: true, message: 'Settings saved.' });
    }
    if (body.action === 'prompts-save') {
      const parsed = parsePromptList(f.list);
      if (!parsed.prompts.length) return json({ ok: false, error: 'No prompts found. Start with a group line such as "A. Recommendation, no modifier", then numbered prompts.' }, 400);
      if (parsed.tooMany) return json({ ok: false, error: 'That is more than 45 prompts. Please shorten the list.' }, 400);
      const r = await savePromptList(env, brand, parsed);
      const groups = Object.keys(parsed.groups).length;
      const skipped = parsed.skipped.length ? ` Skipped ${parsed.skipped.length} line${parsed.skipped.length === 1 ? '' : 's'} that weren't a group or a numbered prompt: "${parsed.skipped[0]}"${parsed.skipped.length > 1 ? ' and others' : ''}.` : '';
      return json({ ok: true, message: `Saved ${r.saved} prompts in ${groups} group${groups === 1 ? '' : 's'}${r.removed ? `, ${r.removed} switched off` : ''}.${skipped}` });
    }
    // Run now: queue the whole run and ask the first batch straight away.
    const run = await startRun(env, brand, { kind: 'manual' });
    const first = await processBatch(env, { runId: run.id });
    return json({ ok: true, message: `Run started: ${run.total} questions. ${first.asked} answered so far.` });
  }

  if (['run-step', 'run-stop', 'rescore'].includes(body.action)) {
    const runId = Number(token) || 0;
    const run = await d.prepare(`SELECT id, status FROM runs WHERE id = ?`).bind(runId).first();
    if (!run) return json({ ok: false, error: 'Run not found.' }, 404);
    if (body.action === 'run-step') {
      if (run.status === 'running') await processBatch(env, { runId });
      return json({ ok: true, progress: progressOf(await runProgress(env, runId)) });
    }
    if (body.action === 'run-stop') {
      await stopRun(env, runId);
      return json({ ok: true, message: 'Run stopped. Answers already asked are kept.' });
    }
    const n = await rescoreRun(env, runId);
    ctx?.waitUntil?.(processBatch(env, { runId }).catch((e) => console.error('[insights] rescore', e.message)));
    return json({ ok: true, message: `${n} answers queued for scoring again.` });
  }

  return json({ ok: false, error: 'Not found' }, 404);
}

/* ---------- Cron ---------- */

export async function insightsCron(env, when) {
  if (!env.INSIGHTS_DB) return;
  await ensureSchema(env);
  const out = await cron(env, when);
  if (out.started.length || out.batch?.claimed || out.batch?.rescored) console.log('[insights] cron', JSON.stringify(out));
}
