// The competitors tab: who else the answers recommend, where they beat the brand, how they are
// described, the pages that list them and not the brand ("where to get listed"), and a quick look
// at their own sites.
//
// Everything here comes from answers a run has already saved and scored, so it costs nothing extra
// in API calls: the number of competitors doesn't change how many questions are asked. The only
// extra work is the optional site check (three small fetches and a phone screenshot), run by hand.
//
// Names, descriptions, page titles and links all come from AI answers or other people's sites, so
// all of it is escaped, and only http and https links are made clickable.

import { esc, fmtDate, fmtDateTime } from '../docs/shared.js';
import { db, now, parse } from './db.js';
import { leaderboard, safeLink, groupKeys } from './dashboard.js';
import { nameKey, namePattern, domainOf, isOwnDomain } from './text.js';
import { cleanSite } from './score.js';
import { capture, cleanColour } from './screen.js';

const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);
const posText = (p) => (p == null ? '–' : p.toFixed(1));
export const TOP = 8;

const ARROWS = {
  1: '<svg class="arr" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 9.5 9.5 2.5M4 2.5h5.5V8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square"/></svg>',
  '-1': '<svg class="arr" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 2.5 9.5 9.5M9.5 4v5.5H4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square"/></svg>',
};

/* ---------- The numbers ---------- */

const list = (v) => (typeof v === 'string' ? parse(v, []) : v || []);

// The answers the standings count: scored, and from questions that don't name the brand (those
// always name it back).
export function openRows(rows, brand) {
  const g = namePattern([brand.name, ...(brand.match_names || [])]);
  const re = g ? new RegExp(g.source, 'iu') : null; // no "g" flag: test() must not carry state between rows
  return rows
    .filter((r) => r.status === 'done' && r.s_status && !(re && re.test(r.prompt_text || '')))
    .map((r) => ({ ...r, recommended: list(r.recommended), citations: list(r.citations) }));
}

// Everything the tab shows for one run (and the run before, for the change).
export function competitorsOf(rows, brand, prevRows = null) {
  const open = openRows(rows, brand);
  const board = leaderboard(open, brand);
  const prevBoard = prevRows ? leaderboard(openRows(prevRows, brand), brand) : null;
  const groups = groupKeys(brand, open).map((g) => ({ key: g, label: brand.groups?.[g] || `Group ${g}`, rows: open.filter((r) => r.grp === g) }));
  const byGroup = groups.map((g) => ({ ...g, board: leaderboard(g.rows, brand) }));

  // Descriptions and websites, gathered per name.
  const info = new Map();
  const note = (k, x) => {
    const e = info.get(k) || { descriptions: new Map(), sites: new Map() };
    if (x.description) e.descriptions.set(x.description, (e.descriptions.get(x.description) || 0) + 1);
    const site = cleanSite(x.website);
    if (site) e.sites.set(site, (e.sites.get(site) || 0) + 1);
    info.set(k, e);
  };
  for (const r of open) for (const x of r.recommended) note(x.is_brand ? '\u0000brand' : nameKey(x.name), x);
  const top = (m, n) => [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, n).map(([k]) => k);

  const entry = (e) => {
    const was = prevBoard?.list.find((x) => x.key === e.key);
    const inf = info.get(e.key);
    const positions = [];
    for (const r of open) {
      if (e.isBrand) {
        if (r.brand_named && r.brand_position != null) positions.push(r.brand_position);
      } else {
        const i = r.recommended.findIndex((x) => !x.is_brand && nameKey(x.name) === e.key);
        if (i >= 0) positions.push(i + 1);
      }
    }
    return {
      key: e.key,
      name: e.name,
      isBrand: e.isBrand,
      score: e.score,
      answers: e.answers,
      rate: pct(e.answers, board.n),
      position: positions.length ? positions.reduce((t, p) => t + p, 0) / positions.length : null,
      before: was ? { score: was.score, rate: pct(was.answers, prevBoard.n) } : null,
      groups: byGroup.map((g) => {
        const x = g.board.list.find((y) => y.key === e.key);
        return { key: g.key, label: g.label, n: g.board.n, rate: g.board.n ? pct(x?.answers || 0, g.board.n) : null };
      }),
      descriptions: inf ? top(inf.descriptions, 3) : [],
      site: inf ? top(inf.sites, 1)[0] || '' : '',
    };
  };
  const me = board.me ? entry(board.me) : { key: '\u0000brand', name: brand.name, isBrand: true, score: 0, answers: 0, rate: 0, position: null, before: null, groups: byGroup.map((g) => ({ key: g.key, label: g.label, n: g.board.n, rate: g.board.n ? 0 : null })), descriptions: [], site: (brand.match_domains || [])[0] || '' };
  const rivals = board.ranked.filter((e) => !e.isBrand).slice(0, TOP).map(entry);

  // Where to get listed: third-party pages cited in answers that name a competitor and not the
  // brand. The brand's own sites and the competitors' own sites are left out.
  const rivalSites = new Set(rivals.map((r) => r.site).filter(Boolean));
  const ownSite = (d) => isOwnDomain(d, brand.match_domains);
  const theirSite = (d) => [...rivalSites].some((s) => d === s || d.endsWith(`.${s}`));
  const pages = new Map();
  for (const r of open) {
    const others = r.recommended.filter((x) => !x.is_brand).map((x) => x.name);
    for (const c of r.citations) {
      const d = domainOf(c.url);
      if (!d || ownSite(d) || theirSite(d)) continue;
      const p = pages.get(c.url) || { url: c.url, title: c.title || '', domain: d, without: 0, with: 0, names: new Map() };
      if (r.brand_named) p.with++;
      else if (others.length) {
        p.without++;
        for (const n of others.slice(0, 5)) p.names.set(n, (p.names.get(n) || 0) + 1);
      }
      pages.set(c.url, p);
    }
  }
  const listed = [...pages.values()]
    .filter((p) => p.without > 0)
    .sort((a, b) => b.without - a.without || a.with - b.with || a.url.localeCompare(b.url))
    .slice(0, 15)
    .map((p) => ({ url: p.url, title: p.title, domain: p.domain, without: p.without, with: p.with, names: top(p.names, 3) }));

  return { n: board.n, run: null, me, rivals, groups: byGroup.map((g) => ({ key: g.key, label: g.label, n: g.board.n })), listed, described: rivals.some((r) => r.descriptions.length) || me.descriptions.length > 0 };
}

