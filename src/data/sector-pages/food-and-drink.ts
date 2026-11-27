// Food and drink sector page (27 November 2026, unlisted). The template is SectorPage.astro.
//
// Voice (27 November 2026): authoritative, almost no "I". The results and the clients are the subject of
// each sentence, and Anthony is named where "I" would have been. Every line is a fact from the two case
// studies: no slogans, nothing that couldn't be checked.
//
// Six rules keep this page off the homepage's broad terms (agreed 27 November 2026):
//   1. "Designer" always has the sector attached. Never "Shopify designer UK" or "Shopify expert".
//   2. "Designer" sits in the title tag, the H1 and the byline link only. H2 eyebrows use sector nouns.
//   3. No "UK" beside "designer".
//   4. Sector first in the URL and the title tag.
//   5. One link to the homepage, anchored "freelance Shopify designer", in the byline.
//   6. Links into this page use sector anchors, e.g. "Shopify design for food and drink brands".
import { URLS, GOOGLE_RATING } from '../site';
import { card } from '../service-pages/shared';
import type { SectorPage } from './types';
import heroImage from '../../assets/brands/east-at-home/feature-photo.jpg';

export const FOOD_AND_DRINK: SectorPage = {
  meta: {
    title: 'Food and Drink Shopify Designer | Anthony is Freelance',
    description:
      'The UK eCommerce Website of the Year 2026 sells wine. The UK User Experience of the Year sells curry sauce. Anthony Bliss designed both stores.',
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
    intro:
      'The UK eCommerce Website of the Year 2026 sells wine. The UK User Experience of the Year sells curry sauce. Anthony Bliss designed both stores. Brands commission him directly, and agencies bring him in to lead the design.',
    cta: { label: 'Start a food and drink project', href: '#start-a-project' },
    image: heroImage,
    imageAlt: '',
    trust: [
      { text: 'Winner: UK eCommerce Website of the Year 2026', href: URLS.caseStudies.drinkFinder },
      { text: 'Winner: UK User Experience of the Year 2026', href: URLS.caseStudies.eastAtHome },
      GOOGLE_RATING,
      { text: '20+ years of brand and ecommerce experience', href: URLS.about },
    ],
  },
  work: {
    eyebrow: 'Food and drink Shopify work',
    heading: 'Two stores. Two national awards.',
    intro: 'Drink Finder is a Cornish wine and spirits merchant with more than 5,000 products. East at Home makes curry sauces and spice kits. Both stores were designed mobile first, and both were judged the best in the UK in their category.',
    cards: [card('Drink Finder'), card('East at Home')],
    note: 'Both were also shortlisted in a second category: Drink Finder for Food & Drink eCommerce Website of the Year, and East at Home for B2C eCommerce Website of the Year.',
    link: { label: 'View all Shopify success stories', href: URLS.work },
  },
  innovations: {
    eyebrow: 'Food and drink UX examples',
    heading: 'Designed for how people buy food and drink.',
    intro: 'Three ideas from Drink Finder and East at Home, each one solving a problem their customers had.',
    // Matched to src/data/innovations.ts by name: the only three of the 13 from food and drink stores.
    items: [
      { client: 'Drink Finder', title: 'A comparison toggle on the collection page', body: 'One switch adds origin, region, vintage and style to every card, so shoppers compare bottles without opening each one.' },
      { client: 'East at Home', title: 'Product cards that answer dinner questions', body: 'Heat, dietary needs, reviews and price on every card, in a list built for comparing on a phone.' },
      { client: 'Drink Finder', title: 'An offers button instead of sticky pop-ups', body: 'Offers moved into the navigation, so sign-up prompts no longer block the way to checkout.' },
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
  needs: {
    eyebrow: 'Food and drink Shopify stores',
    heading: 'What sells, proven on live stores.',
    items: [
      { title: 'Answers on the product card.', body: 'Heat, dietary needs, reviews and price on every East at Home card, before anyone clicks.' },
      { title: 'A way to compare a big range.', body: 'Drink Finder’s Show extras switch adds the details wine buyers compare to every card.' },
      { title: 'Multi-buy offers as buttons, not small print.', body: 'One, six and twelve bottles at Drink Finder, with the next saving shown in the basket.' },
      { title: 'A basket that shows the next threshold.', body: 'At East at Home, free delivery unlocks at £35 and a recipe book at £50.' },
      { title: 'Bundles built on a phone.', body: 'East at Home’s mix-and-match builder, with feedback at every step.' },
      { title: 'Search that works before anyone types.', body: 'Drink Finder’s search shows popular searches and bottles as soon as it opens.' },
      { title: 'Retail and trade in one store.', body: 'Drink Finder sells to both, across wine and spirits.' },
    ],
  },
  routing: {
    eyebrow: 'Honest Shopify advice',
    heading: 'When a new store isn’t the answer.',
    intro: 'Not every food and drink brand needs a redesign.',
    routes: [
      { situation: 'Launching a first product.', body: 'Start on a well-chosen theme. Sales data then shows what a bespoke store needs to fix.', links: [{ label: 'Theme customisations', href: URLS.theme }] },
      { situation: 'The store works, but doesn’t convert.', body: 'Find the steps that lose sales and fix those before rebuilding anything.', links: [{ label: 'Shopify CRO', href: URLS.cro }] },
      { situation: 'Subscriptions are the business.', body: 'The subscribe journey comes first, and the store is designed around it.', links: [{ label: 'Subscriptions', href: URLS.subscriptions }] },
    ],
  },
  faqs: {
    eyebrow: 'Food and drink Shopify FAQs',
    heading: 'What brands ask before they start.',
    items: [
      {
        q: 'Can Shopify handle a food and drink range of 5,000 products?',
        a: ['Yes. Drink Finder sells more than 5,000 wines and spirits on Shopify. Its mobile navigation was designed from scratch around the range, and search shows popular searches and bottles before anyone types.'],
      },
      {
        q: 'Can a store move platforms without losing its regulars?',
        a: ['Yes. Drink Finder moved from a bespoke platform to Shopify in August 2025, after more than 65 years of trading. Website sales rose 34% in the six months that followed.'],
      },
      {
        q: 'Can one Shopify store sell to retail and trade customers?',
        // [CONFIRM] what was designed for trade buyers, to make this answer specific.
        a: ['Yes. Drink Finder’s store serves retail and trade buyers, across wine and spirits.'],
      },
      {
        q: 'How long does a food and drink Shopify store take?',
        a: ['A bespoke store takes six to eight weeks to design, with the build about the same again. A theme customisation takes six to ten weeks in total.'],
      },
      {
        q: 'Do you work with agencies?',
        a: ['Yes. Brands commission the design directly, or agencies bring Anthony in to lead it. Expert Shopify developers, or the agency’s own team, build it, and every screen is checked on real devices before launch.'],
      },
      {
        q: 'What happens after launch?',
        a: ['Conversion rate and average order value are checked at one, three and seven days. After that, changes are tested a week against a week. Every store is handed over as a Figma design system, so new pages and campaigns stay on brand.'],
      },
    ],
  },
  cta: { eyebrow: 'Start a food and drink project', heading: 'What do you sell?' },
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
