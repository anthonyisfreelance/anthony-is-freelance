// One shape for every service page, so all eight run in the same order
// (page-copy/service-pages.md, "The page model"). Any image can be left out:
// the page then shows a blank block until the real one is added.
import type { ImageMetadata } from 'astro';

export type Link = { label: string; href: string };

/** Where an extra section or a "to come" marker sits, after one of the standard sections. */
export type Slot = 'trust' | 'included' | 'proof' | 'routing' | 'process' | 'innovations' | 'testimonial' | 'price' | 'comparison' | 'faqs';

export type Extra =
  | {
      kind: 'text';
      after: Slot;
      id?: string;
      eyebrow?: string;
      heading: string;
      paragraphs?: string[];
      list?: { title?: string; body: string }[];
      note?: string;
      faq?: boolean; // also goes in the FAQPage schema (heading = question, paragraphs = answer)
    }
  | { kind: 'table'; after: Slot; id?: string; eyebrow?: string; heading: string; caption: string; head: string[]; rows: string[][] }
  | { kind: 'todo'; after: Slot; title: string; note: string };

export interface ServicePage {
  meta: { title: string; description: string; path: string; name: string; serviceType: string; minPrice?: number };
  hero: { eyebrow: string; heading: string; intro: string; cta: Link; image?: ImageMetadata; imageAlt?: string; caption: string };
  trust: string[];
  included: { heading: string; items: string[] };
  fit: { heading: string; items: string[] };
  proof: {
    heading: string;
    link?: Link;
    cards: { client: string; meta: string; claim: string; proof: string; href: string; image?: ImageMetadata; badge?: ImageMetadata; badgeAlt?: string }[];
  };
  routing: { eyebrow: string; heading: string; intro?: string; routes: { situation: string; body: string; links: Link[] }[]; note?: string };
  process: { eyebrow: string; heading: string; intro: string; steps: { title: string; body: string }[] };
  innovations?: {
    eyebrow: string; heading: string; intro?: string;
    items: { client: string; title: string; body: string; screen?: ImageMetadata; video?: string }[];
  };
  testimonial?: { heading: string; quote: string; cite: string };
  price: { eyebrow: string; heading: string; notes: string[]; cta: Link; caption: string; rows: [string, string][] };
  comparison?: {
    eyebrow: string; heading: string; caption: string;
    columns: { label: string; href: string; current?: boolean }[];
    rows: [string, string, string][];
    examples?: { client: string; href: string; screen?: ImageMetadata; alt: string }[];
    notes?: string[];
  };
  faqs?: { eyebrow: string; heading: string; items: { q: string; a: string[] }[] };
  articles?: { eyebrow: string; heading: string; link: Link; items: { category: string; title: string; href: string }[] };
  extras?: Extra[];
}
