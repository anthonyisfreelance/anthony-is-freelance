// Reports (phase 2): any finished run, or two runs side by side, as an A4 sheet at a private link,
// with the same sheet as a PDF.
//
//   Kinds:   snapshot   one run
//            compare    a before run and an after run
//   Status:  draft -> approved -> sent. Withdraw turns the link off at once (withdrawn_at), Restore
//            turns it back on. Only approved and sent reports open for anyone without the admin
//            login; drafts open only for Anthony.
//
// A report keeps its own copy of the numbers (`data`), taken when it is made, so it never changes
// under the client's feet if runs are re-scored later. A draft can take a fresh copy (Refresh).
//
// The recommendations section is Anthony's alone: empty unless he writes in it, never generated.
// Everything from AI answers (names, excerpts, titles, links) is escaped.

import { esc, fmtDate, masthead, eyebrow, legalFooter, shell, topBar, downloadLink, backLink } from '../docs/shared.js';
import { db, parse, now } from './db.js';
import { summarise, leaderboard, LIMITS, safeLink, phoneFrame, PHONE_CSS } from './dashboard.js';
import { namePattern, domainOf } from './text.js';

export const REPORT_KINDS = { snapshot: 'AI visibility snapshot', compare: 'AI visibility before and after' };

const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);
const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const posText = (p) => (p == null ? '–' : (Math.round(p * 10) / 10).toFixed(1));

/* ---------- The numbers, frozen ---------- */

// Every answer in a run with its score, text included (for the excerpts).
export async function runRows(env, runId) {
  const { results } = await db(env)
    .prepare(`SELECT a.id, a.prompt_id, a.prompt_text, a.grp, a.attempt, a.status, a.model, a.text, a.citations, a.searches, a.input_tokens, a.output_tokens,
      s.status AS s_status, s.brand_named, s.brand_position, s.domain_cited, s.recommended, s.above, s.flags
      FROM answers a LEFT JOIN scores s ON s.answer_id = a.id WHERE a.run_id = ? ORDER BY a.id`)
    .bind(runId)
    .all();
  return results;
}

// The numbers a report shows for one run, worked out once and kept with the report.
export function freezeRun(run, rows, brand) {
  const m = summarise(rows, brand);
  const names = [brand.name, ...(brand.match_names || [])];
  const branded = (text) => Boolean(namePattern(names)?.test(text));
  const done = (list) => list.filter((r) => r.status === 'done' && r.s_status);
  const open = done(rows).filter((r) => !branded(r.prompt_text));
  const parsed = m.prompts.flatMap((p) => p.answers).filter((r) => r.status === 'done' && r.s_status && !branded(r.prompt_text));
  const all = leaderboard(parsed, brand);
  const inGroup = (g) => leaderboard(parsed.filter((r) => r.grp === g), brand);
  const gA = inGroup('A');
  const gB = inGroup('B');
  const rate = (b) => (b.n ? pct(b.me?.answers || 0, b.n) : null);
  const top = all.ranked.slice(0, 5);
  if (all.me && !top.includes(all.me)) top.push(all.me);
  const questions = new Set(open.map((r) => r.prompt_id)).size;
  return {
    run: { id: run.id, started_at: run.started_at, completed_at: run.completed_at, attempts: run.attempts, total: m.total, model: rows.find((r) => r.model)?.model || null },
    done: m.done,
    failed: m.failed,
    scored: m.scored,
    questions,
    questionsAll: m.prompts.length,
    openAnswers: all.n,
    score: { score: all.me?.score || 0, rank: all.scoreRank, of: all.ranked.length, top: top.map((e) => ({ name: e.isBrand ? brand.name : e.name, score: e.score, me: e.isBrand })) },
    rates: { all: rate(all), A: rate(gA), B: rate(gB) },
    ranks: { all: all.rank, A: gA.rank, B: gB.rank, ofAll: all.list.length, ofA: gA.list.length, ofB: gB.list.length },
    leaders: Object.fromEntries([['all', all], ['A', gA], ['B', gB]].map(([k, g]) => [k, g.leader ? { name: g.leader.name, pct: pct(g.leader.answers, g.n) } : null])),
    share: all.mentions ? Math.round(((all.me?.answers || 0) / all.mentions) * 100) : 0,
    position: m.position,
    ownCited: pct(m.ownCited, m.scored),
    groups: m.groups.map((g) => ({ key: g.key, label: g.label, answers: g.answers, named: g.named, position: g.position, ownCited: g.ownCited })),
    instead: all.list.filter((e) => !e.isBrand).slice(0, 10).map((e) => ({ name: e.name, pct: pct(e.answers, all.n) })),
    domains: m.topDomains.slice(0, 8).map((d) => ({ domain: d.domain, own: d.own, pct: pct(d.answers, m.scored) })),
    pages: m.topPages.filter((p) => !p.own).slice(0, 5).map((p) => ({ url: p.url, title: p.title, answers: p.answers })),
    excerpts: excerpts(parsed, brand),
  };
}

