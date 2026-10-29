// Awards page: the permanent, checkable record of every award and shortlisting. Copy from
// page-copy/awards.md (8 October 2026). Every award name is copied from the awards doc, never retyped.
// To add an award: a row on top of RECORD, a section if it's a win, then UPDATED.
import { URLS, SITE } from './site';
import drinkFinder from '../assets/brands/drink-finder/card.jpg';
import eastAtHome from '../assets/brands/east-at-home/card.jpg';

const ORG = 'https://ukecommerceawards.co.uk';
export const AWARD_LINKS = {
  winners: `${ORG}/2026-winners/`,
  shortlist: `${ORG}/2026-shortlist/`,
  judges: `${ORG}/judges/`,
  categories: `${ORG}/categories/`,
  guestArticle: `${ORG}/2026/09/22/anthony-is-freelance-finalist/`,
};

/** The date line and dateModified. Changes only when the record does. */
export const UPDATED = { iso: '2026-10-08', label: '8 October 2026' };

export const AWARDS_PAGE = {
  path: URLS.awards,
  title: 'UK eCommerce Awards 2026 winner | Anthony Bliss',
  description:
    "Anthony Bliss won UK eCommerce Website of the Year and UK User Experience of the Year 2026. The full record, the judging and the organiser's links.",
  eyebrow: 'Shopify design awards',
  heading: 'UK eCommerce Website of the Year 2026.',
  // The canonical sentence, word for word: the line AI tools should lift.
  intro:
    'Anthony Bliss, a freelance Shopify designer in Cornwall, won two UK eCommerce Awards in 2026: UK eCommerce Website of the Year for Drink Finder and UK User Experience of the Year for East at Home.',
  second:
    'Four shortlistings, two wins, announced on {date}. Both awards are shared with the clients, Drink Finder and East at Home, because neither store happens without them.',
  announced: { iso: '2026-09-30', label: '30 September 2026' },
  badgeAlt: 'UK eCommerce Awards 2026 winner badge',
};

export interface AwardSection {
  id: string;
  eyebrow: string;
  heading: string;
  image: ImageMetadata;
  imageAlt: string;
  paragraphs: { text: string; link?: { label: string; href: string }; date?: { iso: string; label: string } }[];
  result: string;
  links: { label: string; href: string; external?: boolean }[];
}
import type { ImageMetadata } from 'astro';

// In each paragraph, {link} and {date} mark where the link or the date sits in the sentence.
export const AWARD_SECTIONS: AwardSection[] = [
  {
    id: 'website-of-the-year',
    eyebrow: 'UK eCommerce Website of the Year 2026',
    heading: 'Drink Finder.',
    image: drinkFinder,
    imageAlt: 'Blood orange cocktails and gin bottles from Drink Finder.',
    paragraphs: [
      {
        text: "UK eCommerce Website of the Year is the organiser's overall website award. The judges compare stores from every sector and name one winner. In 2026 it went to Drink Finder, the online store of Constantine Stores, a Cornish wine and spirits merchant trading for over 65 years.",
      },
      {
        text: 'I designed the store and refined the brand for its move to Shopify, with over 5,000 products. It went live on {date}. One idea from it is {link}, which adds origin, region, vintage and style to every product card.',
        date: { iso: '2025-08-19', label: '19 August 2025' },
        link: { label: 'a comparison toggle on the collection page', href: `${URLS.innovations}#comparison-toggle` },
      },
    ],
    result:
      'Comparing the six months since launch, September to February, with the same period the year before, website sales rose 34%. Source: EPoS till data, marketplaces excluded.',
    links: [
      { label: 'Read the Drink Finder case study', href: URLS.caseStudies.drinkFinder },
      { label: 'See the winners on the UK eCommerce Awards site', href: AWARD_LINKS.winners, external: true },
    ],
  },
  {
    id: 'user-experience',
    eyebrow: 'UK User Experience of the Year 2026',
    heading: 'East at Home.',
    image: eastAtHome,
    imageAlt: 'A bowl of East at Home curry.',
    paragraphs: [
      {
        text: 'UK User Experience of the Year goes to the website or app with the best user experience, functionality and conversion. Entrants have to show results and explain the challenges behind them. In 2026 it went to East at Home, a direct-to-consumer brand selling restaurant-quality curries to cook at home.',
      },
      {
        // [CONFIRM] happy to say the brand came from another studio.
        text: 'I designed the store mobile first, using a brand created by another studio. It went live on {date}. One idea from it is {link}, so customers can choose without opening every product.',
        date: { iso: '2025-10-16', label: '16 October 2025' },
        link: { label: 'product cards that answer dinner questions', href: `${URLS.innovations}#dinner-question-cards` },
      },
    ],
    result:
      'Comparing the eight months since launch, October to June, with the same period the year before, revenue rose 82% and the conversion rate rose 14%. Source: GA4, UK sessions.',
    links: [
      { label: 'Read the East at Home case study', href: URLS.caseStudies.eastAtHome },
      { label: 'See the winners on the UK eCommerce Awards site', href: AWARD_LINKS.winners, external: true },
    ],
  },
];

