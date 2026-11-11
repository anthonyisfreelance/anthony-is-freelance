// Short automated emails (one-time codes, notices to Anthony) through Resend, the same account the
// enquiry form uses. Client correspondence (quotes, signed contracts, invoices) goes from Anthony's
// Gmail through the Drive bridge instead, so it sits in his Sent folder and replies reach him.

import { esc } from './shared.js';

export async function resend(env, { to, subject, text, html }) {
  if (!env.RESEND_API_KEY) {
    console.log(`[docs] email to ${to}: ${subject}\n${text}`);
    return { dev: true };
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: env.DOCS_FROM || 'Anthony is Freelance <documents@mail.anthonyis.uk>',
      to: Array.isArray(to) ? to : [to],
      reply_to: 'hello@anthonyis.uk',
      subject,
      text,
      html: html || `<div style="font-family:sans-serif;font-size:15px;line-height:1.5">${esc(text).replace(/\n/g, '<br>')}</div>`,
    }),
  });
  if (!res.ok) throw new Error(`Email could not be sent (${res.status}).`);
  return res.json();
}
