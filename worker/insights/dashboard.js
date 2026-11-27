// The AI visibility tab: the numbers from a run, the trend across runs, and every answer.
//
// summarise() turns a run's answer rows into the numbers; the render functions only draw them, so
// the samples page can feed in a canned run and get exactly the same page. Charts are plain inline
// SVG drawn here: no chart library and no scripts.
//
// Everything that came from an AI answer (text, names, quotes, titles, links) is escaped, and only
// http and https links are ever made clickable.

import { esc, fmtDate, fmtDateTime } from '../docs/shared.js';
import { parse } from './db.js';
import { nameKey, namePattern, domainOf, isOwnDomain } from './text.js';
import { isDark, cleanColour } from './screen.js';

const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);
const pctText = (n, d) => (d ? `${pct(n, d)}%` : '–');
const pos = (p) => (p == null || Number.isNaN(p) ? '–' : (Math.round(p * 10) / 10).toFixed(1));
const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const num = (n) => Number(n || 0).toLocaleString('en-GB');

export const LIMITS = [
  'API answers are close to, but not the same as, what someone sees in the ChatGPT app.',
  'Answers vary from run to run. Read the trend, not a single answer.',
];

// Only http(s) links, never passed on as a referrer or followed by search engines.
export function safeLink(url, label, cls = '') {
  let ok = false;
  try {
    const u = new URL(url);
    ok = u.protocol === 'https:' || u.protocol === 'http:';
  } catch {}
  if (!ok) return esc(label || url);
  return `<a${cls ? ` class="${cls}"` : ''} href="${esc(url)}" target="_blank" rel="noopener noreferrer nofollow">${esc(label || url)}</a>`;
}

/* ---------- Numbers ---------- */

export function groupKeys(brand, rows = []) {
  return [...new Set([...Object.keys(brand.groups || {}), ...rows.map((r) => r.grp)])].sort();
}

// rows: one per answer in the run, with its score fields (or nulls).
export function summarise(rows, brand) {
  const all = rows.map((r) => ({
    ...r,
    citations: typeof r.citations === 'string' ? parse(r.citations, []) : r.citations || [],
    recommended: typeof r.recommended === 'string' ? parse(r.recommended, []) : r.recommended || [],
    above: typeof r.above === 'string' ? parse(r.above, []) : r.above || [],
    flags: typeof r.flags === 'string' ? parse(r.flags, []) : r.flags || [],
  }));
  const count = (st) => all.filter((r) => r.status === st).length;
  const scored = all.filter((r) => r.status === 'done' && r.s_status);
  const named = scored.filter((r) => r.brand_named);
  const positioned = named.filter((r) => r.brand_position != null);
  const avg = (list) => (list.length ? list.reduce((t, r) => t + r.brand_position, 0) / list.length : null);

  const groups = groupKeys(brand, all).map((g) => {
    const s = scored.filter((r) => r.grp === g);
    const n = s.filter((r) => r.brand_named);
    return {
      key: g,
      label: brand.groups?.[g] || `Group ${g}`,
      answers: s.length,
      named: n.length,
      position: avg(n.filter((r) => r.brand_position != null)),
      ownCited: s.filter((r) => r.domain_cited).length,
    };
  });
  const A = groups.find((g) => g.key === 'A');
  const B = groups.find((g) => g.key === 'B');
  const gap = A && B && A.answers && B.answers ? pct(B.named, B.answers) - pct(A.named, A.answers) : null;

  // Who is recommended instead, counted once per answer, with how often they sit above the brand.
  const rivals = new Map();
  for (const r of scored) {
    const seen = new Set();
    r.recommended.forEach((x, i) => {
      if (x.is_brand) return;
      const k = nameKey(x.name);
      if (!k || seen.has(k)) return;
      seen.add(k);
      const e = rivals.get(k) || { name: x.name, answers: 0, above: 0, positions: [] };
      e.answers++;
      e.positions.push(i + 1);
      if (r.above.some((a) => nameKey(a) === k)) e.above++;
      rivals.set(k, e);
    });
  }
  const instead = [...rivals.values()].sort((a, b) => b.answers - a.answers || a.name.localeCompare(b.name)).slice(0, 15);

  const pages = new Map();
  const domains = new Map();
  for (const r of scored) {
    const seenD = new Set();
    for (const c of r.citations) {
      const p = pages.get(c.url) || { url: c.url, title: c.title, answers: 0, missed: 0, own: isOwnDomain(domainOf(c.url), brand.match_domains) };
      p.answers++;
      if (!r.brand_named) p.missed++;
      pages.set(c.url, p);
      const dn = domainOf(c.url);
      if (dn && !seenD.has(dn)) {
        seenD.add(dn);
        domains.set(dn, (domains.get(dn) || 0) + 1);
      }
    }
  }
  // Third-party pages behind answers that left the brand out: the lists worth getting onto.
  const missedPages = [...pages.values()].filter((p) => !p.own && p.missed).sort((a, b) => b.missed - a.missed || a.url.localeCompare(b.url)).slice(0, 3);
  const topPages = [...pages.values()].sort((a, b) => b.answers - a.answers || a.url.localeCompare(b.url)).slice(0, 15);
  const topDomains = [...domains.entries()].map(([domain, answers]) => ({ domain, answers, own: isOwnDomain(domain, brand.match_domains) }))
    .sort((a, b) => b.answers - a.answers || a.domain.localeCompare(b.domain)).slice(0, 10);

  const flags = (brand.flags || []).map((f) => {
    const hits = scored.filter((r) => r.flags.some((x) => x.key === f.key));
    return { ...f, answers: hits.length, example: hits[0]?.flags.find((x) => x.key === f.key)?.evidence || '', exampleId: hits[0]?.id };
  });

  const prompts = [];
  for (const r of all) {
    let p = prompts.find((x) => x.prompt_id === r.prompt_id);
    if (!p) prompts.push((p = { prompt_id: r.prompt_id, text: r.prompt_text, grp: r.grp, answers: [] }));
    p.answers.push(r);
  }
  for (const p of prompts) p.answers.sort((a, b) => a.attempt - b.attempt);

  return {
    total: all.length,
    done: count('done'),
    failed: count('failed'),
    cancelled: count('cancelled'),
    waiting: count('pending') + count('working'),
    scored: scored.length,
    partial: scored.filter((r) => r.s_status === 'partial').length,
    named: named.length,
    position: avg(positioned),
    ownCited: scored.filter((r) => r.domain_cited).length,
    groups,
    A,
    B,
    gap,
    median: median(positioned.map((r) => r.brand_position)),
    instead,
    topPages,
    missedPages,
    topDomains,
    flags,
    prompts,
    tokens: {
      input: all.reduce((t, r) => t + (r.input_tokens || 0), 0),
      output: all.reduce((t, r) => t + (r.output_tokens || 0), 0),
      searches: all.reduce((t, r) => t + (r.searches || 0), 0),
    },
  };
}

function median(list) {
  if (!list.length) return null;
  const s = [...list].sort((a, b) => a - b);
  return s[Math.floor((s.length - 1) / 2)];
}

/* ---------- Drawing ---------- */

