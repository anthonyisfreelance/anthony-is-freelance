// Shared pieces for the client documents (quotes, contracts, invoices): the A4 sheet styles,
// the page shell, money and date formatting, and company details.
//
// Every document is one A4 sheet (210mm), identical on screen and in the PDF. On phones the sheet
// becomes the screen and the columns stack. Type follows the live site: Mint Grotesk for headings,
// labels, numbers and table text; Source Serif only for running body text, one size and colour.

import { LOGO } from './logo.js';

export const COMPANY = {
  name: 'Anthonyis Limited',
  number: '10575474',
  vat: '530 0230 61',
  office: 'Unit 3 Building B, Green Court, Truro Business Park, Threemilestone, Truro TR4 9LF',
  director: 'Anthony Bliss',
  email: 'hello@anthonyis.uk',
  site: 'anthonyis.uk',
};

export const VAT_RATE = 0.2;
export const PAYMENT_DAYS = 14;

const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ENTITIES[c]);

// Money is held in pence. Quotes show whole pounds where they can; invoices always show pence.
export function money(pence, { pennies = false } = {}) {
  const p = Math.round(Number(pence) || 0);
  const showPence = pennies || p % 100 !== 0;
  return `£${(p / 100).toLocaleString('en-GB', {
    minimumFractionDigits: showPence ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}
export const vatOf = (pence) => Math.round(pence * VAT_RATE);

const TZ = 'Europe/London';
export function fmtDate(iso, style = 'short') {
  if (!iso) return '';
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
  return d.toLocaleDateString('en-GB', {
    timeZone: TZ,
    day: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    year: 'numeric',
  });
}
export function fmtDateTime(iso) {
  const d = new Date(iso);
  const date = d.toLocaleDateString('en-GB', { timeZone: TZ, day: 'numeric', month: 'long', year: 'numeric' });
  const time = d.toLocaleTimeString('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });
  return `${date}, ${time}`;
}
// Today's date in London, as YYYY-MM-DD.
export function today() {
  return new Date().toLocaleDateString('en-CA', { timeZone: TZ });
}
export function addDays(iso, days) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
// Company tax year ends 31 January: an invoice dated 10 Nov 2026 belongs in "26:27".
export function taxYear(iso) {
  const [y, m] = iso.split('-').map(Number);
  const start = m >= 2 ? y : y - 1;
  const two = (n) => String(n % 100).padStart(2, '0');
  return `${two(start)}:${two(start + 1)}`;
}

export const eyebrow = (text) => `<span class="eyebrow">${esc(text)}<span class="sr">. </span></span>`;

export function masthead(label, number) {
  return `<header class="mast">${LOGO}<p class="doc-id"><span>${esc(label)}</span>${esc(number)}</p></header>`;
}

export function legalFooter() {
  return `<footer class="legal">${COMPANY.name} · Company number ${COMPANY.number} · VAT number ${COMPANY.vat}<br>Registered office: ${COMPANY.office}</footer>`;
}

// The full HTML page. `base` is the site origin, so fonts load the same in the browser and in the
// PDF renderer (which receives the HTML directly).
export function shell({ title, base, body, css = '', script = '', bar = '' }) {
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<base href="${esc(base)}/">
<title>${esc(title)}</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<style>${CSS}${css}</style>
</head>
<body>
${bar}
<article class="sheet">
${body}
</article>
${script ? `<script>${script}</script>` : ''}
</body>
</html>`;
}

// A quiet line above the sheet, on screen only (for example, the download link).
export function topBar(html) {
  return `<div class="bar">${html}</div>`;
}

