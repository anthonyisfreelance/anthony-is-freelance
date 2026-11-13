// Client documents on docs.anthonyis.uk: quotes, contracts and invoices, each at an unguessable link.
//
//   /quote/<token>/                 the quote
//   /quote/<token>/contract/        its contract (signing panel until signed)
//   /quote/<token>/quote.pdf        PDFs of the same pages (also contract.pdf)
//   /quote/<token>/sign/code        POST: email a one-time code to the signer
//   /quote/<token>/sign/confirm     POST: check the code and record the signature
//   /quote/<token>/sign/finalise    POST: signed PDFs to Drive, email both sides, draft the deposit invoice
//   /invoice/<token>/               the invoice (and invoice.pdf)
//   /admin/                         Anthony's list of documents and actions
//   /admin/samples/                 made-up sample documents and emails, for checking the design
//   /                               redirects to anthonyis.uk
//
// Document data lives as JSON files in Anthony's Google Drive, read and written through the Drive
// bridge (bridge.js). How it all fits together: worker/docs/README.md.
//
// Settings (Cloudflare dashboard > Worker > Settings > Variables and secrets). Add them as secrets:
// plain-text variables set in the dashboard are wiped by the next deploy.
//   DOCS_SECRET     any long random string; signs the code and login cookies
//   BRIDGE_URL      the Drive bridge web app URL
//   BRIDGE_KEY      shared with the Drive bridge
//   RESEND_API_KEY  already set for the enquiry form; sends codes and notices
//   ADMIN_EMAIL     optional, defaults to hello@anthonyis.uk
//
// Security (README "Security"): unguessable links, a strict CSP on every page (security.js), rate
// limits per IP, POSTs only from this site, signing only from the client's own email domain with a
// one-time code, admin login by emailed code with a notice on every login, and a Withdraw switch.

import { esc, money, fmtDateTime, today, addDays, shell, masthead, eyebrow, COMPANY, PAYMENT_DAYS } from './shared.js';
import { renderQuote, quoteTotals, stageAmounts, stageLabel } from './quote.js';
import { renderContract, fingerprintSource } from './contract.js';
import { renderInvoice, invoiceTotals } from './invoice.js';
import { renderAdmin, renderLogin } from './admin.js';
import { getDoc, putDoc, createDoc, listDocs, getSettings, savePdf, sendEmail, nextInvoiceSeq, BridgeError } from './bridge.js';
import { renderPdfs, toBase64 } from './pdf.js';
import { resend } from './mail.js';
import { seal, unseal, hmac, sha256Hex, newCode, newToken, getCookie, cookie, same } from './auth.js';
import { page as html, headers, allowed, codeAllowed, cachedPdf } from './security.js';
import { quoteEmail, signedEmail, invoiceEmail, signCodeEmail, loginCodeEmail, loginNotice, signedNotice, signatureTest } from './emails.js';
import { samplePage, samplePdfHtml, samplePdfView, samplesIndex, signaturePage, SAMPLE_QUOTE } from './samples.js';

function json(data, status = 200, extra = {}) {
  const h = new Headers({ 'content-type': 'application/json', ...headers() });
  for (const [k, v] of Object.entries(extra)) for (const one of [].concat(v)) h.append(k, one);
  return new Response(JSON.stringify(data), { status, headers: h });
}
const pdfResponse = (bytes, name) =>
  new Response(bytes, { headers: { 'content-type': 'application/pdf', 'content-disposition': `inline; filename="${name}"`, ...headers() } });
const tooMany = (request) =>
  request.method === 'GET'
    ? message('', 'Too many requests', 'Please wait a minute and try again.', 429)
    : json({ ok: false, error: 'Too many tries in a short time. Please wait a minute and try again.' }, 429);

// One PDF, from the cache when the same page was rendered before. Fresh renders are rate limited.
async function pdfOf(request, env, ctx, origin, page, name) {
  const render = async (h) => (await renderPdfs(env, [h]))[0];
  const bytes = await cachedPdf(env, ctx, origin, page, render, () => allowed(env, 'DOCS_RL_PDF', request));
  return bytes ? pdfResponse(bytes, name) : tooMany(request);
}

const CODE_MINUTES = 10;
const ADMIN_DAYS = 14;

