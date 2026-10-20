// Innovations: one record per innovation. Every place an innovation appears (the innovations page,
// the homepage and service page tiles, case studies) renders from these records.
// Copy from page-copy/innovations.md (project doc, 2 October 2026). Years from the go-live dates.
//
// Media drops in by file name, no code needed (see src/assets/brands/README.md):
//   screen still  src/assets/brands/<brand>/innovations/<slug>.jpg   (a phone screen, 216:376)
//   recording     public/video/<brand>/<slug>.mp4
// Until both are there, the entry shows a placeholder tile. Set videoUploaded when a recording goes in.
import { URLS } from './site';
import { brandImage, brandVideo } from './media';
import { CASE_STUDIES } from './work';
import type { ImageMetadata } from 'astro';

type Group = 'finding' | 'choosing' | 'buying' | 'brand';

interface InnovationRecord {
  slug: string; // anchor on the innovations page, and the media file name
  name: string;
  group: Group;
  brand: string; // folder name under src/assets/brands and public/video
  client: string;
  clientHref?: string; // the case study
  year: string;
  service: { label: string; href: string };
  summary?: string; // the short card on the homepage and service pages
  problem: string;
  howItWorks: string;
  evidence?: string; // only when approved
  caption: string;
  alt: string;
  videoUploaded?: string; // ISO date the recording went up, for the VideoObject schema
}

export interface Innovation extends InnovationRecord {
  poster?: ImageMetadata;
  video?: string;
}

export const INNOVATION_GROUPS = [
  {
    id: 'finding',
    eyebrow: 'Shopify navigation and collection UX',
    heading: 'Helping customers find and compare.',
    intro: 'Product discovery comes first, because without it the product page is pointless.',
  },
  { id: 'choosing', eyebrow: 'Shopify product UX examples', heading: 'Helping customers choose with confidence.' },
  { id: 'buying', eyebrow: 'Shopify cart and subscription UX', heading: 'Buying without the surprises.' },
  { id: 'brand', eyebrow: 'Shopify brand design examples', heading: 'Personality that still helps people shop.' },
] as const;

const S = {
  bespoke: { label: 'Bespoke store design', href: URLS.bespoke },
  ux: { label: 'Shopify UX design', href: URLS.ux },
  subscriptions: { label: 'Subscriptions', href: URLS.subscriptions },
  migrations: { label: 'Migrations', href: URLS.migrations },
  branding: { label: 'Branding', href: URLS.branding },
};

