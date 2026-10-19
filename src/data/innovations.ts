// Innovations: one record per innovation. Every place an innovation appears (the innovations page,
// the homepage and service page tiles, case studies) renders from these records.
// Copy from page-copy/innovations.md (project doc, 2 October 2026).
import { URLS } from './site';
import comparePoster from '../assets/drink-finder/compare-poster.jpg';
import type { ImageMetadata } from 'astro';

export interface Innovation {
  slug: string; // anchor on the innovations page
  name: string;
  group: 'finding' | 'choosing' | 'buying' | 'brand';
  client: string;
  clientHref?: string; // the case study
  year: string;
  service: { label: string; href: string };
  summary: string; // the short card on the homepage and service pages
  problem: string;
  howItWorks: string;
  evidence?: string; // only when approved
  caption: string;
  video?: string; // public path to an MP4
  videoUploaded?: string; // ISO date, for the VideoObject schema
  poster: ImageMetadata;
  alt: string;
}

// The comparison toggle recording, used on every innovation tile until each has its own.
export const COMPARE = {
  video: '/video/drink-finder-compare.mp4',
  poster: comparePoster,
};

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

export const INNOVATIONS_LIST: Innovation[] = [
  {
    slug: 'comparison-toggle',
    name: 'A comparison toggle on the collection page',
    group: 'finding',
    client: 'Drink Finder',
    clientHref: URLS.caseStudies.drinkFinder,
    year: '2025',
    service: { label: 'Bespoke store design', href: URLS.bespoke },
    summary: 'Expand origin, region and vintage to compare bottles side by side, without leaving the listing.',
    // [CONFIRM] 1,500 wines: the article body says over 1,500, its subheading says over 500.
    problem:
      'Drink Finder stocks over 1,500 wines, and buyers compare them on country, region, vintage and style. A standard card left them opening bottle after bottle.',
    howItWorks:
      'A Show extras toggle at the top of the collection adds rating, origin, region, vintage and style to every card. Leave it on to compare, or switch it off for a clean grid of bottles and prices.',
    evidence:
      'Project result: website sales up 34%, September to February against the year before. EPoS till data, marketplaces excluded. Drink Finder won UK eCommerce Website of the Year at the UK eCommerce Awards 2026.',
    caption: "A comparison toggle on Drink Finder's collection page.",
    video: COMPARE.video,
    videoUploaded: '2026-10-19',
    poster: COMPARE.poster,
    alt: "Drink Finder's collection page on mobile, with the Show extras toggle above the wines.",
  },
  // ---- Mock-up only (preview/innovations-grid): the other 12 from page-copy/innovations.md,
  // all showing the Drink Finder recording until each has its own. [CONFIRM] years and the
  // lines marked [CONFIRM] in the doc before any of these go live.
  ...([
    ['shop-by-product-room-print', 'Shop by product, room or print', 'finding', 'Projektityyny', '2026', 'Bespoke store design', URLS.bespoke,
      "Projektityyny's old store dropped customers into collections and left them to filter.",
      'Three image-led routes from the navigation let people shop by product, by room or by print, which is how they think about their homes. The routes were designed for the phone first.',
      "Over 80% of Projektityyny's visitors are on mobile.", 'Shop by product, room or print on Projektityyny.'],
    ['lookbook-archive', 'A lookbook archive that keeps earning', 'finding', 'Projektityyny', '2026', 'Bespoke store design', URLS.bespoke,
      'When a Projektityyny collection sold out, its campaign photography disappeared with it.',
      'Every past collection stays live as a shoppable lookbook, so the photography keeps bringing in search traffic long after the launch.',
      'The whole image-led store scores 93 on Google PageSpeed.', "Projektityyny's lookbook archive."],
    ['image-first-product-cards', 'Image-first product cards', 'finding', 'Whistlefish', '[year]', 'Shopify UX design', URLS.ux,
      'Whistlefish publishes thousands of greeting card designs, and nobody chooses a card by its name. Long names broke the grid for no benefit.',
      'I cut product names to one line, so the picture leads. The multi-buy offer and an Add button sit on the card, because people often buy several cards at once.',
      undefined, 'Image-first product cards on Whistlefish.'],
    ['dinner-question-cards', 'Product cards that answer dinner questions', 'choosing', 'East at Home', '2025', 'Shopify UX design', URLS.ux,
      'People choosing a curry sauce want four answers before they click: is it hot, is it vegan, did others like it, and what does it cost?',
      'Every card shows the heat level in chilli icons, dietary information, reviews and the price, with Quick Shop to add straight from the collection. On mobile the grid becomes a list, so it all stays readable.',
      'Project result: revenue up 82%, October to June against the year before. GA4, UK sessions. East at Home won UK User Experience of the Year at the UK eCommerce Awards 2026.',
      'Product cards that answer dinner questions on East at Home.'],
    ['product-builder', 'Step-by-step product builder', 'choosing', 'Hartnack & Co', '[year]', 'Bespoke store design', URLS.bespoke,
      "Hartnack & Co's binders and boxes come in thousands of possible variations, and the choice was overwhelming customers.",
      'The builder splits the choice into guided steps, with slide-up tips, bespoke icons and a cost tracker that stays on screen.',
      'Project result: 39% more visitors buying.', "Hartnack & Co's step-by-step product builder."],
    ['customer-gallery', 'A customer gallery with the options shown', 'choosing', 'Hartnack & Co', '[year]', 'Bespoke store design', URLS.bespoke,
      'With so many options, new customers found it hard to picture what to choose.',
      'Each past creation in the gallery lists the exact options chosen, so a new customer can copy one they like.',
      undefined, "Hartnack & Co's customer gallery."],
    ['subscription-only-cards', 'Subscription-only product cards', 'choosing', 'Fuzzball', '2025', 'Subscriptions', URLS.subscriptions,
      'Some Fuzzball products are only sold on subscription. Customers found that out after clicking through and trying to add one.',
      'The card shows a lock icon, an "Only available on subscription" label and a View Product button instead of Add to Bag, so expectations are set before the click.',
      undefined, 'Subscription-only product cards on Fuzzball.'],
    ['offers-button', 'An offers button instead of sticky pop-ups', 'buying', 'Drink Finder', '2025', 'Migrations', URLS.migrations,
      "The UX review of Drink Finder's old store found sticky sign-up buttons blocking the way to checkout.",
      'Offers and events moved into a button in the navigation, which freed the announcement bar for trust messages.',
      'Found in the UX review, before any design started.', "The offers button in Drink Finder's navigation."],
    ['trial-subscription-split', 'Trial and subscription, split clearly', 'buying', 'Fuzzball', '2025', 'Subscriptions', URLS.subscriptions,
      "In Fuzzball's quiz cart, it wasn't clear which items were the trial and which would repeat.",
      'The cart separates the trial from the repeating order, so customers see exactly what they’re signing up to and nobody subscribes by accident.',
      'Clicks from the quiz summary to checkout up 86%.', "Fuzzball's quiz cart, with the trial and subscription split."],
    ['three-pages-one-screen', 'Three pages in one screen', 'buying', 'Window Fleur', '[year]', 'Subscriptions', URLS.subscriptions,
      "Window Fleur's subscription product journey ran across three pages.",
      'I rebuilt it as one mobile screen, with slide-ups for the detail, so customers set up a subscription without leaving the page.',
      'The project led to Window Fleur commissioning a full store redesign.', "Window Fleur's subscription journey on one screen."],
    ['progress-bar-with-character', 'A progress bar with character', 'brand', 'Fuzzball', '2025', 'Branding', URLS.branding,
      'A quiz is a form, and forms feel like a chore.',
      "Fuzzball's cat chases a ball along the quiz progress bar, so finishing the quiz feels like part of the brand.",
      'Project result: purchase conversion up 62.5% after the quiz redesign.', "Fuzzball's quiz progress bar."],
    ['design-system-team-runs', "A design system the client's team runs", 'brand', 'Whistlefish', '[year]', 'Bespoke store design', URLS.bespoke,
      "Whistlefish's own team needed to keep building pages after launch without the design drifting.",
      'I set up the Figma file as a templating system, with rules for how the script and sans fonts behave in the theme editor.',
      '"We\'ve since been able to carry that framework into our own design team." Will Manders, Whistlefish', "Whistlefish's design system in Figma."],
  ] as const).map(([slug, name, group, client, year, service, href, problem, howItWorks, evidence, caption]) => ({
    slug, name, group, client, year, service: { label: service, href }, summary: '', problem, howItWorks,
    ...(evidence ? { evidence } : {}), caption, video: COMPARE.video, videoUploaded: '2026-10-19', poster: COMPARE.poster,
    alt: caption,
  })),
];

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
