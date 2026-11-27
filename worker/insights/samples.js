// Samples for checking the design: a made-up brand with canned runs, drawn by the same code as the
// real pages. Admin only, at insights.anthonyis.uk/admin/samples/.
//
// The comment tool (public/feedback.js) runs on these pages, and each comment becomes an issue on
// the public GitHub repo, so everything here must stay fictional: the brand is Saltwater Supply Co.,
// the made-up client from the docs samples, and the businesses and sites in its answers are invented
// (example domains). Real brands, prompts and results never load the comment tool.

import { esc, masthead, eyebrow, fmtDateTime } from '../docs/shared.js';
import { page as html } from '../docs/security.js';
import { fakeAnswer } from './engine.js';
import { hash } from './text.js';
import { ruleScore, placeBrand, fakeModelScore, SCORER_VERSION } from './score.js';
import { visibilityContent, answerBody } from './dashboard.js';
import { brandsPage, brandSettings, brandShell, placeholderTab, scheduleTab, insightsShell } from './pages.js';
import { insightsCodeEmail, insightsLoginNotice } from './emails.js';
import { placeholderSvg } from './screen.js';
import { freezeRun, reportPage, reportsTab, reportEditor, defaultTitle } from './reports.js';
import { reportEmail } from './emails.js';
import { renderPdfs } from '../docs/pdf.js';
import { cachedPdf, allowed, headers } from '../docs/security.js';

const P = '/admin/samples/';
const FEEDBACK = '<script>window.__aifFeedbackLogin = true;</script><script src="/feedback.js" defer></script>';

export const SAMPLE_BRAND = {
  id: 0,
  slug: 'saltwater-supply',
  name: 'Saltwater Supply Co.',
  match_names: ['Saltwater Supply', 'Saltwater'],
  match_domains: ['saltwatersupply.example'],
  facts: 'Sells sailing and coastal outdoor clothing online. Ships across the UK and Europe. Does not have physical shops.',
  flags: [
    { key: 'price_steering', label: 'Price steering', description: 'points the reader to cheaper options' },
    { key: 'design_only', label: 'Design only', description: 'says the brand only designs and does not make its own kit' },
    { key: 'wrong_facts', label: 'Wrong facts', description: 'contradicts the facts note' },
  ],
  groups: { A: 'Recommendation, no modifier', B: 'Same question with independent', C: 'By product' },
  launch_date: null,
  ga4_property: '',
  uk_only: 1,
  asks_per_week: 3,
  run_weekday: 1,
  active: 1,
};

const PROMPTS = [
  ['A', 'Best sailing jacket brands in the UK'],
  ['A', 'Where should I buy coastal walking gear online in the UK?'],
  ['A', 'Recommend a UK brand for waterproof smocks'],
  ['B', 'Best independent sailing clothing brand UK'],
  ['B', 'Recommend an independent outdoor clothing shop in the UK'],
  ['C', 'Who makes the best fisherman jumpers in the UK?'],
  ['C', 'Best lightweight sailing trousers UK'],
  ['C', 'Good UK brand for kids waterproofs for the beach'],
].map(([grp, text], i) => ({ id: i + 1, grp, text }));

// Six weekly runs, Mondays from late September. The launch sits between the third and the fourth.
const RUN_DATES = ['2026-09-28', '2026-10-05', '2026-10-12', '2026-10-19', '2026-10-26', '2026-11-02'];
SAMPLE_BRAND.launch_date = '2026-10-15';

