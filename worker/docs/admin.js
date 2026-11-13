// Anthony's admin page at docs.anthonyis.uk/admin/: every document with its status, and the actions that move
// it on (send, create the next invoice, mark paid). Login is a one-time code sent to ADMIN_EMAIL.

import { esc, money, fmtDate, eyebrow, masthead, shell, today, taxYear, COPY_SCRIPT } from './shared.js';
import { quoteTotals, stageAmounts, stageLabel } from './quote.js';
import { invoiceTotals } from './invoice.js';

// Layout follows the Figma admin page: every row shares one set of column widths, so each column
// starts on the same line, and the buttons run Open, the next step (blue), other actions, then the
// quiet text links.
const ADMIN_CSS = `
.sheet { max-width: 1180px; }
.sheet > * + * { margin-top: 40px; }
.bar { max-width: 1180px; }
.years { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 24px; }
.years a { padding: 8px 12px; border: 1px solid var(--line); background: var(--paper); color: var(--ink); font: 500 14px/1 var(--display); text-transform: uppercase; text-decoration: none; }
.years a[aria-current="page"] { border-color: var(--ink); background: var(--ink); color: var(--paper); }
.years a:hover { border-color: var(--ink); }
.totals { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 40px; margin-bottom: 0; }
.totals dt { font: 500 14px/1.3 var(--display); letter-spacing: 0.02em; color: var(--muted); }
.totals dd { margin: 4px 0 0; font: 500 26px/1.1 var(--display); text-transform: uppercase; color: var(--blue); }
.adm { display: flex; flex-direction: column; gap: 40px; }
.adm-head, .adm-row { display: flex; align-items: center; gap: 16px; border-top: 1px solid var(--line); font: 500 14px/1.3 var(--display); letter-spacing: 0.02em; }
.adm-head { padding: 24px 0 12px; color: var(--muted); }
.adm-row { padding: 12px 0; }
.adm-client { display: flex; flex-direction: column; gap: 12px; }
.adm-client h2 { padding: 24px 0 8px; border-top: 1px solid var(--line); font-size: 22px; line-height: 1.3; text-transform: uppercase; }
.c-doc { flex: 0 0 176px; min-width: 0; overflow-wrap: anywhere; }
.c-doc span { display: block; color: var(--muted); }
.c-proj { flex: 0 0 150px; min-width: 0; }
.c-status { flex: 0 0 160px; min-width: 0; }
.c-amt { flex: 0 0 110px; font-size: 18px; line-height: 1.4; letter-spacing: 0; }
.adm-head .c-amt { font-size: 14px; line-height: 1.3; letter-spacing: 0.02em; }
.c-act { flex: 1 1 0; min-width: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 12px 16px; }
/* Nothing left to do (paid or withdrawn): the row fades, its status and buttons stay readable. */
.adm-row.done .c-doc, .adm-row.done .c-proj, .adm-row.done .c-amt { opacity: 0.4; }
.pill { display: inline-block; padding: 4px 8px; border: 1px solid var(--line); font: 500 11px/1 var(--display); letter-spacing: 0.02em; color: var(--muted); }
.pill.sent, .pill.viewed { border-color: var(--blue); color: var(--blue); }
.pill.signed, .pill.paid { border-color: var(--ink); color: var(--ink); }
.pill.overdue, .pill.unfinished { border-color: var(--red); color: var(--red); }
.tools { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; padding-top: 24px; border-top: 1px solid var(--line); }
.tools div { display: flex; flex-wrap: wrap; gap: 8px; }
.login { max-width: 420px; display: flex; flex-direction: column; gap: 12px; }
.login input { width: 100%; padding: 10px 12px; border: 1px solid var(--line); border-radius: 0; font: 500 20px var(--display); letter-spacing: 0.3em; text-align: center; }
.empty { color: var(--muted); }
@media (max-width: 900px) {
  .totals { grid-template-columns: 1fr 1fr; gap: 16px; }
  .adm-head { display: none; }
  .adm-row { flex-wrap: wrap; gap: 8px 16px; }
  .c-doc, .c-proj { flex: 1 1 40%; }
  .c-status, .c-amt { flex: 0 0 auto; }
  .c-act { flex: 1 1 100%; }
}
`;

