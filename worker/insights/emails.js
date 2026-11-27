// Emails from the insights platform. Phase 1 has two, both to Anthony only, through Resend: the
// login code and the notice after every login. They use the docs email layout (worker/docs/emails.js).

import { layout, p, note, facts, codeBlock, DISPLAY } from '../docs/emails.js';
import { esc } from '../docs/shared.js';

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
