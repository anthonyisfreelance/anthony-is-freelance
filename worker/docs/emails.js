// Every email the site sends, in one place so the wording is easy to change.
//
// Client emails (quote, signed contract, invoice) go from Anthony's Gmail through the Drive bridge;
// codes, notices and the enquiry emails go through Resend. Each email has a plain-text version and
// an HTML version built from the same copy.
//
// The design follows Figma (.docs page > Email flows): the logo and a document label across the
// top, serif body text, key facts in quiet rows, numbered boxes for "what happens next", a
// full-width blue button, then the signature (no logo, as the header carries it) and legal footer.
//
// Email clients are fussy, so the HTML is tables and inline styles only. Mint Grotesk loads in Apple
// Mail and iOS; Gmail and Outlook fall back to Arial Narrow / Arial, which keeps the same shape.
// Images and fonts come from the main site (public/email/, public/fonts/).

import { esc, money, fmtDate, COMPANY, PAYMENT_DAYS } from './shared.js';

const SITE = 'https://anthonyis.uk';
const BLUE = '#0059FF';
const INK = '#111111';
const MUTED = '#393939';
const LINE = '#D8D8D8';
const BOX = '#F6F6F6';
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

const mint = (size, colour, extra = '') => `font-family:${DISPLAY};font-size:${size}px;font-weight:500;color:${colour};${extra}`;
// The arrows as text, never emoji (the trailing selector asks for the text form).
const ARROW_UP = '&#8599;&#xFE0E;';
const ARROW_RIGHT = '&rarr;';

const p = (html) => `<p style="margin:0 0 24px;font-family:${SERIF};font-size:16px;line-height:1.5;color:${INK}">${html}</p>`;
const note = (html) => `<p style="margin:0 0 24px;font-family:${SERIF};font-size:16px;line-height:1.5;color:${MUTED}">${html}</p>`;
const label = (text) => `<p style="margin:0 0 8px;${mint(14, MUTED, 'line-height:1.3')}">${esc(text)}</p>`;

// The bulletproof button: table cells with the colour, so it shows even with images off. Full
// width, label on the left and arrow on the right, both linked.
function button(href, text) {
  const a = `display:block;${mint(16, '#FFFFFF', 'line-height:1;text-transform:uppercase;text-decoration:none')}`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px"><tr>
<td bgcolor="${BLUE}" style="background:${BLUE}"><a href="${esc(href)}" target="_blank" style="${a};padding:15px 8px 15px 16px">${esc(text)}</a></td>
<td bgcolor="${BLUE}" width="46" align="right" style="background:${BLUE};width:46px;text-align:right"><a href="${esc(href)}" target="_blank" style="${a};padding:15px 16px 15px 0" aria-hidden="true" tabindex="-1">${ARROW_RIGHT}</a></td>
</tr></table>`;
}

// Key facts: label on the left, value beside it, a hairline above each row.
function facts(rows) {
  const tr = rows
    .filter(Boolean)
    .map(
      ([k, v]) => `<tr>
<td width="150" style="width:150px;padding:8px 8px 8px 0;border-top:1px solid ${LINE};${mint(14, MUTED, 'line-height:1.3;letter-spacing:0.02em;vertical-align:top')}">${esc(k)}</td>
<td style="padding:8px 0;border-top:1px solid ${LINE};${mint(14, INK, 'line-height:1.3;vertical-align:top')}">${esc(v)}</td>
</tr>`,
    )
    .join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px">${tr}</table>`;
}