const pad = (n) => String(n).padStart(2, '0');
const fileBase = (d, kind) => `Anthonyis_${d.key}_${kind}_${pad(d.seq || 1)}`;
const adminEmail = (env) => env.ADMIN_EMAIL || COMPANY.email;

// Is this request from a logged-in admin? Also used by the comment tool on the sample pages.
export async function adminSession(request, env) {
  return Boolean(await unseal(env.DOCS_SECRET, getCookie(request, 'doc_admin')));
}

// POSTs must come from a page on this site (browsers always send Origin with a POST).
const fromHere = (request, url) => request.headers.get('origin') === url.origin;

function message(base, title, text, status = 404) {
  const body = `${masthead('Document', '')}<h1>${eyebrow('Anthony is Freelance')}${esc(title)}</h1><p style="margin-top:6mm">${esc(text)}</p>`;
  return html(shell({ title, base, body }), status);
}

// Returns null for paths that aren't documents, so the site handles them.
export async function docs(request, env, ctx) {
  const url = new URL(request.url);
  const base = url.origin;
  const parts = url.pathname.split('/').filter(Boolean);

  try {
    if (!parts.length) return Response.redirect('https://anthonyis.uk/', 302);
    if (parts[0] === 'admin') return await admin(request, env, url, parts.slice(1), ctx);
    const kind = parts[0];
    if (kind !== 'quote' && kind !== 'invoice') return null;
    const token = parts[1];
    if (!token) return message(base, 'Not found', 'This link is not a document.');
    const rest = parts.slice(2).join('/');

    // Pages always end in a slash (site rule); PDFs and POST routes don't.
    if (request.method === 'GET' && !url.pathname.endsWith('/') && !rest.endsWith('.pdf')) {
      return Response.redirect(`${base}${url.pathname}/`, 301);
    }

    if (request.method === 'POST' && kind === 'quote' && rest.startsWith('sign/')) {
      if (!fromHere(request, url)) return json({ ok: false, error: 'Not allowed.' }, 403);
      if (!(await allowed(env, 'DOCS_RL_POST', request))) return tooMany(request);
      if (token === SAMPLE_QUOTE) return sampleSign(rest.slice(5));
      return await sign(request, env, url, token, rest.slice(5));
    }
    if (request.method !== 'GET') return json({ ok: false, error: 'Not found' }, 404);

    if (!(await allowed(env, 'DOCS_RL_READ', request))) return tooMany(request);

    const doc = await getDoc(env, token);
    if (!doc || doc.type !== kind) return message(base, 'Document not found', `This link doesn't match a document. Check the link, or email ${COMPANY.email}.`);
    const isAdmin = await adminSession(request, env);
    if (doc.state?.withdrawnAt && !isAdmin) {
      return message(base, 'Document withdrawn', `This ${kind} is no longer available. Please email ${COMPANY.email} if you need a copy.`, 410);
    }
    const settings = await getSettings(env);

    // First view by the client moves a sent document to "viewed".
    if (!isAdmin && doc.state?.sentAt && !doc.state.viewedAt && !rest) {
      doc.state.viewedAt = new Date().toISOString();
      ctx?.waitUntil(putDoc(env, doc).catch(() => {}));
    }

    if (doc.type === 'quote') {
      if (!rest) return html(renderQuote(doc, { base }));
      if (rest === 'contract') return html(contractPage(doc, { base, settings }));
      if (rest === 'quote.pdf') {
        return pdfOf(request, env, ctx, base, renderQuote(doc, { base, pdf: true }), `${fileBase(doc, 'Quote')}.pdf`);
      }
      if (rest === 'contract.pdf') {
        const page = doc.state?.contractHtml || renderContract(doc, { base, settings, pdf: true });
        return pdfOf(request, env, ctx, base, page, `${fileBase(doc, 'Contract')}.pdf`);
      }
    }
    if (doc.type === 'invoice') {
      if (!rest) return html(renderInvoice(doc, { base, settings }));
      if (rest === 'invoice.pdf') {
        return pdfOf(request, env, ctx, base, renderInvoice(doc, { base, settings, pdf: true }), `${fileBase(doc, 'Invoice')}.pdf`);
      }
    }
    return message(base, 'Not found', 'This page is not part of the document.');
  } catch (e) {
    console.error('[docs]', e);
    const text = e instanceof BridgeError
      ? `The document store didn't answer just now. Please try again in a minute, or email ${COMPANY.email}.`
      : `Something went wrong. Please try again in a minute, or email ${COMPANY.email}.`;
    if (request.method === 'POST') return json({ ok: false, error: text }, 500);
    return message(base, 'Something went wrong', text, 500);
  }
}

