// The GA4 audit (phase 3), with Search Console alongside.
//
// One audit = one period (and, usually, a comparison period) for one brand. It asks GA4 for ten
// small reports in two batch calls, and Search Console for four, then keeps only the totals and
// short top-ten lists it needs (no visitor-level data). Seven calls to Google in all, well inside
// the free plan's 50 per request.
//
// Step 1 is the data check: can these numbers be trusted? See THRESHOLDS for the tests. The
// result is clean, use with care, or not reliable, with the reasons and which numbers are still
// safe to use. Step 2 is the numbers.
//
// A shop is judged on purchases. A brand with a lead event set (ga4_goal, for example
// generate_lead) is judged on that event instead, as "leads".

import { ga4Batch, gscQuery, GoogleError } from './google.js';
import { db, now, parse } from './db.js';

/* ---------- The data check ---------- */

// Agreed with Anthony on 27 Nov 2026, then adjusted after testing against two known properties
// (one clean, one with heavy bot traffic). Shares are of the period's sessions.
export const THRESHOLDS = {
  // Bot traffic. A source or a city is bot-like when it has over `share` of sessions and its
  // engagement rate is under `engagement`, or under `ratio` of the rest of the site's rate.
  // A day is a spike when it has over `spike` times the median day's sessions and under half
  // the normal engagement rate (the rate on the quieter half of days).
  bots: { share: 0.1, engagement: 0.05, ratio: 1 / 3, spike: 4, unreliableShare: 0.2, alsoShare: 0.02, minSessions: 30 },
  // Internal links tagged with UTMs: sessions that start from a page on the brand's own site
  // with a campaign set. Over `care` is use with care, over `bad` is not reliable.
  internal: { care: 0.02, bad: 0.1 },
  // "(not set)" landing pages. Shown on the landing page table only: it skews that table, not
  // the totals, so it doesn't change the overall rating.
  notSet: { care: 0.05, bad: 0.15 },
  // The same transaction counted more than once, as a share of transactions.
  duplicates: { care: 0.005, bad: 0.02 },
  // Purchase tracking: a week with at least `weekSessions` sessions and no purchases, when the
  // period averages at least `weekAverage` a week, means tracking is patchy. No purchases at all
  // with at least `minSessions` sessions on a shop means it isn't tracking.
  tracking: { weekSessions: 100, weekAverage: 3, minSessions: 200 },
};

export const RATINGS = { clean: 'Clean', care: 'Use with care', unreliable: 'Not reliable' };

const share = (n, d) => (d ? n / d : 0);
const pctText = (x, dp = 1) => `${(Math.round(x * 100 * 10 ** dp) / 10 ** dp).toFixed(dp).replace(/\.0+$/, '')}%`;

