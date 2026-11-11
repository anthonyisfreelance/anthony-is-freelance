// Client documents at /doc/*: quotes, contracts and invoices, each at an unguessable link.
//
//   /doc/<token>/                 the quote or invoice
//   /doc/<token>/contract/        the contract for a quote (signing panel until signed)
//   /doc/<token>/<kind>.pdf       the same page as a PDF
//   /doc/<token>/sign/code        POST: email a one-time code to the signer
//   /doc/<token>/sign/confirm     POST: check the code and record the signature
//   /doc/<token>/sign/finalise    POST: signed PDFs to Drive, email both sides, draft the deposit invoice
//   /doc/admin/                   Anthony's list of documents and actions
//
// Document data lives as JSON files in Anthony's Google Drive, read and written through the Drive
// bridge (bridge.js). How it all fits together: worker/docs/README.md.
//
// Settings (Cloudflare dashboard > Worker > Settings > Variables and secrets):
//   DOCS_SECRET     secret, any long random string; signs the code and login cookies
//   BRIDGE_URL      the Drive bridge web app URL
//   BRIDGE_KEY      secret, shared with the Drive bridge
//   RESEND_API_KEY  already set for the enquiry form; sends codes and notices
//   ADMIN_EMAIL     optional, defaults to hello@anthonyis.uk

import { esc, money, fmtDate, today, addDays, shell, masthead, eyebrow, COMPANY, PAYMENT_DAYS } from './shared.js';
import { renderQuote, quoteTotals, stageAmounts, stageLabel } from './quote.js';
import { renderContract, fingerprintSource } from './contract.js';
import { renderInvoice, invoiceTotals } from './invoice.js';
import { renderAdmin, renderLogin } from './admin.js';
import { getDoc, putDoc, createDoc, listDocs, getSettings, savePdf, sendEmail, nextInvoiceSeq, BridgeError } from './bridge.js';
import { renderPdfs, toBase64 } from './pdf.js';
import { resend } from './mail.js';
import { seal, unseal, hmac, sha256Hex, newCode, newToken, getCookie, cookie, same } from './auth.js';

const HEADERS = {
  'cache-control': 'no-store',
  'x-robots-tag': 'noindex, nofollow',
  'referrer-policy': 'no-referrer',
  'x-frame-options': 'DENY',
};
const html = (body, status = 200, extra = {}) =>
  new Response(body, { status, headers: { 'content-type': 'text/html; charset=utf-8', ...HEADERS, ...extra } });
function json(data, status = 200, extra = {}) {
  const headers = new Headers({ 'content-type': 'application/json', ...HEADERS });
  for (const [k, v] of Object.entries(extra)) for (const one of [].concat(v)) headers.append(k, one);
  return new Response(JSON.stringify(data), { status, headers });
}
const pdfResponse = (bytes, name) =>
  new Response(bytes, { headers: { 'content-type': 'application/pdf', 'content-disposition': `inline; filename="${name}"`, ...HEADERS } });

const pad = (n) => String(n).padStart(2, '0');
const fileBase = (d, kind) => `Anthonyis_${d.key}_${kind}_${pad(d.seq || 1)}`;
const adminEmail = (env) => env.ADMIN_EMAIL || COMPANY.email;
const firstName = (n) => String(n || '').trim().split(/\s+/)[0] || 'there';

function message(base, title, text, status = 404) {
  const body = `${masthead('Document', '')}<h1>${eyebrow('Anthony is Freelance')}${esc(title)}</h1><p style="margin-top:6mm">${esc(text)}</p>`;
  return html(shell({ title, base, body }), status);
}

