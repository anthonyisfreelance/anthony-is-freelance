// Sample documents for checking the design on screen: every kind of quote, contract, invoice and
// email, filled with a made-up client. Admin only, at docs.anthonyis.uk/admin/samples/.
//
// The comment tool (public/feedback.js) runs on these pages, and each comment becomes an issue on
// the public GitHub repo, so everything here must stay fictional: no real clients, people, bank
// details or links. Real documents never load the comment tool.

import { esc, money, today, addDays, masthead, eyebrow, shell, COMPANY } from './shared.js';
import { renderQuote, quoteTotals, stageAmounts } from './quote.js';
import { renderContract } from './contract.js';
import { renderInvoice, invoiceTotals } from './invoice.js';
import { quoteEmail, signedEmail, invoiceEmail, signCodeEmail, loginCodeEmail, loginNotice, signedNotice, signatureHtml, PERSON } from './emails.js';

export const SAMPLE_QUOTE = 'SAMPLEquote';
const SIGNED = 'SAMPLEsigned';
const INVOICE = 'SAMPLEinvoice';
const P = '/admin/samples/';

const CLIENT = {
  name: 'Saltwater Supply Co.',
  legalName: 'Saltwater Supply Limited',
  companyNumber: '12345678',
  address: '1 Example Wharf\nFalmouth TR11 0AA',
  vatNumber: 'GB 000 0000 00',
  contact: { name: 'Sam Taylor', email: 'sam@example.com' },
};
// Made-up bank details, so a comment on the bank table never carries the real ones.
const SAMPLE_SETTINGS = { bank: { accountName: COMPANY.name, sortCode: '00-00-00', accountNumber: '12345678' } };

function quote(type = 'scoped', extra = {}) {
  const issued = today();
  return {
    type: 'quote',
    token: SAMPLE_QUOTE,
    key: 'SaltwaterSupply',
    seq: 1,
    number: 'SaltwaterSupply_01',
    client: { ...CLIENT, legalName: '', companyNumber: '', address: '' },
    issued,
    validUntil: addDays(issued, 30),
    title: 'Shopify store redesign',
    overview: {
      heading: 'A calmer, faster store',
      paragraphs: [
        'A bespoke UX and UI design for the Saltwater Supply store, built around how customers actually shop: by trip, by weather and by fit. The aim is a store that feels as considered as the products, and that makes choosing the right kit easy on a phone.',
        'Everything is designed in Figma as one design system, so new pages and campaigns stay consistent after launch.',
        'All work is delivered in Figma and handed over to your developer to build.',
      ],
    },
    scope: {
      heading: "What I'll design",
      items: [
        { title: 'UX review', hours: 8, body: 'A look at your analytics and the current journey on the most used screen sizes, with problems and fixes written up on a Miro board and talked through on a call.' },
        { title: 'Look and feel', hours: 16, body: 'The homepage, key sections, buttons and type, exploring two directions before we pick one.' },
        { title: 'Design system', hours: 32, body: 'Tokens, type scale, colours and a component library in Figma, with hover, empty and error states.' },
        { title: 'Page designs', hours: 40, body: 'Every page listed below, designed mobile first and for desktop.' },
        { title: 'Prototype and handover', hours: 12, body: 'A clickable prototype of the key flows, and handover calls with your developer.' },
      ],
    },
    pages: {
      heading: 'Mobile and desktop',
      items: [
        { name: 'Header', note: 'with navigation and search' },
        { name: 'Footer' },
        { name: 'Homepage' },
        { name: 'Collection page', note: 'with filters' },
        { name: 'Product page' },
        { name: 'Cart drawer' },
        { name: 'About' },
        { name: 'Contact' },
      ],
    },
    pricing: { type, rate: 8000, ...(type === 'fixed' ? { fixed: 850000 } : {}) },
    stages: type === 'hourly' ? [] : [
      { label: 'Deposit', percent: 50, due: 'Before work begins' },
      { label: 'Design sign-off', percent: 25, due: 'When the design system is signed off' },
      { label: 'Final', percent: 25, due: 'On handover' },
    ],
    revisions: 'Two rounds of revisions at each stage.',
    builtBy: 'Your developer',
    fromClient: 'Brand assets, product photography and copy, and access to your analytics.',
    contract: { optional: ['A'], completionPoint: 'Handover of the final Figma files', revisionRounds: '2 per stage' },
    state: { status: 'sent', sentAt: `${issued}T09:00:00Z` },
    ...extra,
  };
}

