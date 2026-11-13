// Every email the documents system sends, in one place so the wording is easy to change.
//
// Client emails (quote, signed contract, invoice) go from Anthony's Gmail through the Drive bridge;
// codes and notices go through Resend. Each email has a plain-text version and an HTML version
// built from the same copy: a light, personal layout with the site's type and a blue button.
//
// Email clients are fussy, so the HTML is tables and inline styles only. Mint Grotesk loads in Apple
// Mail and iOS; Gmail and Outlook fall back to Arial Narrow / Arial, which keeps the same shape.
// Images and fonts come from the main site (public/email/, public/fonts/).

import { esc, money, fmtDate, COMPANY } from './shared.js';

const SITE = 'https://anthonyis.uk';
const BLUE = '#0059FF';
const INK = '#111111';
const MUTED = '#5A5A5A';
const LINE = '#D8D8D8';
const DISPLAY = "'Mint Grotesk Display', 'Arial Narrow', Arial, Helvetica, sans-serif";
const SERIF = "'Source Serif Pro', Georgia, 'Times New Roman', serif";

export const PERSON = {
  name: 'Anthony Bliss',
  role: 'Freelance Shopify designer',
  award: '2× winner, UK eCommerce Awards 2026',
  phone: '01326 702184',
  phoneHref: '+441326702184',
  email: COMPANY.email,
  site: 'anthonyis.uk',
};

const firstName = (n) => String(n || '').trim().split(/\s+/)[0] || 'there';

/* ---------- Building blocks ---------- */

const p = (html) => `<p style="margin:0 0 16px;font-family:${SERIF};font-size:16px;line-height:1.55;color:${INK}">${html}</p>`;

// The bulletproof button: a table cell with the colour, so it shows even with images off.
function button(href, label) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px"><tr>
<td bgcolor="${BLUE}" style="background:${BLUE}">
<a href="${esc(href)}" target="_blank" style="display:inline-block;padding:15px 20px;font-family:${DISPLAY};font-size:14px;font-weight:500;line-height:1;letter-spacing:0.02em;text-transform:uppercase;color:#FFFFFF;text-decoration:none">${esc(label)}&nbsp;&nbsp;&rarr;</a>
</td></tr></table>`;
}

// Key facts in a quiet two-column table: label left, value right.
function facts(rows) {
  const tr = rows
    .filter(Boolean)
    .map(
      ([k, v, strong], i) => `<tr>
<td style="padding:9px 16px 9px 0;${i ? `border-top:1px solid ${LINE};` : ''}font-family:${DISPLAY};font-size:12px;font-weight:500;letter-spacing:0.02em;color:${MUTED};white-space:nowrap;vertical-align:top">${esc(k)}</td>
<td align="right" style="padding:9px 0;${i ? `border-top:1px solid ${LINE};` : ''}font-family:${DISPLAY};font-size:${strong ? 18 : 14}px;font-weight:500;line-height:1.3;color:${strong ? BLUE : INK};text-align:right">${esc(v)}</td>
</tr>`,
    )
    .join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 24px;border-top:1px solid ${INK};border-bottom:1px solid ${LINE}">${tr}</table>`;
}

// A one-time code, big and easy to copy.
const codeBlock = (code) =>
  `<p style="margin:4px 0 24px;font-family:${DISPLAY};font-size:40px;font-weight:500;line-height:1;letter-spacing:0.18em;color:${INK}">${esc(code)}</p>`;

// The sign-off and signature, the same as the Gmail signature (signatureHtml below).
function signOff(greeting = 'Thanks,') {
  return `${p(`${esc(greeting)}<br>Anthony`)}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 0">${signatureRows()}</table>`;
}

function signatureRows() {
  const line = `font-family:${DISPLAY};font-size:13px;font-weight:500;line-height:1.5;letter-spacing:0.02em;color:${MUTED}`;
  const link = `color:${MUTED};text-decoration:none`;
  return `<tr><td style="padding:0 0 10px"><a href="${SITE}/" target="_blank" style="text-decoration:none"><img src="${SITE}/email/logo.png" width="118" height="30" alt="Anthony is Freelance" style="display:block;width:118px;height:30px;border:0"></a></td></tr>
<tr><td style="padding:0;font-family:${DISPLAY};font-size:14px;font-weight:500;line-height:1.5;letter-spacing:0.02em;color:${INK}">${esc(PERSON.name)}</td></tr>
<tr><td style="padding:0;${line}">${esc(PERSON.role)}<br>${esc(PERSON.award)}</td></tr>
<tr><td style="${line};padding:6px 0 0"><a href="tel:${PERSON.phoneHref}" style="${link}">${esc(PERSON.phone)}</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="${SITE}/" target="_blank" style="${link}">${esc(PERSON.site)}</a></td></tr>`;
}

