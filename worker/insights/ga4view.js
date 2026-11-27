// The GA4 tab and the GA4 report sheet (phase 3). Drawn from an audit's stored totals
// (audit.js), so the tab, the report and its PDF all show the same numbers.
//
// Everything from GA4 and Search Console (page paths, search queries, source names) is escaped.

import { esc, fmtDate, fmtDateTime, masthead, eyebrow, legalFooter, shell, topBar, downloadLink, backLink } from '../docs/shared.js';
import { RATINGS, THRESHOLDS, numberLabels } from './audit.js';

const isShared = (r) => r.status !== 'draft' && !r.withdrawn_at;
const num = (n) => Math.round(Number(n) || 0).toLocaleString('en-GB');
const money = (n, cur = 'GBP') => {
  try {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(Number(n) || 0);
  } catch {
    return `${num(n)} ${cur}`;
  }
};
const rate = (conv, sessions) => (sessions ? (conv / sessions) * 100 : 0);
const rateText = (r) => `${r.toFixed(2)}%`;
const LEVEL = { ok: ['OK', ''], care: ['Use with care', 'care'], bad: ['Not reliable', 'bad'] };

// A count's change as a percentage, a rate's as points. Empty without a comparison.
function change(now, before, { points = false, lowerBetter = false, unit = ' pts', dp = 2 } = {}) {
  if (before == null || now == null) return null;
  if (points) {
    const d = Math.round((now - before) * 10 ** dp) / 10 ** dp;
    return { text: `${d > 0 ? '+' : ''}${d.toFixed(dp)}${unit}`, dir: d === 0 ? 0 : (d > 0) !== lowerBetter ? 1 : -1 };
  }
  if (!before) return now ? { text: 'New', dir: 1 } : null;
  const d = Math.round(((now - before) / before) * 100);
  return { text: `${d > 0 ? '+' : ''}${d}%`, dir: d === 0 ? 0 : (d > 0) !== lowerBetter ? 1 : -1 };
}
const chip = (c, cls = 'd') => (c ? ` <span class="${cls} ${c.dir > 0 ? 'up' : c.dir < 0 ? 'down' : ''}">${esc(c.text)}</span>` : '');

export function compareText(x, brand = {}) {
  const span = `${fmtDate(x.period.start, 'long')} to ${fmtDate(x.period.end, 'long')}`;
  if (!x.compare) return `${span}.`;
  if (brand.launch_date && x.period.start === brand.launch_date && x.compare.kind === 'year') {
    const months = Math.max(1, Math.round(x.period.days / 30.4));
    const m = (d) => new Date(`${d}T12:00:00Z`).toLocaleDateString('en-GB', { month: 'long', timeZone: 'UTC' });
    return `Comparing the ${months} month${months === 1 ? '' : 's'} since launch, ${m(x.period.start)} to ${m(x.period.end)}, with the same period the year before.`;
  }
  return `${span}, compared with ${x.compare.kind === 'year' ? 'the same period the year before' : 'the period before'} (${fmtDate(x.compare.start, 'long')} to ${fmtDate(x.compare.end, 'long')}).`;
}

const since = (x) => (x.compare ? (x.compare.kind === 'year' ? 'on last year' : 'on the period before') : '');

/* ---------- Plain words for the numbers ---------- */

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const parts = (d) => {
  const t = new Date(`${d}T12:00:00Z`);
  return { d: t.getUTCDate(), m: MONTHS[t.getUTCMonth()], y: t.getUTCFullYear() };
};
// "29 AUG TO 26 NOV 2026", with both years when they differ.
export function rangeCaps(start, end) {
  const a = parts(start);
  const b = parts(end);
  return a.y === b.y ? `${a.d} ${a.m} TO ${b.d} ${b.m} ${b.y}` : `${a.d} ${a.m} ${a.y} TO ${b.d} ${b.m} ${b.y}`;
}

// On the cards, a change under 100 reads as "12 fewer", not as a percentage, which overstates small
// numbers. The headline sentence switches at 30.
const SMALL = 100;
const HEADLINE_SMALL = 30;
const ref = (x) => (x.compare?.kind === 'year' ? 'last year' : 'before');

// A change in words, with whether it's good: { text, cls } or null without a comparison.
export function changeWords(now, before, x, { kind = 'count', lowerBetter = false } = {}) {
  if (!x.compare || before == null || now == null) return null;
  const r = ref(x);
  const good = (d) => (d === 0 ? '' : (d > 0) !== lowerBetter ? 'good' : 'bad');
  if (kind === 'rate') {
    const d = Math.round((now - before) * 100) / 100;
    if (Math.abs(d) < 0.05) return { text: `Same as ${r} (${before.toFixed(1)}%)`, cls: '' };
    return { text: `${d > 0 ? 'Up' : 'Down'} from ${before.toFixed(1)}%${r === 'last year' ? ' last year' : ''}`, cls: good(d) };
  }
  const fmt = kind === 'money' ? (v) => money(v, x.currency) : num;
  const d = now - before;
  if (kind === 'count' && Math.max(now, before) < SMALL) {
    if (d === 0) return { text: `Same as ${r} (${num(before)})`, cls: '' };
    return { text: `${num(Math.abs(d))} ${d > 0 ? 'more' : 'fewer'} than the ${num(before)} ${r}`, cls: good(d) };
  }
  if (!before) return { text: `None ${r}`, cls: good(d) };
  const pc = Math.round((d / before) * 100);
  if (pc === 0) return { text: `Same as ${r} (${fmt(before)})`, cls: '' };
  return { text: `${pc > 0 ? 'Up' : 'Down'} ${Math.abs(pc)}% from ${fmt(before)}${r === 'last year' ? ' last year' : ''}`, cls: good(d) };
}

