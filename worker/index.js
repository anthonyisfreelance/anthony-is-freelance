// Worker in front of the static site. Everything is served from ./dist except /api/*,
// which wrangler.jsonc routes here first (run_worker_first).
//
// /api/enquiry sends the start-a-project form (worker/enquiry.js).
// /api/feedback powers the test-site comment tool (public/feedback.js). Each comment
// becomes a GitHub issue labelled "feedback" on the site repo. It never runs on
// anthonyis.uk itself.
//
// Secrets (Cloudflare dashboard > Worker > Settings > Variables and secrets):
//   GITHUB_TOKEN  fine-grained token, this repo only, Issues: read and write
//   FEEDBACK_KEY  any passphrase; the comment tool sends it with every request

import { enquiry } from './enquiry.js';

const REPO = 'anthonyisfreelance/anthony-is-freelance';
const LABEL = 'feedback';
const META = /<!-- feedback-meta ([A-Za-z0-9+/=]+) -->/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/enquiry') return enquiry(request, env);
    if (url.pathname === '/api/feedback' || url.pathname.startsWith('/api/feedback/')) {
      return feedback(request, env, url);
    }
    return env.ASSETS.fetch(request);
  },
};

async function feedback(request, env, url) {
  if (/(^|\.)anthonyis\.uk$/.test(url.hostname)) return json({ error: 'Not found' }, 404);
  if (!env.GITHUB_TOKEN || !env.FEEDBACK_KEY) {
    return json({ error: 'Comments are not set up yet: add GITHUB_TOKEN and FEEDBACK_KEY in Cloudflare.' }, 503);
  }
  if (!sameKey(request.headers.get('x-feedback-key') || '', env.FEEDBACK_KEY)) {
    return json({ error: 'Wrong feedback key.' }, 401);
  }

  const gh = (path, init = {}) =>
    fetch(`${env.GITHUB_API || 'https://api.github.com'}/repos/${env.FEEDBACK_REPO || REPO}${path}`, {
      ...init,
      headers: {
        authorization: `Bearer ${env.GITHUB_TOKEN}`,
        accept: 'application/vnd.github+json',
        'x-github-api-version': '2022-11-28',
        'user-agent': 'anthonyis-feedback',
        ...(init.body ? { 'content-type': 'application/json' } : {}),
      },
    });

  try {
    if (request.method === 'GET') return await list(gh);
    if (request.method === 'POST' && url.pathname === '/api/feedback') return await create(gh, request);
    const done = url.pathname.match(/^\/api\/feedback\/(\d+)$/);
    if (request.method === 'PATCH' && done) return await close(gh, Number(done[1]));
    return json({ error: 'Not found' }, 404);
  } catch (err) {
    return json({ error: err.message || 'Something went wrong.' }, 502);
  }
}

// Open comments across the whole site. The page filters to its own path.
async function list(gh) {
  const items = [];
  for (let page = 1; page <= 5; page++) {
    const res = await gh(`/issues?labels=${LABEL}&state=open&per_page=100&page=${page}`);
    if (!res.ok) throw new Error(`GitHub said ${res.status} when listing comments.`);
    const batch = await res.json();
    for (const issue of batch) {
      if (issue.pull_request) continue;
      const meta = readMeta(issue.body);
      if (!meta) continue;
      items.push({
        number: issue.number,
        comment: meta.comment,
        path: meta.path,
        selector: meta.selector,
        text: meta.text,
        tag: meta.tag,
        ox: meta.ox,
        oy: meta.oy,
        vw: meta.vw,
        replies: issue.comments,
        url: issue.html_url,
        created: issue.created_at,
      });
    }
    if (batch.length < 100) break;
  }
  return json({ items });
}

async function create(gh, request) {
  const d = await request.json().catch(() => null);
  const comment = clean(d && d.comment, 4000);
  const path = clean(d && d.path, 300);
  if (!comment || !path || !path.startsWith('/')) return json({ error: 'A comment and page are needed.' }, 400);

  const meta = {
    comment,
    path,
    selector: clean(d.selector, 1000),
    text: clean(d.text, 200),
    tag: clean(d.tag, 20),
    ox: num(d.ox),
    oy: num(d.oy),
    vw: num(d.vw),
  };
  const vw = num(d.vw), vh = num(d.vh);
  const lines = [
    comment,
    '',
    '---',
    `**Page:** [${path}](${clean(d.url, 600)})`,
    `**Screen:** ${vw} × ${vh}px${d.dpr ? ` @${num(d.dpr)}x` : ''} (${vw < 1024 ? 'mobile layout' : 'desktop layout'})`,
    d.section ? `**Section:** ${clean(d.section, 200)}` : null,
    `**Element:** \`<${meta.tag}>\`${d.classes ? ` \`.${clean(d.classes, 200).split(/\s+/).join('.')}\`` : ''}`,
    meta.text ? `**Element text:** “${meta.text}”` : null,
    d.href ? `**Link:** ${clean(d.href, 300)}` : null,
    d.img ? `**${/\.mp4/i.test(d.img) ? 'Video' : 'Image'}:** ${clean(d.img, 300)}` : null,
    `**Selector:** \`${meta.selector}\``,
    `**Browser:** ${clean(d.ua, 300)}`,
    '',
    `<!-- feedback-meta ${b64(JSON.stringify(meta))} -->`,
  ].filter((l) => l !== null);

  const title = `${path} · ${comment.replace(/\s+/g, ' ').slice(0, 70)}${comment.length > 70 ? '…' : ''}`;
  const res = await gh('/issues', {
    method: 'POST',
    body: JSON.stringify({ title, body: lines.join('\n'), labels: [LABEL] }),
  });
  if (!res.ok) throw new Error(`GitHub said ${res.status} when saving the comment.`);
  const issue = await res.json();
  return json({ number: issue.number, url: issue.html_url }, 201);
}

// "Done" in the comment tool closes the issue, leaving a note on it.
async function close(gh, number) {
  const res = await gh(`/issues/${number}`);
  if (!res.ok) return json({ error: 'Comment not found.' }, 404);
  const issue = await res.json();
  if (!issue.labels.some((l) => l.name === LABEL)) return json({ error: 'Not a feedback comment.' }, 400);
  await gh(`/issues/${number}/comments`, {
    method: 'POST',
    body: JSON.stringify({ body: 'Marked done on the test site.' }),
  });
  const shut = await gh(`/issues/${number}`, {
    method: 'PATCH',
    body: JSON.stringify({ state: 'closed', state_reason: 'completed' }),
  });
  if (!shut.ok) throw new Error(`GitHub said ${shut.status} when closing the comment.`);
  return json({ ok: true });
}

function readMeta(body) {
  const m = (body || '').match(META);
  if (!m) return null;
  try {
    const bytes = Uint8Array.from(atob(m[1]), (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

function b64(str) {
  let bin = '';
  for (const byte of new TextEncoder().encode(str)) bin += String.fromCharCode(byte);
  return btoa(bin);
}

function clean(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function num(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n * 1000) / 1000 : 0;
}

function sameKey(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}
