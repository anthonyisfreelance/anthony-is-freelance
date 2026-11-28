// Insights on insights.anthonyis.uk: how AI engines talk about a brand (phase 1), and later GA4
// audits, before-and-after reports and scheduled dates. How it fits together: worker/insights/README.md.
//
//   /                                    redirects to /admin/
//   /admin/                              login, then the brands list
//   /admin/brands/new/                   add a brand
//   /admin/brands/<slug>/                the brand page: AI visibility tab (?run=, ?group=, ?prompt=)
//   /admin/brands/<slug>/ga4/            GA4 tab: run an audit, saved audits (?audit=) (audit.js)
//   /admin/brands/<slug>/reports/        Reports tab (phase 2)
//   /admin/brands/<slug>/schedule/       Schedule tab
//   /admin/brands/<slug>/settings/       brand settings and the prompt list
//   /admin/brands/<slug>/answers/<id>/   one answer in full
//   /admin/brands/<slug>/screen/         the phone screenshot of its homepage (screen.js)
//   /admin/brands/<slug>/reports/<id>/   a report's settings: approve, send, withdraw (phase 2)
//   /report/<token>/ and report.pdf      a report: the A4 sheet and its PDF (reports.js)
//   /admin/samples/                      a made-up brand with a canned run, for checking the design
//   POST /admin/code, /admin/verify, /admin/logout, /admin/action   (JSON, from this site only)
//
// The cron (worker/index.js `scheduled`) calls `insightsCron` every 5 minutes.
//
// Security: the docs rules apply (worker/docs/README.md, Security). Login is a one-time code to
// ADMIN_EMAIL with a notice after every login; cookies are separate from docs and marked for
// insights, so a docs login never opens insights or the other way round.

import { esc, fmtDateTime, masthead, eyebrow, COMPANY } from '../docs/shared.js';
import { seal, unseal, hmac, newCode, newToken, getCookie, cookie, same } from '../docs/auth.js';
import { page as html, headers, allowed, codeAllowed } from '../docs/security.js';
import { resend } from '../docs/mail.js';
import { ensureSchema, db, getBrand, listBrands, getPrompts, now, brandOf } from './db.js';
import { parsePromptList, savePromptList } from './prompts.js';
import { startRun, processBatch, runProgress, stopRun, rescoreRun, cron, ukClock, RunError } from './runner.js';
import { visibilityContent, progressOf, answerBody } from './dashboard.js';
import { loginPage, brandsPage, brandSettings, brandShell, scheduleTab, insightsShell } from './pages.js';
import { insightsCodeEmail, insightsLoginNotice } from './emails.js';
import { flagKey } from './score.js';
import { list } from './text.js';
import { samples } from './samples.js';
import { takeScreen, screenInfo, screenImage, homepageOf } from './screen.js';
import { runRows, freezeRun, listReports, getReport, defaultTitle, reportPage, reportsTab, reportEditor, isShared } from './reports.js';
import { reportEmail } from './emails.js';
import { renderPdfs, toBase64 } from '../docs/pdf.js';
import { cachedPdf } from '../docs/security.js';
import { bridge, sendEmail, BridgeError } from '../docs/bridge.js';
import { periodFrom, runAudit, saveAudit, listAudits, getAudit, latestAudit, trafficOf } from './audit.js';
import { googleReady, serviceEmail, GoogleError } from './google.js';
import { ga4Tab } from './ga4view.js';
import { competitorsTab, checkRival, rivalSites, rivalImage } from './competitors.js';
import { overviewTab } from './overview.js';

const CODE_MINUTES = 10;
const ADMIN_DAYS = 14;
const SESSION = 'ins_admin';
const PENDING = 'ins_admin_code';
// Every rate limit is shared with docs' bindings but counted separately (the key carries this).
const RL = 'insights';

const adminEmail = (env) => env.ADMIN_EMAIL || COMPANY.email;
const clip = (v, n) => String(v ?? '').trim().slice(0, n);
const fromHere = (request, url) => request.headers.get('origin') === url.origin;

function json(data, status = 200, extra = {}) {
  const h = new Headers({ 'content-type': 'application/json', ...headers() });
  for (const [k, v] of Object.entries(extra)) for (const one of [].concat(v)) h.append(k, one);
  return new Response(JSON.stringify(data), { status, headers: h });
}

function message(base, title, text, status = 404) {
  const body = `${masthead('Insights', '')}<h1>${eyebrow('Anthony is Freelance')}${esc(title)}</h1><p>${esc(text)}</p>`;
  return html(insightsShell({ base, title, body }), status);
}

const tooMany = (request, base) =>
  request.method === 'GET'
    ? message(base, 'Too many requests', 'Please wait a minute and try again.', 429)
    : json({ ok: false, error: 'Too many tries in a short time. Please wait a minute and try again.' }, 429);

// Is this request from a logged-in insights admin? Also used by the comment tool on the samples.
export async function insightsSession(request, env) {
  const s = await unseal(env.DOCS_SECRET, getCookie(request, SESSION));
  return Boolean(s && s.app === 'insights');
}