// After signing, the contract page is the snapshot taken at the moment of signing.
function contractPage(doc, { base, settings }) {
  if (doc.state?.contractHtml) {
    const bar = `<div class="bar"><a href="/quote/${esc(doc.token)}/">Back to the quote</a><a href="/quote/${esc(doc.token)}/contract.pdf">Download signed PDF</a></div>`;
    return doc.state.contractHtml.replace('<body>\n', `<body>\n${bar}\n`);
  }
  return renderContract(doc, { base, settings });
}

/* ---------- Signing ---------- */

const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;
const clip = (v, n) => String(v || '').trim().slice(0, n);

// Who may sign: the person the quote was sent to, anyone at the same company email domain, or
// anyone listed in contract.signers (addresses, or domains as "@example.com"). Shared webmail
// domains only allow the exact address, since anyone can have a Gmail account.
const WEBMAIL = new Set(('gmail.com googlemail.com outlook.com hotmail.com hotmail.co.uk live.com live.co.uk msn.com yahoo.com '
  + 'yahoo.co.uk ymail.com icloud.com me.com mac.com aol.com protonmail.com proton.me pm.me gmx.com gmx.co.uk btinternet.com '
  + 'sky.com virginmedia.com talktalk.net zoho.com mail.com').split(' '));
function maySign(doc, email) {
  const domain = email.split('@')[1];
  const listed = (doc.contract?.signers || []).map((s) => String(s).trim().toLowerCase());
  const contact = String(doc.client?.contact?.email || '').toLowerCase();
  if (email === contact || listed.includes(email) || listed.includes(`@${domain}`)) return { ok: true };
  const home = contact.split('@')[1];
  if (home && domain === home && !WEBMAIL.has(home)) return { ok: true };
  return {
    ok: false,
    error: home && !WEBMAIL.has(home)
      ? `Please use your @${home} email address. If someone else is signing, email ${COMPANY.email} and I'll add them.`
      : `Please use the email address the quote was sent to. If someone else is signing, email ${COMPANY.email} and I'll add them.`,
  };
}

// The sample contract: sending a code works, so the panel can be checked; signing is switched off.
function sampleSign(step) {
  if (step === 'code') return json({ ok: true, devCode: '123456' });
  return json({ ok: false, error: 'This is a sample, so signing is switched off here. For a real contract, this is where it would be signed.' }, 400);
}

async function readJson(request) {
  if (!(request.headers.get('content-type') || '').includes('application/json')) return null;
  try {
    return await request.json();
  } catch {
    return null;
  }
}

