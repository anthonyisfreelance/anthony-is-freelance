// The overview tab: how people find the brand, on Google and in AI answers, in one page. It reads
// only what is already saved (the latest finished AI visibility run, the run before it, and the
// latest GA4 audit), so opening it costs nothing.
//
// Every sentence is written by fixed rules from the numbers, never generated text. Search terms,
// business names and page titles come from Google or from AI answers, so all of it is escaped.

import { esc, fmtDate } from '../docs/shared.js';
import { competitorsOf } from './competitors.js';
import { rangeCaps, changeWords, num, money, arrow } from './ga4view.js';
import { RATINGS } from './audit.js';

const STALE_DAYS = 45;
const GOOGLE = 'Google search';

const ordinal = (n) => `${n}${n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th'}`;
const plural = (n, one, many = `${one}s`) => `${num(n)} ${n === 1 ? one : many}`;
const dayCaps = (iso) => fmtDate(String(iso).slice(0, 10), 'long').toUpperCase();
const ageDays = (iso, today) => Math.floor((Date.parse(`${today}T12:00:00Z`) - Date.parse(String(iso).slice(0, 10) + 'T12:00:00Z')) / 86400000);

// A change in points between two runs: { text, dir, cls }.
function ptsChange(now, before) {
  if (before == null || now == null) return null;
  const d = now - before;
  if (!d) return { text: `Same as the run before (${before}%)`, dir: 0, cls: '' };
  return { text: `${d > 0 ? 'Up' : 'Down'} ${Math.abs(d)} points on the run before`, dir: Math.sign(d), cls: d > 0 ? 'good' : 'bad' };
}

// A change of place between two runs: lower is better.
function placeChange(now, before) {
  if (before == null || now == null) return null;
  const d = before - now;
  if (!d) return { text: `Same place as the run before`, dir: 0, cls: '' };
  return { text: `${d > 0 ? 'Up' : 'Down'} ${plural(Math.abs(d), 'place')} on the run before`, dir: Math.sign(d), cls: d > 0 ? 'good' : 'bad' };
}

const card = ({ label, value, chg, means, lead = false }) => `<div class="ga-card${lead ? ' lead' : ''}">
  <p class="lbl">${esc(label)}</p><p class="big">${value}</p>
  ${chg ? `<p class="chg ${chg.cls}">${arrow(chg)}${esc(chg.text)}</p>` : ''}
  <p class="means">${esc(means)}</p></div>`;

const emptyCard = (label, means, link, linkText) => `<div class="ga-card"><p class="lbl">${esc(label)}</p><p class="big none">–</p><p class="means">${esc(means)} <a href="${esc(link)}">${esc(linkText)}</a></p></div>`;

/* ---------- What the page reads ---------- */

// Everything the page shows, from the saved data. Pure, so the tests can call it.
export function overviewOf({ brand, run = null, rows = [], prevRows = null, audit = null, today = new Date().toISOString().slice(0, 10) }) {
  const c = run && rows.length ? competitorsOf(rows, brand, prevRows) : null;
  const ai = c && c.n ? c : null;
  const x = audit?.data && audit.data.totals ? audit.data : null;
  const s = x?.search && !x.search.error ? x.search : null;
  const p = s?.positions && s.positions.total?.now ? s.positions : null;
  const pageOne = (k) => (p ? p.bands.filter((b) => b.key === 'top3' || b.key === 'page1').reduce((n, b) => n + (b[k] ?? 0), 0) : null);
  const google = x ? (x.sources || []).find((e) => e.name === GOOGLE) || null : null;
  return {
    brand,
    run,
    ai,
    x,
    audit,
    search: s,
    positions: p,
    pageOne: p ? { now: pageOne('now'), before: p.total.before != null ? pageOne('before') : null, top3: p.bands.find((b) => b.key === 'top3')?.now || 0 } : null,
    google,
    stale: audit ? ageDays(audit.created_at, today) > STALE_DAYS : false,
    auditAge: audit ? ageDays(audit.created_at, today) : null,
  };
}

/* ---------- The headline ---------- */