// A made-up signature, drawn as an image like a real one.
const SIG_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="180" viewBox="0 0 600 180"><path d="M40 120c30-60 60-90 70-70s-40 90-20 80 50-70 70-60-10 50 10 45 30-40 50-35 0 30 20 28 40-30 60-25 10 25 30 20 50-20 80-15 60 10 90 5" fill="none" stroke="#1E2023" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
)}`;

function signedQuote() {
  const q = quote('scoped', { token: SIGNED });
  const signedAt = `${today()}T10:30:00Z`;
  q.state = {
    status: 'signed',
    sentAt: `${q.issued}T09:00:00Z`,
    viewedAt: `${q.issued}T09:20:00Z`,
    signedAt,
    finalisedAt: signedAt,
    signature: {
      legalName: CLIENT.legalName,
      companyNumber: CLIENT.companyNumber,
      address: CLIENT.address.replace('\n', ', '),
      name: CLIENT.contact.name,
      position: 'Founder',
      email: CLIENT.contact.email,
      method: 'draw',
      image: SIG_IMAGE,
      signedAt,
      ip: '192.0.2.10',
      userAgent: 'Sample browser',
      fingerprint: '0'.repeat(64),
    },
  };
  return q;
}

function invoice(kind = 'stage', paid = false) {
  const issued = today();
  const base = {
    type: 'invoice',
    token: INVOICE,
    key: 'SaltwaterSupply',
    seq: kind === 'itemised' ? 4 : 1,
    number: kind === 'itemised' ? 'SaltwaterSupply_04' : 'SaltwaterSupply_01',
    issued,
    due: addDays(issued, 14),
    client: { ...CLIENT, address: CLIENT.address },
    state: paid ? { status: 'paid', sentAt: `${issued}T09:00:00Z`, paidAt: issued } : { status: 'sent', sentAt: `${issued}T09:00:00Z` },
  };
  if (kind === 'itemised') {
    return {
      ...base,
      title: 'Design support, October',
      project: 'Design support, October',
      kind: 'itemised',
      rate: 8000,
      items: [
        { date: addDays(issued, -20), description: 'Winter campaign banners, homepage and collection', hours: 3 },
        { date: addDays(issued, -14), description: 'Size guide page design, mobile and desktop', hours: 4.5 },
        { date: addDays(issued, -9), description: 'Product page tweaks after launch review', hours: 2 },
        { date: addDays(issued, -3), description: 'Gift card page and email header', hours: 1.5 },
      ],
    };
  }
  const q = quote();
  const st = stageAmounts(q)[0];
  return {
    ...base,
    title: q.title,
    project: q.title,
    kind: 'stage',
    rate: 8000,
    quoteNumber: q.number,
    lines: [{ description: 'Deposit, 50%', detail: `50% of the ${money(quoteTotals(q).subtotal)} + VAT project total, before work begins. Quote ${q.number}.`, amount: st.net }],
  };
}

const sampleBase = 'https://docs.anthonyis.uk';

const SAMPLES = [
  { slug: 'quote-scoped', group: 'Quotes', label: 'Quote, scoped hours', note: 'The usual quote: hours per item.', page: (o) => renderQuote(quote('scoped'), o), pdf: true },
  { slug: 'quote-fixed', group: 'Quotes', label: 'Quote, fixed price', note: 'Hours left off.', page: (o) => renderQuote(quote('fixed'), o), pdf: true },
  { slug: 'quote-hourly', group: 'Quotes', label: 'Quote, hourly', note: 'Estimated hours, invoiced monthly.', page: (o) => renderQuote(quote('hourly'), o), pdf: true },
  { slug: 'quote-expired', group: 'Quotes', label: 'Quote, expired', note: 'Past its valid-until date.', page: (o) => renderQuote(quote('scoped', { issued: addDays(today(), -45), validUntil: addDays(today(), -15) }), o), pdf: false },
  { slug: 'quote-signed', group: 'Quotes', label: 'Quote, signed', note: 'After the client signs.', page: (o) => renderQuote(signedQuote(), o), pdf: true },
  { slug: 'contract', group: 'Contracts', label: 'Contract, ready to sign', note: 'With the signing panel. Sending a code works here; signing is switched off.', page: (o) => renderContract(quote(), o), pdf: true },
  { slug: 'contract-signed', group: 'Contracts', label: 'Contract, signed', note: 'The signed copy, with the signing record.', page: (o) => renderContract(signedQuote(), o), pdf: true },
  { slug: 'invoice-stage', group: 'Invoices', label: 'Invoice, payment stage', note: 'Deposit from a quote.', page: (o) => renderInvoice(invoice('stage'), o), pdf: true },
  { slug: 'invoice-itemised', group: 'Invoices', label: 'Invoice, itemised hours', note: 'Monthly support work.', page: (o) => renderInvoice(invoice('itemised'), o), pdf: true },
  { slug: 'invoice-paid', group: 'Invoices', label: 'Invoice, paid', note: 'After you mark it paid.', page: (o) => renderInvoice(invoice('stage', true), o), pdf: true },
  { slug: 'email-quote', group: 'Emails', label: 'Quote email', note: 'To the client, from your Gmail, with the PDF attached.', email: () => quoteEmail({ base: sampleBase, doc: quote(), total: quoteTotals(quote()).total }) },
  { slug: 'email-signed', group: 'Emails', label: 'Signed contract email', note: 'To the client, with both PDFs attached.', email: () => signedEmail({ base: sampleBase, doc: signedQuote(), sig: signedQuote().state.signature, deposit: stageAmounts(signedQuote())[0] }) },
  { slug: 'email-invoice', group: 'Emails', label: 'Invoice email', note: 'To the client, with the PDF attached.', email: () => invoiceEmail({ base: sampleBase, doc: invoice(), total: invoiceTotals(invoice()).total }) },
  { slug: 'email-code', group: 'Emails', label: 'Signing code', note: 'To the person signing.', email: () => signCodeEmail({ code: '482915', name: CLIENT.contact.name, doc: quote() }) },
  { slug: 'email-login', group: 'Emails', label: 'Admin login code', note: 'To you.', email: () => loginCodeEmail({ code: '730164', ip: '192.0.2.10', place: 'Truro, GB' }) },
  { slug: 'email-login-notice', group: 'Emails', label: 'New login notice', note: 'To you, after each admin login.', email: () => loginNotice({ when: '13 November 2026, 09:12 GMT', ip: '192.0.2.10', place: 'Truro, GB', ua: 'Chrome on macOS' }) },
  { slug: 'email-signed-notice', group: 'Emails', label: 'Signed notice', note: 'To you, when a client signs.', email: () => signedNotice({ base: sampleBase, doc: signedQuote(), sig: signedQuote().state.signature, to: [CLIENT.contact.email], invoice: { number: 'SaltwaterSupply_01' }, deposit: stageAmounts(signedQuote())[0] }) },
];

// Sample pages link to each other instead of to real document addresses.
function relink(html, slug) {
  return html
    .replaceAll(`/quote/${SIGNED}/contract.pdf`, `${P}contract-signed.pdf`)
    .replaceAll(`/quote/${SIGNED}/contract/`, `${P}contract-signed/`)
    .replaceAll(`/quote/${SIGNED}/quote.pdf`, `${P}quote-signed.pdf`)
    .replaceAll(`/quote/${SIGNED}/`, `${P}quote-signed/`)
    .replaceAll(`/quote/${SAMPLE_QUOTE}/contract/`, `${P}contract/`)
    .replaceAll(`/quote/${SAMPLE_QUOTE}/quote.pdf`, `${P}${slug}.pdf`)
    .replaceAll(`/quote/${SAMPLE_QUOTE}/`, `${P}quote-scoped/`)
    .replaceAll(`/invoice/${INVOICE}/invoice.pdf`, `${P}${slug}.pdf`)
    .replaceAll(`/invoice/${INVOICE}/`, `${P}invoice-stage/`);
}

const BAR_CSS = `.qa{position:sticky;top:0;z-index:5;display:flex;flex-wrap:wrap;gap:8px 16px;justify-content:space-between;align-items:center;margin:0 0 16px;padding:10px 14px;background:#111;color:#fff;font:500 12px/1.3 "Mint Grotesk Display","Arial Narrow",Arial,sans-serif;letter-spacing:.02em}
.qa a{color:#fff}.qa b{color:#FCE233;font-weight:500}.qa span{display:flex;gap:16px;flex-wrap:wrap}`;

function qaBar(s, prev, next) {
  return `<style>${BAR_CSS}</style><div class="qa"><span><b>Sample</b> ${esc(s.label)}. Made-up client, safe to comment on.</span><span>${prev ? `<a href="${P}${prev.slug}/">← ${esc(prev.label)}</a>` : ''}<a href="${P}">All samples</a>${s.pdf ? `<a href="${P}${s.slug}.pdf">PDF</a>` : ''}${next ? `<a href="${P}${next.slug}/">${esc(next.label)} →</a>` : ''}</span></div>`;
}

// The comment tool, signed in through the admin session (see public/feedback.js).
const FEEDBACK = '<script>window.__aifFeedbackLogin = true;</script><script src="/feedback.js" defer></script>';

export function samplePage(slug, { base, settings }) {
  const i = SAMPLES.findIndex((s) => s.slug === slug);
  if (i < 0) return null;
  const s = SAMPLES[i];
  const bar = qaBar(s, SAMPLES[i - 1], SAMPLES[i + 1]);
  if (s.email) {
    const mail = s.email();
    const head = `<div style="max-width:600px;padding:0 32px;font:500 13px/1.6 'Mint Grotesk Display','Arial Narrow',Arial,sans-serif;color:#5A5A5A"><p style="margin:16px 0 0">Subject: <span style="color:#111">${esc(mail.subject)}</span></p></div>`;
    return relink(mail.html, slug).replaceAll(sampleBase, '').replace(/<body([^>]*)>/, `<body$1>\n${bar}${head}`).replace('</body>', `${FEEDBACK}\n</body>`);
  }
  const html = s.page({ base, settings: { ...SAMPLE_SETTINGS, signatureSvg: settings?.signatureSvg } });
  return relink(html, slug).replace('<body>\n', `<body>\n${bar}\n`).replace('</body>', `${FEEDBACK}\n</body>`);
}

export function samplePdfHtml(slug, { base, settings }) {
  const s = SAMPLES.find((x) => x.slug === slug && x.pdf);
  if (!s) return null;
  return s.page({ base, settings: { ...SAMPLE_SETTINGS, signatureSvg: settings?.signatureSvg }, pdf: true });
}

export function samplesIndex({ base }) {
  const groups = [...new Set(SAMPLES.map((s) => s.group))];
  const rows = groups
    .map((g) => `<tr class="group"><td colspan="3">${esc(g)}</td></tr>${SAMPLES.filter((s) => s.group === g)
      .map((s) => `<tr><td><a href="${P}${s.slug}/">${esc(s.label)}</a></td><td class="muted">${esc(s.note)}</td><td class="r">${s.pdf ? `<a class="ghost small" href="${P}${s.slug}.pdf" target="_blank" rel="noopener">PDF</a>` : ''}</td></tr>`)
      .join('')}`)
    .join('');
  const body = `
  ${masthead('Documents', 'Samples')}
  <h1>${eyebrow('Check the design')}Sample documents</h1>
  <div class="prose" style="margin-top:6mm;max-width:150mm">
    <p>Every kind of quote, contract, invoice and email, filled in for a made-up client, so you can check them on screen and as PDFs without touching a real document.</p>
    <p>The comment tool is on every sample: press <b>C</b> or the comment button, click anything and type. Each comment is filed for me to pick up. Comments are public on GitHub, which is why only these made-up samples have the tool, never real documents.</p>
  </div>
  <section class="sec full"><div class="table-wrap"><table class="admin-table"><tbody>${rows}
    <tr class="group"><td colspan="3">Gmail</td></tr>
    <tr><td><a href="${P}signature/">Gmail signature</a></td><td class="muted">To copy into Gmail settings.</td><td></td></tr>
  </tbody></table></div></section>
  <p style="margin-top:8mm"><a class="ghost" href="/admin/">Back to documents</a></p>`;
  return shell({ title: 'Sample documents', base, body, css: INDEX_CSS });
}

const INDEX_CSS = `
.sheet { max-width: 1180px; }
h1 { width: auto; }
.admin-table td { vertical-align: middle; }
.admin-table .group td { padding-top: 18px; border-top: 1px solid var(--ink); font-size: 15px; text-transform: uppercase; }
.admin-table a { color: var(--blue); }
.admin-table a.ghost { color: var(--ink); }
.ghost.small { padding: 6px 9px; font-size: 11px; }
`;

const COPY_SIG = `
(function () {
  var b = document.getElementById('copy-sig'), sig = document.getElementById('sig'), msg = document.getElementById('sig-msg');
  b.addEventListener('click', function () {
    var r = document.createRange(); r.selectNode(sig);
    var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
    var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
    s.removeAllRanges();
    msg.hidden = false;
    msg.textContent = ok ? 'Copied. Now paste it into Gmail (steps below).' : 'Select the signature above with your mouse, copy it, then paste it into Gmail.';
  });
})();
`;

export function signaturePage({ base }) {
  const body = `
  ${masthead('Documents', 'Gmail signature')}
  <h1>${eyebrow('Your email')}Gmail signature</h1>
  <section class="sec full">
    <div id="sig" style="padding:8mm;border:1px solid var(--line);background:#fff">${signatureHtml()}</div>
    <div class="act" style="margin-top:6mm"><button type="button" class="btn" id="copy-sig">Copy signature</button></div>
    <div id="sig-msg" class="status" role="status" hidden style="margin-top:4mm"></div>
  </section>
  <section class="sec" aria-labelledby="h-how">
    <h2 id="h-how">${eyebrow('Setting it up')}Add it to Gmail</h2>
    <ol class="prose" style="padding-left:1.1em;margin:0">
      <li>Press <b>Copy signature</b>.</li>
      <li>In Gmail on a computer, open Settings (the cog), then <b>See all settings</b>.</li>
      <li>On the General tab, scroll to <b>Signature</b>, press <b>Create new</b>, name it and paste into the box.</li>
      <li>Under <b>Signature defaults</b>, pick it for new emails and for replies and forwards. If you send from hello@anthonyis.uk too, set it for that address as well.</li>
      <li>Scroll to the bottom and press <b>Save changes</b>.</li>
    </ol>
  </section>
  <section class="sec" aria-labelledby="h-notes">
    <h2 id="h-notes">${eyebrow('Good to know')}How it shows</h2>
    <div class="prose">
      <p>The logo is a picture hosted on anthonyis.uk, so it shows for anyone who loads images. Gmail and Outlook can't use your own typeface, so the text shows in Arial Narrow or Arial; Apple Mail shows Mint Grotesk.</p>
      <p>The same block closes the quote, contract and invoice emails the site sends, so everything matches. Change the details in one place (<b>PERSON</b> in worker/docs/emails.js) and the emails follow; paste the signature into Gmail again after a change.</p>
      <p>It says: ${esc([PERSON.name, PERSON.role, PERSON.award, PERSON.phone, PERSON.site].join(' · '))}.</p>
    </div>
  </section>
  <p style="margin-top:8mm"><a class="ghost" href="${P}">All samples</a></p>`;
  return shell({ title: 'Gmail signature', base, body, script: COPY_SIG, css: '#sig td { border: 0; padding: 0; vertical-align: top; }' }).replace('</body>', `${FEEDBACK}\n</body>`);
}
