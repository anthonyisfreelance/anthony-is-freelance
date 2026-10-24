// Services hub content. Structure from Figma (Services frame); copy from
// page-copy/services-hub.md where Figma has placeholders or out-of-date facts.
import { URLS } from './site';

// First frame of the hero video (public/video/services/service-hero-*.mp4), so the switch is seamless.
import hero from '../assets/site/services/service-hero-poster.jpg';
import branding from '../assets/site/services/branding.jpg';
import ux from '../assets/brands/whistlefish/apron.jpg';
import bespoke from '../assets/brands/hartnack-and-co/box.jpg';
import cro from '../assets/brands/east-at-home/curry.jpg';
import migrations from '../assets/site/services/migrations.jpg';
import subscriptions from '../assets/brands/fuzzball/treats.jpg';
import theme from '../assets/brands/thameen/bottles.jpg';
import projektityyny from '../assets/brands/projektityyny/card.jpg';
import fuzzball from '../assets/brands/fuzzball/card.jpg';

export const HUB_META = {
  title: 'Shopify Website Design Services UK | Anthony is Freelance',
  description:
    'Shopify and Shopify Plus website design, from theme customisations at £5,000 + VAT to bespoke stores at £10,000 + VAT. Design by Anthony Bliss.',
  path: URLS.services,
};

export const HUB_HERO = {
  eyebrow: 'Shopify website design services',
  heading: 'For brands on Shopify and Shopify Plus',
  intro:
    "My Shopify website design services help UK DTC brands on Shopify and Shopify Plus sell more, with stores that are easy to use and look as good as the products in them. There are eight, from a theme customisation to a fully bespoke store, and each one below shows who it's for, what it costs and where it has worked.",
  image: hero,
  trust: [
    { text: 'UK eCommerce Website of the Year 2026', raised: true },
    { text: '20+ years of brand and ecommerce experience' },
    { text: '4× shortlisted, UK eCommerce Awards 2026' },
    { text: '5.0 (6 reviews)', raised: true, google: true },
  ],
};

// Prices as set in the Figma frame. One format everywhere: "From £X + VAT".
export const ALL_SERVICES = [
  {
    name: 'Branding',
    slug: 'branding',
    href: URLS.branding,
    image: branding,
    price: 3000,
    body: 'Branding is for brands that got the product out with a basic identity and now need it to look as good as the product. I can do full rebrands or brand refinements. Recent logo and identity work is on the branding page.',
    serviceType: 'Ecommerce brand identity',
  },
  {
    name: 'UX design',
    slug: 'ux-design',
    href: URLS.ux,
    image: ux,
    price: 10000,
    body: "Shopify UX design is for big ranges and complex products, where finding the right product is the hard part. Whistlefish's store routes shoppers in by occasion and recipient, so a big range of cards stays easy to browse.",
    serviceType: 'Shopify UX design',
  },
  {
    name: 'Bespoke store design',
    slug: 'bespoke-store-design',
    href: URLS.bespoke,
    image: bespoke,
    price: 10000,
    body: "Bespoke store design is for brands that have outgrown their theme and have data to make informed decisions for a bespoke user journey. Hartnack & Co's bespoke store includes a product configurator that handles hundreds of option combinations, something no theme could do.",
    serviceType: 'Bespoke Shopify website design',
  },
  {
    // Off the hub for now (comment, 21 October 2026). Delete `hidden` to bring it back.
    hidden: true,
    name: 'Shopify Plus design',
    slug: 'shopify-plus-design',
    href: URLS.plus,
    // Jing Tea image to come.
    image: undefined,
    price: 10000,
    body: 'Shopify Plus design is for high-volume brands already on Plus, or moving to it. Jing Tea runs on a Plus store I designed [CONFIRM].',
    serviceType: 'Shopify Plus website design',
  },
  {
    name: 'Shopify CRO',
    slug: 'shopify-cro',
    href: URLS.cro,
    image: cro,
    price: 3000,
    body: 'Shopify CRO is for stores with steady traffic and a conversion rate that has stalled. At East at Home, conversion rose 14% from October to June against the year before, and the store won UK User Experience of the Year 2026.',
    serviceType: 'Shopify conversion rate optimisation',
  },
  {
    name: 'Migrations',
    slug: 'migrations',
    href: URLS.migrations,
    image: migrations,
    price: 5000,
    body: "Migrations are for brands on Magento, WooCommerce, BigCommerce, Wix or a custom platform that's holding back checkout, speed or day-to-day running. After Drink Finder moved to Shopify, website sales rose 34% from September to February against the year before, and the store won UK eCommerce Website of the Year 2026.",
    serviceType: 'Shopify migration design',
  },
  {
    name: 'Subscriptions',
    slug: 'subscriptions',
    href: URLS.subscriptions,
    image: subscriptions,
    price: 10000,
    body: "Subscription design is for brands where repeat purchase is the business model, from quizzes to build-a-box flows. Fuzzball's conversion rate rose 63% in the 12 months after launch.",
    serviceType: 'Shopify subscription design',
  },
  {
    name: 'Theme customisations',
    slug: 'theme-customisations',
    href: URLS.theme,
    image: theme,
    price: 5000,
    body: 'Theme customisations are for brands that need to move quickly, or want to see how far a premium theme goes before going bespoke. Thameen London, a luxury fragrance house stocked in Harrods, runs on one.',
    serviceType: 'Shopify theme customisation',
  },
  {
    // Built into every project, never sold or priced on its own (brief, 11 October 2026).
    name: 'AI search visibility',
    slug: 'ai-search-visibility',
    href: URLS.aiSearch,
    image: undefined,
    price: undefined,
    priceNote: 'Included with design projects',
    body: 'AI search visibility is built into every store I design, bespoke or theme, so AI assistants like ChatGPT can find, read and recommend it.',
    serviceType: 'Shopify AI search visibility design',
  },
];