/* ---------- Site checks ---------- */

const AI_BOTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'Google-Extended'];

// Which of the AI crawlers a robots.txt shuts out of the whole site. Simple reading: a group that
// names the bot (or *) with "Disallow: /".
export function blockedBots(robots) {
  const groups = [];
  let cur = null;
  for (const raw of String(robots || '').split(/\r?\n/)) {
    const line = raw.replace(/#.*/, '').trim();
    const m = line.match(/^(user-agent|disallow|allow)\s*:\s*(.*)$/i);
    if (!m) continue;
    const k = m[1].toLowerCase();
    if (k === 'user-agent') {
      if (!cur || cur.rules.length) groups.push((cur = { agents: [], rules: [] }));
      cur.agents.push(m[2].trim().toLowerCase());
    } else if (cur) cur.rules.push({ k, v: m[2].trim() });
  }
  const blocks = (g) => g.rules.some((r) => r.k === 'disallow' && r.v === '/') && !g.rules.some((r) => r.k === 'allow' && r.v === '/');
  return AI_BOTS.filter((bot) => {
    const own = groups.find((g) => g.agents.includes(bot.toLowerCase()));
    if (own) return blocks(own);
    const star = groups.find((g) => g.agents.includes('*'));
    return star ? blocks(star) : false;
  });
}

// The schema.org types a page declares in JSON-LD.
export function schemaTypes(html) {
  const types = new Set();
  for (const m of String(html || '').matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    for (const t of m[1].matchAll(/"@type"\s*:\s*(\[[^\]]*\]|"[^"]+")/g)) {
      for (const x of t[1].matchAll(/"([^"]+)"/g)) types.add(x[1].replace(/^https?:\/\/schema\.org\//, ''));
    }
  }
  return [...types].slice(0, 12);
}

async function fetchText(url, max = 400_000) {
  try {
    const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (compatible; InsightsCheck/1.0; +https://anthonyis.uk/)' }, redirect: 'follow', cf: { cacheTtl: 0 } });
    const text = res.ok ? (await res.text()).slice(0, max) : '';
    return { ok: res.ok, status: res.status, text };
  } catch {
    return { ok: false, status: 0, text: '' };
  }
}

// Three small fetches and a phone screenshot. Kept per brand and competitor, replaced each time.
export async function checkRival(env, brand, key, name, domain) {
  const site = cleanSite(domain);
  if (!site) return { ok: false, error: 'Enter their website, for example example.co.uk.' };
  const base = `https://${site}`;
  let checks;
  if (env.INSIGHTS_FAKE_AI === '1') {
    checks = { status: 200, schema: ['Organization', 'WebSite'], llms: false, blocked: [] };
  } else {
    const [home, robots, llms] = await Promise.all([fetchText(`${base}/`), fetchText(`${base}/robots.txt`, 60_000), fetchText(`${base}/llms.txt`, 2_000)]);
    checks = { status: home.status, schema: schemaTypes(home.text), llms: llms.ok && llms.text.trim().length > 0 && !/<html/i.test(llms.text), blocked: robots.ok ? blockedBots(robots.text) : [] };
  }
  let shot = null;
  try {
    shot = await capture(env, `${base}/`, name);
  } catch (e) {
    checks.shotError = String(e.message || e).slice(0, 160);
  }
  await db(env)
    .prepare(`INSERT INTO rivals (brand_id, rkey, name, domain, checks, type, image, tint, checked_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(brand_id, rkey) DO UPDATE SET name = excluded.name, domain = excluded.domain, checks = excluded.checks,
      type = coalesce(excluded.type, rivals.type), image = coalesce(excluded.image, rivals.image), tint = coalesce(excluded.tint, rivals.tint), checked_at = excluded.checked_at`)
    .bind(brand.id, key, name.slice(0, 120), site, JSON.stringify(checks), shot?.type || null, shot?.bytes || null, shot ? cleanColour(shot.tint) : null, now())
    .run();
  return { ok: true };
}

export async function rivalSites(env, brandId) {
  const { results } = await db(env).prepare(`SELECT rkey, name, domain, checks, tint, checked_at, image IS NOT NULL AS has_image FROM rivals WHERE brand_id = ?`).bind(brandId).all();
  return new Map(results.map((r) => [r.rkey, { ...r, checks: parse(r.checks, {}) }]));
}

export async function rivalImage(env, brandId, key) {
  const r = await db(env).prepare(`SELECT type, image FROM rivals WHERE brand_id = ? AND rkey = ?`).bind(brandId, key).first();
  return r?.image ? { type: r.type, bytes: new Uint8Array(r.image) } : null;
}

/* ---------- The tab ---------- */

function change(now, before) {
  if (before == null) return '';
  const d = now - before;
  if (!d) return '<span class="chg">Same as last run</span>';
  return `<span class="chg ${d > 0 ? 'up' : 'down'}">${ARROWS[Math.sign(d)]}${d > 0 ? '+' : ''}${d} since last run</span>`;
}

function fieldPanel(c) {
  const all = [c.me, ...c.rivals].sort((a, b) => b.score - a.score || b.answers - a.answers);
  const max = Math.max(1, ...all.map((e) => e.score));
  const rows = all
    .map((e, i) => `<li class="${e.isBrand ? 'me' : ''}"><span class="rk">${i + 1}</span><span class="nm">${esc(e.name)}${e.isBrand ? ' <small>you</small>' : ''}</span><span class="sbar2"><span style="width:${Math.round((e.score / max) * 100)}%"></span></span><span class="sc">${e.score}</span><span class="rt">${e.rate}%</span></li>`)
    .join('');
  const ahead = c.rivals.filter((r) => r.score > c.me.score);
  const lead = ahead.length
    ? `${ahead.length === 1 ? `${esc(ahead[0].name)} is` : `${ahead.length} businesses are`} ahead of you. ${esc(c.rivals[0].name)} leads with a score of ${c.rivals[0].score}, named in ${c.rivals[0].rate}% of answers.`
    : `You lead the field, named in ${c.me.rate}% of answers. ${c.rivals[0] ? `${esc(c.rivals[0].name)} is closest, on ${c.rivals[0].score}.` : ''}`;
  return `<section class="summary cmp-field" aria-label="The field">
    <p class="eyebrow-d">The field, from ${c.n} answers to questions that don't name you</p>
    <p class="cmp-lead">${lead}</p>
    <ol class="field"><li class="hd"><span></span><span>Name</span><span></span><span>Score</span><span>Named in</span></li>${rows}</ol>
  </section>`;
}

function rivalCards(c) {
  return c.rivals
    .slice(0, 6)
    .map((r) => {
      const wins = r.groups.filter((g) => g.rate != null && g.n && g.rate > (c.me.groups.find((x) => x.key === g.key)?.rate ?? 0));
      return `<div class="rcard">
      <p class="lbl">${esc(r.name)}</p>
      <p class="big">${r.score}<small>/100</small></p>
      ${r.before ? `<p>${change(r.score, r.before.score)}</p>` : ''}
      <p class="ln">Named in ${r.rate}% of answers, average position ${posText(r.position)}.</p>
      <p class="ln">${wins.length ? `Ahead of you in ${wins.map((g) => esc(g.label)).join(', ')}.` : 'Not ahead of you in any group.'}</p>
      ${r.descriptions.length ? `<p class="desc">“${esc(r.descriptions[0])}”</p>` : ''}
    </div>`;
    })
    .join('');
}

function headToHead(c) {
  const all = [c.me, ...c.rivals];
  const head = c.groups.map((g) => `<th class="r">${esc(g.label)}</th>`).join('');
  const rows = all
    .map((e) => {
      const cells = e.groups
        .map((g) => {
          const mine = c.me.groups.find((x) => x.key === g.key)?.rate ?? 0;
          const beat = !e.isBrand && g.rate != null && g.rate > mine;
          return `<td class="r${beat ? ' beat' : ''}">${g.rate == null || !g.n ? '–' : `${g.rate}%`}</td>`;
        })
        .join('');
      return `<tr class="${e.isBrand ? 'me' : ''}"><td>${esc(e.name)}${e.isBrand ? ' <span class="pill own">You</span>' : ''}</td>${cells}</tr>`;
    })
    .join('');
  return `<section class="sec full"><h2>Head to head, by question group</h2>
    <p class="sec-note">How often each is named in each group of questions. Red where a competitor is named more often than you.</p>
    <div class="table-wrap"><table class="h2h"><thead><tr><th></th>${head}</tr></thead><tbody>${rows}</tbody></table></div></section>`;
}

function listedSection(c) {
  const rows = c.listed
    .map((p, i) => `<tr><td><span class="n">${i + 1}</span>${safeLink(p.url, p.title || p.url)}<span class="url">${esc(p.domain)}</span></td><td>${p.names.map(esc).join(', ')}</td><td class="r">${p.without}</td><td class="r">${p.with || '–'}</td></tr>`)
    .join('');
  return `<section class="sec full" id="listed"><h2>Where to get listed</h2>
    <p class="sec-note">Pages that AI answers cite when they recommend a competitor and leave you out. These lists and articles are where getting mentioned would count most. Competitors' own sites are left out.</p>
    <div class="table-wrap"><table><thead><tr><th>Page</th><th>Names instead of you</th><th class="r">Answers without you</th><th class="r">With you</th></tr></thead>
    <tbody>${rows || '<tr><td colspan="4" class="muted">No pages yet: every cited page that names a competitor names you too.</td></tr>'}</tbody></table></div></section>`;
}

function describedSection(c) {
  if (!c.described) {
    return `<section class="sec full"><h2>How you're described</h2><p class="muted">Descriptions come from the scorer. This run was scored before they were added: press Re-score on the AI visibility tab to add them, at a fraction of a penny per answer.</p></section>`;
  }
  const item = (e) => `<div class="desc-card${e.isBrand ? ' me' : ''}"><p class="lbl">${esc(e.name)}${e.isBrand ? ' (you)' : ''}</p>${e.descriptions.length ? `<ul>${e.descriptions.map((d) => `<li>“${esc(d)}”</li>`).join('')}</ul>` : '<p class="muted">Not described in these answers.</p>'}</div>`;
  return `<section class="sec full"><h2>How you're described, against them</h2>
    <p class="sec-note">The most common ways the answers describe each one, in the answers' own words.</p>
    <div class="desc-grid">${item(c.me)}${c.rivals.slice(0, 5).map(item).join('')}</div></section>`;
}

function sitesSection(c, sites, slug, sample) {
  const token = sample ? 'SAMPLE' : esc(slug);
  const cards = c.rivals
    .slice(0, 5)
    .map((r) => {
      const s = sites.get(r.key);
      const ch = s?.checks || {};
      const img = s?.has_image ? `<img src="/admin/brands/${esc(slug)}/rival/${encodeURIComponent(r.key)}/?t=${encodeURIComponent(s.checked_at)}" alt="${esc(r.name)} homepage on a phone" loading="lazy">` : '<div class="noshot">No screenshot yet</div>';
      const facts = s
        ? `<ul class="checks">
          <li class="${ch.schema?.length ? 'ok' : 'no'}">${ch.schema?.length ? `Schema: ${esc(ch.schema.slice(0, 4).join(', '))}` : 'No schema found on the homepage'}</li>
          <li class="${ch.llms ? 'ok' : 'no'}">${ch.llms ? 'Has an llms.txt' : 'No llms.txt'}</li>
          <li class="${ch.blocked?.length ? 'no' : 'ok'}">${ch.blocked?.length ? `Blocks ${esc(ch.blocked.join(', '))}` : 'AI crawlers allowed'}</li>
          ${ch.status && ch.status !== 200 ? `<li class="no">Homepage answered ${esc(String(ch.status))}</li>` : ''}
        </ul><p class="when">Checked ${esc(fmtDateTime(s.checked_at))}</p>`
        : '<p class="muted">Not checked yet.</p>';
      return `<div class="site-card">
        <div class="shot">${img}</div>
        <div class="site-info"><p class="lbl">${esc(r.name)}</p>${facts}
        <form class="site-form" data-save="rival-check" data-token="${token}">
          <input type="hidden" name="key" value="${esc(r.key)}"><input type="hidden" name="name" value="${esc(r.name)}">
          <label><span>Website</span><input name="domain" value="${esc(s?.domain || r.site || '')}" placeholder="example.co.uk" maxlength="80"></label>
          <button type="submit" class="ghost small">${s ? 'Check again' : 'Check their site'}</button>
          <p class="status" role="status" hidden></p>
        </form></div></div>`;
    })
    .join('');
  return `<section class="sec full"><h2>Their sites</h2>
    <p class="sec-note">A phone screenshot of each homepage, and three quick checks: schema on the homepage, an llms.txt file, and whether robots.txt shuts AI crawlers out. Run by hand; each check takes a few seconds.</p>
    <div class="sites">${cards}</div></section>`;
}

export function competitorsTab({ brand, run, rows, prevRows = null, sites = new Map(), sample = false, runLink = null }) {
  if (!run) return '<p class="empty">No finished runs yet. Competitors show here once the first run on the AI visibility tab finishes.</p>';
  const c = competitorsOf(rows, brand, prevRows);
  if (!c.n) return '<p class="empty">This run has no scored answers yet.</p>';
  const bar = `<div class="run-bar"><div class="grow">Competitors in the run of ${esc(fmtDate(run.started_at, 'long'))}<span>${c.n} answers to questions that don't name you. ${prevRows ? 'Changes are against the run before.' : 'Changes show from the second run.'}</span></div>
    <a class="ghost small" href="${sample ? '/admin/samples/ai-competitors/' : `/admin/brands/${esc(brand.slug)}/competitors/`}#listed">Where to get listed</a>${runLink ? `<a class="ghost small" href="${esc(runLink)}">See the answers</a>` : ''}</div>`;
  return [
    bar,
    fieldPanel(c),
    c.rivals.length ? `<section class="sec full"><h2>The closest competitors</h2><div class="rcards">${rivalCards(c)}</div></section>` : '',
    headToHead(c),
    listedSection(c),
    describedSection(c),
    c.rivals.length ? sitesSection(c, sites, brand.slug, sample) : '',
  ].join('\n');
}

export const COMPETITOR_CSS = `
.cmp-field .eyebrow-d { margin-bottom: 12px; }
.cmp-lead { max-width: 900px; font: 500 26px/1.35 var(--display); color: var(--on-desk); }
.field { list-style: none; margin: 28px 0 0; padding: 0; }
.field li { display: grid; grid-template-columns: 32px minmax(0, 240px) minmax(0, 1fr) 56px 80px; gap: 16px; align-items: center; padding: 10px 0; border-bottom: 1px solid #2a2a2a; font: 500 17px/1.25 var(--display); color: #cfcfcf; }
.field li.hd { padding-top: 0; font-size: 12px; letter-spacing: 0.02em; text-transform: uppercase; color: #9a9a9a; }
.field li.me { color: var(--on-desk); }
.field li.me .nm small { margin-left: 6px; padding: 2px 6px; border: 1px solid var(--blue); font-size: 11px; text-transform: uppercase; color: var(--on-desk); }
.field .rk { color: #9a9a9a; }
.field .sc, .field .rt { text-align: right; }
.sbar2 { display: block; height: 10px; background: #2a2a2a; }
.sbar2 > span { display: block; height: 100%; background: #6b6b6b; }
.field li.me .sbar2 > span { background: var(--blue); }
.rcards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.rcard { padding: 20px; background: var(--box); }
.rcard .lbl { font: 500 14px/1.2 var(--display); text-transform: uppercase; letter-spacing: 0.02em; }
.rcard .big { margin: 10px 0 6px; font: 500 48px/1 var(--display); }
.rcard .big small { font-size: 18px; color: var(--muted); }
.rcard .chg { font: 500 13px/1.3 var(--display); color: var(--muted); }
.rcard .chg.up { color: var(--red); }
.rcard .chg.down { color: #0d7a3f; }
.rcard .ln { margin-top: 8px; font: 400 15px/1.45 var(--serif); }
.rcard .desc { margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--line); font: 400 14px/1.45 var(--serif); color: var(--muted); }
.h2h td.beat { color: var(--red); font-weight: 500; }
.h2h tr.me td { font-weight: 500; }
.desc-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.desc-card { padding: 16px 20px; background: var(--box); }
.desc-card.me { outline: 2px solid var(--blue); outline-offset: -2px; }
.desc-card .lbl { font: 500 13px/1.2 var(--display); text-transform: uppercase; letter-spacing: 0.02em; }
.desc-card ul { margin: 8px 0 0; padding-left: 18px; font: 400 14px/1.5 var(--serif); }
.sites { display: grid; grid-template-columns: repeat(auto-fill, minmax(420px, 1fr)); gap: 16px; }
.site-card { display: grid; grid-template-columns: 150px minmax(0, 1fr); gap: 16px; padding: 16px; background: var(--box); }
.site-card .shot img, .site-card .noshot { display: block; width: 150px; aspect-ratio: 390 / 714; object-fit: cover; object-position: top; border: 6px solid #111; border-radius: 18px; background: #fff; }
.site-card .noshot { display: flex; align-items: center; justify-content: center; padding: 12px; font: 500 12px/1.3 var(--display); text-align: center; color: var(--muted); }
.site-card .lbl { font: 500 14px/1.2 var(--display); text-transform: uppercase; letter-spacing: 0.02em; }
.checks { margin: 10px 0 0; padding: 0; list-style: none; font: 400 14px/1.5 var(--serif); }
.checks li::before { content: ''; display: inline-block; width: 8px; height: 8px; margin-right: 8px; border-radius: 50%; background: #2fbf71; }
.checks li.no::before { background: #bdbdbd; }
.site-card .when { margin-top: 6px; font: 400 12px/1.3 var(--serif); color: var(--muted); }
.site-form { display: flex; flex-wrap: wrap; align-items: end; gap: 8px; margin-top: 12px; }
.site-form label { flex: 1 1 160px; }
.site-form label span { display: block; font: 500 12px/1.2 var(--display); color: var(--muted); }
.site-form .status { flex-basis: 100%; }
@media (max-width: 1100px) {
  .rcards, .desc-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 700px) {
  .rcards, .desc-grid { grid-template-columns: 1fr; }
  .cmp-lead { font-size: 20px; }
  .field li { grid-template-columns: 24px minmax(0, 1fr) 44px 64px; }
  .field .sbar2, .field li.hd span:nth-child(3) { display: none; }
  .site-card { grid-template-columns: 100px minmax(0, 1fr); }
  .site-card .shot img, .site-card .noshot { width: 100px; }
}
`;