function median(list) {
  const s = [...list].sort((a, b) => a - b);
  if (!s.length) return 0;
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

// The numbers each problem makes unsafe, by key. Labels depend on shop or leads.
export function numberLabels(shop) {
  return shop
    ? { sessions: 'Sessions', rate: 'Conversion rate', purchasers: 'Purchasers', transactions: 'Transactions', revenue: 'Revenue', devices: 'Device split', landing: 'Landing pages', sources: 'Traffic sources and AI traffic' }
    : { sessions: 'Sessions', rate: 'Conversion rate', leads: 'Leads', devices: 'Device split', landing: 'Landing pages', sources: 'Traffic sources and AI traffic' };
}

// Pure: the check from the raw rows. `x` holds totals { sessions, engagedSessions, conv },
// sources and cities [{ name, sessions, engagedSessions }], daily [{ date, sessions,
// engagedSessions, conv }], notSet (sessions), dups [{ id, eventCount }], internal (sessions),
// shop (true for purchases) and hasDomain (false skips the internal check).
export function dataCheck(x) {
  const T = THRESHOLDS;
  const total = x.totals.sessions || 0;
  const engaged = x.totals.engagedSessions || 0;
  const checks = [];
  const also = [];

  // Bots by source and by city.
  const lowEngagement = (row) => {
    const er = share(row.engagedSessions, row.sessions);
    const restEr = share(engaged - row.engagedSessions, total - row.sessions);
    return er < T.bots.engagement || er < restEr * T.bots.ratio;
  };
  const botRows = (rows, kind) => {
    const hit = [];
    for (const r of rows || []) {
      if (r.sessions < T.bots.minSessions || !lowEngagement(r)) continue;
      const s = share(r.sessions, total);
      const line = `${r.name}: ${pctText(s)} of sessions, ${pctText(share(r.engagedSessions, r.sessions))} engaged`;
      if (s > T.bots.share) hit.push({ ...r, line });
      else if (s > T.bots.alsoShare) also.push(`${kind} ${line}`);
    }
    return hit;
  };
  const bySource = botRows(x.sources, 'Source');
  const byCity = botRows(x.cities, 'City');

  // Spike days.
  const days = (x.daily || []).filter((d) => d.sessions > 0);
  const mid = median(days.map((d) => d.sessions));
  const quiet = days.filter((d) => d.sessions <= mid);
  const normalEr = share(quiet.reduce((n, d) => n + d.engagedSessions, 0), quiet.reduce((n, d) => n + d.sessions, 0));
  const spikes = mid ? days.filter((d) => d.sessions > mid * T.bots.spike && share(d.engagedSessions, d.sessions) < normalEr / 2) : [];
  const spikeExcess = spikes.reduce((n, d) => n + (d.sessions - mid), 0);

  const signs = [bySource.length, byCity.length, spikes.length].filter(Boolean).length;
  const botShare = Math.max(share(bySource.reduce((n, r) => n + r.sessions, 0), total), share(byCity.reduce((n, r) => n + r.sessions, 0), total), share(spikeExcess, total));
  const botLines = [
    ...bySource.map((r) => `Source ${r.line}`),
    ...byCity.map((r) => `City ${r.line}`),
    ...(spikes.length ? [`${spikes.length} spike day${spikes.length === 1 ? '' : 's'} (over ${T.bots.spike}× a normal day with under half the usual engagement), the biggest ${fmtDay(spikes.reduce((a, b) => (b.sessions > a.sessions ? b : a)).date)}`] : []),
  ];
  checks.push({
    key: 'bots',
    title: 'Bot traffic',
    level: !signs ? 'ok' : signs >= 2 || botShare > T.bots.unreliableShare ? 'bad' : 'care',
    value: signs ? `About ${pctText(botShare, 0)} of sessions look like bots` : 'No signs',
    lines: botLines,
    rule: `A source or city with over ${pctText(T.bots.share, 0)} of sessions and engagement under ${pctText(T.bots.engagement, 0)} or under a third of the rest of the site, or days at over ${T.bots.spike}× normal with half the engagement. One sign is use with care; two or more, or over ${pctText(T.bots.unreliableShare, 0)} of sessions, is not reliable.`,
    affects: ['sessions', 'rate', 'devices', 'landing', 'sources'],
  });

  // Internal links with UTM tags.
  if (x.hasDomain !== false) {
    const s = share(x.internal || 0, total);
    checks.push({
      key: 'internal',
      title: 'Internal links with UTM tags',
      level: s > T.internal.bad ? 'bad' : s > T.internal.care ? 'care' : 'ok',
      value: `${pctText(s)} of sessions`,
      lines: [],
      rule: `Sessions started from the brand's own pages with a campaign tag. Over ${pctText(T.internal.care, 0)} is use with care, over ${pctText(T.internal.bad, 0)} not reliable.`,
      affects: ['sources'],
    });
  }

  // Duplicate transactions (shops).
  if (x.shop) {
    const extra = (x.dups || []).reduce((n, r) => n + Math.max(0, r.eventCount - 1), 0);
    const s = share(extra, x.totals.conv || 0);
    checks.push({
      key: 'duplicates',
      title: 'Duplicate transactions',
      level: s > T.duplicates.bad ? 'bad' : s > T.duplicates.care ? 'care' : 'ok',
      value: extra ? `${extra} extra of ${x.totals.conv} (${pctText(s, 2)})` : 'None',
      lines: [],
      rule: `The same order counted twice. Over ${pctText(T.duplicates.care)} of transactions is use with care, over ${pctText(T.duplicates.bad, 0)} not reliable.`,
      affects: ['transactions', 'revenue', 'rate'],
    });
  }

  // Purchase (or lead) tracking.
  const conv = x.totals.conv || 0;
  if (x.shop) {
    const weeks = [];
    for (let end = days.length; end - 7 >= 0; end -= 7) weeks.push(days.slice(end - 7, end));
    const avg = weeks.length ? weeks.reduce((n, w) => n + w.reduce((m, d) => m + d.conv, 0), 0) / weeks.length : 0;
    const gaps = weeks.filter((w) => w.reduce((n, d) => n + d.sessions, 0) >= T.tracking.weekSessions && w.reduce((n, d) => n + d.conv, 0) === 0);
    const none = conv === 0 && total >= T.tracking.minSessions;
    const patchy = !none && avg >= T.tracking.weekAverage && gaps.length > 0;
    checks.push({
      key: 'tracking',
      title: 'Purchase tracking',
      level: none ? 'bad' : patchy ? 'care' : 'ok',
      value: none ? 'No purchases recorded' : patchy ? `${gaps.length} week${gaps.length === 1 ? '' : 's'} with visits but no purchases` : 'Recording in every week',
      lines: gaps.map((w) => `No purchases in the week to ${fmtDay(w[w.length - 1].date)}`),
      rule: 'Purchases missing for a whole week while visits continue is use with care. None at all on a shop is not reliable.',
      affects: ['purchasers', 'transactions', 'revenue', 'rate'],
    });
  } else {
    const none = conv === 0 && total >= T.tracking.minSessions;
    checks.push({
      key: 'tracking',
      title: 'Lead tracking',
      level: none ? 'care' : 'ok',
      value: none ? 'No leads recorded' : `${conv} recorded`,
      lines: [],
      rule: 'No leads at all in the period is use with care: check the form still sends its event.',
      affects: ['leads', 'rate'],
    });
  }

  const order = { ok: 0, care: 1, bad: 2 };
  const worst = checks.reduce((w, c) => Math.max(w, order[c.level]), 0);
  const rating = worst === 2 ? 'unreliable' : worst === 1 ? 'care' : 'clean';

  // "(not set)" landing pages: the landing page table only.
  const ns = share(x.notSet || 0, total);
  const landing = { share: ns, level: ns > T.notSet.bad ? 'bad' : ns > T.notSet.care ? 'care' : 'ok' };

  const labels = numberLabels(x.shop);
  const unsafeKeys = new Set(checks.filter((c) => c.level !== 'ok').flatMap((c) => c.affects));
  if (landing.level !== 'ok') unsafeKeys.add('landing');
  const safe = Object.keys(labels).filter((k) => !unsafeKeys.has(k)).map((k) => labels[k]);
  const unsafe = Object.keys(labels).filter((k) => unsafeKeys.has(k)).map((k) => labels[k]);
  return { rating, checks, also, landing, safe, unsafe };
}

function fmtDay(yyyymmdd) {
  const d = String(yyyymmdd).replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3');
  return new Date(`${d}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
}

/* ---------- Periods ---------- */

const iso = (ms) => new Date(ms).toISOString().slice(0, 10);
const addDays = (day, n) => iso(Date.parse(`${day}T12:00:00Z`) + n * 864e5);
const lastYear = (day) => {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCFullYear(d.getUTCFullYear() - 1);
  return iso(d.getTime());
};
const DAY = /^\d{4}-\d{2}-\d{2}$/;
export const MAX_DAYS = 400;

// The period and comparison from the form. `today` is the UK date; audits end yesterday, the last
// whole day. Returns { start, end, compare: { start, end, kind } | null } or { error }.
export function periodFrom(f, brand, today) {
  const yesterday = addDays(today, -1);
  let start;
  let end = yesterday;
  const kind = String(f.period || '90');
  if (kind === 'launch') {
    if (!brand.launch_date) return { error: 'This brand has no launch date. Add one in Settings, or pick another period.' };
    if (brand.launch_date >= today) return { error: 'The launch date is in the future.' };
    start = brand.launch_date;
  } else if (kind === 'custom') {
    if (!DAY.test(f.start || '') || !DAY.test(f.end || '')) return { error: 'Please give both dates.' };
    start = f.start;
    end = f.end < yesterday ? f.end : yesterday;
    if (start > end) return { error: 'The start date is after the end date.' };
  } else {
    const n = { 28: 28, 90: 90, 365: 365 }[kind] || 90;
    start = addDays(yesterday, -(n - 1));
  }
  const days = Math.round((Date.parse(end) - Date.parse(start)) / 864e5) + 1;
  if (days > MAX_DAYS) return { error: `Please keep the period under ${MAX_DAYS} days.` };
  const cmp = String(f.compare || (kind === 'launch' ? 'year' : 'previous'));
  let compare = null;
  if (cmp === 'previous') compare = { start: addDays(start, -days), end: addDays(start, -1), kind: 'previous' };
  if (cmp === 'year') compare = { start: lastYear(start), end: lastYear(end), kind: 'year' };
  return { start, end, days, compare };
}

/* ---------- The requests ---------- */

const str = (fieldName, value, matchType = 'EXACT') => ({ filter: { fieldName, stringFilter: { matchType, value, caseSensitive: false } } });
const and = (...list) => {
  const ex = list.filter(Boolean);
  return ex.length === 0 ? undefined : ex.length === 1 ? ex[0] : { andGroup: { expressions: ex } };
};
export const AI_SOURCES = ['gpt', 'perplexity', 'gemini', 'claude', 'copilot', 'openai'];
const DEFAULT_CAMPAIGNS = new Set(['(direct)', '(organic)', '(referral)', '(not set)', '(none)', '(cross-network)', '(data not available)']);

export function goalOf(brand) {
  const ev = String(brand.ga4_goal || '').trim();
  return ev && ev !== 'purchase' ? { shop: false, event: ev, metric: `keyEvents:${ev}` } : { shop: true, event: 'purchase', metric: 'transactions' };
}

export function ga4Requests(brand, p) {
  const goal = goalOf(brand);
  const uk = brand.uk_only ? str('country', 'United Kingdom') : null;
  const domain = (brand.match_domains || [])[0] || '';
  const ranges = [{ startDate: p.start, endDate: p.end, name: 'now' }, ...(p.compare ? [{ startDate: p.compare.start, endDate: p.compare.end, name: 'before' }] : [])];
  const nowOnly = [ranges[0]];
  const m = (...names) => names.filter(Boolean).map((name) => ({ name }));
  const d = (...names) => names.map((name) => ({ name }));
  const bySessions = [{ metric: { metricName: 'sessions' }, desc: true }];
  const conv = goal.metric;
  const first = [
    { dateRanges: ranges, metrics: m('sessions', 'engagedSessions', 'totalPurchasers', 'transactions', 'purchaseRevenue', goal.shop ? null : conv), dimensionFilter: and(uk) },
    { dateRanges: ranges, dimensions: d('deviceCategory'), metrics: m('sessions', conv, goal.shop ? 'purchaseRevenue' : null), dimensionFilter: and(uk) },
    { dateRanges: nowOnly, dimensions: d('landingPage'), metrics: m('sessions', conv), dimensionFilter: and(uk), orderBys: bySessions, limit: 10 },
    { dateRanges: ranges, dimensions: d('sessionSource', 'sessionMedium'), metrics: m('sessions', conv, goal.shop ? 'purchaseRevenue' : null), dimensionFilter: and(uk, { orGroup: { expressions: AI_SOURCES.map((s) => str('sessionSource', s, 'CONTAINS')) } }), limit: 100 },
    { dateRanges: nowOnly, dimensions: d('sessionSource'), metrics: m('sessions', 'engagedSessions'), dimensionFilter: and(uk), orderBys: bySessions, limit: 25 },
  ];
  const second = [
    { dateRanges: nowOnly, dimensions: d('city'), metrics: m('sessions', 'engagedSessions'), dimensionFilter: and(uk), orderBys: bySessions, limit: 25 },
    { dateRanges: nowOnly, dimensions: d('date'), metrics: m('sessions', 'engagedSessions', conv, goal.shop ? 'purchaseRevenue' : null), dimensionFilter: and(uk), orderBys: [{ dimension: { dimensionName: 'date' } }], limit: MAX_DAYS + 5 },
    { dateRanges: nowOnly, dimensions: d('landingPage'), metrics: m('sessions'), dimensionFilter: and(uk, str('landingPage', '(not set)')) },
    goal.shop
      ? { dateRanges: nowOnly, dimensions: d('transactionId'), metrics: m('eventCount'), dimensionFilter: and(uk, str('eventName', 'purchase')), metricFilter: { filter: { fieldName: 'eventCount', numericFilter: { operation: 'GREATER_THAN', value: { int64Value: '1' } } } }, limit: 1000 }
      : null,
    domain
      ? { dateRanges: nowOnly, dimensions: d('sessionCampaignName'), metrics: m('eventCount'), dimensionFilter: and(uk, str('eventName', 'session_start'), str('pageReferrer', domain, 'CONTAINS')), limit: 100 }
      : null,
  ];
  // Leave out the reports that don't apply, remembering where each one sits.
  const slots = second.map((r, i) => (r ? i : -1)).filter((i) => i >= 0);
  // Where the leads (or orders) came from: every source and medium in the period, grouped in code.
  // Sources in both periods (for what changed), and the comparison period's days (for the trend).
  const third = [
    { dateRanges: ranges, dimensions: d('sessionSource', 'sessionMedium'), metrics: m('sessions', conv, goal.shop ? 'purchaseRevenue' : null), dimensionFilter: and(uk), orderBys: bySessions, limit: 250 },
    ...(p.compare ? [{ dateRanges: [ranges[1]], dimensions: d('date'), metrics: m('sessions', conv, goal.shop ? 'purchaseRevenue' : null), dimensionFilter: and(uk), orderBys: [{ dimension: { dimensionName: 'date' } }], limit: MAX_DAYS + 5 }] : []),
  ];
  return { first, second: second.filter(Boolean), slots, third, goal, domain };
}

/* ---------- Running an audit ---------- */

const byRange = (rows) => ({ now: rows.filter((r) => !r.range || r.range === 'now'), before: rows.filter((r) => r.range === 'before') });
const sum = (rows, k) => rows.reduce((n, r) => n + (r[k] || 0), 0);
const round2 = (n) => Math.round(n * 100) / 100;

function totalsOf(row, goal) {
  if (!row) return null;
  const conv = goal.shop ? row.transactions : row[goal.metric];
  return { sessions: row.sessions || 0, engaged: row.engagedSessions || 0, purchasers: row.totalPurchasers || 0, transactions: row.transactions || 0, revenue: round2(row.purchaseRevenue || 0), conv: conv || 0 };
}

// A plain name for a source and medium: "Google search", "Direct", "ChatGPT", "Email", "Facebook".
const SOCIAL = [['facebook', 'Facebook'], ['instagram', 'Instagram'], ['linkedin', 'LinkedIn'], ['tiktok', 'TikTok'], ['pinterest', 'Pinterest'], ['youtube', 'YouTube'], ['reddit', 'Reddit'], ['t.co', 'X'], ['twitter', 'X']];
const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
export function sourceLabel(source, medium) {
  const s = String(source || '').toLowerCase();
  const md = String(medium || '').toLowerCase();
  const ai = aiFamily(s);
  if (ai !== s) return ai;
  if (s === '(direct)') return 'Direct';
  if (s === '(not set)' || s === '(data not available)' || !s) return 'Unknown';
  if (md === 'email' || s.includes('klaviyo') || s.includes('mailchimp') || s.includes('newsletter')) return 'Email';
  const social = SOCIAL.find(([k]) => s === k || s.includes(`${k}.`) || s.startsWith(k));
  if (social) return md === 'cpc' || md === 'paid' || md === 'paidsocial' ? `${social[1]} ads` : social[1];
  const name = cap(s.replace(/^www\./, '').replace(/^(m|l|lm)\./, ''));
  if (md === 'organic') return `${name} search`;
  if (['cpc', 'ppc', 'paid', 'paidsearch'].includes(md)) return `${name} ads`;
  return s.replace(/^www\./, '');
}

function aiFamily(source) {
  const s = source.toLowerCase();
  if (s.includes('perplexity')) return 'Perplexity';
  if (s.includes('gemini')) return 'Gemini';
  if (s.includes('claude')) return 'Claude';
  if (s.includes('copilot')) return 'Copilot';
  if (s.includes('gpt') || s.includes('openai')) return 'ChatGPT';
  return source;
}

/* ---------- Google positions (UK) ---------- */

// Every UK search the site showed up for, read in one call per period (up to POSITION_ROWS, which
// covers a small or medium site), then kept only as counts and short lists.
export const POSITION_ROWS = 2000;
export const POSITION_RULES = { minImpressions: 5, moverImpressions: 10, moverChange: 1 };
export const BANDS = [
  { key: 'top3', label: 'Top 3', from: 0, to: 3.5 },
  { key: 'page1', label: '4 to 10', from: 3.5, to: 10.5 },
  { key: 'page2', label: '11 to 20', from: 10.5, to: 20.5 },
  { key: 'near', label: '21 to 50', from: 20.5, to: 50.5 },
  { key: 'far', label: '51 and lower', from: 50.5, to: Infinity },
];

export function positionsOf(nowRows, beforeRows) {
  const R = POSITION_RULES;
  const read = (rows) => (rows || []).map((r) => ({ query: r.keys?.[0] || '', clicks: r.clicks || 0, impressions: r.impressions || 0, position: round2(r.position || 0) }));
  const now = read(nowRows);
  const before = beforeRows ? read(beforeRows) : null;
  const counted = (list) => list.filter((r) => r.impressions >= R.minImpressions);
  const bandCounts = (list) => BANDS.map((b) => counted(list).filter((r) => r.position >= b.from && r.position < b.to).length);
  const nowBands = bandCounts(now);
  const beforeBands = before ? bandCounts(before) : null;
  const was = new Map((before || []).map((r) => [r.query, r]));
  const top = [...now]
    .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions)
    .slice(0, 10)
    .map((r) => ({ ...r, before: was.get(r.query)?.position ?? null }));
  const both = before
    ? now
        .filter((r) => r.impressions >= R.moverImpressions && was.get(r.query)?.impressions >= R.moverImpressions)
        .map((r) => ({ query: r.query, now: r.position, before: was.get(r.query).position, change: round2(was.get(r.query).position - r.position) }))
        .filter((r) => Math.abs(r.change) >= R.moverChange)
    : [];
  const avg = (list) => {
    const c = counted(list);
    const imp = c.reduce((n, r) => n + r.impressions, 0);
    return imp ? round2(c.reduce((n, r) => n + r.position * r.impressions, 0) / imp) : null;
  };
  return {
    bands: BANDS.map((b, i) => ({ key: b.key, label: b.label, now: nowBands[i], before: beforeBands ? beforeBands[i] : null })),
    total: { now: counted(now).length, before: before ? counted(before).length : null },
    average: { now: avg(now), before: before ? avg(before) : null },
    top,
    up: both.filter((r) => r.change > 0).sort((a, b) => b.change - a.change).slice(0, 5),
    down: both.filter((r) => r.change < 0).sort((a, b) => a.change - b.change).slice(0, 5),
    // Page two, most seen first: the searches closest to page one.
    nearly: counted(now).filter((r) => r.position >= 10.5 && r.position < 20.5).sort((a, b) => b.impressions - a.impressions || a.position - b.position).slice(0, 5),
    capped: now.length >= POSITION_ROWS,
  };
}

// Runs the audit and returns what is stored (or throws GoogleError).
export async function runAudit(env, brand, p) {
  const q = ga4Requests(brand, p);
  const property = String(brand.ga4_property);
  const site = String(brand.gsc_site || '').trim();
  const gscBase = { type: 'web', ...(brand.uk_only ? { dimensionFilterGroups: [{ filters: [{ dimension: 'country', operator: 'equals', expression: 'gbr' }] }] } : {}) };
  const gscCall = (start, end, dims = [], rowLimit = 1) => gscQuery(env, site, { ...gscBase, startDate: start, endDate: end, dimensions: dims, rowLimit });
  // UK-only figures for the "Being found" card (the same as the main ones when the brand is UK only),
  // and how the brand ranks for its own name in the UK.
  const ukFilter = (extra = []) => ({ dimensionFilterGroups: [{ filters: [{ dimension: 'country', operator: 'equals', expression: 'gbr' }, ...extra] }] });
  const gscUk = (start, end, extra) => gscQuery(env, site, { type: 'web', ...ukFilter(extra), startDate: start, endDate: end, dimensions: [], rowLimit: 1 });
  const names = [...new Set([brand.name, ...(brand.match_names || [])].map((n) => String(n || '').trim().toLowerCase()).filter((n) => n.length >= 3))].slice(0, 2);
  const [a, b, c, gsc] = await Promise.all([
    ga4Batch(env, property, q.first),
    q.second.length ? ga4Batch(env, property, q.second) : [],
    ga4Batch(env, property, q.third),
    site
      ? Promise.all([
          gscCall(p.start, p.end),
          p.compare ? gscCall(p.compare.start, p.compare.end) : [],
          gscCall(p.start, p.end, ['query'], 10),
          gscCall(p.start, p.end, ['page'], 10),
          brand.uk_only ? null : gscUk(p.start, p.end),
          brand.uk_only || !p.compare ? null : gscUk(p.compare.start, p.compare.end),
          Promise.all(names.map((n) => gscUk(p.start, p.end, [{ dimension: 'query', operator: 'contains', expression: n }]))),
          gscQuery(env, site, { type: 'web', ...ukFilter(), startDate: p.start, endDate: p.end, dimensions: ['query'], rowLimit: POSITION_ROWS }),
          p.compare ? gscQuery(env, site, { type: 'web', ...ukFilter(), startDate: p.compare.start, endDate: p.compare.end, dimensions: ['query'], rowLimit: POSITION_ROWS }) : null,
        ]).catch((e) => ({ error: e instanceof GoogleError ? e.message : 'Search Console could not be read.' }))
      : null,
  ]);
  const second = [];
  q.slots.forEach((slot, i) => {
    second[slot] = b[i];
  });
  const [totalsRows, deviceRows, landingRows, aiRows, sourceRows] = a;
  const [cityRows = [], dailyRows = [], notSetRows = [], dupRows = [], internalRows = []] = second;
  const goal = q.goal;
  const t = byRange(totalsRows || []);
  const totals = { now: totalsOf(t.now[0], goal) || totalsOf({}, goal), before: p.compare ? totalsOf(t.before[0], goal) : null };

  const conv = goal.metric;
  const check = dataCheck({
    shop: goal.shop,
    hasDomain: Boolean(q.domain),
    totals: { sessions: totals.now.sessions, engagedSessions: totals.now.engaged, conv: totals.now.conv },
    sources: (sourceRows || []).map((r) => ({ name: r.sessionSource, sessions: r.sessions, engagedSessions: r.engagedSessions })),
    cities: cityRows.map((r) => ({ name: r.city, sessions: r.sessions, engagedSessions: r.engagedSessions })),
    daily: dailyRows.map((r) => ({ date: r.date, sessions: r.sessions, engagedSessions: r.engagedSessions, conv: r[conv] || 0 })),
    notSet: sum(notSetRows, 'sessions'),
    dups: dupRows.map((r) => ({ id: r.transactionId, eventCount: r.eventCount })),
    internal: sum(internalRows.filter((r) => !DEFAULT_CAMPAIGNS.has(r.sessionCampaignName)), 'eventCount'),
  });

  const dv = byRange(deviceRows || []);
  const devices = dv.now
    .map((r) => {
      const w = dv.before.find((x) => x.deviceCategory === r.deviceCategory);
      return { device: r.deviceCategory, now: { sessions: r.sessions, conv: r[conv] || 0, revenue: round2(r.purchaseRevenue || 0) }, before: w ? { sessions: w.sessions, conv: w[conv] || 0, revenue: round2(w.purchaseRevenue || 0) } : null };
    })
    .sort((x, y) => y.now.sessions - x.now.sessions);

  const landing = (landingRows || []).map((r) => ({ page: r.landingPage, sessions: r.sessions, conv: r[conv] || 0 }));

  // Where the leads (or orders) came from, by plain source name, most first.
  // Each source keeps its numbers for the comparison period too, in `before`.
  const bySource = new Map();
  for (const r of c[0] || []) {
    const k = sourceLabel(r.sessionSource, r.sessionMedium);
    const e = bySource.get(k) || { name: k, sessions: 0, conv: 0, revenue: 0, before: p.compare ? { sessions: 0, conv: 0, revenue: 0 } : null };
    const t = r.range === 'before' ? e.before : e;
    if (t) {
      t.sessions += r.sessions;
      t.conv += r[conv] || 0;
      t.revenue = round2(t.revenue + (r.purchaseRevenue || 0));
    }
    bySource.set(k, e);
  }
  const sources = [...bySource.values()].sort((x, y) => y.conv - x.conv || y.sessions - x.sessions).slice(0, 12);
  // The biggest movers in leads (or orders), for what changed: any source, even outside the top 12.
  const movers = p.compare
    ? [...bySource.values()].map((e) => ({ name: e.name, change: e.conv - e.before.conv, revenue: round2(e.revenue - e.before.revenue) })).filter((e) => e.change !== 0).sort((x, y) => Math.abs(y.change) - Math.abs(x.change) || x.name.localeCompare(y.name)).slice(0, 6)
    : [];

  // Week by week, from the first day of each period.
  const weekly = (rows, start) => {
    const out = [];
    const t0 = Date.parse(`${start}T00:00:00Z`);
    for (const r of rows || []) {
      const d = String(r.date || '');
      const at = Date.parse(`${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}T00:00:00Z`);
      const w = Math.floor((at - t0) / (7 * 864e5));
      if (!(w >= 0)) continue;
      out[w] = out[w] || { sessions: 0, conv: 0, revenue: 0 };
      out[w].sessions += r.sessions;
      out[w].conv += r[conv] || 0;
      out[w].revenue = round2(out[w].revenue + (r.purchaseRevenue || 0));
    }
    return Array.from({ length: out.length }, (_, i) => out[i] || { sessions: 0, conv: 0, revenue: 0 });
  };
  const trend = { now: weekly(dailyRows, p.start), before: p.compare ? weekly(c[1], p.compare.start) : null };

  const ai = byRange(aiRows || []);
  const fam = new Map();
  for (const [range, rows] of [['now', ai.now], ['before', ai.before]]) {
    for (const r of rows) {
      const k = aiFamily(r.sessionSource);
      const e = fam.get(k) || { name: k, now: { sessions: 0, conv: 0, revenue: 0 }, before: { sessions: 0, conv: 0, revenue: 0 } };
      e[range].sessions += r.sessions;
      e[range].conv += r[conv] || 0;
      e[range].revenue = round2(e[range].revenue + (r.purchaseRevenue || 0));
      fam.set(k, e);
    }
  }
  const aiList = [...fam.values()].sort((x, y) => y.now.sessions - x.now.sessions);
  const aiTotal = (range) => ({ sessions: sum(aiList.map((e) => e[range]), 'sessions'), conv: sum(aiList.map((e) => e[range]), 'conv'), revenue: round2(sum(aiList.map((e) => e[range]), 'revenue')) });
  const notSetMedium = sum(ai.now.filter((r) => r.sessionMedium === '(not set)'), 'sessions');

  let search = null;
  if (site) {
    if (gsc?.error) search = { site, error: gsc.error };
    else {
      const tot = (rows) => (rows[0] ? { clicks: rows[0].clicks || 0, impressions: rows[0].impressions || 0, ctr: round2((rows[0].ctr || 0) * 100), position: round2(rows[0].position || 0) } : { clicks: 0, impressions: 0, ctr: 0, position: 0 });
      search = {
        site,
        now: tot(gsc[0]),
        before: p.compare ? tot(gsc[1]) : null,
        queries: gsc[2].map((r) => ({ query: r.keys?.[0] || '', clicks: r.clicks || 0, impressions: r.impressions || 0, position: round2(r.position || 0) })),
        pages: gsc[3].map((r) => ({ page: r.keys?.[0] || '', clicks: r.clicks || 0, impressions: r.impressions || 0, position: round2(r.position || 0) })),
      };
      search.uk = brand.uk_only ? { now: search.now, before: search.before } : { now: tot(gsc[4] || []), before: p.compare ? tot(gsc[5] || []) : null };
      search.names = names.map((n, i) => ({ name: n, ...tot(gsc[6][i] || []) })).filter((n) => n.impressions > 0);
      search.positions = positionsOf(gsc[7] || [], gsc[8]);
    }
  }

  return {
    property,
    currency: a.currency || 'GBP',
    period: { start: p.start, end: p.end, days: p.days },
    compare: p.compare,
    uk_only: Boolean(brand.uk_only),
    goal: { shop: goal.shop, event: goal.event },
    totals,
    devices,
    landing,
    sources,
    movers,
    trend,
    ai: { list: aiList, now: aiTotal('now'), before: p.compare ? aiTotal('before') : null, notSetMedium },
    check,
    search,
  };
}

/* ---------- Saved audits ---------- */

export async function saveAudit(env, brand, data) {
  const row = await db(env)
    .prepare(`INSERT INTO audits (brand_id, start_date, end_date, data, created_at) VALUES (?, ?, ?, ?, ?) RETURNING id`)
    .bind(brand.id, data.period.start, data.period.end, JSON.stringify(data), now())
    .first();
  return row.id;
}

// The list reads only what it shows, so a long history stays cheap to draw.
export async function listAudits(env, brandId) {
  const { results } = await db(env)
    .prepare(`SELECT id, start_date, end_date, created_at, json_extract(data, '$.check.rating') AS rating, json_extract(data, '$.compare.kind') AS compare_kind,
      json_extract(data, '$.search.error') IS NOT NULL AS gsc_error FROM audits WHERE brand_id = ? ORDER BY created_at DESC, id DESC LIMIT 30`)
    .bind(brandId)
    .all();
  return results;
}

export async function latestAudit(env, brandId) {
  const r = await db(env).prepare(`SELECT id, start_date, end_date, data, created_at FROM audits WHERE brand_id = ? ORDER BY created_at DESC, id DESC LIMIT 1`).bind(brandId).first();
  return r ? { ...r, data: parse(r.data, {}) } : null;
}

export async function getAudit(env, brandId, id) {
  const r = await db(env).prepare(`SELECT id, start_date, end_date, data, created_at FROM audits WHERE id = ? AND brand_id = ?`).bind(id, brandId).first();
  return r ? { ...r, data: parse(r.data, {}) } : null;
}

// The bit of an audit an AI visibility report carries: visits from AI and from Google search.
export function trafficOf(audit) {
  if (!audit) return null;
  const x = audit.data;
  return { audit_id: audit.id, period: x.period, compare: x.compare, goal: x.goal, rating: x.check?.rating, ai: x.ai, search: x.search ? { now: x.search.now, before: x.search.before, error: x.search.error } : null, uk_only: x.uk_only };
}
