// Writes dist/sitemap.xml after the build from the pages that were actually built, so it can
// never list a page that doesn't exist. Pages with a noindex robots tag (404, thank-you) and the
// generated article covers are left out. Same address as the WordPress sitemap.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

async function htmlFiles(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await htmlFiles(p)));
    else if (e.name === 'index.html') out.push(p);
  }
  return out;
}

export default function sitemap() {
  let site;
  return {
    name: 'aif-sitemap',
    hooks: {
      'astro:config:done': ({ config }) => { site = config.site.replace(/\/$/, ''); },
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const urls = [];
        for (const file of await htmlFiles(root)) {
          const html = await readFile(file, 'utf8');
          if (/<meta name="robots" content="[^"]*noindex/.test(html)) continue;
          const rel = relative(root, file).split(sep).slice(0, -1).join('/');
          urls.push(`${site}/${rel ? `${rel}/` : ''}`);
        }
        urls.sort((a, b) => a.length - b.length || a.localeCompare(b));
        const xml =
          '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n') +
          '\n</urlset>\n';
        await writeFile(join(root, 'sitemap.xml'), xml);
        logger.info(`sitemap.xml: ${urls.length} pages`);
      },
    },
  };
}
