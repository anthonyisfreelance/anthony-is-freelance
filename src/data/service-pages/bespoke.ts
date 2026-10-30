// Bespoke store design service page. Layout and headings from the Figma frame
// "Services - Sub Page" (47742:8885); body copy from page-copy/service-pages.md, Page 1.
import { URLS } from '../site';
import { CASE_STUDIES } from '../work';
import { brandImage } from '../media';
import type { ServicePage } from './types';
import { serviceHero } from '../service-heroes';
import { THEME_VS_BESPOKE, THEME_VS_BESPOKE_ROWS } from './shared';
// Lifestyle hero from Drive services/<service>/hero-lifestyle.jpg
import shopByRoom from '../../assets/brands/projektityyny/shop-by-room.jpg';
import redWine from '../../assets/brands/drink-finder/red-wine.jpg';
import thameenCollection from '../../assets/brands/thameen/collection.jpg';
import innovationScreen from '../../assets/brands/drink-finder/screen-home.png';

// Proof cards here show each case study's hero photo (its card photo where there's no separate hero).
const card = (client: string) => {
  const s = CASE_STUDIES.find((c) => c.client === client)!;
  const image = brandImage(s.brand, 'hero') ?? s.image;
  return { client: s.client, meta: s.meta, claim: s.claim, proof: s.proof, href: s.href, image, badge: s.badge, badgeAlt: s.badgeAlt };
};

