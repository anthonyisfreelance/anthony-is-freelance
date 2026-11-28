// AI engines. Each one has the same small interface, so others can be added later:
//
//   engine.ask({ prompt, country }) -> { text, citations: [{ url, title }], searches, usage: { input, output }, model }
//
// Phase 1 has ChatGPT only, through the OpenAI Responses API with web search on. The prompt is sent
// alone (no system prompt, no instructions), so the answer stays close to a plain ChatGPT question.
//
// INSIGHTS_FAKE_AI=1 swaps in canned answers, so every flow runs locally without a key.

import { hash } from './text.js';

export class EngineError extends Error {
  constructor(message, { retry = true, rateLimited = false } = {}) {
    super(message);
    this.retry = retry;
    this.rateLimited = rateLimited;
  }
}

const OPENAI = 'https://api.openai.com/v1/responses';
// chat-latest is OpenAI's alias for the Instant model ChatGPT uses (checked 27 Nov 2026). The model
// that actually answered is saved on every answer, so a change behind the alias shows in the data.
export const DEFAULT_ENGINE_MODEL = 'chat-latest';
const TIMEOUT_MS = 120 * 1000;

// The engines, by the id saved on runs and answers. ChatGPT always runs; Google AI Mode runs once
// the DataForSEO login is set in Cloudflare (or INSIGHTS_FAKE_GOOGLE_AI=1 for local tests).
export const ENGINES = { chatgpt: 'ChatGPT', google_ai_mode: 'Google AI Mode' };
export const engineName = (id) => ENGINES[id] || ENGINES.chatgpt;

export function enginesOn(env) {
  const on = ['chatgpt'];
  if ((env.DATAFORSEO_LOGIN && env.DATAFORSEO_PASSWORD) || env.INSIGHTS_FAKE_GOOGLE_AI === '1') on.push('google_ai_mode');
  return on;
}

export function engineFor(env, id = 'chatgpt') {
  if (id === 'google_ai_mode') return env.INSIGHTS_FAKE_AI === '1' || env.INSIGHTS_FAKE_GOOGLE_AI === '1' ? fakeGoogleEngine : dataforseoEngine(env);
  if (env.INSIGHTS_FAKE_AI === '1') return fakeEngine;
  return openaiEngine(env);
}

export function openaiEngine(env) {
  const model = env.INSIGHTS_ENGINE_MODEL || DEFAULT_ENGINE_MODEL;
  return {
    id: 'chatgpt',
    async ask({ prompt, country = 'GB' }) {
      if (!env.OPENAI_API_KEY) throw new EngineError('OPENAI_API_KEY is not set in Cloudflare.', { retry: false });
      const res = await openaiCall(env, {
        model,
        input: prompt,
        tools: [{ type: 'web_search', user_location: { type: 'approximate', country } }],
        // Answers are kept here, not on OpenAI's side.
        store: false,
      });
      return readResponse(res, model);
    },
  };
}