async function readJson(request) {
  if (!(request.headers.get('content-type') || '').includes('application/json')) return null;
  try {
    return await request.json();
  } catch {
    return null;
  }
}

// Returns null for paths that aren't insights pages, so the site's files (fonts, icons) still load.
export async function insights(request, env, ctx) {
  const url = new URL(request.url);
  const base = url.origin;
  const parts = url.pathname.split('/').filter(Boolean);
  try {
    // The bare address opens the admin (the login page until logged in).
    if (!parts.length) return Response.redirect(`${base}/admin/`, 302);
    if (parts[0] === 'admin') return await admin(request, env, url, parts.slice(1), ctx);
    if (parts[0] === 'report') return await reportRoute(request, env, url, parts.slice(1), ctx);
    return null;
  } catch (e) {
    if (!(e instanceof RunError)) console.error('[insights]', e);
    const text = 'Something went wrong. Please try again in a minute.';
    if (request.method === 'POST') return json({ ok: false, error: e instanceof RunError ? e.message : text }, e instanceof RunError ? 400 : 500);
    return message(base, 'Something went wrong', text, 500);
  }
}

async function admin(request, env, url, parts, ctx) {
  const base = url.origin;
  const session = await insightsSession(request, env);
  const action = parts[0] || '';

  if (request.method === 'GET') {
    if (!(await allowed(env, 'DOCS_RL_READ', request, RL))) return tooMany(request, base);
    if (!url.pathname.endsWith('/') && !url.pathname.endsWith('.pdf')) return Response.redirect(`${base}${url.pathname}/${url.search}`, 301);
    if (!session) {
      // Keep the address, so a bookmarked page opens once the code is entered.
      return html(loginPage({ base, to: adminEmail(env) }));
    }
    if (action === 'samples') return samples(request, env, url, parts.slice(1), ctx);
    await ensureSchema(env);
    if (!action) return html(brandsPage({ base, brands: await listBrands(env) }));
    if (action === 'brands' && parts[1] === 'new' && parts.length === 2) return html(brandSettings({ base, isNew: true }));
    if (action === 'brands' && parts[1]) {
      const brand = await getBrand(env, parts[1]);
      if (!brand) return message(base, 'Brand not found', 'There is no brand at this address.');
      return brandPages(env, url, brand, parts.slice(2));
    }
    return message(base, 'Not found', 'There is no page here.');
  }

  // POSTs: JSON from a page on this site only.
  if (request.method !== 'POST') return json({ ok: false, error: 'Not found' }, 404);
  if (!fromHere(request, url)) return json({ ok: false, error: 'Not allowed.' }, 403);
  if (!(await allowed(env, 'DOCS_RL_POST', request, RL))) return tooMany(request, base);
  const body = await readJson(request);
  if (!body) return json({ ok: false, error: 'The request could not be read.' }, 400);
  if (!env.DOCS_SECRET) return json({ ok: false, error: 'DOCS_SECRET is not set yet.' }, 503);

  const ip = request.headers.get('cf-connecting-ip') || '';
  const place = [request.cf?.city, request.cf?.country].filter(Boolean).join(', ');

  if (action === 'code') {
    const code = newCode();
    const sealed = await seal(env.DOCS_SECRET, { app: 'insights', n: newToken(8), h: await hmac(env.DOCS_SECRET, `insights|${code}`), a: 0 }, CODE_MINUTES * 60);
    await resend(env, { to: adminEmail(env), ...insightsCodeEmail({ code, ip, place }) });
    return json({ ok: true, to: adminEmail(env), ...(env.INSIGHTS_DEV === '1' ? { devCode: code } : {}) }, 200, { 'set-cookie': cookie(PENDING, sealed, CODE_MINUTES * 60) });
  }
  if (action === 'verify') {
    const pending = await unseal(env.DOCS_SECRET, getCookie(request, PENDING));
    if (!pending || pending.app !== 'insights') return json({ ok: false, error: 'That code has expired. Please send a new one.' }, 400);
    if (pending.a >= 5) return json({ ok: false, error: 'Too many tries. Please send a new code.' }, 429);
    if (!(await codeAllowed(env, `${RL}|${pending.n}`))) return json({ ok: false, error: 'Too many tries. Please wait a minute, or send a new code.' }, 429);
    if (!same(await hmac(env.DOCS_SECRET, `insights|${clip(body.code, 6)}`), pending.h)) {
      const retry = await seal(env.DOCS_SECRET, { app: 'insights', n: pending.n, h: pending.h, a: (pending.a || 0) + 1 }, Math.max(1, Math.round((pending.exp - Date.now()) / 1000)));
      return json({ ok: false, error: "That code isn't right." }, 400, { 'set-cookie': cookie(PENDING, retry, CODE_MINUTES * 60) });
    }
    const sessionCookie = await seal(env.DOCS_SECRET, { app: 'insights', admin: 1 }, ADMIN_DAYS * 24 * 3600);
    // A notice on every login, so a login that wasn't Anthony is spotted straight away.
    const notice = resend(env, {
      to: adminEmail(env),
      ...insightsLoginNotice({ host: url.host, when: fmtDateTime(new Date().toISOString()), ip, place, ua: clip(request.headers.get('user-agent'), 200) }),
    }).catch((e) => console.error('[insights] login notice', e));
    if (ctx?.waitUntil) ctx.waitUntil(notice);
    return json({ ok: true }, 200, { 'set-cookie': [cookie(SESSION, sessionCookie, ADMIN_DAYS * 24 * 3600), cookie(PENDING, '', 0)] });
  }
  if (action === 'logout') return json({ ok: true }, 200, { 'set-cookie': cookie(SESSION, '', 0) });

  if (!session) return json({ ok: false, error: 'Please log in again.' }, 401);
  if (action !== 'action') return json({ ok: false, error: 'Not found' }, 404);
  await ensureSchema(env);
  return act(env, body, ctx, request, base);
}