const ADMIN_SCRIPT = `
(function () {
  var msg = document.getElementById('msg');
  function say(t, err) { if (!msg) return; msg.hidden = false; msg.className = 'status' + (err ? ' error' : ''); msg.textContent = t; window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function post(path, body) {
    return fetch('/admin/' + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body || {}), credentials: 'same-origin' })
      .then(function (r) { return r.json().catch(function () { return { ok: false, error: 'Something went wrong.' }; }); });
  }
  var send = document.getElementById('send-code');
  if (send) send.addEventListener('click', function () {
    send.disabled = true; say('Sending a code…');
    post('code').then(function (r) { send.disabled = false; if (!r.ok) return say(r.error, true);
      document.getElementById('code-step').hidden = false; say('Code sent to ' + r.to + '.' + (r.devCode ? ' (Test code: ' + r.devCode + ')' : '')); document.getElementById('code').focus(); });
  });
  var out = document.getElementById('logout');
  if (out) out.addEventListener('click', function () { post('logout').then(function () { location.reload(); }); });
  var verify = document.getElementById('verify');
  if (verify) verify.addEventListener('click', function () {
    post('verify', { code: document.getElementById('code').value.trim() }).then(function (r) { if (!r.ok) return say(r.error, true); location.reload(); });
  });
  document.querySelectorAll('[data-action]').forEach(function (b) {
    b.addEventListener('click', function () {
      var confirmText = b.getAttribute('data-confirm');
      if (confirmText && b.getAttribute('data-armed') !== '1') { b.setAttribute('data-armed', '1'); b.textContent = confirmText; setTimeout(function () { b.removeAttribute('data-armed'); b.textContent = b.getAttribute('data-label'); }, 4000); return; }
      var label = b.getAttribute('data-label') || b.textContent; b.disabled = true; b.textContent = 'Working…';
      say(b.getAttribute('data-wait') || 'Working…');
      post('action', { action: b.getAttribute('data-action'), token: b.getAttribute('data-token'), stage: b.getAttribute('data-stage') })
        .then(function (r) { if (!r.ok) { b.disabled = false; b.textContent = label; return say(r.error, true); } say(r.message || 'Done.'); setTimeout(function () { location.reload(); }, 900); });
    });
  });
})();
`;

export function renderLogin({ base, to }) {
  const body = `
  ${masthead('Documents', 'Admin')}
  <h1>${eyebrow('Anthony is Freelance')}Quotes, contracts and invoices</h1>
  <div class="login">
    <p>A login code goes to <b>${esc(to)}</b>.</p>
    <button type="button" class="btn" id="send-code">Email me a code</button>
    <div id="code-step" hidden>
      <input id="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000" aria-label="Login code">
      <p style="margin-top:12px"><button type="button" class="btn" id="verify">Log in</button></p>
    </div>
    <div id="msg" class="status" role="status" hidden></div>
  </div>`;
  return shell({ title: 'Documents admin', base, body, css: ADMIN_CSS, script: ADMIN_SCRIPT });
}

function statusOf(d) {
  const s = d.state || {};
  if (s.withdrawnAt) return ['withdrawn', `Withdrawn ${fmtDate(s.withdrawnAt)}`];
  if (d.type === 'quote') {
    if (s.signedAt && !s.finalisedAt) return ['unfinished', 'Signed, steps unfinished'];
    if (s.signedAt) return ['signed', `Signed ${fmtDate(s.signedAt)}`];
    if (s.viewedAt) return ['viewed', `Viewed ${fmtDate(s.viewedAt)}`];
    if (s.sentAt) return ['sent', `Sent ${fmtDate(s.sentAt)}`];
    return ['draft', 'Draft'];
  }
  if (s.status === 'paid') return ['paid', `Paid ${fmtDate(s.paidAt)}`];
  if (s.sentAt && d.due && d.due < new Date().toISOString().slice(0, 10)) return ['overdue', `Overdue, due ${fmtDate(d.due)}`];
  if (s.viewedAt) return ['viewed', `Viewed ${fmtDate(s.viewedAt)}`];
  if (s.sentAt) return ['sent', `Sent ${fmtDate(s.sentAt)}`];
  return ['draft', 'Draft'];
}