function layout({ preheader, title, body, footer = true }) {
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(title)}</title>
<style>
@font-face { font-family: "Mint Grotesk Display"; src: url(${SITE}/fonts/mint-grotesk-display-narrow-500.woff2) format("woff2"); font-weight: 500; }
@font-face { font-family: "Source Serif Pro"; src: url(${SITE}/fonts/source-serif-pro-400.woff2) format("woff2"); font-weight: 400; }
a { color: ${BLUE}; }
@media (max-width: 600px) { .wrap { padding: 24px 20px !important; } }
</style>
</head>
<body style="margin:0;padding:0;background:#FFFFFF">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#FFFFFF">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF" style="background:#FFFFFF">
<tr><td align="left">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px">
<tr><td class="wrap" style="padding:32px 32px 40px">
${body}
${footer ? `<p style="margin:32px 0 0;padding-top:14px;border-top:1px solid ${LINE};font-family:${DISPLAY};font-size:11px;font-weight:500;line-height:1.6;letter-spacing:0.02em;color:${MUTED}">${esc(COMPANY.name)} · Company number ${esc(COMPANY.number)} · VAT number ${esc(COMPANY.vat)}<br>Registered office: ${esc(COMPANY.office)}</p>` : ''}
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

// Plain text: the same copy, with the button as a link on its own line.
const textSig = `Anthony\n\n${PERSON.name}\n${PERSON.role}\n${PERSON.award}\n${PERSON.phone} · ${PERSON.site}`;

/* ---------- Client emails (sent from Anthony's Gmail) ---------- */