/* ---------- Reports at /report/<token>/ ---------- */

// Approved and sent reports open for anyone with the link; drafts and withdrawn links open only for
// Anthony (logged in), so he can check them. A withdrawn link tells the client it was withdrawn.
async function reportRoute(request, env, url, parts, ctx) {
  const base = url.origin;
  const token = parts[0] || '';
  const pdf = parts[1] === 'report.pdf' && parts.length === 2;
  if (request.method !== 'GET' || !/^[A-Za-z0-9_-]{20,40}$/.test(token) || (parts.length > 1 && !pdf)) return message(base, 'Not found', 'This link is not a report.');
  if (!(await allowed(env, 'DOCS_RL_READ', request, RL))) return tooMany(request, base);
  if (!pdf && !url.pathname.endsWith('/')) return Response.redirect(`${base}${url.pathname}/`, 301);
  await ensureSchema(env);
  const report = await getReport(env, 'token', token);
  const admin = await insightsSession(request, env);
  if (!report || (report.status === 'draft' && !admin)) return message(base, 'Not found', 'This link is not a report.');
  if (report.withdrawn_at && !admin) return message(base, 'Report withdrawn', 'This report has been withdrawn. If you need it, please get in touch.', 410);
  const brand = brandOf(await db(env).prepare(`SELECT * FROM brands WHERE id = ?`).bind(report.brand_id).first());
  if (!pdf) return html(reportPage({ base, report, brand, admin }));
  const page = reportPage({ base, report, brand, pdf: true });
  const bytes = await cachedPdf(env, ctx, base, page, async (h) => (await renderPdfs(env, [h]))[0], () => allowed(env, 'DOCS_RL_PDF', request, RL));
  if (!bytes) return tooMany(request, base);
  return new Response(bytes, { headers: { 'content-type': 'application/pdf', 'content-disposition': `inline; filename="${reportFile(report, brand)}"`, ...headers() } });
}

export function reportFile(report, brand) {
  const a = report.data.after || report.data;
  const safe = (t) => String(t).replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '');
  if (report.kind === 'ga4') return `${safe(brand.name)}_GA4_and_search_${a.period?.start}_to_${a.period?.end}.pdf`;
  return `${safe(brand.name)}_AI_visibility_${report.kind === 'compare' ? 'before_and_after_' : ''}${String(a.run?.started_at || '').slice(0, 10)}.pdf`;
}

