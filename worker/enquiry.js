// /api/enquiry: the start-a-project form. Emails each enquiry to Anthony through Resend
// (resend.com), with the sender's address as Reply-To so a reply goes straight back to them.
//
// Works with and without JavaScript:
//   - the form's script posts with Accept: application/json and shows the result in place;
//   - a plain form post gets a 303 to /contact/thanks/ (or back to the form with ?enquiry=error).
//
// Spam: a hidden honeypot field ("company") and a minimum fill time ("t", set by the form's script).
// Bots that fill the honeypot or submit in under three seconds get a quiet success and no email.
//
// Settings (Cloudflare dashboard > Worker > Settings > Variables and secrets):
//   RESEND_API_KEY  secret, from resend.com (a domain verified there, e.g. mail.anthonyis.uk)
//   ENQUIRY_FROM    e.g. "Anthony is Freelance <enquiries@mail.anthonyis.uk>"
//   ENQUIRY_TO      where enquiries land; defaults to hello@anthonyis.uk

const TO = 'hello@anthonyis.uk';
const MIN_FILL_MS = 3000;
const LIMITS = { name: 120, email: 200, website: 300, budget: 60, message: 5000, found: 80, page: 300 };
const EMAIL = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;

export async function enquiry(request, env) {
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
  };

  // Honeypot or too fast: pretend it worked, send nothing.
  const started = Number(form.get('t'));
  if (String(form.get('company') || '') !== '') return reply(true);
  if (started && Date.now() - started < MIN_FILL_MS) return reply(true);

  if (!d.name || !EMAIL.test(d.email)) return reply(false, 'Please add your name and a valid email address.');

  if (!env.RESEND_API_KEY || !env.ENQUIRY_FROM) {
    return reply(false, `The form isn't connected yet. Please email ${env.ENQUIRY_TO || TO} instead.`, 503);
  }

  const lines = [
    ['Name', d.name],
    ['Email', d.email],
    ['Website', d.website],
    ['Budget', d.budget],
    ['Found me through', d.found],
    ['Sent from', d.page],
  ].filter(([, v]) => v);
  const text = `${lines.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${d.message || '(No message)'}\n`;
  const html =
    `<table cellpadding="4" style="font-family:sans-serif;font-size:14px">${lines
      .map(([k, v]) => `<tr><td style="color:#666">${esc(k)}</td><td>${esc(v)}</td></tr>`)
      .join('')}</table>` +
    `<p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${esc(d.message || '(No message)')}</p>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: env.ENQUIRY_FROM,
      to: [env.ENQUIRY_TO || TO],
      reply_to: d.email,
      subject: `Project enquiry: ${d.name}${d.budget ? ` (${d.budget})` : ''}`,
      text,
      html,
    }),
  }).catch(() => null);

  if (!res || !res.ok) {
    return reply(false, `Sorry, that didn't send. Please try again, or email ${env.ENQUIRY_TO || TO}.`, 502);
  }
  return reply(true);
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}
