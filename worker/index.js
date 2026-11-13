// Worker in front of the static site. Everything is served from ./dist except /api/*,
// which wrangler.jsonc routes here first (run_worker_first).
//
// /api/enquiry sends the start-a-project form (worker/enquiry.js).
// docs.anthonyis.uk serves client quotes, contracts and invoices (worker/docs/).
// /api/feedback powers the test-site comment tool (public/feedback.js). Each comment
// becomes a GitHub issue labelled "feedback" on the site repo. It never runs on
// anthonyis.uk itself. On docs.anthonyis.uk it runs only for the made-up sample documents
// at /admin/samples/ (issues on this repo are public), with the admin login instead of the key.
//
// Secrets (Cloudflare dashboard > Worker > Settings > Variables and secrets):
//   GITHUB_TOKEN  fine-grained token, this repo only, Issues: read and write
//   FEEDBACK_KEY  any passphrase; the comment tool sends it with every request

import { enquiry } from './enquiry.js';
import { docs, adminSession } from './docs/index.js';

// Pages removed for good: a 410 tells Google they're gone on purpose, so they drop out quickly.
// Every path here must also be in run_worker_first in wrangler.jsonc, or the worker never sees it.
// Redirect map rows 60, 64, 66 and 67 (1 November 2026).
export const GONE = new Set([
  '/portfolio/the-brand-manual/',
  '/portfolio/proconvey-video/',
  '/portfolio/inlight-beauty-shopify-case-study/',
  '/portfolio/stovefitters-shopify-case-study/',
  // Agency-era case studies still in Search Console (Anthony, 2 November 2026)
  '/portfolio/trebah-garden/',
  '/portfolio/the-chocolate-gift-co-shopify-case-study/',
  '/portfolio/lou-coulson-associates/',
  '/portfolio/willow-stone/',
  '/portfolio/the-box/',
  '/portfolio/cloudberry/',
  // WordPress media attachment pages still in Search Console (map row 74, 2 November 2026)
  '/anthony-bliss-freela2x-light/',
  '/2cfe64aa-db05-4ce3-bbfd-9f5c7243b084-2/',
  '/drink-finder-hero-2-2/',
  '/back-in-stock/',
  '/recipes-m/',
  '/red-bull/',
  '/shopify-website-design/east-west-apparel-hero_white/',
  // Found in the Search Console check of 11 November 2026
  '/1-1-christopherdaviddesign_edit-2-without-begining-frame_1080p/',
]);

// Attachment pages by pattern (map row 74): WordPress put every image in a case study at
// /portfolio/<case study>/<image>/, and demo imports at /demo-media-<n>/.
const GONE_PATTERNS = [/^\/portfolio\/[^/]+\/[^/]+\/$/, /^\/demo-media-[^/]+\/$/];

const REPO = 'anthonyisfreelance/anthony-is-freelance';
const LABEL = 'feedback';
const META = /<!-- feedback-meta ([A-Za-z0-9+/=]+) -->/;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/wp-content/uploads/')) return oldImage(request, env, url);
    // Client quotes, contracts and invoices, on their own subdomain (worker/docs/README.md).
    if (url.hostname === (env.DOCS_HOST || 'docs.anthonyis.uk') || env.DOCS_DEV === '1') {
      const res = await docs(request, env, ctx);
      if (res) return res;
    }
    const path = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
    if (GONE.has(path) || GONE_PATTERNS.some((re) => re.test(path))) return gone(request, env);
    if (url.pathname === '/api/enquiry') return enquiry(request, env);
    if (url.pathname === '/api/feedback' || url.pathname.startsWith('/api/feedback/')) {
      return feedback(request, env, url);
    }
    return env.ASSETS.fetch(request);
  },
};

// Comments on the documents subdomain may only be about the sample pages.
const SAMPLES = '/admin/samples/';

