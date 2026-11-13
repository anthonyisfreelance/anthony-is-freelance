// The invoice page. Two layouts from one template:
//   kind "stage"     a project payment stage (deposit, stage, final), lines with amounts;
//   kind "itemised"  hourly work, one row per day with hours, priced at the invoice's rate.
// Every invoice shows its issue date, due date, payment reference, 20% VAT and bank details.

import {
  esc, money, vatOf, fmtDate, eyebrow, masthead, legalFooter, shell, topBar, downloadLink, COPY_SCRIPT, COMPANY,
} from './shared.js';

export function invoiceTotals(inv) {
  const rate = inv.rate || 8000;
  let subtotal = 0;
  let hours = 0;
  if (inv.kind === 'itemised') {
    for (const it of inv.items || []) {
      const h = Number(it.hours) || 0;
      hours += h;
      subtotal += it.amount != null ? Number(it.amount) : Math.round(h * rate);
    }
  } else {
    for (const l of inv.lines || []) subtotal += Number(l.amount) || 0;
  }
  const vat = vatOf(subtotal);
  return { rate, hours, subtotal, vat, total: subtotal + vat };
}

const pennies = { pennies: true };

export function renderInvoice(inv, { base, settings, pdf = false }) {
  const t = invoiceTotals(inv);
  const c = inv.client || {};
  const bank = settings?.bank || {};
  const paid = inv.state?.status === 'paid';
  const ref = inv.number;

  const billTo = [
    c.legalName || c.name,
    c.legalName && c.name && c.legalName !== c.name ? `Trading as ${c.name}` : '',
    ...(c.address || '').split(/\n/).map((s) => s.trim()),
    c.vatNumber ? `VAT No. ${c.vatNumber}` : '',
  ].filter(Boolean);

  const from = [COMPANY.name, 'Unit 3 Building B, Green Court', 'Truro Business Park, Threemilestone', 'Truro TR4 9LF', `VAT No. ${COMPANY.vat}`];

  const itemised = inv.kind === 'itemised';
  const table = itemised
    ? `<table>
        <thead><tr><th class="w-date">Date</th><th>Description</th><th class="r w-detail">Hours</th><th class="r w-amt">Amount</th></tr></thead>
        <tbody>${(inv.items || [])
          .map((it) => {
            const amt = it.amount != null ? Number(it.amount) : Math.round((Number(it.hours) || 0) * t.rate);
            return `<tr><td style="white-space:nowrap">${esc(fmtDate(it.date))}</td><td>${esc(it.description)}</td><td class="r">${esc(it.hours ?? '')}</td><td class="r">${money(amt, pennies)}</td></tr>`;
          })
          .join('')}</tbody>
        <tfoot>
          <tr><td></td><td>Subtotal</td><td class="r">${t.hours}</td><td class="r">${money(t.subtotal, pennies)}</td></tr>
          <tr><td></td><td>VAT at 20%</td><td></td><td class="r">${money(t.vat, pennies)}</td></tr>
          <tr class="grand"><td></td><td>Total due</td><td></td><td class="r amt">${money(t.total, pennies)}</td></tr>
        </tfoot>
      </table>`
    : `<table>
        <thead><tr><th>Description</th><th class="r w-amt">Amount</th></tr></thead>
        <tbody>${(inv.lines || [])
          .map((l) => `<tr><td>${esc(l.description)}</td><td class="r">${money(l.amount, pennies)}</td></tr>`)
          .join('')}</tbody>
        <tfoot>
          <tr><td>Subtotal</td><td class="r">${money(t.subtotal, pennies)}</td></tr>
          <tr><td>VAT at 20%</td><td class="r">${money(t.vat, pennies)}</td></tr>
          <tr class="grand"><td>Total due</td><td class="r amt">${money(t.total, pennies)}</td></tr>
        </tfoot>
      </table>`;

  const copy = (v) => (pdf ? '' : ` <button type="button" class="copy screen-only" data-copy="${esc(v)}">Copy</button>`);
  const bankRows = [
    ['Account name', bank.accountName || COMPANY.name],
    ['Sort code', bank.sortCode || ''],
    ['Account number', bank.accountNumber || ''],
    ['Reference', ref],
  ];

  const body = `
  ${masthead('Invoice', inv.number)}
  <h1>${eyebrow(`Invoice for ${c.name || c.legalName || ''}`)}${esc(inv.title || inv.project || 'Design services')}</h1>
  <dl class="facts four">
    <div><dt>Invoice number</dt><dd>${esc(inv.number)}</dd></div>
    <div><dt>Issued</dt><dd>${esc(fmtDate(inv.issued))}</dd></div>
    <div><dt>Due</dt><dd>${esc(fmtDate(inv.due))}</dd></div>
    <div class="money"><dt>${paid ? 'Paid' : 'Amount due'}</dt><dd>${money(t.total, pennies)}</dd></div>
  </dl>

  <section class="sec" aria-labelledby="h-parties">
    <h2 id="h-parties">${eyebrow('Details')}From and to</h2>
    <div class="addr">
      <div><p class="addr-h">From</p>${from.map((l) => `<p>${esc(l)}</p>`).join('')}</div>
      <div><p class="addr-h">To</p>${billTo.map((l) => `<p>${esc(l)}</p>`).join('')}</div>
    </div>
  </section>

  <section class="sec full" aria-labelledby="h-items">
    <div class="money-head">
      <h2 id="h-items">${eyebrow('Charges')}What this invoice covers</h2>
      ${itemised ? `<p>${money(t.rate)} per hour + VAT</p>` : inv.quoteNumber ? `<p class="ref">Quote ${esc(inv.quoteNumber)}</p>` : ''}
    </div>
    <div class="table-wrap">${table}</div>
    ${itemised ? '' : (inv.lines || []).filter((l) => l.detail).map((l) => `<p class="note">${esc(l.detail)}</p>`).join('')}
    ${inv.note ? `<p class="note">${esc(inv.note)}</p>` : ''}
  </section>

  <section class="sec" aria-labelledby="h-pay">
    <h2 id="h-pay">${eyebrow('Payment')}${paid ? 'Paid, thank you' : 'How to pay'}</h2>
    <div class="bank-wrap">
      <div class="table-wrap"><table class="bank"><tbody>${bankRows
        .map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}${v ? copy(v) : ''}</td></tr>`)
        .join('')}</tbody></table></div>
      <p class="note">${paid
        ? `Payment received on ${esc(fmtDate(inv.state.paidAt, 'long'))}.`
        : `Please pay by bank transfer by ${esc(fmtDate(inv.due, 'long'))}, quoting ${esc(ref)} as the reference.`}</p>
    </div>
  </section>

  ${legalFooter()}`;

  return shell({
    title: `Invoice ${inv.number}`,
    base,
    body,
    css: INVOICE_CSS,
    script: pdf ? '' : COPY_SCRIPT,
    bar: pdf ? '' : topBar(`<span>Invoice for ${esc(c.name || '')}</span>${downloadLink(`/invoice/${inv.token}/invoice.pdf`)}`),
  });
}

const INVOICE_CSS = `
/* In the PDF the spacing tightens a little, so a payment-stage invoice fits on one A4 page. */
@media print {
  .sheet > .sec, .legal { break-inside: avoid; }
  .sheet > * + * { margin-top: 16px; }
  h1 { font-size: 32px; }
  .sec, .facts.four { padding-top: 16px; }
  .sec.full > .money-head { margin-bottom: 16px; }
  .note { margin-top: 12px; }
}
.addr { display: grid; grid-template-columns: 1fr 1fr; gap: var(--gap); }
.addr p { font: 500 14px/1.3 var(--display); letter-spacing: 0.02em; }
.addr .addr-h { margin-bottom: 4px; color: var(--muted); }
th.w-date { width: 110px; }
.bank-wrap .note { margin-top: 8px; }
table.bank th { width: 158px; padding: 8px 8px 8px 0; border-top: 1px solid var(--line); letter-spacing: 0.02em; }
table.bank tr:first-child th, table.bank tr:first-child td { border-top: 0; }
.copy { margin-left: 10px; padding: 2px 8px; border: 1px solid var(--line); border-radius: 0; background: var(--paper); font: 500 11px/1.4 var(--display); letter-spacing: 0.02em; cursor: pointer; color: var(--ink); }
.copy:hover { border-color: var(--ink); }
@media (max-width: 720px) { .addr { grid-template-columns: 1fr; gap: 16px; } table.bank th { width: 38%; } th.w-date { width: 84px; } }
`;