async function sign(request, env, url, token, step) {
  const body = await readJson(request);
  if (!body) return json({ ok: false, error: 'The request could not be read.' }, 400);
  if (!env.DOCS_SECRET) return json({ ok: false, error: `Online signing isn't switched on yet. Please email ${COMPANY.email}.` }, 503);

  const doc = await getDoc(env, token);
  if (!doc || doc.type !== 'quote') return json({ ok: false, error: 'This contract was not found.' }, 404);
  if (doc.state?.withdrawnAt) return json({ ok: false, error: `This quote has been withdrawn. Please email ${COMPANY.email}.` }, 410);
  const signed = Boolean(doc.state?.signedAt);

  if (step === 'finalise') {
    if (!signed) return json({ ok: false, error: 'This contract has not been signed yet.' }, 400);
    const result = await finalise(env, doc, url.origin);
    return json({ ok: true, ...result });
  }

  if (signed) return json({ ok: false, error: 'This contract is already signed.' }, 409);
  if (doc.validUntil && doc.validUntil < today()) return json({ ok: false, error: `This quote has expired. Please email ${COMPANY.email}.` }, 410);

  if (step === 'code') {
    const email = clip(body.email, 200).toLowerCase();
    if (!EMAIL_RE.test(email)) return json({ ok: false, error: 'Please add a valid email address.' }, 400);
    const who = maySign(doc, email);
    if (!who.ok) return json({ ok: false, error: who.error }, 403);
    const code = newCode();
    const sealed = await seal(env.DOCS_SECRET, { t: token, e: email, n: newToken(8), h: await hmac(env.DOCS_SECRET, `${code}|${token}|${email}`), a: 0 }, CODE_MINUTES * 60);
    await resend(env, { to: email, ...signCodeEmail({ code, name: body.name, doc }) });
    return json({ ok: true, ...(env.DOCS_DEV === '1' ? { devCode: code } : {}) }, 200, { 'set-cookie': cookie('doc_code', sealed, CODE_MINUTES * 60) });
  }

  if (step === 'confirm') {
    const pending = await unseal(env.DOCS_SECRET, getCookie(request, 'doc_code'));
    const email = clip(body.email, 200).toLowerCase();
    if (!pending || pending.t !== token) return json({ ok: false, error: 'That code has expired. Please send a new one.' }, 400);
    if (pending.a >= 5) return json({ ok: false, error: 'Too many tries. Please send a new code.' }, 429);
    if (pending.e !== email) return json({ ok: false, error: 'The email address changed since the code was sent. Please send a new code.' }, 400);
    if (!(await codeAllowed(env, pending.n))) return json({ ok: false, error: 'Too many tries. Please wait a minute, or send a new code.' }, 429);
    const expect = await hmac(env.DOCS_SECRET, `${clip(body.code, 6)}|${token}|${email}`);
    if (!same(expect, pending.h)) {
      const retry = await seal(env.DOCS_SECRET, { ...pending, exp: undefined, a: (pending.a || 0) + 1 }, Math.max(1, Math.round((pending.exp - Date.now()) / 1000)));
      return json({ ok: false, error: "That code isn't right. Please check the email and try again." }, 400, { 'set-cookie': cookie('doc_code', retry, CODE_MINUTES * 60) });
    }

    const f = {
      legalName: clip(body.legalName, 160),
      companyNumber: clip(body.companyNumber, 20),
      address: clip(body.address, 300),
      name: clip(body.name, 120),
      position: clip(body.position, 120),
      email,
    };
    if (!f.legalName || !f.address || !f.name || !f.position) return json({ ok: false, error: 'Please complete your company and personal details.' }, 400);
    const image = String(body.image || '');
    if (!/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(image) || image.length > 1_500_000) {
      return json({ ok: false, error: 'The signature could not be read. Please clear it and sign again.' }, 400);
    }

    const settings = await getSettings(env);
    const signedAt = new Date().toISOString();
    doc.state = {
      ...(doc.state || {}),
      status: 'signed',
      signedAt,
      signature: {
        ...f,
        method: ['draw', 'type', 'upload'].includes(body.method) ? body.method : 'draw',
        image,
        signedAt,
        ip: request.headers.get('cf-connecting-ip') || '',
        userAgent: clip(request.headers.get('user-agent'), 300),
        fingerprint: await sha256Hex(fingerprintSource(doc)),
      },
    };
    // The record of what was signed: the contract exactly as it stood, kept with the data.
    doc.state.contractHtml = renderContract(doc, { base: url.origin, settings, pdf: true });
    await putDoc(env, doc);
    return json({ ok: true }, 200, { 'set-cookie': cookie('doc_code', '', 0) });
  }

  return json({ ok: false, error: 'Not found' }, 404);
}

// Everything that follows a signature. Safe to run again: each step is skipped once done.
async function finalise(env, doc, base) {
  const s = doc.state;
  if (s.finalisedAt) return { already: true };
  if (s.finalisingAt && Date.now() - Date.parse(s.finalisingAt) < 2 * 60 * 1000) return { busy: true };
  s.finalisingAt = new Date().toISOString();
  await putDoc(env, doc);

  const settings = await getSettings(env);
  const [contractPdf, quotePdf] = await renderPdfs(env, [s.contractHtml, renderQuote(doc, { base, pdf: true })]);
  const contractFile = await savePdf(env, { kind: 'contract', name: `${fileBase(doc, 'Contract')}.pdf`, base64: toBase64(contractPdf) });
  const quoteFile = await savePdf(env, { kind: 'quote', name: `${fileBase(doc, 'Quote')}.pdf`, base64: toBase64(quotePdf) });
  s.contractFileId = contractFile.id;
  s.quoteFileId = quoteFile.id;

  const sig = s.signature;
  const to = [...new Set([sig.email, doc.client?.contact?.email].filter(Boolean).map((e) => e.toLowerCase()))];
  const deposit = stageAmounts(doc)[0];
  await sendEmail(env, {
    to,
    ...signedEmail({ base, doc, sig, deposit }),
    attachments: [{ fileId: contractFile.id }, { fileId: quoteFile.id }],
  });

  let invoice = null;
  if (deposit && !(s.invoices || []).some((i) => Number(i.stage) === 0)) invoice = await createStageInvoice(env, doc, 0);

  s.finalisedAt = new Date().toISOString();
  delete s.finalisingAt;
  await putDoc(env, doc);

  await resend(env, { to: adminEmail(env), ...signedNotice({ base, doc, sig, to, invoice, deposit }) })
    .catch((e) => console.error('[docs] notice', e));

  return { invoice: invoice?.number || null };
}