export function overviewHeadline(o) {
  const out = [];
  const shop = o.x?.goal?.shop;
  const noun = shop ? 'orders' : 'leads';
  if (o.ai) {
    const { me, place, field, rivals } = o.ai;
    const leader = rivals[0];
    if (!me.answers) out.push(`ChatGPT didn't name you in any of ${num(o.ai.n)} answers${leader ? `; ${leader.name} is named most` : ''}.`);
    else if (place === 1) out.push(`ChatGPT names you in ${me.rate}% of answers, more than any other business.`);
    else out.push(`ChatGPT names you in ${me.rate}% of answers, ${ordinal(place)} of ${field} businesses${leader ? `, behind ${leader.name} on ${leader.rate}%` : ''}.`);
  }
  if (o.pageOne) {
    const { now, before } = o.pageOne;
    const was = before == null || before === now ? '' : `, ${before > now ? 'down' : 'up'} from ${num(before)}`;
    out.push(now ? `On Google you're on page one for ${plural(now, 'UK search', 'UK searches')}${was}.` : `On Google you're not on page one for any UK search yet${was}.`);
  }
  if (o.x) {
    const t = o.x.totals.now;
    const found = (o.google?.conv || 0) + (o.x.ai?.now?.conv || 0);
    if (t.conv) out.push(`Google search and AI assistants brought in ${num(found)} of your ${num(t.conv)} ${noun}.`);
    else out.push(`No ${noun} were recorded in the GA4 period.`);
    if (o.x.check?.rating === 'unreliable') out.push('The GA4 data check found serious problems, so treat the visits and leads as rough.');
  }
  return out.join(' ');
}

/* ---------- What to do next ---------- */

export function overviewActions(o, h) {
  const out = [];
  const shop = o.x?.goal?.shop;
  if (o.x && o.x.check?.rating !== 'clean') {
    const first = (o.x.check.checks || []).find((k) => k.level !== 'ok');
    out.push({
      title: 'Check the data before acting on it',
      why: `The GA4 data check says ${RATINGS[o.x.check.rating].toLowerCase()}${first ? `: ${first.title.charAt(0).toLowerCase()}${first.title.slice(1)} (${esc(first.value)})` : ''}.`,
      todo: 'Open the data check and fix what it flags in GA4, then run a fresh audit. The Google positions are not affected.',
      where: [h.check, 'The data check'],
    });
  }
  if (!o.run) out.push({ title: 'Run AI visibility', why: 'There is no finished run yet, so there is nothing on AI answers or competitors.', todo: 'Add the prompts in Settings, then press Run now on the AI visibility tab.', where: [h.ai, 'AI visibility'] });
  if (!o.audit) out.push({ title: 'Run a GA4 audit', why: 'There is no audit yet, so there is nothing on Google positions, visits or leads.', todo: `Give the platform read access to GA4 and Search Console (the steps are on the GA4 tab), then run an audit.`, where: [h.ga4, 'The GA4 tab'] });
  else if (o.stale) out.push({ title: 'Run a fresh GA4 audit', why: `The latest audit is ${plural(o.auditAge, 'day')} old.`, todo: 'Run a new one for the last 28 or 90 days, so the Google and visits numbers line up with the AI run.', where: [h.ga4, 'The GA4 tab'] });
  const drop = o.positions?.down?.find((r) => r.before < 10.5) || null;
  if (drop) {
    const gone = drop.now >= 10.5;
    out.push({
      title: gone ? `Win back “${esc(drop.query)}”` : `Hold on to “${esc(drop.query)}”`,
      why: gone ? `It was on page one at ${drop.before.toFixed(1)} and is now ${drop.now.toFixed(1)}, off page one.` : `It slipped from ${drop.before.toFixed(1)} to ${drop.now.toFixed(1)}, the biggest drop on page one.`,
      todo: 'Search it yourself and see who has taken your place. Check the page that ranked for it still answers that search plainly, and link to it from your homepage.',
      where: [h.ga4, 'Google positions'],
    });
  }
  const listed = o.ai?.listed?.[0];
  if (listed) {
    out.push({
      title: `Get onto ${esc(listed.domain)}`,
      why: `Cited in ${plural(listed.without, 'AI answer')} that name ${listed.names.length ? listed.names.map(esc).join(', ') : 'a competitor'} and not you.`,
      todo: 'Ask the author to add you, or take a listing where they sell one. The next pages to go after are on the Competitors tab.',
      where: [h.listed, 'Where to get listed'],
    });
  }
  const near = o.positions?.nearly || [];
  if (near.length) {
    out.push({
      title: `Move ${plural(near.length, 'search', 'searches')} from page two to page one`,
      why: `On page two: ${near.slice(0, 3).map((r) => `“${esc(r.query)}” (${r.position.toFixed(1)})`).join(', ')}${near.length > 3 ? ` and ${near.length - 3} more` : ''}. Page two gets few clicks.`,
      todo: 'Give each one a page that answers it in plain words, with a clear title, and link to it from pages that already rank.',
      where: [h.ga4, 'Google positions'],
    });
  }
  const leader = o.ai?.rivals?.[0];
  if (o.ai && o.ai.place !== 1 && leader) {
    out.push({
      title: `Close the gap on ${esc(leader.name)}`,
      why: `Named in ${leader.rate}% of answers to your ${o.ai.me.rate}%.`,
      todo: 'See how the answers describe them against you, and which pages list them and not you.',
      where: [h.competitors, 'Competitors'],
    });
  }
  if (o.x && !shop && o.x.totals.now.conv && !(o.x.ai?.now?.conv) && o.x.ai?.now?.sessions >= 20) {
    out.push({ title: 'Turn AI visits into leads', why: `${num(o.x.ai.now.sessions)} visits from AI assistants and no leads.`, todo: 'Look at which pages they land on and make the next step obvious there.', where: [h.ga4, 'The GA4 tab'] });
  }
  return out.slice(0, 4);
}