// The short version, at the top: four big numbers, then where the brand wins and where to focus,
// worked out by rule from this run (no AI writing). `prev` is the run before, for the changes.
// The screenshot inside an iPhone in Safari: the status bar (tinted to the page, as Safari does),
// the page, then Safari's bottom bar with the address. Drawn in HTML and CSS, sized to the phone.
const SIGNAL = '<svg viewBox="0 0 18 12" aria-hidden="true"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>';
const WIFI = '<svg viewBox="0 0 16 12" aria-hidden="true"><path d="M8 11.5 5.6 9a3.4 3.4 0 0 1 4.8 0Z"/><path d="M3.3 6.7a6.6 6.6 0 0 1 9.4 0l-1.2 1.2a4.9 4.9 0 0 0-7 0Z"/><path d="M1 4.4a9.9 9.9 0 0 1 14 0l-1.2 1.2a8.2 8.2 0 0 0-11.6 0Z"/></svg>';
const BATTERY = '<svg viewBox="0 0 27 13" aria-hidden="true"><rect x="0.5" y="0.5" width="22" height="12" rx="3.5" fill="none" stroke="currentColor" opacity="0.4"/><rect x="2" y="2" width="19" height="9" rx="2"/><path d="M24.5 4.5v4a2 2 0 0 0 0-4Z" opacity="0.4"/></svg>';
const LOCK = '<svg viewBox="0 0 10 13" aria-hidden="true"><rect x="0.5" y="5.5" width="9" height="7" rx="1.5"/><path d="M2.5 5.5V3.8a2.5 2.5 0 0 1 5 0v1.7" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>';
const RELOAD = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M10 6a4 4 0 1 1-1.2-2.9" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M9.6 1.2v2.6H7"  fill="none" stroke="currentColor" stroke-width="1.2"/></svg>';
const BACK = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M7.5 2 3.5 6l4 4" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';
const DOTS = '<svg viewBox="0 0 12 12" aria-hidden="true"><circle cx="2" cy="6" r="1.2"/><circle cx="6" cy="6" r="1.2"/><circle cx="10" cy="6" r="1.2"/></svg>';

export function phoneFrame(screen) {
  const tint = cleanColour(screen.tint || '#ffffff');
  const host = screen.url ? domainOf(screen.url) : '';
  return `<div class="iphone"><i class="hw act" aria-hidden="true"></i><i class="hw vup" aria-hidden="true"></i><i class="hw vdn" aria-hidden="true"></i><i class="hw pwr" aria-hidden="true"></i><i class="hw cam" aria-hidden="true"></i><div class="phone-screen">
    <div class="ios-status ${isDark(tint) ? 'on-dark' : 'on-light'}" style="background:${tint}"><span class="time">9:41</span><span class="island" aria-hidden="true"></span><span class="icons">${SIGNAL}${WIFI}${BATTERY}</span></div>
    <div class="ios-page">${screen.src ? `<img src="${esc(screen.src)}" alt="${esc(`The homepage of ${host} on a phone in Safari`)}" width="390" height="714">` : ''}</div>
    <div class="ios-safari"><span class="round">${BACK}</span><span class="addr">${LOCK}<b>${esc(host)}</b>${RELOAD}</span><span class="round">${DOTS}</span><i class="home" aria-hidden="true"></i></div>
  </div></div>`;
}

// Who is named across a set of answers, the brand included, counted once per answer, most first.
// Points for where a business sits in one answer: first 100, second 85, third 70, fourth 55,
// lower 40, named but outside the list of recommendations 30, not named 0. Every business is
// scored by the same rule from the same answers, so the scores compare like for like.
export const POINTS = [100, 85, 70, 55];
const pointsFor = (pos) => (pos == null ? 30 : POINTS[pos - 1] ?? 40);

// Who is named across a set of answers, the brand included, counted once per answer, with each
// one's visibility score (its average points across all the answers). Highest score first.
export function leaderboard(rows, brand) {
  const tally = new Map();
  let mentions = 0;
  for (const r of rows) {
    const seen = new Map();
    if (r.brand_named) seen.set('\u0000brand', { name: brand.name, pos: r.brand_position ?? null });
    (r.recommended || []).forEach((x, i) => {
      const k = nameKey(x.name);
      if (!x.is_brand && k && !seen.has(k)) seen.set(k, { name: x.name, pos: i + 1 });
    });
    for (const [k, v] of seen) {
      const e = tally.get(k) || { key: k, name: v.name, answers: 0, points: 0, isBrand: k === '\u0000brand' };
      e.answers++;
      e.points += pointsFor(v.pos);
      mentions++;
      tally.set(k, e);
    }
  }
  for (const e of tally.values()) e.score = rows.length ? Math.round(e.points / rows.length) : 0;
  const byScore = (a, b) => b.score - a.score || b.answers - a.answers || (b.isBrand ? 1 : 0) - (a.isBrand ? 1 : 0) || a.name.localeCompare(b.name);
  const list = [...tally.values()].sort((a, b) => b.answers - a.answers || (b.isBrand ? 1 : 0) - (a.isBrand ? 1 : 0) || a.name.localeCompare(b.name));
  const ranked = [...tally.values()].sort(byScore);
  const me = list.find((e) => e.isBrand);
  return {
    n: rows.length, list, ranked, mentions, me,
    rank: me ? list.indexOf(me) + 1 : null,
    scoreRank: me ? ranked.indexOf(me) + 1 : null,
    leader: list.find((e) => !e.isBrand),
  };
}

// The score at the top: the brand's visibility score, its place, and the top five beside it.
function scoreBlock(board) {
  if (!board.n) return '';
  const me = board.me;
  const score = me ? me.score : 0;
  const top = board.ranked.slice(0, 5);
  if (me && !top.includes(me)) top.push(me);
  const max = Math.max(1, ...top.map((e) => e.score));
  const rows = top
    .map((e) => `<li${e.isBrand ? ' class="me"' : ''}><span class="who">${esc(e.isBrand ? 'You' : e.name)}</span><span class="sbar"><span style="width:${Math.round((e.score / max) * 100)}%"></span></span><span class="pts">${e.score}</span></li>`)
    .join('');
  const others = board.ranked.length;
  const place = me ? (board.scoreRank === 1 ? `Highest of ${others} businesses named` : `#${board.scoreRank} of ${others} businesses named`) : 'Not named in these answers';
  return `<div class="sum-score">
    <div class="score-main"><p class="eyebrow-d">Visibility score</p><p class="score"><span class="blue">${score}</span><small>/100</small></p><p class="verdict ${board.scoreRank === 1 ? 'ahead' : board.scoreRank && board.scoreRank <= 3 ? 'close' : 'behind'}">${place}</p></div>
    <ol class="score-list">${rows}</ol>
    <p class="score-how">How it works: each answer gives a business points for where it is recommended (first 100, second 85, third 70, fourth 55, lower 40, mentioned outside the list 30, left out 0), averaged over the ${plural(board.n, 'answer')} below. Every business is scored the same way, so it shows how you compare, not a grade.</p>
  </div>`;
}

// How the brand stands in one set of answers, against the businesses named in the same answers.
function standing(board) {
  if (!board.n) return { cls: '', text: 'No answers yet' };
  const { me, rank, leader, list } = board;
  const others = list.filter((e) => !e.isBrand).length;
  if (!me) return { cls: 'behind', text: leader ? `Not named. ${esc(leader.name)} leads with ${pctText(leader.answers, board.n)}` : 'Not named' };
  if (rank === 1) {
    const gap = leader ? pct(me.answers, board.n) - pct(leader.answers, board.n) : null;
    return { cls: 'ahead', text: `Most named of ${others + 1}${gap ? `, ${gap} pts ahead of ${esc(leader.name)}` : ''}` };
  }
  return { cls: rank <= 3 ? 'close' : 'behind', text: `#${rank} of ${others + 1}. ${esc(leader.name)} leads with ${pctText(leader.answers, board.n)}` };
}