async function freezeReport(env, brand, kind, runId, beforeId) {
  const d = db(env);
  const getRun = (id) => d.prepare(`SELECT * FROM runs WHERE id = ? AND brand_id = ? AND status = 'complete'`).bind(id, brand.id).first();
  let after = await getRun(runId);
  if (!after) return { error: 'Choose a finished run.' };
  // The phone screenshot goes into the report as it is now, so the report keeps it.
  const shot = await d.prepare(`SELECT url, type, image, tint, taken_at FROM shots WHERE brand_id = ?`).bind(brand.id).first();
  const screen = shot?.image ? { src: `data:${shot.type};base64,${Buffer.from(new Uint8Array(shot.image)).toString('base64')}`, url: shot.url, tint: shot.tint, taken_at: shot.taken_at } : null;
  // Visits from AI and Google search, from the latest GA4 audit if there is one.
  const traffic = trafficOf(await latestAudit(env, brand.id));
  if (kind !== 'compare') return { data: { ...freezeRun(after, await runRows(env, after.id), brand), screen, traffic }, after };
  let before = await getRun(beforeId);
  if (!before || before.id === after.id) return { error: 'For before and after, choose two different finished runs.' };
  if (before.started_at > after.started_at) [before, after] = [after, before];
  const [ra, rb] = await Promise.all([runRows(env, after.id), runRows(env, before.id)]);
  return { data: { after: freezeRun(after, ra, brand), before: freezeRun(before, rb, brand), screen, traffic }, after, before };
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function reportAction(env, body, base) {
  const d = db(env);
  const f = body.fields && typeof body.fields === 'object' ? body.fields : {};
  if (body.action === 'report-new' || body.action === 'report-quick') {
    const brand = await getBrand(env, clip(body.token, 60));
    if (!brand) return json({ ok: false, error: 'Brand not found.' }, 404);
    // report-quick: a snapshot of one run, from the button beside it.
    if (body.action === 'report-quick') Object.assign(f, { kind: 'snapshot', run: body.value });
    const kind = f.kind === 'compare' ? 'compare' : 'snapshot';
    const r = await freezeReport(env, brand, kind, Number(f.run) || 0, Number(f.before) || 0);
    if (r.error) return json({ ok: false, error: r.error }, 400);
    const email = clip(f.recipient_email, 200);
    if (email && !EMAIL.test(email)) return json({ ok: false, error: 'That email address doesn\'t look right.' }, 400);
    const at = now();
    const row = await d
      .prepare(`INSERT INTO reports (token, brand_id, kind, title, run_id, before_run_id, data, recipient_name, recipient_email, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?) RETURNING id`)
      .bind(newToken(16), brand.id, kind, defaultTitle(kind, brand, r.after, r.before), r.after.id, r.before?.id || null, JSON.stringify(r.data), clip(f.recipient_name, 120), email, at, at)
      .first();
    return json({ ok: true, message: 'Report made.', go: `/admin/brands/${brand.slug}/reports/${row.id}/` });
  }
  if (body.action === 'report-ga4') {
    const brand = await getBrand(env, clip(body.token, 60));
    if (!brand) return json({ ok: false, error: 'Brand not found.' }, 404);
    const audit = await getAudit(env, brand.id, Number(body.value) || 0);
    if (!audit) return json({ ok: false, error: 'Audit not found.' }, 404);
    const at = now();
    const row = await d
      .prepare(`INSERT INTO reports (token, brand_id, kind, title, run_id, audit_id, data, status, created_at, updated_at) VALUES (?, ?, 'ga4', ?, 0, ?, ?, 'draft', ?, ?) RETURNING id`)
      .bind(newToken(16), brand.id, defaultTitle('ga4', brand, audit.data), audit.id, JSON.stringify(audit.data), at, at)
      .first();
    return json({ ok: true, message: 'Report made.', go: `/admin/brands/${brand.slug}/reports/${row.id}/` });
  }
  const report = await getReport(env, 'id', Number(body.token) || 0);
  if (!report) return json({ ok: false, error: 'Report not found.' }, 404);
  const brand = brandOf(await d.prepare(`SELECT * FROM brands WHERE id = ?`).bind(report.brand_id).first());
  const set = (sql, ...args) => d.prepare(`UPDATE reports SET ${sql}, updated_at = ? WHERE id = ?`).bind(...args, now(), report.id).run();
  switch (body.action) {
    case 'report-save': {
      const email = clip(f.recipient_email, 200);
      if (email && !EMAIL.test(email)) return json({ ok: false, error: 'That email address doesn\'t look right.' }, 400);
      await set('title = ?, recipient_name = ?, recipient_email = ?, recommendations = ?', clip(f.title, 160) || report.title, clip(f.recipient_name, 120), email, String(f.recommendations ?? '').slice(0, 6000).trim());
      return json({ ok: true, message: isShared(report) ? 'Saved. The shared report shows the change straight away.' : 'Saved.' });
    }
    case 'report-refresh': {
      if (report.status !== 'draft') return json({ ok: false, error: 'Only a draft can take fresh numbers.' }, 400);
      if (report.kind === 'ga4') return json({ ok: false, error: 'A GA4 report keeps its audit. Run a new audit for fresh numbers.' }, 400);
      const r = await freezeReport(env, brand, report.kind, report.run_id, report.before_run_id);
      if (r.error) return json({ ok: false, error: r.error }, 400);
      await set('data = ?', JSON.stringify(r.data));
      return json({ ok: true, message: 'Numbers refreshed.' });
    }
    case 'report-approve':
      if (report.status !== 'draft') return json({ ok: false, error: 'This report is already approved.' }, 400);
      await set(`status = 'approved', approved_at = ?`, now());
      return json({ ok: true, message: 'Approved. The link now opens for anyone who has it.' });
    case 'report-unapprove':
      if (report.status !== 'approved') return json({ ok: false, error: 'Only an approved, unsent report can go back to draft.' }, 400);
      await set(`status = 'draft', approved_at = NULL`);
      return json({ ok: true, message: 'Back to draft.' });
    // Sharing: on opens the link for anyone with it; off turns it off at once (a shared link that is
    // turned off tells whoever has it that the report was withdrawn).
    case 'report-share':
      await set(`status = CASE WHEN status = 'draft' THEN 'approved' ELSE status END, approved_at = coalesce(approved_at, ?), withdrawn_at = NULL`, now());
      return json({ ok: true, message: 'Shared. Anyone with the link can open it.' });
    case 'report-unshare':
      await set('withdrawn_at = ?', now());
      return json({ ok: true, message: 'Sharing off. The link no longer opens.' });
    case 'report-withdraw':
      await set('withdrawn_at = ?', now());
      return json({ ok: true, message: 'Withdrawn. The link is off.' });
    case 'report-restore':
      await set('withdrawn_at = NULL');
      return json({ ok: true, message: 'Restored. The link works again.' });
    case 'report-send': {
      if (env.INSIGHTS_REPORT_EMAIL !== 'approved') return json({ ok: false, error: 'Sending is off until you approve the client email wording (Samples).' }, 400);
      if (report.withdrawn_at) return json({ ok: false, error: 'Turn sharing on before sending.' }, 400);
      if (report.status === 'draft') return json({ ok: false, error: 'Share the link before sending it.' }, 400);
      if (!report.recipient_email) return json({ ok: false, error: 'Add an email address first.' }, 400);
      try {
        const [bytes] = await renderPdfs(env, [reportPage({ base, report, brand, pdf: true })]);
        const file = await bridge(env, 'savePdf', { kind: 'report', name: reportFile(report, brand), base64: toBase64(bytes), brand: brand.name });
        await sendEmail(env, { to: [report.recipient_email], ...reportEmail({ base, report, brand }), attachments: [{ fileId: file.id }] });
        await set(`status = 'sent', sent_at = ?, drive_file_id = ?`, now(), file.id);
      } catch (e) {
        if (e instanceof BridgeError) return json({ ok: false, error: e.message }, 502);
        throw e;
      }
      return json({ ok: true, message: `Sent to ${report.recipient_email} from your Gmail, and the PDF is saved to Drive.` });
    }
  }
  return json({ ok: false, error: 'Not found' }, 404);
}

/* ---------- Brand pages ---------- */

async function brandPages(env, url, brand, rest) {
  const base = url.origin;
  const tab = rest[0] || '';
  if (tab === 'settings' && rest.length === 1) {
    return html(brandSettings({ base, brand, prompts: await getPrompts(env, brand.id) }));
  }
  if (tab === 'answers' && rest[1] && rest.length === 2) {
    const a = await db(env)
      .prepare(`SELECT a.*, s.status AS s_status, s.version AS s_version, s.error AS s_error, s.brand_named, s.brand_position, s.domain_cited, s.recommended, s.above, s.flags
        FROM answers a LEFT JOIN scores s ON s.answer_id = a.id WHERE a.id = ? AND a.brand_id = ?`)
      .bind(Number(rest[1]) || 0, brand.id)
      .first();
    if (!a) return message(base, 'Answer not found', 'There is no answer at this address.');
    const back = `/admin/brands/${brand.slug}/?run=${a.run_id}&prompt=${a.prompt_id}#answers`;
    return html(brandShell({ base, brand, active: '', content: answerBody(a, brand, { back }) }));
  }
  if (tab === 'screen' && rest.length === 1) {
    const img = await screenImage(env, brand.id);
    if (!img) return message(base, 'Not found', 'There is no screenshot yet.');
    return new Response(img.bytes, { headers: { 'content-type': img.type, ...headers() } });
  }
  if (tab === 'reports' && rest.length === 1) {
    const [{ results: runs }, reports] = await Promise.all([db(env).prepare(TREND_SQL).bind(brand.id).all(), listReports(env, brand.id)]);
    return html(brandShell({ base, brand, active: tab, content: reportsTab({ brand, reports, runs }) }));
  }
  if (tab === 'reports' && rest.length === 2) {
    const report = await getReport(env, 'id', Number(rest[1]) || 0);
    if (!report || report.brand_id !== brand.id) return message(base, 'Not found', 'There is no report here.');
    return html(brandShell({ base, brand, active: 'reports', content: reportEditor({ brand, report, base, emailOn: env.INSIGHTS_REPORT_EMAIL === 'approved' }) }));
  }
  if (tab === 'ga4' && rest.length === 1) {
    const audits = await listAudits(env, brand.id);
    const pick = Number(url.searchParams.get('audit')) || audits[0]?.id || 0;
    const audit = pick ? await getAudit(env, brand.id, pick) : null;
    return html(brandShell({ base, brand, active: tab, content: ga4Tab({ brand, audits, audit, ready: googleReady(env), email: serviceEmail(env) }) }));
  }
  if (tab === 'competitors' && rest.length === 1) {
    const { results: trend } = await db(env).prepare(TREND_SQL).bind(brand.id).all();
    const done = trend.filter((r) => r.status === 'complete' && r.n);
    const pick = Number(url.searchParams.get('run')) || null;
    const run = (pick && done.find((r) => r.id === pick)) || done[0] || null;
    const prev = run ? done[done.indexOf(run) + 1] || null : null;
    const [rows, prevRows, sites] = run ? await Promise.all([competitorRows(env, run.id), prev ? competitorRows(env, prev.id) : null, rivalSites(env, brand.id)]) : [[], null, new Map()];
    return html(brandShell({ base, brand, active: tab, content: competitorsTab({ brand, run, rows, prevRows, sites, runLink: run ? `/admin/brands/${brand.slug}/${run.id === trend[0]?.id ? '' : `?run=${run.id}`}` : null }) }));
  }
  if (tab === 'overview' && rest.length === 1) {
    const { results: trend } = await db(env).prepare(TREND_SQL).bind(brand.id).all();
    const done = trend.filter((r) => r.status === 'complete' && r.n);
    const [run, prev] = done;
    const [rows, prevRows, audit] = await Promise.all([run ? competitorRows(env, run.id) : [], prev ? competitorRows(env, prev.id) : null, latestAudit(env, brand.id)]);
    return html(brandShell({ base, brand, active: tab, content: overviewTab({ brand, run: run || null, rows, prevRows, audit }) }));
  }
  if (tab === 'rival' && rest.length === 2) {
    const img = await rivalImage(env, brand.id, decodeURIComponent(rest[1]).slice(0, 120));
    if (!img) return message(base, 'Not found', 'There is no screenshot yet.');
    return new Response(img.bytes, { headers: { 'content-type': img.type, ...headers() } });
  }
  if (tab === 'schedule') return html(brandShell({ base, brand, active: tab, content: scheduleTab(brand, { nextRun: nextRunDay(brand) }) }));
  if (tab) return message(base, 'Not found', 'There is no page here.');
  return html(brandShell({ base, brand, active: '', content: await visibilityTab(env, url, brand) }));
}

function nextRunDay(brand) {
  const c = ukClock();
  let days = (Number(brand.run_weekday) - c.weekday + 7) % 7;
  if (days === 0 && c.hour >= 6) days = 7;
  const d = new Date(`${c.day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const TREND_SQL = `SELECT r.id, r.kind, r.status, r.started_at, r.completed_at, r.attempts, r.total,
  count(s.answer_id) AS n, coalesce(sum(s.brand_named), 0) AS named, avg(s.brand_position) AS pos,
  coalesce(sum(a.grp = 'A'), 0) AS na, coalesce(sum(CASE WHEN a.grp = 'A' THEN s.brand_named END), 0) AS nameda,
  coalesce(sum(a.grp = 'B'), 0) AS nb, coalesce(sum(CASE WHEN a.grp = 'B' THEN s.brand_named END), 0) AS namedb
  FROM runs r LEFT JOIN answers a ON a.run_id = r.id AND a.status = 'done' LEFT JOIN scores s ON s.answer_id = a.id
  WHERE r.brand_id = ? GROUP BY r.id ORDER BY r.started_at DESC LIMIT 26`;

// What the competitors tab needs from a run: no answer text, just the scores and links.
async function competitorRows(env, runId) {
  const { results } = await db(env)
    .prepare(`SELECT a.id, a.prompt_text, a.grp, a.status, a.citations, s.status AS s_status, s.brand_named, s.brand_position, s.recommended
      FROM answers a LEFT JOIN scores s ON s.answer_id = a.id WHERE a.run_id = ? ORDER BY a.id`)
    .bind(runId)
    .all();
  return results;
}

async function visibilityTab(env, url, brand) {
  const d = db(env);
  const { results: trend } = await d.prepare(TREND_SQL).bind(brand.id).all();
  const pick = Number(url.searchParams.get('run')) || null;
  const run = (pick && trend.find((r) => r.id === pick)) || trend.find((r) => r.status === 'running') || trend.find((r) => r.status === 'complete') || trend[0];
  const promptCount = (await d.prepare(`SELECT count(*) AS n FROM prompts WHERE brand_id = ? AND active = 1`).bind(brand.id).first()).n;
  if (!run) return visibilityContent({ brand, trend, run: null, promptCount });
  const group = (url.searchParams.get('group') || '').slice(0, 1) || null;
  const prompt = Number(url.searchParams.get('prompt')) || null;
  const { results: rows } = await d
    .prepare(`SELECT a.id, a.prompt_id, a.prompt_text, a.grp, a.attempt, a.status, a.error, a.model, a.citations, a.searches, a.input_tokens, a.output_tokens,
      ${prompt ? 'CASE WHEN a.prompt_id = ? THEN a.text END AS text,' : ''}
      s.status AS s_status, s.brand_named, s.brand_position, s.domain_cited, s.recommended, s.above, s.flags
      FROM answers a LEFT JOIN scores s ON s.answer_id = a.id WHERE a.run_id = ? ORDER BY a.id`)
    .bind(...(prompt ? [prompt, run.id] : [run.id]))
    .all();
  const link = (change) => {
    const q = new URLSearchParams();
    const next = { run: run.id, group, prompt, ...change };
    if (next.run && next.run !== trend[0]?.id) q.set('run', next.run);
    if (next.group) q.set('group', next.group);
    if (next.prompt) q.set('prompt', next.prompt);
    const s = q.toString();
    return `/admin/brands/${brand.slug}/${s ? `?${s}` : ''}${change.group !== undefined || change.prompt !== undefined ? '#answers' : ''}`;
  };
  const answerHref = (id) => `/admin/brands/${brand.slug}/answers/${id}/`;
  const progress = run.status === 'running' ? await runProgress(env, run.id) : null;
  const shot = homepageOf(brand) ? await screenInfo(env, brand.id) : null;
  const action = `<button type="button" data-action="screen-take" data-token="${esc(brand.slug)}" data-label="${shot ? 'Take a new screenshot' : 'Take a screenshot'}" data-wait="Taking a screenshot of the homepage…">${shot ? 'Take a new screenshot' : 'Take a screenshot'}</button>`;
  const screen = homepageOf(brand)
    ? { src: shot ? `/admin/brands/${brand.slug}/screen/?t=${encodeURIComponent(shot.taken_at)}` : null, url: shot?.url || homepageOf(brand), tint: shot?.tint, taken_at: shot?.taken_at, action }
    : null;
  return visibilityContent({ brand, trend, run, rows, group, prompt, link, answerHref, progress, promptCount, screen });
}

/* ---------- Actions ---------- */

// A Search Console property: sc-domain:example.com, or a URL prefix ending in a slash.
function gscSite(v) {
  const t = clip(v, 200).toLowerCase();
  if (/^sc-domain:[a-z0-9.-]+\.[a-z]{2,}$/.test(t)) return t;
  if (/^https?:\/\/[a-z0-9.-]+\.[a-z]{2,}(\/[^\s]*)?$/.test(t)) return t.endsWith('/') ? t : `${t}/`;
  return '';
}

function brandFields(f, { isNew }) {
  const name = clip(f.name, 120);
  if (!name) return { error: 'Please add the brand name.' };
  const slug = isNew ? (clip(f.slug, 40) || name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) : null;
  if (isNew && (!slug || slug === 'new')) return { error: 'Please choose a different short name.' };
  const flags = [];
  for (const line of String(f.flags || '').split(/\r?\n/)) {
    const t = line.trim();
    if (!t) continue;
    const i = t.indexOf(':');
    const label = clip(i > 0 ? t.slice(0, i) : t, 60);
    const description = clip(i > 0 ? t.slice(i + 1) : '', 300);
    const key = flagKey(label);
    if (label && !flags.some((x) => x.key === key)) flags.push({ key, label, description });
    if (flags.length >= 12) break;
  }
  const domains = String(f.match_domains || '').split(/[\n,]+/).map((s) => s.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '')).filter((s) => /^[a-z0-9.-]+\.[a-z]{2,}$/.test(s)).slice(0, 20);
  const launch = /^\d{4}-\d{2}-\d{2}$/.test(String(f.launch_date || '')) ? f.launch_date : null;
  return {
    slug,
    name,
    match_names: JSON.stringify(list(f.match_names, 20).map((s) => s.slice(0, 120))),
    match_domains: JSON.stringify([...new Set(domains)]),
    facts: clip(f.facts, 4000),
    flags: JSON.stringify(flags),
    launch_date: launch,
    ga4_property: clip(f.ga4_property, 20).replace(/[^0-9]/g, ''),
    gsc_site: gscSite(f.gsc_site),
    ga4_goal: /^[A-Za-z][A-Za-z0-9_]{0,39}$/.test(clip(f.ga4_goal, 40)) ? clip(f.ga4_goal, 40) : '',
    uk_only: f.uk_only ? 1 : 0,
    asks_per_week: Math.min(10, Math.max(1, Math.round(Number(f.asks_per_week) || 3))),
    run_weekday: Math.min(6, Math.max(0, Math.round(Number(f.run_weekday ?? 1)))),
    active: f.active === undefined ? 1 : f.active ? 1 : 0,
  };
}

async function act(env, body, ctx, request, base) {
  const d = db(env);
  const token = clip(body.token, 60);
  const f = body.fields && typeof body.fields === 'object' ? body.fields : {};
  if (token === 'SAMPLE') return json({ ok: false, error: 'This is a sample, so the buttons do nothing here.' }, 400);

  if (body.action === 'brand-add') {
    const v = brandFields(f, { isNew: true });
    if (v.error) return json({ ok: false, error: v.error }, 400);
    if (await getBrand(env, v.slug)) return json({ ok: false, error: 'A brand with that short name already exists.' }, 409);
    const at = now();
    await d
      .prepare(`INSERT INTO brands (slug, name, match_names, match_domains, facts, flags, launch_date, ga4_property, gsc_site, ga4_goal, uk_only, asks_per_week, run_weekday, active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`)
      .bind(v.slug, v.name, v.match_names, v.match_domains, v.facts, v.flags, v.launch_date, v.ga4_property, v.gsc_site, v.ga4_goal, v.uk_only, v.asks_per_week, v.run_weekday, at, at)
      .run();
    return json({ ok: true, message: 'Brand added. Now paste in the prompt list.', go: `/admin/brands/${v.slug}/settings/` });
  }

  if (body.action === 'rival-check') {
    const brand = await getBrand(env, token);
    if (!brand) return json({ ok: false, error: 'Brand not found.' }, 404);
    if (!(await allowed(env, 'DOCS_RL_PDF', request, RL))) return json({ ok: false, error: 'Too many checks in a short time. Please wait a minute.' }, 429);
    const key = clip(f.key, 120);
    const name = clip(f.name, 120);
    if (!key || !name) return json({ ok: false, error: 'Which competitor?' }, 400);
    const r = await checkRival(env, brand, key, name, clip(f.domain, 120));
    if (!r.ok) return json({ ok: false, error: r.error }, 400);
    return json({ ok: true, message: 'Checked.', go: `/admin/brands/${brand.slug}/competitors/` });
  }

  if (body.action === 'audit-run') {
    const brand = await getBrand(env, token);
    if (!brand) return json({ ok: false, error: 'Brand not found.' }, 404);
    if (!brand.ga4_property) return json({ ok: false, error: 'Add the GA4 property in Settings first.' }, 400);
    if (!googleReady(env)) return json({ ok: false, error: 'The Google key (GOOGLE_SA_KEY) is not set up yet.' }, 400);
    if (!(await allowed(env, 'DOCS_RL_PDF', request, RL))) return json({ ok: false, error: 'Too many audits in a short time. Please wait a minute.' }, 429);
    const p = periodFrom(f, brand, ukClock().day);
    if (p.error) return json({ ok: false, error: p.error }, 400);
    let data;
    try {
      data = await runAudit(env, brand, p);
    } catch (e) {
      if (e instanceof GoogleError) return json({ ok: false, error: e.message }, 502);
      throw e;
    }
    const id = await saveAudit(env, brand, data);
    return json({ ok: true, message: 'Audit done.', go: `/admin/brands/${brand.slug}/ga4/?audit=${id}` });
  }

  if (body.action === 'brand-save' || body.action === 'prompts-save' || body.action === 'run-now' || body.action === 'screen-take') {
    const brand = await getBrand(env, token);
    if (!brand) return json({ ok: false, error: 'Brand not found.' }, 404);
    if (body.action === 'brand-save') {
      const v = brandFields(f, { isNew: false });
      if (v.error) return json({ ok: false, error: v.error }, 400);
      await d
        .prepare(`UPDATE brands SET name = ?, match_names = ?, match_domains = ?, facts = ?, flags = ?, launch_date = ?, ga4_property = ?, gsc_site = ?, ga4_goal = ?, uk_only = ?, asks_per_week = ?, run_weekday = ?, active = ?, updated_at = ? WHERE id = ?`)
        .bind(v.name, v.match_names, v.match_domains, v.facts, v.flags, v.launch_date, v.ga4_property, v.gsc_site, v.ga4_goal, v.uk_only, v.asks_per_week, v.run_weekday, v.active, now(), brand.id)
        .run();
      return json({ ok: true, message: 'Settings saved.' });
    }
    if (body.action === 'prompts-save') {
      const parsed = parsePromptList(f.list);
      if (!parsed.prompts.length) return json({ ok: false, error: 'No prompts found. Start with a group line such as "A. Recommendation, no modifier", then numbered prompts.' }, 400);
      if (parsed.tooMany) return json({ ok: false, error: 'That is more than 45 prompts. Please shorten the list.' }, 400);
      const r = await savePromptList(env, brand, parsed);
      const groups = Object.keys(parsed.groups).length;
      const skipped = parsed.skipped.length ? ` Skipped ${parsed.skipped.length} line${parsed.skipped.length === 1 ? '' : 's'} that weren't a group or a numbered prompt: "${parsed.skipped[0]}"${parsed.skipped.length > 1 ? ' and others' : ''}.` : '';
      return json({ ok: true, message: `Saved ${r.saved} prompts in ${groups} group${groups === 1 ? '' : 's'}${r.removed ? `, ${r.removed} switched off` : ''}.${skipped}` });
    }
    if (body.action === 'screen-take') {
      if (!(await allowed(env, 'DOCS_RL_PDF', request, RL))) return json({ ok: false, error: 'Too many screenshots in a short time. Please wait a minute.' }, 429);
      const r = await takeScreen(env, brand);
      return json(r.ok ? { ok: true, message: 'Screenshot taken.' } : r, r.ok ? 200 : 400);
    }
    // Run now: queue the whole run and ask the first batch straight away, while a fresh phone
    // screenshot of the homepage is taken alongside.
    const run = await startRun(env, brand, { kind: 'manual' });
    const [first] = await Promise.all([
      processBatch(env, { runId: run.id }),
      homepageOf(brand) ? takeScreen(env, brand).catch((e) => console.error('[insights] screenshot', e.message)) : null,
    ]);
    return json({ ok: true, message: `Run started: ${run.total} questions. ${first.asked} answered so far.` });
  }

  if (String(body.action || '').startsWith('report-')) return reportAction(env, body, base);

  if (['run-step', 'run-stop', 'rescore'].includes(body.action)) {
    const runId = Number(token) || 0;
    const run = await d.prepare(`SELECT id, status FROM runs WHERE id = ?`).bind(runId).first();
    if (!run) return json({ ok: false, error: 'Run not found.' }, 404);
    if (body.action === 'run-step') {
      if (run.status === 'running') await processBatch(env, { runId });
      return json({ ok: true, progress: progressOf(await runProgress(env, runId)) });
    }
    if (body.action === 'run-stop') {
      await stopRun(env, runId);
      return json({ ok: true, message: 'Run stopped. Answers already asked are kept.' });
    }
    const n = await rescoreRun(env, runId);
    ctx?.waitUntil?.(processBatch(env, { runId }).catch((e) => console.error('[insights] rescore', e.message)));
    return json({ ok: true, message: `${n} answers queued for scoring again.` });
  }

  return json({ ok: false, error: 'Not found' }, 404);
}

/* ---------- Cron ---------- */

export async function insightsCron(env, when) {
  if (!env.INSIGHTS_DB) return;
  await ensureSchema(env);
  const out = await cron(env, when);
  if (out.started.length || out.batch?.claimed || out.batch?.rescored) console.log('[insights] cron', JSON.stringify(out));
}