// The buttons for one document, in a fixed order so they line up down the page: Open, the one next
// step (blue), any other actions (outlined), then Copy link and Withdraw as text links.
function actions(d, base) {
  const s = d.state || {};
  const link = `${base}/${d.type}/${d.token}/`;
  const a = [`<a class="ghost small" href="${esc(link)}" target="_blank" rel="noopener">Open</a>`];
  const btn = (action, label, extra = '', kind = 'ghost small') =>
    `<button type="button" class="${kind}" data-action="${action}" data-token="${esc(d.token)}" data-label="${esc(label)}" ${extra}>${esc(label)}</button>`;
  const primary = 'ghost small primary';
  if (s.withdrawnAt) {
    a.push(btn('restore', 'Restore', 'data-wait="Restoring…"'));
    return `<div class="c-act">${a.join('')}</div>`;
  }
  if (d.type === 'quote') {
    if (!s.signedAt) a.push(btn('send-quote', s.sentAt ? 'Send again' : 'Send quote', 'data-wait="Saving the PDF to Drive and emailing it from your Gmail…"', s.sentAt ? undefined : primary));
    if (s.signedAt && !s.finalisedAt) a.push(btn('finalise', 'Finish signing', 'data-wait="Making the signed PDFs, saving to Drive and emailing…"', primary));
    if (s.signedAt) {
      const done = new Set((s.invoices || []).map((i) => Number(i.stage)));
      stageAmounts(d).forEach((st, i) => {
        if (!done.has(i)) a.push(btn('create-invoice', `Invoice: ${stageLabel(st)}`, `data-stage="${i}" data-wait="Creating the invoice draft…"`));
      });
    }
  } else {
    if (!s.sentAt) a.push(btn('send-invoice', 'Send invoice', 'data-wait="Saving the PDF to Drive and emailing it from your Gmail…"', primary));
    else if (s.status !== 'paid') {
      a.push(btn('mark-paid', 'Mark paid', 'data-wait="Marking as paid…"'));
      a.push(btn('send-invoice', 'Send again', 'data-wait="Emailing it again…"'));
    }
  }
  a.push(`<button type="button" class="textbtn" data-copy="${esc(link)}">Copy link</button>`);
  if (!(d.type === 'quote' && s.signedAt) && s.status !== 'paid') {
    a.push(btn('withdraw', 'Withdraw', 'data-confirm="Sure? Press again" data-wait="Withdrawing…"', 'textbtn'));
  }
  return `<div class="c-act">${a.join('')}</div>`;
}

// Tax years end on 31 January (taxYear in shared.js), the same as the Invoices folders in Drive.
// Each document sits in the year of its issue date. Tabs are links (?year=26-27), so no script.
const yearOf = (d) => taxYear(d.issued || (d.updated || '').slice(0, 10) || today());
const yearLabel = (y) => y.replace(':', '/');
const yearParam = (y) => y.replace(':', '-');

