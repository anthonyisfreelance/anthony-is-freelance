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

// Icons from the site's outline set, drawn at 18px with a 1px line.
const icon = (d) => `<svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="${d}" stroke="currentColor" stroke-width="1" stroke-linecap="square"/></svg>`;
export const ARROW = icon('M3.5 9h11M10.5 5l4 4-4 4');
export const ICON_BACK = icon('M14.5 9h-11M7.5 5l-4 4 4 4');
export const ICON_DOWNLOAD = icon('M9 3.5v8M5.5 8.5 9 12l3.5-3.5M3.5 14.5h11');
export const ICON_TICK = icon('M3.5 9.5l3.5 3.5 7.5-8');

export function masthead(label, number) {
  return `<header class="mast">${LOGO}<p class="doc-id"><span>${esc(label)}</span>${esc(number)}</p></header>`;
}

export function legalFooter() {
  return `<footer class="legal">${COMPANY.name} · Company number ${COMPANY.number} · VAT number ${COMPANY.vat}<br>Registered office: ${COMPANY.office}</footer>`;
}

// The three steps of starting a project (accept, sign, pay), each in its own block with a large
// number. `state` is "complete" (done, with a tick), "current" (the step the client is on, blue
// outline) or "next" (still to come, grey). Shown on the quote, the contract and after signing.
const STAGE_LABEL = { complete: 'Complete', current: 'You are here', next: 'Next' };
export function stageBlocks(items) {
  return `<ol class="stages">${items
    .map(({ state = 'next', label, title, text }, i) => `<li class="stage ${state}"><span class="st">${state === 'complete' ? ICON_TICK : ''}${esc(label || STAGE_LABEL[state])}</span><span class="big" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><div><h3>${esc(title)}</h3><p>${esc(text)}</p></div></li>`)
    .join('')}</ol>`;
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
export const backLink = (href, label) => `<a href="${esc(href)}">${ICON_BACK}${esc(label)}</a>`;
export const downloadLink = (href, label = 'Download PDF') => `<a class="up" href="${esc(href)}">${esc(label)}${ICON_DOWNLOAD}</a>`;

// The stage blocks' styles, kept apart so they can also sit above a signed contract's snapshot,
// which carries the styles it was signed with.
export const STAGE_CSS = `
.stages { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.stage { display: flex; flex-direction: column; gap: 12px; padding: 16px; background: #ffffff; border: 1px solid #d8d8d8; color: #393939; break-inside: avoid; }
.stage .st { display: flex; align-items: center; gap: 6px; min-height: 18px; font: 500 14px/1.2 "Mint Grotesk Display", "Arial Narrow", ui-sans-serif, system-ui, sans-serif; text-transform: uppercase; }
.stage .st svg { width: 18px; height: 18px; flex: none; }
.stage .big { font: 500 80px/1 "Mint Grotesk Display", "Arial Narrow", ui-sans-serif, system-ui, sans-serif; opacity: 0.4; }
.stage h3 { margin: 0 0 4px; font: 500 22px/1.3 "Mint Grotesk Display", "Arial Narrow", ui-sans-serif, system-ui, sans-serif; text-transform: uppercase; }
.stage p { margin: 0; font: 400 14px/1.5 "Source Serif Pro", Georgia, "Times New Roman", serif; }
.stage.current { padding: 15px; border: 2px solid #0059ff; color: #111111; }
.stage.current .st, .stage.current .big { color: #0059ff; opacity: 1; }
.stage.complete { background: #f6f6f6; border-color: #f6f6f6; }
.stage.complete .st, .stage.complete .big, .stage.complete h3 { color: #111111; opacity: 1; }
@media (max-width: 720px) {
  .stages { grid-template-columns: 1fr; }
  .stage { display: grid; grid-template-columns: auto 1fr; gap: 4px 16px; align-items: start; }
  .stage .st { grid-column: 1 / -1; }
  .stage .big { font-size: 56px; min-width: 64px; }
  .stage h3 { font-size: 18px; }
}
`;

export const CSS = `
@font-face { font-family: "Mint Grotesk Display"; src: url(/fonts/mint-grotesk-display-narrow-500.woff2) format("woff2"); font-weight: 500; font-display: swap; }
@font-face { font-family: "Source Serif Pro"; src: url(/fonts/source-serif-pro-400.woff2) format("woff2"); font-weight: 400; font-display: swap; }

/* Sizes and colours follow the Figma design system (.docs page): 794px sheet, 64px padding, 24px
   between sections, a 439px main column, Mint Grotesk 14px for labels and Source Serif 14px for prose. */
:root {
  --desk: #d8d8d8;
  --paper: #ffffff;
  --ink: #111111;
  --muted: #393939;
  --line: #d8d8d8;
  --box: #f6f6f6;
  --blue: #0059ff;
  --red: #c4001a;
  --display: "Mint Grotesk Display", "Arial Narrow", ui-sans-serif, system-ui, sans-serif;
  --serif: "Source Serif Pro", Georgia, "Times New Roman", serif;
  --pad: 64px;
  --gap: 40px;
  --main: 66%;
  color-scheme: light;
}

* { box-sizing: border-box; }
html, body { background: var(--desk); color: var(--ink); }
body { margin: 0; font-family: var(--serif); font-size: 14px; line-height: 1.5; -webkit-font-smoothing: antialiased; -webkit-print-color-adjust: exact; print-color-adjust: exact; padding: 24px max(16px, env(safe-area-inset-right, 0px)) 40px max(16px, env(safe-area-inset-left, 0px)); }
p { margin: 0; }
a { color: inherit; }
img { max-width: 100%; }
[hidden] { display: none !important; }

.bar { max-width: 794px; margin: 0 auto 12px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 8px 16px; font: 500 14px/1.3 var(--display); letter-spacing: 0.02em; color: var(--ink); }
.bar a { display: inline-flex; align-items: center; gap: 4px; color: var(--ink); text-decoration: none; }
.bar a:hover { text-decoration: underline; }
.bar a.up { text-transform: uppercase; }
.bar svg { width: 18px; height: 18px; flex: none; }
.sheet { max-width: 794px; margin: 0 auto; background: var(--paper); padding: var(--pad); }
.sheet > * + * { margin-top: 24px; }

.mast { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding-bottom: 8px; }
.logo { display: block; height: 44px; width: auto; color: var(--ink); }
.doc-id { text-align: right; font: 500 16px/1 var(--display); text-transform: uppercase; }
.doc-id span { display: block; font-size: 14px; line-height: 1.3; text-transform: none; color: var(--muted); }

.eyebrow { display: block; margin-bottom: 8px; font: 500 14px/1.3 var(--display); letter-spacing: 0; text-transform: none; color: var(--muted); }
.eyebrow::before { content: "+ "; }
.eyebrow::after { content: " +"; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
h1, h2, h3 { margin: 0; font-family: var(--display); font-weight: 500; line-height: 1.1; }
h1 { font-size: 38px; text-transform: uppercase; }

.facts { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 24px; margin-bottom: 0; padding: 8px 0; border-top: 1px solid var(--line); }
.facts.four { grid-template-columns: repeat(4, minmax(0, 1fr)); padding: 24px 0 0; }
.facts dt { font: 500 14px/1.3 var(--display); letter-spacing: 0.02em; color: var(--muted); }
.facts dd { margin: 4px 0 0; font: 500 14px/1.3 var(--display); overflow-wrap: anywhere; }
.facts .money dd { font-size: 26px; line-height: 1.1; text-transform: uppercase; color: var(--blue); }

.sec { display: grid; grid-template-columns: minmax(0, 1fr) var(--main); gap: var(--gap); padding-top: 24px; border-top: 1px solid var(--line); }
.sec > * { min-width: 0; }
.sec.full { display: block; }
.sec h2 { font-size: 16px; line-height: 1; text-transform: uppercase; }
.sec h2 .eyebrow { margin-bottom: 4px; }
.sec.full > h2, .sec.full > .money-head { margin-bottom: 24px; }
.prose { display: flex; flex-direction: column; gap: 1.5em; }

/* Boxed lists: numbered (scope, what happens next) and ticked (pages included). */
.boxes { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.box { display: flex; gap: 12px; padding: 12px; background: var(--box); break-inside: avoid; }
.box .n { flex: none; min-width: 27px; font: 500 26px/1.1 var(--display); color: var(--blue); }
.box h3 { margin-bottom: 2px; font-size: 14px; line-height: 1.3; }
.ticks { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.tick { display: flex; gap: 8px; padding: 12px; background: var(--box); break-inside: avoid; }
.tick svg { width: 18px; height: 18px; flex: none; color: var(--blue); }
.tick b { display: block; font: 500 14px/1.3 var(--display); }
.tick span { display: block; margin-top: 2px; font: 500 11px/1.2 var(--display); letter-spacing: 0.02em; color: var(--muted); }

.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th { font: 500 14px/1.3 var(--display); color: var(--muted); text-align: left; padding: 0 24px 8px 0; }
td { padding: 8px 24px 8px 0; border-top: 1px solid var(--line); vertical-align: top; font: 500 14px/1.3 var(--display); }
th:last-child, td:last-child { padding-right: 0; }
tr { break-inside: avoid; }
td .n { display: inline-block; min-width: 28px; }
td.muted, .muted { color: var(--muted); }
.r { text-align: right; white-space: nowrap; }
th.w-detail { width: 112px; }
th.w-amt { width: 112px; }
tfoot tr.grand td { font-size: 22px; line-height: 1.4; padding-block: 12px; border-bottom: 1px solid var(--line); }
tfoot tr.grand td.amt { color: var(--blue); }
.money-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 8px 16px; flex-wrap: wrap; }
.money-head p { font: 500 14px/1.3 var(--display); }
.money-head p.ref { font-size: 16px; line-height: 1; text-transform: uppercase; }
.sub-h { margin: 24px 0; font: 500 16px/1 var(--display); text-transform: uppercase; }
.note { margin-top: 24px; color: var(--muted); }
table.kv th { width: 158px; padding: 8px 8px 8px 0; border-top: 1px solid var(--line); vertical-align: top; letter-spacing: 0.02em; }
table.kv tr:first-child th, table.kv tr:first-child td { border-top: 0; }
${STAGE_CSS}
.act { margin-top: 24px; display: flex; flex-direction: column; align-items: flex-start; gap: 24px; }
.btn { display: flex; width: 100%; min-height: 46px; align-items: center; justify-content: space-between; gap: 8px; padding: 14px 16px; border: 0; border-radius: 0; background: var(--blue); color: #ffffff; font: 500 16px/1 var(--display); text-transform: uppercase; text-align: left; text-decoration: none; cursor: pointer; }
.btn:hover { opacity: 0.9; }
.btn:focus-visible, .ghost:focus-visible, .textbtn:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
.btn[disabled] { opacity: 0.5; cursor: progress; }
.btn svg { width: 18px; height: 18px; flex: none; }
.ghost { display: inline-flex; align-items: center; gap: 8px; padding: 10px 14px; border: 1px solid var(--line); border-radius: 0; background: var(--paper); color: var(--ink); font: 500 14px/1 var(--display); text-transform: uppercase; text-decoration: none; cursor: pointer; }
.ghost:hover { border-color: var(--ink); }
.ghost.small { padding: 8px 12px; font-size: 11px; letter-spacing: 0.02em; text-transform: none; }
.ghost.primary { background: var(--blue); border-color: var(--blue); color: #ffffff; }
.textbtn { padding: 0; border: 0; background: none; color: var(--ink); font: 500 11px/1 var(--display); letter-spacing: 0.02em; text-decoration: none; cursor: pointer; }
.textbtn:hover { text-decoration: underline; }
.status { align-self: stretch; padding: 10px 12px; border: 1px solid var(--blue); font: 500 14px/1.3 var(--display); }
.status.error { border-color: var(--red); color: var(--red); }
.status span { display: block; font-family: var(--serif); font-weight: 400; line-height: 1.5; color: var(--ink); }
.contact { font: 500 14px/1.3 var(--display); }
.contact b { font-weight: 500; text-decoration: underline; user-select: all; }

.fine { padding-top: 24px; border-top: 1px solid var(--line); color: var(--muted); }
.fine h2 { margin: 0 0 8px; font-size: 18px; line-height: 1.4; color: var(--ink); }
.fine .cols { columns: 2; column-gap: var(--gap); }
.fine p { break-inside: avoid; }
.fine b { font-family: var(--display); font-weight: 500; color: var(--ink); }
.legal { padding-top: 16px; border-top: 1px solid var(--line); font: 400 14px/1.5 var(--serif); color: var(--muted); }

.screen-only { }
.print-only { display: none; }

@media (max-width: 720px) {
  body { padding: 0; font-size: 15px; }
  .bar { padding: 12px max(16px, env(safe-area-inset-right, 0px)) 0 max(16px, env(safe-area-inset-left, 0px)); }
  .sheet { padding: 24px max(16px, env(safe-area-inset-right, 0px)) 32px max(16px, env(safe-area-inset-left, 0px)); }
  .logo { height: 36px; }
  h1 { font-size: 30px; }
  .facts, .facts.four { grid-template-columns: 1fr 1fr; gap: 16px; }
  .sec { grid-template-columns: 1fr; gap: 16px; }
  .fine .cols { columns: 1; }
  th, td { padding-right: 12px; }
  th.w-detail { width: 64px; }
  th.w-amt { width: 88px; }
  table.kv th { width: 38%; }
  tfoot tr.grand td { font-size: 18px; }
}
@media (max-width: 420px) {
  .ticks { grid-template-columns: 1fr; }
}

@media print {
  @page { size: A4; margin: 16mm 18mm; }
  html, body { background: var(--paper); }
  body { padding: 0; }
  .bar, .act, .screen-only { display: none !important; }
  .print-only { display: block; }
  .sheet { max-width: none; padding: 0; }
  /* Only on full-width sections: in the two-column ones the heading shares a row with the content,
     and "no break after" would glue each section to the next. */
  .sec.full > h2, .sub-h, .money-head { break-after: avoid; }
  .keep, .fine, .sec:not(.full) { break-inside: avoid; }
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

