// Leads: every enquiry in one list at docs.anthonyis.uk/admin/leads/, so nothing slips.
//
// A lead is made when someone sends the contact form (worker/enquiry.js), or by hand here for
// enquiries that arrive by email, LinkedIn or a referral. Each is one JSON file in the Drive data
// folder (type "lead"), like the documents. Replies still go from Gmail: this page only tracks
// where each lead has got to (New, Replied, Call booked, Quoted, Won, Not a fit) and holds a note.
//
// Privacy: the notice on anthonyis.uk says enquiries that don't become projects are deleted after
// two years, so they are (expired() below, run each time the page opens). Deleting a lead here
// removes its details straight away. The "news list" is simply the leads who ticked the box on the
// form; the wording they agreed to and when is kept with the lead as the record of consent.

import { esc, fmtDate, eyebrow, masthead, shell, COPY_SCRIPT } from './shared.js';
import { ADMIN_CSS, ADMIN_SCRIPT, adminNav, adminTools } from './admin.js';

// Keep in step with the label beside the box in src/components/ProjectForm.astro.
export const NEWS_WORDING = 'Send me occasional news, a few emails a year.';

export const LEAD_STATUSES = [
  ['new', 'New'],
  ['replied', 'Replied'],
  ['call', 'Call booked'],
  ['quoted', 'Quoted'],
  ['won', 'Won'],
  ['lost', 'Not a fit'],
];
const LABEL = Object.fromEntries(LEAD_STATUSES);
// The one next step for each status (the blue button), in the order a lead usually moves.
const NEXT = { new: ['replied', 'Mark replied'], replied: ['call', 'Call booked'], call: ['quoted', 'Quoted'], quoted: ['won', 'Won'] };
// Same colour logic as the documents: red needs you, blue is in progress, black is complete, grey is closed.
const PILL = { new: 'overdue', replied: 'sent', call: 'sent', quoted: 'sent', won: 'signed', lost: 'withdrawn' };
export const SOURCES = ['Email', 'LinkedIn', 'Referral', 'Phone', 'Other'];

const clip = (v, n) => String(v ?? '').trim().slice(0, n);

export function newLead({ token, source = 'Website form', name, email, website, budget, message, found, page, news }) {
  const now = new Date().toISOString();
  return {
    type: 'lead',
    token,
    created: now,
    source: clip(source, 40),
    name: clip(name, 120),
    email: clip(email, 200),
    website: clip(website, 300),
    budget: clip(budget, 60),
    message: clip(message, 5000),
    found: clip(found, 80),
    page: clip(page, 300),
    status: 'new',
    statusAt: now,
    news: news ? { at: now, wording: NEWS_WORDING } : null,
    note: '',
  };
}

// The file's name in Drive, so a lead is recognisable there too.
export const leadFileName = (l) => `Lead_${l.created.slice(0, 10)}_${(l.name || 'Unknown').replace(/[^\p{L}\p{N}]+/gu, '') || 'Unknown'}`.slice(0, 80);

export const isLead = (d) => d && d.type === 'lead' && !d.deleted;

// Past its keep-by date: two years for enquiries that didn't become projects, six for clients
// (the same periods as the privacy notice).
const YEAR = 365.25 * 24 * 3600 * 1000;
export function expired(l, now = Date.now()) {
  const made = Date.parse(l.created || '');
  if (!made) return false;
  return now - made > (l.status === 'won' ? 6 : 2) * YEAR;
}

const LEADS_CSS = `
.leads .c-proj { overflow-wrap: anywhere; }
.c-proj span { display: block; color: var(--muted); }
.leads .c-amt { font-size: 14px; line-height: 1.3; letter-spacing: 0.02em; }
.lead { display: flex; flex-direction: column; }
.lead-more { padding: 0 0 12px; }
.lead-more summary { display: inline-block; cursor: pointer; font: 500 11px/1 var(--display); letter-spacing: 0.02em; color: var(--muted); list-style: none; }
.lead-more summary::-webkit-details-marker { display: none; }
.lead-more summary::before { content: "+ "; }
.lead-more[open] summary::before { content: "- "; }
.lead-more summary:hover { color: var(--ink); }
.lead-body { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 24px 40px; margin-top: 12px; padding: 16px; background: var(--box); }
.lead-msg { white-space: pre-wrap; overflow-wrap: anywhere; }
.lead-body table.kv th { width: 130px; }
.lead-side { display: flex; flex-direction: column; gap: 16px; }
.lead-set { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.lead-set > span, .lead-form label > span { font: 500 14px/1.3 var(--display); letter-spacing: 0.02em; color: var(--muted); }
.lead-form { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px 16px; margin-top: 16px; }
.lead-form label { display: flex; flex-direction: column; gap: 4px; }
.lead-form .wide { grid-column: 1 / -1; }
.lead-form input, .lead-form select, .lead-form textarea, .lead-note textarea { width: 100%; padding: 10px 12px; border: 1px solid var(--line); border-radius: 0; background: var(--paper); color: var(--ink); font: 500 14px/1.3 var(--display); }
.lead-form textarea, .lead-note textarea { min-height: 72px; resize: vertical; }
.lead-form .btn { width: auto; min-width: 200px; }
.lead-note { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.lead-add > summary { list-style: none; cursor: pointer; }
.lead-add > summary::-webkit-details-marker { display: none; }
@media (max-width: 900px) {
  .lead-body, .lead-form { grid-template-columns: 1fr; }
}
`;