const RECORDS: InnovationRecord[] = [
  // ---- Finding and comparing
  {
    slug: 'comparison-toggle',
    name: 'A comparison toggle on the collection page',
    group: 'finding',
    brand: 'drink-finder',
    client: 'Drink Finder',
    clientHref: URLS.caseStudies.drinkFinder,
    year: '2025',
    service: S.bespoke,
    summary: 'Expand origin, region and vintage to compare bottles side by side, without leaving the listing.',
    // [CONFIRM] 1,500 wines: the article body says over 1,500, its subheading says over 500.
    problem:
      'Drink Finder stocks over 1,500 wines, and buyers compare them on country, region, vintage and style. A standard card left them opening bottle after bottle.',
    howItWorks:
      'A Show extras toggle at the top of the collection adds rating, origin, region, vintage and style to every card. Leave it on to compare, or switch it off for a clean grid of bottles and prices.',
    evidence:
      'Project result: website sales up 34%, September to February against the year before. EPoS till data, marketplaces excluded. Drink Finder won UK eCommerce Website of the Year at the UK eCommerce Awards 2026.',
    caption: "A comparison toggle on Drink Finder's collection page.",
    alt: "Drink Finder's collection page on mobile, with the Show extras toggle above the wines.",
    videoUploaded: '2026-10-19',
  },
  {
    slug: 'shop-by-product-room-print',
    name: 'Shop by product, room or print',
    group: 'finding',
    brand: 'projektityyny',
    client: 'Projektityyny',
    year: '2026',
    service: S.bespoke,
    problem: "Projektityyny's old store dropped customers into collections and left them to filter.",
    howItWorks:
      'Three image-led routes from the navigation let people shop by product, by room or by print, which is how they think about their homes. The routes were designed for the phone first.',
    // Source: the UX review (Miro board), before design started.
    evidence: "Over 80% of Projektityyny's visitors are on mobile, from the UX review before design started.",
    caption: 'Shop by product, room or print on Projektityyny.',
    alt: "Projektityyny's navigation on mobile, with routes to shop by product, room or print.",
  },
  {
    slug: 'lookbook-archive',
    name: 'A lookbook archive that keeps earning',
    group: 'finding',
    brand: 'projektityyny',
    client: 'Projektityyny',
    year: '2026',
    service: S.bespoke,
    problem: 'When a Projektityyny collection sold out, its campaign photography disappeared with it.',
    howItWorks:
      'Every past collection stays live as a shoppable lookbook, so the photography keeps bringing in search traffic long after the launch.',
    // No evidence line: PageSpeed is dropped (19 October 2026), as speed is development work.
    caption: "Projektityyny's lookbook archive.",
    alt: "A past collection in Projektityyny's lookbook archive on mobile.",
  },
  {
    slug: 'image-first-product-cards',
    name: 'Image-first product cards',
    group: 'finding',
    brand: 'whistlefish',
    client: 'Whistlefish',
    year: '2025',
    service: S.ux,
    problem:
      'Whistlefish publishes thousands of greeting card designs, and nobody chooses a card by its name. Long names broke the grid for no benefit.',
    howItWorks:
      'I cut product names to one line, so the picture leads. The multi-buy offer and an Add button sit on the card, because people often buy several cards at once.',
    caption: 'Image-first product cards on Whistlefish.',
    alt: 'Whistlefish greeting cards on mobile, with one-line names, the multi-buy offer and Add buttons.',
  },
  // ---- Choosing
  {
    slug: 'dinner-question-cards',
    name: 'Product cards that answer dinner questions',
    group: 'choosing',
    brand: 'east-at-home',
    client: 'East at Home',
    clientHref: URLS.caseStudies.eastAtHome,
    year: '2025',
    service: S.ux,
    problem:
      'People choosing a curry sauce want four answers before they click: is it hot, is it vegan, did others like it, and what does it cost?',
    howItWorks:
      'Every card shows the heat level in chilli icons, dietary information, reviews and the price, with Quick Shop to add straight from the collection. On mobile the grid becomes a list, so it all stays readable.',
    evidence:
      'Project result: revenue up 82%, October to June against the year before. GA4, UK sessions. East at Home won UK User Experience of the Year at the UK eCommerce Awards 2026.',
    caption: 'Product cards that answer dinner questions on East at Home.',
    alt: 'East at Home curry sauces as a list on mobile, each with chilli heat icons, dietary labels, reviews and price.',
  },
  {
    slug: 'product-builder',
    name: 'Step-by-step product builder',
    group: 'choosing',
    brand: 'hartnack-and-co',
    client: 'Hartnack & Co',
    year: '2025',
    service: S.bespoke,
    problem:
      "Hartnack & Co's binders and boxes come in thousands of possible variations, and the choice was overwhelming customers.",
    howItWorks:
      'The builder splits the choice into guided steps, with slide-up tips, bespoke icons and a cost tracker that stays on screen.',
    // No evidence line: GA4 shows conversion down since launch, so the 39% is off (19 October 2026).
    caption: "Hartnack & Co's step-by-step product builder.",
    alt: "A step in Hartnack & Co's product builder on mobile, with a tip and the running cost.",
  },
  {
    slug: 'customer-gallery',
    name: 'A customer gallery with the options shown',
    group: 'choosing',
    brand: 'hartnack-and-co',
    client: 'Hartnack & Co',
    year: '2025',
    service: S.bespoke,
    // [CONFIRM] written from the register.
    problem: 'With so many options, new customers found it hard to picture what to choose.',
    howItWorks:
      'Each past creation in the gallery lists the exact options chosen, so a new customer can copy one they like.',
    caption: "Hartnack & Co's customer gallery.",
    alt: "A finished box in Hartnack & Co's customer gallery, with the options chosen listed beside it.",
  },
  {
    slug: 'subscription-only-cards',
    name: 'Subscription-only product cards',
    group: 'choosing',
    brand: 'fuzzball',
    client: 'Fuzzball',
    year: '2025',
    service: S.subscriptions,
    problem:
      'Some Fuzzball products are only sold on subscription. Customers found that out after clicking through and trying to add one.',
    howItWorks:
      'The card shows a lock icon, an "Only available on subscription" label and a View Product button instead of Add to Bag, so expectations are set before the click.',
    caption: 'Subscription-only product cards on Fuzzball.',
    alt: 'A Fuzzball product card with a lock icon, an Only available on subscription label and a View Product button.',
  },
  // ---- Buying and subscribing
  {
    slug: 'offers-button',
    name: 'An offers button instead of sticky pop-ups',
    group: 'buying',
    brand: 'drink-finder',
    client: 'Drink Finder',
    clientHref: URLS.caseStudies.drinkFinder,
    year: '2025',
    service: S.migrations,
    problem: "The UX review of Drink Finder's old store found sticky sign-up buttons blocking the way to checkout.",
    howItWorks: 'Offers and events moved into a button in the navigation, which freed the announcement bar for trust messages.',
    evidence: 'Found in the UX review, before any design started.',
    caption: "The offers button in Drink Finder's navigation.",
    alt: "Drink Finder's header on mobile, with the offers button in the navigation.",
  },
  {
    slug: 'trial-subscription-split',
    name: 'Trial and subscription, split clearly',
    group: 'buying',
    brand: 'fuzzball',
    client: 'Fuzzball',
    year: '2025',
    service: S.subscriptions,
    // [CONFIRM] problem line written from the register.
    problem: "In Fuzzball's quiz cart, it wasn't clear which items were the trial and which would repeat.",
    howItWorks:
      'The cart separates the trial from the repeating order, so customers see exactly what they’re signing up to and nobody subscribes by accident.',
    // No evidence line until the 86% (quiz summary to checkout) has a window and source.
    caption: "Fuzzball's quiz cart, with the trial and subscription split.",
    alt: "Fuzzball's quiz cart on mobile, with the trial and the repeating order shown separately.",
  },
  {
    slug: 'three-pages-one-screen',
    name: 'Three pages in one screen',
    group: 'buying',
    brand: 'window-fleur',
    client: 'Window Fleur',
    year: '2024',
    service: S.subscriptions,
    problem: "Window Fleur's subscription product journey ran across three pages.",
    howItWorks:
      'I rebuilt it as one mobile screen, with slide-ups for the detail, so customers set up a subscription without leaving the page.',
    // [CONFIRM]
    evidence: 'The project led to Window Fleur commissioning a full store redesign.',
    caption: "Window Fleur's subscription journey on one screen.",
    alt: "Window Fleur's subscription product page on mobile, with a slide-up open for the detail.",
  },
  // ---- Brand
  {
    slug: 'progress-bar-with-character',
    name: 'A progress bar with character',
    group: 'brand',
    brand: 'fuzzball',
    client: 'Fuzzball',
    year: '2025',
    service: S.branding,
    problem: 'A quiz is a form, and forms feel like a chore.',
    howItWorks: "Fuzzball's cat chases a ball along the quiz progress bar, so finishing the quiz feels like part of the brand.",
    evidence: 'Project result: conversion rate up 63%, August 2025 to August 2026 against the year before. GA4.',
    caption: "Fuzzball's quiz progress bar.",
    alt: "Fuzzball's quiz on mobile, with the cat chasing a ball along the progress bar.",
  },
  {
    slug: 'design-system-team-runs',
    name: "A design system the client's team runs",
    group: 'brand',
    brand: 'whistlefish',
    client: 'Whistlefish',
    year: '2025',
    service: S.bespoke,
    // [CONFIRM] problem line written from the register.
    problem: "Whistlefish's own team needed to keep building pages after launch without the design drifting.",
    howItWorks:
      'I set up the Figma file as a templating system, with rules for how the script and sans fonts behave in the theme editor.',
    // [CONFIRM] Will Manders' role and the date of the quote.
    evidence: '"We\'ve since been able to carry that framework into our own design team." Will Manders, Whistlefish',
    caption: "Whistlefish's design system in Figma.",
    alt: "Pages from Whistlefish's design system in Figma, showing the type rules.",
  },
];