export function summaryBlock(m, prev, screen = null, brand = {}) {
  if (!m.scored) return '';
  const done = (p) => p.answers.filter((x) => x.status === 'done' && x.s_status);
  const names = [brand.name, ...(brand.match_names || [])];
  // Questions that name the brand (who is ..., how much does ... charge) always name it back, so
  // the standings only count the questions that don't.
  const branded = (p) => (names.some(Boolean) ? namePattern(names)?.test(p.text) : false);
  const open = m.prompts.filter((p) => !branded(p));
  const rowsOf = (list) => list.flatMap(done);
  const all = leaderboard(rowsOf(open), brand);
  const gA = leaderboard(rowsOf(open.filter((p) => p.grp === 'A')), brand);
  const gB = leaderboard(rowsOf(open.filter((p) => p.grp === 'B')), brand);
  const share = all.mentions ? Math.round(((all.me?.answers || 0) / all.mentions) * 100) : 0;

  const change = (now, before) => {
    if (before == null || now == null) return '';
    const d = now - before;
    return `<span class="chg ${d > 0 ? 'up' : d < 0 ? 'down' : ''}">${d > 0 ? '+' : ''}${d} pts since the last run</span>`;
  };
  const prevA = prev?.na ? pct(prev.nameda, prev.na) : null;
  const prevB = prev?.nb ? pct(prev.namedb, prev.nb) : null;
  const rateOf = (b) => (b.n ? pct(b.me?.answers || 0, b.n) : null);
  const tile = (value, label, st, extra = '', cls = '') => `<div><p class="big${cls}">${value == null ? '–' : `${value}%`}</p><p class="lbl">${label}</p><p class="verdict ${st.cls}">${st.text}</p>${extra}</div>`;

  // What to do next: each one from a number in this run, with what to watch next time.
  const pagesIn = (rows, skip = new Set()) => {
    const map = new Map();
    for (const r of rows) {
      if (r.brand_named) continue;
      for (const c of r.citations || []) {
        if (isOwnDomain(domainOf(c.url), brand.match_domains) || skip.has(c.url)) continue;
        map.set(c.url, (map.get(c.url) || 0) + 1);
      }
    }
    return [...map.entries()].sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0])).slice(0, 3);
  };
  const links = (pages) => pages.map(([u, n]) => `${safeLink(u, shortUrl(u))} (${n})`).join(', ');
  const actions = [];
  const used = new Set();
  if (gA.n && gA.rank !== 1) {
    const pages = pagesIn(rowsOf(open.filter((p) => p.grp === 'A')));
    pages.forEach(([u]) => used.add(u));
    actions.push({
      title: `Win the general questions`,
      why: `Group A (${esc(brand.groups?.A || 'no modifier')}) names you in ${rateOf(gA)}% of answers. ${gA.leader ? `${esc(gA.leader.name)} leads with ${pctText(gA.leader.answers, gA.n)}.` : ''}`,
      todo: `${pages.length ? `Those answers lean most on ${links(pages)}. Get onto those pages first: ask the author to add you, or buy a placement where they sell one. ` : ''}Then make sure your homepage answers the plain question, not only the freelance one.`,
      watch: `“When buyers just ask for the best” goes up from ${rateOf(gA)}%.`,
    });
  }
  const lists = pagesIn(rowsOf(open), used);
  if (lists.length) {
    actions.push({
      title: 'Get onto the pages ChatGPT reads',
      why: `These are cited most in answers that leave you out: ${links(lists)}.`,
      todo: 'Work down the list. Each one is a page ChatGPT trusts for this topic, and a mention there is likely to carry into its answers.',
      watch: `“Of answers name you” goes up from ${rateOf(all)}%.`,
    });
  }
  const never = open.filter((p) => p.grp !== 'A' && done(p).length && !done(p).some((x) => x.brand_named));
  if (never.length) {
    actions.push({
      title: `Give ChatGPT a page to cite for ${plural(never.length, 'more question')}`,
      why: `Never named on ${never.slice(0, 3).map((p) => `“${esc(p.text)}”`).join(', ')}${never.length > 3 ? ` and ${never.length - 3} more` : ''}.`,
      todo: 'Open each prompt in Every answer below and see which pages it cites. If you offer that service, make sure one page answers that exact question in plain words and is linked from your homepage.',
      watch: `Fewer than ${plural(never.length, 'question')} with no mention of you.`,
    });
  }
  const loud = m.flags.filter((f) => f.answers && f.answers / m.scored >= 0.1).sort((x, y) => y.answers - x.answers)[0];
  if (loud) {
    actions.push({
      title: `Tackle “${esc(loud.label)}”`,
      why: `It shows in ${pctText(loud.answers, m.scored)} of answers${loud.example ? `, for example “${esc(loud.example)}”` : ''}.`,
      todo: 'Read the answers marked ⚑ in Every answer below, then answer the point on your own pages, in your words, where ChatGPT will read it.',
      watch: `“${esc(loud.label)}” shows in fewer than ${pctText(loud.answers, m.scored)} of answers (Framing flags, below).`,
    });
  }

  const always = open.filter((p) => done(p).length && done(p).every((x) => x.brand_named));
  const wins = [];
  if (always.length) wins.push(`Named every time on ${plural(always.length, 'question')}, including ${always.slice(0, 2).map((p) => `“${esc(p.text)}”`).join(' and ')}.`);
  if (m.median === 1) wins.push('First in the list whenever you are named.');
  else if (m.median) wins.push(`Usually #${m.median} in the list when named.`);
  if (m.ownCited) wins.push(`Your own site is cited in ${pctText(m.ownCited, m.scored)} of answers.`);

  const phone = screen
    ? `<figure class="phone">${phoneFrame(screen)}
        <figcaption>${screen.src ? `${esc(shortUrl(screen.url))}${screen.taken_at ? ` · ${esc(fmtDate(screen.taken_at))}` : ''}` : 'No screenshot yet'}${screen.action || ''}</figcaption></figure>`
    : '';
  const shareNote = share >= 30 ? 'Category leader level (30% and up)' : share >= 20 ? 'Strong (20 to 30%)' : share >= 10 ? 'In the running (10 to 20%)' : 'Low (under 10%)';
  return `<section class="summary${phone ? ' with-phone' : ''}" aria-label="Summary">
    ${phone}
    ${scoreBlock(all)}
    <div class="sum-nums">
      ${tile(rateOf(all), `of answers name you, on ${plural(open.length, 'question')} that don't name you first`, standing(all), '', ' blue')}
      ${tile(rateOf(gA), 'when buyers just ask for the best', standing(gA), change(rateOf(gA), prevA))}
      ${tile(rateOf(gB), 'when they ask for freelance or independent', standing(gB), change(rateOf(gB), prevB))}
      ${tile(share, 'of all the business mentions in those answers are you', { cls: share >= 20 ? 'ahead' : share >= 10 ? 'close' : 'behind', text: shareNote })}
    </div>
    <div class="sum-next">
      <h2>What to do next</h2>
      ${actions.length ? `<ol class="steps">${actions.slice(0, 4).map((x, i) => `<li><span class="n">${String(i + 1).padStart(2, '0')}</span><div class="step"><h3>${x.title}</h3><dl class="step-rows"><div><dt>Why</dt><dd>${x.why}</dd></div><div><dt>Do</dt><dd>${x.todo}</dd></div><div class="measure"><dt>Measure</dt><dd>${x.watch}</dd></div></dl></div></li>`).join('')}</ol>` : '<p class="muted">Nothing stands out in this run.</p>'}
    </div>
    ${wins.length ? `<div class="sum-wins"><h2>Where you win</h2><ol class="steps wins">${wins.map((w, i) => `<li><span class="n">${String(i + 1).padStart(2, '0')}</span><p class="win">${w}</p></li>`).join('')}</ol></div>` : ''}
    <p class="sum-note">How to read it: there is no settled industry standard yet. The fairest yardstick is the other businesses ChatGPT names in the same answers, which is what Most named and #2 of 40 mean. Published 2026 guides put category leaders at about 20 to 40% mention rate and 25 to 35% share of mentions; treat that as a rough guide only. ${esc(LIMITS[1])}</p>
  </section>`;
}

const bar = (n, d, cls = '') => `<span class="meter${cls ? ` ${cls}` : ''}" aria-hidden="true"><span style="width:${pct(n, d)}%"></span></span>`;

export function headline(m) {
  return `<dl class="totals tiles">
    <div class="t-blue"><dt>Mention rate</dt><dd>${pctText(m.named, m.scored)}</dd><p>Named in ${m.named} of ${plural(m.scored, 'answer')}</p></div>
    <div><dt>Average position when named</dt><dd>${pos(m.position)}</dd><p>1 is the first business recommended</p></div>
    <div><dt>Own site cited</dt><dd>${pctText(m.ownCited, m.scored)}</dd><p>Answers linking to the brand's own pages</p></div>
    <div${m.failed ? ' class="t-red"' : ''}><dt>Answers</dt><dd>${m.done} of ${m.total}</dd><p>${[
      m.failed ? `${m.failed} failed` : '',
      m.cancelled ? `${m.cancelled} stopped` : '',
      m.waiting ? `${m.waiting} still to ask` : '',
      m.partial ? `${m.partial} scored by rule only` : '',
    ].filter(Boolean).join(', ') || 'All asked and scored'}</p></div>
  </dl>`;
}

export function gapBlock(m) {
  if (!m.A || !m.B) return '';
  const a = pct(m.A.named, m.A.answers);
  const b = pct(m.B.named, m.B.answers);
  const words = m.gap == null ? 'Not enough answers yet.'
    : m.gap === 0 ? 'Named as often either way.'
    : m.gap > 0 ? `Named ${m.gap} points more often in group B than in group A.`
    : `Named ${-m.gap} points more often in group A than in group B.`;
  return `<section class="sec full gap">
    <h2>${eyebrow2('The main number to move')}Group A against group B</h2>
    <div class="gap-row">
      <div><p class="k">A. ${esc(m.A.label)}</p><p class="v">${pctText(m.A.named, m.A.answers)}</p>${bar(m.A.named, m.A.answers)}</div>
      <div><p class="k">B. ${esc(m.B.label)}</p><p class="v">${pctText(m.B.named, m.B.answers)}</p>${bar(m.B.named, m.B.answers)}</div>
      <div><p class="k">Gap</p><p class="v blue">${m.gap == null ? '–' : `${b - a > 0 ? '+' : ''}${b - a} pts`}</p><p class="small">${words}</p></div>
    </div>
  </section>`;
}

const eyebrow2 = (t) => `<span class="eyebrow">${esc(t)}<span class="sr">. </span></span>`;

export function groupTable(m, link) {
  const rows = m.groups
    .map((g) => `<tr><td><a href="${esc(link({ group: g.key }))}">${esc(g.key)}. ${esc(g.label)}</a></td><td class="r">${g.answers}</td><td class="r">${pctText(g.named, g.answers)}</td><td class="w-meter">${bar(g.named, g.answers)}</td><td class="r">${pos(g.position)}</td><td class="r">${pctText(g.ownCited, g.answers)}</td></tr>`)
    .join('');
  return `<section class="sec full"><h2>By group</h2><div class="table-wrap"><table>
    <thead><tr><th>Group</th><th class="r">Answers</th><th class="r">Named</th><th class="w-meter"><span class="sr">Bar</span></th><th class="r">Avg position</th><th class="r">Own site cited</th></tr></thead>
    <tbody>${rows || '<tr><td colspan="6" class="muted">No answers yet.</td></tr>'}</tbody></table></div></section>`;
}

export function insteadTable(m) {
  const rows = m.instead
    .map((r, i) => `<tr><td><span class="n">${i + 1}</span>${esc(r.name)}</td><td class="r">${r.answers}</td><td class="r">${pctText(r.answers, m.scored)}</td><td class="r">${pos(r.positions.reduce((t, p) => t + p, 0) / r.positions.length)}</td><td class="r">${r.above}</td></tr>`)
    .join('');
  return `<section class="sec full"><h2>Who is named instead</h2>
    <p class="sec-note">Businesses and people recommended in these answers, other than the brand. Counted once per answer.</p>
    <div class="table-wrap"><table>
    <thead><tr><th>Name</th><th class="r">Answers</th><th class="r">Share</th><th class="r">Avg position</th><th class="r">Above the brand</th></tr></thead>
    <tbody>${rows || '<tr><td colspan="5" class="muted">Nobody yet.</td></tr>'}</tbody></table></div></section>`;
}

export function citedTables(m) {
  const pages = m.topPages
    .map((p, i) => `<tr><td><span class="n">${i + 1}</span>${safeLink(p.url, p.title || p.url)}<span class="url">${esc(shortUrl(p.url))}</span></td><td>${p.own ? '<span class="pill own">Own site</span>' : ''}</td><td class="r">${p.answers}</td></tr>`)
    .join('');
  const domains = m.topDomains
    .map((d) => `<tr><td>${esc(d.domain)}</td><td>${d.own ? '<span class="pill own">Own site</span>' : ''}</td><td class="r">${d.answers}</td><td class="r">${pctText(d.answers, m.scored)}</td></tr>`)
    .join('');
  return `<section class="sec full"><h2>Most cited pages</h2>
    <p class="sec-note">The pages answers link to as sources, by how many answers cite them. Third-party lists here are the ones that matter.</p>
    <div class="table-wrap"><table class="cited">
    <thead><tr><th>Page</th><th></th><th class="r">Answers</th></tr></thead>
    <tbody>${pages || '<tr><td colspan="3" class="muted">No links cited yet.</td></tr>'}</tbody></table></div>
    <h3 class="sub-h">Most cited sites</h3>
    <div class="table-wrap"><table>
    <thead><tr><th>Site</th><th></th><th class="r">Answers</th><th class="r">Share</th></tr></thead>
    <tbody>${domains || '<tr><td colspan="4" class="muted">None yet.</td></tr>'}</tbody></table></div></section>`;
}

export function flagTable(m, answerHref) {
  if (!m.flags.length) return `<section class="sec full"><h2>Framing flags</h2><p class="muted">No flags set for this brand. Add them in Settings.</p></section>`;
  const rows = m.flags
    .map((f) => `<tr><td>${esc(f.label)}${f.description ? `<span class="url">${esc(f.description)}</span>` : ''}</td><td class="r">${f.answers}</td><td class="r">${pctText(f.answers, m.scored)}</td><td class="quote">${f.example ? `“${esc(f.example)}” <a href="${esc(answerHref(f.exampleId))}">Read</a>` : ''}</td></tr>`)
    .join('');
  return `<section class="sec full"><h2>Framing flags</h2><div class="table-wrap"><table>
    <thead><tr><th>Flag</th><th class="r">Answers</th><th class="r">Share</th><th>Example</th></tr></thead>
    <tbody>${rows}</tbody></table></div></section>`;
}

function shortUrl(url) {
  try {
    const u = new URL(url);
    return `${u.hostname.replace(/^www\./, '')}${u.pathname === '/' ? '' : u.pathname}`.slice(0, 90);
  } catch {
    return String(url).slice(0, 90);
  }
}

// The trend: mention rate per run, overall and for groups A and B, with the launch date marked.
export function trendChart(trend, brand) {
  // A run still being asked is left off the line until it finishes (it is in the table below).
  const points = [...trend].filter((t) => t.n && t.status !== 'running').sort((a, b) => a.started_at.localeCompare(b.started_at));
  if (points.length < 2) {
    return `<p class="muted">The trend line starts after the second run.</p>`;
  }
  const W = 1052, H = 260, L = 44, R = 16, T = 16, Bm = 36;
  const t0 = Date.parse(points[0].started_at);
  const t1 = Date.parse(points[points.length - 1].started_at);
  const launch = brand.launch_date ? Date.parse(`${brand.launch_date}T12:00:00Z`) : null;
  const lo = Math.min(t0, launch && launch < t0 ? launch : t0);
  const hi = Math.max(t1, launch && launch > t1 ? launch : t1);
  const x = (t) => L + ((t - lo) / Math.max(1, hi - lo)) * (W - L - R);
  const y = (v) => T + (1 - v / 100) * (H - T - Bm);
  const series = [
    { key: 'all', label: 'All answers', cls: 's-all', v: (p) => pct(p.named, p.n) },
    { key: 'A', label: 'Group A', cls: 's-a', v: (p) => (p.na ? pct(p.nameda, p.na) : null) },
    { key: 'B', label: 'Group B', cls: 's-b', v: (p) => (p.nb ? pct(p.namedb, p.nb) : null) },
  ];
  const grid = [0, 25, 50, 75, 100].map((v) => `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" class="g"/><text x="${L - 8}" y="${y(v) + 4}" text-anchor="end">${v}%</text>`).join('');
  const lines = series
    .map((s) => {
      const pts = points.map((p) => [x(Date.parse(p.started_at)), s.v(p)]).filter(([, v]) => v != null);
      if (!pts.length) return '';
      const d = pts.map(([px, v], i) => `${i ? 'L' : 'M'}${px.toFixed(1)},${y(v).toFixed(1)}`).join(' ');
      return `<path d="${d}" class="${s.cls}"/>${pts.map(([px, v]) => `<circle cx="${px.toFixed(1)}" cy="${y(v).toFixed(1)}" r="3.5" class="${s.cls}"/>`).join('')}`;
    })
    .join('');
  const step = Math.ceil(points.length / 8);
  const labels = points
    .map((p, i) => [p, i])
    .filter(([, i]) => i % step === 0 || i === points.length - 1)
    .map(([p, i]) => `<text x="${x(Date.parse(p.started_at)).toFixed(1)}" y="${H - 12}" text-anchor="${i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle'}">${esc(fmtDate(p.started_at))}</text>`)
    .join('');
  const mark = launch ? `<line x1="${x(launch)}" x2="${x(launch)}" y1="${T}" y2="${H - Bm}" class="launch"/><text x="${x(launch) + 6}" y="${T + 12}" class="launch-t">Launch ${esc(fmtDate(brand.launch_date))}</text>` : '';
  const summary = points.map((p) => `${fmtDate(p.started_at)}: ${pct(p.named, p.n)}%`).join(', ');
  return `<figure class="chart">
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Mention rate by run. ${esc(summary)}">${grid}${mark}${lines}${labels}</svg>
    <figcaption class="legend">${series.map((s) => `<span class="${s.cls}">${esc(s.label)}</span>`).join('')}</figcaption>
  </figure>`;
}

