// Anthony's admin page at docs.anthonyis.uk/admin/: every document with its status, and the actions that move
// it on (send, create the next invoice, mark paid). Login is a one-time code sent to ADMIN_EMAIL.

import { esc, money, fmtDate, eyebrow, masthead, shell, today, taxYear, COPY_SCRIPT } from './shared.js';
import { quoteTotals, stageAmounts } from './quote.js';
import { invoiceTotals } from './invoice.js';

// Layout follows the Figma admin page: every row shares one set of column widths, so each column
// starts on the same line, and the buttons run Open, the next step (blue), other actions, then the
// quiet text links.
export const ADMIN_CSS = `
/* Working overlay: a 7 by 7 grid of blue pixels ripples while an action runs, then snaps into a
   tick (done) or a red cross (failed). Covers the page so the wait is unmistakable. */
.busy { position: fixed; inset: 0; z-index: 100; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 32px; padding: 24px; background: rgba(255, 255, 255, 0.94); opacity: 0; transition: opacity 0.2s ease; }
.busy.show { opacity: 1; }
.busy-grid { display: grid; grid-template-columns: repeat(7, 14px); gap: 4px; }
.busy-grid i { width: 14px; height: 14px; background: var(--blue); opacity: 0.1; transform: scale(0.55); animation: px 1.4s var(--d, 0ms) infinite ease-in-out; transition: opacity 0.25s ease, transform 0.25s ease, background 0.25s ease; }
@keyframes px { 0%, 100% { opacity: 0.1; transform: scale(0.55); } 35% { opacity: 1; transform: scale(1); } 60% { opacity: 0.35; transform: scale(0.8); } }
.busy.done .busy-grid i, .busy.fail .busy-grid i { animation: none; opacity: 0.06; transform: scale(0.55); transition-delay: var(--d2, 0ms); }
.busy.done .busy-grid i.on, .busy.fail .busy-grid i.on { opacity: 1; transform: scale(1); }
.busy.fail .busy-grid i { background: var(--red); }
.busy-text { max-width: 420px; margin: 0; font: 500 20px/1.3 var(--display); letter-spacing: 0.02em; text-align: center; text-transform: uppercase; color: var(--ink); }
.busy-sub { margin: -20px 0 0; font: 500 13px/1.4 var(--display); letter-spacing: 0.02em; color: var(--muted); }
.busy.fail .busy-text { color: var(--red); }
@media (prefers-reduced-motion: reduce) {
  .busy-grid i { animation-duration: 2.4s; animation-delay: 0ms; }
}

.sheet { max-width: 1180px; }
.sheet > * + * { margin-top: 40px; }
.bar { max-width: 1180px; }
.years, .views { display: flex; flex-wrap: wrap; gap: 8px; }
.years { margin-top: 24px; }
.sheet > .views { margin-top: 24px; }
.views a b { font-weight: 500; color: var(--red); }
.views a[aria-current="page"] b { color: inherit; }
.years a, .views a { padding: 8px 12px; border: 1px solid var(--line); background: var(--paper); color: var(--ink); font: 500 14px/1 var(--display); text-transform: uppercase; text-decoration: none; }
/* A tab with something waiting inside is blue, so it catches the eye from the other page. */
.views a.todo { border-color: var(--blue); background: var(--blue); color: #ffffff; }
.views a.todo b { color: inherit; }
.years a[aria-current="page"], .views a[aria-current="page"] { border-color: var(--ink); background: var(--ink); color: var(--paper); }
.years a:hover, .views a:hover { border-color: var(--ink); }
.totals { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 40px; margin-bottom: 0; }
.totals dt { font: 500 14px/1.3 var(--display); letter-spacing: 0.02em; color: var(--muted); }
.totals dd { margin: 4px 0 0; font: 500 26px/1.1 var(--display); text-transform: uppercase; color: var(--ink); }
.totals .t-blue dd { color: var(--blue); }
.totals .t-red dd { color: var(--red); }
/* The year's money on the documents page sits in four grey tiles (Figma: Admin page, Year totals).
   Phones and the Leads counts keep the plain figures. */
@media (min-width: 901px) {
  .totals.tiles { gap: 8px; }
  .totals.tiles > div { padding: 24px; background: var(--box); }
}
.adm { display: flex; flex-direction: column; gap: 40px; }
.adm-head, .adm-row { display: flex; align-items: center; gap: 16px; border-top: 1px solid var(--line); font: 500 14px/1.3 var(--display); letter-spacing: 0.02em; }
.adm-head { padding: 24px 0 12px; color: var(--muted); }
.adm-row { padding: 12px 0; }
.adm-client { display: flex; flex-direction: column; gap: 12px; }
.adm-client h2 { padding: 24px 0 8px; border-top: 1px solid var(--line); font-size: 22px; line-height: 1.3; text-transform: uppercase; }
.c-doc { flex: 0 0 176px; min-width: 0; overflow-wrap: anywhere; }
.c-doc span { display: block; color: var(--muted); }
.c-proj { flex: 0 0 150px; min-width: 0; }
/* Who the send buttons email: the document's contact, so there is never a guess before pressing. */
.c-proj span { display: block; font-size: 12px; color: var(--muted); overflow-wrap: anywhere; }
.c-proj span:first-of-type { margin-top: 4px; }
.c-proj span.none { color: var(--red); }
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
/* Phones and narrow screens (Figma: Admin page (mobile), docs/Admin row (mobile)). Each row stacks:
   who and how much on the first line, then the project, the status and the buttons. */
@media (max-width: 900px) {
  .sheet > * + * { margin-top: 24px; }
  .totals { grid-template-columns: 1fr 1fr; gap: 16px; }
  .totals dt { font-size: 12px; }
  .totals dd { font-size: 22px; }
  .adm { gap: 24px; }
  .adm-head { display: none; }
  .adm-client { gap: 0; }
  .adm-client h2 { padding: 16px 0 8px; font-size: 18px; }
  .adm-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "doc amt" "proj proj" "status status" "act act"; align-items: start; gap: 8px 16px; padding: 16px 0; font-size: 12px; }
  .c-doc { grid-area: doc; }
  .c-amt { grid-area: amt; font-size: 14px; line-height: 1.3; text-align: right; }
  .c-proj { grid-area: proj; }
  .c-status { grid-area: status; }
  .c-act { grid-area: act; gap: 12px; padding-top: 4px; }
  .tools, .tools div { flex-direction: column; align-items: flex-start; }
}
`;