async function createStageInvoice(env, quote, index) {
  const stage = stageAmounts(quote)[index];
  if (!stage) throw new Error('That payment stage does not exist.');
  const seq = await nextInvoiceSeq(env, quote.key);
  const sig = quote.state?.signature || {};
  const issued = today();
  const invoice = {
    type: 'invoice',
    token: newToken(),
    key: quote.key,
    seq,
    number: `${quote.key}_${pad(seq)}`,
    issued,
    due: addDays(issued, PAYMENT_DAYS),
    title: quote.title,
    project: quote.title,
    kind: 'stage',
    rate: quote.pricing?.rate || 8000,
    quoteToken: quote.token,
    quoteNumber: quote.number,
    stageIndex: index,
    client: {
      name: quote.client?.name,
      legalName: sig.legalName || quote.client?.legalName || '',
      companyNumber: sig.companyNumber || quote.client?.companyNumber || '',
      address: sig.address || quote.client?.address || '',
      vatNumber: quote.client?.vatNumber || '',
      contact: { name: sig.name || quote.client?.contact?.name, email: sig.email || quote.client?.contact?.email },
    },
    lines: [{
      description: stageLabel(stage),
      detail: `${stage.percent}% of the ${money(quoteTotals(quote).subtotal)} + VAT project total, ${stage.due.charAt(0).toLowerCase()}${stage.due.slice(1)}. Quote ${quote.number}.`,
      amount: stage.net,
    }],
    state: { status: 'draft', createdAt: new Date().toISOString() },
  };
  await createDoc(env, invoice, `Anthonyis_${invoice.key}_Invoice_${pad(seq)}`);
  quote.state.invoices = [...(quote.state.invoices || []), { stage: index, token: invoice.token, number: invoice.number }];
  return invoice;
}

/* ---------- Admin ---------- */

