// Bits every service page shares, so wording stays identical across all nine.
import { URLS } from '../site';
import { CASE_STUDIES } from '../work';
import { ALL_SERVICES, formatPrice } from '../services';

/** A proof card, copied from the work page record so the wording matches everywhere. */
export const card = (client: string) => {
  const s = CASE_STUDIES.find((c) => c.client === client);
  if (!s) throw new Error(`No case study record for ${client}`);
  return { client: s.client, meta: s.meta, claim: s.claim, proof: s.proof, href: s.href, image: s.image, badge: s.badge, badgeAlt: s.badgeAlt };
};

export const caseStudyHref = (client: string) => card(client).href ?? '';

/** The hub's price sentence for a service, e.g. "From £5,000 + VAT", so all pages agree. */
export const hubPrice = (name: string) => {
  const s = ALL_SERVICES.find((x) => x.name === name);
  if (!s) throw new Error(`No hub price for ${name}`);
  return `${formatPrice(s.price)}, design only`;
};

export const ROUTING_EYEBROW = 'Honest Shopify advice';
export const PRICE_NOTE = 'Prices checked September 2026. Every project is quoted individually once the brief is defined.';
export const PROCESS_INTRO =
  'Every project starts with a UX review of your live store, and the navigation is where I look first, because it shows how a store really sells. Then your reviews, your data and your customers. And one question I ask on every project: would I buy this?';
export const TRUST_COMMON = ['20+ years of brand and ecommerce experience', '4× shortlisted, UK eCommerce Awards 2026'];
export const QUOTE = { label: 'Get a quote', href: '#start-a-project' };
export const ALL_ARTICLES = { label: 'View all articles', href: URLS.articles };

export const ARTICLE = {
  productCards: { category: 'Design and UX', title: 'Shopify Product Card Design: The Art of Cards That Convert', href: '/articles/shopify-product-card-design/' },
  goodConversion: { category: 'Shopify CRO', title: 'What Is a Good Conversion Rate on Shopify?', href: '/articles/good-conversion-rate-shopify/' },
  increaseConversion: {
    category: 'Shopify CRO',
    title: 'How to Increase Conversion Rates on Your Shopify Store',
    href: '/articles/how-to-increase-conversion-rates-on-your-shopify-store/',
  },
  uxReview: { category: 'Design and UX', title: "What Is a Shopify UX Review (And Why It's Where Every Project Should Start)", href: '/articles/shopify-ux-review/' },
  productComparisons: {
    category: 'Design and UX',
    title: 'Product Comparisons for Shopify Stores: How Better UX Boosts Conversions',
    href: '/articles/product-comparisons-for-shopify-stores-how-better-ux-boosts-conversions/',
  },
};

/** The CRO vs UX design table appears on both pages, word for word. */
export const CRO_VS_UX = {
  eyebrow: 'Shopify CRO vs UX design',
  heading: 'Which does your store need?',
  caption: 'Shopify CRO and Shopify UX design compared',
  rows: [
    ['The question', 'Why aren’t enough visitors buying?', 'How do customers find, compare and choose?'],
    ['Starts with', 'Analytics and drop-off points', 'A UX review of the whole journey'],
    ['Scope', 'The steps that lose sales', 'Navigation, product discovery and flows'],
    ['Measured by', 'Conversion rate and average order value', 'Easier journeys, then sales'],
    ['Best when', 'The store works, but has stalled', 'The range is big, or the journey is the problem'],
  ] as [string, string, string][],
};

/** The theme vs bespoke table, shared by the bespoke and theme pages. */
export const THEME_VS_BESPOKE = { eyebrow: 'Shopify theme vs bespoke', heading: 'Which suits your store?' };
export const THEME_VS_BESPOKE_ROWS: [string, string, string][] = [
  ['How it’s designed', 'Every template and the entire purchase journey designed bespoke to your brand, products and users', 'A premium theme redesigned: the key templates, like the header and product page, in Figma, and the rest straight into the theme'],
  ['How it fits your products', 'Every element shaped around your brand and products', 'Your products fitted to a theme made for thousands of stores'],
  ['Navigation', 'Designed bespoke around your range', 'What the theme supports, plus custom sections'],
  ['Best for', 'Brands with the analytics data to make decisions and fine-tune each part of the store to their products', 'Launching a new store or if you are moving quickly'],
];
