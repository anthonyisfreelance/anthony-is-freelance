// One record per case study (page-copy/work-page.md, "Case study cards").
// Services are filter data only and never show on the card.
import type { ImageMetadata } from 'astro';
import { URLS } from './site';
import { brandImage, brandVideo } from './media';
import badgeDrinkFinder from '../assets/site/badge-winner-2026.png';
import badgeEastAtHome from '../assets/site/badge-winner-2026.png';

export const FILTERS = [
  { id: 'bespoke-store-design', label: 'Bespoke store design' },
  { id: 'theme-customisations', label: 'Theme customisations' },
  { id: 'migrations', label: 'Migrations' },
  { id: 'shopify-cro', label: 'Shopify CRO' },
  { id: 'shopify-ux-design', label: 'Shopify UX design' },
  { id: 'subscriptions', label: 'Subscriptions' },
] as const;
type FilterId = (typeof FILTERS)[number]['id'];

export interface CaseStudy {
  client: string;
  brand: string; // folder under src/assets/brands and public/video
  meta: string;
  claim: string;
  proof: string;
  href?: string; // no link until the case study page exists
  image?: ImageMetadata;
  screen?: ImageMetadata;
  screenVideo?: string;
  badge?: ImageMetadata;
  badgeAlt?: string;
  services: FilterId[];
}

const p = (slug: string) => `/portfolio/${slug}/`;

