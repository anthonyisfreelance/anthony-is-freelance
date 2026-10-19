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
