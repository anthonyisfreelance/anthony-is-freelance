// Downloads the Figma assets listed in figma-assets.json and writes them in place.
// Photos are re-encoded to the extension in the manifest; SVGs are written as-is.
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const manifest = JSON.parse(await readFile(new URL('./figma-assets.json', import.meta.url)));
let failed = 0;

for (const [path, url] of Object.entries(manifest)) {
  if (path.startsWith('_')) continue;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (path.endsWith('.svg')) await writeFile(path, buf);
    else if (path.endsWith('.jpg')) await sharp(buf).jpeg({ quality: 90, mozjpeg: true }).toFile(path);
    else await sharp(buf).png().toFile(path);
    console.log('ok   ', path);
  } catch (err) {
    failed++;
    console.log('FAIL ', path, err.message);
  }
}
process.exit(failed ? 1 : 0);
