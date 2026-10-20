// Test-site comment tool. Loaded only when feedback mode is on (see the loader in
// Base.astro) and never on anthonyis.uk. Click "Comment", click any element, type,
// post. Each comment becomes a GitHub issue via /api/feedback (worker/index.js).
(function () {
  if (/(^|\.)anthonyis\.uk$/.test(location.hostname) || window.__aifFeedback) return;
  window.__aifFeedback = true;

  const ON = 'aif-fb';
  const KEY = 'aif-fb-key';
  const store = {
    get: (k) => { try { return localStorage.getItem(k) || ''; } catch { return ''; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch {} },
    del: (k) => { try { localStorage.removeItem(k); } catch {} },
  };

  // ?feedback=<key> switches the tool on and remembers the key. The key is then
  // stripped from the address bar so it doesn't end up in screenshots.
  const params = new URLSearchParams(location.search);
  const given = params.get('feedback');
  store.set(ON, '1');
  if (given && !/^(1|on|true)$/i.test(given)) store.set(KEY, given);
  if (params.has('feedback')) {
    params.delete('feedback');
    const qs = params.toString();
    history.replaceState(history.state, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
  }

  // ---------------------------------------------------------------- UI shell
  const host = document.createElement('div');
  host.id = 'aif-feedback';
  host.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2147483647;';
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `
<style>
  :host { all: initial; }
  * { box-sizing: border-box; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; }
  button { font: inherit; cursor: pointer; }
  .box { position: fixed; pointer-events: none; border: 2px dashed #FCE233; background: rgba(252,226,51,.08); border-radius: 2px; display: none; }
  .box.sel { border-style: solid; background: rgba(252,226,51,.14); }
  .tag { position: absolute; left: -2px; top: -22px; background: #FCE233; color: #111; font-size: 11px; line-height: 1; padding: 4px 6px; white-space: nowrap; }
  .bar { position: fixed; right: 12px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 4px; padding: 4px; background: #111; border: 1px solid #333; border-radius: 28px; pointer-events: auto; box-shadow: 0 4px 24px rgba(0,0,0,.4); }
  .bar button { width: 44px; height: 44px; border-radius: 22px; border: 0; background: transparent; color: #fff; display: grid; place-items: center; font-size: 13px; font-weight: 600; }
  .bar button:hover { background: #2a2a2a; }
  .bar button.on { background: #FCE233; color: #111; }
  .bar svg { width: 20px; height: 20px; }
  .pin { position: fixed; pointer-events: auto; min-width: 26px; height: 26px; padding: 0 6px; margin: -13px 0 0 -13px; border-radius: 13px 13px 13px 2px; border: 2px solid #111; background: #FCE233; color: #111; font-size: 11px; font-weight: 700; display: grid; place-items: center; box-shadow: 0 2px 8px rgba(0,0,0,.35); }
  .pin.flash { animation: flash .9s ease 2; }
  @keyframes flash { 50% { transform: scale(1.5); } }
  .card { position: fixed; pointer-events: auto; width: 320px; max-width: calc(100vw - 24px); background: #fff; color: #111; border-radius: 8px; padding: 12px; box-shadow: 0 8px 32px rgba(0,0,0,.35); font-size: 14px; line-height: 1.4; }
  .card textarea, .card input { width: 100%; border: 1px solid #bbb; border-radius: 4px; padding: 8px; font: inherit; color: #111; background: #fff; }
  .card textarea { min-height: 96px; resize: vertical; }
  .card input { margin-top: 8px; }
  .card .meta { font-size: 12px; color: #666; margin-bottom: 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .card .row { display: flex; gap: 8px; margin-top: 8px; align-items: center; }
  .card .row .grow { flex: 1; }
  .card .err { color: #b00020; font-size: 12px; margin-top: 6px; }
  .btn { border: 1px solid #111; background: #fff; color: #111; padding: 7px 12px; border-radius: 4px; font-size: 13px; }
  .btn.main { background: #111; color: #fff; }
  .btn.yel { background: #FCE233; border-color: #FCE233; }
  .btn:disabled { opacity: .5; cursor: default; }
  .link { color: #111; font-size: 12px; }
  .panel { position: fixed; right: 72px; top: 50%; transform: translateY(-50%); width: 340px; max-width: calc(100vw - 84px); max-height: 75vh; overflow: auto; pointer-events: auto; background: #fff; color: #111; border-radius: 8px; padding: 12px; box-shadow: 0 8px 32px rgba(0,0,0,.35); font-size: 14px; }
  .panel h3 { font-size: 12px; text-transform: uppercase; letter-spacing: .04em; margin: 4px 0 8px; color: #666; }
  .panel h3 + p { margin: 0 0 12px; color: #666; font-size: 13px; }
  .item { border-top: 1px solid #eee; padding: 10px 0; }
  .item p { margin: 0 0 6px; white-space: pre-wrap; }
  .item .row { display: flex; gap: 6px; align-items: center; font-size: 12px; color: #666; }
  .item .row .grow { flex: 1; }
  .item .lost { color: #b00020; font-size: 12px; margin-bottom: 6px; }
  .num { font-weight: 700; color: #111; }
  .paths a { display: flex; justify-content: space-between; padding: 6px 0; color: #111; text-decoration: none; border-top: 1px solid #eee; font-size: 13px; }
  .toast { position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%); background: #111; color: #fff; padding: 10px 14px; border-radius: 6px; font-size: 13px; pointer-events: none; }
  @media (max-width: 600px) {
    .card { left: 12px !important; right: 12px; bottom: 12px; top: auto !important; width: auto; max-width: none; }
    .panel { right: 12px; left: 12px; width: auto; max-width: none; top: auto; bottom: 12px; transform: none; max-height: 60vh; }
    .bar { top: auto; bottom: 96px; transform: none; }
  }
</style>
<div class="box hover"><span class="tag"></span></div>
<div class="box sel"><span class="tag"></span></div>
<div class="pins"></div>
<div class="bar">
  <button class="b-comment" title="Comment on an element (C)" aria-label="Comment on an element">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M12 8v6M9 11h6"/></svg>
  </button>
  <button class="b-list" title="Open comments" aria-label="Open comments">–</button>
  <button class="b-off" title="Turn the comment tool off" aria-label="Turn the comment tool off">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
  </button>
</div>`;
  const $ = (s) => root.querySelector(s);
  const hoverBox = $('.box.hover');
  const selBox = $('.box.sel');
  const pinsLayer = $('.pins');
  const bComment = $('.b-comment');
  const bList = $('.b-list');

  document.body.appendChild(host);

  // ---------------------------------------------------------------- state
  let commenting = false;
  let target = null;       // element being commented on
  let point = null;        // click point, page coordinates
  let card = null;         // open composer or thread card
  let panel = null;
  let items = [];          // open comments, whole site
  const pins = new Map();  // issue number -> { item, el, node }

  const fromTool = (e) => e.composedPath().includes(host);
  const typing = (e) => /^(INPUT|TEXTAREA|SELECT)$/.test((e.composedPath()[0] || {}).tagName || '') || (e.target && e.target.isContentEditable);

  // ---------------------------------------------------------------- API
  async function api(method, path, body) {
    const res = await fetch('/api/feedback' + (path || ''), {
      method,
      headers: { 'x-feedback-key': store.get(KEY), ...(body ? { 'content-type': 'application/json' } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error || `Request failed (${res.status})`);
      err.status = res.status;
      throw err;
    }
    return data;
  }

  async function load() {
    if (!store.get(KEY)) { bList.textContent = '–'; return; }
    try {
      items = (await api('GET')).items || [];
    } catch (err) {
      bList.textContent = '!';
      bList.title = err.message;
      return;
    }
    renderPins();
    if (panel) openPanel();
  }

  // ---------------------------------------------------------------- describing an element
  function selectorFor(el) {
    const parts = [];
    while (el && el.nodeType === 1 && el !== document.body && el !== document.documentElement) {
      if (el.id && document.querySelectorAll('#' + CSS.escape(el.id)).length === 1) {
        parts.unshift('#' + CSS.escape(el.id));
        return parts.join(' > ');
      }
      let part = el.localName;
      const parent = el.parentElement;
      if (parent) {
        const same = Array.from(parent.children).filter((c) => c.localName === el.localName);
        if (same.length > 1) part += `:nth-of-type(${same.indexOf(el) + 1})`;
      }
      parts.unshift(part);
      el = parent;
    }
    return 'body > ' + parts.join(' > ');
  }

  function textOf(el) {
    if (el.localName === 'img') return el.alt || '';
    return (el.textContent || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 120);
  }

  function sectionOf(el) {
    const block = el.closest('section, header, footer, nav, aside, dialog, main');
    if (!block) return '';
    const h = block.querySelector('h1, h2, h3');
    const label = h ? h.textContent.replace(/\s+/g, ' ').trim().slice(0, 120) : '';
    return `<${block.localName}${block.id ? '#' + block.id : ''}>${label ? ' “' + label + '”' : ''}`;
  }

  function label(el) {
    const t = textOf(el);
    return `<${el.localName}>${t ? ' ' + (t.length > 40 ? t.slice(0, 40) + '…' : t) : ''}`;
  }

  // Find the element a saved comment points at, even if the markup has shifted a little.
  function locate(item) {
    let el = null;
    try { el = document.querySelector(item.selector); } catch {}
    const want = (item.text || '').slice(0, 40);
    if (el && (!want || textOf(el).startsWith(want))) return el;
    if (want) {
      const found = Array.from(document.querySelectorAll(item.tag || '*')).find((c) => textOf(c).startsWith(want));
      if (found) return found;
    }
    return el;
  }

  // ---------------------------------------------------------------- boxes and pins
  function place(box, el) {
    if (!el) { box.style.display = 'none'; return; }
    const r = el.getBoundingClientRect();
    Object.assign(box.style, { display: 'block', left: r.left - 2 + 'px', top: r.top - 2 + 'px', width: r.width + 4 + 'px', height: r.height + 4 + 'px' });
    box.querySelector('.tag').textContent = label(el);
  }

  function renderPins() {
    pins.clear();
    pinsLayer.textContent = '';
    const here = items.filter((i) => i.path === location.pathname);
    for (const item of here) {
      const node = document.createElement('button');
      node.className = 'pin';
      node.textContent = item.number;
      node.title = item.comment;
      node.addEventListener('click', (e) => { e.stopPropagation(); openThread(item, node); });
      pinsLayer.appendChild(node);
      pins.set(item.number, { item, el: locate(item), node });
    }
    bList.textContent = here.length ? String(here.length) : '0';
    bList.title = `${here.length} open on this page, ${items.length} across the site`;
    positionPins();
  }

  function positionPins() {
    for (const { item, el, node } of pins.values()) {
      const r = el && el.isConnected ? el.getBoundingClientRect() : null;
      if (!r || (!r.width && !r.height)) { node.style.display = 'none'; continue; }
      node.style.display = 'grid';
      node.style.left = r.left + r.width * (item.ox || 0) + 'px';
      node.style.top = r.top + r.height * (item.oy || 0) + 'px';
    }
    if (target && target.isConnected) place(selBox, target);
  }

  let ticking = false;
  const reflow = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; positionPins(); });
  };
  addEventListener('scroll', reflow, { passive: true, capture: true });
  addEventListener('resize', reflow);
  addEventListener('load', reflow);
  new ResizeObserver(reflow).observe(document.body);

  // ---------------------------------------------------------------- comment mode
  function setCommenting(on) {
    commenting = on;
    bComment.classList.toggle('on', on);
    document.documentElement.style.cursor = on ? 'crosshair' : '';
    if (!on) { place(hoverBox, null); closeCard(); }
  }

  addEventListener('pointermove', (e) => {
    if (!commenting || e.pointerType !== 'mouse' || fromTool(e)) return;
    const el = e.target;
    place(hoverBox, el === document.body || el === document.documentElement ? null : el);
  }, true);

  // While commenting, page clicks pick an element instead of following links or opening things.
  const swallow = (e) => {
    if (!commenting || fromTool(e)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
  };
  ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'submit', 'auxclick'].forEach((t) => addEventListener(t, swallow, true));
  addEventListener('click', (e) => {
    if (!commenting || fromTool(e)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const el = e.target;
    if (!el || el === document.body || el === document.documentElement) return;
    target = el;
    point = { x: e.clientX + scrollX, y: e.clientY + scrollY };
    place(hoverBox, null);
    place(selBox, target);
    openComposer(e.clientX, e.clientY);
  }, true);

  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (card) closeCard();
      else if (panel) closePanel();
      else if (commenting) setCommenting(false);
      return;
    }
    if (typing(e) || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'c' || e.key === 'C') setCommenting(!commenting);
  }, true);

  // ---------------------------------------------------------------- cards
  // A modal <dialog> sits in the browser's top layer, above everything. Move the
  // tool into it while one is open so the composer isn't hidden behind it.
  function liftIntoDialog() {
    const dlg = Array.from(document.querySelectorAll('dialog[open]')).pop();
    const home = dlg || document.body;
    if (host.parentNode !== home) home.appendChild(host);
  }

  function positionCard(node, x, y) {
    root.appendChild(node);
    const w = node.offsetWidth, h = node.offsetHeight;
    node.style.left = Math.max(12, Math.min(x + 12, innerWidth - w - 12)) + 'px';
    node.style.top = Math.max(12, Math.min(y + 12, innerHeight - h - 12)) + 'px';
  }

  function closeCard() {
    if (card) card.remove();
    card = null;
    target = null;
    place(selBox, null);
  }

  function openComposer(x, y) {
    if (card) card.remove();
    liftIntoDialog();
    card = document.createElement('div');
    card.className = 'card';
    const needKey = !store.get(KEY);
    card.innerHTML = `
      <div class="meta"></div>
      <textarea placeholder="What should change?"></textarea>
      ${needKey ? '<input type="password" class="key" placeholder="Feedback key (first time only)" autocomplete="off">' : ''}
      <div class="err" hidden></div>
      <div class="row">
        <button class="btn b-wider" title="Select the element around this one">Wider</button>
        <span class="grow"></span>
        <button class="btn b-cancel">Cancel</button>
        <button class="btn main b-post">Post</button>
      </div>`;
    const meta = card.querySelector('.meta');
    const ta = card.querySelector('textarea');
    const err = card.querySelector('.err');
    const post = card.querySelector('.b-post');
    meta.textContent = label(target);

    card.querySelector('.b-cancel').onclick = closeCard;
    card.querySelector('.b-wider').onclick = () => {
      const up = target.parentElement;
      if (!up || up === document.body || up === document.documentElement) return;
      target = up;
      meta.textContent = label(target);
      place(selBox, target);
      ta.focus();
    };
    ta.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); post.click(); }
    });
    post.onclick = async () => {
      const comment = ta.value.trim();
      if (!comment) { ta.focus(); return; }
      const keyField = card.querySelector('.key');
      if (keyField) {
        if (!keyField.value.trim()) { keyField.focus(); return; }
        store.set(KEY, keyField.value.trim());
      }
      post.disabled = true;
      post.textContent = 'Posting…';
      err.hidden = true;
      const r = target.getBoundingClientRect();
      const clamp = (n) => Math.max(0, Math.min(1, n));
      try {
        const res = await api('POST', '', {
          comment,
          path: location.pathname,
          url: location.href,
          selector: selectorFor(target),
          text: textOf(target),
          tag: target.localName,
          classes: typeof target.className === 'string' ? target.className : '',
          section: sectionOf(target),
          href: target.closest('a') ? target.closest('a').href : '',
          img: target.localName === 'img' ? (target.currentSrc || target.src) : '',
          ox: r.width ? clamp((point.x - scrollX - r.left) / r.width) : 0,
          oy: r.height ? clamp((point.y - scrollY - r.top) / r.height) : 0,
          vw: innerWidth,
          vh: innerHeight,
          dpr: devicePixelRatio,
          ua: navigator.userAgent,
        });
        closeCard();
        toast(`Posted as #${res.number}`);
        await load();
        const p = pins.get(res.number);
        if (p) p.node.classList.add('flash');
      } catch (e) {
        post.disabled = false;
        post.textContent = 'Post';
        err.hidden = false;
        err.textContent = e.message;
        if (e.status === 401) { store.del(KEY); openComposer(x, y); card.querySelector('textarea').value = comment; card.querySelector('.err').hidden = false; card.querySelector('.err').textContent = e.message; }
      }
    };
    positionCard(card, x, y);
    ta.focus();
  }

  function openThread(item, node) {
    if (card) card.remove();
    liftIntoDialog();
    card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="meta"></div>
      <p style="margin:0;white-space:pre-wrap"></p>
      <div class="err" hidden></div>
      <div class="row">
        <a class="link" target="_blank" rel="noopener">View on GitHub</a>
        <span class="grow"></span>
        <button class="btn b-close">Close</button>
        <button class="btn yel b-done">Done</button>
      </div>`;
    card.querySelector('.meta').textContent = `#${item.number} · ${new Date(item.created).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}${item.replies ? ' · ' + item.replies + ' repl' + (item.replies > 1 ? 'ies' : 'y') : ''}`;
    card.querySelector('p').textContent = item.comment;
    card.querySelector('a').href = item.url;
    card.querySelector('.b-close').onclick = () => { card.remove(); card = null; };
    card.querySelector('.b-done').onclick = (e) => done(item, e.target, card.querySelector('.err'));
    const r = node.getBoundingClientRect();
    positionCard(card, r.right, r.top);
  }

  async function done(item, button, err) {
    button.disabled = true;
    button.textContent = 'Closing…';
    try {
      await api('PATCH', '/' + item.number);
      if (card) { card.remove(); card = null; }
      toast(`#${item.number} closed`);
      await load();
    } catch (e) {
      button.disabled = false;
      button.textContent = 'Done';
      if (err) { err.hidden = false; err.textContent = e.message; }
    }
  }

  // ---------------------------------------------------------------- list panel
  function closePanel() { if (panel) panel.remove(); panel = null; }

  function openPanel() {
    closePanel();
    panel = document.createElement('div');
    panel.className = 'panel';
    if (!store.get(KEY)) {
      panel.innerHTML = '<h3>Comments</h3><p>Post your first comment to add the feedback key, then open comments show here.</p>';
      root.appendChild(panel);
      return;
    }
    const here = items.filter((i) => i.path === location.pathname);
    const elsewhere = {};
    items.filter((i) => i.path !== location.pathname).forEach((i) => { elsewhere[i.path] = (elsewhere[i.path] || 0) + 1; });
    panel.innerHTML = `<h3>This page · ${here.length} open</h3>${here.length ? '' : '<p>Nothing open here.</p>'}<div class="list"></div><div class="paths"></div>`;
    const list = panel.querySelector('.list');
    for (const item of here) {
      const pin = pins.get(item.number);
      const row = document.createElement('div');
      row.className = 'item';
      row.innerHTML = `<p></p>${pin && pin.el ? '' : '<div class="lost">This element has changed or moved. Check the page.</div>'}<div class="row"><span class="num"></span><span class="grow"></span><button class="btn b-show">Show</button><button class="btn yel b-done">Done</button></div><div class="err" hidden></div>`;
      row.querySelector('p').textContent = item.comment;
      row.querySelector('.num').textContent = '#' + item.number;
      row.querySelector('.b-show').disabled = !(pin && pin.el);
      row.querySelector('.b-show').onclick = () => {
        pin.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        pin.node.classList.remove('flash');
        void pin.node.offsetWidth;
        pin.node.classList.add('flash');
      };
      row.querySelector('.b-done').onclick = (e) => done(item, e.target, row.querySelector('.err'));
      list.appendChild(row);
    }
    const paths = Object.keys(elsewhere).sort();
    if (paths.length) {
      const box = panel.querySelector('.paths');
      box.innerHTML = '<h3 style="margin-top:16px">Other pages</h3>';
      for (const p of paths) {
        const a = document.createElement('a');
        a.href = p;
        a.innerHTML = '<span></span><span class="num"></span>';
        a.firstChild.textContent = p;
        a.lastChild.textContent = elsewhere[p];
        box.appendChild(a);
      }
    }
    root.appendChild(panel);
  }

  // ---------------------------------------------------------------- toolbar
  bComment.onclick = () => { closePanel(); setCommenting(!commenting); };
  bList.onclick = () => { if (panel) closePanel(); else { setCommenting(false); openPanel(); } };
  $('.b-off').onclick = () => {
    store.del(ON);
    setCommenting(false);
    host.remove();
    window.__aifFeedback = false;
  };

  function toast(text) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = text;
    root.appendChild(t);
    setTimeout(() => t.remove(), 2200);
  }

  // Keep the tool out of the way of dialogs that open and close.
  new MutationObserver(() => { if (!card) liftIntoDialog(); }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });

  load();
})();
