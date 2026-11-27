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
const RATING_CLS = { clean: 'ahead', care: 'close', unreliable: 'behind' };
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

/* ---------- The dark panel: trust rating and the headline numbers ---------- */

function panel(x, { report = false } = {}) {
  const t = x.totals;
  const shop = x.goal.shop;
  const unsafe = new Set(x.check.unsafe);
  const labels = numberLabels(shop);
  const flag = (key) => (unsafe.has(labels[key]) ? '<p class="verdict close">Use with care</p>' : '');
  const tile = (value, label, c, key) => `<div><p class="big">${value}</p><p class="lbl">${esc(label)}</p>${flag(key)}${c ? `<p class="chg ${c.dir > 0 ? 'up' : c.dir < 0 ? 'down' : ''}">${esc(c.text)} ${esc(since(x))}</p>` : ''}</div>`;
  const rNow = rate(t.now.conv, t.now.sessions);
  const rWas = t.before ? rate(t.before.conv, t.before.sessions) : null;
  const tiles = [
    tile(num(t.now.sessions), 'Sessions', change(t.now.sessions, t.before?.sessions), 'sessions'),
    shop ? tile(num(t.now.purchasers), 'Purchasers (exact)', change(t.now.purchasers, t.before?.purchasers), 'purchasers') : tile(num(t.now.conv), `Leads (${x.goal.event})`, change(t.now.conv, t.before?.conv), 'leads'),
    tile(rateText(rNow), shop ? 'Conversion rate (transactions per session)' : 'Conversion rate (leads per session)', change(rNow, rWas, { points: true }), 'rate'),
    shop ? tile(money(t.now.revenue, x.currency), 'Revenue', change(t.now.revenue, t.before?.revenue), 'revenue') : tile(num(t.now.engaged), 'Engaged sessions', change(t.now.engaged, t.before?.engaged), 'sessions'),
  ].join('');
  const ai = x.ai;
  const s = x.search && !x.search.error ? x.search : null;
  const second = [
    tile(num(ai.now.sessions), 'Visits from AI assistants', change(ai.now.sessions, ai.before?.sessions), 'sources'),
    tile(num(ai.now.conv), shop ? 'Orders from AI assistants' : 'Leads from AI assistants', change(ai.now.conv, ai.before?.conv), 'sources'),
    s ? tile(num(s.now.clicks), 'Clicks from Google search', change(s.now.clicks, s.before?.clicks), '') : '',
    s ? tile(num(s.now.impressions), 'Times shown in Google search', change(s.now.impressions, s.before?.impressions), '') : '',
  ].join('');
  const bad = x.check.checks.filter((c) => c.level !== 'ok');
  const why = bad.length ? `<ul class="why">${bad.map((c) => `<li><b>${esc(c.title)}:</b> ${esc(c.value)}</li>`).join('')}</ul>` : '<p class="why-ok">No signs of bots, internal tagging, duplicate orders or broken tracking.</p>';
  return `<section class="${report ? 'rp ga' : 'summary ga'}" aria-label="Summary">
    <div class="trust">
      <p class="eyebrow-d">Can the data be trusted?</p>
      <p class="rating ${RATING_CLS[x.check.rating]}">${esc(RATINGS[x.check.rating])}</p>
      ${why}
      <p class="safe"><span>Safe to use:</span> ${x.check.safe.length ? esc(x.check.safe.join(', ')) : 'none of the numbers'}${x.check.unsafe.length ? `. <span>Use with care:</span> ${esc(x.check.unsafe.join(', '))}` : ''}.</p>
    </div>
    <div class="${report ? 'rp-nums' : 'sum-nums'} ga-nums">${tiles}</div>
    <div class="${report ? 'rp-nums' : 'sum-nums'} ga-nums second">${second}</div>
  </section>`;
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
  return `<section class="sec full"><h2>Data check</h2>
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
  return `<section class="sec full"><h2>Traffic from AI assistants</h2>
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
  return `<section class="sec full"><h2>Google search</h2>
    <p class="sec-note">From Search Console (${esc(s.site)}). Its last two or three days fill in late, so a period ending yesterday reads a little low.</p>
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
    ? `<p class="detail-intro">${esc(compareText(audit.data, brand))}</p>${panel(audit.data)}<h2 class="detail-h">The detail</h2>${auditDetail(audit.data)}${methodSection(audit.data)}`
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
  <p class="standfirst">${esc(compareText(x, brand))}</p></div>
  ${panel(x, { report: true })}
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
.ga .trust { padding-bottom: 32px; margin-bottom: 32px; border-bottom: 1px solid #393939; }
.ga .rating { margin-top: 12px; padding-left: 16px; border-left: 6px solid #6b6b6b; font: 500 64px/1 var(--display); letter-spacing: -0.01em; text-transform: uppercase; }
.ga .rating.ahead { border-color: #2fbf71; }
.ga .rating.close { border-color: #f2b632; }
.ga .rating.behind { border-color: #ff5a5a; }
.ga .why { margin: 16px 0 0; padding-left: 18px; color: #cfcfcf; font: 500 15px/1.5 var(--display); }
.ga .why b { font-weight: 500; color: var(--on-desk); }
.ga .why-ok { margin-top: 16px; color: #cfcfcf; font: 500 15px/1.5 var(--display); }
.ga .safe { margin-top: 12px; font: 500 13px/1.5 var(--display); color: #9a9a9a; }
.ga .safe span { color: var(--on-desk); }
.ga-nums .big { font-size: 56px; overflow-wrap: anywhere; }
.ga-nums.second { margin-top: 32px; padding-bottom: 0; border-bottom: 0; }
.ga-nums.second .big { color: var(--on-desk); }
.ga-nums .chg { display: block; margin-top: 8px; font: 500 12px/1.3 var(--display); color: #9a9a9a; }
.ga-nums .chg.up { color: #6fd08c; }
.ga-nums .chg.down { color: #ff7a7a; }
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
.detail-intro { margin: 32px 0 16px; font: 500 16px/1.4 var(--display); }
.n { display: inline-block; min-width: 24px; color: var(--muted); }
@media (max-width: 900px) {
  .form.audit { grid-template-columns: 1fr; }
  .ga .rating { font-size: 40px; }
  .ga-nums .big { font-size: 36px; }
}
`;

// On the A4 sheet, after the report styles and GA4_CSS.
const GA4_REPORT_EXTRA = `
.rp.ga .rating { font-size: 44px; }
.rp.ga .trust { padding-bottom: 20px; margin-bottom: 0; }
.rp.ga .rp-nums .big { font-size: 34px; color: var(--on-desk); }
.rp.ga .rp-nums:not(.second) > div:first-child .big { color: var(--blue); }
.rp.ga .rp-nums.second { margin-top: 20px; padding-top: 20px; }
.rp.ga .chg { font-size: 11px; }
`;