// Each record with its screen still and recording, if they've been added.
// Each links to its client's case study, now every one has a page.
export const INNOVATIONS_LIST: Innovation[] = RECORDS.map((r) => ({
  ...r,
  clientHref: r.clientHref ?? CASE_STUDIES.find((c) => c.client === r.client)?.href,
  poster: brandImage(r.brand, `innovations/${r.slug}`),
  video: brandVideo(r.brand, r.slug),
}));

export const INNOVATION_BRANDS = new Set(RECORDS.map((r) => r.client)).size;

// The comparison toggle, used on the homepage, service page and case study tiles.
const toggle = INNOVATIONS_LIST[0];
export const COMPARE = { video: toggle.video, poster: toggle.poster! };

export const INNOVATIONS_PAGE = {
  path: URLS.innovations,
  title: 'Shopify UX Examples | Anthony is Freelance',
  description:
    'Shopify UX examples from freelance Shopify designer Anthony Bliss. Each one solved a named customer problem on a real store, with the evidence.',
  eyebrow: 'Shopify UX examples',
  heading: "The ideas a theme wouldn't give you.",
  intro:
    "Shopify UX examples from the stores I've designed, each one an idea that solved a named problem for that brand's customers.",
  test: {
    eyebrow: 'Shopify innovation test',
    heading: 'How an idea earns the name.',
    paragraphs: [
      "An idea is only called an innovation on this page if it passes four tests. A theme or an app wouldn't do it out of the box. It was shaped by one brand's products or customers. I can name the problem it solved. And you can see it on the live store.",
      "Plenty of good design doesn't pass. Multi-buy buttons, quantity savings and free delivery bars are standard features. I design them carefully, so they help people buy without pushing, but they aren't new ideas. You'll find them in the case studies and on the Shopify CRO page.",
      'Seven of the 13 sit before the product page, in the navigation, collection pages and product cards. The nav is your site, and a product page is pointless if nobody finds it.',
      "Where a figure appears, it's labelled a project result, because it belongs to the whole project, not one feature. Each shows the months it covers and where it came from.",
      'I like the jigsaw piece as much as the entire jigsaw.',
    ],
  },
  faqs: {
    eyebrow: 'Shopify UX example questions',
    heading: 'What people ask about these ideas.',
    items: [
      {
        q: 'Can you design something like this for my store?',
        a: [
          'Yes, though rarely the same thing, because each of these was shaped by one brand’s products and customers. Where a store is already live, I usually start with a UX review, beginning with the navigation, and the ideas come out of what it finds.',
        ],
      },
      {
        q: 'Are these Shopify apps?',
        a: [
          'No. Each one is a design decision made for one store. Some build on what the theme or a subscription app already provides, and the design decides how it’s used.',
        ],
      },
    ],
  },
  cta: {
    eyebrow: 'Start a Shopify UX project',
    heading: "What's getting in your customers' way?",
    intro:
      "Send me your store and a line about where customers get stuck. I'll reply within two working days, then we'll have a 30-minute call about the business and the project. After that you get a fixed-price proposal with a timeline.",
  },
};
