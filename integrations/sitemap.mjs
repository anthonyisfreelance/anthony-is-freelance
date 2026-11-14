// Writes dist/sitemap.xml after the build from the pages that were actually built, so it can
// never list a page that doesn't exist. Pages with a noindex robots tag (404, thank-you) and the
// generated article covers are left out. Same address as the WordPress sitemap.
//
// Each page carries a <lastmod>: the day its own content last changed (14 November 2026).
// "Own content" is the <main> without its forms, the title and the meta description, so a change
// to the menu, the footer or the enquiry form (which sits on almost every page) doesn't mark
// every page as changed. The build hashes that content and compares it with
// the hashes from the last deploy, read from the live site's sitemap-dates.json:
//   same hash      keep the date it had
//   different hash today
//   new page       today
// Before the first deploy with this in place (or if the live file can't be read) the starting
// point is migration/sitemap-dates-seed.json: each page's hash as it stood on 14 November 2026
// and the date its source last changed in git. A date never moves unless the page really changed.
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const DATES = 'sitemap-dates.json';
const SEED = new URL('../migration/sitemap-dates-seed.json', import.meta.url);

async function htmlFiles(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await htmlFiles(p)));
    else if (e.name === 'index.html') out.push(p);
  }
  return out;
}

// Hashed asset names change on any CSS or image tweak; leave them out so only content counts.
function contentHash(html) {
  const pick = (re) => (html.match(re) || [''])[0];
  const own = pick(/<title>[\s\S]*?<\/title>/) + pick(/<meta name="description"[^>]*>/) + pick(/<main[\s\S]*<\/main>/);
  const stable = own
    .replace(/<form[\s\S]*?<\/form>/g, '')
    .replace(/\/_astro\/[^"'\s),]+/g, '/_astro/')
    .replace(/\?v=[\w-]+/g, '');
  return createHash('sha1').update(stable).digest('hex');
}

async function previousDates(site) {
  try {
    const res = await fetch(`${site}/${DATES}`, { headers: { 'cache-control': 'no-cache' } });
    if (res.ok) return { from: 'the live site', dates: await res.json() };
  } catch {}
  try {
    return { from: 'the seed file', dates: JSON.parse(await readFile(SEED, 'utf8')) };
  } catch {}
  return { from: 'nothing (every page dated today)', dates: {} };
}

export default function sitemap() {
  let site;
  return {
    name: 'aif-sitemap',
    hooks: {
      'astro:config:done': ({ config }) => { site = config.site.replace(/\/$/, ''); },
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const today = new Date().toISOString().slice(0, 10);
        const { from, dates: before } = await previousDates(site);
        const now = {};
        for (const file of await htmlFiles(root)) {
          const html = await readFile(file, 'utf8');
          if (/<meta name="robots" content="[^"]*noindex/.test(html)) continue;
          const rel = relative(root, file).split(sep).slice(0, -1).join('/');
          const url = `${site}/${rel ? `${rel}/` : ''}`;
          const hash = contentHash(html);
          const was = before[url];
          now[url] = { hash, lastmod: was && was.hash === hash && was.lastmod ? was.lastmod : today };
        }
        const urls = Object.keys(now).sort((a, b) => a.length - b.length || a.localeCompare(b));
        const xml =
          '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          urls.map((u) => `  <url><loc>${u}</loc><lastmod>${now[u].lastmod}</lastmod></url>`).join('\n') +
          '\n</urlset>\n';
        await writeFile(join(root, 'sitemap.xml'), xml);
        await writeFile(join(root, DATES), JSON.stringify(now));
        const changed = urls.filter((u) => now[u].lastmod === today).length;
        logger.info(`sitemap.xml: ${urls.length} pages, ${changed} dated today (dates from ${from})`);
      },
    },
  };
}