// Numbered boxes, for "what happens next": a blue number, a short title and one line under it.
function numbered(heading, items) {
  const boxes = items
    .map(
      ([title, text], i) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BOX}" style="margin:0 0 ${i === items.length - 1 ? 24 : 8}px;background:${BOX}"><tr>
<td width="39" style="width:39px;padding:12px 0 12px 12px;vertical-align:top;${mint(26, BLUE, 'line-height:1.1')}">${String(i + 1).padStart(2, '0')}</td>
<td style="padding:12px;vertical-align:top"><div style="${mint(14, INK, 'line-height:1.3')}">${esc(title)}</div><div style="margin-top:2px;font-family:${SERIF};font-size:14px;line-height:1.5;color:${INK}">${esc(text)}</div></td>
</tr></table>`,
    )
    .join('\n');
  return `${label(heading)}\n${boxes}`;
}
const numberedText = (heading, items) => `${heading}:\n${items.map(([t, d], i) => `${i + 1}. ${t}. ${d}`).join('\n')}`;

// A one-time code, big and easy to read.
const codeBlock = (code) => `<p class="code" style="margin:0 0 24px;${mint(80, BLUE, 'line-height:1')}">${esc(code)}</p>`;

// The logo in dark mode. Gmail's apps turn the white page dark but leave pictures alone, so a dark
// logo on a white picture shows as a white box. In the emails (adaptive), Gmail gets a second copy
// of the logo, white on black, blended with whatever is behind it ("difference"): on a white page it
// comes out as the dark logo, on a dark page as the light logo, with no box either way. Only Gmail
// sees it (the "u + .body" rules in layout's <style>); every other mail app keeps the plain picture.
// The signature pasted into Gmail's settings keeps the plain picture too, as Gmail strips the styling.
function logoLink(adaptive, w = 172, h = 44) {
  const img = (file, extra = '') =>
    `<img src="${SITE}/email/${file}" width="${w}" height="${h}" alt="Anthony is Freelance" ${extra}>`;
  const plain = img('logo.png', `${adaptive ? 'class="logo-plain" ' : ''}style="display:block;width:${w}px;height:${h}px;border:0"`);
  const blend = adaptive
    ? `<!--[if !mso]><!-->${img('logo-blend.png', `class="logo-blend" style="display:none;width:${w}px;height:${h}px;border:0"`)}<!--<![endif]-->`
    : '';
  return `<a href="${SITE}/" target="_blank" style="text-decoration:none">${plain}${blend}</a>`;
}

// The top of every email: the logo, and what the email is about on the right (as on the documents).
function mastheadRow([kind, value]) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px"><tr>
<td width="172" class="mast-logo" bgcolor="#FFFFFF" style="width:172px;padding:0 0 8px;background:#FFFFFF;vertical-align:middle">${logoLink(true)}</td>
<td align="right" style="padding:0 0 8px 12px;text-align:right;vertical-align:middle"><div style="${mint(14, MUTED, 'line-height:1.3')}">${esc(kind)}</div><div style="${mint(16, INK, 'line-height:1;text-transform:uppercase')}">${esc(value)}</div></td>
</tr></table>`;
}

// The signature's two halves, shared by the emails (no logo, the header has it) and Gmail (logo).
// The name is larger in the site's emails (26px) than in the Gmail signature (22px), as in Figma.
const sigHeading = (size = 22, lh = 1.3, gap = 4) => `<div style="${mint(14, MUTED, 'line-height:1.3')}">+ ${esc(PERSON.role)} +</div>
<div style="padding:${gap}px 0 0;${mint(size, INK, `line-height:${lh};text-transform:uppercase`)}">${esc(PERSON.name)}</div>`;
const sigLink = `<a href="${SITE}/" target="_blank" style="${mint(14, INK, 'line-height:1.3;text-transform:uppercase;text-decoration:none;white-space:nowrap')}">${esc(PERSON.site)}&nbsp;${ARROW_UP}</a>`;
const sigAward = `<span style="${mint(14, MUTED, 'line-height:1.3;letter-spacing:0.02em')}">${esc(PERSON.award).replace('UK eCommerce Awards 2026', '<span style="white-space:nowrap">UK eCommerce Awards 2026</span>')}</span>`;