// The documents page as projects (Figma to follow): money tiles with a line of context, a card per
// signed project with its payment stages, single rows for proposals and loose invoices, and finished
// work folded away. The Leads page keeps ADMIN_CSS alone.
export const DASH_CSS = `
.totals p { margin: 8px 0 0; font: 500 12px/1.3 var(--display); letter-spacing: 0.02em; color: var(--muted); }
.totals .t-red p { color: var(--red); }
.fine { margin-top: 12px; font: 500 12px/1.3 var(--display); letter-spacing: 0.02em; color: var(--muted); }
.doc-tabs { display: flex; flex-wrap: wrap; gap: 0 32px; margin-top: 32px; border-bottom: 1px solid var(--line); }
.doc-tabs a { margin-bottom: -1px; padding: 14px 0 12px; border-bottom: 2px solid transparent; color: var(--muted); font: 500 18px/1.2 var(--display); text-transform: uppercase; text-decoration: none; }
.doc-tabs a span { font-size: 13px; }
.doc-tabs a b { font-size: 13px; font-weight: 500; color: var(--blue); }
.doc-tabs a:hover { color: var(--ink); }
.doc-tabs a[aria-current="page"] { border-bottom-color: var(--ink); color: var(--ink); }
.sheet > .panel { margin-top: 24px; }
.panel { gap: 24px; }
.panel .sec-note { margin: 0; }
.panel .rows, .panel .projs { margin-top: 0; }
.panel .closed .rows, .panel .closed .projs { margin-top: 20px; }
.panel .rows .adm-row:last-child { border-bottom: 1px solid var(--line); }
.closed summary h2 { display: flex; align-items: baseline; gap: 10px; padding-top: 24px; border-top: 1px solid var(--line); font: 500 22px/1.3 var(--display); text-transform: uppercase; }
.closed summary h2 span { font-size: 14px; color: var(--muted); }
.sec-note { margin-top: 4px; font: 500 13px/1.4 var(--display); letter-spacing: 0.02em; color: var(--muted); }
.rows { margin-top: 16px; }
.c-doc b { display: block; font-weight: 500; }
.panel .c-act { justify-content: flex-end; }
.projs { display: flex; flex-direction: column; gap: 16px; margin-top: 20px; }
.proj { display: flex; flex-direction: column; gap: 20px; padding: 24px; background: var(--box); }
.proj-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; }
.proj-head h3 { margin: 0; font: 500 20px/1.2 var(--display); text-transform: uppercase; }
.proj-head p { margin: 4px 0 0; font: 500 14px/1.3 var(--display); letter-spacing: 0.02em; }
.proj-head .to { display: flex; flex-wrap: wrap; gap: 0 8px; }
.proj-head .to span { font-size: 12px; color: var(--muted); }
.proj-head .to span.none { color: var(--red); }
.proj-val { flex: none; text-align: right; font: 500 26px/1.1 var(--display); }
.proj-val span { display: block; margin-bottom: 6px; font-size: 12px; letter-spacing: 0.02em; color: var(--muted); }
.proj-alert { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 16px; padding: 12px 16px; border-left: 3px solid var(--red); background: var(--paper); }
.proj-alert .c-act { flex: none; }
.proj-note { margin: 0; font: 500 14px/1.3 var(--display); color: var(--muted); }
.proj-progress progress { display: block; width: 100%; height: 6px; border: 0; background: var(--line); -webkit-appearance: none; appearance: none; }
.proj-progress progress::-webkit-progress-bar { background: var(--line); }
.proj-progress progress::-webkit-progress-value { background: var(--blue); }
.proj-progress progress::-moz-progress-bar { background: var(--blue); }
.proj-progress p { margin: 8px 0 0; font: 500 14px/1.3 var(--display); letter-spacing: 0.02em; color: var(--muted); }
.proj-progress b { font-weight: 500; color: var(--ink); }
.pays { border-top: 1px solid var(--line); }
.pay { display: flex; align-items: center; gap: 16px; padding: 12px 0; border-bottom: 1px solid var(--line); font: 500 14px/1.3 var(--display); letter-spacing: 0.02em; }
.s-name { flex: 0 0 240px; min-width: 0; }
.s-name span { display: block; margin-top: 2px; font-size: 12px; color: var(--muted); }
.s-amt { flex: 0 0 110px; font-size: 18px; line-height: 1.4; letter-spacing: 0; }
.pay .c-status { flex: 0 0 230px; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 8px; }
.s-num { font-size: 12px; color: var(--muted); }
.pay.later .s-name, .pay.later .s-amt { color: var(--muted); }
.pay.done .s-name, .pay.done .s-amt { opacity: 0.4; }
.pay .c-act { justify-content: flex-end; }
.pill.ready { border-color: var(--blue); color: var(--blue); }
.docs summary, .closed summary, .more summary { list-style: none; cursor: pointer; }
.docs summary::-webkit-details-marker, .closed summary::-webkit-details-marker, .more summary::-webkit-details-marker { display: none; }
.docs summary { display: inline-flex; gap: 6px; font: 500 12px/1 var(--display); letter-spacing: 0.02em; text-transform: uppercase; color: var(--muted); }
.docs summary:hover { color: var(--ink); }
.docs summary::after { content: "+"; }
.docs[open] summary::after { content: "–"; }
.docs ul { display: flex; flex-direction: column; gap: 10px; margin: 12px 0 0; padding: 0; list-style: none; }
.docs li { display: flex; align-items: center; gap: 16px; font: 500 13px/1.3 var(--display); letter-spacing: 0.02em; }
.docs li span { flex: 0 0 240px; }
.closed summary h2::after { content: "+"; margin-left: auto; font-size: 22px; }
.closed[open] summary h2::after { content: "–"; }
.closed summary:hover h2 { color: var(--muted); }
.closed .proj { background: var(--paper); border: 1px solid var(--line); }
.more { position: relative; }
.more summary { justify-content: center; min-width: 36px; letter-spacing: 0.1em; }
.more[open] summary { border-color: var(--ink); }
.more .menu { position: absolute; top: calc(100% + 4px); right: 0; z-index: 10; display: flex; flex-direction: column; min-width: 190px; padding: 4px 0; border: 1px solid var(--ink); background: var(--paper); }
.more .menu > * { display: block; width: 100%; padding: 10px 14px; font-size: 13px; text-align: left; white-space: nowrap; }
.more .menu > *:hover { background: var(--box); text-decoration: none; }
@media (max-width: 900px) {
  .closed summary h2 { padding-top: 16px; font-size: 18px; }
  /* Phones: the three tabs stay on one line; a tab with something to do shows its count in blue. */
  .doc-tabs { flex-wrap: nowrap; gap: 0 18px; margin-top: 24px; }
  .doc-tabs a { white-space: nowrap; font-size: 15px; }
  .doc-tabs a b { display: none; }
  .doc-tabs a.has-todo span { color: var(--blue); }
  .proj { gap: 16px; padding: 16px; }
  .proj-head { flex-direction: column; gap: 12px; }
  .proj-val { text-align: left; font-size: 22px; }
  .pay { display: grid; grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "name amt" "status status" "act act"; align-items: start; gap: 8px 16px; padding: 14px 0; font-size: 13px; }
  .s-name { grid-area: name; }
  .s-amt { grid-area: amt; font-size: 14px; text-align: right; }
  .pay .c-status { grid-area: status; }
  .pay .c-act, .panel .c-act { grid-area: act; justify-content: flex-start; }
  .docs li { flex-wrap: wrap; gap: 8px 16px; }
  .docs li span { flex-basis: 100%; }
  .more .menu { right: auto; left: 0; }
}
`;