const fraction = (p) => {
  if (p >= 0.95) return 'Almost all';
  if (Math.abs(p - 0.5) < 0.04) return 'Half';
  if (Math.abs(p - 1 / 3) < 0.03) return 'A third';
  if (Math.abs(p - 0.25) < 0.03) return 'A quarter';
  if (Math.abs(p - 2 / 3) < 0.03) return 'Two thirds';
  if (Math.abs(p - 0.75) < 0.03) return 'Three quarters';
  return `${Math.round(p * 100)}%`;
};
const oneIn = (sessions, conv) => (conv ? Math.max(1, Math.round(sessions / conv)) : 0);
const ordinal = (n) => `${n}${n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th'}`;
const words = (shop) => (shop ? { noun: 'orders', one: 'order', act: 'bought', did: 'placed an order' } : { noun: 'leads', one: 'lead', act: 'got in touch', did: 'sent an enquiry' });

// The best source: at least 20 visits and 3 leads (or orders), and at least twice the site's rate.
function bestSource(x) {
  const site = x.totals.now.sessions ? x.totals.now.conv / x.totals.now.sessions : 0;
  return (x.sources || [])
    .filter((e) => e.name !== 'Unknown' && e.sessions >= 20 && e.conv >= 3 && e.conv / e.sessions >= site * 2)
    .sort((a, b) => b.conv / b.sessions - a.conv / a.sessions)[0] || null;
}

// One or two sentences on what the period says, from fixed rules (never generated text).
export function headline(x) {
  const t = x.totals;
  const w = words(x.goal.shop);
  if (!t.now.sessions) return 'No visits were recorded in this period.';
  const out = [];
  if (x.check.rating === 'unreliable') out.push('The data check found serious problems, so treat these numbers as rough.');
  else if (x.check.rating === 'care') out.push('The data check found something to watch, so read these numbers with care.');
  const rNow = rate(t.now.conv, t.now.sessions);
  if (t.before && t.before.sessions) {
    const rWas = rate(t.before.conv, t.before.sessions);
    const sv = Math.round(((t.now.sessions - t.before.sessions) / t.before.sessions) * 100);
    const up = rNow > rWas + 0.05;
    const down = rNow < rWas - 0.05;
    const lead = sv < 0 && up ? 'Fewer visitors, but better ones.'
      : sv > 0 && up ? 'More visitors, and better ones.'
      : sv > 0 && down ? `More visitors, but fewer of them ${w.act}.`
      : sv < 0 && down ? `A quieter period, and fewer visitors ${w.act}.`
      : sv > 0 ? 'More visitors, converting as before.' : sv < 0 ? 'Fewer visitors, converting as before.' : 'A steady period.';
    const vis = sv < 0 ? `Visits fell ${-sv}%` : sv > 0 ? `Visits rose ${sv}%` : 'Visits held steady';
    let conv;
    if (Math.max(t.now.conv, t.before.conv) < HEADLINE_SMALL) conv = t.now.conv === t.before.conv ? `${w.noun} held at ${t.now.conv}` : `${w.noun} went from ${t.before.conv} to ${t.now.conv}`;
    else {
      const cv = t.before.conv ? Math.round(((t.now.conv - t.before.conv) / t.before.conv) * 100) : 100;
      conv = cv < 0 && sv < 0 && -cv < -sv ? `${w.noun} only ${-cv}%` : cv < 0 ? `${w.noun} fell ${-cv}%` : cv > 0 ? `${w.noun} rose ${cv}%` : `${w.noun} held steady`;
    }
    const so = up ? `, so more of your visitors ${w.act}` : down ? `, so fewer of your visitors ${w.act}` : '';
    out.push(lead, `${vis} and ${conv}${so}.`);
  } else {
    out.push(`${num(t.now.sessions)} visits and ${num(t.now.conv)} ${w.noun}: 1 in every ${oneIn(t.now.sessions, t.now.conv) || '–'} visits ${w.act}.`);
  }
  const best = bestSource(x);
  if (best) out.push(`${best.name} is your best source: 1 in ${oneIn(best.sessions, best.conv)} of its visitors ${w.did}.`);
  return out.join(' ');
}

/* ---------- The summary: dates, trust, headline and four cards ---------- */

// Long numbers step down a size so they stay on one line.
const sizeCls = (v) => {
  const n = String(v).replace(/<[^>]*>|&[a-z]+;/g, 'x').length;
  return n >= 9 ? ' xlong' : n >= 7 ? ' long' : '';
};

