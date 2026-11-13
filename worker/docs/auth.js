// Signed tokens for the two one-time-code flows (client signing, admin login) and the admin
// session. Nothing is stored server-side: each cookie carries its own HMAC, keyed by DOCS_SECRET.

const enc = new TextEncoder();
const b64url = (buf) =>
  btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64url = (s) => {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
};

async function key(secret) {
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

export async function hmac(secret, text) {
  return b64url(await crypto.subtle.sign('HMAC', await key(secret), enc.encode(text)));
}

export async function sha256Hex(text) {
  const d = await crypto.subtle.digest('SHA-256', enc.encode(text));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// { ...data, exp } -> "payload.signature"
export async function seal(secret, data, seconds) {
  const payload = b64url(enc.encode(JSON.stringify({ ...data, exp: Date.now() + seconds * 1000 })));
  return `${payload}.${await hmac(secret, payload)}`;
}

export async function unseal(secret, token) {
  if (!token || !secret) return null;
  const [payload, sig] = String(token).split('.');
  if (!payload || !sig) return null;
  const ok = await crypto.subtle.verify('HMAC', await key(secret), unb64url(sig), enc.encode(payload));
  if (!ok) return null;
  try {
    const data = JSON.parse(new TextDecoder().decode(unb64url(payload)));
    return data.exp > Date.now() ? data : null;
  } catch {
    return null;
  }
}

export function newCode() {
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 1000000;
  return String(n).padStart(6, '0');
}

export function newToken(bytes = 16) {
  return b64url(crypto.getRandomValues(new Uint8Array(bytes)));
}

export function getCookie(request, name) {
  const header = request.headers.get('cookie') || '';
  for (const part of header.split(/;\s*/)) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i) === name) return decodeURIComponent(part.slice(i + 1));
  }
  return null;
}

// Lax so links from emails open logged in; POSTs are separately checked to come from this site.
export function cookie(name, value, seconds) {
  return `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${seconds}; HttpOnly; Secure; SameSite=Lax`;
}

// Constant-time compare for short strings.
export function same(a, b) {
  a = String(a);
  b = String(b);
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
