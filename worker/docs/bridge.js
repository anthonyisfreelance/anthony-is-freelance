// The Drive bridge: a small Google Apps Script web app that runs as Anthony, so documents and PDFs
// live in his Google Drive and client emails go out from his own Gmail (and land in Sent).
// Source: worker/docs/apps-script/Code.gs. The worker talks to it with a shared key.
//
// Settings (Cloudflare dashboard > Worker > Settings > Variables and secrets):
//   BRIDGE_URL  the Apps Script web app URL (…/exec)
//   BRIDGE_KEY  secret, the same key set in the script's properties

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

// Settings change rarely; keep them for five minutes per worker instance.
let settingsCache = null;
export async function getSettings(env) {
  if (settingsCache && settingsCache.at > Date.now() - 5 * 60 * 1000) return settingsCache.value;
  const { settings } = await bridge(env, 'settings');
  settingsCache = { at: Date.now(), value: settings || {} };
  return settingsCache.value;
}

export async function getDoc(env, token) {
  if (!/^[A-Za-z0-9_-]{16,64}$/.test(token)) return null;
  const { doc } = await bridge(env, 'get', { token });
  return doc || null;
}

export const putDoc = (env, doc) => bridge(env, 'put', { token: doc.token, doc });
export const createDoc = (env, doc, name) => bridge(env, 'create', { doc, name });
export const listDocs = (env) => bridge(env, 'list').then((r) => r.docs || []);

// kind: quote | contract | invoice. `date` (YYYY-MM-DD) picks the invoice's tax-year folder.
export const savePdf = (env, { kind, name, base64, date }) => bridge(env, 'savePdf', { kind, name, base64, date });

// Sends from Anthony's Gmail. attachments: [{ fileId }] (files saved with savePdf).
export const sendEmail = (env, mail) => bridge(env, 'email', mail);

export const nextInvoiceSeq = (env, key) => bridge(env, 'nextInvoice', { client: key }).then((r) => r.next);