function summary(x, { report = false, checkHref = '#check' } = {}) {
  const t = x.totals;
  const shop = x.goal.shop;
  const w = words(shop);
  const labels = numberLabels(shop);
  const unsafe = new Set(x.check.unsafe);
  const weeks = Math.max(1, (x.period.days || 7) / 7);
  const card = ({ label, value, chg, means, key, lead = false }) => `<div class="ga-card${lead ? ' lead' : ''}">
    <p class="lbl">${esc(label)}</p><p class="big${sizeCls(value)}">${value}</p>
    ${chg ? `<p class="chg ${chg.cls}">${esc(chg.text)}</p>` : ''}
    ${key && unsafe.has(labels[key]) ? '<p class="care-tag">Use with care</p>' : ''}
    <p class="means">${esc(means)}</p></div>`;
  const rNow = rate(t.now.conv, t.now.sessions);
  const rWas = t.before ? rate(t.before.conv, t.before.sessions) : null;
  const top = x.devices[0];
  const deviceLine = top && t.now.sessions ? `Mostly on ${top.device} (${Math.round((top.now.sessions / t.now.sessions) * 100)}% of visits).` : 'No device split recorded.';
  const rateCard = card({ label: 'Conversion rate', value: `${rNow.toFixed(1)}%`, chg: changeWords(rNow, rWas, x, { kind: 'rate' }), means: t.now.conv ? `1 in every ${oneIn(t.now.sessions, t.now.conv)} visits ends in ${shop ? 'an order' : 'an enquiry'}.` : `No ${w.noun} in this period.`, key: 'rate' });
  const visitsCard = card({ label: 'Visits', value: num(t.now.sessions), chg: changeWords(t.now.sessions, t.before?.sessions, x), means: deviceLine, key: 'sessions' });
  let cards;
  if (shop) {
    const aov = t.now.transactions ? t.now.revenue / t.now.transactions : 0;
    cards = [
      card({ label: 'Revenue', value: money(t.now.revenue, x.currency), chg: changeWords(t.now.revenue, t.before?.revenue, x, { kind: 'money' }), means: `Average order ${money(aov, x.currency)}. About ${money(t.now.revenue / weeks, x.currency)} a week.`, key: 'revenue', lead: true }),
      card({ label: 'Orders', value: num(t.now.transactions), chg: changeWords(t.now.transactions, t.before?.transactions, x), means: `From ${num(t.now.purchasers)} customers, counted exactly.`, key: 'transactions' }),
      rateCard,
      visitsCard,
    ];
  } else {
    const perWeek = t.now.conv / weeks;
    const ai = x.ai;
    cards = [
      card({ label: 'Leads', value: num(t.now.conv), chg: changeWords(t.now.conv, t.before?.conv, x), means: `Enquiries sent from your forms. ${perWeek >= 1 ? `About ${Math.round(perWeek)} a week.` : 'Fewer than one a week.'}`, key: 'leads', lead: true }),
      rateCard,
      visitsCard,
      card({ label: 'Leads from AI', value: num(ai.now.conv), chg: changeWords(ai.now.conv, ai.before?.conv, x), means: ai.now.conv && t.now.conv ? `${fraction(ai.now.conv / t.now.conv)} of all leads, from ${Math.round((ai.now.sessions / (t.now.sessions || 1)) * 100)}% of visits.` : `None yet, from ${num(ai.now.sessions)} visits.`, key: 'sources' }),
    ];
  }
  const r = x.check.rating;
  const vs = x.compare ? `<p class="ga-vs">Compared with ${rangeCaps(x.compare.start, x.compare.end)}${x.compare.kind === 'year' ? ', the year before' : ''}</p>` : '';
  return `<section class="${report ? 'rp' : 'summary'} ga2" aria-label="Summary">
    <div class="ga-head">
      <div><p class="ga-when">${rangeCaps(x.period.start, x.period.end)}</p>${vs}</div>
      <a class="ga-badge ${r}" href="${esc(checkHref)}"><span class="dot"></span>Data check: ${esc(RATINGS[r]).toLowerCase()}</a>
    </div>
    <p class="ga-headline">${esc(headline(x))}</p>
    <div class="ga-cards">${cards.join('')}</div>
  </section>`;
}

/* ---------- Where the leads came from, and being found ---------- */

function sourcesBlock(x) {
  const shop = x.goal.shop;
  const w = words(shop);
  const total = x.totals.now.conv;
  const list = (x.sources || []).filter((e) => e.conv > 0);
  if (!list.length) return '';
  const top = list.slice(0, 5);
  const rest = total - top.reduce((n, e) => n + e.conv, 0);
  const max = Math.max(...top.map((e) => e.conv), rest, 1);
  const site = rate(x.totals.now.conv, x.totals.now.sessions);
  const row = (name, conv, sessions) => {
    const rt = sessions ? rate(conv, sessions) : null;
    const hi = rt != null && rt >= site * 2 && conv >= 3;
    return `<li><span class="nm">${esc(name)}</span><span class="ibar"><span style="width:${Math.round((conv / max) * 100)}%"></span></span><span class="ct">${num(conv)}</span><span class="rt${hi ? ' hi' : ''}">${rt == null ? '' : `${rt.toFixed(1)}%`}</span></li>`;
  };
  return `<section class="sec full ga-src"><h2>Where your ${w.noun} came from</h2>
    <ol class="src-list"><li class="hd"><span>Source</span><span></span><span class="ct">${shop ? 'Orders' : 'Leads'}</span><span class="rt">Rate</span></li>
    ${top.map((e) => row(e.name, e.conv, e.sessions)).join('')}${rest > 0 ? row('Everything else', rest, null) : ''}</ol>
    <p class="sec-note">Rate is the share of that source's visits that ${w.did === 'placed an order' ? 'ended in an order' : 'ended in an enquiry'}. The site as a whole is ${site.toFixed(1)}%; anything twice that is shown in blue.</p></section>`;
}