export async function docs(request, env, ctx) {
  const url = new URL(request.url);
  const base = url.origin;
  const parts = url.pathname.replace(/^\/doc\/?/, '').split('/').filter(Boolean);

  try {
    if (parts[0] === 'admin') return await admin(request, env, url, parts.slice(1));
    if (!parts.length) return message(base, 'Not found', 'This link is not a document.');

    const token = parts[0];
    const rest = parts.slice(1).join('/');

    // Pages always end in a slash (site rule); PDFs and POST routes don't.
    if (request.method === 'GET' && !url.pathname.endsWith('/') && !rest.endsWith('.pdf')) {
      return Response.redirect(`${base}${url.pathname}/`, 301);
    }

    if (request.method === 'POST' && rest.startsWith('sign/')) return await sign(request, env, url, token, rest.slice(5));
    if (request.method !== 'GET') return json({ ok: false, error: 'Not found' }, 404);

    const doc = await getDoc(env, token);
    if (!doc) return message(base, 'Document not found', `This link doesn't match a document. Check the link, or email ${COMPANY.email}.`);
    const settings = await getSettings(env);
    const isAdmin = Boolean(await unseal(env.DOCS_SECRET, getCookie(request, 'doc_admin')));

    // First view by the client moves a sent document to "viewed".
    if (!isAdmin && doc.state?.sentAt && !doc.state.viewedAt && !rest) {
      doc.state.viewedAt = new Date().toISOString();
      ctx?.waitUntil(putDoc(env, doc).catch(() => {}));
    }

    if (doc.type === 'quote') {
      if (!rest) return html(renderQuote(doc, { base }));
      if (rest === 'contract') return html(contractPage(doc, { base, settings }));
      if (rest === 'quote.pdf') {
        const [bytes] = await renderPdfs(env, [renderQuote(doc, { base, pdf: true })]);
        return pdfResponse(bytes, `${fileBase(doc, 'Quote')}.pdf`);
      }
      if (rest === 'contract.pdf') {
        const page = doc.state?.contractHtml || renderContract(doc, { base, settings, pdf: true });
        const [bytes] = await renderPdfs(env, [page]);
        return pdfResponse(bytes, `${fileBase(doc, 'Contract')}.pdf`);
      }
    }
    if (doc.type === 'invoice') {
      if (!rest) return html(renderInvoice(doc, { base, settings }));
      if (rest === 'invoice.pdf') {
        const [bytes] = await renderPdfs(env, [renderInvoice(doc, { base, settings, pdf: true })]);
        return pdfResponse(bytes, `${fileBase(doc, 'Invoice')}.pdf`);
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
    const bar = `<div class="bar"><a href="/doc/${esc(doc.token)}/">Back to the quote</a><a href="/doc/${esc(doc.token)}/contract.pdf">Download signed PDF</a></div>`;
    return doc.state.contractHtml.replace('<body>\n', `<body>\n${bar}\n`);
  }
  return renderContract(doc, { base, settings });
}

/* ---------- Signing ---------- */

const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;
const clip = (v, n) => String(v || '').trim().slice(0, n);

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
    const code = newCode();
    const sealed = await seal(env.DOCS_SECRET, { t: token, e: email, h: await hmac(env.DOCS_SECRET, `${code}|${token}|${email}`), a: 0 }, 15 * 60);
    await resend(env, {
      to: email,
      subject: `Your code to sign the ${doc.client?.name || ''} contract: ${code}`,
      text: `Hi ${firstName(body.name)},\n\nYour code to sign the contract for ${doc.title} is ${code}.\n\nIt lasts 15 minutes. If you didn't ask for it, you can ignore this email.\n\nAnthony is Freelance`,
    });
    return json({ ok: true, ...(env.DOCS_DEV === '1' ? { devCode: code } : {}) }, 200, { 'set-cookie': cookie('doc_code', sealed, 15 * 60) });
  }

  if (step === 'confirm') {
    const pending = await unseal(env.DOCS_SECRET, getCookie(request, 'doc_code'));
    const email = clip(body.email, 200).toLowerCase();
    if (!pending || pending.t !== token) return json({ ok: false, error: 'That code has expired. Please send a new one.' }, 400);
    if (pending.a >= 5) return json({ ok: false, error: 'Too many tries. Please send a new code.' }, 429);
    if (pending.e !== email) return json({ ok: false, error: 'The email address changed since the code was sent. Please send a new code.' }, 400);
    const expect = await hmac(env.DOCS_SECRET, `${clip(body.code, 6)}|${token}|${email}`);
    if (!same(expect, pending.h)) {
      const retry = await seal(env.DOCS_SECRET, { ...pending, exp: undefined, a: (pending.a || 0) + 1 }, Math.max(1, Math.round((pending.exp - Date.now()) / 1000)));
      return json({ ok: false, error: "That code isn't right. Please check the email and try again." }, 400, { 'set-cookie': cookie('doc_code', retry, 15 * 60) });
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
    subject: `Signed contract: ${doc.title}`,
    text: `Hi ${firstName(sig.name)},\n\nThanks for signing. The signed contract and the quote are attached for your records.\n\n${
      deposit ? `The ${deposit.label.toLowerCase()} invoice for ${money(deposit.gross)} including VAT will follow shortly, then we can book the kick-off call.\n\n` : ''
    }You can also view the signed contract online:\n${base}/doc/${doc.token}/contract/\n\nThanks,\nAnthony`,
    attachments: [{ fileId: contractFile.id }, { fileId: quoteFile.id }],
  });

  let invoice = null;
  if (deposit && !(s.invoices || []).some((i) => Number(i.stage) === 0)) invoice = await createStageInvoice(env, doc, 0);

  s.finalisedAt = new Date().toISOString();
  delete s.finalisingAt;
  await putDoc(env, doc);

  await resend(env, {
    to: adminEmail(env),
    subject: `Signed: ${doc.client?.name} (${doc.number})`,
    text: `${sig.name} (${sig.position}, ${sig.legalName}) signed the contract for ${doc.title}.\n\nThe signed contract and quote are saved in Drive and emailed to ${to.join(', ')} from your Gmail.${
      invoice ? `\n\nThe ${deposit.label.toLowerCase()} invoice ${invoice.number} (${money(deposit.gross, { pennies: true })} inc. VAT) is drafted. Check it and send it from the admin page:\n${base}/doc/admin/` : ''
    }`,
  }).catch((e) => console.error('[docs] notice', e));

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

async function admin(request, env, url, parts) {
  const base = url.origin;
  const session = await unseal(env.DOCS_SECRET, getCookie(request, 'doc_admin'));
  const action = parts[0] || '';

  if (request.method === 'GET') {
    if (action) return Response.redirect(`${base}/doc/admin/`, 302);
    if (!url.pathname.endsWith('/')) return Response.redirect(`${base}/doc/admin/`, 301);
    if (!session) return html(renderLogin({ base, to: adminEmail(env) }));
    let docs = [];
    let error = '';
    try {
      docs = await listDocs(env);
    } catch (e) {
      error = e.message;
    }
    return html(renderAdmin({ base, docs, error }));
  }

  // POSTs: JSON from this origin only.
  const origin = request.headers.get('origin');
  if (origin && origin !== base) return json({ ok: false, error: 'Not allowed.' }, 403);
  const body = await readJson(request);
  if (!body) return json({ ok: false, error: 'The request could not be read.' }, 400);
  if (!env.DOCS_SECRET) return json({ ok: false, error: 'DOCS_SECRET is not set yet.' }, 503);

  if (action === 'code') {
    const code = newCode();
    const sealed = await seal(env.DOCS_SECRET, { h: await hmac(env.DOCS_SECRET, `admin|${code}`), a: 0 }, 15 * 60);
    await resend(env, { to: adminEmail(env), subject: `Documents login code: ${code}`, text: `Your login code is ${code}. It lasts 15 minutes.` });
    return json({ ok: true, to: adminEmail(env), ...(env.DOCS_DEV === '1' ? { devCode: code } : {}) }, 200, { 'set-cookie': cookie('doc_admin_code', sealed, 15 * 60) });
  }
  if (action === 'verify') {
    const pending = await unseal(env.DOCS_SECRET, getCookie(request, 'doc_admin_code'));
    if (!pending) return json({ ok: false, error: 'That code has expired. Please send a new one.' }, 400);
    if (pending.a >= 5) return json({ ok: false, error: 'Too many tries. Please send a new code.' }, 429);
    if (!same(await hmac(env.DOCS_SECRET, `admin|${clip(body.code, 6)}`), pending.h)) {
      const retry = await seal(env.DOCS_SECRET, { h: pending.h, a: (pending.a || 0) + 1 }, Math.max(1, Math.round((pending.exp - Date.now()) / 1000)));
      return json({ ok: false, error: "That code isn't right." }, 400, { 'set-cookie': cookie('doc_admin_code', retry, 15 * 60) });
    }
    const sessionCookie = await seal(env.DOCS_SECRET, { admin: 1 }, 30 * 24 * 3600);
    return json({ ok: true }, 200, {
      'set-cookie': [cookie('doc_admin', sessionCookie, 30 * 24 * 3600), cookie('doc_admin_code', '', 0)],
    });
  }

  if (!session) return json({ ok: false, error: 'Please log in again.' }, 401);
  if (action !== 'action') return json({ ok: false, error: 'Not found' }, 404);

  const doc = await getDoc(env, String(body.token || ''));
  if (!doc) return json({ ok: false, error: 'Document not found.' }, 404);
  const settings = await getSettings(env);
  const now = new Date().toISOString();

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
        subject: `Quote: ${doc.title}`,
        text: `Hi ${firstName(c.name)},\n\nHere's the quote for ${doc.title}. You can read it and accept it online:\n${base}/doc/${doc.token}/\n\nAccepting takes you straight to the contract, which you can sign online. The PDF is attached too, and the quote is valid until ${fmtDate(doc.validUntil, 'long')}.\n\nAny questions, just reply to this email.\n\nThanks,\nAnthony`,
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
      const t = invoiceTotals(doc);
      await sendEmail(env, {
        to: [c.email],
        subject: `Invoice ${doc.number}: ${doc.project || doc.title}`,
        text: `Hi ${firstName(c.name)},\n\nInvoice ${doc.number} is attached, for ${money(t.total, { pennies: true })} including VAT, due by ${fmtDate(doc.due, 'long')}.\n\nYou can also view it online, with the bank details to copy:\n${base}/doc/${doc.token}/\n\nThanks,\nAnthony`,
        attachments: [{ fileId: file.id }],
      });
      doc.state.fileId = file.id;
      await putDoc(env, doc);
      return json({ ok: true, message: `Invoice sent to ${c.email} and saved to Drive.` });
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
