// Food and drink sector page (27 November 2026, unlisted). Copy from the Claude doc
// "Sector page: Shopify design for food and drink brands". The template is SectorPage.astro.
//
// Six rules keep this page off the homepage's broad terms (agreed 27 November 2026):
//   1. "Designer" always has the sector attached. Never "Shopify designer UK" or "Shopify expert".
//   2. "Designer" sits in the title tag, the H1 and the byline link only. H2 eyebrows use sector nouns.
//   3. No "UK" beside "designer".
//   4. Sector first in the URL and the title tag.
//   5. One link to the homepage, anchored "freelance Shopify designer", in the byline.
//   6. Links into this page use sector anchors, e.g. "Shopify design for food and drink brands".
import { URLS, GOOGLE_RATING, LAUNCH_COUNT } from '../site';
import { card } from '../service-pages/shared';
import type { SectorPage } from './types';
import heroImage from '../../assets/brands/east-at-home/feature-photo.jpg';

const CARTMASTERS = 'https://cartmasters.co.uk/';

export const FOOD_AND_DRINK: SectorPage = {
  meta: {
    title: 'Food and Drink Shopify Designer | Anthony is Freelance',
    description:
      'Shopify design for food and drink brands by Anthony Bliss. Drink Finder and East at Home both won at the UK eCommerce Awards 2026. Every result sourced.',
    path: '/food-and-drink-shopify-designer/',
    name: 'Food and drink brands',
    serviceName: 'Shopify design for food and drink brands',
    serviceType: 'Food and drink ecommerce website design',
    audience: 'Food and drink brands',
    // Live at its address for review links: noindex, out of the sitemap, menus and footer. Delete to launch.
    unlisted: true,
  },
  hero: {
    // No eyebrow on sector page H1s: the sector claim is the whole heading (27 November 2026).
    heading: 'Shopify designer for food and drink brands',
    intro: `My two UK eCommerce Award wins in 2026 were both for food and drink stores. I design every screen myself, with 20+ years of brand and ecommerce experience, and team up with the Shopify developers who have built all ${LAUNCH_COUNT} of my launches since 2023.`,
    cta: { label: 'Start a food and drink project', href: '#start-a-project' },
    image: heroImage,
    imageAlt: '',
    trust: [
      { text: 'Winner: UK eCommerce Website of the Year 2026', href: URLS.caseStudies.drinkFinder },
      { text: 'Winner: UK User Experience of the Year 2026', href: URLS.caseStudies.eastAtHome },
      GOOGLE_RATING,
      { text: 'Built by Cartmasters', href: CARTMASTERS },
    ],
  },
  sector: {
    eyebrow: 'Food and drink ecommerce',
    heading: 'Nobody can taste it through a screen.',
    paragraphs: [
      'Food and drink ecommerce asks people to buy with one sense missing. In a shop they’d pick up the jar, read the label and ask what it goes with. Online, the product card and the product page have to do that work, often on a phone.',
      'Most customers have bought something like it before. So the store also has to make it easy to compare, add a few more and come back. I start with what customers would ask in the shop, and design the store to answer it.',
    ],
  },
  needs: {
    eyebrow: 'Food and drink Shopify stores',
    heading: 'What they need to sell well.',
    intro: 'Food and drink Shopify stores need to answer questions before anyone asks them. These are the seven I design for.',
    items: [
      { title: 'Answers on the product card.', body: 'Heat, dietary needs, reviews and price, before anyone clicks.' },
      { title: 'A way to compare similar products.', body: 'A shelf of sauces or a wall of wine looks alike until the card shows what’s different.' },
      { title: 'Navigation and search built for the range.', body: 'Twelve products and 5,000 products need different routes in.' },
      { title: 'Savings for buying more, shown plainly.', body: 'Multi-buy offers on the product page, with no countdown timers.' },
      { title: 'A basket that shows what the next spend unlocks.', body: 'Free delivery or a gift, as a progress bar and not a pop-up.' },
      { title: 'Mix and match.', body: 'Bundles customers build themselves, on a phone.' },
      { title: 'Delivery costs before the basket.', body: 'When it arrives and what it costs, on the product page.' },
    ],
  },
  work: {
    eyebrow: 'Food and drink Shopify work',
    heading: 'Two stores, two UK eCommerce Awards.',
    intro: 'My food and drink Shopify work includes Drink Finder, a Cornish wine and spirits merchant, and East at Home, a curry sauce brand. I designed both, and [Cartmasters](https://cartmasters.co.uk/) built them.',
    cards: [card('Drink Finder'), card('East at Home')],
    note: 'Both stores were shortlisted in a second category: Drink Finder for Food & Drink eCommerce Website of the Year, and East at Home for B2C eCommerce Website of the Year.',
    link: { label: 'View all Shopify success stories', href: URLS.work },
  },
  innovations: {
    eyebrow: 'Food and drink UX examples',
    heading: 'Ideas shaped by what’s on the shelf.',
    intro: 'Food and drink UX examples from the two stores. Each one solved a problem that brand’s customers had.',
    // Matched to src/data/innovations.ts by name: the only three of the 13 from food and drink stores.
    items: [
      { client: 'Drink Finder', title: 'A comparison toggle on the collection page', body: 'A Show extras switch adds origin, region, vintage and style to every card, so shoppers compare without opening each bottle.' },
      { client: 'East at Home', title: 'Product cards that answer dinner questions', body: 'Every card shows heat, dietary needs, reviews and price, in a list built for comparing on mobile.' },
      { client: 'Drink Finder', title: 'An offers button instead of sticky pop-ups', body: 'Offers moved into a navigation button, so sign-up prompts no longer block the way to checkout.' },
    ],
    link: { label: 'See all Shopify innovations', href: URLS.innovations },
  },
  quotes: {
    eyebrow: 'Food and drink clients',
    heading: 'In their own words.',
    // Word for word from src/data/testimonials.ts. Different lines from the ones on the homepage.
    items: [
      { quote: 'He kept the ‘Drink Finder’ soul intact while significantly smoothing out the user journey.', cite: 'Jon Wigmore, Marketing & E-Commerce, Constantine Stores Ltd, home of Drink Finder · 2026', logo: 'drink-finder', href: `${URLS.testimonials}#drink-finder` },
      { quote: 'When I first saw Anthony’s work I knew that he was the right person for us, my initial hunch turned out to be correct.', cite: 'Ali Zaman, Owner, East at Home · 2026', logo: 'east-at-home', href: `${URLS.testimonials}#east-at-home` },
    ],
  },
  after: {
    eyebrow: 'Food and drink CRO',
    heading: 'A store is never finished.',
    paragraphs: [
      'Food and drink CRO carries on after launch, because a store is never finished. I check conversion rate and average order value at one, three and seven days. After that, each change is judged a week against a week, starting from what GA4 and Microsoft Clarity show.',
      'Each store is handed over as a design system, so seasonal campaigns, new products and landing pages stay consistent without starting again. For SEO and Klaviyo, I introduce specialists I work with.',
    ],
    link: { label: 'Shopify CRO', href: URLS.cro },
  },
  routing: {
    eyebrow: 'Honest Shopify advice',
    heading: 'When I’m not the right fit.',
    intro: 'Honest Shopify advice for food and drink brands: not every one needs a new store, and some don’t need me yet.',
    routes: [
      { situation: 'You’re launching your first product.', body: 'Start on a good theme or Shopify’s AI store builder. Come back when sales show what the store needs.', links: [] },
      { situation: 'Your store works, it just doesn’t convert well enough.', body: 'Rebuilding the whole store to fix a few leaking steps is the expensive way to do it. Find where customers leave and fix that first.', links: [{ label: 'Shopify CRO', href: URLS.cro }] },
      { situation: 'You’re on another platform.', body: 'A move to Shopify changes what the store needs, so start there. Drink Finder moved from a bespoke platform and redesigned on the way.', links: [{ label: 'Migrations', href: URLS.migrations }] },
      { situation: 'Repeat orders are the business.', body: 'If most of your sales are subscriptions, the subscribe journey comes first and the store is designed around it.', links: [{ label: 'Subscriptions', href: URLS.subscriptions }] },
    ],
  },
  faqs: {
    eyebrow: 'Food and drink Shopify FAQs',
    heading: 'What brands ask before they start.',
    items: [
      {
        q: 'Can Shopify handle a food and drink range of 5,000 products?',
        a: ['Yes. Drink Finder sells more than 5,000 wines and spirits on Shopify. With a range that size, the work is in the navigation and search. I designed the mobile navigation from scratch, and search suggests popular searches and bottles before anyone types.'],
      },
      {
        q: 'How do you raise basket size without pushy tactics?',
        a: ['By making the better deal obvious. Drink Finder shows one, six and twelve bottle offers as buttons above the price. East at Home shows the saving rising with quantity on the product page, and a bar in the basket shows what the next spend unlocks: free delivery, then a recipe book. None of it relies on countdown timers or fake scarcity.'],
      },
      {
        q: 'Can we move to Shopify without losing our regulars?',
        a: ['Yes. Drink Finder moved from a bespoke platform to Shopify in August 2025, after more than 65 years of trading. The UX review of the old store found sign-up buttons and a chat widget covering key buttons, so the new design fixed those first. I designed every screen mobile first, and Cartmasters built it.'],
      },
      {
        q: 'Can one Shopify store serve trade and retail customers?',
        // [CONFIRM] what was designed for trade buyers. Until then the answer stays with what Jon said.
        a: ['Yes. Drink Finder’s store serves retail and trade buyers, with different needs for wine and spirits. In Jon Wigmore’s words, the site handles “the distinct functional requirements for wine vs. spirits, managing wholesale and retail channels, and juggling complex shipping metrics.”'],
      },
      {
        q: 'Who built Drink Finder and East at Home?',
        a: [`Cartmasters, a Shopify development specialist, built both stores from my designs. Cartmasters or Tom Blanchard have built all ${LAUNCH_COUNT} of my launches since 2023. I design every screen and check the build on real devices before launch. I also work with in-house developers and agencies.`],
      },
    ],
  },
  cta: { eyebrow: 'Start a food and drink project', heading: 'Tell me what you sell.' },
  more: {
    eyebrow: 'More Shopify design',
    heading: 'Other sectors and services.',
    // Add the other two sector pages here when they go live.
    links: [
      { label: 'Bespoke store design', href: URLS.bespoke },
      { label: 'Theme customisations', href: URLS.theme },
      { label: 'Shopify CRO', href: URLS.cro },
    ],
  },
};