// One call to the Responses API. Rate limits and server errors are retried later by the runner.
export async function openaiCall(env, body) {
  let res;
  try {
    res = await fetch(env.OPENAI_URL || OPENAI, {
      method: 'POST',
      headers: { authorization: `Bearer ${env.OPENAI_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (e) {
    throw new EngineError(e?.name === 'TimeoutError' ? 'OpenAI took too long to answer.' : 'Could not reach OpenAI.');
  }
  if (res.status === 429) {
    const text = await res.text().catch(() => '');
    // "insufficient_quota" is the account being out of credit, not a busy minute.
    if (/insufficient_quota/.test(text)) throw new EngineError('The OpenAI account is out of credit or over its spending limit.', { retry: false });
    throw new EngineError('OpenAI rate limit. Will try again shortly.', { rateLimited: true });
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    let detail = '';
    try {
      detail = JSON.parse(text)?.error?.message || '';
    } catch {}
    const msg = `OpenAI said ${res.status}${detail ? `: ${detail.slice(0, 200)}` : ''}`;
    throw new EngineError(msg, { retry: res.status >= 500 || res.status === 408 });
  }
  return res.json();
}

// Text, cited links and search count from a Responses API result. Citations are the url_citation
// annotations on the answer text; tracking parameters are stripped and repeats dropped.
export function readResponse(res, model) {
  if (res?.status && res.status !== 'completed' && res.status !== 'incomplete') {
    throw new EngineError(`OpenAI returned a ${res.status} response.`);
  }
  let text = '';
  let searches = 0;
  const seen = new Map();
  for (const item of res?.output || []) {
    if (item.type === 'web_search_call') searches++;
    if (item.type !== 'message') continue;
    for (const part of item.content || []) {
      if (part.type === 'refusal') text += part.refusal || '';
      if (part.type !== 'output_text') continue;
      text += (text ? '\n\n' : '') + (part.text || '');
      for (const a of part.annotations || []) {
        if (a.type !== 'url_citation') continue;
        const url = cleanUrl(a.url);
        if (url && !seen.has(url)) seen.set(url, { url, title: String(a.title || '').slice(0, 300) });
      }
    }
  }
  if (!text.trim()) throw new EngineError('OpenAI returned an empty answer.');
  return {
    text: text.slice(0, 60000),
    citations: [...seen.values()].slice(0, 60),
    searches,
    usage: { input: int(res.usage?.input_tokens), output: int(res.usage?.output_tokens) },
    model: String(res.model || model).slice(0, 80),
  };
}

const int = (n) => Math.max(0, Math.round(Number(n) || 0));

/* ---------- Google AI Mode, through DataForSEO ---------- */

// Live mode: one request, an answer in about 6 seconds, $0.004 each (checked 28 Nov 2026). Waiting
// on DataForSEO doesn't count towards the Workers CPU limit. Location United Kingdom, in English.
const DATAFORSEO = 'https://api.dataforseo.com/v3/serp/google/ai_mode/live/advanced';

export function dataforseoEngine(env) {
  return {
    id: 'google_ai_mode',
    async ask({ prompt }) {
      if (!env.DATAFORSEO_LOGIN || !env.DATAFORSEO_PASSWORD) throw new EngineError('The DataForSEO login is not set in Cloudflare.', { retry: false });
      let res;
      try {
        res = await fetch(env.DATAFORSEO_URL || DATAFORSEO, {
          method: 'POST',
          headers: { authorization: `Basic ${btoa(`${env.DATAFORSEO_LOGIN}:${env.DATAFORSEO_PASSWORD}`)}`, 'content-type': 'application/json' },
          body: JSON.stringify([{ keyword: String(prompt).slice(0, 700), location_name: 'United Kingdom', language_code: 'en', device: 'desktop' }]),
          signal: AbortSignal.timeout(TIMEOUT_MS),
        });
      } catch (e) {
        throw new EngineError(e?.name === 'TimeoutError' ? 'DataForSEO took too long to answer.' : 'Could not reach DataForSEO.');
      }
      if (res.status === 401) throw new EngineError('DataForSEO did not accept the login. Check the two secrets in Cloudflare.', { retry: false });
      if (res.status === 402) throw new EngineError('The DataForSEO account is out of credit.', { retry: false });
      if (res.status === 429) throw new EngineError('DataForSEO rate limit. Will try again shortly.', { rateLimited: true });
      if (!res.ok) throw new EngineError(`DataForSEO said ${res.status}.`, { retry: res.status >= 500 });
      return readAiMode(await res.json());
    },
  };
}

// The answer text and its sources from an AI Mode result. DataForSEO reports problems as status
// codes inside the body: 20000 is fine, 402xx is money, 5xxxx is on their side.
export function readAiMode(json) {
  const task = json?.tasks?.[0];
  const code = Number(task?.status_code ?? json?.status_code);
  if (code !== 20000) {
    const msg = `DataForSEO said ${code || 'nothing'}${task?.status_message ? `: ${String(task.status_message).slice(0, 160)}` : ''}`;
    if (code >= 40200 && code < 40300) throw new EngineError(`${msg}. The account may be out of credit.`, { retry: false });
    throw new EngineError(msg, { retry: !code || code >= 50000 });
  }
  const items = (task.result?.[0]?.items || []).filter((i) => i && i.type === 'ai_overview');
  let text = '';
  const seen = new Map();
  const add = (r) => {
    const url = cleanUrl(r?.url);
    if (url && !seen.has(url)) seen.set(url, { url, title: String(r.title || r.source || '').slice(0, 300) });
  };
  for (const item of items) {
    const body = item.markdown || (item.items || []).map((e) => e.markdown || e.text || '').filter(Boolean).join('\n\n');
    if (body) text += (text ? '\n\n' : '') + body;
    for (const e of item.items || []) for (const r of e.references || []) add(r);
    for (const r of item.references || []) add(r);
  }
  if (!text.trim()) throw new EngineError('Google AI Mode gave no answer for this question.');
  return { text: text.slice(0, 60000), citations: [...seen.values()].slice(0, 60), searches: 0, usage: { input: 0, output: 0 }, model: 'google-ai-mode' };
}

// Tracking parameters added by AI engines and ad platforms. Everything else in the address stays.
const TRACKING = /^(utm_[a-z]+|gclid|fbclid|msclkid|mc_cid|mc_eid|_hsenc|_hsmi|ref_src|srsltid)$/i;
export function cleanUrl(raw) {
  let u;
  try {
    u = new URL(String(raw || ''));
  } catch {
    return '';
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return '';
  for (const k of [...u.searchParams.keys()]) if (TRACKING.test(k)) u.searchParams.delete(k);
  u.hash = '';
  return u.href.slice(0, 1000);
}

/* ---------- Fake engine (INSIGHTS_FAKE_AI=1, and the samples) ---------- */

// Made-up businesses for canned answers. The brand being tracked is mentioned in roughly half of
// them, at a varying place in the list, so the dashboard has something to show.
const FAKE_NAMES = ['Harbourline Studio', 'Copperleaf Commerce', 'Northcove Digital', 'Brightwater Agency', 'Fernhill Design Co.', 'Tidemark Studio', 'Kestrel & Finch', 'Quayside Labs'];
const FAKE_SITES = ['https://www.example-rankings.co.uk/best-agencies-uk/', 'https://www.example-directory.com/uk/top-firms/', 'https://blog.example-reviews.net/freelance-vs-agency/', 'https://www.example-awards.org.uk/winners-2026/'];

export const fakeEngine = {
  id: 'chatgpt',
  // `brand` and `attempt` are passed only so canned answers can vary; real engines ignore them.
  async ask({ prompt, brand, attempt }) {
    if (/\bfail-always\b/i.test(prompt)) throw new EngineError('Canned failure for testing.');
    return fakeAnswer(prompt, brand, attempt);
  },
};

// Google AI Mode for local tests: the same made-up businesses, picked differently.
export const fakeGoogleEngine = {
  id: 'google_ai_mode',
  async ask({ prompt, brand, attempt }) {
    if (/\bfail-always\b/i.test(prompt)) throw new EngineError('Canned failure for testing.');
    return { ...fakeAnswer(prompt, brand, (attempt || 0) + 100), searches: 0, usage: { input: 0, output: 0 }, model: 'fake-ai-mode' };
  },
};

export function fakeAnswer(prompt, brand, attempt = 0) {
  const h = hash(`${prompt}|${attempt}`);
  const own = brand?.match_names?.[0] || brand?.name || 'Example Studio';
  const domain = brand?.match_domains?.[0] || 'example.com';
  const names = [...FAKE_NAMES].sort((a, b) => hash(a + h) - hash(b + h)).slice(0, 4);
  const mention = h % 2 === 0;
  if (mention) names.splice(h % 4, 0, own);
  const lines = names.map((n, i) => `${i + 1}. **${n}** — ${i % 2 ? 'a specialist in conversion-focused store design' : 'known for bespoke builds and migrations'}.`);
  const cheap = h % 5 === 0 ? '\n\nIf budget is tight, a cheaper template-based option may be enough.' : '';
  const text = `Here are some options worth looking at for "${prompt}":\n\n${lines.join('\n')}${cheap}\n\nCompare portfolios and ask for references before deciding.`;
  const citations = [
    { url: `${FAKE_SITES[h % FAKE_SITES.length]}?utm_source=openai`, title: 'Best agencies in the UK (2026)' },
    { url: FAKE_SITES[(h + 1) % FAKE_SITES.length], title: 'Directory of design firms' },
  ];
  if (mention && h % 3 === 0) citations.push({ url: `https://${domain}/work/?utm_source=openai`, title: `${own}: work` });
  return {
    text,
    citations: citations.map((c) => ({ ...c, url: cleanUrl(c.url) })),
    searches: 1 + (h % 2),
    usage: { input: 9000 + (h % 4000), output: 300 + (h % 200) },
    model: 'fake-chat',
  };
}