/* ---------- The page ---------- */

function summaryBlock(o, h) {
  const shop = o.x?.goal?.shop;
  const cards = [];
  if (o.ai) {
    const { me, n } = o.ai;
    cards.push(card({ label: 'Named by ChatGPT', value: `${me.rate}%`, chg: ptsChange(me.rate, me.before?.rate), means: `Of ${num(n)} answers to questions that don't name you.`, lead: true }));
    const leader = o.ai.rivals[0];
    cards.push(card({
      label: 'Against competitors',
      value: me.answers ? ordinal(o.ai.place) : '–',
      chg: me.answers ? placeChange(o.ai.place, o.ai.prevPlace) : null,
      means: me.answers ? `Of ${plural(o.ai.field, 'business', 'businesses')} named, by visibility score.${o.ai.place !== 1 && leader ? ` ${leader.name} is first.` : ''}` : `Not named.${leader ? ` ${leader.name} is first.` : ''}`,
    }));
  } else {
    cards.push(emptyCard('Named by ChatGPT', 'No finished AI visibility run yet.', h.ai, 'Run one'));
    cards.push(emptyCard('Against competitors', 'Shows after the first run.', h.ai, 'AI visibility'));
  }
  if (o.pageOne) {
    cards.push(card({ label: 'Google page one', value: num(o.pageOne.now), chg: o.x.compare && o.pageOne.before != null ? changeWords(o.pageOne.now, o.pageOne.before, o.x) : null, means: `UK searches where you show in the top 10. ${num(o.pageOne.top3)} in the top 3.` }));
  } else {
    cards.push(emptyCard('Google page one', o.x ? 'Search Console is not connected for this brand.' : 'No GA4 audit yet.', h.ga4, 'The GA4 tab'));
  }
  if (o.x) {
    const g = o.google;
    const a = o.x.ai;
    const now = (g?.conv || 0) + (a?.now?.conv || 0);
    const before = o.x.compare ? (g?.before?.conv || 0) + (a?.before?.conv || 0) : null;
    const total = o.x.totals.now.conv;
    const label = shop ? 'Orders, search and AI' : 'Leads, search and AI';
    const split = `${num(g?.conv || 0)} from Google, ${num(a?.now?.conv || 0)} from AI assistants`;
    const worth = shop ? ` Worth ${money((g?.revenue || 0) + (a?.now?.revenue || 0), o.x.currency)}.` : '';
    cards.push(card({ label, value: num(now), chg: changeWords(now, before, o.x), means: total ? `${split}, of ${num(total)} in all.${worth}` : 'None recorded in the GA4 period.' }));
  } else {
    cards.push(emptyCard(shop ? 'Orders, search and AI' : 'Leads, search and AI', 'No GA4 audit yet.', h.ga4, 'The GA4 tab'));
  }

  const when = [o.run ? `AI ANSWERS FROM ${dayCaps(o.run.started_at)}` : '', o.x ? `GOOGLE AND VISITS ${rangeCaps(o.x.period.start, o.x.period.end)}` : ''].filter(Boolean);
  const r = o.x?.check?.rating;
  const badge = r ? `<a class="ga-badge ${r}" href="${esc(h.check)}"><span class="dot"></span>Data check: ${esc(RATINGS[r]).toLowerCase()}</a>` : '';
  const headline = overviewHeadline(o);
  const acts = overviewActions(o, h);
  const steps = acts
    .map((a, i) => `<li><span class="n">${String(i + 1).padStart(2, '0')}</span><div class="step"><h3>${a.title}</h3><dl class="step-rows"><div><dt>Why</dt><dd>${a.why}</dd></div><div><dt>Do</dt><dd>${a.todo}</dd></div><div class="measure"><dt>See</dt><dd><a href="${esc(a.where[0])}">${esc(a.where[1])}</a></dd></div></dl></div></li>`)
    .join('');
  return `<section class="summary ga2 ov" aria-label="Overview">
    <div class="ga-head">
      <div><p class="ga-when">How people find you</p>${when.map((w) => `<p class="ga-vs">${esc(w)}</p>`).join('')}</div>
      ${badge}
    </div>
    ${headline ? `<p class="ga-headline">${esc(headline)}</p>` : ''}
    <div class="ga-cards">${cards.join('')}</div>
    <div class="sum-next"><h2>What to do next</h2>${steps ? `<ol class="steps">${steps}</ol>` : '<p class="muted">Nothing stands out right now.</p>'}</div>
  </section>`;
}