// In the site's emails (Figma: Email signature, Logo=Off).
function emailSignature() {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;border-top:1px solid ${LINE}">
<tr><td style="padding:24px 0 0">${sigHeading(26, 1.1, 8)}</td></tr>
<tr><td style="padding:16px 0 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="vertical-align:top">${sigAward}</td>
<td align="right" style="padding:0 0 0 12px;text-align:right;vertical-align:top;white-space:nowrap">${sigLink}</td>
</tr></table></td></tr>
</table>`;
}

function signOff(greeting = 'Thanks,') {
  return `${p(`${esc(greeting)}<br>Anthony`)}\n${emailSignature()}`;
}

const legal = `<p style="margin:0;padding:16px 0 0;border-top:1px solid ${LINE};font-family:${SERIF};font-size:14px;line-height:1.5;color:${MUTED}">${esc(COMPANY.name)} · Company number ${esc(COMPANY.number)} · VAT number ${esc(COMPANY.vat)}<br>Registered office: ${esc(COMPANY.office)}</p>`;

function layout({ preheader, title, head, body, footer = true }) {
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
@media (max-width: 600px) { .wrap { padding: 24px 20px !important; } .mast-logo { width: 141px !important; } .mast-logo img { width: 141px !important; height: 36px !important; } .sig-logo { width: 124px !important; } .sig-logo img { width: 124px !important; height: 32px !important; } .code { font-size: 64px !important; } }
u + .body .logo-plain { display: none !important; }
u + .body .logo-blend { display: block !important; mix-blend-mode: difference; }
</style>
</head>
<body class="body" style="margin:0;padding:0;background:#FFFFFF">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#FFFFFF">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF" style="background:#FFFFFF">
<tr><td align="left">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px">
<tr><td class="wrap" style="padding:40px">
${head ? mastheadRow(head) : ''}
${body}
${footer ? legal : ''}
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

// Plain text: the same copy, with the button as a link on its own line.
const textSig = `Anthony\n\n${PERSON.name}\n${PERSON.role}\n${PERSON.award}\n${PERSON.site}`;

/* ---------- Enquiry emails (sent by Resend from the contact form, worker/enquiry.js) ---------- */

// Only a plain first name goes into the reply: letters, hyphens and apostrophes. Anything else
// ("Visit example.com") becomes "there", so the form can't be used to send someone else's words.
function safeFirstName(n) {
  const w = firstName(n);
  return /^[\p{L}][\p{L}'’-]{0,29}$/u.test(w) ? w : 'there';
}

const ENQUIRY_STEPS = [
  ['A reply from me', 'Within two working days.'],
  ['A short call', '30 minutes about your business and the project.'],
  ['Your quote', 'With a project timeline.'],
];

// To the person who sent the form, straight away. It goes to an address nobody has checked, so it
// carries nothing they typed except a first name (see safeFirstName).
export function enquiryReceivedEmail({ name }) {
  const hi = safeFirstName(name);
  const link = `${SITE}/work/`;
  return {
    subject: 'Thanks for getting in touch',
    text: `Hi ${hi},

Thanks for getting in touch. Your message has come straight to me, and I'll reply within two working days.

${numberedText('What happens next', ENQUIRY_STEPS)}

While you wait, have a look at some of the stores I have designed:
${link}

Thanks,
${textSig}`,
    html: layout({
      title: 'Thanks for getting in touch',
      preheader: "Your message has come straight to me. I'll reply within two working days.",
      head: ['Enquiry', 'Received'],
      body: `${p(`Hi ${esc(hi)},`)}
${p("Thanks for getting in touch. Your message has come straight to me, and I'll reply within two working days.")}
${numbered('What happens next', ENQUIRY_STEPS)}
${p('While you wait, have a look at some of the stores I have designed.')}
${button(link, 'See my work')}
${signOff()}`,
    }),
  };
}

// To Anthony: everything they sent, with a button that starts the reply.
export function enquiryNotice(d) {
  const rows = [
    ['Name', d.name],
    ['Email', d.email],
    ['Website', d.website],
    ['Budget', d.budget],
    ['Found me through', d.found],
    ['Sent from', d.page],
  ].filter(([, v]) => v);
  const message = d.message || '(No message)';
  return {
    subject: `Project enquiry: ${d.name}${d.budget ? ` (${d.budget})` : ''}`,
    text: `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${message}\n`,
    html: layout({
      title: `Enquiry from ${d.name}`,
      footer: false,
      preheader: message.slice(0, 120),
      head: ['Enquiry', d.name],
      body: `${facts(rows)}
<p style="margin:0 0 24px;font-family:${SERIF};font-size:16px;line-height:1.5;color:${INK};white-space:pre-wrap">${esc(message)}</p>
${button(`mailto:${encodeURIComponent(d.email).replace(/%40/g, '@')}?subject=${encodeURIComponent('Your enquiry')}`, `Reply to ${firstName(d.name)}`)}`,
    }),
  };
}

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
      head: ['Quote', doc.number],
      body: `${p(`Hi ${esc(firstName(c.name))},`)}
${p(`Here's the quote for ${esc(doc.title)}.`)}
${facts([
  ['Quote', doc.number],
  ['Valid until', valid],
  total ? ['Total, inc. VAT', money(total)] : null,
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
  const steps = deposit
    ? [
        [`${deposit.label} invoice`, `${money(deposit.gross)} including VAT, sent shortly. Payable within ${PAYMENT_DAYS} days.`],
        ['Kick-off call', `Booked once the ${deposit.label.toLowerCase()} is paid.`],
        ['Work begins', 'On the dates in the project schedule.'],
      ]
    : [
        ['Kick-off call', "I'll be in touch shortly to book it."],
        ['Work begins', 'On the dates we agree at the kick-off.'],
        ['Invoices', 'Monthly in arrears, with hours by task.'],
      ];
  return {
    subject: `Signed contract: ${doc.title}`,
    text: `Hi ${firstName(sig.name)},

Thanks for signing, I'm really looking forward to getting started. The signed contract and the quote are attached for your records.

${numberedText('What happens next', steps)}

View the signed contract online:
${link}

Thanks,
${textSig}`,
    html: layout({
      title: `Signed contract: ${doc.title}`,
      preheader: 'The signed contract and quote are attached for your records.',
      head: ['Contract', 'Signed'],
      body: `${p(`Hi ${esc(firstName(sig.name))},`)}
${p("Thanks for signing, I'm really looking forward to getting started. The signed contract and the quote are attached for your records.")}
${facts([
  ['Contract', `${doc.number}, ${doc.title}`],
  ['Signed', `${fmtDate(sig.signedAt, 'long')} by ${sig.name}`],
  deposit ? [`${deposit.label}, inc. VAT`, money(deposit.gross)] : null,
])}
${numbered('What happens next', steps)}
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
      head: ['Invoice', doc.number],
      body: `${p(`Hi ${esc(firstName(c.name))},`)}
${p(`Invoice ${esc(doc.number)} for ${esc(project)} is attached.`)}
${facts([
  ['Invoice', doc.number],
  ['Due by', due],
  ['Reference', doc.number],
  ['Amount due, inc. VAT', amount],
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
      head: ['Contract', doc.number],
      body: `${p(`Hi ${esc(firstName(name))},`)}
${p(`Your code to sign the contract for ${esc(doc.title)} is:`)}
${codeBlock(code)}
${note("It lasts 10 minutes. If you didn't ask for it, you can ignore this email.")}
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
      head: ['Documents', 'Login'],
      body: `${p('Your login code for the documents admin is:')}
${codeBlock(code)}
${note(`It lasts 10 minutes.${where ? ` Requested from ${esc(where)}.` : ''} If this wasn't you, don't share it: nobody can log in without it.`)}`,
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
      head: ['Documents', 'New login'],
      body: `${p('Someone just logged in to the documents admin.')}
${facts(rows)}
${note(`If this wasn't you, change <b style="font-family:${DISPLAY};font-weight:500">DOCS_SECRET</b> in Cloudflare (Worker &gt; Settings &gt; Variables and secrets). That logs everyone out straight away.`)}`,
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
      head: ['Signed', doc.number],
      body: `${lines.map((l) => p(esc(l))).join('\n')}
${button(`${base}/admin/`, 'Open the documents admin')}`,
    }),
  };
}

/* ---------- Gmail signature ---------- */

// The signature to paste into Gmail > Settings > Signature (Figma: Email signature, Logo=On): the
// same heading as the emails, then the logo with the site link and award line on the right.
// `adaptive` is only for the test email, where the Gmail dark-mode logo rules can apply.
export function signatureHtml({ adaptive = false } = {}) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:552px;border-top:1px solid ${LINE}">
<tr><td style="padding:24px 0">${sigHeading()}</td></tr>
<tr><td style="padding:24px 0 0;border-top:1px solid ${LINE}"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td width="149" class="sig-logo" bgcolor="#FFFFFF" style="width:149px;background:#FFFFFF;vertical-align:middle">${logoLink(adaptive, 149, 38)}</td>
<td align="right" style="padding:0 0 0 12px;vertical-align:middle"><table role="presentation" align="right" cellpadding="0" cellspacing="0" border="0" style="width:auto"><tr><td align="left" style="text-align:left">
<div>${sigLink}</div>
<div style="padding:6px 0 0">${sigAward}</div>
</td></tr></table></td>
</tr></table></td></tr>
</table>`;
}

// A test email for the Gmail signature: some everyday text, then the signature.
export function signatureTest() {
  const lines = [
    'Hi Sam,',
    'Thanks for your time on the call this morning. It was great to hear more about the plans for the store and where you want to take it next year.',
    "I'll pull together the quote and a rough timeline over the next couple of days, and send both across by Thursday.",
    'In the meantime, if you can share access to your analytics, I can start looking at how customers move through the site on mobile.',
  ];
  return {
    subject: 'Signature test',
    text: `${lines.join('\n\n')}\n\nThanks,\nAnthony\n\n(Signature test. The signature shows in the HTML version.)`,
    html: layout({
      title: 'Signature test',
      preheader: 'Signature test: check it in light and dark mode.',
      footer: false,
      body: `${lines.map((l) => p(esc(l))).join('\n')}
${p('Thanks,<br>Anthony')}
<div style="margin:28px 0 0">${signatureHtml({ adaptive: true })}</div>`,
    }),
  };
}