function foundBlock(x) {
  const s = x.search && !x.search.error ? x.search : null;
  const ai = x.ai;
  const w = words(x.goal.shop);
  const uk = s?.uk || null;
  let google = '';
  if (s && uk) {
    const shown = changeWords(uk.now.impressions, uk.before?.impressions, x);
    const name = (s.names || []).sort((a, b) => b.impressions - a.impressions)[0];
    const nameLine = name ? `<p>Searches for "${esc(name.name)}": you rank about ${ordinal(Math.max(1, Math.round(name.position)))} on average, with ${num(name.clicks)} click${name.clicks === 1 ? '' : 's'}.</p>` : '';
    google = `<div class="found-card"><p class="lbl">Google search, UK</p><p class="big">${num(uk.now.clicks)} <small>clicks</small></p>
      <p>Shown ${num(uk.now.impressions)} times${shown ? ` <span class="chg ${shown.cls}">(${esc(shown.text.charAt(0).toLowerCase() + shown.text.slice(1))})</span>` : ''}. Average position ${uk.now.position.toFixed(1)}.</p>${nameLine}</div>`;
  }
  const names = ai.list.filter((e) => e.now.sessions).map((e) => `${esc(e.name)} ${num(e.now.sessions)}`).join(', ');
  const convChg = changeWords(ai.now.conv, ai.before?.conv, x);
  const aiCard = `<div class="found-card"><p class="lbl">AI assistants</p><p class="big">${num(ai.now.sessions)} <small>visits</small></p>
    <p>${names ? `${names}.` : 'No visits from AI assistants yet.'}</p>
    <p>${num(ai.now.conv)} ${ai.now.conv === 1 ? w.one : w.noun}${convChg ? ` <span class="chg ${convChg.cls}">(${esc(convChg.text.charAt(0).toLowerCase() + convChg.text.slice(1))})</span>` : ''}.</p></div>`;
  return `<section class="sec full"><h2>Being found</h2><div class="found">${google}${aiCard}</div></section>`;
}

/* ---------- The detail ---------- */

const tbl = (report, head, rows, empty, cols) =>
  `<div class="table-wrap"><table${report ? ' class="rtable"' : ''}><thead><tr>${head}</tr></thead><tbody>${rows || `<tr><td colspan="${cols}">${esc(empty)}</td></tr>`}</tbody></table></div>`;

function checkSection(x, report) {
  const rows = x.check.checks
    .map((c) => {
      const [label, cls] = LEVEL[c.level];
      return `<tr><td>${esc(c.title)}${c.lines.length ? `<ul class="lines">${c.lines.slice(0, 6).map((l) => `<li>${esc(l)}</li>`).join('')}</ul>` : ''}<span class="rule">${esc(c.rule)}</span></td><td>${esc(c.value)}</td><td class="r"><span class="lvl ${cls}">${label}</span></td></tr>`;
    })
    .join('');
  const ns = x.check.landing;
  const nsRow = `<tr><td>"(not set)" landing pages<span class="rule">Affects the landing page table only. Over ${Math.round(THRESHOLDS.notSet.care * 100)}% is use with care, over ${Math.round(THRESHOLDS.notSet.bad * 100)}% not reliable.</span></td><td>${(ns.share * 100).toFixed(1)}% of sessions</td><td class="r"><span class="lvl ${LEVEL[ns.level][1]}">${LEVEL[ns.level][0]}</span></td></tr>`;
  const also = x.check.also.length ? `<h3 class="sub-h">Also seen, below the line</h3><ul class="lines">${x.check.also.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>` : '';
  return `<section class="sec full" id="check"><h2>Data check</h2>
    ${tbl(report, '<th>Check</th><th>Found</th><th class="r">Result</th>', rows + nsRow, '', 3)}${also}</section>`;
}