export function runList(trend, current, link) {
  const rows = trend
    .map((r) => `<tr${r.id === current ? ' class="here"' : ''}><td><a href="${esc(link({ run: r.id }))}">${esc(fmtDateTime(r.started_at))}</a></td><td>${esc(r.kind === 'weekly' ? 'Weekly' : r.kind === 'manual' ? 'Run now' : r.kind)}</td><td>${r.status === 'running' ? '<span class="pill sent">Running</span>' : ''}</td><td class="r">${r.n}</td><td class="r">${pctText(r.named, r.n)}</td><td class="r">${r.na ? pctText(r.nameda, r.na) : '–'}</td><td class="r">${r.nb ? pctText(r.namedb, r.nb) : '–'}</td><td class="r">${pos(r.pos)}</td></tr>`)
    .join('');
  return `<div class="table-wrap"><table class="runs">
    <thead><tr><th>Run</th><th>Kind</th><th></th><th class="r">Scored</th><th class="r">Named</th><th class="r">A</th><th class="r">B</th><th class="r">Avg position</th></tr></thead>
    <tbody>${rows}</tbody></table></div>`;
}

// Every answer in the run, one row per prompt with its attempts, filtered by group or prompt.
export function answersList(m, { group, prompt, link, answerHref }) {
  const list = m.prompts.filter((p) => (!group || p.grp === group) && (!prompt || p.prompt_id === prompt));
  const filters = `<nav class="views filters" aria-label="Filter answers">
    <a href="${esc(link({ group: null, prompt: null }))}"${!group && !prompt ? ' aria-current="page"' : ''}>All</a>
    ${m.groups.map((g) => `<a href="${esc(link({ group: g.key, prompt: null }))}"${group === g.key ? ' aria-current="page"' : ''}>${esc(g.key)}</a>`).join('')}
  </nav>`;
  const cell = (a) => {
    if (a.status !== 'done') return `<span class="pill${a.status === 'failed' ? ' overdue' : ''}" title="${esc(a.error || '')}">${esc(a.status === 'working' ? 'asking' : a.status)}</span>`;
    const label = a.brand_named ? (a.brand_position ? `#${a.brand_position}` : 'Named') : 'Not named';
    const flags = (a.flags || []).length;
    return `<a class="ans${a.brand_named ? ' yes' : ''}" href="${esc(answerHref(a.id))}">${esc(label)}${flags ? ` <b title="${flags} framing flag${flags === 1 ? '' : 's'}">${flags}⚑</b>` : ''}</a>`;
  };
  const rows = list
    .map((p) => {
      const named = p.answers.filter((a) => a.status === 'done' && a.brand_named).length;
      const done = p.answers.filter((a) => a.status === 'done').length;
      return `<tr><td class="g-key">${esc(p.grp)}</td><td><a href="${esc(link({ prompt: p.prompt_id, group: null }))}">${esc(p.text)}</a></td><td class="r">${done ? `${named} of ${done}` : '–'}</td><td class="atts">${p.answers.map(cell).join('')}</td></tr>`;
    })
    .join('');
  const excerpts = prompt
    ? list.flatMap((p) => p.answers).filter((a) => a.status === 'done' && a.text)
      .map((a) => `<li><a href="${esc(answerHref(a.id))}">Attempt ${a.attempt}</a><p>${esc(String(a.text).replace(/\s+/g, ' ').slice(0, 320))}…</p></li>`).join('')
    : '';
  return `<section class="sec full" id="answers"><h2>Every answer</h2>
    <p class="sec-note">Each prompt with its attempts. #2 means the brand was the second business recommended. Open any one to read it in full.</p>
    ${filters}
    <div class="table-wrap"><table class="answers">
    <thead><tr><th></th><th>Prompt</th><th class="r">Named</th><th>Attempts</th></tr></thead>
    <tbody>${rows || '<tr><td colspan="4" class="muted">No answers match.</td></tr>'}</tbody></table></div>
    ${excerpts ? `<ul class="excerpts">${excerpts}</ul>` : ''}
  </section>`;
}

