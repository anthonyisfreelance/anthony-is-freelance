// The Drive bridge: a small Google Apps Script web app that runs as Anthony, so documents and PDFs
// live in his Google Drive and client emails go out from his own Gmail (and land in Sent).
// Source: worker/docs/apps-script/Code.gs. The worker talks to it with a shared key.
//
// Settings (Cloudflare dashboard > Worker > Settings > Variables and secrets):
//   BRIDGE_URL  the Apps Script web app URL (…/exec)
//   BRIDGE_KEY  secret, the same key set in the script's properties
//
// Speed: every call to the bridge takes a second or more, so reads keep a short-lived copy in
// Cloudflare's cache (see "Short-lived copies" below). Drive stays the only real store.

import { sha256Hex } from './auth.js';

export class BridgeError extends Error {}

export async function bridge(env, action, payload = {}) {
  if (!env.BRIDGE_URL || !env.BRIDGE_KEY) throw new BridgeError('The Drive bridge is not connected yet (BRIDGE_URL and BRIDGE_KEY).');
  const res = await fetch(env.BRIDGE_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ key: env.BRIDGE_KEY, action, ...payload }),
    redirect: 'follow',
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new BridgeError(`Drive bridge returned something unexpected (${res.status}).`);
  }
  if (!data.ok) throw new BridgeError(data.error || 'Drive bridge error');
  return data;
}

/* ---------- Short-lived copies ----------
 *
 * A page view reads from a copy kept in this data centre's cache for up to a minute, so pages don't
 * wait on Google each time. The rules that keep it safe:
 *   - Every change (send, sign, mark paid, a new lead…) goes to Drive first, then updates the copy,
 *     so the next page shows it straight away.
 *   - Anything that changes a document reads the latest from Drive first ({ fresh: true }), never
 *     the copy, so old data is never written back.
 *   - Copies are encrypted with a key made from DOCS_SECRET and stored under an address made from
 *     it too, so they can't be read or found without it. No DOCS_SECRET, no copies.
 * The copy is per data centre: a change made from elsewhere (or a file edited by hand in Drive) can
 * take up to a minute to show.
 */

const FRESH_MS = 60 * 1000;
const SETTINGS_MS = 5 * 60 * 1000;
const store = () => (typeof caches !== 'undefined' && caches.default) || null;
const enc = new TextEncoder();

async function cacheUrl(env, name) {
  return `https://docs.anthonyis.uk/__bridge-cache/${await sha256Hex(`${env.DOCS_SECRET}|address|${name}`)}`;
}
async function cacheKey(env) {
  const raw = await crypto.subtle.digest('SHA-256', enc.encode(`${env.DOCS_SECRET}|bridge-cache`));
  return crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

// Returns { at, value } while the copy is younger than maxAge, otherwise null.
async function cacheGet(env, name, maxAge = FRESH_MS) {
  const cache = store();
  if (!cache || !env.DOCS_SECRET) return null;
  try {
    const hit = await cache.match(await cacheUrl(env, name));
    if (!hit) return null;
    const bytes = new Uint8Array(await hit.arrayBuffer());
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes.slice(0, 12) }, await cacheKey(env), bytes.slice(12));
    const data = JSON.parse(new TextDecoder().decode(plain));
    return Date.now() - data.at <= maxAge ? data : null;
  } catch {
    return null;
  }
}

async function cachePut(env, name, value, at = Date.now()) {
  const cache = store();
  if (!cache || !env.DOCS_SECRET) return;
  try {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const sealed = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await cacheKey(env), enc.encode(JSON.stringify({ at, value })));
    const body = new Uint8Array(12 + sealed.byteLength);
    body.set(iv);
    body.set(new Uint8Array(sealed), 12);
    await cache.put(await cacheUrl(env, name), new Response(body, { headers: { 'cache-control': 'max-age=600' } }));
  } catch {
    // The copy is only for speed; carry on without it.
  }
}

async function cacheDrop(env, name) {
  const cache = store();
  if (!cache || !env.DOCS_SECRET) return;
  try {
    await cache.delete(await cacheUrl(env, name));
  } catch {
    // Nothing to do.
  }
}