export const CSS = `
@font-face { font-family: "Mint Grotesk Display"; src: url(/fonts/mint-grotesk-display-narrow-500.woff2) format("woff2"); font-weight: 500; font-display: swap; }
@font-face { font-family: "Source Serif Pro"; src: url(/fonts/source-serif-pro-400.woff2) format("woff2"); font-weight: 400; font-display: swap; }

:root {
  --desk: #e4e4e4;
  --paper: #ffffff;
  --ink: #111111;
  --muted: #5a5a5a;
  --line: #d8d8d8;
  --blue: #0059ff;
  --display: "Mint Grotesk Display", "Arial Narrow", ui-sans-serif, system-ui, sans-serif;
  --serif: "Source Serif Pro", Georgia, "Times New Roman", serif;
  --body: 13px;
  --label: 11px;
  --pad: 18mm;
  --label-col: 38mm;
  --gap: 8mm;
  color-scheme: light;
}

* { box-sizing: border-box; }
html, body { background: var(--desk); color: var(--ink); }
body { margin: 0; font-family: var(--serif); font-size: var(--body); line-height: 1.55; -webkit-font-smoothing: antialiased; padding: 24px max(16px, env(safe-area-inset-right, 0px)) 48px max(16px, env(safe-area-inset-left, 0px)); }
p { margin: 0; }
a { color: inherit; }
img { max-width: 100%; }
[hidden] { display: none !important; }

.bar { max-width: 210mm; margin: 0 auto 12px; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px 16px; font-family: var(--display); font-weight: 500; font-size: 12px; letter-spacing: 0.02em; color: var(--muted); }
.bar a { color: var(--ink); }
.sheet { max-width: 210mm; margin: 0 auto; background: var(--paper); padding: var(--pad); }

.mast { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; padding-bottom: 10mm; }
.logo { display: block; height: 30px; width: auto; color: var(--ink); }
.doc-id { text-align: right; font-family: var(--display); font-weight: 500; font-size: 12px; line-height: 1.4; }
.doc-id span { display: block; color: var(--muted); }

.eyebrow { display: block; margin-bottom: 8px; font-family: var(--display); font-weight: 500; font-size: var(--label); letter-spacing: 0.02em; line-height: 1.3; text-transform: none; color: var(--muted); }
.eyebrow::before { content: "+ "; }
.eyebrow::after { content: " +"; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
h1, h2, h3 { margin: 0; font-family: var(--display); font-weight: 500; line-height: 1.1; }
h1 { font-size: 36px; text-transform: uppercase; width: 66.666%; }

.facts { display: grid; grid-template-columns: repeat(5, auto); justify-content: space-between; gap: 0 16px; margin: 8mm 0 0; padding-block: 10px; border-top: 1px solid var(--line); }
.facts.four { grid-template-columns: repeat(4, auto); }
.facts dt { font-family: var(--display); font-weight: 500; font-size: var(--label); letter-spacing: 0.02em; color: var(--muted); }
.facts dd { margin: 2px 0 0; font-family: var(--display); font-weight: 500; font-size: 13px; line-height: 1.3; }
.facts .money dd { font-size: 20px; line-height: 1.1; color: var(--blue); }

.sec { display: grid; grid-template-columns: var(--label-col) 1fr; gap: var(--gap); margin-top: 6mm; padding-top: 5mm; border-top: 1px solid var(--line); }
.sec > * { min-width: 0; }
.sec.full { display: block; }
.sec h2 { font-size: 15px; text-transform: uppercase; line-height: 1.2; }
.sec h2 .eyebrow { margin-bottom: 4px; }
.sec.full > h2, .sec.full > .money-head { margin-bottom: 5mm; }
.prose { display: flex; flex-direction: column; gap: 8px; }

.rows { list-style: none; margin: 0; padding: 0; }
.rows li { display: grid; grid-template-columns: 7mm 1fr; padding: 0 0 8px; break-inside: avoid; }
.rows li + li { padding-top: 8px; border-top: 1px solid var(--line); }
.rows .n { font-family: var(--display); font-weight: 500; font-size: 12px; color: var(--muted); padding-top: 1px; }
.rows h3 { font-size: 13px; line-height: 1.3; margin-bottom: 3px; text-transform: uppercase; }

.list2 { margin: 0; padding: 0 0 0 1.1em; columns: 2; column-gap: var(--gap); }
.list2 li { padding-bottom: 4px; break-inside: avoid; }
.list2 li::marker { color: var(--muted); }
.list2 b { font-family: var(--display); font-weight: 500; }

.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th { font-family: var(--display); font-weight: 500; font-size: var(--label); letter-spacing: 0.02em; color: var(--muted); text-align: left; padding: 0 8px 6px 0; }
td { padding: 7px 8px 7px 0; border-top: 1px solid var(--line); vertical-align: top; font-family: var(--display); font-weight: 500; font-size: var(--body); }
tr { break-inside: avoid; }
td.n { width: 9mm; color: var(--muted); font-size: 12px; }
td.muted { color: var(--muted); }
.r { text-align: right; padding-right: 0; white-space: nowrap; }
tfoot tr.grand td { font-size: 15px; padding-block: 9px; border-bottom: 1px solid var(--line); }
tfoot tr.grand td.amt { color: var(--blue); }
.money-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 8px 16px; flex-wrap: wrap; }
.money-head p { font-family: var(--display); font-weight: 500; font-size: 13px; }
.sub-h { margin: 9mm 0 4mm; font-family: var(--display); font-weight: 500; font-size: 13px; text-transform: uppercase; }
.note { margin-top: 8px; color: var(--muted); }

.steps { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--line); }
.steps li { display: flex; flex-direction: column; gap: 6px; padding: 5mm 6mm 0 0; }
.steps .big { font-family: var(--display); font-weight: 500; font-size: 34px; line-height: 1; color: var(--blue); margin-bottom: 4px; }
.steps li.done .big { color: var(--muted); }
.steps h3 { font-size: 13px; text-transform: uppercase; }

.act { margin-top: 8mm; display: flex; flex-wrap: wrap; align-items: center; gap: 12px 20px; }
.btn { display: inline-flex; align-items: center; justify-content: space-between; gap: 24px; min-width: 70mm; padding: 15px 16px; border: 0; background: var(--blue); color: #ffffff; font-family: var(--display); font-weight: 500; font-size: 14px; letter-spacing: 0.02em; text-transform: uppercase; text-decoration: none; cursor: pointer; }
.btn:hover { opacity: 0.9; }
.btn:focus-visible, .ghost:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
.btn[disabled] { opacity: 0.5; cursor: progress; }
.btn svg { width: 14px; height: 14px; flex: none; }
.ghost { display: inline-flex; align-items: center; gap: 8px; padding: 9px 12px; border: 1px solid var(--line); background: var(--paper); color: var(--ink); font-family: var(--display); font-weight: 500; font-size: 12px; letter-spacing: 0.02em; text-decoration: none; cursor: pointer; }
.ghost:hover { border-color: var(--ink); }
.status { padding: 10px 12px; border: 1px solid var(--blue); font-family: var(--display); font-weight: 500; }
.status.error { border-color: #c4001a; color: #c4001a; }
.status span { display: block; font-family: var(--serif); font-weight: 400; color: var(--ink); }
.contact b { font-family: var(--display); font-weight: 500; user-select: all; }

.fine { margin-top: 10mm; padding-top: 5mm; border-top: 1px solid var(--line); color: var(--muted); }
.fine h2 { font-size: 13px; text-transform: uppercase; margin: 0 0 4mm; color: var(--ink); }
.fine .cols { columns: 2; column-gap: var(--gap); }
.fine p { margin-bottom: 6px; break-inside: avoid; }
.fine b { font-family: var(--display); font-weight: 500; color: var(--ink); }
.legal { margin-top: 6mm; padding-top: 4mm; border-top: 1px solid var(--line); font-family: var(--display); font-weight: 500; font-size: var(--label); letter-spacing: 0.02em; line-height: 1.6; color: var(--muted); }

.screen-only { }
.print-only { display: none; }

@media (max-width: 720px) {
  :root { --body: 15px; --label: 12px; }
  body { padding: 0; }
  .bar { padding: 10px max(16px, env(safe-area-inset-right, 0px)) 0 max(16px, env(safe-area-inset-left, 0px)); }
  .sheet { padding: 20px max(16px, env(safe-area-inset-right, 0px)) 32px max(16px, env(safe-area-inset-left, 0px)); }
  h1 { font-size: 30px; width: auto; }
  .facts, .facts.four { grid-template-columns: 1fr 1fr; gap: 12px 16px; }
  .sec { grid-template-columns: 1fr; gap: 12px; margin-top: 28px; padding-top: 16px; }
  .list2, .fine .cols { columns: 1; }
  .steps { grid-template-columns: 1fr; }
  .steps li { padding: 16px 0; }
  .steps li + li { border-top: 1px solid var(--line); }
  .btn { width: 100%; }
  .rows h3, .steps h3 { font-size: 14px; }
}

@media print {
  @page { size: A4; margin: 16mm 18mm; }
  html, body { background: var(--paper); }
  body { padding: 0; }
  .bar, .act, .screen-only { display: none !important; }
  .print-only { display: block; }
  .sheet { max-width: none; padding: 0; }
  .sec h2, .sub-h, .money-head { break-after: avoid; }
  .page-start { break-before: page; margin-top: 0; border-top: 0; padding-top: 0; }
}
`;

// Small screen-only helpers: copy buttons (bank details, links).
export const COPY_SCRIPT = `
document.querySelectorAll('[data-copy]').forEach(function (b) {
  b.addEventListener('click', function () {
    var text = b.getAttribute('data-copy');
    var done = function () { var t = b.textContent; b.textContent = 'Copied'; setTimeout(function () { b.textContent = t; }, 1500); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
  });
});
`;

export const ARROW = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" stroke-width="1.5"/></svg>';
