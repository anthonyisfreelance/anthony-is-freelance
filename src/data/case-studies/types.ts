// The shape every case study page fills in. The template is src/components/case-study/CaseStudyPage.astro,
// set by the Drink Finder page (approved 20 October 2026). Each client's copy lives in its own file here.
import type { ImageMetadata } from 'astro';
import { brandImage, brandVideo } from '../media';
import { CASE_STUDIES } from '../work';
import { INNOVATIONS_LIST } from '../innovations';
import { URLS } from '../site';

/**
 * A still image, with an optional screen recording (public path to an MP4) that plays over it.
 * No image yet: the page shows a grey placeholder with `label`, so it's clear what goes there.
 */
export interface Media {
  image?: ImageMetadata;
  alt: string;
  video?: string;
  label?: string;
}

export interface Link { label: string; href: string }

export interface Highlight {
  eyebrow: string;
  heading: string;
  body: string;
  media: Media;
  link?: Link;
  /** Media on the left. Left out, rows alternate: first row media right, then left. */
  flip?: boolean;
}

/**
 * A 50/50 block that sits between work rows: a lifestyle photo and a phone screen on a tint picked
 * from the photo. `after` is how many work rows come before it (2 = after the second row).
 */
export interface SplitScreen { media: Media; device: 'phone' | 'desktop' }

export interface Split {
  /** How many work rows come before it. Left out: halfway (after row 2 of 4 or 5, row 3 of 6). */
  after?: number;
  label: string;
  photo: Media;
  /** One phone beside the photo. */
  screen?: Media;
  /**
   * Several screens that scroll past a sticky square photo, for example phone, desktop, phone
   * (Figma "Property 1=50/50" 48323:17501, 27 October 2026). Used instead of `screen`.
   */
  screens?: SplitScreen[];
  /** The flat colour behind the screen, taken from the photo (Figma: a 60% tint over white). */
  tint: string;
  caption?: string;
  /** Which side the photo sits on, desktop. Left out: left. */
  photoSide?: 'left' | 'right';
}

export interface Card {
  client: string; meta: string; claim: string;
  image?: ImageMetadata; badge?: ImageMetadata; badgeAlt?: string; href?: string;
}

export interface CaseStudyPageData {
  meta: { path: string; title: string; description: string; breadcrumbs: { name: string; path: string }[] };
  /** The store the page is about, for schema and the Website row. */
  client: { name: string; url?: string; display?: string; parent?: string };
  hero: { eyebrow: string; figure?: string; heading: string; standfirst: string; image: Media };
  brief: { eyebrow: string; heading: string; body: string[] };
  details: {
    sector: string;
    services: Link[];
    live: string;
    liveIso?: string;
    /** Rows between Live and Recognition: Results and Measured, or Designed for, In their words, Theme. */
    rows: { label: string; value: string }[];
    recognition?: { text: string; badge: ImageMetadata; badgeAlt: string };
  };
  showcase: { label: string; background?: ImageMetadata; desktop: Media; phones: Media[] };
  workIntro: { eyebrow: string; heading: string; body: string };
  highlights: Highlight[];
  /**
   * Optional sticky gallery after the showcase. Since 23 October 2026 the pages use `splits` between
   * the work rows instead, each after the row it backs up; a page can still have both.
   */
  gallery?: { label: string; listLabel?: string; screens: Media[]; photo: Media; caption: string };
  splits?: Split[];
  /** Full-bleed photo with a screen over it. Left out on pages that end the work on a plain row. */
  feature?: { background?: ImageMetadata; eyebrow: string; heading: string; body: string; media: Media; link?: Link };
  /** Left out when neither the client nor an agency can give a quote. The page still goes live. */
  testimonial?: { eyebrow: string; heading: string; quote: string; cite: string };
  more: { eyebrow: string; heading: string; cards: Card[] };
}

// ---- Helpers for the client files

export const SERVICE = {
  branding: { label: 'Branding', href: URLS.branding },
  bespoke: { label: 'Bespoke store design', href: URLS.bespoke },
  ux: { label: 'Shopify UX design', href: URLS.ux },
  cro: { label: 'Shopify CRO', href: URLS.cro },
  migrations: { label: 'Migrations', href: URLS.migrations },
  subscriptions: { label: 'Subscriptions', href: URLS.subscriptions },
  theme: { label: 'Theme customisations', href: URLS.theme },
};

/**
 * A screen that drops in by file name, no code needed:
 *   still      src/assets/brands/<brand>/<name>.jpg (or .png, .webp)
 *   recording  public/video/<brand>/<name>.mp4
 * Until the still is there the page shows a placeholder named after `label`.
 */
