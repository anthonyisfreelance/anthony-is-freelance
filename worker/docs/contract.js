// The contract page: the standard terms, a Project Schedule filled from the quote, both signatures,
// and (after signing) the signing record. Before signing, the page carries the signing panel:
// company details, a drawn, typed or uploaded signature, and a one-time code sent to the signer.

import {
  esc, money, fmtDate, fmtDateTime, today, eyebrow, masthead, legalFooter, shell, topBar, backLink, downloadLink,
  stageBlocks, STAGE_CSS, ARROW, COMPANY,
} from './shared.js';
import { quoteTotals, stageAmounts, stageLabel, pricingSummary, nextSteps, afterSigningAction } from './quote.js';
import { TERMS, OPTIONAL, OPTIONAL_NAMES, CONTRACT_VERSION } from './terms.js';

const bold = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');

function clauseHtml([n, title, paras]) {
  return `<div class="clause"><h3>${esc(n)}. ${esc(title)}</h3><div>${paras
    .map((p) => (typeof p === 'string' ? `<p>${bold(p)}</p>` : `<ul>${p.list.map((li) => `<li>${bold(li)}</li>`).join('')}</ul>`))
    .join('')}</div></div>`;
}

// The client's details: from the signature once signed, else from the quote, else blanks.
function clientParty(q) {
  const s = q.state?.signature;
  const c = s || q.client || {};
  const name = c.legalName;
  if (!name) return '<b>[Client legal name]</b>, details completed on signing ("the Client").';
  const reg = c.companyNumber
    ? `a company registered in ${esc(c.jurisdiction || 'England and Wales')} (company number ${esc(c.companyNumber)}), whose registered office is at ${esc(c.address)}`
    : `of ${esc(c.address)}`;
  return `<b>${esc(name)}</b>, ${reg} ("the Client").`;
}

export function scheduleRows(q) {
  const t = quoteTotals(q);
  const stages = stageAmounts(q);
  const c = q.contract || {};
  const opt = (c.optional || []).map((k) => `${k} ${OPTIONAL_NAMES[k]}`).join(', ');
  const s = q.state?.signature;
  const contact = s ? `${s.name}, ${s.email}` : [q.client?.contact?.name, q.client?.contact?.email].filter(Boolean).join(', ');
  return [
    ['Project', q.title],
    ['Quote', `Quote ${q.number}, issued ${fmtDate(q.issued, 'long')} ("the Quote")`],
    ['Start date', c.startDate ? fmtDate(c.startDate, 'long') : 'Agreed at the project kick-off'],
    ['Pricing', pricingSummary(q)],
    ['Payment stages', stages.length
      ? stages.map((st) => `${stageLabel(st)}: ${money(st.net)} + VAT, ${st.due.charAt(0).toLowerCase()}${st.due.slice(1)}`).join('. ')
      : 'Invoiced monthly in arrears'],
    ['Hourly rate', `${money(t.rate)} per hour + VAT`],
    ['Revision rounds', c.revisionRounds || q.revisions || '2'],
    ['Completion point', c.completionPoint || 'Delivery of the final designs'],
    ['Confidential project', c.confidential ? 'Yes' : 'No'],
    ['Additional terms', opt || 'None'],
    ['Client contact', contact || '[Completed on signing]'],
  ];
}

function optionalClauses(q) {
  const keys = q.contract?.optional || [];
  return keys
    .map((k) => (k === 'C' ? OPTIONAL.C(q.contract?.competitor) : OPTIONAL[k]))
    .filter(Boolean);
}

function designerSignature(q, settings) {
  const svg = settings?.signatureSvg;
  const img = svg ? `<img class="sig-img" src="data:image/svg+xml;utf8,${encodeURIComponent(svg)}" alt="Signature of Anthony Bliss">` : '<div class="sig-line"></div>';
  return `<div class="sig">
    <p class="sig-for">Signed for and on behalf of ${COMPANY.name}</p>
    ${img}
    <dl><div><dt>Name</dt><dd>${COMPANY.director}</dd></div><div><dt>Position</dt><dd>Director</dd></div><div><dt>Date</dt><dd>${esc(fmtDate(q.state?.sentAt || q.issued, 'long'))}</dd></div></dl>
  </div>`;
}