function aiSection(x, report) {
  const shop = x.goal.shop;
  const ai = x.ai;
  const rows = ai.list
    .map((e) => `<tr><td>${esc(e.name)}</td><td class="r">${num(e.now.sessions)}${chip(change(e.now.sessions, x.compare ? e.before.sessions : null))}</td><td class="r">${num(e.now.conv)}${chip(change(e.now.conv, x.compare ? e.before.conv : null))}</td>${shop ? `<td class="r">${money(e.now.revenue, x.currency)}</td>` : ''}</tr>`)
    .join('');
  const total = ai.list.length > 1 ? `<tr class="tot"><td>All AI assistants</td><td class="r">${num(ai.now.sessions)}</td><td class="r">${num(ai.now.conv)}</td>${shop ? `<td class="r">${money(ai.now.revenue, x.currency)}</td>` : ''}</tr>` : '';
  const share = x.totals.now.sessions ? ((ai.now.sessions / x.totals.now.sessions) * 100).toFixed(1) : '0';
  return `<section class="sec full"><h2>AI assistants in detail</h2>
    <p class="sec-note">${share}% of sessions. Counted by source name (gpt, perplexity, gemini, claude, copilot, openai), not GA4's own AI channel, which misses most of it.${ai.notSetMedium ? ` ${num(ai.notSetMedium)} of these arrived with a "(not set)" medium, which is normal for some genuine ChatGPT clicks.` : ''}</p>
    ${tbl(report, `<th>Assistant</th><th class="r">Visits</th><th class="r">${shop ? 'Orders' : 'Leads'}</th>${shop ? '<th class="r">Revenue</th>' : ''}`, rows + total, 'No visits from AI assistants in this period.', shop ? 4 : 3)}</section>`;
}

function searchSection(x, report) {
  const s = x.search;
  if (!s) return '';
  if (s.error) return `<section class="sec full"><h2>Google search</h2><p class="note">${esc(s.error)}</p></section>`;
  const row = (label, now, before, opts = {}, fmt = num) => `<tr><td>${label}</td><td class="r">${fmt(now)}${chip(change(now, before, opts))}</td></tr>`;
  const totals = [
    row('Clicks', s.now.clicks, s.before?.clicks),
    row('Times shown (impressions)', s.now.impressions, s.before?.impressions),
    row('Click-through rate', s.now.ctr, s.before?.ctr, { points: true }, (v) => `${Number(v).toFixed(2)}%`),
    row('Average position (lower is better)', s.now.position, s.before?.position, { points: true, lowerBetter: true, unit: '', dp: 1 }, (v) => Number(v).toFixed(1)),
  ].join('');
  const q = s.queries.map((r, i) => `<tr><td><span class="n">${i + 1}</span>${esc(r.query)}</td><td class="r">${num(r.clicks)}</td><td class="r">${Number(r.position).toFixed(1)}</td></tr>`).join('');
  const p = s.pages.map((r, i) => `<tr><td><span class="n">${i + 1}</span>${esc(shortPage(r.page))}</td><td class="r">${num(r.clicks)}</td><td class="r">${Number(r.position).toFixed(1)}</td></tr>`).join('');
  return `<section class="sec full"><h2>Google search in detail</h2>
    <p class="sec-note">From Search Console (${esc(s.site)})${x.uk_only ? ', UK only' : ', all countries'}. Its last two or three days fill in late, so a period ending yesterday reads a little low.</p>
    ${tbl(report, `<th></th><th class="r">${x.compare ? `This period, with the change ${esc(since(x))}` : 'This period'}</th>`, totals, '', 2)}
    <h3 class="sub-h">Top searches</h3>${tbl(report, '<th>Search</th><th class="r">Clicks</th><th class="r">Position</th>', q, 'No searches yet.', 3)}
    <h3 class="sub-h">Top pages from search</h3>${tbl(report, '<th>Page</th><th class="r">Clicks</th><th class="r">Position</th>', p, 'No pages yet.', 3)}</section>`;
}

function shortPage(url) {
  try {
    const u = new URL(url);
    return u.pathname + u.search || '/';
  } catch {
    return String(url);
  }
}

function devicesSection(x, report) {
  const total = x.totals.now.sessions || 1;
  const rows = x.devices
    .map((d) => {
      const r = rate(d.now.conv, d.now.sessions);
      const was = d.before ? rate(d.before.conv, d.before.sessions) : null;
      return `<tr><td>${esc(d.device.charAt(0).toUpperCase() + d.device.slice(1))}</td><td class="r">${Math.round((d.now.sessions / total) * 100)}%</td><td class="r">${num(d.now.sessions)}</td><td class="r">${rateText(r)}${chip(change(r, was, { points: true }))}</td></tr>`;
    })
    .join('');
  return `<section class="sec full"><h2>Devices</h2>${tbl(report, '<th>Device</th><th class="r">Share</th><th class="r">Sessions</th><th class="r">Conversion rate</th>', rows, 'No data.', 4)}</section>`;
}

function landingSection(x, report) {
  const ns = x.check.landing;
  const warn = ns.level !== 'ok' ? `<p class="note warn">${(ns.share * 100).toFixed(0)}% of sessions have no landing page recorded ("(not set)"), so read this table with care. The totals above aren't affected.</p>` : '';
  const rows = x.landing.map((l, i) => `<tr><td><span class="n">${i + 1}</span>${esc(l.page || '(blank)')}</td><td class="r">${num(l.sessions)}</td><td class="r">${rateText(rate(l.conv, l.sessions))}</td></tr>`).join('');
  return `<section class="sec full"><h2>Top landing pages</h2>${warn}${tbl(report, '<th>Page</th><th class="r">Sessions</th><th class="r">Conversion rate</th>', rows, 'No data.', 3)}</section>`;
}