const LEADS_SCRIPT = `
(function () {
  var msg = document.getElementById('msg');
  function say(t, err) { if (!msg) return; msg.hidden = false; msg.className = 'status' + (err ? ' error' : ''); msg.textContent = t; window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function post(body) {
    return fetch('/admin/action', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), credentials: 'same-origin' })
      .then(function (r) { return r.json().catch(function () { return { ok: false, error: 'Something went wrong.' }; }); })
      .then(function (r) { if (!r.ok) return say(r.error, true); say(r.message || 'Done.'); setTimeout(function () { location.reload(); }, 900); });
  }
  document.querySelectorAll('[data-lead-note]').forEach(function (b) {
    b.addEventListener('click', function () {
      b.disabled = true;
      post({ action: 'lead-note', token: b.getAttribute('data-lead-note'), value: b.parentNode.querySelector('textarea').value });
    });
  });
  var form = document.getElementById('lead-add');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var lead = {}; new FormData(form).forEach(function (v, k) { lead[k] = v; });
    form.querySelector('button').disabled = true;
    post({ action: 'lead-add', token: form.getAttribute('data-token') || '', lead: lead });
  });
})();
`;

const host = (w) => String(w || '').replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/.*$/, '');

function row(l, quotes, sample) {
  const status = LABEL[l.status] ? l.status : 'new';
  const closed = status === 'won' || status === 'lost';
  const btn = (action, label, extra = '', kind = 'ghost small') =>
    `<button type="button" class="${kind}" data-action="${action}" data-token="${esc(l.token)}" data-label="${esc(label)}" ${extra}>${esc(label)}</button>`;
  const setTo = (value, label, kind) => btn('lead-status', label, `data-value="${value}" data-wait="Saving…"`, kind);

  const a = [];
  if (l.email) a.push(`<a class="ghost small" href="mailto:${esc(encodeURIComponent(l.email).replace(/%40/g, '@'))}?subject=${esc(encodeURIComponent('Your enquiry'))}">Reply</a>`);
  if (NEXT[status]) a.push(setTo(NEXT[status][0], NEXT[status][1], 'ghost small primary'));
  if (closed) a.push(setTo('replied', 'Reopen'));
  // A quote already written for the same person, matched on their email address.
  const quote = l.email && quotes.find((q) => (q.client?.contact?.email || '').toLowerCase() === l.email.toLowerCase());
  if (quote) a.push(`<a class="ghost small" href="/quote/${esc(quote.token)}/" target="_blank" rel="noopener">Open quote</a>`);
  if (!closed) a.push(setTo('lost', 'Not a fit', 'textbtn'));
  a.push(btn('lead-delete', 'Delete', 'data-confirm="Sure? Press again" data-wait="Deleting…"', 'textbtn'));

  const facts = [
    ['Email', l.email],
    ['Website', l.website],
    ['Budget', l.budget],
    ['Found me through', l.found],
    ['Sent from', l.page],
    ['Came in by', l.source],
    ['News list', l.news ? `Yes, ticked ${fmtDate(l.news.at)}` : 'No'],
  ].filter(([, v]) => v);

  return `<div class="lead">
    <div class="adm-row${closed ? ' done' : ''}">
      <div class="c-doc"><span>${esc(fmtDate(l.created))}</span>${esc(l.name || 'No name')}</div>
      <div class="c-proj">${esc(host(l.website) || 'No website given')}<span>${esc(l.email)}</span></div>
      <div class="c-status"><span class="pill ${PILL[status]}">${esc(status === 'new' ? 'New' : `${LABEL[status]} ${fmtDate(l.statusAt || l.created)}`)}</span></div>
      <div class="c-amt">${esc(l.budget || '')}</div>
      <div class="c-act">${a.join('')}</div>
    </div>
    <details class="lead-more">
      <summary>Message and details</summary>
      <div class="lead-body">
        <div>
          <p class="lead-msg">${esc(l.message || 'No message.')}</p>
        </div>
        <div class="lead-side">
          <table class="kv"><tbody>${facts.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table>
          <div class="lead-set"><span>Set status</span>${LEAD_STATUSES.filter(([k]) => k !== status).map(([k, label]) => setTo(k, label)).join('')}</div>
          <div class="lead-note">
            <textarea aria-label="Note on ${esc(l.name)}" maxlength="1000" placeholder="A note for yourself, for example where this lead went">${esc(l.note || '')}</textarea>
            <button type="button" class="ghost small" data-lead-note="${esc(l.token)}">Save note</button>
          </div>
          ${l.news ? `<div>${btn('lead-news-off', 'Remove from the news list', 'data-confirm="Sure? Press again" data-wait="Removing…"', 'textbtn')}</div>` : ''}
        </div>
      </div>
    </details>
  </div>`;
}