function cannedRun(index) {
  const brand = SAMPLE_BRAND;
  const started = `${RUN_DATES[index]}T06:05:00.000Z`;
  const rows = [];
  let id = (index + 1) * 1000;
  for (const p of PROMPTS) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      id++;
      // Later runs mention the brand more, and group B (independent) more than group A: pick the
      // canned answer that matches a made-up target for this prompt and run.
      const chance = (p.grp === 'B' ? 45 : p.grp === 'A' ? 10 : 20) + index * 7;
      const want = hash(`${p.text}|${attempt}|${index}`) % 100 < chance;
      let r = fakeAnswer(p.text, brand, attempt + index * 7);
      for (let k = 1; k < 40 && r.text.includes(brand.match_names[0]) !== want; k++) r = fakeAnswer(p.text, brand, attempt + index * 7 + k * 101);
      const answer = { prompt_text: p.text, text: r.text, citations: r.citations };
      const rules = ruleScore(answer, brand);
      const model = fakeModelScore(answer, brand);
      const placed = placeBrand(model.recommended, brand);
      rows.push({
        id,
        run_id: index + 1,
        prompt_id: p.id,
        prompt_text: p.text,
        grp: p.grp,
        attempt,
        status: index === 5 && id % 9 === 0 ? 'failed' : 'done',
        error: index === 5 && id % 9 === 0 ? 'OpenAI took too long to answer.' : null,
        model: 'chat-latest (sample)',
        text: r.text,
        citations: r.citations,
        searches: r.searches,
        input_tokens: r.usage.input,
        output_tokens: r.usage.output,
        asked_at: started,
        s_status: 'done',
        s_version: SCORER_VERSION,
        ...rules,
        ...placed,
        brand_named: rules.brand_named || (placed.brand_position ? 1 : 0),
        flags: model.flags,
      });
    }
  }
  for (const r of rows) if (r.status === 'failed') Object.assign(r, { s_status: null, text: null, citations: [], brand_named: 0, brand_position: null });
  return { run: { id: index + 1, kind: 'weekly', status: 'complete', started_at: started, completed_at: `${RUN_DATES[index]}T07:58:00.000Z`, attempts: 3, total: rows.length }, rows };
}

let cache;
function sampleData() {
  if (cache) return cache;
  const runs = RUN_DATES.map((_, i) => cannedRun(i));
  const trend = runs
    .map(({ run, rows }) => {
      const done = rows.filter((r) => r.s_status);
      const named = done.filter((r) => r.brand_named);
      const ps = named.filter((r) => r.brand_position).map((r) => r.brand_position);
      const g = (k) => done.filter((r) => r.grp === k);
      return {
        ...run,
        n: done.length,
        named: named.length,
        pos: ps.length ? ps.reduce((a, b) => a + b, 0) / ps.length : null,
        na: g('A').length,
        nameda: g('A').filter((r) => r.brand_named).length,
        nb: g('B').length,
        namedb: g('B').filter((r) => r.brand_named).length,
      };
    })
    .reverse();
  cache = { runs, trend };
  return cache;
}

const PAGES = [
  ['ai-brands', 'Brands list', 'The first page after logging in.'],
  ['ai-visibility', 'AI visibility tab', 'A finished run: headline numbers, the A against B gap, trend, groups, who is named instead, cited pages, flags and every answer.'],
  ['ai-running', 'A run in progress', 'The progress bar while a run is being asked.'],
  ['ai-answer', 'One answer in full', 'The scoring, the full text with the brand marked, and its cited links.'],
  ['ai-settings', 'Brand settings and prompts', 'The brand form and the grouped prompt list.'],
  ['ai-schedule', 'Schedule tab', 'The weekly run. Dated runs arrive in phase 4.'],
  ['ai-ga4', 'GA4 tab', 'A placeholder until phase 3.'],
  ['ai-reports', 'Reports tab', 'Before and after, your reports, and a report from any run.'],
  ['report-settings', 'A report’s page', 'View, PDF, share the link, and the recommendations box.'],
  ['report-compare', 'Report: before and after', 'Two runs side by side, as the client sees it. With its PDF.'],
  ['report-snapshot', 'Report: snapshot', 'One run, with recommendations written in. With its PDF.'],
  ['email-code', 'Email: login code', 'Sent to Anthony when he asks for a code.'],
  ['email-notice', 'Email: login notice', 'Sent to Anthony after every login.'],
  ['email-report', 'Email: report to a client', 'Switched off. Only used once you choose to email reports.'],
];

const tabHref = (k) => `${P}${k === '' ? 'ai-visibility' : `ai-${k}`}/`;

