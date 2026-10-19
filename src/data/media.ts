// Drop-in media. Files are found by where they sit, so adding one needs no code:
//   images  src/assets/brands/<brand>/...           (optimised by Astro at build)
//   videos  public/video/<brand>/<name>.mp4         (served as they are)
//   article images  src/assets/articles/<article slug>/<file name from WordPress>
// See src/assets/brands/README.md for the folders and file names.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { ImageMetadata } from 'astro';

const IMAGES = import.meta.glob<{ default: ImageMetadata }>('../assets/brands/**/*.{jpg,jpeg,png,webp,avif}', { eager: true });
const ARTICLE_IMAGES = import.meta.glob<{ default: ImageMetadata }>('../assets/articles/**/*.{jpg,jpeg,png,webp,avif}', { eager: true });

/** An article's image at src/assets/articles/<slug>/<file>, if it has been added. */
export function articleImage(slug: string, file: string): ImageMetadata | undefined {
  return ARTICLE_IMAGES[`../assets/articles/${slug}/${file}`]?.default;
}

/** The image at src/assets/brands/<brand>/<name>.<any image type>, if it has been added. */
export function brandImage(brand: string, name: string): ImageMetadata | undefined {
  const prefix = `../assets/brands/${brand}/${name}.`;
  const key = Object.keys(IMAGES).find((k) => k.startsWith(prefix));
  return key ? IMAGES[key].default : undefined;
}

/** The public URL of public/video/<brand>/<name>.mp4, if it has been added. */
export function brandVideo(brand: string, name: string): string | undefined {
  const path = `/video/${brand}/${name}.mp4`;
  return existsSync(join(process.cwd(), 'public', path)) ? path : undefined;
}