// A document as the list holds it: without the heavy parts (as the bridge's own list does).
function summary(doc) {
  const d = JSON.parse(JSON.stringify(doc));
  if (d.state) {
    delete d.state.contractHtml;
    if (d.state.signature) delete d.state.signature.image;
  }
  d.updated = new Date().toISOString();
  return d;
}

// After a change, the copy of the list is brought up to date rather than thrown away, so the admin
// page stays quick. It keeps its original age, so it is still re-read from Drive within the minute.
async function touchList(env, doc, { remove = false } = {}) {
  const list = await cacheGet(env, 'list');
  if (!list) return;
  const next = list.value.filter((d) => d.token !== doc.token);
  if (!remove) next.push(summary(doc));
  await cachePut(env, 'list', next, list.at);
}

/* ---------- Reads and writes ---------- */

export async function getSettings(env) {
  const hit = await cacheGet(env, 'settings', SETTINGS_MS);
  if (hit) return hit.value;
  const { settings } = await bridge(env, 'settings');
  await cachePut(env, 'settings', settings || {});
  return settings || {};
}

// `fresh` skips the copy: use it for anything that goes on to change the document.
export async function getDoc(env, token, { fresh = false } = {}) {
  if (!/^[A-Za-z0-9_-]{16,64}$/.test(token)) return null;
  if (!fresh) {
    const hit = await cacheGet(env, `doc:${token}`);
    if (hit) return hit.value;
  }
  const { doc } = await bridge(env, 'get', { token });
  await cachePut(env, `doc:${token}`, doc || null);
  return doc || null;
}

export async function putDoc(env, doc) {
  const r = await bridge(env, 'put', { token: doc.token, doc });
  await Promise.all([cachePut(env, `doc:${doc.token}`, doc), touchList(env, doc)]);
  return r;
}

export async function createDoc(env, doc, name) {
  const r = await bridge(env, 'create', { doc, name });
  await Promise.all([cachePut(env, `doc:${doc.token}`, doc), touchList(env, doc)]);
  return r;
}

// Every document and lead, without the heavy parts. The bridge's "listFast" keeps an index so it
// only opens files that changed; a bridge deployed before that action existed, or any problem with
// it, falls back to the plain "list" (and tries the fast one again later).
let fastListOffUntil = 0;
export async function listDocs(env) {
  const hit = await cacheGet(env, 'list');
  if (hit) return hit.value;
  let docs;
  if (Date.now() > fastListOffUntil) {
    try {
      docs = (await bridge(env, 'listFast')).docs || [];
    } catch (e) {
      if (!(e instanceof BridgeError) || !env.BRIDGE_URL) throw e;
      fastListOffUntil = Date.now() + 10 * 60 * 1000;
    }
  }
  if (!docs) docs = (await bridge(env, 'list')).docs || [];
  await cachePut(env, 'list', docs);
  return docs;
}

// Deletes a lead. The bridge's "remove" action bins its file in Drive. A bridge deployed before
// that action existed doesn't know it, so the lead's details are wiped instead, leaving an empty
// file that the lists ignore.
export async function removeLead(env, lead) {
  try {
    await bridge(env, 'remove', { token: lead.token });
  } catch (e) {
    if (!(e instanceof BridgeError) || !/unknown action/i.test(e.message)) throw e;
    await bridge(env, 'put', { token: lead.token, doc: { type: 'lead', token: lead.token, deleted: new Date().toISOString() } });
  }
  await Promise.all([cacheDrop(env, `doc:${lead.token}`), touchList(env, lead, { remove: true })]);
}

// kind: quote | contract | invoice. `date` (YYYY-MM-DD) picks the invoice's tax-year folder.
export const savePdf = (env, { kind, name, base64, date }) => bridge(env, 'savePdf', { kind, name, base64, date });

// Sends from Anthony's Gmail. attachments: [{ fileId }] (files saved with savePdf).
export const sendEmail = (env, mail) => bridge(env, 'email', mail);

export const nextInvoiceSeq = (env, key) => bridge(env, 'nextInvoice', { client: key }).then((r) => r.next);