// From being seen to getting in touch, for Google and for AI assistants side by side.
function journeyBlock(o) {
  if (!o.x && !o.ai) return '';
  const shop = o.x?.goal?.shop;
  const x = o.x;
  const cell = (big, small, chg = null) => `<td><b>${big}</b>${chg ? `<span class="chg ${chg.cls}">${arrow(chg)}${esc(chg.text)}</span>` : ''}<span>${esc(small)}</span></td>`;
  const none = (why) => `<td class="muted">${esc(why)}</td>`;
  const uk = o.search?.uk;
  const g = o.google;
  const a = x?.ai;
  const goalCell = (now, before, revenue) => cell(num(now), shop ? `${now === 1 ? 'order' : 'orders'}, ${money(revenue || 0, x.currency)}` : now === 1 ? 'lead' : 'leads', x ? changeWords(now, before, x) : null);
  const googleRow = `<tr><th>Google</th>
    ${uk ? cell(num(uk.now.impressions), 'times in UK results', x.compare ? changeWords(uk.now.impressions, uk.before?.impressions, x) : null) : none(x ? 'Search Console not connected.' : 'No GA4 audit yet.')}
    ${x ? cell(num(g?.sessions || 0), 'visits from Google search', x.compare ? changeWords(g?.sessions || 0, g?.before?.sessions || 0, x) : null) : none('No GA4 audit yet.')}
    ${x ? goalCell(g?.conv || 0, x.compare ? g?.before?.conv || 0 : null, g?.revenue) : none('No GA4 audit yet.')}</tr>`;
  const aiRow = `<tr><th>AI assistants</th>
    ${o.ai ? cell(`${o.ai.me.rate}%`, 'of ChatGPT answers name you', ptsChange(o.ai.me.rate, o.ai.me.before?.rate)) : none('No AI visibility run yet.')}
    ${x ? cell(num(a.now.sessions), 'visits from AI assistants', x.compare ? changeWords(a.now.sessions, a.before?.sessions, x) : null) : none('No GA4 audit yet.')}
    ${x ? goalCell(a.now.conv, x.compare ? a.before?.conv ?? 0 : null, a.now.revenue) : none('No GA4 audit yet.')}</tr>`;
  return `<section class="sec full ov-journey"><h2>From being seen to ${shop ? 'buying' : 'getting in touch'}</h2>
    <p class="sec-note">Where people see you, how many click through, and how many ${shop ? 'buy' : 'send an enquiry'}. Changes are against the run before for ChatGPT and against ${x?.compare?.kind === 'year' ? 'last year' : 'the period before'} for the rest.</p>
    <div class="table-wrap"><table class="journey"><thead><tr><th></th><th>Seen</th><th>Visited</th><th>${shop ? 'Bought' : 'Got in touch'}</th></tr></thead><tbody>${googleRow}${aiRow}</tbody></table></div>
    <p class="sec-note">Seen on Google is Search Console, UK only. Visits and ${shop ? 'orders' : 'leads'} are GA4${o.brand.uk_only ? ', UK visitors only' : ''}. ChatGPT is the AI visibility run.</p>
  </section>`;
}