function clientSignature(q) {
  const s = q.state?.signature;
  if (!s) {
    return `<div class="sig">
      <p class="sig-for">Signed for and on behalf of ${esc(q.client?.legalName || q.client?.name || 'the Client')}</p>
      <div class="sig-line"></div>
      <dl><div><dt>Name</dt><dd>&nbsp;</dd></div><div><dt>Position</dt><dd>&nbsp;</dd></div><div><dt>Date</dt><dd>&nbsp;</dd></div></dl>
    </div>`;
  }
  return `<div class="sig">
    <p class="sig-for">Signed for and on behalf of ${esc(s.legalName)}</p>
    <img class="sig-img" src="${esc(s.image)}" alt="Signature of ${esc(s.name)}">
    <dl><div><dt>Name</dt><dd>${esc(s.name)}</dd></div><div><dt>Position</dt><dd>${esc(s.position)}</dd></div><div><dt>Date</dt><dd>${esc(fmtDate(s.signedAt, 'long'))}</dd></div></dl>
  </div>`;
}

function signingRecord(q) {
  const s = q.state?.signature;
  if (!s) return '';
  const method = { draw: 'Drawn on screen', type: 'Typed name', upload: 'Uploaded image' }[s.method] || s.method;
  const rows = [
    ['Document', `Contract ${q.number}, with Quote ${q.number}`],
    ['Contract version', CONTRACT_VERSION],
    ['Document fingerprint', `SHA-256 ${s.fingerprint}`],
    ['Signed by', `${s.name}, ${s.position}`],
    ['On behalf of', s.legalName + (s.companyNumber ? ` (company number ${s.companyNumber})` : '')],
    ['Email', `${s.email}, verified by a one-time code sent to this address`],
    ['Signed at', fmtDateTime(s.signedAt)],
    ['Signature', method],
    ['IP address', s.ip || 'Not recorded'],
    ['Device', s.userAgent || 'Not recorded'],
    ['Designer signature', `Applied by ${COMPANY.director}, Director, when the contract was issued`],
  ];
  return `
  <section class="sec full page-start" aria-labelledby="h-record">
    <h2 id="h-record">${eyebrow('Signing record')}How this contract was signed</h2>
    <div class="table-wrap"><table class="kv"><tbody>${rows
      .map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`)
      .join('')}</tbody></table></div>
    <p class="note">The fingerprint is calculated from the contract terms, Project Schedule and Quote as they stood when signed. Any change to them gives a different fingerprint.</p>
  </section>`;
}

function signPanel(q) {
  const c = q.client || {};
  const contact = c.contact || {};
  const f = (id, label, value = '', attrs = '') =>
    `<label class="field" for="${id}"><span>${label}</span><input id="${id}" name="${id}" value="${esc(value)}" ${attrs}></label>`;
  const steps = nextSteps(q, { step: 2 });
  return `
  <section class="sec full screen-only sign" id="sign" aria-labelledby="h-sign" data-token="${esc(q.token)}">
    <h2 id="h-sign">${eyebrow(steps.eyebrow)}${esc(steps.title)}</h2>
    ${stageBlocks(steps.items)}
    <form id="sign-form" novalidate>
      <p class="form-h">Your company</p>
      <div class="grid">
        ${f('legalName', 'Company legal name', c.legalName, 'required autocomplete="organization"')}
        ${f('companyNumber', 'Company number (if a limited company)', c.companyNumber)}
        <label class="field wide" for="address"><span>Registered address</span><textarea id="address" name="address" rows="2" required>${esc(c.address || '')}</textarea></label>
      </div>
      <p class="form-h">You</p>
      <div class="grid">
        ${f('name', 'Full name', contact.name && contact.name.includes(' ') ? contact.name : '', 'required autocomplete="name"')}
        ${f('position', 'Position', '', 'required autocomplete="organization-title"')}
        ${f('email', 'Email', contact.email, 'type="email" required autocomplete="email"')}
      </div>
      <p class="form-h">Your signature</p>
      <div class="tabs" role="tablist">
        <button type="button" class="tab" data-mode="draw" aria-pressed="true">Draw</button>
        <button type="button" class="tab" data-mode="type" aria-pressed="false">Type</button>
        <button type="button" class="tab" data-mode="upload" aria-pressed="false">Upload</button>
        <button type="button" class="tab clear" id="sig-clear">Clear</button>
      </div>
      <div class="pad">
        <canvas id="sig" width="1200" height="360" aria-label="Signature area"></canvas>
        <input id="sig-type" class="sig-type" placeholder="Type your full name" hidden>
        <input id="sig-file" type="file" accept="image/png,image/jpeg,image/webp" hidden>
      </div>
      <label class="agree" for="agree"><input id="agree" type="checkbox" required> <span>I agree to this contract, the Project Schedule and the Quote, and I'm authorised to sign for the company named above.</span></label>
      <div class="act">
        <button type="button" class="btn" id="send-code">Email me a code ${ARROW}</button>
      </div>
      <div id="code-step" hidden>
        <p class="form-h">Enter the 6-digit code we emailed you</p>
        <div class="code-row">
          <input id="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000">
          <button type="button" class="btn" id="confirm">Sign contract ${ARROW}</button>
        </div>
      </div>
      <div id="msg" class="status" role="status" hidden></div>
    </form>
  </section>`;
}

const CONTRACT_CSS = `
.parties p + p { margin-top: 1.5em; }
/* Terms: clause title on the left, wording in the main column, as in the Figma contract template. */
.clause { display: grid; grid-template-columns: minmax(0, 1fr) var(--main); column-gap: 8px; padding-bottom: 24px; }
.clause:last-child { padding-bottom: 0; }
.clause h3 { font-size: 14px; line-height: 1.3; }
.clause p, .clause ul { margin: 0 0 6px; }
.clause ul { padding-left: 1.1em; }
.clause li { margin-bottom: 2px; }
.clause > div > :last-child { margin-bottom: 0; }
.sigs { display: grid; grid-template-columns: 1fr 1fr; gap: var(--gap); }
.sig-for { font: 500 14px/1.3 var(--display); margin-bottom: 16px; }
.sig-img { display: block; height: 83px; width: auto; max-width: 100%; object-fit: contain; object-position: left bottom; border-bottom: 1px solid var(--line); padding-bottom: 8px; }
.sig-line { height: 83px; border-bottom: 1px solid var(--line); }
.sig dl { margin: 16px 0 0; display: flex; flex-direction: column; gap: 4px; }
.sig dl div { display: grid; grid-template-columns: 83px 1fr; }
.sig dt, .sig dd { margin: 0; font: 500 14px/1.2 var(--display); text-transform: uppercase; }
.sig dt { color: var(--muted); }

