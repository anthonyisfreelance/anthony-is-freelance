// Google: the platform's own read-only login (a service account) and the two APIs it reads,
// the GA4 Data API and the Search Console API.
//
// The service account's JSON key is the worker secret GOOGLE_SA_KEY. The worker signs its own
// token request (RS256 JWT, Web Crypto) and keeps the token for its hour in memory. Each brand
// adds the service account's address as a Viewer on its GA4 property and as a Restricted user in
// Search Console; nothing else needs to change on their side.
//
// INSIGHTS_FAKE_GOOGLE=1 swaps in canned API responses (fakeGoogle below), shaped like the real
// ones, so the audit runs locally without a key and the same parsing code is tested.

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GA4_URL = 'https://analyticsdata.googleapis.com/v1beta';
const GSC_URL = 'https://www.googleapis.com/webmasters/v3';
export const SCOPES = 'https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly';

export class GoogleError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.status = status;
  }
}

/* ---------- The key and the token ---------- */

// The parts of the key the worker uses. Returns null if the secret is missing or isn't a key.
export function readKey(env) {
  if (!env.GOOGLE_SA_KEY) return null;
  try {
    const k = JSON.parse(env.GOOGLE_SA_KEY);
    if (k.type !== 'service_account' || !k.client_email || !String(k.private_key || '').includes('PRIVATE KEY')) return null;
    return { email: k.client_email, pem: k.private_key, tokenUri: k.token_uri || TOKEN_URL };
  } catch {
    return null;
  }
}

export const googleReady = (env) => env.INSIGHTS_FAKE_GOOGLE === '1' || Boolean(readKey(env));
export const serviceEmail = (env) => (env.INSIGHTS_FAKE_GOOGLE === '1' ? 'insights-reader@example-project.iam.gserviceaccount.com' : readKey(env)?.email || '');

