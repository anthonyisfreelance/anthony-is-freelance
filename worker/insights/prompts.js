// A brand's prompt list, edited as plain text in groups:
//
//   A. Recommendation, no modifier
//   1. Who is the best Shopify designer in the UK?
//   2. Recommend a Shopify expert in the UK
//   B. Same question with freelance or independent
//   3. Best freelance Shopify designer UK
//
// A group line is one capital letter, a full stop (or bracket) and the group's name. A prompt line
// is numbered ("1." or "1)") or a bullet ("- "). The numbers are only for reading: order comes from
// the list. Anything else is skipped and reported, so a stray note never becomes a prompt.
//
// Groups A and B are compared on the dashboard (no modifier against freelance or independent).

import { db, now } from './db.js';

const GROUP = /^([A-Z])[.)]\s+(.+)$/;
const PROMPT = /^(?:\d+[.)]|[-*•])\s+(.+)$/;
// D1 allows 50 queries per request on the free plan, and saving a list takes one per prompt plus two.
export const MAX_PROMPTS = 45;
export const MAX_LENGTH = 500;

export function parsePromptList(text) {
  const groups = {};
  const prompts = [];
  const skipped = [];
  let current = '';
  for (const raw of String(text || '').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const g = line.match(GROUP);
    if (g && !PROMPT.test(line)) {
      current = g[1];
      groups[current] = g[2].trim().slice(0, 120);
      continue;
    }
    const p = line.match(PROMPT);
    if (p && current) {
      const body = p[1].trim().slice(0, MAX_LENGTH);
      if (body && !prompts.some((x) => x.text === body)) prompts.push({ grp: current, text: body });
      continue;
    }
    skipped.push(line.slice(0, 120));
  }
  return { groups, prompts: prompts.slice(0, MAX_PROMPTS), skipped, tooMany: prompts.length > MAX_PROMPTS };
}

export function formatPromptList(groups, prompts) {
  const out = [];
  let n = 0;
  let last = null;
  for (const p of prompts) {
    if (p.grp !== last) {
      if (out.length) out.push('');
      out.push(`${p.grp}. ${groups[p.grp] || ''}`.trim());
      last = p.grp;
    }
    out.push(`${++n}. ${p.text}`);
  }
  return out.join('\n');
}

// Saves a new list. A prompt whose wording is unchanged keeps its id, so its history carries on;
// removed prompts are switched off, not deleted, because saved answers point at them.
export async function savePromptList(env, brand, parsed) {
  const d = db(env);
  const { results: existing } = await d.prepare(`SELECT id, text, active FROM prompts WHERE brand_id = ?`).bind(brand.id).all();
  const byText = new Map(existing.map((p) => [p.text, p]));
  const stmts = [d.prepare(`UPDATE prompts SET active = 0 WHERE brand_id = ?`).bind(brand.id)];
  const at = now();
  let kept = 0;
  parsed.prompts.forEach((p, i) => {
    const old = byText.get(p.text);
    if (old) {
      if (old.active) kept++;
      stmts.push(d.prepare(`UPDATE prompts SET grp = ?, position = ?, active = 1 WHERE id = ?`).bind(p.grp, i + 1, old.id));
    } else {
      stmts.push(d.prepare(`INSERT INTO prompts (brand_id, grp, position, text, active, created_at) VALUES (?, ?, ?, ?, 1, ?)`).bind(brand.id, p.grp, i + 1, p.text, at));
    }
  });
  stmts.push(d.prepare(`UPDATE brands SET groups = ?, updated_at = ? WHERE id = ?`).bind(JSON.stringify(parsed.groups), at, brand.id));
  await d.batch(stmts);
  const off = existing.filter((p) => p.active).length - kept;
  return { saved: parsed.prompts.length, removed: off };
}
