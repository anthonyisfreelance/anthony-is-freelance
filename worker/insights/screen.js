// A phone-sized screenshot of the brand's homepage (its first domain), shown in the summary.
//
// Taken with Cloudflare Browser Rendering (the BROWSER binding the PDFs use) when a run starts,
// and with the Take screenshot button. One per brand, kept in D1 and replaced each time. The free
// plan allows 10 minutes of browser time a day; a screenshot takes about 10 seconds.
//
// INSIGHTS_FAKE_AI=1 (local work) saves a drawn placeholder instead of opening a browser.

import puppeteer from '@cloudflare/puppeteer';
import { db, now } from './db.js';
import { esc } from '../docs/shared.js';

// An iPhone (390 by 844) in Safari: the status bar takes the top 47 points and Safari's bottom bar
// about 83, so the page itself shows in 390 by 714. The phone frame on the summary draws both bars.
const PHONE = { width: 390, height: 714, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1';

export function homepageOf(brand) {
  const d = (brand.match_domains || [])[0];
  return d ? `https://${d}/` : null;
}

export async function takeScreen(env, brand) {
  const url = homepageOf(brand);
  if (!url) return { ok: false, error: 'Add a domain in Settings first.' };
  let bytes;
  let type = 'image/jpeg';
  let tint = '#ffffff';
  if (env.INSIGHTS_FAKE_AI === '1') {
    bytes = new TextEncoder().encode(placeholderSvg(brand.name));
    type = 'image/svg+xml';
  } else {
    if (!env.BROWSER) return { ok: false, error: 'Browser Rendering is not set up (BROWSER binding).' };
    const browser = await puppeteer.launch(env.BROWSER);
    try {
      const page = await browser.newPage();
      await page.setViewport(PHONE);
      await page.setUserAgent(UA);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise((r) => setTimeout(r, 1500));
      tint = await page.evaluate(topColour).catch(() => '#ffffff');
      bytes = new Uint8Array(await page.screenshot({ type: 'jpeg', quality: 70 }));
    } finally {
      await browser.close();
    }
  }
  await db(env)
    .prepare(`INSERT INTO shots (brand_id, url, type, image, tint, taken_at) VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(brand_id) DO UPDATE SET url = excluded.url, type = excluded.type, image = excluded.image, tint = excluded.tint, taken_at = excluded.taken_at`)
    .bind(brand.id, url, type, bytes, cleanColour(tint), now())
    .run();
  return { ok: true };
}

export async function screenInfo(env, brandId) {
  return db(env).prepare(`SELECT url, tint, taken_at FROM shots WHERE brand_id = ?`).bind(brandId).first();
}

// Runs in the page: the page's theme colour if it sets one, otherwise the first solid background
// behind the top centre of the screen. Safari tints its status bar the same way.
function topColour() {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta && meta.content) return meta.content;
  let el = document.elementFromPoint(195, 2);
  while (el) {
    const c = getComputedStyle(el).backgroundColor;
    if (c && c !== 'transparent' && !/rgba\(.*,\s*0\)$/.test(c)) return c;
    el = el.parentElement;
  }
  return getComputedStyle(document.body).backgroundColor || '#ffffff';
}

// Only a plain colour is kept: #rgb, #rrggbb or rgb()/rgba().
export function cleanColour(c) {
  const v = String(c || '').trim();
  if (/^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(v)) return v;
  const m = v.match(/^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})/i);
  if (m) return `#${m.slice(1, 4).map((n) => Math.min(255, Number(n)).toString(16).padStart(2, '0')).join('')}`;
  return '#ffffff';
}

// Dark text on light colours, light text on dark ones.
export function isDark(hex) {
  let h = cleanColour(hex).slice(1);
  if (h.length === 3) h = h.split('').map((x) => x + x).join('');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.299 * r + 0.587 * g + 0.114 * b < 140;
}

export async function screenImage(env, brandId) {
  const row = await db(env).prepare(`SELECT type, image FROM shots WHERE brand_id = ?`).bind(brandId).first();
  if (!row?.image) return null;
  return { type: row.type, bytes: new Uint8Array(row.image) };
}

// A drawn stand-in for local work and the samples: a made-up store homepage.
export function placeholderSvg(name) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 714" width="390" height="714">
<rect width="390" height="714" fill="#f4efe6"/>
<rect width="390" height="56" fill="#ffffff"/><rect x="16" y="22" width="20" height="2" fill="#1d2b36"/><rect x="16" y="28" width="20" height="2" fill="#1d2b36"/><rect x="16" y="34" width="20" height="2" fill="#1d2b36"/>
<text x="195" y="35" font-family="Georgia, serif" font-size="15" text-anchor="middle" fill="#1d2b36">${esc(String(name).toUpperCase())}</text>
<rect y="56" width="390" height="430" fill="#3d6a7d"/><path d="M0 400 Q 100 360 200 395 T 390 380 V486 H0Z" fill="#2c5161"/>
<text x="24" y="372" font-family="Georgia, serif" font-size="30" fill="#ffffff">Made for the</text><text x="24" y="408" font-family="Georgia, serif" font-size="30" fill="#ffffff">coast</text>
<rect x="24" y="430" width="150" height="40" fill="#ffffff"/><text x="99" y="455" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="#1d2b36">SHOP NEW IN</text>
<rect x="16" y="510" width="173" height="200" fill="#d9cfbf"/><rect x="201" y="510" width="173" height="200" fill="#c4b59d"/>
<rect x="16" y="722" width="120" height="10" fill="#1d2b36"/><rect x="201" y="722" width="100" height="10" fill="#1d2b36"/>
<rect x="16" y="740" width="50" height="8" fill="#8a7f70"/><rect x="201" y="740" width="50" height="8" fill="#8a7f70"/>
</svg>`;
}