async function feedback(request, env, url) {
  const docsHost = url.hostname === (env.DOCS_HOST || 'docs.anthonyis.uk');
  if (/(^|\.)anthonyis\.uk$/.test(url.hostname) && !docsHost) return json({ error: 'Not found' }, 404);
  if (docsHost) {
    if (!env.GITHUB_TOKEN) return json({ error: 'Comments are not set up yet: add GITHUB_TOKEN in Cloudflare.' }, 503);
    if (request.method !== 'GET' && request.headers.get('origin') !== url.origin) return json({ error: 'Not allowed.' }, 403);
    if (!(await adminSession(request, env))) return json({ error: 'Log in at /admin/ first.' }, 401);
  } else {
    if (!env.GITHUB_TOKEN || !env.FEEDBACK_KEY) {
      return json({ error: 'Comments are not set up yet: add GITHUB_TOKEN and FEEDBACK_KEY in Cloudflare.' }, 503);
    }
    if (!sameKey(request.headers.get('x-feedback-key') || '', env.FEEDBACK_KEY)) {
      return json({ error: 'Wrong feedback key.' }, 401);
    }
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
    if (request.method === 'GET') return await list(gh, docsHost ? SAMPLES : '');
    if (request.method === 'POST' && url.pathname === '/api/feedback') return await create(gh, request, docsHost ? SAMPLES : '');
    const done = url.pathname.match(/^\/api\/feedback\/(\d+)$/);
    if (request.method === 'PATCH' && done) return await close(gh, Number(done[1]), docsHost ? SAMPLES : '');
    return json({ error: 'Not found' }, 404);
  } catch (err) {
    return json({ error: err.message || 'Something went wrong.' }, 502);
  }
}

// Open comments across the whole site. The page filters to its own path.
async function list(gh, only) {
  const items = [];
  for (let page = 1; page <= 5; page++) {
    const res = await gh(`/issues?labels=${LABEL}&state=open&per_page=100&page=${page}`);
    if (!res.ok) throw new Error(`GitHub said ${res.status} when listing comments.`);
    const batch = await res.json();
    for (const issue of batch) {
      if (issue.pull_request) continue;
      const meta = readMeta(issue.body);
      if (!meta) continue;
      if (only && !String(meta.path || '').startsWith(only)) continue;
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

async function create(gh, request, only) {
  const d = await request.json().catch(() => null);
  const comment = clean(d && d.comment, 4000);
  const path = clean(d && d.path, 300);
  if (!comment || !path || !path.startsWith(only || '/')) return json({ error: 'A comment and page are needed.' }, 400);

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
async function close(gh, number, only) {
  const res = await gh(`/issues/${number}`);
  if (!res.ok) return json({ error: 'Comment not found.' }, 404);
  const issue = await res.json();
  if (!issue.labels.some((l) => l.name === LABEL)) return json({ error: 'Not a feedback comment.' }, 400);
  if (only && !String(readMeta(issue.body)?.path || '').startsWith(only)) return json({ error: 'Not a sample comment.' }, 400);
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

// The 404 page's content with a 410 status, so people still get the helpful links.
// Old WordPress images (4 November 2026). Google Images still holds the /wp-content/uploads/ addresses
// of images that ranked, so each one 301s to the same picture on the new site. The map is built with
// the site (src/pages/image-redirects.json.ts). WordPress also served resized copies (name-300x200.jpg)
// and big uploads as name-scaled.jpg, so those are matched to their original. Anything not in the map
// is the normal 404.
let imageMap;
async function oldImage(request, env, url) {
  if (!imageMap) {
    const res = await env.ASSETS.fetch(new Request(new URL('/image-redirects.json', url)));
    imageMap = res.ok ? await res.json() : {};
  }
  let path = url.pathname;
  try { path = decodeURIComponent(path); } catch {}
  const original = path.replace(/-\d+x\d+(?=\.[a-z0-9]+$)/i, '').replace(/-scaled(?=\.[a-z0-9]+$)/i, '');
  const target = imageMap[path] ?? imageMap[original] ?? imageMap[original.replace(/(\.[a-z0-9]+)$/i, '-scaled$1')];
  if (target) return Response.redirect(new URL(target, url).href, 301);
  return env.ASSETS.fetch(request);
}

async function gone(request, env) {
  const page = await env.ASSETS.fetch(new Request(new URL('/404.html', request.url)));
  return new Response(page.body, {
    status: 410,
    headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'noindex' },
  });
}