function deeperBlock(o, h) {
  const items = [
    [h.ai, 'AI visibility', o.ai ? `Every answer from the run, the groups of questions, and the pages ChatGPT cites.` : 'Set up the prompts and run the first check.'],
    [h.competitors, 'Competitors', o.ai ? `${plural(o.ai.rivals.length, 'competitor')} side by side, how each is described, and where to get listed.` : 'Shows after the first run.'],
    [h.ga4, 'GA4', o.x ? 'Visits, leads and revenue by source, week by week, Google positions and the data check.' : 'Connect GA4 and Search Console, then run an audit.'],
  ];
  return `<section class="sec full"><h2>The detail</h2><div class="ov-deeper">${items.map(([href, t, d]) => `<a href="${esc(href)}"><b>${esc(t)}</b><span>${esc(d)}</span></a>`).join('')}</div></section>`;
}

export function overviewTab({ brand, run = null, rows = [], prevRows = null, audit = null, today, hrefs }) {
  const h = hrefs || {
    ai: `/admin/brands/${brand.slug}/`,
    competitors: `/admin/brands/${brand.slug}/competitors/`,
    listed: `/admin/brands/${brand.slug}/competitors/#listed`,
    ga4: `/admin/brands/${brand.slug}/ga4/`,
    check: `/admin/brands/${brand.slug}/ga4/#check`,
  };
  const o = overviewOf({ brand, run, rows, prevRows, audit, today });
  return [summaryBlock(o, h), journeyBlock(o), deeperBlock(o, h)].join('\n');
}

export const OVERVIEW_CSS = `
.ov .ga-vs + .ga-vs { margin-top: 4px; }
.ov .ga-card .big.none { color: #6b6b6b; }
.ov .ga-card .means a { color: var(--on-desk); }
.journey th, .journey td { vertical-align: top; }
.journey thead th { font: 500 13px/1.2 var(--display); letter-spacing: 0.02em; text-transform: uppercase; color: var(--muted); }
.journey tbody th { width: 18%; font: 500 18px/1.3 var(--display); text-transform: uppercase; text-align: left; }
.journey td b { display: block; font: 500 36px/1.05 var(--display); }
.journey td span { display: block; margin-top: 6px; font: 400 15px/1.4 var(--serif); color: var(--muted); }
.journey td .chg { font: 500 14px/1.35 var(--display); color: var(--ink); }
.journey td .chg.good { color: #0d7a3f; }
.journey td .chg.bad { color: var(--red); }
.ov-deeper { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.ov-deeper a { display: block; padding: 24px; background: var(--box); color: var(--ink); text-decoration: none; border-top: 3px solid transparent; }
.ov-deeper a:hover, .ov-deeper a:focus-visible { border-top-color: var(--blue); }
.ov-deeper b { display: block; font: 500 22px/1.2 var(--display); text-transform: uppercase; }
.ov-deeper b::after { content: ' →'; color: var(--blue); }
.ov-deeper span { display: block; margin-top: 8px; font: 400 15px/1.45 var(--serif); color: var(--muted); }
@media (max-width: 760px) {
  .ov-deeper { grid-template-columns: 1fr; }
  .journey td b { font-size: 28px; }
}
`;
