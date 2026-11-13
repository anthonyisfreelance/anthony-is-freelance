// Response headers, rate limits and the PDF cache for docs.anthonyis.uk.
//
// Every page gets a strict Content Security Policy: scripts run only if they carry this response's
// nonce, so even if something slipped past the escaping it couldn't run. Pages can't be framed,
// links never pass the address on (no-referrer), and nothing is cached or indexed.

const BASE_HEADERS = {
  'cache-control': 'no-store',
  'x-robots-tag': 'noindex, nofollow',
  'referrer-policy': 'no-referrer',
  'x-frame-options': 'DENY',
  'x-content-type-options': 'nosniff',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'cross-origin-opener-policy': 'same-origin',
  'cross-origin-resource-policy': 'same-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
};

// Email previews (samples) show the logo and fonts from the main site, as the real emails do.
const csp = (nonce) =>
  [
    "default-src 'none'",
    `script-src 'nonce-${nonce}'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://anthonyis.uk",
    "font-src 'self' data: https://anthonyis.uk",
    "connect-src 'self'",
    // The PDF view on the sample pages draws PDFs with pdf.js, which runs in a worker from this site.
    "worker-src 'self'",
    "form-action 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
  ].join('; ');

export function headers(extra = {}) {
  return { ...BASE_HEADERS, ...extra };
}

// An HTML page with a fresh nonce on each of its own <script> tags. Text from documents is always
// escaped, so the only "<script" in a page is one the templates wrote.
export function page(body, status = 200, extra = {}) {
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));
  const out = String(body).replaceAll('<script', `<script nonce="${nonce}"`);
  return new Response(out, {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8', ...BASE_HEADERS, 'content-security-policy': csp(nonce), ...extra },
  });
}

// Rate limits (Workers rate limiting bindings in wrangler.jsonc), per visitor IP:
//   DOCS_RL_READ  page views and document lookups
//   DOCS_RL_POST  codes, sign-ins and actions
//   DOCS_RL_CODE  guesses at any one code, wherever they come from
//   DOCS_RL_PDF   PDFs that need rendering (each one uses Browser Rendering time, 10 minutes a day on
//                 the free plan); PDFs already in the cache don't count
// Limits count per Cloudflare location and are approximate; they stop floods, not single requests.
// Without the bindings (local testing) nothing is limited.
export async function allowed(env, binding, request, extra = '') {
  const limiter = env[binding];
  if (!limiter) return true;
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  try {
    const { success } = await limiter.limit({ key: `${ip}${extra ? `|${extra}` : ''}` });
    return success;
  } catch {
    return true;
  }
}

// One limit per one-time code too, whoever is guessing, so a code can't be worked through by
// replaying its cookie from many places.
export async function codeAllowed(env, id) {
  const limiter = env.DOCS_RL_CODE;
  if (!limiter || !id) return true;
  try {
    const { success } = await limiter.limit({ key: `code|${id}` });
    return success;
  } catch {
    return true;
  }
}

// PDFs are cached (in this data centre's cache, never served to the public) by a hash of the exact
// HTML they're made from, so the same document is only rendered once until it changes. The hash
// covers the document's secret token, so the cache key can't be guessed.
async function hashOf(text) {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// `gate` runs before a fresh render (the rate limit) and returns false to refuse it.
export async function cachedPdf(env, ctx, origin, html, render, gate = async () => true) {
  const cache = typeof caches !== 'undefined' ? caches.default : null;
  const key = cache ? new Request(`${origin}/__pdf-cache/${await hashOf(html)}`) : null;
  if (cache && env.DOCS_FAKE_PDF !== '1') {
    const hit = await cache.match(key).catch(() => null);
    if (hit) return new Uint8Array(await hit.arrayBuffer());
  }
  if (!(await gate())) return null;
  const bytes = await render(html);
  if (cache && env.DOCS_FAKE_PDF !== '1') {
    const put = cache.put(key, new Response(bytes, { headers: { 'cache-control': 'max-age=2592000' } })).catch(() => {});
    if (ctx?.waitUntil) ctx.waitUntil(put);
  }
  return bytes;
}