export const SERVICES_LIST = ALL_SERVICES.filter((s) => !('hidden' in s && s.hidden));

export const formatPrice = (n: number) => `From £${n.toLocaleString('en-GB')} + VAT`;

export const SERVICES_GRID = {
  eyebrow: 'Shopify web design',
  heading: 'Eight services, and how they have got results',
  intro: "Each of the eight Shopify design services below says who it's for, how it's priced and where it has worked.",
  note: 'Prices checked October 2026. Every project is quoted individually once the brief is defined.',
};

// Situation guide. `links` are woven into the paragraph where the service is named.
export const SITUATIONS = {
  eyebrow: 'Shopify store problems',
  heading: 'Which service is right for your store?',
  intro:
    "Most Shopify brands come to me with one of five problems, and each one points to a different service. If the smaller job is the right one, I'll say so.",
  items: [
    {
      quote: "We can't build the pages we want.",
      body: [
        { text: 'A ' }, { text: 'theme customisation', href: URLS.theme },
        { text: " often fixes this for far less than a rebuild. If every new idea still needs a workaround, that's when " },
        { text: 'bespoke store design', href: URLS.bespoke }, { text: ' pays for itself.' },
      ],
      href: URLS.theme,
    },
    {
      quote: "Customers can't find what they're looking for.",
      body: [
        { text: "When a range outgrows its navigation, it's a structure problem, not a styling one. " },
        { text: 'UX design', href: URLS.ux }, { text: ' sorts the navigation and collections first, and the look follows.' },
      ],
      href: URLS.ux,
    },
    {
      quote: 'The store looks dated.',
      body: [
        { text: "A dated store doesn't always need rebuilding. A premium " },
        { text: 'theme pushed hard', href: URLS.theme }, { text: ', with the ' },
        { text: 'brand refined', href: URLS.branding }, { text: ', is usually the quicker win.' },
      ],
      href: URLS.theme,
    },
    {
      quote: 'People visit, but not enough of them buy.',
      body: [
        { text: 'Something in the journey is stopping them. Your data shows where, and ' },
        { text: 'Shopify CRO', href: URLS.cro },
        { text: ' finds out why and fixes those steps, without countdown timers or pressure tactics.' },
      ],
      href: URLS.cro,
    },
    {
      quote: 'Our platform is holding us back.',
      body: [
        { text: 'If the checkout, speed or day-to-day running is the problem, ' },
        { text: 'moving to Shopify', href: URLS.migrations },
        { text: ' fixes it, and the move is the time to redesign. Brands growing fast should look at ' },
        { text: 'Shopify Plus', href: URLS.plus }, { text: '.' },
      ],
      href: URLS.migrations,
    },
    {
      id: 'first-store', // the About page links here
      quote: "We're launching our first store.",
      body: [
        { text: "Start with Shopify's AI store builder or a free theme. Either will get you selling quickly, on the same checkout as every other Shopify store. Come back when your sales show what the store needs, and a UX review will tell you where to start." },
      ],
      href: URLS.theme,
    },
  ],
};