// Two sample reports from the canned runs: before and after (first and last run), and a snapshot
// of the last run with recommendations written in, as Anthony would.
function sampleReports() {
  const { runs } = sampleData();
  const first = runs[0];
  const last = runs[runs.length - 1];
  const brand = SAMPLE_BRAND;
  const screen = { src: `data:image/svg+xml;base64,${btoa(placeholderSvg(brand.name))}`, url: 'https://saltwatersupply.example/', tint: '#ffffff', taken_at: '2026-11-02T06:05:00Z' };
  const after = { ...freezeRun(last.run, last.rows, brand), screen };
  const before = freezeRun(first.run, first.rows, brand);
  const base = { brand_id: 0, recipient_name: 'Sam Fielding', recipient_email: 'sam@saltwatersupply.example', created_at: '2026-11-02T09:00:00Z', approved_at: '2026-11-02T09:30:00Z', sent_at: null, withdrawn_at: null };
  return {
    compare: { ...base, id: 2, token: 'SAMPLEcompareXXXXXXXXXX', kind: 'compare', status: 'approved', title: defaultTitle('compare', brand, last.run, first.run), data: { after, before, screen }, recommendations: '' },
    snapshot: { ...base, id: 1, token: 'SAMPLEsnapshotXXXXXXXXX', kind: 'snapshot', status: 'sent', sent_at: '2026-11-03T10:00:00Z', title: defaultTitle('snapshot', brand, last.run), data: after,
      recommendations: 'Get onto the two agency lists ChatGPT leans on for general questions. Both take paid placements.\n\nAdd a plain answer to "who makes the best sailing jacket in the UK" on the jackets page, with the awards and reviews beside it.' },
  };
}