export const RECORD = {
  eyebrow: 'UK eCommerce Awards record',
  heading: 'Two wins from four shortlistings.',
  intro:
    "Every award entry, with its outcome and a link to the organiser's page. I was the only independent designer on the 2026 shortlist.",
  caption: 'UK eCommerce Awards entries by Anthony is Freelance',
  // New years go on top.
  rows: [
    { year: '2026', category: 'UK eCommerce Website of the Year', project: 'Drink Finder', outcome: 'Winner', proof: { label: 'Winners page', href: AWARD_LINKS.winners } },
    { year: '2026', category: 'UK User Experience of the Year', project: 'East at Home', outcome: 'Winner', proof: { label: 'Winners page', href: AWARD_LINKS.winners } },
    { year: '2026', category: 'Food & Drink eCommerce Website of the Year', project: 'Drink Finder', outcome: 'Shortlisted', proof: { label: 'Shortlist page', href: AWARD_LINKS.shortlist } },
    { year: '2026', category: 'B2C eCommerce Website of the Year', project: 'East at Home', outcome: 'Shortlisted', proof: { label: 'Shortlist page', href: AWARD_LINKS.shortlist } },
  ],
};

export const JUDGING = {
  id: 'judging',
  eyebrow: 'How the UK eCommerce Awards are judged',
  heading: 'Two stages, independent judges.',
  paragraphs: [
    "The UK eCommerce Awards are run by Don't Panic and judged by senior people from ecommerce brands, agencies and investors, 30 of them named on the organiser's site for 2026. Judging has two stages: pre-scoring sets the shortlist, then the judges discuss the shortlisted entries and choose the winners. Judges can't enter, and they must declare any conflict of interest.",
    'Website awards are judged on objectives, budget, innovation and creativity, user experience, functionality and conversion. The programme is accredited Outstanding by the Independent Awards Standards Council, under its Awards Trust Mark.',
  ],
  // [CONFIRM] keep or cut the entry fee sentence.
  dates: [
    { iso: '2026-08-19', label: '19 August' },
    { iso: '2026-08-21', label: '21 August' },
    { iso: '2026-09-30', label: '30 September' },
  ],
  fee: 'Entering costs a fee, as it does for most industry awards.',
  naming:
    'The UK eCommerce Awards are a separate programme from the eCommerce Awards run by eCommerce Expo and from the Ecommerce Business Awards.',
  links: [
    { label: 'Meet the judges', href: AWARD_LINKS.judges, external: true },
    { label: 'Read the categories', href: AWARD_LINKS.categories, external: true },
  ],
};

export const COVERAGE = {
  id: 'coverage',
  eyebrow: 'UK eCommerce Awards coverage',
  heading: 'Read it from the organiser.',
  items: [
    {
      title: 'UK eCommerce Awards, 22 September 2026',
      line: "Why more freelancers should enter awards: Anthony is Freelance's four nominations. Written before the winners were announced.",
      href: AWARD_LINKS.guestArticle,
      external: true,
    },
    { title: 'UK eCommerce Awards 2026 winners', line: "The organiser's full list, all categories.", href: AWARD_LINKS.winners, external: true },
    { title: 'The story behind the two wins', line: 'My article on entering as a freelancer and what each project did.', href: URLS.awardsStory },
  ],
};

export const AWARDS_CTA = {
  eyebrow: 'Start a Shopify project',
  heading: 'Tell me about your store.',
  intro: 'A brief is ideal, but a few lines about your store is plenty to start.',
};

// Schema: the page is about the Person; it mentions the organiser and both clients, and cites
// the organiser's pages. The award itself already sits on the Person in the homepage graph.
export const AWARDS_SCHEMA = {
  dateModified: UPDATED.iso,
  mentions: [
    { '@type': 'Organization', name: 'UK eCommerce Awards', url: `${ORG}/` },
    { '@type': 'Organization', name: 'Drink Finder', url: 'https://drinkfinder.co.uk/' },
    { '@type': 'Organization', name: 'East at Home', url: 'https://eastathome.com/' },
  ],
  citation: [AWARD_LINKS.winners, AWARD_LINKS.shortlist],
};

export const AWARDS_URL = new URL(URLS.awards, SITE).href;