export function renderLeads({ base, docs, error, sample = false, paths }) {
  const leads = docs.filter(isLead).sort((a, b) => (b.created || '').localeCompare(a.created || ''));
  const quotes = docs.filter((d) => d.type === 'quote');
  const of = (...s) => leads.filter((l) => s.includes(LABEL[l.status] ? l.status : 'new'));
  const groups = [
    ['Needs a reply', of('new')],
    ['In progress', of('replied', 'call', 'quoted')],
    ['Closed', of('won', 'lost')],
  ].filter(([, list]) => list.length);
  const news = leads.filter((l) => l.news && l.email);

  const totals = `<dl class="totals">
    <div${of('new').length ? ' class="t-red"' : ''}><dt>Need a reply</dt><dd>${of('new').length}</dd></div>
    <div class="t-blue"><dt>In progress</dt><dd>${of('replied', 'call', 'quoted').length}</dd></div>
    <div><dt>Won</dt><dd>${of('won').length}</dd></div>
    <div><dt>On the news list</dt><dd>${news.length}</dd></div>
  </dl>`;

  const add = `<details class="lead-add">
    <summary><span class="ghost">Add a lead</span></summary>
    <form class="lead-form" id="lead-add" ${sample ? 'data-token="SAMPLEadd"' : ''}>
      <label><span>Name</span><input name="name" required maxlength="120" autocomplete="off"></label>
      <label><span>Email</span><input name="email" type="email" maxlength="200" autocomplete="off"></label>
      <label><span>Website</span><input name="website" maxlength="300" autocomplete="off"></label>
      <label><span>Budget</span><input name="budget" maxlength="60" autocomplete="off"></label>
      <label><span>Came in by</span><select name="source">${SOURCES.map((s) => `<option>${esc(s)}</option>`).join('')}</select></label>
      <label class="wide"><span>What they asked for</span><textarea name="message" maxlength="5000"></textarea></label>
      <div class="wide"><button type="submit" class="btn">Add lead</button></div>
    </form>
  </details>`;

  const list = leads.length
    ? `<div class="adm leads">
        <div class="adm-head"><div class="c-doc">Lead</div><div class="c-proj">From</div><div class="c-status">Status</div><div class="c-amt">Budget</div><div class="c-act">Actions</div></div>
        ${groups.map(([name, items]) => `<section class="adm-client"><h2>${esc(name)}</h2>${items.map((l) => row(l, quotes, sample)).join('')}</section>`).join('')}
      </div>`
    : '<p class="empty">No leads yet. Enquiries from the contact form appear here, and you can add others by hand.</p>';

  const body = `
  ${masthead('Leads', 'Admin')}
  ${adminNav('leads', docs, paths)}
  <h1>${eyebrow('Anthony is Freelance')}Leads</h1>
  <div id="msg" class="status" role="status" ${error ? '' : 'hidden'}>${esc(error || '')}</div>
  ${totals}
  ${add}
  ${list}
  ${adminTools(news.length ? `<button type="button" class="ghost" data-copy="${esc(news.map((l) => l.email).join(', '))}">Copy news list emails</button>` : '')}
  `;
  return shell({ title: 'Leads', base, body, css: ADMIN_CSS + LEADS_CSS, script: ADMIN_SCRIPT + LEADS_SCRIPT + COPY_SCRIPT });
}

// What the admin page can do to a lead. Returns { message } or { error }, and the changed lead
// to save (or `remove: true`).
export function leadAction(lead, action, value) {
  const now = new Date().toISOString();
  switch (action) {
    case 'lead-status': {
      if (!LABEL[value]) return { error: 'That status is not one of the options.' };
      return { lead: { ...lead, status: value, statusAt: now }, message: `${lead.name || 'Lead'} moved to ${LABEL[value]}.` };
    }
    case 'lead-note':
      return { lead: { ...lead, note: clip(value, 1000) }, message: 'Note saved.' };
    case 'lead-news-off':
      return { lead: { ...lead, news: null }, message: `${lead.name || 'Lead'} removed from the news list.` };
    case 'lead-delete':
      return { remove: true, message: `${lead.name || 'Lead'} deleted.` };
    default:
      return { error: 'That action does not apply to a lead.' };
  }
}
