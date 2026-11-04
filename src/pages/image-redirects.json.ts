// Old WordPress image URLs (/wp-content/uploads/...) and where each one lives now (4 November 2026).
// Google Images still holds the old addresses for images that ranked, so the worker 301s each one
// to the same picture on the new site. Built from the WordPress media library export:
//   article body images  the same file in src/assets/articles/<slug>/
//   article heroes       that article's tile (the hero and card since the rebuild)
//   case study, project, service and about heroes   the photo that leads the new page
// The map is src/data/wp-image-redirects.json (old path under uploads/ to a file under src/assets/).
// This file turns each target into its built URL, which the worker reads (worker/index.js).
import type { APIRoute } from 'astro';
import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';
import MAP from '../data/wp-image-redirects.json';

const ALL = import.meta.glob<{ default: ImageMetadata }>('../assets/**/*.{jpg,jpeg,png,webp,avif}', { eager: true });

export const GET: APIRoute = async () => {
  const out: Record<string, string> = {};
  for (const [old, file] of Object.entries(MAP as Record<string, string>)) {
    const src = ALL[`../assets/${file}`]?.default;
    if (!src) throw new Error(`image-redirects: no file at src/assets/${file}`);
    const img = await getImage({ src, width: Math.min(1600, src.width), format: 'webp', quality: 80 });
    out[`/wp-content/uploads/${old}`] = img.src;
  }
  return new Response(JSON.stringify(out), { headers: { 'content-type': 'application/json' } });
};