const b64url = (bytes) => {
  let s = '';
  for (const b of new Uint8Array(bytes)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const b64urlText = (text) => b64url(new TextEncoder().encode(text));

function pemBytes(pem) {
  const body = String(pem).replace(/-----[^-]+-----/g, '').replace(/\\n/g, '').replace(/\s+/g, '');
  const bin = atob(body);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// A signed JWT asking for a token with the read-only scopes. Exported for the tests.
export async function signedAssertion(key, scope = SCOPES, nowSec = Math.floor(Date.now() / 1000)) {
  const head = b64urlText(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = b64urlText(JSON.stringify({ iss: key.email, scope, aud: key.tokenUri, iat: nowSec, exp: nowSec + 3600 }));
  const cryptoKey = await crypto.subtle.importKey('pkcs8', pemBytes(key.pem), { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, new TextEncoder().encode(`${head}.${claims}`));
  return `${head}.${claims}.${b64url(sig)}`;
}

let cached = null; // { email, token, until }

async function accessToken(env) {
  const key = readKey(env);
  if (!key) throw new GoogleError('The Google key is not set up yet (GOOGLE_SA_KEY).');
  if (cached && cached.email === key.email && cached.until > Date.now() + 60_000) return cached.token;
  let res;
  try {
    const assertion = await signedAssertion(key);
    res = await fetch(key.tokenUri, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: `grant_type=${encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer')}&assertion=${encodeURIComponent(assertion)}`,
    });
  } catch (e) {
    throw new GoogleError(`Couldn't sign in to Google: ${e.message}`);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) throw new GoogleError(`Google refused the sign-in (${data.error_description || data.error || res.status}). Check the GOOGLE_SA_KEY secret.`, res.status);
  cached = { email: key.email, token: data.access_token, until: Date.now() + (Number(data.expires_in) || 3600) * 1000 };
  return cached.token;
}

async function call(env, url, body, what) {
  if (env.INSIGHTS_FAKE_GOOGLE === '1') return fakeGoogle(url, body);
  const token = await accessToken(env);
  let res;
  try {
    res = await fetch(url, { method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' }, body: JSON.stringify(body) });
  } catch (e) {
    throw new GoogleError(`${what} couldn't be reached: ${e.message}`);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.error?.message || `status ${res.status}`;
    const hint = res.status === 403 ? ` Check that ${readKey(env)?.email || 'the service account'} has access.` : '';
    throw new GoogleError(`${what} said no: ${msg}.${hint}`, res.status);
  }
  return data;
}

/* ---------- GA4 Data API ---------- */

// Up to five reports in one call. Returns each report's rows as plain objects keyed by the
// dimension and metric names, with `range` set to the date range's name when there are two.
export async function ga4Batch(env, property, requests) {
  const data = await call(env, `${GA4_URL}/properties/${encodeURIComponent(property)}:batchRunReports`, { requests }, 'GA4');
  const out = (data.reports || []).map(readReport);
  out.currency = data.reports?.[0]?.metadata?.currencyCode || 'GBP';
  return out;
}

export function readReport(r) {
  const dims = (r.dimensionHeaders || []).map((h) => h.name);
  const mets = (r.metricHeaders || []).map((h) => h.name);
  return (r.rows || []).map((row) => {
    const o = {};
    dims.forEach((d, i) => {
      o[d === 'dateRange' ? 'range' : d] = row.dimensionValues?.[i]?.value ?? '';
    });
    mets.forEach((m, i) => {
      o[m] = Number(row.metricValues?.[i]?.value) || 0;
    });
    return o;
  });
}

/* ---------- Search Console ---------- */

export async function gscQuery(env, site, body) {
  const data = await call(env, `${GSC_URL}/sites/${encodeURIComponent(site)}/searchAnalytics/query`, body, 'Search Console');
  return data.rows || [];
}

/* ---------- Fake Google (INSIGHTS_FAKE_GOOGLE=1, and the tests) ---------- */

// Plausible numbers for a small UK shop, shaped like the real responses. A made-up bot city
// ("Botsville") is small enough to be listed under "also seen" without marking the data down.
export function fakeGoogle(url, body) {
  if (url.includes('searchAnalytics')) {
    const dims = body.dimensions || [];
    const scale = body.startDate < '2026-01-01' ? 0.8 : 1;
    const filters = JSON.stringify(body.dimensionFilterGroups || []);
    if (!dims.length && filters.includes('"query"')) return { rows: [{ clicks: 210, impressions: 640, ctr: 0.33, position: 1.4 }] };
    if (!dims.length && filters.includes('gbr')) return { rows: [{ clicks: Math.round(1620 * scale), impressions: Math.round(50100 * scale), ctr: 0.032, position: 12.8 }] };
    if (!dims.length) return { rows: [{ clicks: Math.round(1840 * scale), impressions: Math.round(61200 * scale), ctr: 0.03, position: 14.2 }] };
    if (dims[0] === 'query') return { rows: ['sailing jacket', 'saltwater supply', 'fisherman jumper', 'waterproof smock'].map((q, i) => ({ keys: [q], clicks: 220 - i * 40, impressions: 5000 - i * 900, ctr: 0.04, position: 3 + i * 2.5 })) };
    return { rows: ['/', '/collections/jackets/', '/products/harbour-smock/'].map((p, i) => ({ keys: [`https://saltwatersupply.example${p}`], clicks: 400 - i * 110, impressions: 9000 - i * 2000, ctr: 0.04, position: 4 + i })) };
  }
  const reports = (body.requests || []).map((req) => {
    const dims = (req.dimensions || []).map((d) => d.name);
    const mets = (req.metrics || []).map((m) => m.name);
    const ranges = req.dateRanges || [];
    const two = ranges.length > 1;
    const headers = { dimensionHeaders: [...dims, ...(two ? ['dateRange'] : [])].map((name) => ({ name })), metricHeaders: mets.map((name) => ({ name })) };
    const row = (dimValues, values, range) => ({
      dimensionValues: [...dimValues, ...(two ? [range] : [])].map((value) => ({ value: String(value) })),
      metricValues: mets.map((m) => ({ value: String(values[m] ?? 0) })),
    });
    const per = (base, range) => {
      const k = range === 'before' ? 0.85 : 1;
      return Object.fromEntries(Object.entries(base).map(([m, v]) => [m, Number.isInteger(v) ? Math.round(v * k) : Math.round(v * k * 100) / 100]));
    };
    const each = (list) => ranges.flatMap((r) => list.map(([dv, base]) => row(dv, per(base, r.name), r.name)));
    const T = { sessions: 12400, engagedSessions: 7300, totalPurchasers: 296, transactions: 312, purchaseRevenue: 24890.5, eventCount: 0 };
    const first = dims[0];
    let rows;
    if (!dims.length) rows = each([[[], T]]);
    else if (first === 'deviceCategory') rows = each([[['mobile'], { sessions: 8900, transactions: 190, purchaseRevenue: 14100 }], [['desktop'], { sessions: 3200, transactions: 115, purchaseRevenue: 10200 }], [['tablet'], { sessions: 300, transactions: 7, purchaseRevenue: 590.5 }]]);
    else if (first === 'landingPage') {
      const filtered = JSON.stringify(req.dimensionFilter || '').includes('(not set)');
      rows = filtered ? each([[['(not set)'], { sessions: 210 }]]) : each(['/', '/collections/jackets/', '/products/harbour-smock/', '(not set)', '/pages/about/'].map((p, i) => [[p], { sessions: 4000 - i * 700, transactions: 90 - i * 15 }]));
    } else if (first === 'sessionSource' && dims[1] === 'sessionMedium' && !JSON.stringify(req.dimensionFilter || '').includes('perplexity'))
      rows = each([[['google', 'organic'], { sessions: 6100, transactions: 150, purchaseRevenue: 11800 }], [['(direct)', '(none)'], { sessions: 3300, transactions: 90, purchaseRevenue: 7400 }], [['instagram.com', 'referral'], { sessions: 1100, transactions: 20, purchaseRevenue: 1500 }], [['l.instagram.com', 'referral'], { sessions: 400, transactions: 6, purchaseRevenue: 480 }], [['klaviyo', 'email'], { sessions: 600, transactions: 31, purchaseRevenue: 2600 }], [['chatgpt.com', 'referral'], { sessions: 186, transactions: 7, purchaseRevenue: 612 }], [['chatgpt.com', '(not set)'], { sessions: 24, transactions: 1, purchaseRevenue: 88 }], [['perplexity', 'referral'], { sessions: 31, transactions: 1, purchaseRevenue: 74 }]]);
    else if (first === 'sessionSource' && dims[1] === 'sessionMedium') rows = each([[['chatgpt.com', 'referral'], { sessions: 186, transactions: 7, purchaseRevenue: 612 }], [['chatgpt.com', '(not set)'], { sessions: 24, transactions: 1, purchaseRevenue: 88 }], [['perplexity', 'referral'], { sessions: 31, transactions: 1, purchaseRevenue: 74 }], [['gemini.google.com', 'referral'], { sessions: 12, transactions: 0, purchaseRevenue: 0 }]]);
    else if (first === 'sessionSource') rows = each([[['google'], { sessions: 6100, engagedSessions: 3900 }], [['(direct)'], { sessions: 3300, engagedSessions: 1700 }], [['instagram.com'], { sessions: 1500, engagedSessions: 900 }], [['chatgpt.com'], { sessions: 210, engagedSessions: 140 }]]);
    else if (first === 'city') rows = each([[['London'], { sessions: 2400, engagedSessions: 1500 }], [['Falmouth'], { sessions: 1100, engagedSessions: 700 }], [['Botsville'], { sessions: 620, engagedSessions: 12 }], [['Bristol'], { sessions: 800, engagedSessions: 500 }]]);
    else if (first === 'date') {
      const start = Date.parse(`${ranges[0].startDate}T12:00:00Z`);
      const end = Date.parse(`${ranges[0].endDate}T12:00:00Z`);
      const days = Math.max(1, Math.round((end - start) / 864e5) + 1);
      rows = Array.from({ length: days }, (_, i) => {
        const d = new Date(start + i * 864e5).toISOString().slice(0, 10).replace(/-/g, '');
        return row([d], { sessions: 130 + (i % 7) * 4, engagedSessions: 78, transactions: 3 + (i % 3), eventCount: 1 });
      });
    } else if (first === 'transactionId') rows = [row(['T-1001'], { eventCount: 2 })];
    else if (first === 'sessionCampaignName') rows = [row(['(organic)'], { eventCount: 9 }), row(['footer_banner'], { eventCount: 40 })];
    else rows = [];
    return { ...headers, rows, rowCount: rows.length };
  });
  return { reports };
}