// Card media drops in by name (Drive case-studies/<client>/): card.jpg is the lifestyle photo, used
// everywhere; card-screen.jpg is the phone shot on the work page, and card-screen.mp4 plays over it.
const RECORDS: Omit<CaseStudy, 'image' | 'screen' | 'screenVideo'>[] = [
  // Best first (work page doc, 19 October 2026). Sector and go-live month on every card.
  {
    client: 'Drink Finder', brand: 'drink-finder', meta: 'Food & drink · August 2025',
    claim: '34% more website sales after moving to Shopify',
    proof: 'September to February vs the same months a year earlier. EPoS till data, marketplaces excluded.',
    href: URLS.caseStudies.drinkFinder,
    badge: badgeDrinkFinder, badgeAlt: 'UK eCommerce Awards 2026 winner: UK eCommerce Website of the Year',
    services: ['migrations', 'bespoke-store-design', 'shopify-cro'],
  },
  {
    client: 'East at Home', brand: 'east-at-home', meta: 'Food & drink · October 2025',
    claim: '82% more revenue after a mobile-first redesign',
    proof: 'October to June vs the same months a year earlier. GA4, UK sessions.',
    href: URLS.caseStudies.eastAtHome,
    badge: badgeEastAtHome, badgeAlt: 'UK eCommerce Awards 2026 winner: UK User Experience of the Year',
    services: ['bespoke-store-design', 'shopify-cro', 'shopify-ux-design'],
  },
  {
    client: 'Fuzzball', brand: 'fuzzball', meta: 'Pets · August 2025',
    claim: '63% higher conversion rate after a subscription redesign',
    proof: 'August 2025 to August 2026 vs the same months a year earlier. GA4.',
    href: p('fuzzball-shopify-website-design-case-study'),
    services: ['subscriptions', 'shopify-cro'],
  },
  {
    client: 'Projektityyny', brand: 'projektityyny', meta: 'Home · June 2026',
    claim: 'A mobile-first store launch for a Nordic-inspired textiles brand',
    // PageSpeed dropped (19 October 2026): speed is development work, not design.
    proof: 'Every past collection stays live as a shoppable lookbook, so campaign photography keeps earning traffic.',
    href: p('projektityyny-shopify-website-design-case-study'),
    services: ['bespoke-store-design'],
  },
  {
    client: 'Thameen London', brand: 'thameen', meta: 'Beauty · March 2026',
    claim: 'Off headless, onto a premium theme the team runs themselves',
    proof: '"A journey that feels both effortless for the customer and truly reflective of Thameen\'s luxury positioning." Nour Abdel-Motaal',
    href: p('thameen-london-shopify-website-design-case-study'),
    services: ['theme-customisations'],
  },
  {
    client: 'Dr Lipp', brand: 'dr-lipp', meta: 'Beauty · May 2024',
    claim: '38% higher conversion rate after a re-theme',
    proof: 'May 2024 to February 2025 vs the previous period. Shopify Analytics.',
    href: p('dr-lipp-shopify-website-case-study'),
    services: ['theme-customisations'],
  },
  {
    client: 'Whistlefish', brand: 'whistlefish', meta: 'Stationery & gifts · April 2025',
    claim: 'A Shopify 2.0 redesign their own team now builds on',
    proof: '"We\'ve since been able to carry that framework into our own design team." Will Manders',
    href: p('whistlefish-2-0-shopify-website-design-case-study'),
    services: ['bespoke-store-design', 'shopify-ux-design', 'shopify-cro'],
  },
  {
    client: 'Wide Fit Shoes', brand: 'wide-fit-shoes', meta: 'Fashion · August 2024',
    claim: 'A theme rebuild running both the UK and US stores',
    proof: 'Product cards show width and colours before the click, on a palette built for WCAG AAA contrast [CONFIRM scope].',
    href: URLS.caseStudies.wideFitShoes,
    services: ['theme-customisations'],
  },
  {
    client: 'Hartnack & Co', brand: 'hartnack-and-co', meta: 'Stationery & gifts · June 2025',
    // No figure: GA4 shows conversion down since launch, so 39% and 91% are off (19 October 2026).
    claim: 'A bespoke store that sells made-to-order books online',
    proof: 'Landing pages by use, from business binders to pilot log books, help customers picture the product in their life.',
    href: p('hartnack-and-co-shopify-website-design-case-study'),
    services: ['bespoke-store-design', 'shopify-ux-design'],
  },
  {
    client: 'Window Fleur', brand: 'window-fleur', meta: 'Home · August 2024',
    claim: '[CONFIRM: what the project was and what it changed]',
    proof: "Brand patterns carry key shopping messages through the store, in a way that's fun and memorable.",
    href: p('window-fleur-shopify-case-study'),
    services: ['bespoke-store-design', 'subscriptions'],
  },
  {
    client: 'East West Apparel', brand: 'east-west-apparel', meta: 'Fashion · 2025',
    claim: 'A WooCommerce to Shopify migration that lifted sales',
    proof: '"The increase in sales because of it." Jamie Lee, Owner',
    href: p('east-west-apparel-shopify-website-design-case-study'),
    services: ['migrations'],
  },
  // Sensational Eyes joins once the store is stocking products (22 October 2026).
  {
    client: 'Jing Tea', brand: 'jing-tea', meta: 'Food & drink',
    claim: 'A Shopify Plus redesign for a luxury tea brand',
    proof: 'A gold and earth palette widened with neutrals, with gold kept for key actions.',
    // No case study page yet, so the card doesn't link (22 October 2026).
    services: ['theme-customisations'],
  },
];

export const CASE_STUDIES: CaseStudy[] = RECORDS.map((r) => ({
  ...r,
  image: brandImage(r.brand, 'card'),
  screen: brandImage(r.brand, 'card-screen'),
  screenVideo: brandVideo(r.brand, 'card-screen'),
}));

export const WORK_META = {
  title: 'Shopify Case Studies | Freelance Shopify Designer UK',
  description:
    'Shopify case studies from freelance Shopify designer Anthony Bliss. Named UK brands, what changed, and every result with its window and source.',
  path: URLS.work,
};

export const WORK_HERO = {
  eyebrow: 'Shopify case studies',
  heading: 'Two UK eCommerce Awards 2026, one designer.',
};

export const WORK_TRUST = ['20+ years ecommerce and brand experience', '4× shortlisted, UK eCommerce Awards 2026', 'All independent work, since 2023'];
