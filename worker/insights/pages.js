// The insights admin pages: login, the brands list, a brand's settings and prompt list, and the
// brand page with its tabs. Built from the docs admin's styles and components
// (worker/docs/admin.js); the few extra styles are in PAGE_CSS and DASH_STYLES.

import { esc, fmtDate, fmtDateTime, masthead, eyebrow, shell, topBar, backLink } from '../docs/shared.js';
import { ADMIN_CSS, DASH_CSS, ADMIN_SCRIPT } from '../docs/admin.js';
import { DASH_STYLES } from './dashboard.js';
import { formatPromptList } from './prompts.js';
import { GA4_CSS } from './ga4view.js';
import { COMPETITOR_CSS } from './competitors.js';
import { OVERVIEW_CSS } from './overview.js';

export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const TABS = [
  ['overview', 'Overview'],
  ['', 'AI visibility'],
  ['competitors', 'Competitors'],
  ['ga4', 'GA4'],
  ['reports', 'Reports'],
  ['schedule', 'Schedule'],
];

const PAGE_CSS = `
.engine-switch { display: flex; gap: 8px; margin: 24px 0 0; }
.engine-switch a { padding: 8px 14px; border: 1px solid var(--line, #d9d9d9); color: var(--ink); text-decoration: none; font: 500 14px/1.2 var(--display); text-transform: uppercase; letter-spacing: 0.02em; }
.engine-switch a[aria-current] { background: var(--ink); border-color: var(--ink); color: #fff; }
.engine-switch a:hover:not([aria-current]), .engine-switch a:focus-visible { border-color: var(--blue); }
.sheet > .doc-tabs { margin-top: 32px; }
.brand-list .c-name a { color: var(--ink); }
.c-name { flex: 0 0 260px; min-width: 0; }
.c-name b { display: block; font-weight: 500; font-size: 18px; text-transform: uppercase; }
.c-name span, .c-meta span { display: block; font-size: 12px; color: var(--muted); }
.c-meta { flex: 1 1 0; min-width: 0; }
.form { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 24px; }
.form label { display: flex; flex-direction: column; gap: 4px; }
.form label > span { font: 500 14px/1.3 var(--display); letter-spacing: 0.02em; color: var(--muted); }
.form label > small { font: 400 13px/1.4 var(--serif); color: var(--muted); }
.form .wide { grid-column: 1 / -1; }
.form .check { flex-direction: row; align-items: center; gap: 8px; }
.form input, .form select, .form textarea { width: 100%; padding: 10px 12px; border: 1px solid var(--line); border-radius: 0; background: var(--paper); color: var(--ink); font: 500 14px/1.3 var(--display); }
.form .check input { width: auto; }
.form textarea { min-height: 96px; resize: vertical; font: 400 14px/1.5 var(--serif); }
.form textarea.tall { min-height: 520px; font: 500 13px/1.6 var(--display); }
.form input:focus, .form select:focus, .form textarea:focus { outline: 2px solid var(--blue); outline-offset: -1px; border-color: var(--blue); }
.form .btn { width: auto; min-width: 220px; }
.run-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 16px; padding: 16px; background: var(--box); }
.run-bar .grow { flex: 1 1 260px; font: 500 14px/1.4 var(--display); }
.run-bar .grow > span { display: block; font-size: 12px; color: var(--muted); }
.run-bar .pill-line { margin-top: 6px; }
.form.compare { grid-template-columns: 1fr 1fr auto; align-items: end; }
.form.compare .btn { min-width: 160px; }
.run-bar > a.ghost { text-decoration: none; }
.run-bar .meter { margin-top: 8px; height: 8px; background: var(--paper); }
.placeholder { padding: 24px; background: var(--box); }
.placeholder p + p { margin-top: 1em; }
@media (max-width: 900px) {
  .form, .form.compare { grid-template-columns: 1fr; }
  .c-name { flex: none; }
}
`;