function methodSection(x) {
  const goal = x.goal.shop ? 'Purchasers and transactions are exact counts from GA4, not rounded.' : `Leads are the GA4 key event "${esc(x.goal.event)}".`;
  return `<section class="fine rmethod"><h2>Method</h2>
    <p>${esc(compareText(x))} GA4 property ${esc(x.property)}${x.uk_only ? ', UK visitors only' : ''}. ${goal} Only totals and top-ten lists are kept; no visitor-level data.</p>
    <p>The data check runs before any numbers are read: bot traffic, internal links with UTM tags, duplicate transactions, ${x.goal.shop ? 'purchase' : 'lead'} tracking, and "(not set)" landing pages. Each says what it found and the line it was judged against.</p>
  </section>`;
}

export function auditDetail(x, { report = false } = {}) {
  return [checkSection(x, report), aiSection(x, report), searchSection(x, report), devicesSection(x, report), landingSection(x, report)].join('\n');
}

// Everything above the detail: the summary, then where the leads came from and being found.
export function auditTop(x, opts = {}) {
  return [summary(x, opts), sourcesBlock(x), foundBlock(x)].join('\n');
}

/* ---------- The GA4 tab ---------- */

const PERIODS = [['28', 'Last 28 days'], ['90', 'Last 90 days'], ['365', 'Last 12 months'], ['launch', 'Since launch'], ['custom', 'Dates below']];
const COMPARES = [['previous', 'The period before'], ['year', 'The same period last year'], ['none', 'No comparison']];

function auditForm(brand, token) {
  const periods = PERIODS.filter(([k]) => k !== 'launch' || brand.launch_date);
  return `<form class="form audit" data-save="audit-run" data-token="${token}">
    <label><span>Period</span><select name="period">${periods.map(([k, l]) => `<option value="${k}"${k === '90' ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select></label>
    <label><span>Compare with</span><select name="compare">${COMPARES.map(([k, l]) => `<option value="${k}">${esc(l)}</option>`).join('')}</select></label>
    <label><span>From (dates below)</span><input type="date" name="start"></label>
    <label><span>To</span><input type="date" name="end"></label>
    <div class="wide"><button type="submit" class="btn">Run the audit</button></div>
    <p class="status wide" role="status" hidden></p>
  </form>`;
}

export function ga4Tab({ brand, audits = [], audit = null, ready, email = '', sample = false, href = (id) => `?audit=${id}` }) {
  const token = sample ? 'SAMPLE' : esc(brand.slug);
  if (!brand.ga4_property) {
    return `<div class="placeholder"><p>Add the brand's GA4 property number in Settings to run an audit. Its Search Console property and lead event go there too.</p></div>`;
  }
  if (!ready) {
    return `<div class="placeholder"><p>The Google login isn't set up yet. Add the service account's JSON key to the worker in Cloudflare as the secret <b>GOOGLE_SA_KEY</b>, then reload this page.</p></div>`;
  }
  const access = `<p class="note">Reads GA4 property <b>${esc(brand.ga4_property)}</b>${brand.uk_only ? ' (UK visitors only)' : ''}${brand.gsc_site ? ` and Search Console <b>${esc(brand.gsc_site)}</b>` : ''} as ${esc(email)}. That address needs Viewer access in GA4 and Restricted access in Search Console.</p>`;
  const list = audits
    .map((a) => {
      const r = a.rating;
      return `<div class="adm-row${audit && audit.id === a.id ? ' here' : ''}">
      <div class="c-name"><a href="${esc(href(a.id))}"><b>${esc(fmtDate(a.start_date))} to ${esc(fmtDate(a.end_date))}</b></a><span>Run ${esc(fmtDateTime(a.created_at))}</span></div>
      <div class="c-meta">${a.compare_kind ? `Against ${a.compare_kind === 'year' ? 'last year' : 'the period before'}` : 'No comparison'}${a.gsc_error ? '. Search Console not read' : ''}</div>
      <div class="c-act"><span class="lvl ${r === 'clean' ? '' : r === 'care' ? 'care' : 'bad'}">${esc(RATINGS[r] || '')}</span><button type="button" class="ghost small primary" data-action="report-ga4" data-token="${token}" data-value="${a.id}" data-label="Make a report" data-wait="Making the report…">Make a report</button></div>
    </div>`;
    })
    .join('');
  const shown = audit
    ? `${auditTop(audit.data)}<h2 class="detail-h">The detail</h2>${auditDetail(audit.data)}${methodSection(audit.data)}`
    : '<p class="empty">No audits yet. Choose a period above and run the first one.</p>';
  return `<section class="sec full"><h2>Run an audit</h2>${auditForm(brand, token)}${access}</section>
  ${audits.length ? `<section class="sec full"><h2>Audits</h2><div class="adm brand-list"><div>${list}</div></div></section>` : ''}
  ${shown}`;
}

/* ---------- The GA4 report sheet ---------- */

