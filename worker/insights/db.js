// The insights database (Cloudflare D1, binding INSIGHTS_DB).
//
// The worker creates and upgrades its own tables: there are no migration commands to run. The
// first request after a deploy checks the schema version row and applies any steps it hasn't had.
// To change the tables, add a step to STEPS (never edit one that has shipped).
//
// Times are ISO strings in UTC. Counts and tokens are integers. Lists (names to match, cited links,
// scorer output) are JSON text.

export const STEPS = [
  // 1: phase 1, the AI visibility tracker.
  [
    `CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS brands (
      id INTEGER PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      match_names TEXT NOT NULL DEFAULT '[]',
      match_domains TEXT NOT NULL DEFAULT '[]',
      facts TEXT NOT NULL DEFAULT '',
      flags TEXT NOT NULL DEFAULT '[]',
      groups TEXT NOT NULL DEFAULT '{}',
      launch_date TEXT,
      ga4_property TEXT NOT NULL DEFAULT '',
      uk_only INTEGER NOT NULL DEFAULT 0,
      asks_per_week INTEGER NOT NULL DEFAULT 3,
      run_weekday INTEGER NOT NULL DEFAULT 1,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS prompts (
      id INTEGER PRIMARY KEY,
      brand_id INTEGER NOT NULL REFERENCES brands(id),
      grp TEXT NOT NULL,
      position INTEGER NOT NULL,
      text TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    )`,
    `CREATE INDEX IF NOT EXISTS prompts_brand ON prompts (brand_id, active, position)`,
    `CREATE TABLE IF NOT EXISTS runs (
      id INTEGER PRIMARY KEY,
      brand_id INTEGER NOT NULL REFERENCES brands(id),
      kind TEXT NOT NULL,
      week TEXT,
      engine TEXT NOT NULL,
      country TEXT NOT NULL,
      attempts INTEGER NOT NULL,
      total INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'running',
      started_at TEXT NOT NULL,
      completed_at TEXT
    )`,
    `CREATE INDEX IF NOT EXISTS runs_brand ON runs (brand_id, started_at)`,
    `CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY,
      run_id INTEGER NOT NULL REFERENCES runs(id),
      brand_id INTEGER NOT NULL,
      prompt_id INTEGER NOT NULL,
      prompt_text TEXT NOT NULL,
      grp TEXT NOT NULL,
      attempt INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      tries INTEGER NOT NULL DEFAULT 0,
      engine TEXT NOT NULL,
      model TEXT,
      text TEXT,
      citations TEXT NOT NULL DEFAULT '[]',
      searches INTEGER NOT NULL DEFAULT 0,
      input_tokens INTEGER NOT NULL DEFAULT 0,
      output_tokens INTEGER NOT NULL DEFAULT 0,
      error TEXT,
      claimed_at TEXT,
      asked_at TEXT,
      created_at TEXT NOT NULL
    )`,
    `CREATE INDEX IF NOT EXISTS answers_queue ON answers (status, id)`,
    `CREATE INDEX IF NOT EXISTS answers_run ON answers (run_id, prompt_id, attempt)`,
    // One score per answer: the rule layer (brand named, domain cited, cited domains) and the model
    // layer (who is recommended, in order, and the framing flags with evidence). status: done, or
    // pending (queued for the model layer, for example after Re-score), or partial (the rule layer
    // only, because the model call failed; retried up to three times).
    `CREATE TABLE IF NOT EXISTS scores (
      answer_id INTEGER PRIMARY KEY REFERENCES answers(id),
      run_id INTEGER NOT NULL,
      version TEXT NOT NULL,
      status TEXT NOT NULL,
      tries INTEGER NOT NULL DEFAULT 0,
      brand_named INTEGER NOT NULL DEFAULT 0,
      brand_position INTEGER,
      domain_cited INTEGER NOT NULL DEFAULT 0,
      cited_domains TEXT NOT NULL DEFAULT '[]',
      recommended TEXT NOT NULL DEFAULT '[]',
      above TEXT NOT NULL DEFAULT '[]',
      flags TEXT NOT NULL DEFAULT '[]',
      model TEXT,
      input_tokens INTEGER NOT NULL DEFAULT 0,
      output_tokens INTEGER NOT NULL DEFAULT 0,
      error TEXT,
      scored_at TEXT NOT NULL
    )`,
    `CREATE INDEX IF NOT EXISTS scores_queue ON scores (status, tries)`,
    `CREATE INDEX IF NOT EXISTS scores_run ON scores (run_id)`,
  ],
];

export const SCHEMA_VERSION = STEPS.length;

// Checked once per worker instance. A failed check is retried on the next request.
let ready = null;

export function db(env) {
  if (!env.INSIGHTS_DB) throw new Error('The insights database is not connected (INSIGHTS_DB binding).');
  return env.INSIGHTS_DB;
}

export async function ensureSchema(env) {
  if (!ready) ready = upgrade(db(env)).catch((e) => { ready = null; throw e; });
  return ready;
}

async function upgrade(d) {
  let version = 0;
  try {
    const row = await d.prepare(`SELECT value FROM meta WHERE key = 'schema'`).first();
    version = Number(row?.value || 0);
  } catch {
    version = 0; // No meta table yet: a new database.
  }
  for (let v = version; v < STEPS.length; v++) {
    await d.batch([
      ...STEPS[v].map((sql) => d.prepare(sql)),
      d.prepare(`INSERT INTO meta (key, value) VALUES ('schema', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`).bind(String(v + 1)),
    ]);
  }
  return STEPS.length;
}

export const now = () => new Date().toISOString();

export function parse(text, fallback) {
  if (text == null || text === '') return fallback;
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

// A brand row with its JSON fields read.
export function brandOf(row) {
  if (!row) return null;
  return {
    ...row,
    match_names: parse(row.match_names, []),
    match_domains: parse(row.match_domains, []),
    flags: parse(row.flags, []),
    groups: parse(row.groups, {}),
  };
}

export async function getBrand(env, slug) {
  return brandOf(await db(env).prepare(`SELECT * FROM brands WHERE slug = ?`).bind(slug).first());
}

export async function listBrands(env) {
  const { results } = await db(env)
    .prepare(`SELECT b.*, (SELECT count(*) FROM prompts p WHERE p.brand_id = b.id AND p.active = 1) AS prompt_count,
      (SELECT max(started_at) FROM runs r WHERE r.brand_id = b.id) AS last_run
      FROM brands b ORDER BY b.name`)
    .all();
  return results.map(brandOf);
}

export async function getPrompts(env, brandId) {
  const { results } = await db(env)
    .prepare(`SELECT id, grp, position, text FROM prompts WHERE brand_id = ? AND active = 1 ORDER BY position`)
    .bind(brandId)
    .all();
  return results;
}