export function renderAdmin({ base, docs, error, year, path = '/admin/' }) {
  const years = [...new Set([taxYear(today()), ...docs.map(yearOf)])].sort().reverse();
  const current = years.includes(String(year || '').replace('-', ':')) ? String(year).replace('-', ':') : taxYear(today());
  const inYear = docs.filter((d) => yearOf(d) === current);

  // Clients A to Z; within a client, quotes then invoices, newest first.
  const groups = new Map();
  for (const d of inYear) {
    const k = d.client?.name || d.key || 'Other';
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(d);
  }
  const ordered = [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0], 'en-GB', { sensitivity: 'base' }));

  // The year's invoices, including VAT: sent or paid, paid, still to come in, and overdue.
  const invoices = inYear.filter((d) => d.type === 'invoice' && !d.state?.withdrawnAt && d.state?.sentAt);
  const sum = (list) => list.reduce((n, d) => n + invoiceTotals(d).total, 0);
  const paid = invoices.filter((d) => d.state?.status === 'paid');
  const unpaid = invoices.filter((d) => d.state?.status !== 'paid');
  const overdue = unpaid.filter((d) => d.due && d.due < today());
  const totals = `<dl class="totals">
    <div><dt>Invoiced, inc. VAT</dt><dd>${money(sum(invoices), { pennies: true })}</dd></div>
    <div><dt>Paid</dt><dd>${money(sum(paid), { pennies: true })}</dd></div>
    <div><dt>Waiting for payment</dt><dd>${money(sum(unpaid), { pennies: true })}</dd></div>
    <div><dt>Overdue</dt><dd>${money(sum(overdue), { pennies: true })}</dd></div>
  </dl>`;
  const tabs = `<nav class="years" aria-label="Tax years">${years
    .map((y) => `<a href="${esc(path)}?year=${yearParam(y)}"${y === current ? ' aria-current="page"' : ''}>${esc(yearLabel(y))}${y === taxYear(today()) ? ' (this year)' : ''}</a>`)
    .join('')}</nav>`;

  const rows = ordered
    .map(([client, list]) => {
      list.sort((a, b) => (a.type === b.type ? (b.issued || '').localeCompare(a.issued || '') : a.type === 'quote' ? -1 : 1));
      return `<section class="adm-client"><h2>${esc(client)}</h2>${list
        .map((d) => {
          const [cls, label] = statusOf(d);
          const amount = d.type === 'quote' ? quoteTotals(d).total : invoiceTotals(d).total;
          return `<div class="adm-row${cls === 'withdrawn' || cls === 'paid' ? ' done' : ''}">
            <div class="c-doc"><span>${d.type === 'quote' ? 'Quote' : 'Invoice'}</span>${esc(d.number)}</div>
            <div class="c-proj">${esc(d.title || d.project || '')}</div>
            <div class="c-status"><span class="pill ${cls}">${esc(label)}</span></div>
            <div class="c-amt">${amount ? money(amount, { pennies: d.type === 'invoice' }) : ''}</div>
            ${actions(d, base)}
          </div>`;
        })
        .join('')}</section>`;
    })
    .join('');

  const body = `
  ${masthead('Documents', 'Admin')}
  <div>
    <h1>${eyebrow('Anthony is Freelance')}Quotes, contracts and invoices</h1>
    ${tabs}
  </div>
  <div id="msg" class="status" role="status" ${error ? '' : 'hidden'}>${esc(error || '')}</div>
  ${totals}
  ${inYear.length
    ? `<div class="adm">
        <div class="adm-head"><div class="c-doc">Document</div><div class="c-proj">Project</div><div class="c-status">Status</div><div class="c-amt">Inc. VAT</div><div class="c-act">Actions</div></div>
        ${rows}</div>`
    : `<p class="empty">No documents in ${esc(yearLabel(current))} yet. New quotes and invoices appear here once their data file is in the Drive folder.</p>`}
  <div class="tools">
    <div>
      <a class="ghost" href="/admin/samples/">Sample documents and emails</a>
      <a class="ghost" href="/admin/samples/signature/">Gmail signature</a>
    </div>
    <button type="button" class="ghost" id="logout">Log out</button>
  </div>
  `;
  return shell({ title: 'Documents admin', base, body, css: ADMIN_CSS, script: ADMIN_SCRIPT + COPY_SCRIPT });
}
