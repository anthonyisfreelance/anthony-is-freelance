// One record per case study (page-copy/work-page.md, "Case study cards").
// Services are filter data only and never show on the card.
import type { ImageMetadata } from 'astro';
import { URLS } from './site';
import drinkFinder from '../assets/home/drink-finder.jpg';
import eastAtHome from '../assets/home/east-at-home.jpg';
import wideFitShoes from '../assets/home/wide-fit-shoes.jpg';
import screen from '../assets/home/innovation-screen.png';
import badgeDrinkFinder from '../assets/home/badge-drink-finder.png';
import badgeEastAtHome from '../assets/home/badge-east-at-home.png';
import projektityyny from '../assets/work/projektityyny.jpg';
import fuzzball from '../assets/work/fuzzball.jpg';
import hartnack from '../assets/services/bespoke.jpg';
import thameen from '../assets/services/theme.jpg';
import whistlefish from '../assets/services/ux.jpg';

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
  meta: string;
  claim: string;
  proof: string;
  href?: string; // no link until the case study page exists
  image?: ImageMetadata;
  screen?: ImageMetadata;
  badge?: ImageMetadata;
  badgeAlt?: string;
  services: FilterId[];
}

const p = (slug: string) => `/portfolio/${slug}/`;

export const CASE_STUDIES: CaseStudy[] = [
  {
    client: 'East at Home', meta: 'Food & drink · 2025',
    claim: '82% more revenue after a mobile-first redesign',
    proof: 'October to June vs the same months a year earlier. GA4, UK sessions.',
    href: URLS.caseStudies.eastAtHome, image: eastAtHome,
    badge: badgeEastAtHome, badgeAlt: 'UK eCommerce Awards 2026 winner: UK User Experience of the Year',
    services: ['bespoke-store-design', 'shopify-cro', 'shopify-ux-design'],
  },
  {
    client: 'Drink Finder', meta: 'Food & drink · 2025',
    claim: '34% more website sales after moving to Shopify',
    proof: 'September to February vs the same months a year earlier. EPoS till data, marketplaces excluded.',
    href: URLS.caseStudies.drinkFinder, image: drinkFinder, screen,
    badge: badgeDrinkFinder, badgeAlt: 'UK eCommerce Awards 2026 winner: UK eCommerce Website of the Year',
    services: ['migrations', 'bespoke-store-design', 'shopify-cro'],
  },
  {
    client: 'Projektityyny', meta: 'Home · 2026',
    claim: 'A mobile-first store launch for a Nordic-inspired textiles brand',
    proof: 'PageSpeed 93 [CONFIRM date, device]. Over 80% of visitors on mobile.',
    href: p('projektityyny-shopify-website-design-case-study'), image: projektityyny,
    services: ['bespoke-store-design'],
  },
  {
    client: 'Hartnack & Co', meta: 'Stationery & gifts · 2025',
    claim: 'A bespoke store that sells made-to-order books online',
    proof: 'Landing pages by use, from business binders to pilot log books, help customers picture the product in their life.',
    href: p('hartnack-and-co-shopify-website-design-case-study'), image: hartnack,
    services: ['bespoke-store-design', 'shopify-ux-design'],
  },
  {
    client: 'Thameen London', meta: 'Beauty · 2025',
    claim: 'Off headless, onto a premium theme the team runs themselves',
    proof: '"A journey that feels both effortless for the customer and truly reflective of Thameen\'s luxury positioning." Nour Abdel-Motaal',
    href: p('thameen-london-shopify-website-design-case-study'), image: thameen,
    services: ['theme-customisations'],
  },
  {
    client: 'Fuzzball', meta: 'Pets · 2025',
    claim: 'A subscription redesign for a pet food brand',
    proof: 'The menu carries quality, delivery and how-it-works messages, so people trust the subscription before signing up.',
    href: p('fuzzball-shopify-website-design-case-study'), image: fuzzball,
    services: ['subscriptions', 'shopify-cro'],
  },
  {
    client: 'Whistlefish', meta: 'Stationery & gifts · 2025',
    claim: 'A Shopify 2.0 redesign their own team now builds on',
    proof: '"We\'ve since been able to carry that framework into our own design team." Will Manders',
    href: p('whistlefish-2-0-shopify-website-design-case-study'), image: whistlefish,
    services: ['bespoke-store-design', 'shopify-ux-design', 'shopify-cro'],
  },
  {
    client: 'Wide Fit Shoes', meta: 'Fashion · 2025',
    claim: 'A theme rebuild running both the UK and US stores',
    proof: 'Product cards show width and colours before the click, on a palette built for WCAG AAA contrast [CONFIRM scope].',
    href: URLS.caseStudies.wideFitShoes, image: wideFitShoes,
    services: ['theme-customisations'],
  },
  {
    client: 'East West Apparel', meta: 'Fashion · [CONFIRM year]',
    claim: 'A WooCommerce to Shopify migration that lifted sales',
    proof: '"The increase in sales because of it." Jamie Lee, Owner',
    href: p('east-west-apparel-shopify-website-design-case-study'),
    services: ['migrations'],
  },
  {
    client: 'Window Fleur', meta: 'Home · [CONFIRM year]',
    claim: '[CONFIRM: what the project was and what it changed]',
    proof: "Brand patterns carry key shopping messages through the store, in a way that's fun and memorable.",
    href: p('window-fleur-shopify-case-study'),
    services: ['bespoke-store-design', 'subscriptions'],
  },
  {
    client: 'Dr Lipp', meta: 'Beauty · [CONFIRM year]',
    claim: 'A re-theme that gave the team a section library to build with',
    proof: '[CONFIRM: one design decision]',
    href: p('dr-lipp-shopify-website-case-study'),
    services: ['theme-customisations'],
  },
  {
    client: 'Jing Tea', meta: 'Food & drink · [CONFIRM year]',
    claim: 'A Shopify Plus redesign for a luxury tea brand',
    proof: 'A gold and earth palette widened with neutrals, with gold kept for key actions.',
    href: p('jing-tea-shopify-website-design-case-study'),
    services: ['theme-customisations'],
  },
  {
    // Newest launch (brief, 18 October 2026). No case study page yet, so no link.
    client: 'Sensational Eyes', meta: 'Beauty · 2026',
    claim: '[CONFIRM: a theme customisation for a relaunched under-eye treatment, and what it changed]',
    proof: '[CONFIRM: one design decision]',
    services: ['theme-customisations'],
  },
];

export const WORK_META = {
  title: 'Shopify Case Studies | Freelance Shopify Designer UK',
  description:
    'Shopify case studies from freelance Shopify designer Anthony Bliss. Named UK brands, what changed, and every result with its window and source.',
  path: URLS.work,
};

export const WORK_HERO = {
  eyebrow: 'Shopify case studies',
  // Brand count always matches the grid.
  heading: `${CASE_STUDIES.length} brands, 2 UK eCommerce Awards, 1 designer`,
  intro: 'My Shopify case studies since I went independent in 2023. Each card shows the job each store needed, and the key win.',
};

export const WORK_TRUST = ['20+ years ecommerce and brand experience', '4× shortlisted, UK eCommerce Awards 2026'];