// Only one "···" menu open at a time; a click elsewhere or Escape closes it.
export const MENU_SCRIPT = `
(function () {
  var menus = document.querySelectorAll('details.more');
  menus.forEach(function (m) { m.addEventListener('toggle', function () { if (m.open) menus.forEach(function (o) { if (o !== m) o.open = false; }); }); });
  document.addEventListener('click', function (e) { menus.forEach(function (m) { if (m.open && !m.contains(e.target)) m.open = false; }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') menus.forEach(function (m) { m.open = false; }); });
})();
`;

export const ADMIN_SCRIPT = `
(function () {
  var msg = document.getElementById('msg');
  function say(t, err) { if (!msg) return; msg.hidden = false; msg.className = 'status' + (err ? ' error' : ''); msg.textContent = t; window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function post(path, body) {
    return fetch('/admin/' + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body || {}), credentials: 'same-origin' })
      .then(function (r) { return r.json().catch(function () { return { ok: false, error: 'Something went wrong.' }; }); });
  }
  // The full-screen working overlay (see .busy in ADMIN_CSS). Built on first use.
  var TICK = ['1,6', '2,5', '3,0', '3,4', '4,1', '4,3', '5,2'];
  var CROSS = ['1,1', '2,2', '3,3', '4,4', '5,5', '1,5', '2,4', '4,2', '5,1'];
  var busy = (function () {
    var el, text, sub, cells = [], timer;
    function build() {
      el = document.createElement('div'); el.className = 'busy'; el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'assertive');
      var grid = document.createElement('div'); grid.className = 'busy-grid'; grid.setAttribute('aria-hidden', 'true');
      for (var y = 0; y < 7; y++) for (var x = 0; x < 7; x++) {
        var c = document.createElement('i'); c.setAttribute('data-xy', y + ',' + x);
        c.style.setProperty('--d', ((x + y) * 70) + 'ms'); c.style.setProperty('--d2', ((x + y) * 25) + 'ms');
        grid.appendChild(c); cells.push(c);
      }
      text = document.createElement('p'); text.className = 'busy-text';
      sub = document.createElement('p'); sub.className = 'busy-sub';
      el.appendChild(grid); el.appendChild(text); el.appendChild(sub); document.body.appendChild(el);
    }
    function shape(list) { cells.forEach(function (c) { c.classList.toggle('on', list.indexOf(c.getAttribute('data-xy')) > -1); }); }
    return {
      work: function (t) {
        if (!el) build();
        el.className = 'busy'; shape([]); text.textContent = t; sub.textContent = '';
        clearTimeout(timer); timer = setTimeout(function () { sub.textContent = 'Still going. Emails and PDFs can take a little while.'; }, 6000);
        el.offsetWidth; el.classList.add('show');
      },
      done: function (t) { clearTimeout(timer); el.className = 'busy show done'; shape(TICK); text.textContent = t; sub.textContent = ''; },
      fail: function (t) { clearTimeout(timer); el.className = 'busy show fail'; shape(CROSS); text.textContent = t; sub.textContent = ''; },
      hide: function () { clearTimeout(timer); if (el) el.classList.remove('show'); }
    };
  })();
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
      if (confirmText && b.getAttribute('data-armed') !== '1') { b.setAttribute('data-armed', '1'); b.textContent = confirmText; setTimeout(function () { if (b.getAttribute('data-armed') !== '1') return; b.removeAttribute('data-armed'); b.textContent = b.getAttribute('data-label'); }, 6000); return; }
      b.removeAttribute('data-armed');
      var label = b.getAttribute('data-label') || b.textContent; b.disabled = true; b.textContent = 'Working…';
      var started = Date.now();
      busy.work(b.getAttribute('data-wait') || 'Working…');
      // Let the ripple run for at least a moment, so a quick answer still reads as work done.
      function after(fn) { setTimeout(fn, Math.max(0, 700 - (Date.now() - started))); }
      post('action', { action: b.getAttribute('data-action'), token: b.getAttribute('data-token'), stage: b.getAttribute('data-stage'), value: b.getAttribute('data-value') })
        .catch(function () { return { ok: false, error: 'Could not reach the server. Check your connection and try again.' }; })
        .then(function (r) { after(function () {
          if (!r.ok) { busy.fail(r.error || 'Something went wrong.'); setTimeout(function () { busy.hide(); b.disabled = false; b.textContent = label; say(r.error || 'Something went wrong.', true); }, 1800); return; }
          busy.done(r.message || 'Done'); setTimeout(function () { location.reload(); }, 1100);
        }); });
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

// The line under the project: the one address this document's emails go to (client.contact).
function sendsTo(d) {
  const c = d.client?.contact || {};
  if (!c.email) return '<span class="none">No contact email</span>';
  return `${c.name ? `<span>To ${esc(c.name)}</span>` : ''}<span>${esc(c.email)}</span>`;
}

// Every document gets one visible next step (blue) and a "···" menu for the rest, so a row never
// shows a wall of equal buttons. With no next step, Open shows instead.
const linkOf = (d, base) => `${base}/${d.type}/${d.token}/`;
const openLink = (href, label = 'Open', cls = 'ghost small') => `<a class="${cls}" href="${esc(href)}" target="_blank" rel="noopener">${esc(label)}</a>`;
const copyLink = (href, label = 'Copy link') => `<button type="button" class="textbtn" data-copy="${esc(href)}">${esc(label)}</button>`;
function btn(d, action, label, { extra = '', kind = 'ghost small', stage } = {}) {
  return `<button type="button" class="${kind}" data-action="${action}" data-token="${esc(d.token)}" data-label="${esc(label)}"${stage != null ? ` data-stage="${stage}"` : ''} ${extra}>${esc(label)}</button>`;
}
const PRIMARY = 'ghost small primary';
// Anything that emails the client takes two presses, and the second one names the address.
const checkSend = (d) => (d.client?.contact?.email ? ` data-confirm="${esc(`Send to ${d.client.contact.email}?`)}"` : '');
const SEND_WAIT = 'data-wait="Saving the PDF to Drive and emailing it from your Gmail…"';

function menu(items) {
  const list = items.filter(Boolean);
  if (!list.length) return '';
  return `<details class="more"><summary class="ghost small" aria-label="More actions" title="More actions">···</summary><div class="menu">${list.join('')}</div></details>`;
}

// { primary, more } for one quote or invoice.
function docActions(d, base) {
  const s = d.state || {};
  const link = linkOf(d, base);
  const open = openLink(link, 'Open', 'textbtn');
  const withdraw = btn(d, 'withdraw', 'Withdraw', { kind: 'textbtn', extra: 'data-confirm="Sure? Press again" data-wait="Withdrawing…"' });
  if (s.withdrawnAt) return { primary: btn(d, 'restore', 'Restore', { extra: 'data-wait="Restoring…"' }), more: [open] };
  if (d.type === 'quote') {
    if (!s.signedAt && !s.sentAt) return { primary: btn(d, 'send-quote', 'Send quote', { kind: PRIMARY, extra: `${SEND_WAIT}${checkSend(d)}` }), more: [open, copyLink(link), withdraw] };
    if (!s.signedAt) return { primary: '', more: [open, btn(d, 'send-quote', 'Send again', { kind: 'textbtn', extra: `${SEND_WAIT}${checkSend(d)}` }), copyLink(link), withdraw] };
    const contract = openLink(`${link}contract/`, 'Open contract', 'textbtn');
    if (!s.finalisedAt) return { primary: btn(d, 'finalise', 'Finish signing', { kind: PRIMARY, extra: 'data-wait="Making the signed PDFs, saving to Drive and emailing…"' }), more: [openLink(link, 'Open quote', 'textbtn'), contract, copyLink(link)] };
    return { primary: '', more: [openLink(link, 'Open quote', 'textbtn'), contract, copyLink(link)] };
  }
  if (!s.sentAt) return { primary: btn(d, 'send-invoice', 'Send invoice', { kind: PRIMARY, extra: `${SEND_WAIT}${checkSend(d)}` }), more: [open, copyLink(link), withdraw] };
  if (s.status !== 'paid') return { primary: btn(d, 'mark-paid', 'Mark paid', { kind: PRIMARY, extra: 'data-wait="Marking as paid…"' }), more: [open, btn(d, 'send-invoice', 'Send again', { kind: 'textbtn', extra: `data-wait="Emailing it again…"${checkSend(d)}` }), copyLink(link), withdraw] };
  return { primary: '', more: [open, copyLink(link)] };
}

function actionCell(d, base) {
  const { primary, more } = docActions(d, base);
  // No next step: Open stays visible, so the row is never just a menu.
  const lead = primary || openLink(linkOf(d, base));
  return `<div class="c-act">${lead}${menu(primary ? more : more.slice(1))}</div>`;
}

// Tax years end on 31 January (taxYear in shared.js), the same as the Invoices folders in Drive.
// Each document sits in the year of its issue date. Tabs are links (?year=26-27), so no script.
const yearOf = (d) => taxYear(d.issued || (d.updated || '').slice(0, 10) || today());
const yearLabel = (y) => y.replace(':', '/');
const yearParam = (y) => y.replace(':', '-');

// The two halves of the admin: documents, and leads (leads.js). Each tab counts what is waiting
// inside it and turns blue when there is something: new leads, and documents whose row shows a
// blue next step (a draft to send, a signing to finish) or an overdue invoice.
export function adminNav(active, all, paths = { documents: '/admin/', leads: '/admin/leads/' }) {
  const fresh = all.filter((d) => d.type === 'lead' && !d.deleted && (d.status || 'new') === 'new').length;
  const todo = all.filter((d) => (d.type === 'quote' || d.type === 'invoice') && ['draft', 'unfinished', 'overdue'].includes(statusOf(d)[0])).length;
  const tab = (key, label, count, word) =>
    `<a href="${esc(paths[key])}"${active === key ? ' aria-current="page"' : ''}${count ? ' class="todo"' : ''}>${label}${count ? ` <b>(${count} ${word})</b>` : ''}</a>`;
  return `<nav class="views" aria-label="Admin sections">${tab('documents', 'Documents', todo, 'to do')}${tab('leads', 'Leads', fresh, 'new')}</nav>`;
}

// The foot of both admin pages: samples, signature, anything extra for that page, and Log out.
export function adminTools(extra = '') {
  return `<div class="tools">
    <div>
      <a class="ghost" href="/admin/samples/">Sample documents and emails</a>
      <a class="ghost" href="/admin/samples/signature/">Gmail signature</a>
      ${extra}
    </div>
    <button type="button" class="ghost" id="logout">Log out</button>
  </div>`;
}

// A signed quote and its payment stages, each matched to its invoice (by quoteToken and stageIndex,
// or the reference the quote keeps in state.invoices).
function projectOf(q, invoices) {
  const refs = q.state?.invoices || [];
  const linked = invoices.filter((x) => x.quoteToken === q.token);
  const stages = stageAmounts(q).map((st, i) => {
    const ref = refs.find((r) => Number(r.stage) === i);
    const inv = linked.find((x) => Number(x.stageIndex) === i) || (ref?.token ? invoices.find((x) => x.token === ref.token) : undefined);
    return { st, i, ref, inv };
  });
  const used = new Set(stages.map((s) => s.inv).filter(Boolean));
  const extra = linked.filter((x) => !used.has(x));
  const all = [...used, ...extra].filter((x) => !x.state?.withdrawnAt);
  const total = (list) => list.reduce((n, x) => n + invoiceTotals(x).total, 0);
  const paid = total(all.filter((x) => x.state?.status === 'paid'));
  const waiting = total(all.filter((x) => x.state?.sentAt && x.state?.status !== 'paid'));
  const complete = stages.length > 0 && stages.every((s) => s.inv?.state?.status === 'paid');
  return { q, stages, extra, paid, waiting, complete, value: quoteTotals(q).total };
}

const isPaid = (s) => s.inv?.state?.status === 'paid';

// One payment stage: what it is, how much, where it has got to, and its one next step. A stage can
// only be raised once every stage before it is paid; the menu keeps a way to raise it early.
function stageRow(p, s, base) {
  const { q, stages } = p;
  const head = `<div class="s-name">${esc(s.st.label)}, ${s.st.percent}%${s.st.due ? `<span>${esc(s.st.due)}</span>` : ''}</div>
    <div class="s-amt">${money(s.inv ? invoiceTotals(s.inv).total : s.st.gross)}</div>`;
  if (s.inv) {
    const [cls, label] = statusOf(s.inv);
    const done = cls === 'paid' || cls === 'withdrawn';
    return `<div class="pay${done ? ' done' : ''}">${head}
      <div class="c-status"><span class="pill ${cls}">${esc(label)}</span><span class="s-num">${esc(s.inv.number)}</span></div>
      ${actionCell(s.inv, base)}</div>`;
  }
  if (s.ref) {
    return `<div class="pay">${head}<div class="c-status"><span class="pill">Invoice ${esc(s.ref.number || 'raised')}</span></div><div class="c-act"></div></div>`;
  }
  const ready = q.state?.finalisedAt && stages.slice(0, s.i).every(isPaid);
  const first = stages.findIndex((x) => !x.inv && !x.ref) === s.i;
  const raise = (kind, label, extra = '') => btn(q, 'create-invoice', label, { kind, stage: s.i, extra: `data-wait="Creating the invoice draft…" ${extra}` });
  const act = ready && first
    ? raise(PRIMARY, 'Raise invoice')
    : q.state?.finalisedAt ? menu([raise('textbtn', 'Raise this invoice now', 'data-confirm="Earlier stages are unpaid. Press again"')]) : '';
  const waiting = ready && first ? 'Ready to raise' : s.i > 0 && !isPaid(stages[s.i - 1]) ? `After ${stages[s.i - 1].st.label.toLowerCase()} is paid` : 'Not raised';
  return `<div class="pay later">${head}<div class="c-status"><span class="pill${ready && first ? ' ready' : ''}">${esc(waiting)}</span></div><div class="c-act">${act}</div></div>`;
}

function projectCard(p, base) {
  const { q } = p;
  const [cls, label] = statusOf(q);
  const hourly = !p.stages.length;
  const extra = p.extra.map((inv) => {
    const [c, l] = statusOf(inv);
    return `<div class="pay${c === 'paid' ? ' done' : ''}"><div class="s-name">${esc(inv.lines?.[0]?.description || inv.title || 'Invoice')}</div><div class="s-amt">${money(invoiceTotals(inv).total)}</div>
      <div class="c-status"><span class="pill ${c}">${esc(l)}</span><span class="s-num">${esc(inv.number)}</span></div>${actionCell(inv, base)}</div>`;
  }).join('');
  const docs = [
    `<li><span>Quote ${esc(q.number)}</span>${openLink(linkOf(q, base), 'Open', 'textbtn')}${copyLink(linkOf(q, base))}</li>`,
    q.state?.signedAt ? `<li><span>Contract, signed ${esc(fmtDate(q.state.signedAt))}</span>${openLink(`${linkOf(q, base)}contract/`, 'Open', 'textbtn')}</li>` : '',
    ...[...p.stages.map((s) => s.inv).filter(Boolean), ...p.extra].map((inv) => `<li><span>Invoice ${esc(inv.number)}</span>${openLink(linkOf(inv, base), 'Open', 'textbtn')}${copyLink(linkOf(inv, base))}</li>`),
  ].join('');
  const finish = q.state?.signedAt && !q.state?.finalisedAt
    ? `<div class="proj-alert"><span class="pill ${cls}">${esc(label)}</span>${actionCell(q, base)}</div>` : '';
  return `<article class="proj${p.complete ? ' complete' : ''}">
    <header class="proj-head">
      <div><h3>${esc(q.client?.name || q.key || 'Client')}</h3><p>${esc(q.title || '')}</p><p class="to">${sendsTo(q)}</p></div>
      <div class="proj-val"><span>${hourly ? 'Estimate' : 'Project'}, inc. VAT</span>${money(p.value)}</div>
    </header>
    ${finish}
    ${hourly ? '<p class="proj-note">Hourly, invoiced monthly. Monthly invoices show under Other invoices.</p>' : `<div class="proj-progress">
      <progress max="${p.value}" value="${Math.min(p.paid, p.value)}" aria-label="Paid so far"></progress>
      <p><b>${money(p.paid)} of ${money(p.value)} paid</b>${p.waiting ? ` · ${money(p.waiting)} waiting` : ''}</p>
    </div>`}
    ${p.stages.length || extra ? `<div class="pays">${p.stages.map((s) => stageRow(p, s, base)).join('')}${extra}</div>` : ''}
    <details class="docs"><summary>Documents</summary><ul>${docs}</ul></details>
  </article>`;
}

// A quote not yet signed, or an invoice not tied to a quote: one line each.
function docRow(d, base) {
  const [cls, label] = statusOf(d);
  const amount = d.type === 'quote' ? quoteTotals(d).total : invoiceTotals(d).total;
  return `<div class="adm-row${cls === 'withdrawn' || cls === 'paid' ? ' done' : ''}">
    <div class="c-doc"><b>${esc(d.client?.name || d.key || '')}</b><span>${d.type === 'quote' ? 'Quote' : 'Invoice'} ${esc(d.number)}</span></div>
    <div class="c-proj">${esc(d.title || d.project || '')}${sendsTo(d)}</div>
    <div class="c-status"><span class="pill ${cls}">${esc(label)}</span></div>
    <div class="c-amt">${amount ? money(amount) : ''}</div>
    ${actionCell(d, base)}
  </div>`;
}

const byClient = (a, b) => (a.client?.name || a.key || '').localeCompare(b.client?.name || b.key || '', 'en-GB', { sensitivity: 'base' });

// The page follows the work: proposals still out, live projects with their payment stages, invoices
// not tied to a quote, then everything finished, folded away. Live work always shows in the current
// tax year, whichever year it started in; finished work sits in the year it was issued.
export function renderAdmin({ base, docs: all, error, year, view, path = '/admin/', paths }) {
  const docs = all.filter((d) => d.type === 'quote' || d.type === 'invoice');
  const thisYear = taxYear(today());
  const years = [...new Set([thisYear, ...docs.map(yearOf)])].sort().reverse();
  const current = years.includes(String(year || '').replace('-', ':')) ? String(year).replace('-', ':') : thisYear;
  const isNow = current === thisYear;
  const shows = (d, live) => yearOf(d) === current || (isNow && live);

  const quotes = docs.filter((d) => d.type === 'quote');
  const invoices = docs.filter((d) => d.type === 'invoice');
  const withdrawn = (d) => Boolean(d.state?.withdrawnAt);
  const expired = (q) => Boolean(q.validUntil && q.validUntil < today());

  const proposals = quotes.filter((q) => !q.state?.signedAt && !withdrawn(q) && shows(q, !expired(q))).sort(byClient);
  const projects = quotes.filter((q) => q.state?.signedAt).map((q) => projectOf(q, invoices));
  const active = projects.filter((p) => !p.complete && shows(p.q, true)).sort((a, b) => byClient(a.q, b.q));
  const complete = projects.filter((p) => p.complete && yearOf(p.q) === current).sort((a, b) => byClient(a.q, b.q));
  const signedTokens = new Set(projects.map((p) => p.q.token));
  const loose = invoices.filter((i) => !(i.quoteToken && signedTokens.has(i.quoteToken)));
  const unpaid = (i) => i.state?.sentAt && i.state?.status !== 'paid' && !withdrawn(i);
  const otherOpen = loose.filter((i) => !withdrawn(i) && i.state?.status !== 'paid' && shows(i, true)).sort(byClient);
  const closedInvoices = loose.filter((i) => (withdrawn(i) || i.state?.status === 'paid') && yearOf(i) === current).sort(byClient);
  const closedQuotes = quotes.filter((q) => !q.state?.signedAt && yearOf(q) === current && (withdrawn(q) || (expired(q) && !isNow))).sort(byClient);

  // Four figures that never overlap. Quotes count at their full value; invoices by what was sent.
  const qSum = (list) => list.reduce((n, q) => n + quoteTotals(q).total, 0);
  const iSum = (list) => list.reduce((n, i) => n + invoiceTotals(i).total, 0);
  const out = proposals.filter((q) => q.state?.sentAt && !expired(q));
  const signed = quotes.filter((q) => q.state?.signedAt && taxYear(q.state.signedAt.slice(0, 10)) === current);
  const waitingList = invoices.filter((i) => unpaid(i) && shows(i, true));
  const overdue = waitingList.filter((i) => i.due && i.due < today());
  const paidList = invoices.filter((i) => i.state?.status === 'paid' && !withdrawn(i) && taxYear(i.state.paidAt || i.issued || today()) === current);
  const totals = `<dl class="totals tiles">
    <div><dt>Out on quote</dt><dd>${money(qSum(out))}</dd><p>${out.length} ${out.length === 1 ? 'quote' : 'quotes'} sent, not signed</p></div>
    <div><dt>Signed work</dt><dd>${money(qSum(signed))}</dd><p>${signed.length} ${signed.length === 1 ? 'project' : 'projects'} signed${isNow ? ' this year' : ''}</p></div>
    <div class="${overdue.length ? 't-red' : waitingList.length ? 't-blue' : ''}"><dt>Waiting for payment</dt><dd>${money(iSum(waitingList))}</dd><p>${overdue.length ? `${money(iSum(overdue))} overdue` : `${waitingList.length} ${waitingList.length === 1 ? 'invoice' : 'invoices'} sent`}</p></div>
    <div><dt>Paid</dt><dd>${money(iSum(paidList))}</dd><p>${isNow ? 'This tax year, to 31 January' : `Tax year ${esc(yearLabel(current))}`}</p></div>
  </dl>
  <p class="fine">All figures include VAT.</p>`;
  const tabs = `<nav class="years" aria-label="Tax years">${years
    .map((y) => `<a href="${esc(path)}?year=${yearParam(y)}${view && view !== 'projects' ? `&amp;view=${esc(view)}` : ''}"${y === current ? ' aria-current="page"' : ''}>${esc(yearLabel(y))}${y === thisYear ? ' (this year)' : ''}</a>`)
    .join('')}</nav>`;

  // Projects, proposals and invoices are tabs (links, so no script), with live projects first. Each
  // tab folds its finished work away at the foot. A tab with something to do says so.
  const todo = (list) => list.filter((d) => ['draft', 'unfinished', 'overdue'].includes(statusOf(d)[0])).length;
  const projectDocs = active.flatMap((p) => [p.q, ...p.stages.map((x) => x.inv).filter(Boolean), ...p.extra]);
  const TABS = [
    { key: 'projects', label: 'Projects', count: active.length, todo: todo(projectDocs) },
    { key: 'proposals', label: 'Proposals', count: proposals.length, todo: todo(proposals) },
    { key: 'invoices', label: 'Invoices', count: otherOpen.length, todo: todo(otherOpen) },
  ];
  const tab = TABS.some((t) => t.key === view) ? view : 'projects';
  const yearQ = current === thisYear ? '' : `year=${yearParam(current)}`;
  const hrefFor = (key) => {
    const q = [yearQ, key === 'projects' ? '' : `view=${key}`].filter(Boolean).join('&amp;');
    return `${esc(path)}${q ? `?${q}` : ''}`;
  };
  const viewTabs = `<nav class="doc-tabs" aria-label="Documents">${TABS
    .map((t) => `<a href="${hrefFor(t.key)}"${t.key === tab ? ' aria-current="page"' : ''}${t.todo ? ' class="has-todo"' : ''}>${t.label} <span>${t.count}</span>${t.todo ? ` <b>(${t.todo} to do)</b>` : ''}</a>`)
    .join('')}</nav>`;
  const fold = (title, n, inner) => (n ? `<details class="closed"><summary><h2>${esc(title)} <span>${n}</span></h2></summary>${inner}</details>` : '');
  const rowsOf = (list) => `<div class="rows">${list.map((d) => docRow(d, base)).join('')}</div>`;
  const empty = (text) => `<p class="empty">${esc(text)}</p>`;
  let panel;
  if (tab === 'projects') {
    panel = (active.length ? `<div class="projs">${active.map((p) => projectCard(p, base)).join('')}</div>` : empty('No live projects. Signed quotes show here with their payment stages.'))
      + fold('Complete', complete.length, `<div class="projs">${complete.map((p) => projectCard(p, base)).join('')}</div>`);
  } else if (tab === 'proposals') {
    panel = '<p class="sec-note">Not signed yet, so not counted as work.</p>'
      + (proposals.length ? rowsOf(proposals) : empty('No proposals out.'))
      + fold('Withdrawn and expired', closedQuotes.length, rowsOf(closedQuotes));
  } else {
    panel = '<p class="sec-note">Invoices not tied to a quote, such as monthly support. Project invoices sit with their project.</p>'
      + (otherOpen.length ? rowsOf(otherOpen) : empty('No open invoices outside projects.'))
      + fold('Paid and withdrawn', closedInvoices.length, rowsOf(closedInvoices));
  }

  const body = `
  ${masthead('Documents', 'Admin')}
  ${adminNav('documents', all, paths)}
  <div>
    <h1>${eyebrow('Anthony is Freelance')}Quotes, contracts and invoices</h1>
    ${tabs}
  </div>
  <div id="msg" class="status" role="status" ${error ? '' : 'hidden'}>${esc(error || '')}</div>
  <div>${totals}${viewTabs}</div>
  <div class="adm panel">${panel}</div>
  ${adminTools()}
  `;
  return shell({ title: 'Documents admin', base, body, css: ADMIN_CSS + DASH_CSS, script: ADMIN_SCRIPT + MENU_SCRIPT + COPY_SCRIPT });
}