export function methodNote(run, m, model) {
  return `<section class="fine method"><h2>Method</h2><div class="cols">
    <p>Run started ${esc(fmtDateTime(run.started_at))}${run.completed_at ? `, finished ${esc(fmtDateTime(run.completed_at))}` : ''}. Engine: ChatGPT through the OpenAI API with web search on, location United Kingdom${model ? `, model ${esc(model)}` : ''}. Each prompt asked ${plural(run.attempts, 'time')}, ${plural(m.total, 'answer')} in all, ${m.done} answered${m.failed ? `, ${m.failed} failed` : ''}.</p>
    <p>${LIMITS.map(esc).join(' ')}</p>
    <p>Usage this run: ${num(m.tokens.searches)} web searches, ${num(m.tokens.input)} input and ${num(m.tokens.output)} output tokens for the answers (scoring is extra, on a cheaper model).</p>
  </div></section>`;
}

/* ---------- The tab ---------- */

// The whole tab, from loaded data. Used by the brand page and by the samples.
export function visibilityContent({ brand, trend, run, rows = [], group = null, prompt = null, link, answerHref, progress = null, promptCount = 0, sample = false, screen = null }) {
  if (!run) return runBar({ brand, run: null, promptCount, sample }) + `<p class="empty">No runs yet. ${promptCount ? 'Press Run now for a first baseline.' : 'Add the prompt list in Settings first.'}</p>`;
  const m = summarise(rows, brand);
  const model = rows.find((r) => r.model)?.model;
  const at = trend.findIndex((r) => r.id === run.id);
  const prev = trend.slice(at + 1).find((r) => r.status === 'complete' && r.n);
  return [
    runBar({ brand, run, promptCount, progress, sample }),
    summaryBlock(m, prev, screen, brand),
    `<h2 class="detail-h">The detail</h2>`,
    headline(m),
    gapBlock(m),
    `<section class="sec full"><h2>Trend</h2>${trendChart(trend, brand)}<h3 class="sub-h">Runs</h3>${runList(trend, run.id, link)}</section>`,
    groupTable(m, link),
    insteadTable(m),
    citedTables(m),
    flagTable(m, answerHref),
    answersList(m, { group, prompt, link, answerHref }),
    methodNote(run, m, model),
  ].join('\n');
}

