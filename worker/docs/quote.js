// The quote page. Costs and payment always start their own page in the PDF, full width.
// Pricing types: "scoped" (hours per item), "fixed" (one price, no hours shown) and "hourly"
// (rate, with optional estimated hours).

import {
  esc, money, vatOf, fmtDate, today, eyebrow, masthead, legalFooter, shell, topBar, ARROW, COMPANY, PAYMENT_DAYS,
} from './shared.js';

export function quoteTotals(q) {
  const rate = q.pricing?.rate || 8000;
  const hours = (q.scope?.items || []).reduce((n, i) => n + (Number(i.hours) || 0), 0);
  let subtotal;
  if (q.pricing?.type === 'fixed') subtotal = Number(q.pricing.fixed) || 0;
  else subtotal = hours * rate;
  const vat = vatOf(subtotal);
  return { rate, hours, subtotal, vat, total: subtotal + vat };
}

export function stageAmounts(q) {
  const { subtotal } = quoteTotals(q);
  const stages = q.stages || [];
  let given = 0;
  return stages.map((s, i) => {
    // The last stage takes any rounding remainder, so the stages always add up to the subtotal.
    const net = i === stages.length - 1 ? subtotal - given : Math.round((subtotal * s.percent) / 100);
    given += net;
    return { ...s, net, vat: vatOf(net), gross: net + vatOf(net) };
  });
}

export const stageLabel = (s) => `${s.label}, ${s.percent}%`;

export function pricingSummary(q) {
  const t = quoteTotals(q);
  if (q.pricing?.type === 'fixed') return `Fixed price of ${money(t.subtotal)} + VAT`;
  if (q.pricing?.type === 'hourly') return `Hourly at ${money(t.rate)} per hour + VAT, invoiced monthly in arrears`;
  return `Scoped at ${t.hours} hours, ${money(t.subtotal)} + VAT`;
}