export function quoteEmail({ base, doc, total }) {
  const c = doc.client?.contact || {};
  const link = `${base}/quote/${doc.token}/`;
  const valid = fmtDate(doc.validUntil, 'long');
  return {
    subject: `Your quote: ${doc.title}`,
    text: `Hi ${firstName(c.name)},

Here's the quote for ${doc.title}.

Review and accept the quote online:
${link}

When you're happy with it, press Accept. The contract opens straight after, and you can sign it online in a couple of minutes. No printing or scanning.

The quote is valid until ${valid}, and there's a PDF copy attached for your records. Any questions, just reply to this email.

Thanks,
${textSig}`,
    html: layout({
      title: `Quote: ${doc.title}`,
      preheader: `Review the quote and sign the contract online. Valid until ${valid}.`,
      body: `${p(`Hi ${esc(firstName(c.name))},`)}
${p(`Here's the quote for ${esc(doc.title)}.`)}
${facts([
  ['Quote', doc.number],
  ['Valid until', valid],
  total ? ['Total, inc. VAT', money(total), true] : null,
])}
${button(link, 'Review and accept the quote')}
${p("When you're happy with it, press Accept. The contract opens straight after, and you can sign it online in a couple of minutes. No printing or scanning.")}
${p('There’s a PDF copy attached for your records. Any questions, just reply to this email.')}
${signOff()}`,
    }),
  };
}

export function signedEmail({ base, doc, sig, deposit }) {
  const link = `${base}/quote/${doc.token}/contract/`;
  const depositLine = deposit
    ? `The ${deposit.label.toLowerCase()} invoice for ${money(deposit.gross)} including VAT will follow shortly, then we can book the kick-off call.`
    : "I'll be in touch shortly to book the kick-off call.";
  return {
    subject: `Signed contract: ${doc.title}`,
    text: `Hi ${firstName(sig.name)},

Thanks for signing, I'm really looking forward to getting started. The signed contract and the quote are attached for your records.

${depositLine}

View the signed contract online:
${link}

Thanks,
${textSig}`,
    html: layout({
      title: `Signed contract: ${doc.title}`,
      preheader: 'The signed contract and quote are attached for your records.',
      body: `${p(`Hi ${esc(firstName(sig.name))},`)}
${p("Thanks for signing, I'm really looking forward to getting started. The signed contract and the quote are attached for your records.")}
${facts([
  ['Contract', `${doc.number}, ${doc.title}`],
  ['Signed', `${fmtDate(sig.signedAt, 'long')} by ${sig.name}`],
  deposit ? [`${deposit.label}, inc. VAT`, money(deposit.gross), true] : null,
])}
${p(esc(depositLine))}
${button(link, 'View the signed contract')}
${signOff()}`,
    }),
  };
}

export function invoiceEmail({ base, doc, total }) {
  const c = doc.client?.contact || {};
  const link = `${base}/invoice/${doc.token}/`;
  const due = fmtDate(doc.due, 'long');
  const amount = money(total, { pennies: true });
  const project = doc.project || doc.title;
  return {
    subject: `Invoice ${doc.number}: ${project}`,
    text: `Hi ${firstName(c.name)},

Invoice ${doc.number} for ${project} is attached: ${amount} including VAT, due by ${due}.

View the invoice online, with the bank details ready to copy:
${link}

Please use ${doc.number} as the payment reference.

Thanks,
${textSig}`,
    html: layout({
      title: `Invoice ${doc.number}`,
      preheader: `${amount} including VAT, due by ${due}.`,
      body: `${p(`Hi ${esc(firstName(c.name))},`)}
${p(`Invoice ${esc(doc.number)} for ${esc(project)} is attached.`)}
${facts([
  ['Invoice', doc.number],
  ['Due by', due],
  ['Reference', doc.number],
  ['Amount due, inc. VAT', amount, true],
])}
${button(link, 'View the invoice')}
${p(`The online version has the bank details ready to copy. Please use <b style="font-family:${DISPLAY};font-weight:500">${esc(doc.number)}</b> as the payment reference.`)}
${signOff()}`,
    }),
  };
}

/* ---------- Codes and notices (sent by Resend) ---------- */

export function signCodeEmail({ code, name, doc }) {
  return {
    subject: `${code} is your code to sign the ${doc.client?.name || ''} contract`.replace(/\s+/g, ' '),
    text: `Hi ${firstName(name)},\n\nYour code to sign the contract for ${doc.title} is:\n\n${code}\n\nIt lasts 10 minutes. If you didn't ask for it, you can ignore this email.\n\nAnthony is Freelance`,
    html: layout({
      title: 'Your signing code',
      preheader: `Your code to sign the contract for ${doc.title}.`,
      body: `${p(`Hi ${esc(firstName(name))},`)}
${p(`Your code to sign the contract for ${esc(doc.title)} is:`)}
${codeBlock(code)}
${p(`<span style="color:${MUTED}">It lasts 10 minutes. If you didn't ask for it, you can ignore this email.</span>`)}
${signOff('Thanks,')}`,
    }),
  };
}

export function loginCodeEmail({ code, ip, place }) {
  const where = [ip, place].filter(Boolean).join(', ');
  return {
    subject: `${code} is your documents login code`,
    text: `Your login code for the documents admin is:\n\n${code}\n\nIt lasts 10 minutes.${where ? ` Requested from ${where}.` : ''} If this wasn't you, don't share it: nobody can log in without it.`,
    html: layout({
      title: 'Login code',
      footer: false,
      preheader: 'Your login code for the documents admin.',
      body: `${p('Your login code for the documents admin is:')}
${codeBlock(code)}
${p(`<span style="color:${MUTED}">It lasts 10 minutes.${where ? ` Requested from ${esc(where)}.` : ''} If this wasn't you, don't share it: nobody can log in without it.</span>`)}`,
    }),
  };
}

export function loginNotice({ when, ip, place, ua }) {
  const rows = [['When', when], ['IP address', ip || 'Unknown'], ['Location', place || 'Unknown'], ['Browser', ua || 'Unknown']];
  return {
    subject: 'New login to your documents admin',
    text: `Someone just logged in to docs.anthonyis.uk/admin/.\n\n${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nIf this wasn't you, change DOCS_SECRET in Cloudflare (Worker > Settings > Variables and secrets). That logs everyone out straight away.`,
    html: layout({
      title: 'New login',
      footer: false,
      preheader: `Logged in from ${place || ip || 'an unknown place'}.`,
      body: `${p('Someone just logged in to the documents admin.')}
${facts(rows)}
${p(`<span style="color:${MUTED}">If this wasn't you, change <b>DOCS_SECRET</b> in Cloudflare (Worker &gt; Settings &gt; Variables and secrets). That logs everyone out straight away.</span>`)}`,
    }),
  };
}

export function signedNotice({ base, doc, sig, to, invoice, deposit }) {
  const lines = [
    `${sig.name} (${sig.position}, ${sig.legalName}) signed the contract for ${doc.title}.`,
    `The signed contract and quote are saved in Drive and emailed to ${to.join(', ')} from your Gmail.`,
    invoice ? `The ${deposit.label.toLowerCase()} invoice ${invoice.number} (${money(deposit.gross, { pennies: true })} inc. VAT) is drafted. Check it and send it from the admin page.` : '',
  ].filter(Boolean);
  return {
    subject: `Signed: ${doc.client?.name} (${doc.number})`,
    text: `${lines.join('\n\n')}\n\n${base}/admin/`,
    html: layout({
      title: 'Contract signed',
      footer: false,
      preheader: lines[0],
      body: `${lines.map((l) => p(esc(l))).join('\n')}
${button(`${base}/admin/`, 'Open the documents admin')}`,
    }),
  };
}

/* ---------- Gmail signature ---------- */

// The same signature block as the emails, to paste into Gmail > Settings > Signature.
export function signatureHtml() {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0">${signatureRows()}</table>`;
}