// Forms and the progress poller. Small and dependency-free, like the docs admin script.
export const INSIGHTS_SCRIPT = `
(function () {
  function post(body) {
    return fetch('/admin/action', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), credentials: 'same-origin' })
      .then(function (r) { return r.json().catch(function () { return { ok: false, error: 'Something went wrong.' }; }); })
      .catch(function () { return { ok: false, error: 'Could not reach the server. Check your connection and try again.' }; });
  }
  document.querySelectorAll('form[data-save]').forEach(function (f) {
    var out = f.querySelector('.status');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = {};
      f.querySelectorAll('input, select, textarea').forEach(function (el) { if (el.name) fields[el.name] = el.type === 'checkbox' ? el.checked : el.value; });
      var b = f.querySelector('button[type=submit]'); if (b) b.disabled = true;
      out.hidden = false; out.className = 'status'; out.textContent = 'Saving…';
      post({ action: f.getAttribute('data-save'), token: f.getAttribute('data-token') || '', fields: fields }).then(function (r) {
        if (b) b.disabled = false;
        out.className = 'status' + (r.ok ? '' : ' error'); out.textContent = r.ok ? (r.message || 'Saved.') : (r.error || 'Something went wrong.');
        if (r.ok && r.go) location.href = r.go;
      });
    });
  });
  // A link to something inside a closed "Show the detail" opens it first.
  function reveal() {
    var id = location.hash.slice(1);
    var t = id && document.getElementById(id);
    if (!t) return;
    var d = t.closest('details');
    if (d && !d.open) { d.open = true; t.scrollIntoView(); }
  }
  window.addEventListener('hashchange', reveal);
  reveal();
  document.querySelectorAll('[data-toggle]').forEach(function (b) {
    var t = document.getElementById(b.getAttribute('data-toggle'));
    if (!t) return;
    b.addEventListener('click', function () {
      var opening = t.hidden;
      t.hidden = !opening;
      b.setAttribute('aria-expanded', opening ? 'true' : 'false');
      b.textContent = opening ? b.getAttribute('data-close') : b.getAttribute('data-open');
      if (opening) { var f = t.querySelector('select, input'); if (f) f.focus(); }
    });
  });
  var p = document.getElementById('progress');
  if (p) {
    var run = p.getAttribute('data-run'), text = p.querySelector('[data-text]'), meter = p.querySelector('.meter > span'), busy = false;
    function step() {
      if (busy || document.hidden) return;
      busy = true;
      post({ action: 'run-step', token: run }).then(function (r) {
        busy = false;
        if (!r.ok || !r.progress) return;
        var g = r.progress;
        text.textContent = g.label;
        if (meter) meter.style.width = g.percent + '%';
        if (g.status === 'complete') { clearInterval(timer); setTimeout(function () { location.reload(); }, 800); }
      });
    }
    var timer = setInterval(step, 8000);
    setTimeout(step, 1500);
  }
})();
`;

const CSS = ADMIN_CSS + DASH_CSS + DASH_STYLES + PAGE_CSS + GA4_CSS + COMPETITOR_CSS + OVERVIEW_CSS;

export function insightsShell({ base, title, body, bar = '' }) {
  return shell({ title, base, body, css: CSS, script: ADMIN_SCRIPT + INSIGHTS_SCRIPT, bar });
}

const tools = (extra = '') => `<div class="tools">
    <div><a class="ghost" href="/admin/samples/">Samples</a>${extra}</div>
    <button type="button" class="ghost" id="logout">Log out</button>
  </div>`;

export function loginPage({ base, to }) {
  const body = `
  ${masthead('Insights', 'Admin')}
  <h1>${eyebrow('Anthony is Freelance')}Insights</h1>
  <div class="login">
    <p>A login code goes to <b>${esc(to)}</b>.</p>
    <button type="button" class="btn" id="send-code">Email me a code</button>
    <div id="code-step" hidden>
      <input id="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000" aria-label="Login code">
      <p style="margin-top:12px"><button type="button" class="btn" id="verify">Log in</button></p>
    </div>
    <div id="msg" class="status" role="status" hidden></div>
  </div>`;
  return insightsShell({ base, title: 'Insights admin', body });
}

export function brandsPage({ base, brands, sample = false }) {
  const rows = brands
    .map((b) => `<div class="adm-row">
      <div class="c-name"><a href="${esc(b.href || `/admin/brands/${b.slug}/overview/`)}"><b>${esc(b.name)}</b></a><span>${esc((b.match_domains || []).join(', '))}</span></div>
      <div class="c-meta">${b.prompt_count} prompts, each asked ${b.asks_per_week} times a week<span>${b.last_run ? `Last run ${esc(fmtDateTime(b.last_run))}` : 'No runs yet'} · weekly on ${esc(WEEKDAYS[b.run_weekday] || '')}s</span></div>
      <div class="c-act"><a class="ghost small primary" href="${esc(b.href || `/admin/brands/${b.slug}/overview/`)}">Open</a><a class="ghost small" href="${esc(b.settingsHref || `/admin/brands/${b.slug}/settings/`)}">Settings</a></div>
    </div>`)
    .join('');
  const body = `
  ${masthead('Insights', 'Admin')}
  <h1>${eyebrow('Anthony is Freelance')}Brands</h1>
  <div class="adm brand-list"><div>${rows || '<p class="empty">No brands yet. Add the first one.</p>'}</div></div>
  <p><a class="ghost primary" href="${sample ? '#' : '/admin/brands/new/'}">Add a brand</a></p>
  ${sample ? '' : tools()}`;
  return insightsShell({ base, title: 'Insights: brands', body });
}