// A few short excerpts: up to two where the brand is named, and one general question where it isn't.
function excerpts(rows, brand) {
  const re = namePattern([brand.name, ...(brand.match_names || [])]);
  const plain = (t) => String(t || '').replace(/\*\*|__|`/g, '').replace(/^#+\s*/gm, '').replace(/^\s*\|.*\|\s*$/gm, ' ').replace(/^[-*]\s+/gm, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\s+/g, ' ').trim();
  // About 300 characters around the brand's first mention, starting and ending on whole sentences.
  const cut = (text, at) => {
    let from = 0;
    if (at > 160) {
      const stop = text.lastIndexOf('. ', at - 1);
      from = stop > 0 ? stop + 2 : text.indexOf(' ', Math.max(0, at - 120)) + 1;
    }
    let out = text.slice(from, from + 300);
    if (from + 300 < text.length) {
      const end = out.lastIndexOf('. ');
      out = end > 140 ? out.slice(0, end + 1) : `${out.replace(/\s+\S*$/, '')} …`;
    }
    out = out.replace(/\s\d+\.$/, ''); // a numbered list's next number, left hanging
    return (from > 0 ? '… ' : '') + out.trim();
  };
  const out = [];
  for (const g of ['A', 'B', 'C', 'D', 'E']) {
    const r = rows.find((x) => x.grp === g && x.brand_named && x.text && !out.some((o) => o.prompt === x.prompt_text));
    if (!r) continue;
    const t = plain(r.text);
    const m = re ? new RegExp(re.source, 'iu').exec(t) : null;
    out.push({ prompt: r.prompt_text, named: true, text: cut(t, m ? m.index : 0) });
    if (out.length === 2) break;
  }
  const miss = rows.find((x) => x.grp === 'A' && !x.brand_named && x.text);
  if (miss) out.push({ prompt: miss.prompt_text, named: false, text: cut(plain(miss.text), 0) });
  return out;
}

/* ---------- Storing reports ---------- */

export async function listReports(env, brandId) {
  const { results } = await db(env)
    .prepare(`SELECT id, token, kind, title, status, withdrawn_at, recipient_name, recipient_email, run_id, before_run_id, created_at, approved_at, sent_at FROM reports WHERE brand_id = ? ORDER BY created_at DESC`)
    .bind(brandId)
    .all();
  return results;
}

export async function getReport(env, where, value) {
  const row = await db(env).prepare(`SELECT * FROM reports WHERE ${where === 'token' ? 'token' : 'id'} = ?`).bind(value).first();
  return row ? { ...row, data: parse(row.data, {}) } : null;
}

export function defaultTitle(kind, brand, after, before) {
  if (kind === 'compare' && before) return `${brand.name}: AI visibility, ${fmtDate(before.started_at, 'long')} to ${fmtDate(after.started_at, 'long')}`;
  return `${brand.name}: AI visibility, ${fmtDate(after.started_at, 'long')}`;
}

/* ---------- The sheet ---------- */

const delta = (now, before, unit = ' pts') => {
  if (before == null || now == null) return '';
  const d = now - before;
  return `<span class="d ${d > 0 ? 'up' : d < 0 ? 'down' : ''}">${d > 0 ? '+' : ''}${d}${unit}</span>`;
};

// The top of the report, like the summary on the AI visibility tab: the homepage on a phone, the
// visibility score with the top five, then the four headline numbers, each with where the brand
// stands among the businesses named in the same answers.
function standing(rate, rank, of, leader) {
  if (rate == null) return { cls: '', text: 'No answers' };
  if (!rank) return { cls: 'behind', text: leader ? `Not named. ${leader.name} leads with ${leader.pct}%` : 'Not named' };
  if (rank === 1) return { cls: 'ahead', text: `Most named of ${of}` };
  return { cls: rank <= 3 ? 'close' : 'behind', text: `#${rank} of ${of}. ${leader?.name || ''} leads with ${leader?.pct ?? 0}%` };
}

function panel(a, b, screen) {
  const since = b ? ` since ${fmtDate(b.run.started_at)}` : '';
  const chg = (now, before, unit = ' pts') => {
    if (!b || before == null || now == null) return '';
    const d = now - before;
    return `<p class="chg ${d > 0 ? 'up' : d < 0 ? 'down' : ''}">${d === 0 ? 'No change' : `${d > 0 ? '+' : ''}${d}${unit}`}${since}</p>`;
  };
  const top = a.score.top;
  const max = Math.max(1, ...top.map((e) => e.score));
  const place = a.score.rank ? (a.score.rank === 1 ? `Highest of ${a.score.of} businesses named` : `#${a.score.rank} of ${a.score.of} businesses named`) : 'Not named in these answers';
  const placeCls = a.score.rank === 1 ? 'ahead' : a.score.rank && a.score.rank <= 3 ? 'close' : 'behind';
  const num = (value, label, st, before) => `<div><p class="big">${value == null ? '–' : `${value}%`}</p><p class="lbl">${esc(label)}</p>${st ? `<p class="verdict ${st.cls}">${esc(st.text)}</p>` : ''}${chg(value, before)}</div>`;
  const share = a.share >= 30 ? { cls: 'ahead', text: 'Category leader level (30% and up)' } : a.share >= 20 ? { cls: 'ahead', text: 'Strong (20 to 30%)' } : a.share >= 10 ? { cls: 'close', text: 'In the running (10 to 20%)' } : { cls: 'behind', text: 'Low (under 10%)' };
  return `<section class="rp${screen ? ' with-phone' : ''}" aria-label="Summary">
    ${screen ? `<figure class="rp-phone">${phoneFrame(screen)}<figcaption>${esc(domainOf(screen.url))}${screen.taken_at ? ` · ${esc(fmtDate(screen.taken_at))}` : ''}</figcaption></figure>` : ''}
    <div class="rp-score">
      <p class="eyebrow-d">Visibility score</p>
      <p class="score"><span class="blue">${a.score.score}</span><small>/100</small></p>
      ${chg(a.score.score, b?.score.score, '')}
      <p class="verdict ${placeCls}">${esc(place)}</p>
      <ol class="rp-top">${top.map((e) => `<li${e.me ? ' class="me"' : ''}><span class="who">${esc(e.name)}</span><span class="sbar"><span style="width:${Math.round((e.score / max) * 100)}%"></span></span><span class="pts">${e.score}</span></li>`).join('')}</ol>
    </div>
    <div class="rp-nums">
      ${num(a.rates.all, `of answers name you, on ${plural(a.questions, 'question')} that don't name you first`, standing(a.rates.all, a.ranks.all, a.ranks.ofAll, a.leaders.all), b?.rates.all)}
      ${num(a.rates.A, 'when buyers just ask for the best', standing(a.rates.A, a.ranks.A, a.ranks.ofA, a.leaders.A), b?.rates.A)}
      ${num(a.rates.B, 'when they ask for freelance or independent', standing(a.rates.B, a.ranks.B, a.ranks.ofB, a.leaders.B), b?.rates.B)}
      ${num(a.share, 'of all the business mentions in those answers are you', share, b?.share)}
    </div>
  </section>`;
}

function groupTable(a, b) {
  const was = new Map((b?.groups || []).map((g) => [g.key, g]));
  const rows = a.groups
    .map((g) => {
      const w = was.get(g.key);
      const now = pct(g.named, g.answers);
      return `<tr><td>${esc(g.key)}. ${esc(g.label)}</td><td class="r">${g.answers}</td><td class="r">${g.answers ? `${now}%` : '–'}${b && w?.answers ? ` ${delta(now, pct(w.named, w.answers))}` : ''}</td><td class="r">${posText(g.position)}</td><td class="r">${g.answers ? `${pct(g.ownCited, g.answers)}%` : '–'}</td></tr>`;
    })
    .join('');
  return `<section class="sec full"><h2>By group of questions</h2>
    <table class="rtable"><thead><tr><th>Group</th><th class="r">Answers</th><th class="r">Named</th><th class="r">Avg position</th><th class="r">Own site cited</th></tr></thead><tbody>${rows}</tbody></table></section>`;
}

function insteadTable(a, b) {
  const was = new Map((b?.instead || []).map((e) => [e.name.toLowerCase(), e.pct]));
  const rows = a.instead.map((e, i) => `<tr><td><span class="n">${i + 1}</span>${esc(e.name)}</td><td class="r">${e.pct}%${b && was.has(e.name.toLowerCase()) ? ` ${delta(e.pct, was.get(e.name.toLowerCase()))}` : ''}</td></tr>`).join('');
  return `<section class="sec full"><h2>Who is named instead</h2>
    <p class="sec-note">The other businesses recommended in the same answers, by share of answers naming them.</p>
    <table class="rtable"><thead><tr><th>Business</th><th class="r">Named in</th></tr></thead><tbody>${rows || '<tr><td colspan="2">Nobody else was named.</td></tr>'}</tbody></table></section>`;
}

function sourcesTable(a) {
  const sites = a.domains.map((d) => `<tr><td>${esc(d.domain)}${d.own ? ' <span class="own">Own site</span>' : ''}</td><td class="r">${d.pct}%</td></tr>`).join('');
  const pages = a.pages.map((p) => `<li>${safeLink(p.url, p.title || p.url)}<span class="url">${esc(domainOf(p.url))}</span></li>`).join('');
  return `<section class="sec full"><h2>Most cited sources</h2>
    <p class="sec-note">The sites ChatGPT links to as its sources, by share of answers citing them. Third-party lists here are the ones that shape its answers.</p>
    <table class="rtable"><thead><tr><th>Site</th><th class="r">Cited in</th></tr></thead><tbody>${sites || '<tr><td colspan="2">No sources cited.</td></tr>'}</tbody></table>
    ${pages ? `<h3 class="sub-h">Most cited third-party pages</h3><ol class="rlinks">${pages}</ol>` : ''}</section>`;
}

function excerptBlock(a) {
  if (!a.excerpts?.length) return '';
  return `<section class="sec full"><h2>What ChatGPT said</h2>
    <ul class="quotes">${a.excerpts.map((e) => `<li><p class="q">“${esc(e.prompt)}”</p><blockquote>${esc(e.text)}</blockquote><p class="tag">${e.named ? 'Named' : 'Not named'}</p></li>`).join('')}</ul></section>`;
}

function recommendations(text) {
  const t = String(text || '').trim();
  if (!t) return '';
  return `<section class="sec full recs-sec"><h2>Recommendations</h2><div class="prose">${t.split(/\n\s*\n/).map((para) => `<p>${esc(para.trim()).replace(/\n/g, '<br>')}</p>`).join('')}</div></section>`;
}

function method(a, b) {
  const runs = b
    ? `Two runs: ${fmtDate(b.run.started_at, 'long')} (${plural(b.done, 'answer')}) and ${fmtDate(a.run.started_at, 'long')} (${plural(a.done, 'answer')}).`
    : `One run on ${fmtDate(a.run.started_at, 'long')}: ${plural(a.done, 'answer')}${a.failed ? `, ${a.failed} failed` : ''}.`;
  return `<section class="fine rmethod"><h2>Method</h2>
    <p>${runs} Engine: ChatGPT, through the OpenAI API with web search on and the location set to the United Kingdom${a.run.model ? ` (model ${esc(a.run.model)})` : ''}. Each question asked ${plural(a.run.attempts || 3, 'time')}. The headline numbers count only the questions that don't name the business, since those always name it back.</p>
    <p>Visibility score: each answer gives a business points for where it is recommended (first 100, second 85, third 70, fourth 55, lower 40, mentioned outside the list 30, left out 0), averaged across the answers. Every business is scored the same way, so the score shows how they compare.</p>
    <p>${LIMITS.map(esc).join(' ')}</p>
  </section>`;
}

export function compareLine(a, b, brand) {
  const days = Math.round((Date.parse(a.run.started_at) - Date.parse(b.run.started_at)) / 864e5);
  const launch = brand.launch_date && brand.launch_date > b.run.started_at.slice(0, 10) && brand.launch_date <= a.run.started_at.slice(0, 10)
    ? `, before and after the launch on ${fmtDate(brand.launch_date, 'long')}` : '';
  return `Comparing ChatGPT's answers on ${fmtDate(b.run.started_at, 'long')} with ${fmtDate(a.run.started_at, 'long')}, ${plural(days, 'day')} apart${launch}.`;
}

export function reportPage({ base, report, brand, pdf = false, admin = false }) {
  const a = report.data.after || report.data;
  const b = report.kind === 'compare' ? report.data.before : null;
  const intro = b
    ? compareLine(a, b, brand)
    : `ChatGPT was asked ${plural(a.questionsAll || a.questions, 'question')} a UK buyer might ask, ${plural(a.run.attempts || 3, 'time')} each, on ${fmtDate(a.run.started_at, 'long')}. This is how it answered.`;
  const status = report.withdrawn_at ? 'Withdrawn' : report.status === 'draft' ? 'Draft' : '';
  const bar = pdf ? '' : topBar(`${admin ? backLink(`/admin/brands/${brand.slug}/reports/${report.id}/`, status ? `${status}: back to the report settings` : 'Report settings') : '<span></span>'}${downloadLink(`/report/${report.token}/report.pdf`)}`);
  const body = `
  ${masthead(REPORT_KINDS[report.kind] || 'AI visibility', fmtDate(a.run.started_at, 'long'))}
  <div class="rhead"><h1>${eyebrow(brand.name)}${esc(b ? 'AI visibility: before and after' : 'AI visibility')}</h1>
  <p class="standfirst">${esc(intro)}</p></div>
  ${panel(a, b, report.data.screen || null)}
  ${groupTable(a, b)}
  ${insteadTable(a, b)}
  ${sourcesTable(a)}
  ${excerptBlock(a)}
  ${recommendations(report.recommendations)}
  ${method(a, b)}
  ${legalFooter()}`;
  return shell({ title: report.title, base, body, css: REPORT_CSS, bar });
}

export const REPORT_CSS = `
.rhead h1 { margin: 0; font: 500 40px/1.05 var(--display); text-transform: uppercase; }
.rhead .standfirst { margin-top: 16px; font-size: 16px; line-height: 1.5; max-width: 560px; }
.sheet > .rp { margin-top: 32px; }
.rp { padding: 32px; background: var(--desk); color: var(--on-desk); break-inside: avoid; }
.rp.with-phone { display: grid; grid-template-columns: 168px minmax(0, 1fr); grid-template-areas: "phone score" "nums nums"; column-gap: 32px; }
.rp-phone { grid-area: phone; margin: 0; }
.rp-phone figcaption { margin-top: 10px; font: 500 11px/1.3 var(--display); color: #9a9a9a; text-align: center; }
.rp-score { grid-area: score; min-width: 0; }
.rp .eyebrow-d { font: 500 13px/1 var(--display); letter-spacing: 0.02em; text-transform: uppercase; color: #9a9a9a; }
.rp .score { margin-top: 10px; font: 500 96px/0.9 var(--display); letter-spacing: -0.02em; }
.rp .score .blue { color: var(--blue); }
.rp .score small { margin-left: 4px; font-size: 26px; color: #9a9a9a; letter-spacing: 0; }
.rp .verdict { margin-top: 12px; padding-left: 10px; border-left: 3px solid #6b6b6b; font: 500 13px/1.35 var(--display); color: var(--on-desk); }
.rp .verdict.ahead { border-color: #2fbf71; }
.rp .verdict.close { border-color: #f2b632; }
.rp .verdict.behind { border-color: #ff5a5a; }
.rp .chg { margin-top: 8px; font: 500 12px/1.3 var(--display); color: #9a9a9a; }
.rp .chg.up { color: #6fd08c; }
.rp .chg.down { color: #ff7a7a; }
.rp-top { list-style: none; margin: 20px 0 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.rp-top li { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr) 28px; align-items: center; gap: 10px; font: 500 13px/1.2 var(--display); color: #cfcfcf; }
.rp-top .who { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.rp-top .sbar { display: block; height: 7px; background: #2a2a2a; }
.rp-top .sbar > span { display: block; height: 100%; background: #8a8a8a; }
.rp-top .pts { text-align: right; }
.rp-top li.me { color: var(--on-desk); }
.rp-top li.me .sbar > span { background: var(--blue); }
.rp-nums { grid-area: nums; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; margin-top: 28px; padding-top: 24px; border-top: 1px solid #393939; }
.rp-nums .big { font: 500 46px/0.95 var(--display); }
.rp-nums > div:first-child .big { color: var(--blue); }
.rp-nums .lbl { margin-top: 8px; font: 500 12px/1.3 var(--display); color: #cfcfcf; }
.rp-nums .verdict { font-size: 12px; }
${PHONE_CSS}
.d { margin-left: 6px; font: 500 13px/1 var(--display); color: var(--muted); vertical-align: middle; }
.d.up { color: #0d7a3f; }
.d.down { color: var(--red); }
.sec { break-inside: avoid; }
.sec.full > h2 { margin: 0 0 12px; font: 500 18px/1.2 var(--display); text-transform: uppercase; }
.sec-note { margin-bottom: 12px; color: var(--muted); }
.sub-h { margin: 20px 0 8px; font: 500 14px/1.3 var(--display); text-transform: uppercase; }
table.rtable { width: 100%; border-collapse: collapse; font: 500 14px/1.3 var(--display); }
table.rtable th { padding: 6px 8px 6px 0; border-bottom: 1px solid var(--line); text-align: left; font-weight: 500; color: var(--muted); }
table.rtable td { padding: 7px 8px 7px 0; border-bottom: 1px solid var(--line); vertical-align: top; }
table.rtable .r { text-align: right; padding-right: 0; white-space: nowrap; }
table.rtable tr.me td { color: var(--blue); }
table.rtable .w-bar { width: 38%; }
.rbar { display: block; height: 8px; margin-top: 4px; background: var(--line); }
.rbar > span { display: block; height: 100%; background: #8a8a8a; }
tr.me .rbar > span { background: var(--blue); }
.n { display: inline-block; min-width: 24px; color: var(--muted); }
.own { margin-left: 6px; padding: 2px 6px; border: 1px solid var(--blue); font-size: 11px; color: var(--blue); }
.rlinks { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 6px; font: 500 14px/1.3 var(--display); }
.rlinks a { color: var(--ink); overflow-wrap: anywhere; }
.url { display: block; font-size: 12px; color: var(--muted); }
.quotes { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
.quotes li { padding: 16px; background: var(--box); break-inside: avoid; }
.quotes .q { font: 500 14px/1.3 var(--display); }
.quotes blockquote { margin: 8px 0 0; }
.quotes .tag { margin-top: 8px; font: 500 12px/1 var(--display); letter-spacing: 0.02em; text-transform: uppercase; color: var(--muted); }
.recs-sec .prose p + p { margin-top: 1em; }
.rmethod h2 { margin: 0 0 8px; font: 500 14px/1.3 var(--display); text-transform: uppercase; }
.rmethod p { color: var(--muted); font-size: 12px; }
.rmethod p + p { margin-top: 6px; }
@media (max-width: 720px) {
  .rhead h1 { font-size: 30px; }
  .rp { margin-inline: -16px; padding: 24px 16px; }
  .rp.with-phone { display: block; }
  .rp-phone { width: 150px; margin: 0 auto 24px; }
  .rp-nums { grid-template-columns: 1fr 1fr; }
  table.rtable .w-bar { display: none; }
}
@media print {
  .rp.with-phone { display: grid; }
  .rp-nums { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}
`;

/* ---------- The Reports tab and a report's settings (admin) ---------- */

const runLabel = (r) => `${fmtDate(r.started_at, 'long')} (${r.kind === 'weekly' ? 'weekly' : r.kind === 'manual' ? 'Run now' : r.kind}, ${r.n} scored)`;

export function statusPill(r) {
  if (r.withdrawn_at) return '<span class="pill overdue">Withdrawn</span>';
  if (r.status === 'sent') return '<span class="pill sent">Sent</span>';
  if (r.status === 'approved') return '<span class="pill signed">Approved</span>';
  return '<span class="pill">Draft</span>';
}

export function reportsTab({ brand, reports, runs, href = (id) => `/admin/brands/${brand.slug}/reports/${id}/`, sample = false }) {
  const done = runs.filter((r) => r.status === 'complete' && r.n);
  const opts = (list, empty) => (empty ? `<option value="">${esc(empty)}</option>` : '') + list.map((r) => `<option value="${r.id}">${esc(runLabel(r))}</option>`).join('');
  const form = done.length
    ? `<form class="form" data-save="report-new" data-token="${sample ? 'SAMPLE' : esc(brand.slug)}">
      <label><span>Kind</span><select name="kind"><option value="snapshot">Snapshot: one run</option><option value="compare"${done.length > 1 ? ' selected' : ''}>Before and after: two runs</option></select></label>
      <label><span>Run</span><select name="run">${opts(done)}</select><small>For before and after, this is the after run.</small></label>
      <label><span>Before run</span><select name="before">${opts(done.slice(1), done.length > 1 ? '' : 'Needs a second finished run')}</select><small>Only used for before and after.</small></label>
      <span></span>
      <label><span>Send to (name)</span><input name="recipient_name" maxlength="120" autocomplete="off"></label>
      <label><span>Send to (email)</span><input name="recipient_email" type="email" maxlength="200" autocomplete="off"></label>
      <div class="wide"><button type="submit" class="btn">Make a draft</button></div>
      <p class="status wide" role="status" hidden></p>
    </form>`
    : '<p class="muted">Reports are made from finished runs. Once the first run finishes, you can make one here.</p>';
  const rows = reports
    .map((r) => `<div class="adm-row">
      <div class="c-name"><a href="${esc(href(r.id))}"><b>${esc(REPORT_KINDS[r.kind] || r.kind)}</b></a><span>${esc(fmtDate(r.created_at, 'long'))}</span></div>
      <div class="c-meta">${esc(r.title)}<span>${r.recipient_email ? `For ${esc(r.recipient_name || r.recipient_email)}` : 'No recipient yet'}${r.sent_at ? ` · sent ${esc(fmtDate(r.sent_at, 'long'))}` : ''}</span></div>
      <div class="c-act">${statusPill(r)}<a class="ghost small" href="${esc(href(r.id))}">Open</a></div>
    </div>`)
    .join('');
  return `<section class="sec full"><h2>Reports</h2><div class="adm brand-list"><div>${rows || '<p class="empty">No reports yet.</p>'}</div></div></section>
  <section class="sec full"><h2>New report</h2>
    <p class="sec-note">A report is an A4 sheet at a private link, with a PDF. It keeps its own copy of the numbers. It stays a draft, visible only to you, until you approve it, and nothing reaches a client until you press Send.</p>
    ${form}</section>`;
}

export function reportEditor({ brand, report, base, sample = false, emailApproved = false, preview = null }) {
  const live = !report.withdrawn_at && report.status !== 'draft';
  const link = `${base}/report/${report.token}/`;
  const token = sample ? 'SAMPLE' : String(report.id);
  const b = (action, label, extra = '', kind = 'ghost small') => `<button type="button" class="${kind}" data-action="${action}" data-token="${token}" data-label="${esc(label)}" ${extra}>${esc(label)}</button>`;
  const buttons = [];
  if (report.withdrawn_at) buttons.push(b('report-restore', 'Restore the link', 'data-wait="Restoring…"', 'ghost small primary'));
  else {
    if (report.status === 'draft') {
      buttons.push(b('report-approve', 'Approve', 'data-confirm="Approve this report?" data-wait="Approving…"', 'ghost small primary'));
      buttons.push(b('report-refresh', 'Refresh the numbers', 'data-confirm="Take a fresh copy of the numbers?" data-wait="Refreshing…"'));
    }
    if (report.status === 'approved') buttons.push(b('report-unapprove', 'Back to draft', 'data-wait="Working…"'));
    if (report.status !== 'draft') {
      const to = report.recipient_email;
      buttons.push(
        !emailApproved
          ? '<span class="muted small">Sending switches on once you approve the client email (see Samples).</span>'
          : to
            ? b('report-send', report.status === 'sent' ? 'Send again' : 'Send', `data-confirm="${esc(`Send to ${to}?`)}" data-wait="Saving the PDF to Drive and emailing it from your Gmail…"`, 'ghost small primary')
            : '<span class="muted small">Add an email address below to send it.</span>',
      );
    }
    buttons.push(b('report-withdraw', 'Withdraw the link', 'data-confirm="Sure? Press again" data-wait="Withdrawing…"'));
  }
  const facts = [
    ['Status', report.withdrawn_at ? `Withdrawn ${fmtDate(report.withdrawn_at, 'long')}` : report.status === 'sent' ? `Sent ${fmtDate(report.sent_at, 'long')}` : report.status === 'approved' ? `Approved ${fmtDate(report.approved_at, 'long')}` : 'Draft'],
    ['Kind', REPORT_KINDS[report.kind] || report.kind],
    ['Private link', live ? `<a href="${esc(link)}">${esc(link)}</a>` : `${esc(link)} <span class="muted">(${report.withdrawn_at ? 'off' : 'opens only for you until approved'})</span>`],
    ['Made', fmtDate(report.created_at, 'long')],
  ];
  return `<div class="run-bar"><div class="grow">${esc(report.title)}<p class="pill-line">${statusPill(report)}</p></div>${buttons.join('')}</div>
  <section class="sec full"><h2>Report</h2>
    <table class="kv"><tbody>${facts.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${v}</td></tr>`).join('')}</tbody></table>
    <p style="margin-top:16px"><a class="ghost small primary" href="${esc(preview || `/report/${report.token}/`)}">View the report</a> <a class="ghost small" href="${esc(preview ? `${preview.replace(/\/$/, '')}.pdf` : `/report/${report.token}/report.pdf`)}">PDF</a></p>
  </section>
  <section class="sec full"><h2>Details</h2>
    <form class="form" data-save="report-save" data-token="${token}">
      <label class="wide"><span>Title</span><input name="title" maxlength="160" value="${esc(report.title)}"></label>
      <label><span>Send to (name)</span><input name="recipient_name" maxlength="120" value="${esc(report.recipient_name)}" autocomplete="off"></label>
      <label><span>Send to (email)</span><input name="recipient_email" type="email" maxlength="200" value="${esc(report.recipient_email)}" autocomplete="off"></label>
      <label class="wide"><span>Recommendations</span><textarea name="recommendations" maxlength="6000" rows="10">${esc(report.recommendations)}</textarea><small>Yours to write. Left empty, the section is left out of the report. Blank lines start new paragraphs.</small></label>
      <div class="wide"><button type="submit" class="btn">Save</button></div>
      <p class="status wide" role="status" hidden></p>
    </form>
  </section>`;
}