.sign form { display: flex; flex-direction: column; gap: 12px; margin-top: 24px; }
.form-h { font: 500 16px/1 var(--display); text-transform: uppercase; margin-top: 12px; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px var(--gap); }
.field { display: flex; flex-direction: column; gap: 4px; }
.field.wide { grid-column: 1 / -1; }
.field span { font: 500 14px/1.3 var(--display); letter-spacing: 0.02em; color: var(--muted); }
.field input, .field textarea, .sig-type, #code { width: 100%; padding: 10px 12px; border: 1px solid var(--line); border-radius: 0; background: var(--paper); color: var(--ink); font: 500 16px/1.3 var(--display); }
.field input:focus, .field textarea:focus, .sig-type:focus, #code:focus { outline: 2px solid var(--blue); outline-offset: -1px; border-color: var(--blue); }
.tabs { display: flex; gap: 8px; flex-wrap: wrap; }
.tab { padding: 8px 12px; border: 1px solid var(--line); border-radius: 0; background: var(--paper); font: 500 14px/1 var(--display); text-transform: uppercase; cursor: pointer; color: var(--ink); }
.tab[aria-pressed="true"] { border-color: var(--ink); background: var(--ink); color: var(--paper); }
.tab.clear { margin-left: auto; }
.pad { position: relative; border: 1px dashed var(--muted); background: var(--paper); }
#sig { display: block; width: 100%; height: auto; aspect-ratio: 10 / 3; touch-action: none; cursor: crosshair; }
.sig-type { position: absolute; left: 12px; right: 12px; bottom: 12px; width: auto; }
.agree { display: flex; gap: 10px; align-items: flex-start; }
.agree input { margin-top: 3px; width: 16px; height: 16px; flex: none; accent-color: var(--blue); }
.sign .act { margin-top: 12px; }
.code-row { display: flex; gap: 12px; flex-wrap: wrap; }
.code-row .btn { flex: 1 1 200px; width: auto; }
#code { width: 160px; letter-spacing: 0.3em; font-size: 20px; text-align: center; }