const field = (label, input, { wide = false, hint = '' } = {}) => `<label${wide ? ' class="wide"' : ''}><span>${esc(label)}</span>${input}${hint ? `<small>${esc(hint)}</small>` : ''}</label>`;
const lines = (list) => esc((list || []).join('\n'));

export function brandSettings({ base, brand, prompts = [], isNew = false, sample = false, back = null }) {
  const b = brand || { name: '', slug: '', match_names: [], match_domains: [], facts: '', flags: [], launch_date: '', ga4_property: '', gsc_site: '', ga4_goal: '', uk_only: 0, asks_per_week: 3, run_weekday: 1, groups: {} };
  const flagText = (b.flags || []).map((f) => `${f.label}${f.description ? `: ${f.description}` : ''}`).join('\n');
  const token = isNew ? '' : b.slug;
  const settings = `<form class="form" data-save="${isNew ? 'brand-add' : 'brand-save'}" data-token="${esc(token)}">
    ${field('Brand name', `<input name="name" required maxlength="120" value="${esc(b.name)}">`)}
    ${isNew ? field('Short name for links', `<input name="slug" maxlength="40" pattern="[a-z0-9-]+" placeholder="for-example-this" value="">`, { hint: 'Lower case letters, numbers and hyphens. Made from the name if left empty.' }) : field('Short name for links', `<input value="${esc(b.slug)}" disabled>`)}
    ${field('Names to look for', `<textarea name="match_names" maxlength="2000">${lines(b.match_names)}</textarea>`, { hint: 'One per line, for example the business name and the founder. The brand name is always included. Case does not matter.' })}
    ${field('Domains to look for', `<textarea name="match_domains" maxlength="2000">${lines(b.match_domains)}</textarea>`, { hint: 'One per line, for example example.co.uk. Subdomains count too.' })}
    ${field('Facts note', `<textarea name="facts" maxlength="4000">${esc(b.facts)}</textarea>`, { wide: true, hint: 'A few lines the scorer checks answers against for wrong facts: what the brand does and doesn\'t do, prices, current page addresses.' })}
    ${field('Framing flags', `<textarea name="flags" maxlength="4000">${esc(flagText)}</textarea>`, { wide: true, hint: 'One per line, as "Label: what to look for". For example "Price steering: points the reader to cheaper options".' })}
    ${field('Launch date', `<input name="launch_date" type="date" value="${esc(b.launch_date || '')}">`, { hint: 'Optional. Marked on every chart.' })}
    ${field('GA4 property', `<input name="ga4_property" inputmode="numeric" maxlength="20" value="${esc(b.ga4_property || '')}">`, { hint: 'Optional. The property number, for the GA4 audit.' })}
    ${field('Search Console property', `<input name="gsc_site" maxlength="200" placeholder="sc-domain:example.com" value="${esc(b.gsc_site || '')}">`, { hint: 'Optional. A domain property (sc-domain:example.com) or a URL prefix (https://www.example.com/). Read alongside GA4.' })}
    ${field('GA4 lead event', `<input name="ga4_goal" maxlength="40" placeholder="generate_lead" value="${esc(b.ga4_goal || '')}">`, { hint: 'Leave empty for a shop: the audit counts purchases. For a site that takes enquiries, the key event to count as a lead.' })}
    ${field('Times each prompt is asked a week', `<input name="asks_per_week" type="number" min="1" max="10" value="${Number(b.asks_per_week) || 3}">`)}
    ${field('Weekly run day', `<select name="run_weekday">${WEEKDAYS.map((d, i) => `<option value="${i}"${Number(b.run_weekday) === i ? ' selected' : ''}>${d}</option>`).join('')}</select>`, { hint: 'The run starts from 6am UK time that day.' })}
    <label class="check wide"><input type="checkbox" name="uk_only"${b.uk_only ? ' checked' : ''}> <span>GA4: UK visitors only</span></label>
    ${isNew ? '' : `<label class="check wide"><input type="checkbox" name="active"${b.active ? ' checked' : ''}> <span>Weekly run switched on</span></label>`}
    <div class="wide"><button type="submit" class="btn">${isNew ? 'Add brand' : 'Save settings'}</button></div>
    <p class="status wide" role="status" hidden></p>
  </form>`;
  const promptForm = isNew
    ? ''
    : `<section class="sec full"><h2>Prompt list</h2>
    <p class="sec-note">Paste or edit the list in groups. A group line is a capital letter and a full stop, then its name ("A. Recommendation, no modifier"). Each prompt is numbered. Groups A and B are compared on the dashboard. Prompts keep their history while their wording stays the same.</p>
    <form class="form" data-save="prompts-save" data-token="${esc(token)}">
      <label class="wide"><span>${prompts.length} prompts</span><textarea class="tall" name="list" maxlength="40000" spellcheck="false" placeholder="A. Recommendation, no modifier&#10;1. Who is the best … in the UK?&#10;&#10;B. Same question with freelance or independent&#10;2. Best freelance … UK">${esc(formatPromptList(b.groups || {}, prompts))}</textarea></label>
      <div class="wide"><button type="submit" class="btn">Save prompt list</button></div>
      <p class="status wide" role="status" hidden></p>
    </form></section>`;
  const body = `
  ${masthead('Insights', isNew ? 'New brand' : b.name)}
  <h1>${eyebrow(isNew ? 'Add a brand' : 'Settings')}${esc(isNew ? 'New brand' : b.name)}</h1>
  <section class="sec full"><h2>Brand</h2>${settings}</section>
  ${promptForm}
  ${sample ? '' : tools()}`;
  const bar = topBar(backLink(back || (isNew ? '/admin/' : `/admin/brands/${b.slug}/`), isNew ? 'Brands' : b.name));
  return insightsShell({ base, title: isNew ? 'New brand' : `${b.name}: settings`, body, bar });
}