export const BESPOKE: ServicePage = {
  meta: {
    title: 'Bespoke Shopify Store Design UK | Anthony is Freelance',
    description:
      'Bespoke Shopify store design from £10,000 + VAT, design only. Every template designed around your products, in six to eight weeks. By Anthony Bliss.',
    path: URLS.bespoke,
    name: 'Bespoke store design',
    serviceType: 'Bespoke Shopify website design',
    minPrice: 10000,
  },

  hero: {
    eyebrow: 'Bespoke Shopify store design',
    heading: 'Built around your products, not a theme.',
    intro:
      "A bespoke Shopify store has every template designed from scratch around your products and customers, instead of adapted from a theme. I design it in Figma as a complete design system, with a clickable prototype. Bespoke store design starts from £10,000 + VAT, design only. Drink Finder's bespoke store lifted website sales 34%, September to February against the year before, and won UK eCommerce Website of the Year 2026.",
    cta: { label: 'Start a bespoke project', href: '#start-a-project' },
    ...serviceHero(URLS.bespoke),
    caption: 'Hartnack & Co. The step-by-step product builder.',
  },

  trust: ['UK eCommerce Website of the Year 2026', '20+ years of brand and ecommerce experience', '4× shortlisted, UK eCommerce Awards 2026'],

  included: {
    heading: 'What a bespoke store design includes',
    items: [
      'A UX review of your live store and analytics before any design starts.',
      'Every template designed: home, collection, product, cart, search, account and content pages.',
      'A Figma design system: type, colour, spacing, buttons, product cards and every component, set up with variables and tokens.',
      'Mobile and desktop layouts, with the states people forget: sold out, empty basket, no search results.',
      'A clickable prototype you can test on your own phone before anything is built.',
      'A handover the developer builds from without guesswork, then QA of the build before launch.',
    ],
  },

  fit: {
    heading: 'Who bespoke is right for',
    items: [
      'The store is the brand, and a theme would make you look like everyone else in your category.',
      "Your products have become square pegs in your theme's round holes.",
      'Your range is big or complicated, and finding the right product is the hard part.',
      'Your theme keeps fighting you. Every new idea needs a workaround.',
      'Your product needs its own buying journey, like one built from hundreds of options.',
    ],
  },

  proof: {
    heading: "Bespoke Shopify stores I've designed",
    link: { label: 'View all bespoke store design work', href: `${URLS.work}#bespoke-store-design` },
    cards: [
      card('Drink Finder'),
      card('Whistlefish'),
      card('Projektityyny'),
    ],
  },

  routing: {
    eyebrow: 'Honest Shopify advice',
    heading: "When bespoke isn't the right call",
    intro: "Bespoke is the biggest investment I offer, so it's worth ruling out first. These are the times I'd point you somewhere else.",
    routes: [
      {
        situation: "You're a start-up testing the water.",
        body: 'Get the product selling on a well-chosen theme first. A few months of real sales data then shows what a bespoke store needs to fix, so you invest on evidence, not guesses.',
        links: [{ label: 'Theme customisations', href: URLS.theme }],
      },
      {
        situation: "Your store works, it just doesn't convert well enough.",
        body: 'Rebuilding the whole store to fix a few leaking steps is an expensive way to do it. Find the leaks and redesign those first.',
        links: [{ label: 'Shopify CRO', href: URLS.cro }],
      },
      {
        situation: "You're not sure what's wrong yet.",
        body: 'Start with a UX review of your live store. It shows where customers struggle, and whether the answer is bespoke at all.',
        links: [{ label: 'Shopify UX design', href: URLS.ux }],
      },
      {
        situation: "The brand isn't settled.",
        body: "Designing a store around a brand that's about to change means designing it twice. Refine the brand first, or alongside.",
        links: [{ label: 'Branding', href: URLS.branding }],
      },
    ],
  },

  process: {
    eyebrow: 'Bespoke Shopify design process',
    heading: 'How a project runs',
    intro:
      'Every project starts with a UX review of your live store, and the navigation is where I look first, because it shows how a store really sells. Then your reviews, your data and your customers. And one question I ask on every project: would I buy this?',
    steps: [
      { title: 'Understand', body: 'A 30-minute call, then a tailored quote. Where it helps, a UX review of your live store, navigation first.' },
      { title: 'Design', body: 'A weekly call and two rounds of feedback in Figma. You see options, not a finished site handed over.' },
      { title: 'Launch', body: 'The developer builds from the design system, and I check every screen on real devices before it goes live.' },
      { title: 'Measure and improve', body: 'I check conversion rate and average order value at one, three and seven days after launch.' },
    ],
  },

  innovations: {
    eyebrow: 'Bespoke Shopify innovations',
    heading: "Things a theme couldn't do.",
    intro: "Each of these was designed for one brand's products and customers.",
    items: [
      {
        client: 'Drink Finder',
        title: 'A comparison toggle on the collection page',
        body: 'Expand origin, region and vintage to compare bottles side by side, without leaving the listing.',
        screen: innovationScreen,
      },
      {
        client: 'Projektityyny',
        title: 'Shop by product, room or print',
        body: 'Three image-led routes in from the navigation match how people think about their homes.',
        screen: shopByRoom,
      },
      {
        client: 'Hartnack & Co',
        title: 'Step-by-step product builder',
        body: 'Thousands of variations split into guided steps, with tips and a cost tracker that stays on screen.',
        // [CONFIRM] Figma shows the Drink Finder screen here as a placeholder. Swap in the Hartnack builder.
        screen: innovationScreen,
      },
    ],
  },

  price: {
    eyebrow: 'Bespoke store design price',
    heading: 'How much does a bespoke Shopify store cost?',
    notes: [
      'Prices checked September 2026. Every project is quoted individually once the brief is defined.',
      'The price moves with how many templates you need, how complex the products are (configurators, bundles, subscriptions), and whether the brand needs refining first.',
    ],
    cta: { label: 'Get a quote', href: '#start-a-project' },
    caption: 'Bespoke store design at a glance',
    rows: [
      ['Starting price', 'From £10,000 + VAT, design only'],
      ['Design time', 'Six to eight weeks'],
      ['Build time', 'About the same again'],
      ['What you get', 'The full Figma file: design system, every template and a clickable prototype'],
      ['Who builds it', 'A developer I introduce, or your own team or agency, quoted separately'],
    ],
  },

  comparison: {
    ...THEME_VS_BESPOKE,
    caption: 'Bespoke store design and theme customisation compared, design only, checked September 2026',
    columns: [
      { label: 'Bespoke store design', href: URLS.bespoke, current: true },
      { label: 'Theme customisations', href: URLS.theme },
    ],
    rows: THEME_VS_BESPOKE_ROWS,
    examples: [
      { client: 'Drink Finder', href: URLS.caseStudies.drinkFinder, screen: redWine, alt: 'The Drink Finder red wine collection on mobile.' },
      { client: 'Thameen London', href: CASE_STUDIES.find((c) => c.client === 'Thameen London')!.href, screen: thameenCollection, alt: 'A Thameen London collection on mobile.' },
    ],
  },

  testimonial: {
    heading: 'Hartnack & Co on their bespoke store. Complicated product, simple to buy.',
    quote:
      'Anthony totally understood what we needed in terms of style and UI/UX and the complexity of buying a bespoke product online and the conditional logic it takes with all the many, many options. He put up with a large amount of indecisiveness on our part and he delivered a website that looks amazing but also works perfectly and we only wish we had found him earlier.',
    cite: 'Nick Hartnack, Partner, Hartnack & Company',
  },

  faqs: {
    eyebrow: 'Bespoke Shopify store design FAQs',
    heading: 'Before you get in touch.',
    items: [
      {
        q: "What's the difference between an AI-generated store and a designed one?",
        a: ['An AI-generated store is a theme laid out from a short description of your business. A designed store starts from your analytics, your reviews and how your customers shop, then builds the navigation, product cards and pages around them. At East at Home, that work won UK User Experience of the Year 2026.'],
      },
      {
        q: 'What is a bespoke Shopify store?',
        a: ['A bespoke Shopify store has every template designed from scratch around your products and customers, instead of adapted from a pre-built theme. It still runs on Shopify, so you manage products, orders and content in the normal Shopify admin.'],
      },
      {
        q: 'What do I get at the end of a bespoke project?',
        a: ['A Figma design system and every template, set up with variables and tokens so the developer builds without guesswork. After launch, the same system makes every new page and every CRO change quicker to design.'],
      },
      {
        q: 'Who builds a bespoke Shopify store?',
        a: ['A Shopify developer builds it from my designs. I introduce the right developer for the project, or brief your own team or agency, and I QA the build before launch.'],
      },
      {
        q: 'Is a bespoke Shopify store worth it?',
        a: ["It's worth it when a theme is holding your brand or your range back. If you're still proving the product, a theme customisation gets you selling for less, and the sales data then shows what bespoke would need to fix."],
      },
    ],
  },

  articles: {
    eyebrow: 'Bespoke Shopify design articles',
    heading: 'Where to read more.',
    link: { label: 'View all articles', href: URLS.articles },
    items: [
      { category: 'Design and UX', title: 'Shopify Product Card Design: The Art of Cards That Convert', href: '/articles/shopify-product-card-design/' },
      { category: 'Shopify CRO', title: 'What Is a Good Conversion Rate on Shopify?', href: '/articles/good-conversion-rate-shopify/' },
    ],
  },
  cta: { eyebrow: 'Start a bespoke Shopify project', heading: 'Tell me about your range.' },
};
