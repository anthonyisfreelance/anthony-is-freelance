// Small text helpers shared by the scorer, the dashboard and the samples.

// FNV-1a: a quick, stable number from a string (for canned answers and chart colours, never security).
export function hash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// A pattern matching any of the brand's names as whole words, ignoring case.
export function namePattern(names) {
  const list = (names || []).map((n) => String(n).trim()).filter(Boolean).sort((a, b) => b.length - a.length);
  if (!list.length) return null;
  return new RegExp(`(?<![\\p{L}\\p{N}])(?:${list.map(escRe).join('|')})(?![\\p{L}\\p{N}])`, 'giu');
}

export function mentions(text, names) {
  const re = namePattern(names);
  return re ? re.test(String(text || '')) : false;
}

export function domainOf(url) {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
}

// "anthonyis.uk" matches anthonyis.uk, www.anthonyis.uk and docs.anthonyis.uk.
export function isOwnDomain(host, domains) {
  const h = String(host || '').toLowerCase().replace(/^www\./, '');
  return (domains || []).some((d) => {
    const x = String(d).toLowerCase().trim().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');
    return x && (h === x || h.endsWith(`.${x}`));
  });
}

// How a recommended name is counted across answers: "Kestrel & Finch Ltd." and "kestrel & finch"
// are the same business.
export function nameKey(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/\b(ltd|limited|llp|inc|plc)\b\.?/g, '')
    .replace(/[^\p{L}\p{N}&' ]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function list(text, max = 20) {
  return String(text || '')
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, max);
}