export const slot = (brand: string, name: string, alt: string, label: string): Media => ({
  image: brandImage(brand, name),
  video: brandVideo(brand, name),
  alt,
  label,
});

/** A screen for a row that links to an innovation: the innovation's own still and recording, once added. */
export const innovationSlot = (slug: string, alt: string, label: string): Media => {
  const it = INNOVATIONS_LIST.find((i) => i.slug === slug)!;
  return { image: it.poster, video: it.video, alt, label };
};

export const innovationLink = (label: string, slug: string): Link => ({ label, href: `${URLS.innovations}#${slug}` });

/** The compact card for another case study, from its work page record. */
export const card = (name: string): Card => {
  const s = CASE_STUDIES.find((c) => c.client === name)!;
  return { client: s.client, meta: s.meta, claim: s.claim, image: s.image, badge: s.badge, badgeAlt: s.badgeAlt, href: s.href };
};

export const MORE_HEADING = { eyebrow: 'More Shopify success stories', heading: 'Other stores, other problems. Solved.' };

/**
 * The three "More success stories" cards for a case study, picked by rule rather than by hand, so
 * every page shows a different set and every case study gets linked to:
 * 1. the closest match: most services in common, then the same sector, then work page order;
 * 2 and 3. the next two case studies after this one in the work page order (wrapping round),
 *    skipping the first pick and, where possible, the sector already shown.
 * Only case studies with a page, a card photo and a finished claim are picked (never a [CONFIRM] one).
 */
export const moreFor = (name: string): Card[] => {
  const pool = CASE_STUDIES.filter((c) => c.href && c.image && !c.claim.includes('[CONFIRM'));
  if (!pool.some((c) => c.client === name)) pool.push(CASE_STUDIES.find((c) => c.client === name)!);
  const self = pool.find((c) => c.client === name)!;
  const sector = (c: { meta: string }) => c.meta.split(' · ')[0];
  const others = pool.filter((c) => c !== self);
  const shared = (c: (typeof pool)[number]) => c.services.filter((s) => self.services.includes(s)).length;
  const first = [...others].sort(
    (a, b) => shared(b) - shared(a) || Number(sector(b) === sector(self)) - Number(sector(a) === sector(self)) || pool.indexOf(a) - pool.indexOf(b),
  )[0];
  const start = pool.indexOf(self);
  const ring = pool.slice(start + 1).concat(pool.slice(0, start)).filter((c) => c !== first);
  const picks = [first];
  for (const pass of [true, false]) {
    for (const c of ring) {
      if (picks.length === 3) break;
      if (picks.includes(c)) continue;
      if (pass && picks.some((p) => sector(p) === sector(c))) continue;
      picks.push(c);
    }
  }
  return picks.map((c) => card(c.client));
};

export const breadcrumbs = (name: string, path: string) => [
  { name: 'Home', path: URLS.home },
  { name: 'Success stories', path: URLS.work },
  { name, path },
];

/**
 * A photo slot (hero, showcase-photo, gallery-photo, feature-photo). A file dropped in under that
 * name wins; otherwise the fallback the client file names; a hero then falls back to the card photo;
 * otherwise a placeholder.
 */
export const photo = (brand: string, name: string, fallback?: ImageMetadata): ImageMetadata | undefined =>
  brandImage(brand, name) ?? fallback ?? (name === 'hero' ? brandImage(brand, 'card') : undefined);

export const photoMedia = (brand: string, name: string, fallback?: ImageMetadata): Media => ({
  image: photo(brand, name, fallback),
  alt: '',
  label: 'Photo',
});

/**
 * The one 50/50 per page (27 October 2026, Figma 48323:17501): a lifestyle photo the full height of
 * the screen sticks while desktop screens scroll past on a tint picked from it, halfway through the
 * work. Drop in split-desktop-1 to -3 (stills or recordings). Until split-desktop-1 is there it falls
 * back to the showcase desktop still; the others show a placeholder.
 */
export const desktopSplit = (brand: string, client: string, photo: Media, tint: string, count = 3): Split => ({
  label: `${client} on desktop`,
  photo,
  screens: Array.from({ length: count }, (_, i) => {
    const m = slot(brand, `split-desktop-${i + 1}`, `The ${client} store on desktop.`, `Desktop screen ${i + 1}`);
    return { device: 'desktop' as const, media: i === 0 && !m.image ? { ...m, image: brandImage(brand, 'showcase-desktop') } : m };
  }),
  tint,
});
