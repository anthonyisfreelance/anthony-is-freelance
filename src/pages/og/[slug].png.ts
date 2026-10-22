// og:image for every article, made at build time from its category (no hand-made images).
// 1200 x 675 (16:9), the category mark on the raised surface, no text: Google advises against text
// in the image a page marks up for previews, and the title already shows beside the thumbnail.
// The article page shows the same artwork as its hero, so the page and the thumbnail match.
import type { APIRoute } from 'astro';
import sharp from 'sharp';
import { ARTICLES_LIST, articleSlug, type Article } from '../../data/articles';
import { COVER_MARKS, MARK_POSITION } from '../../data/article-covers';

const W = 1200;
const H = 675;

export function getStaticPaths() {
  return ARTICLES_LIST.map((article) => ({ params: { slug: articleSlug(article) }, props: { article } }));
}

export const GET: APIRoute = async ({ props }) => {
  const { article } = props as { article: Article };
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
