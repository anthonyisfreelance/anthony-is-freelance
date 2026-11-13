// Anthony's admin page at docs.anthonyis.uk/admin/: every document with its status, and the actions that move
// it on (send, create the next invoice, mark paid). Login is a one-time code sent to ADMIN_EMAIL.

import { esc, money, fmtDate, eyebrow, masthead, shell, today, taxYear, COPY_SCRIPT } from './shared.js';
import { quoteTotals, stageAmounts, stageLabel } from './quote.js';
import { invoiceTotals } from './invoice.js';

const ADMIN_CSS = `
.sheet { max-width: 1180px; }
.bar { max-width: 1180px; }
h1 { width: auto; }
.admin-table td, .admin-table th { padding-right: 14px; }
.admin-table td { vertical-align: middle; }
.admin-table .group td { padding-top: 18px; border-top: 1px solid var(--ink); font-size: 15px; text-transform: uppercase; }
.pill { display: inline-block; padding: 3px 8px; border: 1px solid var(--line); font: 500 11px var(--display); letter-spacing: 0.02em; white-space: nowrap; }
.pill.draft { color: var(--muted); }
.pill.sent, .pill.viewed { border-color: var(--blue); color: var(--blue); }
.pill.signed, .pill.paid { background: var(--ink); border-color: var(--ink); color: var(--paper); }
.pill.overdue, .pill.unfinished { border-color: #c4001a; color: #c4001a; }
.pill.withdrawn { color: var(--muted); text-decoration: line-through; }
.tools { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6mm; }
.years { display: flex; flex-wrap: wrap; gap: 0 24px; margin-top: 8mm; border-bottom: 1px solid var(--line); }
.years a { padding: 0 0 10px; margin-bottom: -1px; border-bottom: 2px solid transparent; font: 500 15px var(--display); letter-spacing: 0.02em; color: var(--muted); text-decoration: none; }
.years a[aria-current="page"] { color: var(--ink); border-color: var(--ink); }
.years a:hover { color: var(--ink); }
.totals { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; margin: 6mm 0 0; padding-bottom: 10px; }
.totals dt { font: 500 var(--label) var(--display); letter-spacing: 0.02em; color: var(--muted); }
.totals dd { margin: 2px 0 0; font: 500 20px/1.1 var(--display); }
.totals .overdue dd { color: #c4001a; }
@media (max-width: 720px) { .totals { grid-template-columns: 1fr 1fr; } }
tr.withdrawn td { color: var(--muted); }
.actions { display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
.ghost.small { padding: 6px 9px; font-size: 11px; }
.ghost.primary { background: var(--blue); border-color: var(--blue); color: #fff; }
.login { max-width: 420px; display: flex; flex-direction: column; gap: 12px; margin-top: 8mm; }
.login input { padding: 10px 12px; border: 1px solid var(--line); font: 500 20px var(--display); letter-spacing: 0.3em; text-align: center; }
.empty { margin-top: 8mm; color: var(--muted); }
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
      <p style="margin-top:10px"><button type="button" class="btn" id="verify">Log in</button></p>
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

function actions(d, base) {
  const s = d.state || {};
  const link = `${base}/${d.type}/${d.token}/`;
  const a = [];
  const btn = (action, label, extra = '', primary = false) =>
    `<button type="button" class="ghost small${primary ? ' primary' : ''}" data-action="${action}" data-token="${esc(d.token)}" data-label="${esc(label)}" ${extra}>${esc(label)}</button>`;
  if (s.withdrawnAt) {
    a.push(btn('restore', 'Restore', 'data-wait="Restoring…"'));
    a.push(`<a class="ghost small" href="${esc(link)}" target="_blank" rel="noopener">Open</a>`);
    return `<div class="actions">${a.join('')}</div>`;
  }
  if (d.type === 'quote') {
    if (!s.signedAt) a.push(btn('send-quote', s.sentAt ? 'Send again' : 'Send quote', 'data-wait="Saving the PDF to Drive and emailing it from your Gmail…"', !s.sentAt));
    if (s.signedAt && !s.finalisedAt) a.push(btn('finalise', 'Finish signing steps', 'data-wait="Making the signed PDFs, saving to Drive and emailing…"', true));
    if (s.signedAt) {
      const done = new Set((s.invoices || []).map((i) => Number(i.stage)));
      stageAmounts(d).forEach((st, i) => {
        if (!done.has(i)) a.push(btn('create-invoice', `Invoice: ${stageLabel(st)}`, `data-stage="${i}" data-wait="Creating the invoice draft…"`));
      });
    }
  } else {
    if (!s.sentAt) a.push(btn('send-invoice', 'Send invoice', 'data-wait="Saving the PDF to Drive and emailing it from your Gmail…"', true));
    else if (s.status !== 'paid') {
      a.push(btn('mark-paid', 'Mark paid', 'data-wait="Marking as paid…"'));
      a.push(btn('send-invoice', 'Send again', 'data-wait="Emailing it again…"'));
    }
  }
  a.push(`<a class="ghost small" href="${esc(link)}" target="_blank" rel="noopener">Open</a>`);
  a.push(`<button type="button" class="ghost small" data-copy="${esc(link)}">Copy link</button>`);
  if (!(d.type === 'quote' && s.signedAt) && s.status !== 'paid') {
    a.push(btn('withdraw', 'Withdraw', 'data-confirm="Sure? Press again" data-wait="Withdrawing…"'));
  }
  return `<div class="actions">${a.join('')}</div>`;
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
    <div class="${overdue.length ? 'overdue' : ''}"><dt>Overdue</dt><dd>${money(sum(overdue), { pennies: true })}</dd></div>
  </dl>`;
  const tabs = `<nav class="years" aria-label="Tax years">${years
    .map((y) => `<a href="${esc(path)}?year=${yearParam(y)}"${y === current ? ' aria-current="page"' : ''}>${esc(yearLabel(y))}${y === taxYear(today()) ? ' (this year)' : ''}</a>`)
    .join('')}</nav>`;

  const rows = ordered
    .map(([client, list]) => {
      list.sort((a, b) => (a.type === b.type ? (b.issued || '').localeCompare(a.issued || '') : a.type === 'quote' ? -1 : 1));
      return `<tr class="group"><td colspan="5">${esc(client)}</td></tr>${list
        .map((d) => {
          const [cls, label] = statusOf(d);
          const amount = d.type === 'quote' ? quoteTotals(d).total : invoiceTotals(d).total;
          return `<tr class="${cls === 'withdrawn' ? 'withdrawn' : ''}">
            <td><span class="muted">${d.type === 'quote' ? 'Quote' : 'Invoice'}</span><br>${esc(d.number)}</td>
            <td>${esc(d.title || d.project || '')}</td>
            <td><span class="pill ${cls}">${esc(label)}</span></td>
            <td class="r">${amount ? money(amount, { pennies: d.type === 'invoice' }) : ''}</td>
            <td class="r">${actions(d, base)}</td>
          </tr>`;
        })
        .join('')}`;
    })
    .join('');

  const body = `
  ${masthead('Documents', 'Admin')}
  <h1>${eyebrow('Anthony is Freelance')}Quotes, contracts and invoices</h1>
  <div id="msg" class="status" role="status" ${error ? '' : 'hidden'}>${esc(error || '')}</div>
  ${tabs}
  ${totals}
  ${inYear.length
    ? `<section class="sec full"><div class="table-wrap"><table class="admin-table">
        <thead><tr><th>Document</th><th>Project</th><th>Status</th><th class="r">Inc. VAT</th><th class="r">Actions</th></tr></thead>
        <tbody>${rows}</tbody></table></div></section>`
    : `<p class="empty">No documents in ${esc(yearLabel(current))} yet. New quotes and invoices appear here once their data file is in the Drive folder.</p>`}
  <div class="tools">
    <a class="ghost" href="/admin/samples/">Sample documents and emails</a>
    <a class="ghost" href="/admin/samples/signature/">Gmail signature</a>
    <button type="button" class="ghost" id="logout">Log out</button>
  </div>
  `;
  return shell({ title: 'Documents admin', base, body, css: ADMIN_CSS, script: ADMIN_SCRIPT + COPY_SCRIPT });
}