export function ga4ReportPage({ base, report, brand, pdf = false, admin = false, recommendations = '', css = '' }) {
  const x = report.data;
  const bar = pdf ? '' : topBar(`${admin ? backLink(`/admin/brands/${brand.slug}/reports/${report.id}/`, isShared(report) ? 'Back to the report' : 'Private: back to the report') : '<span></span>'}${downloadLink(`/report/${report.token}/report.pdf`)}`);
  const body = `
  ${masthead('GA4 and search audit', fmtDate(x.period.end, 'long'))}
  <div class="rhead"><h1>${eyebrow(brand.name)}GA4 and search</h1>
  <p class="standfirst">${esc(`How the site did, from GA4 and Google Search Console${x.uk_only ? ', UK visitors only' : ''}. The data is checked before any numbers are read.`)}</p></div>
  ${auditTop(x, { report: true })}
  ${auditDetail(x, { report: true })}
  ${recommendations}
  ${methodSection(x)}
  ${legalFooter()}`;
  return shell({ title: report.title, base, body, css: css + GA4_CSS + GA4_REPORT_EXTRA, bar });
}

/* ---------- Traffic in an AI visibility report ---------- */

// The visits from AI assistants and from Google search, from the brand's latest audit, so an AI
// visibility report shows what the visibility brought in.
export function trafficSection(tr) {
  if (!tr) return '';
  const shop = tr.goal?.shop !== false;
  const sinceText = tr.compare ? (tr.compare.kind === 'year' ? 'on last year' : 'on the period before') : '';
  const row = (label, now, before) => `<tr><td>${label}</td><td class="r">${num(now)}${chip(change(now, tr.compare ? before : null))}</td></tr>`;
  const rows = [
    row('Visits from AI assistants', tr.ai.now.sessions, tr.ai.before?.sessions),
    row(shop ? 'Orders from AI assistants' : 'Leads from AI assistants', tr.ai.now.conv, tr.ai.before?.conv),
    ...(tr.search && !tr.search.error ? [row('Clicks from Google search', tr.search.now.clicks, tr.search.before?.clicks), row('Times shown in Google search', tr.search.now.impressions, tr.search.before?.impressions)] : []),
  ].join('');
  const care = tr.rating && tr.rating !== 'clean' ? ` The GA4 data check rated this period "${RATINGS[tr.rating]}", so read the GA4 numbers with that in mind.` : '';
  return `<section class="sec full"><h2>What it brought in</h2>
    <p class="sec-note">From GA4 and Search Console, ${esc(fmtDate(tr.period.start, 'long'))} to ${esc(fmtDate(tr.period.end, 'long'))}${tr.uk_only ? ', UK visitors only' : ''}${sinceText ? `, with the change ${esc(sinceText)}` : ''}.${esc(care)}</p>
    <table class="rtable"><thead><tr><th></th><th class="r"></th></tr></thead><tbody>${rows}</tbody></table></section>`;
}

/* ---------- Styles ---------- */