async function admin(request, env, url, parts, ctx) {
  const base = url.origin;
  const session = await adminSession(request, env);
  const action = parts[0] || '';

  if (request.method === 'GET') {
    if (!(await allowed(env, 'DOCS_RL_READ', request))) return tooMany(request);
    if (action === 'samples' && session) return await samples(request, env, url, parts.slice(1), ctx);
    if (action || !url.pathname.endsWith('/')) return Response.redirect(`${base}/admin/`, 302);
    if (!session) return html(renderLogin({ base, to: adminEmail(env) }));
    let docs = [];
    let error = '';
    try {
      docs = await listDocs(env);
    } catch (e) {
      error = e.message;
    }
    return html(renderAdmin({ base, docs, error, year: url.searchParams.get('year') }));
  }

  // POSTs: JSON from a page on this site only.
  if (!fromHere(request, url)) return json({ ok: false, error: 'Not allowed.' }, 403);
  if (!(await allowed(env, 'DOCS_RL_POST', request))) return tooMany(request);
  const body = await readJson(request);
  if (!body) return json({ ok: false, error: 'The request could not be read.' }, 400);
  if (!env.DOCS_SECRET) return json({ ok: false, error: 'DOCS_SECRET is not set yet.' }, 503);

  const ip = request.headers.get('cf-connecting-ip') || '';
  const place = [request.cf?.city, request.cf?.country].filter(Boolean).join(', ');

  if (action === 'code') {
    const code = newCode();
    const sealed = await seal(env.DOCS_SECRET, { n: newToken(8), h: await hmac(env.DOCS_SECRET, `admin|${code}`), a: 0 }, CODE_MINUTES * 60);
    await resend(env, { to: adminEmail(env), ...loginCodeEmail({ code, ip, place }) });
    return json({ ok: true, to: adminEmail(env), ...(env.DOCS_DEV === '1' ? { devCode: code } : {}) }, 200, { 'set-cookie': cookie('doc_admin_code', sealed, CODE_MINUTES * 60) });
  }
  if (action === 'verify') {
    const pending = await unseal(env.DOCS_SECRET, getCookie(request, 'doc_admin_code'));
    if (!pending) return json({ ok: false, error: 'That code has expired. Please send a new one.' }, 400);
    if (pending.a >= 5) return json({ ok: false, error: 'Too many tries. Please send a new code.' }, 429);
    if (!(await codeAllowed(env, pending.n))) return json({ ok: false, error: 'Too many tries. Please wait a minute, or send a new code.' }, 429);
    if (!same(await hmac(env.DOCS_SECRET, `admin|${clip(body.code, 6)}`), pending.h)) {
      const retry = await seal(env.DOCS_SECRET, { n: pending.n, h: pending.h, a: (pending.a || 0) + 1 }, Math.max(1, Math.round((pending.exp - Date.now()) / 1000)));
      return json({ ok: false, error: "That code isn't right." }, 400, { 'set-cookie': cookie('doc_admin_code', retry, CODE_MINUTES * 60) });
    }
    const sessionCookie = await seal(env.DOCS_SECRET, { admin: 1 }, ADMIN_DAYS * 24 * 3600);
    // A notice on every login, so a login that wasn't Anthony is spotted straight away.
    const notice = resend(env, {
      to: adminEmail(env),
      ...loginNotice({ when: fmtDateTime(new Date().toISOString()), ip, place, ua: clip(request.headers.get('user-agent'), 200) }),
    }).catch((e) => console.error('[docs] login notice', e));
    if (ctx?.waitUntil) ctx.waitUntil(notice);
    return json({ ok: true }, 200, {
      'set-cookie': [cookie('doc_admin', sessionCookie, ADMIN_DAYS * 24 * 3600), cookie('doc_admin_code', '', 0)],
    });
  }
  if (action === 'logout') {
    return json({ ok: true }, 200, { 'set-cookie': cookie('doc_admin', '', 0) });
  }

  if (!session) return json({ ok: false, error: 'Please log in again.' }, 401);
  // Signature designs being tried: one test email each, to Anthony only, from his Gmail.
  if (action === 'test-signatures') {
    for (const kind of ['headline', 'one-line']) await sendEmail(env, { to: [adminEmail(env)], ...signatureTest(kind) });
    return json({ ok: true, message: `Two test emails sent to ${adminEmail(env)}.` });
  }
  if (action !== 'action') return json({ ok: false, error: 'Not found' }, 404);

  if (String(body.token || '').startsWith('SAMPLE')) return json({ ok: false, error: 'This is the sample admin page, so the buttons do nothing here.' }, 400);
  const doc = await getDoc(env, String(body.token || ''));
  if (!doc) return json({ ok: false, error: 'Document not found.' }, 404);
  const settings = await getSettings(env);
  const now = new Date().toISOString();
  if (doc.state?.withdrawnAt && body.action !== 'restore') return json({ ok: false, error: 'Restore this document before sending it.' }, 400);

  switch (body.action) {
    case 'send-quote': {
      if (doc.type !== 'quote') break;
      const c = doc.client?.contact || {};
      if (!c.email) return json({ ok: false, error: 'This quote has no client email (client.contact.email).' }, 400);
      doc.state = { ...(doc.state || {}), status: 'sent', sentAt: doc.state?.sentAt || now };
      const [bytes] = await renderPdfs(env, [renderQuote(doc, { base, pdf: true })]);
      const file = await savePdf(env, { kind: 'quote', name: `${fileBase(doc, 'Quote')}.pdf`, base64: toBase64(bytes) });
      await sendEmail(env, {
        to: [c.email],
        ...quoteEmail({ base, doc, total: quoteTotals(doc).total }),
        attachments: [{ fileId: file.id }],
      });
      doc.state.quoteFileId = file.id;
      await putDoc(env, doc);
      return json({ ok: true, message: `Quote sent to ${c.email} and saved to Drive.` });
    }
    case 'finalise': {
      if (doc.type !== 'quote' || !doc.state?.signedAt) break;
      if (doc.state.finalisingAt) delete doc.state.finalisingAt;
      const r = await finalise(env, doc, base);
      return json({ ok: true, message: r.invoice ? `Done. Deposit invoice ${r.invoice} drafted.` : 'Done.' });
    }
    case 'create-invoice': {
      if (doc.type !== 'quote' || !doc.state?.signedAt) break;
      const i = Number(body.stage);
      if ((doc.state.invoices || []).some((x) => Number(x.stage) === i)) return json({ ok: false, error: 'That stage already has an invoice.' }, 409);
      const inv = await createStageInvoice(env, doc, i);
      await putDoc(env, doc);
      return json({ ok: true, message: `Invoice ${inv.number} drafted. Check it, then send it.` });
    }
    case 'send-invoice': {
      if (doc.type !== 'invoice') break;
      const c = doc.client?.contact || {};
      if (!c.email) return json({ ok: false, error: 'This invoice has no client email (client.contact.email).' }, 400);
      if (!doc.state?.sentAt) {
        doc.issued = today();
        doc.due = addDays(doc.issued, PAYMENT_DAYS);
      }
      doc.state = { ...(doc.state || {}), status: 'sent', sentAt: doc.state?.sentAt || now };
      const [bytes] = await renderPdfs(env, [renderInvoice(doc, { base, settings, pdf: true })]);
      const file = await savePdf(env, { kind: 'invoice', name: `${fileBase(doc, 'Invoice')}.pdf`, base64: toBase64(bytes), date: doc.issued });
      await sendEmail(env, {
        to: [c.email],
        ...invoiceEmail({ base, doc, total: invoiceTotals(doc).total }),
        attachments: [{ fileId: file.id }],
      });
      doc.state.fileId = file.id;
      await putDoc(env, doc);
      return json({ ok: true, message: `Invoice sent to ${c.email} and saved to Drive.` });
    }
    case 'withdraw': {
      // The link stops working for the client (admin can still open it). Signed contracts stay.
      if (doc.type === 'quote' && doc.state?.signedAt) return json({ ok: false, error: 'A signed contract can\'t be withdrawn.' }, 400);
      doc.state = { ...(doc.state || {}), withdrawnAt: now };
      await putDoc(env, doc);
      return json({ ok: true, message: `${doc.number} withdrawn. Its link no longer works for the client.` });
    }
    case 'restore': {
      if (doc.state) delete doc.state.withdrawnAt;
      await putDoc(env, doc);
      return json({ ok: true, message: `${doc.number} restored. Its link works again.` });
    }
    case 'mark-paid': {
      if (doc.type !== 'invoice') break;
      doc.state = { ...(doc.state || {}), status: 'paid', paidAt: today() };
      await putDoc(env, doc);
      return json({ ok: true, message: `${doc.number} marked as paid.` });
    }
  }
  return json({ ok: false, error: 'That action does not apply to this document.' }, 400);
}