@media (max-width: 720px) {
  .clause { grid-template-columns: 1fr; row-gap: 4px; }
  .sigs, .grid { grid-template-columns: 1fr; gap: 24px; }
  .grid { gap: 12px; }
}
`;

const SIGN_SCRIPT = `
(function () {
  var sec = document.getElementById('sign'); if (!sec) return;
  var token = sec.getAttribute('data-token');
  var canvas = document.getElementById('sig'), ctx = canvas.getContext('2d');
  var typeIn = document.getElementById('sig-type'), fileIn = document.getElementById('sig-file');
  var mode = 'draw', ink = false, drawing = false, last = null;
  var msg = document.getElementById('msg');
  function say(text, error) { msg.hidden = false; msg.className = 'status' + (error ? ' error' : ''); msg.textContent = text; }
  function clear() { ctx.clearRect(0, 0, canvas.width, canvas.height); ink = false; }
  function pos(e) { var r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) * canvas.width / r.width, y: (e.clientY - r.top) * canvas.height / r.height }; }
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 5; ctx.strokeStyle = '#111111';
  canvas.addEventListener('pointerdown', function (e) { if (mode !== 'draw') return; drawing = true; last = pos(e); canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', function (e) { if (!drawing) return; var p = pos(e); ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke(); last = p; ink = true; });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (t) { canvas.addEventListener(t, function () { drawing = false; }); });
  function typed() {
    clear(); var v = typeIn.value.trim(); if (!v) return;
    var size = 120; ctx.fillStyle = '#111111'; ctx.textBaseline = 'middle';
    do { ctx.font = 'italic ' + size + 'px "Source Serif Pro", Georgia, serif'; size -= 6; } while (ctx.measureText(v).width > canvas.width - 80 && size > 30);
    ctx.fillText(v, 40, canvas.height / 2 - 30); ink = true;
  }
  typeIn.addEventListener('input', typed);
  fileIn.addEventListener('change', function () {
    var f = fileIn.files && fileIn.files[0]; if (!f) return;
    if (f.size > 5 * 1024 * 1024) { say('That image is over 5MB. Please use a smaller one.', true); return; }
    var img = new Image(); img.onload = function () {
      clear(); var s = Math.min((canvas.width - 40) / img.width, (canvas.height - 40) / img.height, 1);
      ctx.drawImage(img, 20, (canvas.height - img.height * s) / 2, img.width * s, img.height * s); ink = true; URL.revokeObjectURL(img.src);
    }; img.src = URL.createObjectURL(f);
  });
  document.querySelectorAll('.tab[data-mode]').forEach(function (b) {
    b.addEventListener('click', function () {
      mode = b.getAttribute('data-mode'); clear();
      document.querySelectorAll('.tab[data-mode]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      typeIn.hidden = mode !== 'type'; if (mode === 'type') { typeIn.focus(); typed(); }
      if (mode === 'upload') fileIn.click();
    });
  });
  document.getElementById('sig-clear').addEventListener('click', function () { clear(); typeIn.value = ''; fileIn.value = ''; });
  function val(id) { return document.getElementById(id).value.trim(); }
  function fields() { return { legalName: val('legalName'), companyNumber: val('companyNumber'), address: val('address'), name: val('name'), position: val('position'), email: val('email') }; }
  function check() {
    var f = fields();
    if (!f.legalName || !f.address) return 'Please add your company legal name and registered address.';
    if (!f.name || !f.position) return 'Please add your full name and position.';
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(f.email)) return 'Please add a valid email address.';
    if (!ink) return 'Please add your signature.';
    if (!document.getElementById('agree').checked) return 'Please tick to agree to the contract.';
    return '';
  }
  function post(path, body) {
    return fetch('/quote/' + token + '/sign/' + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), credentials: 'same-origin' })
      .then(function (r) { return r.json().catch(function () { return { ok: false, error: 'Something went wrong. Please try again.' }; }); });
  }
  var sendBtn = document.getElementById('send-code');
  sendBtn.addEventListener('click', function () {
    var problem = check(); if (problem) { say(problem, true); return; }
    sendBtn.disabled = true; say('Sending your code…');
    post('code', { email: val('email'), name: val('name') }).then(function (r) {
      sendBtn.disabled = false;
      if (!r.ok) { say(r.error, true); return; }
      document.getElementById('code-step').hidden = false; sendBtn.textContent = 'Send a new code';
      say('We\\'ve emailed a 6-digit code to ' + val('email') + '. It lasts 10 minutes.' + (r.devCode ? ' (Test code: ' + r.devCode + ')' : ''));
      document.getElementById('code').focus();
    });
  });
  var confirmBtn = document.getElementById('confirm');
  confirmBtn.addEventListener('click', function () {
    var problem = check(); if (problem) { say(problem, true); return; }
    var code = val('code'); if (!/^\\d{6}$/.test(code)) { say('Please enter the 6-digit code.', true); return; }
    confirmBtn.disabled = true; say('Signing…');
    var body = fields(); body.code = code; body.method = mode; body.image = canvas.toDataURL('image/png');
    post('confirm', body).then(function (r) {
      if (!r.ok) { confirmBtn.disabled = false; say(r.error, true); return; }
      say('Signed. Preparing your copy, this takes a few seconds…');
      return post('finalise', {}).then(function () { location.reload(); });
    });
  });
})();
`;

export function renderContract(q, { base, settings, pdf = false }) {
  const signed = Boolean(q.state?.signature);
  const expired = !signed && q.validUntil && q.validUntil < today();
  const opt = optionalClauses(q);

  const body = `
  ${masthead('Contract', q.number)}
  <h1>${eyebrow('Design services contract')}${esc(q.title)}</h1>
  <dl class="facts four">
    <div><dt>Client</dt><dd>${esc(q.state?.signature?.legalName || q.client?.legalName || q.client?.name || '')}</dd></div>
    <div><dt>Quote</dt><dd>${esc(q.number)}</dd></div>
    <div><dt>Pricing</dt><dd>${esc({ fixed: 'Fixed price', hourly: 'Hourly', scoped: `${quoteTotals(q).hours} hours, scoped` }[q.pricing?.type || 'scoped'])}</dd></div>
    <div><dt>Status</dt><dd>${signed ? `Signed ${esc(fmtDate(q.state.signature.signedAt))}` : 'Awaiting signature'}</dd></div>
  </dl>

  <section class="sec parties" aria-labelledby="h-parties">
    <h2 id="h-parties">${eyebrow('Agreement')}The parties</h2>
    <div class="prose">
      <p>This Agreement is made on ${signed ? esc(fmtDate(q.state.signature.signedAt, 'long')) : 'the date it is signed by the Client'} between:</p>
      <p><b>${COMPANY.name}</b>, a company registered in England and Wales (company number ${COMPANY.number}), whose registered office is at ${COMPANY.office} ("the Designer"); and</p>
      <p>${clientParty(q)}</p>
    </div>
  </section>

  <section class="sec full" aria-labelledby="h-schedule">
    <h2 id="h-schedule">${eyebrow('Project Schedule')}The details of this project</h2>
    <div class="table-wrap"><table class="kv"><tbody>${scheduleRows(q)
      .map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`)
      .join('')}</tbody></table></div>
    <p class="note">The Project Schedule is read together with the terms below and the Quote${pdf ? ', which is attached' : ` (<a href="/quote/${esc(q.token)}/">view the Quote</a>)`}.</p>
  </section>

  <section class="sec full page-start" aria-labelledby="h-terms">
    <h2 id="h-terms">${eyebrow('Terms')}Terms of the agreement</h2>
    <div class="terms">${TERMS.map(clauseHtml).join('')}</div>
  </section>

  ${opt.length ? `<section class="sec full" aria-labelledby="h-opt">
    <h2 id="h-opt">${eyebrow('Additional terms')}Terms for this project</h2>
    <div class="terms">${opt.map(clauseHtml).join('')}</div>
  </section>` : ''}

  <section class="sec full keep" aria-labelledby="h-sigs">
    <h2 id="h-sigs">${eyebrow('Signatures')}Agreed and signed</h2>
    <p class="note" style="margin:0 0 24px">By signing, both parties agree to this Agreement, the Project Schedule and the Quote.</p>
    <div class="sigs">${designerSignature(q, settings)}${clientSignature(q)}</div>
  </section>

  ${signed || pdf ? '' : expired
    ? `<div class="status error screen-only">This quote expired on ${esc(fmtDate(q.validUntil, 'long'))}<span>Email <b>${COMPANY.email}</b> for an updated quote before signing.</span></div>`
    : signPanel(q)}
  ${signingRecord(q)}
  ${legalFooter()}`;

  const bar = pdf
    ? ''
    : topBar(`${backLink(`/quote/${q.token}/`, 'Back to the quote')}${signed ? downloadLink(`/quote/${q.token}/contract.pdf`, 'Download signed PDF') : ''}`);

  return shell({
    title: `Contract ${q.number}`,
    base,
    body,
    css: CONTRACT_CSS,
    script: signed || pdf || expired ? '' : SIGN_SCRIPT,
    bar,
  });
}

