// Article covers (Figma "Article/Cover" and "Article/Cover mark"). Every article gets its category's
// line mark, made once, so a cover never needs making by hand. The same marks build the og:image
// (src/pages/og/[slug].png.ts), which has no text in it, as Google advises for preview images.
// Marks are drawn on a 200 x 200 grid.
import type { ArticleCategory } from './articles';

export const COVER_MARKS: Record<ArticleCategory, string> = {
  'shopify-cro': '<path d="M8 152H52V112H96V72H140V32H184"/><path d="M164 32H184V52"/>',
  'design-and-ux': '<rect x="20" y="20" width="160" height="160"/><path d="M20 60H180M73 60V180M127 60V180M73 120H180"/>',
  'shopify-platform': '<path d="M100 20L180 60L100 100L20 60Z"/><path d="M20 100L100 140L180 100"/><path d="M20 140L100 180L180 140"/>',
  'ecommerce-strategy': '<circle cx="100" cy="100" r="80"/><circle cx="100" cy="100" r="50"/><circle cx="100" cy="100" r="20"/><circle cx="100" cy="100" r="5" fill="currentColor" stroke="none"/>',
  news: '<path d="M100 20V180M20 100H180M43 43L157 157M157 43L43 157"/>',
};

// Where the mark sits on a 16:9 cover, as in Figma: 125% of the cover's height, set right and
// bleeding off the top, so it reads as artwork rather than an icon.
export const MARK_POSITION = { left: 40.94, top: -12, width: 70.31 }; // % of the cover's width (top: % of its height)