export async function samples(request, env, url, parts, ctx) {
  const base = url.origin;
  const slug = parts[0] || '';
  if (!slug) return html(index(base));
  if (parts.length === 2 && parts[1] === 'report.pdf' && (slug === 'report-compare' || slug === 'report-snapshot')) {
    const report = sampleReports()[slug.slice(7)];
    const page = reportPage({ base, report, brand: SAMPLE_BRAND, pdf: true });
    const bytes = await cachedPdf(env, ctx, base, page, async (h) => (await renderPdfs(env, [h]))[0], () => allowed(env, 'DOCS_RL_PDF', request, 'insights'));
    if (!bytes) return html(notFound(base), 429);
    return new Response(bytes, { headers: { 'content-type': 'application/pdf', 'content-disposition': `inline; filename="Sample_${slug}.pdf"`, ...headers() } });
  }
  if (parts.length > 1) return html(notFound(base), 404);
  const brand = SAMPLE_BRAND;
  const { runs, trend } = sampleData();
  const latest = runs[runs.length - 1];
  const promptCount = PROMPTS.length;
  const sampleLink = (page) => (change) => {
    const q = new URLSearchParams();
    const cur = { run: Number(url.searchParams.get('run')) || null, group: url.searchParams.get('group'), prompt: Number(url.searchParams.get('prompt')) || null, ...change };
    if (cur.run && cur.run !== latest.run.id) q.set('run', cur.run);
    if (cur.group) q.set('group', cur.group);
    if (cur.prompt) q.set('prompt', cur.prompt);
    const s = q.toString();
    return `${P}${page}/${s ? `?${s}` : ''}${change.group !== undefined || change.prompt !== undefined ? '#answers' : ''}`;
  };
  const answerHref = (id) => `${P}ai-answer/?id=${id}`;
  const shellOf = (active, content) => withFeedback(brandShell({ base, brand, active, content, sample: true, href: tabHref, settingsHref: `${P}ai-settings/` }));

  if (slug === 'ai-brands') {
    return html(withFeedback(brandsPage({ base, sample: true, brands: [{ ...brand, prompt_count: promptCount, last_run: latest.run.started_at, href: `${P}ai-visibility/`, settingsHref: `${P}ai-settings/` }] })));
  }
  if (slug === 'ai-visibility') {
    const pick = Number(url.searchParams.get('run')) || latest.run.id;
    const chosen = runs.find((r) => r.run.id === pick) || latest;
    const prompt = Number(url.searchParams.get('prompt')) || null;
    const group = (url.searchParams.get('group') || '').slice(0, 1) || null;
    const screen = { src: `data:image/svg+xml;base64,${btoa(placeholderSvg(brand.name))}`, url: 'https://saltwatersupply.example/', tint: '#ffffff', taken_at: '2026-11-02T06:05:00Z', action: '<button type="button" data-action="screen-take" data-token="SAMPLE" data-label="Take a new screenshot">Take a new screenshot</button>' };
    return html(shellOf('', visibilityContent({ brand, trend, run: chosen.run, rows: chosen.rows, group, prompt, link: sampleLink('ai-visibility'), answerHref, promptCount, sample: true, screen })));
  }
  if (slug === 'ai-running') {
    const run = { ...latest.run, id: 99, status: 'running', started_at: new Date(Date.now() - 4 * 60 * 1000).toISOString(), completed_at: null };
    const rows = latest.rows.map((r, i) => (i < 9 ? r : { ...r, status: 'pending', s_status: null, text: null, citations: [], brand_named: 0, brand_position: null, flags: [], recommended: [], above: [] }));
    const progress = { status: 'running', total: rows.length, done: 9, failed: 0, cancelled: 0, waiting: rows.length - 9, scoring: 0 };
    const t = [{ ...trend[0], ...run, n: 9, named: rows.filter((r) => r.brand_named).length }, ...trend];
    return html(shellOf('', visibilityContent({ brand, trend: t, run, rows, link: sampleLink('ai-running'), answerHref, progress, promptCount, sample: true })));
  }
  if (slug === 'ai-answer') {
    const id = Number(url.searchParams.get('id')) || 0;
    const all = runs.flatMap((r) => r.rows);
    const a = all.find((r) => r.id === id) || latest.rows.find((r) => r.brand_named && r.flags.length) || latest.rows.find((r) => r.brand_named) || latest.rows[0];
    return html(shellOf('', answerBody(a, brand, { back: `${P}ai-visibility/` })));
  }
  if (slug === 'ai-settings') {
    return html(withFeedback(brandSettings({ base, brand: { ...brand, slug: 'SAMPLE' }, prompts: PROMPTS.map((p, i) => ({ ...p, position: i + 1 })), sample: true, back: `${P}ai-visibility/` })));
  }
  if (slug === 'ai-schedule') return html(shellOf('schedule', scheduleTab(brand, { nextRun: '2026-11-30' })));
  if (slug === 'ai-ga4') return html(shellOf('ga4', placeholderTab('ga4', brand)));
  if (slug === 'ai-reports') {
    const r = sampleReports();
    return html(shellOf('reports', reportsTab({ brand, sample: true, reports: [r.compare, r.snapshot], runs: trend, href: (id) => `${P}${id === 2 ? 'report-settings' : 'report-snapshot'}/` })));
  }
  if (slug === 'report-settings') {
    return html(shellOf('reports', reportEditor({ brand, base, sample: true, report: sampleReports().compare, preview: `${P}report-compare/` })));
  }
  if (slug === 'report-compare' || slug === 'report-snapshot') {
    const report = sampleReports()[slug.slice(7)];
    const page = reportPage({ base, report, brand, admin: false }).replace(`/report/${report.token}/report.pdf`, `${P}${slug}/report.pdf`);
    return html(withFeedback(page));
  }
  if (slug === 'email-report') return html(withFeedback(reportEmail({ base, report: sampleReports().compare, brand }).html));
  if (slug === 'email-code') return html(withFeedback(insightsCodeEmail({ code: '418 207'.replace(' ', ''), ip: '203.0.113.7', place: 'Falmouth, GB' }).html));
  if (slug === 'email-notice') {
    return html(withFeedback(insightsLoginNotice({ host: url.host, when: fmtDateTime('2026-11-27T09:12:00Z'), ip: '203.0.113.7', place: 'Falmouth, GB', ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 15_6) Safari/605.1.15' }).html));
  }
  return html(notFound(base), 404);
}

function withFeedback(page) {
  return page.replace('</body>', `${FEEDBACK}\n</body>`);
}

function index(base) {
  const rows = PAGES.map(([slug, label, note]) => `<tr><td><a href="${P}${slug}/">${esc(label)}</a></td><td class="muted">${esc(note)}</td></tr>`).join('');
  const body = `
  ${masthead('Insights', 'Samples')}
  <h1>${eyebrow('Check the design')}Sample pages</h1>
  <div class="prose" style="max-width:560px">
    <p>Every insights page filled in for a made-up brand, Saltwater Supply Co., with six canned weekly runs. Nothing here touches the database or OpenAI.</p>
    <p>The comment tool is on every sample: press <b>C</b> or the comment button, click anything and type. Each comment is filed for me to pick up. Comments are public on GitHub, which is why only these made-up samples have the tool, never real brands or results.</p>
    <p>Reports and their PDFs join this page in phase 2.</p>
  </div>
  <section class="sec full"><div class="table-wrap"><table class="admin-table"><tbody>${rows}</tbody></table></div></section>
  <p><a class="ghost" href="/admin/">Back to brands</a></p>`;
  return withFeedback(insightsShell({ base, title: 'Insights samples', body }));
}

function notFound(base) {
  return insightsShell({ base, title: 'Not found', body: `${masthead('Insights', 'Samples')}<h1>${eyebrow('Samples')}Not found</h1><p>There is no sample with that name. <a href="${P}">All samples</a></p>` });
}