export function progressOf(p) {
  if (!p) return null;
  const total = Number(p.total) || 0;
  const finished = (p.done || 0) + (p.failed || 0) + (p.cancelled || 0);
  const label = p.status === 'complete'
    ? `Finished: ${p.done} answered${p.failed ? `, ${p.failed} failed` : ''}.`
    : p.waiting
      ? `${finished} of ${total} answers done${p.failed ? ` (${p.failed} failed)` : ''}. Keep this page open to speed it up, or come back later: the rest run every 5 minutes.`
      : `All answered. Scoring ${p.scoring} again…`;
  return { status: p.status, total, finished, waiting: p.waiting || 0, label, percent: total ? Math.round((finished / total) * 100) : 0 };
}

function runBar({ brand, run, promptCount, progress, sample = false }) {
  const g = progressOf(progress);
  const running = run && run.status === 'running';
  const buttons = running
    ? `<button type="button" class="ghost small" data-action="run-stop" data-token="${sample ? 'SAMPLE' : run.id}" data-label="Stop run" data-confirm="Stop this run?">Stop run</button>`
    : `<button type="button" class="ghost small primary" data-action="run-now" data-token="${sample ? 'SAMPLE' : esc(brand.slug)}" data-label="Run now" data-confirm="${esc(`Ask ${promptCount * (Number(brand.asks_per_week) || 3)} questions now?`)}" data-wait="Starting the run and asking the first questions…"${promptCount ? '' : ' disabled'}>Run now</button>
       ${run ? `<button type="button" class="ghost small" data-action="rescore" data-token="${sample ? 'SAMPLE' : run.id}" data-label="Re-score this run" data-confirm="Score every answer again?" data-wait="Queuing the answers for scoring…">Re-score this run</button>` : ''}`;
  const status = running && g
    ? `<div class="grow" ${sample ? '' : 'id="progress" '}data-run="${run.id}"><p data-text>${esc(g.label)}</p><span class="meter"><span style="width:${g.percent}%"></span></span></div>`
    : `<div class="grow">${run ? `Showing the run of ${esc(fmtDateTime(run.started_at))}` : 'No runs yet'}<span>${promptCount} prompts, each asked ${Number(brand.asks_per_week) || 3} times. Weekly run ${brand.active ? 'on' : 'off'}.</span></div>`;
  return `<div class="run-bar">${status}${buttons}</div>`;
}


/* ---------- One answer in full ---------- */

// The answer as written, escaped, with the brand's names marked. Line breaks are kept, and the
// little Markdown ChatGPT uses is tidied after escaping: **bold** and headings become bold, and
// [label](link) shows its label (every cited link is listed under the answer).
export function answerText(text, brand) {
  const safe = esc(text)
    .replace(/\*\*([^*\n]+)\*\*/g, '<b>$1</b>')
    .replace(/^#{1,6} +(.+)$/gm, '<b>$1</b>')
    .replace(/\[([^\]\n]+)\]\((?:https?:)[^)\s]*\)/g, '$1');
  const re = namePattern([brand.name, ...(brand.match_names || [])].map(esc));
  return re ? safe.replace(re, (m) => `<mark>${m}</mark>`) : safe;
}

export function answerBody(a, brand, { back }) {
  const citations = typeof a.citations === 'string' ? parse(a.citations, []) : a.citations || [];
  const recommended = typeof a.recommended === 'string' ? parse(a.recommended, []) : a.recommended || [];
  const flags = typeof a.flags === 'string' ? parse(a.flags, []) : a.flags || [];
  const labels = new Map((brand.flags || []).map((f) => [f.key, f.label]));
  const facts = [
    ['Group', `${a.grp}. ${brand.groups?.[a.grp] || ''}`],
    ['Attempt', String(a.attempt)],
    ['Asked', a.asked_at ? fmtDateTime(a.asked_at) : '–'],
    ['Model', a.model || '–'],
    ['Web searches', String(a.searches || 0)],
    ['Tokens', `${num(a.input_tokens)} in, ${num(a.output_tokens)} out`],
  ];
  const scoreRows = a.s_status
    ? [
      ['Brand named', a.brand_named ? 'Yes' : 'No'],
      ['Position', a.brand_position ? `#${a.brand_position} of ${recommended.length}` : a.brand_named ? 'Named, not in the list of recommendations' : '–'],
      ['Named above it', (typeof a.above === 'string' ? parse(a.above, []) : a.above || []).join(', ') || '–'],
      ['Own site cited', a.domain_cited ? 'Yes' : 'No'],
      ['Scored', `${a.s_status === 'partial' ? 'By rule only (the model step failed' + (a.s_error ? `: ${a.s_error}` : '') + ')' : 'By rule and model'}, scorer version ${a.s_version || '–'}`],
    ]
    : [['Scored', 'Not yet']];
  return `
  <h2 class="answer-q">${eyebrow2('Answer')}${esc(a.prompt_text)}</h2>
  <dl class="facts">${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
  ${a.status !== 'done' ? `<p class="status error">${esc(a.status === 'failed' ? `Failed: ${a.error || 'no reason given'}` : `Status: ${a.status}`)}</p>` : ''}
  <section class="sec"><h2>Scoring</h2><div>
    <table class="kv"><tbody>${scoreRows.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table>
    ${flags.length ? `<h3 class="sub-h">Framing flags</h3><ul class="boxes">${flags.map((f) => `<li class="box"><div><h3>${esc(labels.get(f.key) || f.key)}</h3><p>“${esc(f.evidence)}”</p></div></li>`).join('')}</ul>` : ''}
    ${recommended.length ? `<h3 class="sub-h">Recommended, in order</h3><ol class="recs">${recommended.map((r) => `<li${r.is_brand ? ' class="brand"' : ''}>${esc(r.name)}</li>`).join('')}</ol>` : ''}
  </div></section>
  ${a.text ? `<section class="sec full"><h2>The answer in full</h2><div class="answer-text">${answerText(a.text, brand)}</div></section>` : ''}
  <section class="sec full"><h2>Cited links</h2>${citations.length ? `<ol class="links">${citations.map((c) => `<li>${safeLink(c.url, c.title || c.url)}<span class="url">${esc(shortUrl(c.url))}</span></li>`).join('')}</ol>` : '<p class="muted">No links cited.</p>'}</section>
  <p><a class="ghost" href="${esc(back)}">Back to the run</a></p>`;
}

