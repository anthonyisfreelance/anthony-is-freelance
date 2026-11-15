// /api/enquiry: the start-a-project form. Two emails go out through Resend (resend.com), both
// designed in worker/docs/emails.js:
//   - the enquiry to Anthony, with a button that opens the lead on his Leads page ready to reply
//     from Gmail (and the sender's address as Reply-To, so the mail app's own Reply works too);
//   - "Thanks for getting in touch" to the sender, so they meet the brand and know what happens next.
//
// Each enquiry is also saved as a lead in the documents admin (docs.anthonyis.uk/admin/leads/,
// worker/docs/leads.js), with whether they ticked the box for occasional news. If saving fails the
// enquiry still counts as sent: the email to Anthony is the record that matters.
//
// The second one goes to an address nobody has checked, so it is fenced in: it carries none of the
// text they typed (only a plain first name), each address gets at most one a day, and the whole form
// is limited to a few sends a minute per visitor (ENQUIRY_RL in wrangler.jsonc). If it fails, the
// enquiry itself still counts as sent.
//
// Works with and without JavaScript:
//   - the form's script posts with Accept: application/json and shows the result in place;
//   - a plain form post gets a 303 to /contact/thanks/ (or back to the form with ?enquiry=error).
//
// Spam: a hidden honeypot field ("company") and a minimum fill time ("t", set by the form's script).
// Bots that fill the honeypot or submit in under three seconds get a quiet success and no email.
// automated() below catches the junk that gets past both.
//
// Settings (Cloudflare dashboard > Worker > Settings > Variables and secrets):
//   RESEND_API_KEY  secret, from resend.com (a domain verified there, e.g. mail.anthonyis.uk)
//   ENQUIRY_FROM    e.g. "Anthony Bliss <hello@mail.anthonyis.uk>" (set in wrangler.jsonc)
//   ENQUIRY_TO      where enquiries land; defaults to hello@anthonyis.uk

import { enquiryNotice, enquiryReceivedEmail } from './docs/emails.js';
import { createDoc } from './docs/bridge.js';
import { newLead, leadFileName } from './docs/leads.js';
import { newToken } from './docs/auth.js';

const TO = 'hello@anthonyis.uk';
const MIN_FILL_MS = 3000;
const LIMITS = { name: 120, email: 200, website: 300, budget: 60, message: 5000, found: 80, page: 300 };
const EMAIL = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;

// A few sends a minute per visitor. Without the binding (local testing) nothing is limited.
async function underLimit(env, request) {
  if (!env.ENQUIRY_RL) return true;
  try {
    const { success } = await env.ENQUIRY_RL.limit({ key: request.headers.get('cf-connecting-ip') || 'unknown' });
    return success;
  } catch {
    return true;
  }
}

// One thank-you email per address per day. Kept in this data centre's cache, keyed by a hash of the
// address, so it is approximate (a visitor routed elsewhere could get a second one) but needs no
// database and stores no addresses.
async function firstToday(request, email) {
  if (typeof caches === 'undefined') return true;
  try {
    const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(email.toLowerCase()));
    const hash = [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('');
    const key = new Request(new URL(`/__enquiry-replied/${hash}`, request.url));
    if (await caches.default.match(key)) return false;
    await caches.default.put(key, new Response('1', { headers: { 'cache-control': 'max-age=86400' } }));
    return true;
  } catch {
    return true;
  }
}

async function send(env, message) {
  // Local testing only: no key, so the email is logged instead of sent.
  if (!env.RESEND_API_KEY && env.DOCS_DEV === '1') {
    console.log(`[enquiry] email to ${message.to}: ${message.subject}`);
    return true;
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: env.ENQUIRY_FROM, ...message }),
  }).catch(() => null);
  return Boolean(res && res.ok);
}