export function tabsNav(brand, active, href = (k) => `/admin/brands/${brand.slug}/${k ? `${k}/` : ''}`) {
  return `<nav class="doc-tabs" aria-label="${esc(brand.name)}">${TABS.map(([k, label]) => `<a href="${esc(href(k))}"${active === k ? ' aria-current="page"' : ''}>${esc(label)}</a>`).join('')}</nav>`;
}

export function brandShell({ base, brand, active, content, sample = false, href, settingsHref }) {
  const body = `
  ${masthead('Insights', brand.name)}
  <h1>${eyebrow(TABS.find(([k]) => k === active)?.[1] || 'Brand')}${esc(brand.name)}</h1>
  ${tabsNav(brand, active, href)}
  ${content}
  ${sample ? '' : tools(`<a class="ghost" href="${esc(settingsHref || `/admin/brands/${brand.slug}/settings/`)}">Brand settings and prompts</a>`)}`;
  const bar = topBar(`${backLink(sample ? '/admin/samples/' : '/admin/', sample ? 'Samples' : 'Brands')}<a href="${esc(settingsHref || `/admin/brands/${brand.slug}/settings/`)}">Settings</a>`);
  return insightsShell({ base, title: `${brand.name}: insights`, body, bar });
}

// The three tabs that fill up in later phases.
export function placeholderTab(kind, brand) {
  if (kind === 'reports') {
    return `<div class="placeholder"><p>Reports arrive in phase 2: any run or comparison as an A4 sheet at a private link, with a PDF. Drafts, approved and sent reports will be listed here, each with a Withdraw button.</p></div>`;
  }
  return '';
}

export function scheduleTab(brand, { nextRun }) {
  return `<section class="sec full"><h2>Weekly run</h2>
    <table class="kv"><tbody>
      <tr><th>Status</th><td>${brand.active ? 'On' : 'Off (switch it on in Settings)'}</td></tr>
      <tr><th>When</th><td>Every ${esc(WEEKDAYS[brand.run_weekday] || '')}, from 6am UK time</td></tr>
      <tr><th>Each prompt asked</th><td>${Number(brand.asks_per_week) || 3} times</td></tr>
      ${brand.active && nextRun ? `<tr><th>Next run</th><td>${esc(fmtDate(nextRun, 'long'))}</td></tr>` : ''}
    </tbody></table>
    <p class="note">Dated runs with draft reports (a baseline, then 30 and 90 days after launch) arrive in phase 4.</p>
  </section>`;
}