/* ---------- Samples (admin only) ---------- */

async function samples(request, env, url, parts, ctx) {
  const base = url.origin;
  const slug = parts[0] || '';
  let settings = {};
  try {
    settings = await getSettings(env);
  } catch {
    // Samples still show without the bridge; only the designer signature image is missing.
  }
  if (!slug) {
    if (!url.pathname.endsWith('/')) return Response.redirect(`${base}/admin/samples/`, 301);
    return html(samplesIndex({ base }));
  }
  if (slug.endsWith('.pdf')) {
    const page = samplePdfHtml(slug.slice(0, -4), { base, settings });
    if (!page) return message(base, 'Not found', 'There is no PDF for this sample.');
    return pdfOf(request, env, ctx, base, page, `Sample_${slug}`);
  }
  if (!url.pathname.endsWith('/')) return Response.redirect(`${base}${url.pathname}/`, 301);
  if (parts[1] === 'pdf') {
    const view = samplePdfView(slug, { base });
    return view ? html(view) : message(base, 'Not found', 'There is no PDF for this sample.');
  }
  if (parts.length > 1) return message(base, 'Not found', 'There is no sample with that name.');
  if (slug === 'signature') return html(signaturePage({ base }));
  const page = samplePage(slug, { base, settings, year: url.searchParams.get('year') });
  return page ? html(page) : message(base, 'Not found', 'There is no sample with that name.');
}
