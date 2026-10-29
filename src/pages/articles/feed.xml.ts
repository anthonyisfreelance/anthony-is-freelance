// RSS feed of the articles, newest first. The WordPress feed addresses (/feed/ and
// /articles/feed/) 301 here (public/_redirects).
import type { APIRoute } from 'astro';
import { ARTICLES_LIST } from '../../data/articles';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]!);

export const GET: APIRoute = ({ site }) => {
  const base = site!.href.replace(/\/$/, '');
  const items = ARTICLES_LIST.map((a) => {
    const url = base + a.href;
    return `    <item>
      <title>${esc(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${a.date}T09:00:00Z`).toUTCString()}</pubDate>
      <description>${esc(a.excerpt)}</description>
    </item>`;
  }).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Shopify Articles | Anthony is Freelance</title>
    <link>${base}/articles/</link>
    <atom:link href="${base}/articles/feed.xml" rel="self" type="application/rss+xml" />
    <description>Shopify design, UX and conversion articles by Anthony Bliss.</description>
    <language>en-gb</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } });
};