export const DASH_STYLES = `
.summary { padding: 40px; background: var(--desk); color: var(--on-desk); }
.summary h2 { margin-bottom: 16px; font-size: 16px; line-height: 1; text-transform: uppercase; }
.summary.with-phone { display: grid; grid-template-columns: 240px minmax(0, 1fr); grid-template-areas: "phone score" "phone nums" "phone next" "phone wins" "phone note"; column-gap: 48px; align-items: start; }
.summary.with-phone .phone { grid-area: phone; }
.summary.with-phone .sum-nums { grid-area: nums; grid-template-columns: 1fr 1fr; }
.summary.with-phone .sum-next { grid-area: next; }
.summary.with-phone .sum-wins { grid-area: wins; }
.summary.with-phone .sum-note { grid-area: note; }
.phone { margin: 0; position: sticky; top: 24px; }
/* The handset: a metal band, a black bezel and the side buttons (action button and volume on the
   left, power and camera control on the right), in proportion to its width. The screen inside is
   sized in units of its own width (1cqw = 1/100 of the screen), so it scales as one piece.
   The phone, in units of its own width (1cqw = 1/100 of the screen), so it scales as one piece.
   iPhone 390 by 844: status bar 47, page 714, Safari bar 83. */
.iphone { position: relative; padding: 3.2%; border-radius: 15.5% / 7.2%; background: linear-gradient(135deg, #8d8f93 0%, #4b4d51 18%, #2e3034 50%, #55575b 82%, #9a9ca0 100%); box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.25), inset 0 0 0 2px rgba(0, 0, 0, 0.6), 0 24px 48px rgba(0, 0, 0, 0.55); }
.iphone::before { content: ""; position: absolute; inset: 1.4%; border-radius: 14.5% / 6.7%; background: #050505; }
.iphone .hw { position: absolute; width: 1.6%; border-radius: 1px; background: linear-gradient(90deg, #3a3c40, #8a8c90 50%, #3a3c40); }
.iphone .act { left: -1.3%; top: 15%; height: 3.6%; }
.iphone .vup { left: -1.3%; top: 22.5%; height: 7%; }
.iphone .vdn { left: -1.3%; top: 31%; height: 7%; }
.iphone .pwr { right: -1.3%; top: 24%; height: 11%; }
.iphone .cam { right: -1%; top: 58%; height: 6.5%; width: 1.2%; }
.phone-screen { position: relative; container-type: inline-size; display: flex; flex-direction: column; overflow: hidden; aspect-ratio: 390 / 844; border-radius: 13.2% / 6.1%; background: #ffffff; }
.ios-status { position: relative; flex: none; height: 12.05cqw; display: flex; align-items: center; justify-content: space-between; padding: 1.5cqw 7.5cqw 0 9cqw; font: 600 4.3cqw/1 -apple-system, "SF Pro Text", system-ui, sans-serif; }
.ios-status.on-light { color: #000000; }
.ios-status.on-dark { color: #ffffff; }
.ios-status .island { position: absolute; left: 50%; top: 2.8cqw; width: 31cqw; height: 9.2cqw; margin-left: -15.5cqw; border-radius: 6cqw; background: #000000; }
.ios-status .icons { display: flex; align-items: center; gap: 1.4cqw; }
.ios-status svg { display: block; height: 3.1cqw; width: auto; fill: currentColor; }
.ios-status svg:last-child { height: 3.4cqw; }
.ios-page { flex: 1 1 auto; min-height: 0; overflow: hidden; background: #f4f4f4; }
.ios-page img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: top; }
.ios-safari { position: relative; flex: none; height: 21.3cqw; display: flex; align-items: flex-start; gap: 2cqw; padding: 2.6cqw 3.6cqw 0; background: rgba(246, 246, 246, 0.96); border-top: 0.3cqw solid rgba(0, 0, 0, 0.08); color: #000000; }
.ios-safari .round { flex: none; display: grid; place-items: center; width: 11.3cqw; height: 11.3cqw; border-radius: 50%; background: #ffffff; box-shadow: 0 0.4cqw 1.5cqw rgba(0, 0, 0, 0.12); }
.ios-safari .round svg { width: 3.6cqw; height: 3.6cqw; fill: currentColor; }
.ios-safari .addr { flex: 1 1 auto; min-width: 0; display: flex; align-items: center; justify-content: center; gap: 1.6cqw; height: 11.3cqw; padding: 0 3cqw; border-radius: 6cqw; background: #ffffff; box-shadow: 0 0.4cqw 1.5cqw rgba(0, 0, 0, 0.12); font: 500 3.9cqw/1 -apple-system, "SF Pro Text", system-ui, sans-serif; }
.ios-safari .addr b { overflow: hidden; font-weight: 500; white-space: nowrap; text-overflow: ellipsis; }
.ios-safari .addr svg { flex: none; width: 2.6cqw; height: 3.4cqw; fill: currentColor; }
.ios-safari .addr svg:last-child { width: 3.2cqw; height: 3.2cqw; fill: none; }
.ios-safari .home { position: absolute; left: 50%; bottom: 2.2cqw; width: 34cqw; height: 1.3cqw; margin-left: -17cqw; border-radius: 1cqw; background: #000000; }
.phone figcaption { margin-top: 12px; font: 500 12px/1.4 var(--display); letter-spacing: 0.02em; color: #9a9a9a; text-align: center; overflow-wrap: anywhere; }
.phone figcaption button { display: block; margin: 8px auto 0; padding: 6px 10px; border: 1px solid #393939; background: none; color: #cfcfcf; font: 500 11px/1 var(--display); cursor: pointer; }
.phone figcaption button:hover { border-color: #cfcfcf; }
.sum-nums { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 32px; padding-bottom: 40px; border-bottom: 1px solid #393939; }
.sum-nums .big { font: 500 88px/0.95 var(--display); letter-spacing: -0.01em; }
.sum-nums .big.blue { color: var(--blue); }
.sum-nums .lbl { margin-top: 12px; font: 500 15px/1.3 var(--display); color: #cfcfcf; }
.sum-nums .verdict { margin-top: 12px; padding-left: 12px; border-left: 3px solid #6b6b6b; font: 500 13px/1.35 var(--display); color: var(--on-desk); }
.sum-nums .verdict.ahead { border-color: #2fbf71; }
.sum-nums .verdict.close { border-color: #f2b632; }
.sum-nums .verdict.behind { border-color: #ff5a5a; }
.sum-nums .chg { display: inline-block; margin-top: 8px; font: 500 12px/1 var(--display); letter-spacing: 0.02em; color: #9a9a9a; }
.sum-nums .chg.up { color: #6fd08c; }
.sum-nums .chg.down { color: #ff7a7a; }
.sum-next { padding-top: 32px; }
.steps { list-style: none; margin: 0; padding: 0; border-top: 1px solid #393939; }
.steps li { display: grid; grid-template-columns: 72px minmax(0, 1fr); column-gap: 16px; padding: 28px 0; border-bottom: 1px solid #393939; }
.steps .n { font: 500 38px/1 var(--display); color: var(--blue); }
.steps h3 { margin-bottom: 16px; font-size: 22px; line-height: 1.25; color: var(--on-desk); }
.step-rows { margin: 0; }
.step-rows > div { display: grid; grid-template-columns: 96px minmax(0, 1fr); gap: 16px; padding: 12px 0; border-top: 1px solid #2a2a2a; }
.step-rows dt { padding-top: 3px; font: 500 12px/1.2 var(--display); letter-spacing: 0.02em; text-transform: uppercase; color: #9a9a9a; }
.step-rows dd { margin: 0; color: #cfcfcf; }
.step-rows .measure dd { font: 500 15px/1.4 var(--display); color: var(--on-desk); }
.steps.wins li { align-items: baseline; padding: 16px 0; }
.steps.wins .n { font-size: 26px; }
.steps .win { font: 500 16px/1.4 var(--display); color: var(--on-desk); }
.sum-score { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr); grid-template-areas: "main list" "how how"; gap: 16px 40px; padding-bottom: 40px; margin-bottom: 40px; border-bottom: 1px solid #393939; }
.summary.with-phone .sum-score { grid-area: score; }
.score-main { grid-area: main; }
.eyebrow-d { font: 500 14px/1 var(--display); letter-spacing: 0.02em; text-transform: uppercase; color: #9a9a9a; }
.score { margin-top: 12px; font: 500 120px/0.9 var(--display); letter-spacing: -0.02em; }
.score .blue { color: var(--blue); }
.score small { margin-left: 6px; font-size: 32px; color: #9a9a9a; letter-spacing: 0; }
.sum-score .verdict { margin-top: 16px; padding-left: 12px; border-left: 3px solid #6b6b6b; font: 500 14px/1.35 var(--display); }
.sum-score .verdict.ahead { border-color: #2fbf71; }
.sum-score .verdict.close { border-color: #f2b632; }
.sum-score .verdict.behind { border-color: #ff5a5a; }
.score-list { grid-area: list; align-self: end; list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.score-list li { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr) 32px; align-items: center; gap: 12px; font: 500 14px/1.2 var(--display); color: #cfcfcf; }
.score-list .who { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.score-list .sbar { display: block; height: 8px; background: #2a2a2a; }
.score-list .sbar > span { display: block; height: 100%; background: #8a8a8a; }
.score-list .pts { text-align: right; }
.score-list li.me { color: var(--on-desk); }
.score-list li.me .sbar > span { background: var(--blue); }
.score-how { grid-area: how; font: 500 12px/1.45 var(--display); letter-spacing: 0.02em; color: #9a9a9a; }
.summary a { color: var(--on-desk); }
.sum-wins { padding-top: 32px; }
.sum-wins ul { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 6px; color: #cfcfcf; }
.summary .muted { color: #9a9a9a; }
.sum-note { margin-top: 24px; font: 500 12px/1.4 var(--display); letter-spacing: 0.02em; color: #9a9a9a; }
.detail-h { padding-top: 16px; font-size: 22px; line-height: 1.3; text-transform: uppercase; }
/* Laptop widths with the phone beside: the two lists stack so neither gets squeezed. */
@media (max-width: 1240px) {
  .sum-score { grid-template-columns: 1fr; grid-template-areas: "main" "list" "how"; }
  .score { font-size: 100px; }
  .summary.with-phone .sum-nums .big { font-size: 72px; }
}
@media (max-width: 900px) {
  .summary { margin-inline: -16px; padding: 24px 16px; }
  .summary.with-phone { display: block; }
  .phone { position: static; width: 180px; margin: 0 auto 24px; }
  .sum-nums { grid-template-columns: 1fr 1fr; gap: 24px 16px; padding-bottom: 24px; }
  .sum-nums .big { font-size: 52px; }
  .sum-nums .lbl { font-size: 13px; }
  .steps li { grid-template-columns: 40px minmax(0, 1fr); column-gap: 12px; }
  .steps .n { font-size: 28px; }
  .steps.wins .n { font-size: 22px; }
  .step-rows > div { grid-template-columns: 1fr; gap: 4px; }
  .sum-score { grid-template-columns: 1fr; grid-template-areas: "main" "list" "how"; padding-bottom: 24px; margin-bottom: 24px; }
  .score { font-size: 88px; }
  .sum-next, .sum-wins { padding-top: 24px; }
}
.meter { display: block; width: 100%; height: 6px; background: var(--line); }
.meter > span { display: block; height: 100%; background: var(--blue); }
td.w-meter, th.w-meter { width: 22%; }
td.w-meter .meter { margin-top: 6px; }
.gap-row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.gap-row > div { padding: 24px; background: var(--box); display: flex; flex-direction: column; gap: 8px; }
.gap-row .k { font: 500 14px/1.3 var(--display); color: var(--muted); }
.gap-row .v { font: 500 38px/1 var(--display); }
.gap-row .v.blue { color: var(--blue); }
.gap-row .small { font: 500 13px/1.4 var(--display); color: var(--muted); }
.url { display: block; margin-top: 2px; font-size: 12px; color: var(--muted); overflow-wrap: anywhere; }
table.cited a, .links a { color: var(--ink); }
.pill.own { border-color: var(--blue); color: var(--blue); }
td.quote { font: 400 13px/1.5 var(--serif); }
td.quote a { font: 500 12px/1 var(--display); }
.chart { margin: 0; }
.chart svg { display: block; width: 100%; height: auto; font: 500 12px var(--display); fill: var(--muted); }
.chart .g { stroke: var(--line); stroke-width: 1; }
.chart path { fill: none; stroke-width: 2; }
.chart circle { stroke: none; }
.chart .s-all { stroke: var(--blue); fill: var(--blue); }
.chart path.s-all { fill: none; }
.chart .s-a { stroke: var(--ink); fill: var(--ink); }
.chart path.s-a { fill: none; }
.chart .s-b { stroke: #8a8a8a; fill: #8a8a8a; }
.chart path.s-b { fill: none; stroke-dasharray: 5 4; }
.chart .launch { stroke: var(--red); stroke-width: 1; stroke-dasharray: 3 3; }
.chart .launch-t { fill: var(--red); }
.legend { display: flex; gap: 24px; margin-top: 8px; font: 500 13px/1 var(--display); }
.legend span::before { content: ""; display: inline-block; width: 18px; height: 2px; margin: 0 8px 4px 0; vertical-align: middle; background: currentColor; }
.legend .s-all { color: var(--blue); }
.legend .s-a { color: var(--ink); }
.legend .s-b { color: #8a8a8a; }
table.runs tr.here td { background: var(--box); }
.filters { margin-bottom: 16px; }
table.answers td.g-key { width: 24px; color: var(--muted); }
td.atts { white-space: nowrap; }
.ans, td.atts .pill { display: inline-block; margin: 0 6px 4px 0; padding: 4px 8px; border: 1px solid var(--line); font: 500 12px/1 var(--display); text-decoration: none; color: var(--muted); }
.ans.yes { border-color: var(--blue); color: var(--blue); }
.ans b { font-weight: 500; color: var(--red); }
.excerpts { list-style: none; margin: 24px 0 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
.excerpts li { padding: 12px; background: var(--box); }
.excerpts a { font: 500 14px/1.3 var(--display); }
.excerpts p { margin-top: 4px; }
.answer-q { font-size: 28px; line-height: 1.15; text-transform: uppercase; }
.answer-text b { font-family: var(--display); font-weight: 500; }
.answer-text { white-space: pre-wrap; overflow-wrap: anywhere; font-size: 15px; }
mark { background: #fce233; color: inherit; padding: 0 2px; }
.recs { margin: 0; padding-left: 24px; font: 500 14px/1.6 var(--display); }
.recs li.brand { color: var(--blue); }
.links { margin: 0; padding-left: 24px; display: flex; flex-direction: column; gap: 8px; font: 500 14px/1.3 var(--display); }
.method .cols p + p { margin-top: 1em; }
@media (max-width: 900px) {
  .gap-row { grid-template-columns: 1fr; }
  .gap-row > div { padding: 16px; }
  .gap-row .v { font-size: 28px; }
  td.w-meter, th.w-meter { display: none; }
  td.atts { white-space: normal; }
}
`;
