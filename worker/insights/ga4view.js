// The GA4 tab and the GA4 report sheet (phase 3). Drawn from an audit's stored totals
// (audit.js), so the tab, the report and its PDF all show the same numbers.
//
// Everything from GA4 and Search Console (page paths, search queries, source names) is escaped.

import { esc, fmtDate, fmtDateTime, masthead, eyebrow, legalFooter, shell, topBar, downloadLink, backLink } from '../docs/shared.js';
import { RATINGS, THRESHOLDS, numberLabels } from './audit.js';

const isShared = (r) => r.status !== 'draft' && !r.withdrawn_at;
export const num = (n) => Math.round(Number(n) || 0).toLocaleString('en-GB');
export const money = (n, cur = 'GBP') => {
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

// Arrows at 45 degrees for which way a number moved. The colour (cls) says whether that's good.
const ARROWS = {
  1: '<svg class="arr" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 9.5 9.5 2.5M4 2.5h5.5V8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square"/></svg>',
  '-1': '<svg class="arr" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 2.5 9.5 9.5M9.5 4v5.5H4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square"/></svg>',
};
export const arrow = (c) => (c && c.dir ? ARROWS[c.dir] : '');

// A change in words, with which way it moved and whether that's good: { text, dir, cls }, or null
// without a comparison.
export function changeWords(now, before, x, { kind = 'count', lowerBetter = false, neutral = false } = {}) {
  if (!x.compare || before == null || now == null) return null;
  const r = ref(x);
  const good = (d) => (d === 0 || neutral ? '' : (d > 0) !== lowerBetter ? 'good' : 'bad');
  if (kind === 'rate') {
    const d = Math.round((now - before) * 100) / 100;
    if (Math.abs(d) < 0.05) return { text: `Same as ${r} (${before.toFixed(1)}%)`, dir: 0, cls: '' };
    return { text: `${d > 0 ? 'Up' : 'Down'} from ${before.toFixed(1)}%${r === 'last year' ? ' last year' : ''}`, dir: Math.sign(d), cls: good(d) };
  }
  const fmt = kind === 'money' ? (v) => money(v, x.currency) : num;
  const d = now - before;
  if (kind === 'count' && Math.max(now, before) < SMALL) {
    if (d === 0) return { text: `Same as ${r} (${num(before)})`, dir: 0, cls: '' };
    return { text: `${num(Math.abs(d))} ${d > 0 ? 'more' : 'fewer'} than the ${num(before)} ${r}`, dir: Math.sign(d), cls: good(d) };
  }
  if (!before) return { text: `None ${r}`, dir: Math.sign(d), cls: good(d) };
  const pc = Math.round((d / before) * 100);
  if (pc === 0) return { text: `Same as ${r} (${fmt(before)})`, dir: 0, cls: '' };
  return { text: `${pc > 0 ? 'Up' : 'Down'} ${Math.abs(pc)}% from ${fmt(before)}${r === 'last year' ? ' last year' : ''}`, dir: Math.sign(d), cls: good(d) };
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
    ${chg ? `<p class="chg ${chg.cls}">${arrow(chg)}${esc(chg.text)}</p>` : ''}
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

/* ---------- Google positions (UK) ---------- */

// A position change: lower is better, so moving from 9.4 to 6.1 is "Up 3.3".
export function posChange(now, before) {
  if (before == null || now == null) return null;
  const d = Math.round((before - now) * 10) / 10;
  if (Math.abs(d) < 0.1) return { text: 'Same', dir: 0, cls: '' };
  return { text: `${d > 0 ? 'Up' : 'Down'} ${Math.abs(d).toFixed(1)}`, dir: Math.sign(d), cls: d > 0 ? 'good' : 'bad' };
}

const BAND_MEANS = { top3: 'Where most clicks go.', page1: 'The rest of page one.', page2: 'Page two: close to page one.', near: 'Pages three to five.', far: 'Rarely seen.' };
const BAND_GOOD = new Set(['top3', 'page1']);

function positionsBlock(x, report) {
  const s = x.search && !x.search.error ? x.search : null;
  const p = s?.positions;
  if (!p || !p.total.now) return '';
  const has = x.compare && p.total.before != null;
  const tiles = p.bands
    .map((b) => {
      const c = has ? changeWords(b.now, b.before, x, { neutral: !BAND_GOOD.has(b.key) }) : null;
      return `<div class="band ${b.key}"><p class="lbl"><span class="sw"></span>${esc(b.label)}</p><p class="big">${num(b.now)}</p>${c ? `<p class="chg ${c.cls}">${arrow(c)}${esc(c.text)}</p>` : ''}<p class="means">${esc(BAND_MEANS[b.key])}</p></div>`;
    })
    .join('');
  const stack = (key, label) => {
    const total = p.bands.reduce((n, b) => n + (b[key] || 0), 0) || 1;
    return `<div class="dist-row"><span class="dl">${esc(label)}</span><span class="stack">${p.bands.map((b) => (b[key] ? `<span class="${b.key}" style="width:${((b[key] / total) * 100).toFixed(1)}%"></span>` : '')).join('')}</span><span class="dn">${num(total)}</span></div>`;
  };
  const avgC = has ? posChange(p.average.now, p.average.before) : null;
  const top = p.top
    .map((r, i) => {
      const c = has ? posChange(r.position, r.before) : null;
      return `<tr><td><span class="n">${i + 1}</span>${esc(r.query)}</td><td class="r">${num(r.clicks)}</td><td class="r">${r.position.toFixed(1)}</td>${has ? `<td class="r">${c ? `<span class="pchg ${c.cls}">${arrow(c)}${esc(c.text)}</span>` : '<span class="pchg">New</span>'}</td>` : ''}</tr>`;
    })
    .join('');
  const movers = (list, title, empty) => `<div><h3 class="sub-h">${esc(title)}</h3>${list.length ? `<ol class="movers">${list.map((r) => `<li><span class="q">${esc(r.query)}</span><span class="mv">${r.before.toFixed(1)} → <b>${r.now.toFixed(1)}</b></span></li>`).join('')}</ol>` : `<p class="muted">${esc(empty)}</p>`}</div>`;
  const R = { min: 5, mover: 10 };
  return `<section class="sec full gpos"><h2>Google positions, UK</h2>
    <p class="sec-note">Every UK search you showed up for at least ${R.min} times, by your average place in the results.${p.average.now != null ? ` Average position ${p.average.now.toFixed(1)}${avgC ? ` <span class="pchg ${avgC.cls}">${arrow(avgC)}${esc(avgC.text)}</span>` : ''}.` : ''}${p.capped ? ' Read from the top 2,000 searches.' : ''}</p>
    <div class="bands">${tiles}</div>
    <div class="dist">${stack('now', 'This period')}${has ? stack('before', x.compare.kind === 'year' ? 'Last year' : 'Before') : ''}</div>
    <h3 class="sub-h">Top searches</h3>
    ${tbl(report, `<th>Search</th><th class="r">Clicks</th><th class="r">Position</th>${has ? '<th class="r">Change</th>' : ''}`, top, 'No searches yet.', has ? 4 : 3)}
    ${has ? `<div class="movers-2">${movers(p.up, 'Biggest climbs', 'No searches climbed by a full place.')}${movers(p.down, 'Biggest drops', 'No searches dropped by a full place.')}</div><p class="sec-note">Climbs and drops compare searches seen at least ${R.mover} times in both periods.</p>` : ''}
  </section>`;
}

/* ---------- What changed ---------- */

export const MIN_RATE_VISITS = 20;

// The change in leads (or revenue) split into its causes, so the parts add up to the whole:
// leads = visits x rate; revenue = visits x rate x average order. Each part is the change in one
// factor with the factors before it already moved (visits first, then rate, then order size).
export function changeParts(x) {
  const t = x.totals;
  if (!x.compare || !t.before || !t.before.sessions) return null;
  const S0 = t.before.sessions;
  const S1 = t.now.sessions;
  const C0 = t.before.conv;
  const C1 = t.now.conv;
  const cr0 = C0 / S0;
  const cr1 = S1 ? C1 / S1 : 0;
  if (x.goal.shop) {
    const R0 = t.before.revenue;
    const R1 = t.now.revenue;
    const aov0 = C0 ? R0 / C0 : 0;
    const aov1 = C1 ? R1 / C1 : aov0;
    return {
      kind: 'revenue',
      total: R1 - R0,
      parts: [
        { key: 'visits', value: (S1 - S0) * cr0 * aov0 },
        { key: 'rate', value: S1 * (cr1 - cr0) * aov0 },
        { key: 'order', value: S1 * cr1 * (aov1 - aov0) },
      ],
    };
  }
  return { kind: 'leads', total: C1 - C0, parts: [{ key: 'visits', value: (S1 - S0) * cr0 }, { key: 'rate', value: S1 * (cr1 - cr0) }] };
}

function changedBlock(x) {
  const c = changeParts(x);
  if (!c) return '';
  const shop = c.kind === 'revenue';
  const fmt = (v) => (shop ? money(Math.abs(v), x.currency) : `${Math.round(Math.abs(v))}`);
  const label = {
    visits: (v) => (v >= 0 ? 'More visits' : 'Fewer visits'),
    rate: (v) => (v >= 0 ? 'A better conversion rate' : 'A lower conversion rate'),
    order: (v) => (v >= 0 ? 'Bigger orders' : 'Smaller orders'),
  };
  const noun = shop ? '' : ' leads';
  const max = Math.max(1, ...c.parts.map((p) => Math.abs(p.value)));
  const rows = c.parts
    .filter((p) => (shop ? Math.abs(p.value) >= 1 : Math.abs(p.value) >= 0.5))
    .map((p) => {
      const w = Math.round((Math.abs(p.value) / max) * 100);
      const pos = p.value >= 0;
      return `<li><span class="nm">${esc(label[p.key](p.value))}</span><span class="div"><span class="neg">${pos ? '' : `<span style="width:${w}%"></span>`}</span><span class="pos">${pos ? `<span style="width:${w}%"></span>` : ''}</span></span><span class="vl ${pos ? 'good' : 'bad'}">${pos ? '+' : '−'}${fmt(p.value)}${noun}</span></li>`;
    })
    .join('');
  const total = shop ? `Revenue ${c.total >= 0 ? 'up' : 'down'} ${money(Math.abs(c.total), x.currency)}` : c.total === 0 ? 'Leads held steady' : `${Math.abs(c.total)} ${c.total > 0 ? 'more' : 'fewer'} leads`;
  const movers = (x.movers || [])
    .slice(0, 5)
    .map((m) => `<li><span class="nm">${esc(m.name)}</span><span class="vl ${m.change > 0 ? 'good' : 'bad'}">${m.change > 0 ? '+' : '−'}${Math.abs(m.change)} ${Math.abs(m.change) === 1 ? (shop ? 'order' : 'lead') : shop ? 'orders' : 'leads'}</span></li>`)
    .join('');
  return `<section class="sec full ga-changed"><h2>What changed</h2>
    <div class="changed-2">
      <div><p class="ch-total">${esc(total)} ${esc(since(x))}. Where that came from:</p><ul class="parts">${rows}</ul>
      <p class="sec-note">${shop ? 'Revenue is visits × conversion rate × average order, so each part is what one of them moved on its own.' : 'Leads are visits × conversion rate, so each part is what one of them moved on its own.'} The parts are rounded, so may not add up exactly.</p></div>
      ${movers ? `<div><p class="ch-total">By source</p><ul class="movers-src">${movers}</ul><p class="sec-note">The sources whose ${shop ? 'orders' : 'leads'} changed most.</p></div>` : ''}
    </div></section>`;
}

/* ---------- Trend, week by week ---------- */

// A small line chart: this period in blue, the comparison period behind it in grey.
function lineChart(now, before, { title, fmt }) {
  const W = 560;
  const H = 180;
  const pad = { l: 8, r: 8, t: 16, b: 28 };
  const n = Math.max(now.length, before?.length || 0);
  if (n < 2) return '';
  const max = Math.max(1, ...now, ...(before || []));
  const xAt = (i) => pad.l + (i * (W - pad.l - pad.r)) / (n - 1);
  const yAt = (v) => pad.t + (H - pad.t - pad.b) * (1 - v / max);
  const path = (list) => list.map((v, i) => `${i ? 'L' : 'M'}${xAt(i).toFixed(1)} ${yAt(v).toFixed(1)}`).join(' ');
  const last = now.length - 1;
  const ticks = [0, Math.floor((n - 1) / 2), n - 1].filter((v, i, a) => a.indexOf(v) === i);
  return `<figure class="tchart"><figcaption><span>${esc(title)}</span><b>${esc(fmt(now[last] ?? 0))}</b><small>last week</small></figcaption>
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)}, week by week">
      <line x1="${pad.l}" x2="${W - pad.r}" y1="${H - pad.b}" y2="${H - pad.b}" class="ax"/>
      ${before ? `<path d="${path(before)}" class="was"/>` : ''}
      <path d="${path(now)}" class="now"/>
      <circle cx="${xAt(last).toFixed(1)}" cy="${yAt(now[last] ?? 0).toFixed(1)}" r="4" class="dot"/>
      ${ticks.map((i) => `<text x="${xAt(i).toFixed(1)}" y="${H - 8}" text-anchor="${i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}">Week ${i + 1}</text>`).join('')}
    </svg></figure>`;
}

function trendBlock(x) {
  const t = x.trend;
  if (!t?.now?.length) return '';
  // Only whole weeks: a part week at the end would read as a drop.
  const weeks = Math.floor((x.period.days || 0) / 7);
  if (weeks < 2) return '';
  const cut = (list) => (list ? list.slice(0, weeks) : null);
  const now = cut(t.now);
  const before = cut(t.before);
  const shop = x.goal.shop;
  const visits = lineChart(now.map((w) => w.sessions), before?.map((w) => w.sessions), { title: 'Visits per week', fmt: num });
  const second = shop
    ? lineChart(now.map((w) => w.revenue), before?.map((w) => w.revenue), { title: 'Revenue per week', fmt: (v) => money(v, x.currency) })
    : lineChart(now.map((w) => w.conv), before?.map((w) => w.conv), { title: 'Leads per week', fmt: num });
  return `<section class="sec full ga-trend"><h2>Week by week</h2>
    <p class="sec-note">This period in blue${before ? `, ${x.compare.kind === 'year' ? 'the same weeks last year' : 'the period before'} in grey behind it` : ''}. Whole weeks only.</p>
    <div class="tcharts">${visits}${second}</div></section>`;
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
  // A rate from a handful of visits misleads (2 visits, 2 leads reads as 100%), so under 20 visits
  // it isn't shown.
  const row = (name, conv, sessions) => {
    const rt = sessions >= MIN_RATE_VISITS ? rate(conv, sessions) : null;
    const hi = rt != null && rt >= site * 2 && conv >= 3;
    return `<li><span class="nm">${esc(name)}</span><span class="ibar"><span style="width:${Math.round((conv / max) * 100)}%"></span></span><span class="ct">${num(conv)}</span><span class="rt${hi ? ' hi' : ''}">${rt == null ? '' : `${rt.toFixed(1)}%`}</span></li>`;
  };
  return `<section class="sec full ga-src"><h2>Where your ${w.noun} came from</h2>
    <ol class="src-list"><li class="hd"><span>Source</span><span></span><span class="ct">${shop ? 'Orders' : 'Leads'}</span><span class="rt">Rate</span></li>
    ${top.map((e) => row(e.name, e.conv, e.sessions)).join('')}${rest > 0 ? row('Everything else', rest, null) : ''}</ol>
    <p class="sec-note">Rate is the share of that source's visits that ${w.did === 'placed an order' ? 'ended in an order' : 'ended in an enquiry'}, shown once a source has ${MIN_RATE_VISITS} visits. The site as a whole is ${site.toFixed(1)}%; anything twice that is shown in blue.</p></section>`;
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
      <p>Shown ${num(uk.now.impressions)} times${shown ? ` <span class="chg ${shown.cls}">${arrow(shown)}${esc(shown.text.charAt(0).toLowerCase() + shown.text.slice(1))}</span>` : ''}. Average position ${uk.now.position.toFixed(1)}.</p>${nameLine}</div>`;
  }
  const names = ai.list.filter((e) => e.now.sessions).map((e) => `${esc(e.name)} ${num(e.now.sessions)}`).join(', ');
  const convChg = changeWords(ai.now.conv, ai.before?.conv, x);
  const aiCard = `<div class="found-card"><p class="lbl">AI assistants</p><p class="big">${num(ai.now.sessions)} <small>visits</small></p>
    <p>${names ? `${names}.` : 'No visits from AI assistants yet.'}</p>
    <p>${num(ai.now.conv)} ${ai.now.conv === 1 ? w.one : w.noun}${convChg ? ` <span class="chg ${convChg.cls}">${arrow(convChg)}${esc(convChg.text.charAt(0).toLowerCase() + convChg.text.slice(1))}</span>` : ''}.</p></div>`;
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
    ${s.positions ? '' : `<h3 class="sub-h">Top searches</h3>${tbl(report, '<th>Search</th><th class="r">Clicks</th><th class="r">Position</th>', q, 'No searches yet.', 3)}`}
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
  return [summary(x, opts), changedBlock(x), trendBlock(x), sourcesBlock(x), foundBlock(x), positionsBlock(x, opts.report)].join('\n');
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

// Laid out like the AI visibility tab: one bar at the top saying which audit is shown, with its
// buttons, then the numbers. The form for a new audit opens from the bar (closed until needed,
// open when there are no audits yet), and every audit is listed at the bottom.
// Links are full paths: the page sets a <base>, so a bare "?audit=" or "#check" would go to the site root.
export function ga4Tab({ brand, audits = [], audit = null, ready, email = '', sample = false, href = (id) => `/admin/brands/${brand.slug}/ga4/?audit=${id}` }) {
  const token = sample ? 'SAMPLE' : esc(brand.slug);
  if (!brand.ga4_property) {
    return `<div class="placeholder"><p>Add the brand's GA4 property number in Settings to run an audit. Its Search Console property and lead event go there too.</p></div>`;
  }
  if (!ready) {
    return `<div class="placeholder"><p>The Google login isn't set up yet. Add the service account's JSON key to the worker in Cloudflare as the secret <b>GOOGLE_SA_KEY</b>, then reload this page.</p></div>`;
  }
  const reads = `GA4 property ${esc(brand.ga4_property)}${brand.uk_only ? ' (UK visitors only)' : ''}${brand.gsc_site ? ` and Search Console ${esc(brand.gsc_site)}` : ''}`;
  const open = !audit;
  const bar = `<div class="run-bar">
    <div class="grow">${audit ? `Showing the audit of ${esc(fmtDate(audit.data.period.start, 'long'))} to ${esc(fmtDate(audit.data.period.end, 'long'))}` : 'No audits yet'}<span>${audit ? `Run ${esc(fmtDateTime(audit.created_at))}. ` : ''}Reads ${reads}.</span></div>
    ${audit ? `<button type="button" class="ghost small" data-action="report-ga4" data-token="${token}" data-value="${audit.id}" data-label="Make a report" data-wait="Making the report…">Make a report</button>` : ''}
    <button type="button" class="ghost small primary" data-toggle="new-audit" data-open="Run an audit" data-close="Close" aria-controls="new-audit" aria-expanded="${open}">${open ? 'Close' : 'Run an audit'}</button>
  </div>
  <div class="new-audit" id="new-audit"${open ? '' : ' hidden'}>${auditForm(brand, token)}
    <p class="note">Read as ${esc(email)}, which needs Viewer access in GA4 and Restricted access in Search Console.</p></div>`;
  const list = audits
    .map((a) => {
      const r = a.rating;
      return `<div class="adm-row${audit && audit.id === a.id ? ' here' : ''}">
      <div class="c-name"><a href="${esc(href(a.id))}"><b>${esc(fmtDate(a.start_date))} to ${esc(fmtDate(a.end_date))}</b></a><span>Run ${esc(fmtDateTime(a.created_at))}</span></div>
      <div class="c-meta">${a.compare_kind ? `Against ${a.compare_kind === 'year' ? 'last year' : 'the period before'}` : 'No comparison'}${a.gsc_error ? '. Search Console not read' : ''}</div>
      <div class="c-act"><span class="lvl ${r === 'clean' ? '' : r === 'care' ? 'care' : 'bad'}">${esc(RATINGS[r] || '')}</span><a class="ghost small" href="${esc(href(a.id))}">View</a></div>
    </div>`;
    })
    .join('');
  const shown = audit
    ? `${auditTop(audit.data, { checkHref: `${href(audit.id)}#check` })}<details class="ga-more" id="detail"><summary><span class="when-closed">Show the detail</span><span class="when-open">Hide the detail</span><small>Data check, AI assistants, Google search, devices and landing pages</small></summary>${auditDetail(audit.data)}</details>`
    : '<p class="empty">Choose a period and run the first audit.</p>';
  return `${bar}
  ${shown}
  ${audits.length ? `<section class="sec full"><h2>All audits</h2><div class="adm brand-list"><div>${list}</div></div></section>` : ''}
  ${audit ? methodSection(audit.data) : ''}`;
}

/* ---------- The GA4 report sheet ---------- */

export function ga4ReportPage({ base, report, brand, pdf = false, admin = false, recommendations = '', css = '' }) {
  const x = report.data;
  const bar = pdf ? '' : topBar(`${admin ? backLink(`/admin/brands/${brand.slug}/reports/${report.id}/`, isShared(report) ? 'Back to the report' : 'Private: back to the report') : '<span></span>'}${downloadLink(`/report/${report.token}/report.pdf`)}`);
  const body = `
  ${masthead('GA4 and search audit', fmtDate(x.period.end, 'long'))}
  <div class="rhead"><h1>${eyebrow(brand.name)}GA4 and search</h1>
  <p class="standfirst">${esc(`How the site did, from GA4 and Google Search Console${x.uk_only ? ', UK visitors only' : ''}. The data is checked before any numbers are read.`)}</p></div>
  ${auditTop(x, { report: true, checkHref: `/report/${report.token}/#check` })}
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
.arr { display: inline-block; width: 0.8em; height: 0.8em; margin-right: 0.35em; vertical-align: -0.02em; }
.found-card .chg { white-space: nowrap; font-family: var(--display); font-size: 0.93em; }
.new-audit { margin-top: 0; padding: 24px 16px 8px; background: var(--box); border-top: 1px solid var(--line); }
.new-audit .note { margin-top: 12px; }
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
.changed-2 { display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); gap: 40px; }
.ch-total { font: 500 20px/1.35 var(--display); }
.parts, .movers-src { margin: 12px 0 0; padding: 0; list-style: none; }
.parts li { display: grid; grid-template-columns: minmax(0, 200px) minmax(0, 1fr) 110px; gap: 16px; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--line); font: 500 16px/1.3 var(--display); }
.parts .div { display: grid; grid-template-columns: 1fr 1fr; height: 12px; border-left: 0; }
.parts .div > span { display: flex; height: 100%; }
.parts .div .neg { justify-content: flex-end; border-right: 1px solid var(--ink); }
.parts .div .neg > span { background: var(--red); }
.parts .div .pos > span { background: #2fbf71; }
.parts .vl, .movers-src .vl { text-align: right; white-space: nowrap; }
.vl.good { color: #0d7a3f; }
.vl.bad { color: var(--red); }
.movers-src li { display: flex; justify-content: space-between; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--line); font: 500 16px/1.3 var(--display); }
.ga-changed .sec-note { margin-top: 12px; }
.tcharts { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.tchart { margin: 0; padding: 16px; background: var(--box); }
.tchart figcaption { display: flex; align-items: baseline; gap: 10px; font: 500 13px/1.2 var(--display); letter-spacing: 0.02em; text-transform: uppercase; color: var(--muted); }
.tchart figcaption b { margin-left: auto; font: 500 24px/1 var(--display); letter-spacing: 0; text-transform: none; color: var(--ink); }
.tchart figcaption small { font-size: 11px; text-transform: none; letter-spacing: 0; }
.tchart svg { display: block; width: 100%; height: auto; margin-top: 8px; overflow: visible; }
.tchart .ax { stroke: var(--line); }
.tchart .was { fill: none; stroke: #bdbdbd; stroke-width: 2; stroke-dasharray: 4 4; }
.tchart .now { fill: none; stroke: var(--blue); stroke-width: 2.5; }
.tchart .dot { fill: var(--blue); }
.tchart text { font: 500 11px/1 var(--display); fill: var(--muted); }
details.ga-more { margin-top: 48px; border-top: 1px solid var(--ink); }
details.ga-more > summary { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 16px; padding: 20px 0; cursor: pointer; list-style: none; font: 500 20px/1.2 var(--display); text-transform: uppercase; }
details.ga-more > summary::-webkit-details-marker { display: none; }
details.ga-more > summary::before { content: '+'; width: 20px; }
details.ga-more[open] > summary::before { content: '−'; }
details.ga-more > summary small { font: 400 14px/1.4 var(--serif); text-transform: none; color: var(--muted); }
details.ga-more .when-open, details.ga-more[open] .when-closed { display: none; }
details.ga-more[open] .when-open { display: inline; }
.bands { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; }
.band { padding: 16px; background: var(--box); }
.band .lbl { display: flex; align-items: center; gap: 8px; font: 500 13px/1.2 var(--display); letter-spacing: 0.02em; text-transform: uppercase; color: var(--muted); }
.band .sw { width: 10px; height: 10px; flex: none; }
.band .big { margin-top: 10px; font: 500 40px/1 var(--display); }
.band .chg { margin-top: 8px; font: 500 13px/1.35 var(--display); color: var(--muted); }
.band .chg.good, .pchg.good { color: #0d7a3f; }
.band .chg.bad, .pchg.bad { color: var(--red); }
.band .means { margin-top: 8px; font: 400 13px/1.4 var(--serif); color: var(--muted); }
.top3 .sw, .stack .top3 { background: var(--blue); }
.page1 .sw, .stack .page1 { background: #6b9bff; }
.page2 .sw, .stack .page2 { background: #b3cbff; }
.near .sw, .stack .near { background: #bdbdbd; }
.far .sw, .stack .far { background: #e2e2e2; }
.dist { margin: 20px 0 8px; display: flex; flex-direction: column; gap: 8px; }
.dist-row { display: grid; grid-template-columns: 96px minmax(0, 1fr) 48px; gap: 12px; align-items: center; font: 500 13px/1.2 var(--display); }
.dist-row .dn { text-align: right; color: var(--muted); }
.stack { display: flex; height: 14px; background: var(--box); }
.stack > span { display: block; height: 100%; }
.pchg { white-space: nowrap; font: 500 13px/1.2 var(--display); color: var(--muted); }
.movers-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.movers { margin: 0; padding: 0; list-style: none; }
.movers li { display: flex; justify-content: space-between; gap: 12px; padding: 8px 0; border-bottom: 1px solid var(--line); font: 500 14px/1.3 var(--display); }
.movers .q { min-width: 0; overflow-wrap: anywhere; }
.movers .mv { flex: none; color: var(--muted); }
.movers .mv b { font-weight: 500; color: var(--ink); }
@media (max-width: 1240px) {
  .ga-cards { grid-template-columns: 1fr 1fr; }
  .bands { grid-template-columns: repeat(3, minmax(0, 1fr)); }
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
@media (max-width: 900px) {
  .changed-2, .tcharts { grid-template-columns: 1fr; }
  .parts li { grid-template-columns: minmax(0, 1fr) 90px; }
  .parts .div { display: none; }
}
@media (max-width: 560px) {
  .ga-cards { grid-template-columns: 1fr; }
  .bands { grid-template-columns: 1fr 1fr; }
  .movers-2 { grid-template-columns: 1fr; }
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
.sheet .bands { grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px; }
.sheet .band { padding: 10px; break-inside: avoid; }
.sheet .band .lbl { font-size: 10px; }
.sheet .band .big { font-size: 26px; }
.sheet .band .chg, .sheet .band .means { font-size: 11px; }
.sheet .movers li { font-size: 13px; padding: 6px 0; }
.sheet .ch-total { font-size: 15px; }
.sheet .parts li, .sheet .movers-src li { font-size: 13px; padding: 6px 0; }
.sheet .changed-2 { gap: 24px; }
.sheet .tcharts { gap: 12px; }
.sheet .tchart { padding: 10px; break-inside: avoid; }
@media print { .rp.ga2 .ga-cards { grid-template-columns: repeat(4, minmax(0, 1fr)); } .found { grid-template-columns: 1fr 1fr; } }
`;
