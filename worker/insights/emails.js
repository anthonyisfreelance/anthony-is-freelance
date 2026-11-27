// Emails from the insights platform. To Anthony, through Resend: the login code and the notice after
// every login. To a client, from Anthony's Gmail: the report email. All use the docs email layout
// (worker/docs/emails.js).

import { layout, p, note, facts, codeBlock, button, signOff, firstName, textSig, DISPLAY } from '../docs/emails.js';
import { esc, fmtDate } from '../docs/shared.js';

export function insightsCodeEmail({ code, ip, place }) {
  const where = [ip, place].filter(Boolean).join(', ');
  return {
    subject: `${code} is your insights login code`,
    text: `Your login code for the insights admin is:\n\n${code}\n\nIt lasts 10 minutes.${where ? ` Requested from ${where}.` : ''} If this wasn't you, don't share it: nobody can log in without it.`,
    html: layout({
      title: 'Login code',
      footer: false,
      preheader: 'Your login code for the insights admin.',
      head: ['Insights', 'Login'],
      body: `${p('Your login code for the insights admin is:')}
${codeBlock(code)}
${note(`It lasts 10 minutes.${where ? ` Requested from ${esc(where)}.` : ''} If this wasn't you, don't share it: nobody can log in without it.`)}`,
    }),
  };
}

export function insightsLoginNotice({ host, when, ip, place, ua }) {
  const rows = [['When', when], ['IP address', ip || 'Unknown'], ['Location', place || 'Unknown'], ['Browser', ua || 'Unknown']];
  return {
    subject: 'New login to your insights admin',
    text: `Someone just logged in to ${host}/admin/.\n\n${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nIf this wasn't you, change DOCS_SECRET in Cloudflare (Worker > Settings > Variables and secrets). That logs everyone out of insights and documents straight away.`,
    html: layout({
      title: 'New login',
      footer: false,
      preheader: `Logged in from ${place || ip || 'an unknown place'}.`,
      head: ['Insights', 'New login'],
      body: `${p('Someone just logged in to the insights admin.')}
${facts(rows)}
${note(`If this wasn't you, change <b style="font-family:${DISPLAY};font-weight:500">DOCS_SECRET</b> in Cloudflare (Worker &gt; Settings &gt; Variables and secrets). That logs everyone out of insights and documents straight away.`)}`,
    }),
  };
}

// The email that sends a report to a client, from Anthony's Gmail through the Drive bridge, with
// the PDF attached. Nothing is sent until Anthony approves this wording (INSIGHTS_REPORT_EMAIL).
export function reportEmail({ base, report, brand }) {
  const link = `${base}/report/${report.token}/`;
  const a = report.data.after || report.data;
  const b = report.kind === 'compare' ? report.data.before : null;
  const when = b ? `comparing ${fmtDate(b.run.started_at, 'long')} with ${fmtDate(a.run.started_at, 'long')}` : `from ${fmtDate(a.run.started_at, 'long')}`;
  const name = firstName(report.recipient_name);
  const what = b ? 'before and after report' : 'report';
  return {
    subject: `Your AI visibility ${what}: ${brand.name}`,
    text: `Hi ${name},

Here's your AI visibility ${what} for ${brand.name}, ${when}. It shows how ChatGPT answers the questions your buyers ask: how often it names you, who it names instead, and the sources it relies on.

Read it online:
${link}

There's a PDF copy attached. Any questions, just reply to this email.

Thanks,
${textSig}`,
    html: layout({
      title: `AI visibility: ${brand.name}`,
      preheader: `How ChatGPT answers the questions your buyers ask, ${when}.`,
      head: ['AI visibility', brand.name],
      body: `${p(`Hi ${esc(name)},`)}
${p(`Here's your AI visibility ${what} for ${esc(brand.name)}, ${esc(when)}. It shows how ChatGPT answers the questions your buyers ask: how often it names you, who it names instead, and the sources it relies on.`)}
${facts([
  ['Visibility score', `${a.score.score} out of 100${b ? ` (was ${b.score.score})` : ''}`],
  ['Named in', `${a.rates.all ?? 0}% of answers${b ? ` (was ${b.rates.all ?? 0}%)` : ''}`],
])}
${button(link, 'Read the report')}
${p('There’s a PDF copy attached. Any questions, just reply to this email.')}
${signOff()}`,
    }),
  };
}