export const RECENT_WORK = {
  eyebrow: 'Shopify design projects',
  heading: 'Three recent stores and what changed.',
  link: { label: 'View all Shopify success stories', href: URLS.work },
  cards: [
    {
      client: 'Projektityyny',
      meta: 'Home · June 2026',
      claim: 'A mobile-first store launch for a Nordic-inspired textiles brand',
      image: projektityyny,
      href: '/portfolio/projektityyny-shopify-website-design-case-study/',
    },
    {
      client: 'Thameen London',
      meta: 'Beauty · March 2026',
      claim: 'Off headless, onto a premium theme the team runs themselves',
      image: theme,
      href: '/portfolio/thameen-london-shopify-website-design-case-study/',
    },
    {
      client: 'Fuzzball',
      meta: 'Pets · August 2025',
      claim: '63% higher conversion rate after a subscription redesign',
      image: fuzzball,
      href: '/portfolio/fuzzball-shopify-website-design-case-study/',
    },
  ],
};

export const HUB_TESTIMONIAL = {
  eyebrow: 'Shopify design client feedback',
  heading: 'Led by data, not guesswork.',
  quote:
    'We were also impressed by how data driven Anthony was: the first thing he did was do an analysis of our website to identify click rates and where page views were dropping off. This analysis allowed us to figure out where exactly our priorities need to be.',
  cite: 'Jaideep Shah, Director, Zen Maitri · [CONFIRM year]',
};

export const HUB_FAQS = {
  eyebrow: 'Shopify website design FAQs',
  heading: 'Before you choose a service',
  items: [
    {
      q: 'How much does Shopify website design cost?',
      a: ['Shopify website design starts from £5,000 + VAT for a theme customisation and £10,000 + VAT for a bespoke store design. Every project is quoted individually once the brief is defined.'],
    },
    {
      q: 'Does your price include the developer?',
      a: ["No. My prices cover design, and the developer quotes the build separately. You pay them directly, so you always know who's doing what. I'll introduce the right developer, or work with your own team or agency."],
    },
    {
      q: 'What do you need from me before you can quote?',
      a: ["A brief is ideal. If you don't have one, I'll send you a short template to fill in."],
    },
    {
      q: 'What happens if we want to add something mid-project?',
      a: ["New ideas go on a phase-two list, so the current phase stays on time and on budget. If something needs to come in now, I'll tell you what it adds before any work starts."],
    },
    {
      q: 'Do you handle SEO, Klaviyo or loyalty apps?',
      a: ['I design how they look and where they sit. Setup belongs with the developer, and I can introduce specialists for SEO and Klaviyo.'],
    },
    {
      q: "Is Shopify's AI store builder good enough?",
      a: ["For a first store, yes. It gives you a clean, working design in seconds, on the same checkout as every other Shopify store. It works from the few words you type, so it can't know your customers, your range or how your brand should feel. That's the gap a designed store fills."],
    },
    {
      q: 'Do you work with brands outside the UK?',
      a: ["Yes. I'm based in Falmouth, Cornwall, and most clients are UK DTC brands, but I can work with brands anywhere. Everything runs through Figma and regular video calls."],
    },
  ],
};
