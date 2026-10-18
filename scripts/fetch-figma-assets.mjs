// Downloads the Figma assets listed in figma-assets.json and writes them in place.
// Uses curl so it respects proxy settings. Photos are re-encoded; SVGs are written as-is.
import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const manifest = JSON.parse(await readFile(new URL('./figma-assets.json', import.meta.url)));
let failed = 0;

for (const [path, url] of Object.entries(manifest)) {
  if (path.startsWith('_')) continue;
  try {
    const buf = execFileSync('curl', ['-sSfL', url], { maxBuffer: 64 * 1024 * 1024 });
    if (path.endsWith('.svg')) await writeFile(path, buf);
    else if (path.endsWith('.jpg')) await sharp(buf).flatten({ background: '#111111' }).jpeg({ quality: 90, mozjpeg: true }).toFile(path);
    else await sharp(buf).png().toFile(path);
    const meta = path.endsWith('.svg') ? '' : await sharp(path).metadata().then((m) => `${m.width}x${m.height}`);
    console.log('ok   ', path, meta);
  } catch (err) {
    failed++;
    console.log('FAIL ', path, err.message.split('\n')[0]);
  }
}
process.exit(failed ? 1 : 0);
