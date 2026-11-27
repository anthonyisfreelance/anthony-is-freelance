// One shape for every sector page (food and drink first, then beauty and fragrance, home and
// interiors), so all three run in the same order. Template: src/components/SectorPage.astro.
import type { ImageMetadata } from 'astro';

export type Link = { label: string; href: string };
type Card = { client: string; meta: string; claim: string; proof: string; href?: string; image?: ImageMetadata; badge?: ImageMetadata; badgeAlt?: string };
type Tile = { text: string; note?: string; google?: boolean; stars?: boolean; href?: string; reviews?: boolean };

export interface SectorPage {
  meta: {
    title: string;
    description: string;
    path: string;
    /** Breadcrumb label, e.g. "Food and drink brands". */
    name: string;
    serviceName: string;
    serviceType: string;
    audience: string;
    /** Live at its address for review links only: noindex, out of the sitemap, menus and footer. */
    unlisted?: boolean;
  };
  /** The H1 has no eyebrow on sector pages: the sector claim is the whole heading. */
  hero: { heading: string; intro: string; cta: Link; image?: ImageMetadata; imageAlt?: string; imagePosition?: string; trust: Tile[] };
  sector: { eyebrow: string; heading: string; paragraphs: string[] };
  needs: { eyebrow: string; heading: string; intro?: string; items: { title: string; body: string }[] };
  work: { eyebrow: string; heading: string; intro?: string; cards: Card[]; note?: string; link?: Link };
  innovations?: { eyebrow: string; heading: string; intro?: string; items: { client: string; title: string; body: string }[]; link?: Link };
  quotes?: { eyebrow: string; heading: string; items: { quote: string; cite: string; logo?: string; href?: string }[] };
  after: { eyebrow: string; heading: string; paragraphs: string[]; link?: Link };
  routing: { eyebrow: string; heading: string; intro?: string; routes: { situation: string; body: string; links: Link[] }[] };
  faqs: { eyebrow: string; heading: string; items: { q: string; a: string[] }[] };
  cta: { eyebrow: string; heading: string };
  more?: { eyebrow: string; heading: string; links: Link[] };
}
