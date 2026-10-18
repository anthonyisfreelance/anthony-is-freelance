// One shape for every service page, so all eight run in the same order
// (page-copy/service-pages.md, "The page model").
import type { ImageMetadata } from 'astro';

type Link = { label: string; href: string };

export interface ServicePage {
  meta: { title: string; description: string; path: string; name: string; serviceType: string; minPrice?: number };
  hero: { eyebrow: string; heading: string; intro: string; cta: Link; image: ImageMetadata; imageAlt: string; caption: string };
  trust: string[];
  included: { heading: string; items: string[] };
  fit: { heading: string; items: string[] };
  proof: {
    heading: string;
    link?: Link;
    cards: { client: string; meta: string; claim: string; proof: string; href: string; image: ImageMetadata; badge?: ImageMetadata; badgeAlt?: string }[];
  };
  routing: { eyebrow: string; heading: string; intro?: string; routes: { situation: string; body: string; links: Link[] }[] };
  process: { eyebrow: string; heading: string; intro: string; steps: { title: string; body: string }[] };
  innovations?: {
    eyebrow: string; heading: string; intro?: string;
    items: { client: string; title: string; body: string; screen: ImageMetadata; backdrop?: ImageMetadata }[];
  };
  price: { eyebrow: string; heading: string; notes: string[]; cta: Link; caption: string; rows: [string, string][] };
  comparison?: {
    eyebrow: string; heading: string; caption: string;
    columns: { label: string; href: string; current?: boolean }[];
    rows: [string, string, string][];
    examples?: { client: string; href: string; screen: ImageMetadata; alt: string }[];
    note?: string;
  };
  testimonial: { heading: string; quote: string; cite: string };
  faqs: { eyebrow: string; heading: string; items: { q: string; a: string[] }[] };
  articles?: { eyebrow: string; heading: string; link: Link; items: { category: string; title: string; href: string }[] };
}
