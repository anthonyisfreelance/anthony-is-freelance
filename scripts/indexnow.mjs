// IndexNow: tell Bing, Yandex, Naver, Seznam and Ahrefs which pages changed in a deploy.
// Runs inside `npm run deploy` (the Workers Builds deploy command), after `npm run build`:
//
//   prepare  hash every sitemap page in dist/, compare with the manifest from the live site,
//            write the changed URLs to .indexnow-changed.json and the new manifest into dist/
//   submit   post those URLs to api.indexnow.org once the new version is live
//
// The first deploy (no manifest live yet) submits every page. A failure here never fails the deploy.
// The key file is public/<KEY>.txt; keep the two in step if the key ever changes.

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const HOST = 'anthonyis.uk';
const SITE = `https://${HOST}`;
const KEY = '62e5920bc1c67d4e89c002b8b0cdeb25';
const DIST = 'dist';
const MANIFEST = 'indexnow-manifest.json';
const CHANGED = '.indexnow-changed.json';

// Hashed asset names change on every CSS or image tweak; ignore them so only real page changes count.
const normalise = (html) => html.replace(/\/_astro\/[^"'\s),]+/g, '/_astro/').replace(/\?v=[\w-]+/g, '');
const hash = (s) => createHash('sha1').update(s).digest('hex');

function pagesFromSitemap() {
  const xml = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

function fileFor(url) {
  const path = new URL(url).pathname.replace(/^\/|\/$/g, '');
  return join(DIST, path, 'index.html');
}

async function prepare() {
  const now = {};
  for (const url of pagesFromSitemap()) {
    const file = fileFor(url);
    if (existsSync(file)) now[url] = hash(normalise(readFileSync(file, 'utf8')));
  }
  let live = {};
  try {
    const res = await fetch(`${SITE}/${MANIFEST}`, { headers: { 'cache-control': 'no-cache' } });
    if (res.ok) live = await res.json();
  } catch {}
  const changed = Object.keys(now).filter((url) => live[url] !== now[url]);
  writeFileSync(join(DIST, MANIFEST), JSON.stringify(now));
  writeFileSync(CHANGED, JSON.stringify(changed));
  console.log(`[indexnow] ${changed.length} of ${Object.keys(now).length} pages changed`);
}

async function submit() {
  if (!existsSync(CHANGED)) return console.log('[indexnow] nothing prepared');
  const urlList = JSON.parse(readFileSync(CHANGED, 'utf8'));
  if (!urlList.length) return console.log('[indexnow] no changed pages');
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
    });
    console.log(`[indexnow] submitted ${urlList.length} URLs: HTTP ${res.status}`);
  } catch (e) {
    console.log(`[indexnow] submit failed (deploy unaffected): ${e.message}`);
  }
}

const step = process.argv[2];
try {
  if (step === 'prepare') await prepare();
  else if (step === 'submit') await submit();
  else console.log('usage: node scripts/indexnow.mjs prepare|submit');
} catch (e) {
  console.log(`[indexnow] ${step} failed (deploy unaffected): ${e.message}`);
}
