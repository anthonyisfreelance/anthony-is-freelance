// og:image for every article, 1200 x 675 (16:9), made at build time. The article's tile from Figma
// when it has one (src/assets/articles/<slug>/tile.png), otherwise its category mark on the raised
// surface. The article page shows the same picture as its hero, so the page and the thumbnail match.
import type { APIRoute } from 'astro';
import sharp from 'sharp';
import { ARTICLES_LIST, articleSlug, type Article } from '../../data/articles';
import { COVER_MARKS, MARK_POSITION } from '../../data/article-covers';
import { articleTilePath } from '../../data/media';
import { existsSync } from 'node:fs';

const W = 1200;
const H = 675;

export function getStaticPaths() {
  return ARTICLES_LIST.map((article) => ({ params: { slug: articleSlug(article) }, props: { article } }));
}

export const GET: APIRoute = async ({ props }) => {
  const { article } = props as { article: Article };
  const tile = articleTilePath(articleSlug(article));
  if (existsSync(tile)) {
    const png = await sharp(tile).resize(W, H, { fit: 'cover' }).png({ compressionLevel: 9 }).toBuffer();
    return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
  }
  const size = (MARK_POSITION.width / 100) * W;
  const x = (MARK_POSITION.left / 100) * W;
  const y = (MARK_POSITION.top / 100) * H;
  const scale = size / 200;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#1b1b1b"/>
  <g transform="translate(${x} ${y}) scale(${scale})" fill="none" stroke="#ffffff" stroke-width="${(3 / scale).toFixed(3)}" color="#ffffff">
    ${COVER_MARKS[article.category]}
  </g>
</svg>`;
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