export function renderQuote(q, { base, pdf = false }) {
  const t = quoteTotals(q);
  const type = q.pricing?.type || 'scoped';
  const signed = Boolean(q.state?.signedAt);
  const expired = !signed && q.validUntil && q.validUntil < today();
  const stages = stageAmounts(q);
  const contact = q.client?.contact || {};

  const scopeLabel = { scoped: 'Scoped at', fixed: 'Pricing', hourly: 'Rate' }[type];
  const scopeValue = { scoped: `${t.hours} hours`, fixed: 'Fixed price', hourly: `${money(t.rate)} per hour` }[type];
  const totalLabel = type === 'hourly' ? 'Estimate, inc. VAT' : 'Total, inc. VAT';

  const facts = `
  <dl class="facts">
    <div><dt>Issued</dt><dd>${esc(fmtDate(q.issued))}</dd></div>
    <div><dt>Valid until</dt><dd>${esc(fmtDate(q.validUntil))}</dd></div>
    <div><dt>Prepared for</dt><dd>${esc([contact.name, q.client?.name].filter(Boolean).join(', '))}</dd></div>
    <div><dt>${scopeLabel}</dt><dd>${esc(scopeValue)}</dd></div>
    ${t.subtotal ? `<div class="money"><dt>${totalLabel}</dt><dd>${money(t.total)}</dd></div>` : ''}
  </dl>`;

  const overview = q.overview?.paragraphs?.length ? `
  <section class="sec" aria-labelledby="h-overview">
    <h2 id="h-overview">${eyebrow('Overview')}${esc(q.overview.heading || 'The project')}</h2>
    <div class="prose">${q.overview.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
  </section>` : '';

  const items = q.scope?.items || [];
  const scope = `
  <section class="sec" aria-labelledby="h-scope">
    <h2 id="h-scope">${eyebrow('Scope of work')}${esc(q.scope?.heading || "What I'll design")}</h2>
    <ol class="rows">${items
      .map((it, i) => `<li><span class="n">${String(i + 1).padStart(2, '0')}</span><div><h3>${esc(it.title)}</h3>${it.body ? `<p>${esc(it.body)}</p>` : ''}</div></li>`)
      .join('')}</ol>
  </section>`;

  const pages = q.pages?.items?.length ? `
  <section class="sec" aria-labelledby="h-pages">
    <h2 id="h-pages">${eyebrow('Pages included')}${esc(q.pages.heading || 'Mobile and desktop')}</h2>
    <ul class="list2">${q.pages.items
      .map((p) => `<li><b>${esc(p.name)}</b>${p.note ? ` ${esc(p.note)}` : ''}</li>`)
      .join('')}</ul>
  </section>` : '';

  // Costs: fixed-price quotes leave hours and line amounts off.
  const showHours = type !== 'fixed';
  const costRows = items
    .map((it, i) => {
      const h = Number(it.hours) || 0;
      return `<tr><td class="n">${String(i + 1).padStart(2, '0')}</td><td>${esc(it.title)}</td>${
        showHours ? `<td class="r">${h || ''}</td><td class="r">${h ? money(h * t.rate) : ''}</td>` : '<td></td>'
      }</tr>`;
    })
    .join('');
  const costs = `
  <section class="sec full page-start" aria-labelledby="h-costs">
    <div class="money-head">
      <h2 id="h-costs">${eyebrow('Costs')}Costs and payment</h2>
      <p>${type === 'fixed' ? 'Fixed price' : `${money(t.rate)} per hour + VAT`}</p>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th colspan="2">Item</th>${showHours ? `<th class="r">${type === 'hourly' ? 'Est. hours' : 'Hours'}</th>` : ''}<th class="r">Amount</th></tr></thead>
        <tbody>${costRows}</tbody>
        ${t.subtotal ? `<tfoot>
          <tr><td></td><td>${type === 'hourly' ? 'Estimate' : 'Subtotal'}</td>${showHours ? `<td class="r">${t.hours || ''}</td>` : ''}<td class="r">${money(t.subtotal)}</td></tr>
          <tr><td></td><td>VAT at 20%</td>${showHours ? '<td></td>' : ''}<td class="r">${money(t.vat)}</td></tr>
          <tr class="grand"><td></td><td>Total</td>${showHours ? '<td></td>' : ''}<td class="r amt">${money(t.total)}</td></tr>
        </tfoot>` : ''}
      </table>
    </div>
    ${type === 'hourly' ? '<p class="note">Hours are an estimate to help you plan. Time is tracked and invoiced monthly in arrears, with a breakdown by task. I will tell you before an estimate is likely to be exceeded.</p>' : ''}
    ${stages.length ? `
    <h3 class="sub-h">Payment stages</h3>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Stage</th><th>Due</th><th class="r">+ VAT</th><th class="r">Total</th></tr></thead>
        <tbody>${stages
          .map((s) => `<tr><td>${esc(stageLabel(s))}</td><td>${esc(s.due)}</td><td class="r">${money(s.net)}</td><td class="r">${money(s.gross)}</td></tr>`)
          .join('')}</tbody>
      </table>
    </div>` : ''}
  </section>`;

  const deposit = stages[0];
  const steps = [
    ['Accept the quote', 'Accept online, using the button below.'],
    ['Sign the contract', 'The contract opens straight after accepting, to sign online.'],
    deposit
      ? ['Pay the deposit', `${money(deposit.gross)} including VAT, then we book the kick-off call.`]
      : ['Book the kick-off', 'We agree dates for each phase and get started.'],
  ];

  let action;
  if (signed) {
    action = `<div class="status">Accepted and signed<span>Signed on ${esc(fmtDate(q.state.signedAt, 'long'))} by ${esc(q.state.signature?.name || '')}.</span></div>
      <a class="ghost" href="/doc/${esc(q.token)}/contract/">View the signed contract</a>`;
  } else if (expired) {
    action = `<div class="status error">This quote expired on ${esc(fmtDate(q.validUntil, 'long'))}<span>Email <b>${COMPANY.email}</b> for an updated quote.</span></div>`;
  } else {
    action = `<a class="btn" href="/doc/${esc(q.token)}/contract/">Accept quote ${ARROW}</a>
      <p class="contact">Questions? Email <b>${COMPANY.email}</b></p>`;
  }

  const next = `
  <section class="sec full page-start" aria-labelledby="h-next">
    <h2 id="h-next">${eyebrow('Next steps')}${signed ? 'Signed and ready' : 'Ready to start'}</h2>
    <ol class="steps">${steps
      .map(([h, p], i) => `<li${signed && i < 2 ? ' class="done"' : ''}><span class="big" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><h3>${esc(h)}</h3><p>${esc(p)}</p></li>`)
      .join('')}</ol>
    <div class="act">${action}</div>
  </section>`;

  const hoursNote = {
    scoped: `The work is scoped at ${t.hours} hours. If anything needs more, I'll ask before going over.`,
    fixed: 'The price is fixed for the scope above. Anything outside it is quoted separately first.',
    hourly: 'Time is tracked and invoiced monthly in arrears, with hours by task.',
  }[type];
  const fine = [
    q.revisions && ['Revisions', q.revisions],
    ['Hours', hoursNote],
    ['Design only', q.builtBy ? `${q.builtBy} builds the site. Development isn't included.` : "Development isn't included."],
    q.fromClient && ['From you', q.fromClient],
    ['Payment', `Invoices are payable within ${PAYMENT_DAYS} days by bank transfer. Prices exclude VAT, added at 20%.`],
    ['Contract', 'Accepting this quote opens the standard design services contract, signed online.'],
    q.validUntil && ['Validity', `This quote is valid until ${fmtDate(q.validUntil, 'long')}.`],
    ...(q.smallPrint || []),
  ].filter(Boolean);

  const body = `
  ${masthead('Quote', q.number)}
  <h1>${eyebrow(`Quote for ${q.client?.name || ''}`)}${esc(q.title)}</h1>
  ${facts}
  ${overview}
  ${scope}
  ${pages}
  ${costs}
  ${next}
  <section class="fine" aria-labelledby="h-fine">
    <h2 id="h-fine">Good to know</h2>
    <div class="cols">${fine.map(([k, v]) => `<p><b>${esc(k)}.</b> ${esc(v)}</p>`).join('')}</div>
  </section>
  ${legalFooter()}`;

  return shell({
    title: `Quote ${q.number}`,
    base,
    body,
    bar: pdf ? '' : topBar(`<span>Quote for ${esc(q.client?.name || '')}</span><a href="/doc/${esc(q.token)}/quote.pdf">Download PDF</a>`),
  });
}
