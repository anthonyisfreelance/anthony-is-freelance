// One shape for every sector page (food and drink first, then beauty and fragrance, home and
// interiors), so all three run in the same order. Template: src/components/SectorPage.astro.
//
// Order (27 November 2026): hero, the case studies, the results in big numbers, a full-width photo,
// UX examples, client quotes, a full-width photo, an image grid of what sells, FAQs, more, the form.
// Headings carry the message; body copy under a heading only where it adds a fact.
import type { ImageMetadata } from 'astro';

export type Link = { label: string; href: string };
type Card = { client: string; meta: string; claim: string; proof: string; href?: string; image?: ImageMetadata; badge?: ImageMetadata; badgeAlt?: string };
type Tile = { text: string; note?: string; google?: boolean; stars?: boolean; href?: string; reviews?: boolean };
/** A full-width client photo, the size of the strip under the services hub hero. */
export type Strip = { image: ImageMetadata; alt: string; position?: string };

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
  work: { eyebrow: string; heading: string; cards: Card[]; note?: string; link?: Link };
  /** Big blue numbers beside a photo, as the homepage results section. Each figure carries its window and source. */
  results?: { eyebrow: string; heading: string; image: ImageMetadata; imageAlt?: string; items: { number: string; label: string; caption: string }[] };
  strips?: { afterResults?: Strip; afterQuotes?: Strip };
  innovations?: { eyebrow: string; heading: string; items: { client: string; title: string; body: string }[]; link?: Link };
  quotes?: { eyebrow: string; heading: string; items: { quote: string; cite: string; logo?: string; href?: string }[] };
  /** An image grid, as the services hub's service cards: a phone screen from a live store on each tile. */
  sells?: { eyebrow: string; heading: string; items: { client: string; title: string; body: string; screen: ImageMetadata; alt: string; href?: string }[] };
  faqs: { eyebrow: string; heading: string; items: { q: string; a: string[] }[] };
  cta: { eyebrow: string; heading: string };
  more?: { eyebrow: string; heading: string; links: Link[] };
}