// Junk that gets past the honeypot. A form-filling bot puts the same thing in every box, or pastes
// this site's own address as "their" website: nobody real does either, so those get the quiet
// "sent" and nothing happens. A message that is only a link is less certain, so it still reaches
// Anthony, marked as possible spam, but nobody is emailed a thank-you and no news tick is kept.
const squash = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
function automated(d, { script, started }) {
  // The form's own script always says when the form was opened; a scripted send without it isn't the form.
  if (script && !started) return 'junk';
  if (/:\/\/|www\./i.test(d.name)) return 'junk';
  if (/(^|[^a-z0-9-])anthonyis\.uk/i.test(d.website)) return 'junk';
  if (d.message && d.website && squash(d.message) === squash(d.website)) return 'junk';
  if (/^\W*(https?:\/\/|www\.)\S+\W*$/i.test(d.message)) return 'suspect';
  return '';
}

export async function enquiry(request, env, ctx) {
  const wantsJson = (request.headers.get('accept') || '').includes('application/json');
  const reply = (ok, error, status) =>
    wantsJson
      ? json(ok ? { ok: true } : { ok: false, error }, status || (ok ? 200 : 400))
      : Response.redirect(new URL(ok ? '/contact/thanks/' : '/contact/?enquiry=error#start-a-project', request.url), 303);

  if (request.method !== 'POST') return json({ error: 'Not found' }, 404);

  let form;
  try {
    form = await request.formData();
  } catch {
    return reply(false, 'The form could not be read. Please try again.');
  }
  const get = (k) => String(form.get(k) || '').trim().slice(0, LIMITS[k] || 200);
  const d = {
    name: get('name'),
    email: get('email'),
    website: get('website'),
    budget: get('budget'),
    message: get('message'),
    found: get('found'),
    page: get('page'),
    // The unticked "occasional news" box. Only an explicit tick counts.
    news: String(form.get('news') || '') === 'yes',
  };

  // Honeypot or too fast: pretend it worked, send nothing.
  const started = Number(form.get('t'));
  if (String(form.get('company') || '') !== '') return reply(true);
  if (started && Date.now() - started < MIN_FILL_MS) return reply(true);

  if (!d.name || !EMAIL.test(d.email)) return reply(false, 'Please add your name and a valid email address.');

  const bot = automated(d, { script: wantsJson, started });
  if (bot === 'junk') {
    console.log('[enquiry] dropped as automated');
    return reply(true);
  }
  if (bot === 'suspect') {
    d.suspect = true;
    d.news = false;
  }
  // The lead's id, made now so the email to Anthony can link straight to it.
  d.token = newToken();

  if ((!env.RESEND_API_KEY || !env.ENQUIRY_FROM) && env.DOCS_DEV !== '1') {
    return reply(false, `The form isn't connected yet. Please email ${env.ENQUIRY_TO || TO} instead.`, 503);
  }
  if (!(await underLimit(env, request))) {
    return reply(false, `Too many tries in a short time. Please wait a minute, or email ${env.ENQUIRY_TO || TO}.`, 429);
  }

  const sent = await send(env, { to: [env.ENQUIRY_TO || TO], reply_to: d.email, ...enquiryNotice(d) });
  if (!sent) {
    return reply(false, `Sorry, that didn't send. Please try again, or email ${env.ENQUIRY_TO || TO}.`, 502);
  }

  // The thank-you to the sender: after the response, and never a reason for the form to fail.
  const thanks = (async () => {
    if (d.suspect || !(await firstToday(request, d.email))) return;
    const ok = await send(env, { to: [d.email], reply_to: env.ENQUIRY_TO || TO, ...enquiryReceivedEmail({ name: d.name }) });
    if (!ok) console.error('[enquiry] thank-you email did not send');
  })();
  // The lead for the admin's Leads page, saved to Drive after the response.
  const lead = newLead({ ...d, source: d.suspect ? 'Website form (possible spam)' : undefined });
  const save = createDoc(env, lead, leadFileName(lead)).catch((e) => console.error('[enquiry] lead not saved:', e.message));

  const after = Promise.all([thanks, save]);
  if (ctx?.waitUntil) ctx.waitUntil(after);
  else await after;
  return reply(true);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}