// Shared by the tab and the report: the trust block, levels and small lists.
export const GA4_CSS = `
.ga2 .ga-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; }
.ga-when { font: 500 44px/1 var(--display); letter-spacing: -0.01em; text-transform: uppercase; }
.ga-vs { margin-top: 10px; font: 500 15px/1.3 var(--display); letter-spacing: 0.02em; text-transform: uppercase; color: #9a9a9a; }
.ga-badge { display: inline-flex; align-items: center; gap: 8px; flex: none; padding: 10px 14px; border: 1px solid #6b6b6b; font: 500 13px/1 var(--display); letter-spacing: 0.02em; text-transform: uppercase; color: var(--on-desk); text-decoration: none; white-space: nowrap; }
.ga-badge .dot { width: 8px; height: 8px; border-radius: 50%; background: #6b6b6b; }
.ga-badge.clean { border-color: #2fbf71; } .ga-badge.clean .dot { background: #2fbf71; }
.ga-badge.care { border-color: #f2b632; } .ga-badge.care .dot { background: #f2b632; }
.ga-badge.unreliable { border-color: #ff5a5a; } .ga-badge.unreliable .dot { background: #ff5a5a; }
.ga-headline { margin: 32px 0 36px; max-width: 920px; font: 500 26px/1.35 var(--display); color: var(--on-desk); }
.ga-cards { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
.ga-card { padding: 20px; background: #1c1c1c; border-top: 3px solid #393939; display: flex; flex-direction: column; }
.ga-card.lead { border-top-color: var(--blue); }
.ga-card .lbl { font: 500 13px/1.2 var(--display); letter-spacing: 0.02em; text-transform: uppercase; color: #9a9a9a; }
.ga-card .big { margin-top: 12px; font: 500 56px/1 var(--display); letter-spacing: -0.01em; white-space: nowrap; }
.ga-card .big.long { font-size: 44px; }
.ga-card .big.xlong { font-size: 36px; }
.ga-card.lead .big { color: var(--blue); }
.ga-card .chg { margin-top: 12px; font: 500 14px/1.35 var(--display); color: #cfcfcf; }
.ga-card .chg.good, .found-card .chg.good { color: #6fd08c; }
.ga-card .chg.bad, .found-card .chg.bad { color: #ff7a7a; }
.ga-card .care-tag { margin-top: 8px; padding-left: 8px; border-left: 3px solid #f2b632; font: 500 12px/1.3 var(--display); color: var(--on-desk); }
.ga-card .means { margin-top: auto; padding-top: 16px; font: 400 15px/1.45 var(--serif); color: #cfcfcf; }
.ga-card .chg + .means, .ga-card .care-tag + .means { margin-top: 16px; border-top: 1px solid #2a2a2a; }
.src-list { list-style: none; margin: 0; padding: 0; }
.src-list li { display: grid; grid-template-columns: minmax(0, 180px) minmax(0, 1fr) 64px 72px; gap: 16px; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--line); font: 500 16px/1.3 var(--display); }
.src-list li.hd { padding-top: 0; font-size: 13px; color: var(--muted); }
.src-list .ct, .src-list .rt { text-align: right; }
.src-list .rt { color: var(--muted); }
.src-list .rt.hi { color: var(--blue); }
.ibar { display: block; height: 10px; background: var(--box); }
.ibar > span { display: block; height: 100%; background: var(--blue); }
.ga-src .sec-note { margin-top: 12px; }
.found { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.found-card { padding: 24px; background: var(--box); }
.found-card .lbl { font: 500 13px/1.2 var(--display); letter-spacing: 0.02em; text-transform: uppercase; color: var(--muted); }
.found-card .big { margin: 10px 0 12px; font: 500 44px/1 var(--display); }
.found-card .big small { font-size: 18px; color: var(--muted); }
.found-card p + p { margin-top: 6px; }
.found-card .chg.good { color: #0d7a3f; }
.found-card .chg.bad { color: var(--red); }
@media (max-width: 1240px) {
  .ga-cards { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 900px) {
  .ga2 .ga-head { flex-direction: column; }
  .ga-when { font-size: 30px; }
  .ga-headline { font-size: 20px; }
  .ga-card .big { font-size: 40px; }
  .ga-card .big.long { font-size: 32px; }
  .ga-card .big.xlong { font-size: 26px; }
  .found { grid-template-columns: 1fr; }
  .src-list li { grid-template-columns: minmax(0, 1fr) 56px 64px; }
  .src-list .ibar, .src-list li.hd span:nth-child(2) { display: none; }
}
@media (max-width: 560px) {
  .ga-cards { grid-template-columns: 1fr; }
}
td.r, th.r { text-align: right; white-space: nowrap; }
.sec .sec-note { margin-bottom: 12px; }
.lvl { display: inline-block; padding: 4px 8px; border: 1px solid #2fbf71; font: 500 11px/1 var(--display); letter-spacing: 0.02em; color: #0d7a3f; }
.lvl.care { border-color: #f2b632; color: #8a5a00; }
.lvl.bad { border-color: var(--red); color: var(--red); }
.lines { margin: 6px 0 0; padding-left: 18px; font: 400 13px/1.45 var(--serif); color: var(--muted); }
.rule { display: block; margin-top: 4px; font: 400 12px/1.4 var(--serif); color: var(--muted); }
tr.tot td { font-weight: 500; border-top: 1px solid var(--ink); }
.note.warn { margin: 0 0 12px; padding-left: 10px; border-left: 3px solid #f2b632; color: var(--ink); }
.d { margin-left: 6px; font: 500 12px/1 var(--display); color: var(--muted); }
.d.up { color: #0d7a3f; }
.d.down { color: var(--red); }
.form.audit { grid-template-columns: repeat(4, minmax(0, 1fr)); align-items: end; }
.form.audit .btn { min-width: 200px; }
.adm-row.here { background: var(--box); }
.n { display: inline-block; min-width: 24px; color: var(--muted); }
@media (max-width: 900px) {
  .form.audit { grid-template-columns: 1fr; }
}
`;

// On the A4 sheet, after the report styles and GA4_CSS.
const GA4_REPORT_EXTRA = `
.rp.ga2 { padding: 28px; }
.rp.ga2 .ga-when { font-size: 30px; }
.rp.ga2 .ga-vs { font-size: 12px; }
.rp.ga2 .ga-badge { padding: 7px 10px; font-size: 11px; }
.rp.ga2 .ga-headline { margin: 20px 0 22px; font-size: 18px; }
.rp.ga2 .ga-cards { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
.rp.ga2 .ga-card { padding: 14px; }
.rp.ga2 .ga-card .lbl { font-size: 11px; }
.rp.ga2 .ga-card .big { margin-top: 8px; font-size: 32px; }
.rp.ga2 .ga-card .big.long { font-size: 26px; }
.rp.ga2 .ga-card .big.xlong { font-size: 21px; }
.rp.ga2 .ga-card .chg { margin-top: 8px; font-size: 12px; }
.rp.ga2 .ga-card .means { font-size: 12px; }
.sheet .src-list li { font-size: 14px; padding: 7px 0; grid-template-columns: minmax(0, 150px) minmax(0, 1fr) 52px 60px; }
.sheet .found-card { padding: 16px; break-inside: avoid; }
.sheet .found-card .big { font-size: 30px; }
@media print { .rp.ga2 .ga-cards { grid-template-columns: repeat(4, minmax(0, 1fr)); } .found { grid-template-columns: 1fr 1fr; } }
`;
