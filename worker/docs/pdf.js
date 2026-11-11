// PDFs from the same HTML as the pages, through Cloudflare Browser Rendering (the BROWSER binding).
// One browser per call, however many PDFs: the free plan allows one new browser every 20 seconds.

import puppeteer from '@cloudflare/puppeteer';

export async function renderPdfs(env, htmlList) {
  // Local testing only: a placeholder PDF per page, so the flows run without a browser.
  if (env.DOCS_FAKE_PDF === '1') return htmlList.map(() => new TextEncoder().encode('%PDF-1.4\n% test\n'));
  if (!env.BROWSER) throw new Error('PDF rendering is not set up (BROWSER binding).');
  let browser;
  for (let attempt = 0; attempt < 3 && !browser; attempt++) {
    try {
      browser = await puppeteer.launch(env.BROWSER);
    } catch (e) {
      // Rate limited: wait and try again.
      if (attempt === 2) throw e;
      await new Promise((r) => setTimeout(r, 8000));
    }
  }
  try {
    const out = [];
    for (const html of htmlList) {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
      await page.evaluate(() => document.fonts.ready);
      out.push(new Uint8Array(await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true })));
      await page.close();
    }
    return out;
  } finally {
    await browser.close();
  }
}

export function toBase64(bytes) {
  return Buffer.from(bytes).toString('base64');
}