// The text the fingerprint is taken from: terms, schedule and quote content as they stand.
export function fingerprintSource(q) {
  const { state, token, ...content } = q;
  return JSON.stringify({ version: CONTRACT_VERSION, terms: TERMS, optional: optionalClauses(q), quote: content });
}

// After signing, the contract page is the snapshot taken at the moment of signing, exactly as it
// was signed. On screen only, a panel sits above it showing step 3 (pay the deposit), and the bar
// with the PDF link. The snapshot carries the styles it was signed with, so the panel brings its own.
const mintFont = '"Mint Grotesk Display", "Arial Narrow", ui-sans-serif, system-ui, sans-serif';
const AFTER_CSS = `
.bar { max-width: 794px; margin: 0 auto 12px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 8px 16px; font: 500 14px/1.3 ${mintFont}; letter-spacing: 0.02em; color: #111111; }
.bar a { display: inline-flex; align-items: center; gap: 4px; color: #111111; text-decoration: none; }
.bar a.up { text-transform: uppercase; }
.bar svg { width: 18px; height: 18px; flex: none; }
.after-sign { max-width: 794px; margin: 0 auto 12px; padding: 24px 64px 32px; background: #ffffff; color: #111111; }
.after-sign .as-eyebrow { margin: 0 0 4px; font: 500 14px/1.3 ${mintFont}; color: #393939; }
.after-sign h2 { margin: 0 0 24px; font: 500 16px/1 ${mintFont}; text-transform: uppercase; }
.after-sign .as-act { margin-top: 24px; display: flex; flex-direction: column; align-items: flex-start; gap: 24px; }
.after-sign .as-act:empty { display: none; }
.after-sign .btn { display: flex; width: 100%; min-width: 0; min-height: 46px; align-items: center; justify-content: space-between; gap: 8px; padding: 14px 16px; border: 0; background: #0059ff; color: #ffffff; font: 500 16px/1 ${mintFont}; letter-spacing: 0; text-transform: uppercase; text-decoration: none; }
.after-sign .btn svg { width: 18px; height: 18px; flex: none; }
.after-sign .contact { margin: 0; font: 500 14px/1.3 ${mintFont}; }
@media (max-width: 720px) { .after-sign { padding: 24px 16px; } .bar { padding: 12px 16px 0; } }
@media print { .after-sign { display: none !important; } }
${STAGE_CSS}`;

export function signedContractPage(snapshot, q, { depositInvoice } = {}) {
  const steps = nextSteps(q, { depositInvoice });
  const bar = `<div class="bar">${backLink(`/quote/${q.token}/`, 'Back to the quote')}${downloadLink(`/quote/${q.token}/contract.pdf`, 'Download signed PDF')}</div>`;
  const panel = `<section class="after-sign" aria-labelledby="h-after">
  <p class="as-eyebrow">+ ${esc(steps.eyebrow)} +</p>
  <h2 id="h-after">${esc(steps.title)}</h2>
  ${stageBlocks(steps.items)}
  <div class="as-act">${afterSigningAction(q, { depositInvoice })}</div>
</section>`;
  return snapshot.replace('<body>\n', `<body>\n<style>${AFTER_CSS}</style>\n${bar}\n${panel}\n`);
}
