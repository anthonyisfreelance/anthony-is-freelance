// Drink Finder case study. Copy from the Figma frame "Work - Drink FInder" (48175:18636),
// with page-copy/case-study-drink-finder.md filling the gaps where Figma has placeholder text.
import { URLS } from '../site';
import { COMPARE } from '../innovations';
import { testimonial, creditLine } from '../testimonials';
import hero from '../../assets/brands/drink-finder/hero.jpg';
import badge from '../../assets/site/badge-winner-2026.png';
import vineyard from '../../assets/brands/drink-finder/vineyard.jpg';
import stillDesktop from '../../assets/brands/drink-finder/still-desktop.jpg';
import stillPdp from '../../assets/brands/drink-finder/still-pdp.jpg';
import navSearch from '../../assets/brands/drink-finder/nav-search.jpg';
import phonePdp from '../../assets/brands/drink-finder/phone-pdp.jpg';
import phoneBrandCollection from '../../assets/brands/drink-finder/phone-brand-collection.jpg';
import uxHome from '../../assets/brands/drink-finder/ux-home.jpg';
import cocktail from '../../assets/brands/drink-finder/cocktail.jpg';
import brandBg from '../../assets/brands/drink-finder/brand-bg.jpg';
import { SERVICE, card, MORE_HEADING, type CaseStudyPageData, type Media } from './types';

const META = {
  path: URLS.caseStudies.drinkFinder,
  title: 'Drink Finder Shopify Case Study: 34% More Website Sales',
  description:
    'How I redesigned Drink Finder and moved it to Shopify. 34% more website sales and 32% more customers in six months, on till data.',
  breadcrumbs: [
    { name: 'Home', path: URLS.home },
    { name: 'Success stories', path: URLS.work },
    { name: 'Drink Finder', path: URLS.caseStudies.drinkFinder },
  ],
};

// The store the page is about, for schema.
const CLIENT = {
  name: 'Drink Finder',
  url: 'https://www.drinkfinder.co.uk/',
  display: 'drinkfinder.co.uk',
  parent: 'Constantine Stores Ltd',
};

const HERO = {
  eyebrow: 'Drink Finder Shopify case study',
  figure: '34%',
  heading: 'more website sales after launch',
  standfirst:
    'Drink Finder is the online shop of Constantine Stores, a Cornish wine and spirits merchant trading for more than 65 years, with more than 5,000 products for retail and trade buyers. I redesigned it around product discovery and moved it to Shopify, and it won UK eCommerce Website of the Year at the UK eCommerce Awards 2026.',
  image: { image: hero, alt: '' } as Media,
};

const BRIEF = {
  eyebrow: 'The brief',
  heading: 'Move to Shopify without losing the regulars',
  body: [
    'The Drink Finder brief was a move to Shopify with a redesign on top. The old site was dated, hard to use on a phone and hard to find your way around, and baskets were being abandoned.',
    'There was no sales target. The job was to make the range easy to explore, fix the basket and come through the move in better shape than we went in.',
  ],
};

const DETAILS = {
  sector: 'Food & drink',
  services: [
    SERVICE.branding,
    SERVICE.bespoke,
    { label: 'UX Design', href: URLS.ux },
    SERVICE.migrations,
  ],
  live: '19 August 2025',
  liveIso: '2025-08-19',
  rows: [
    { label: 'Results', value: '34% more website sales. 32% more customers.' },
    {
      label: 'Measured',
      value: 'Comparing the six months since launch, September to February, with the same period the year before. EPoS till data, marketplaces excluded.',
    },
  ],
  recognition: {
    text: 'Winner, UK eCommerce Website of the Year, UK eCommerce Awards 2026. Also shortlisted for Food & Drink eCommerce Website of the Year.',
    badge,
    badgeAlt: 'UK eCommerce Awards 2026 winner',
  },
};

// The full-width showcase under the brief: desktop homepage over a vineyard, then four phone screens.
// [CONFIRM] Figma repeats one product page screen four times; swap in the four final screens.
const SHOWCASE = {
  label: 'Drink Finder screens',
  background: vineyard,
  desktop: { image: stillDesktop, alt: 'The Drink Finder homepage on desktop, with search, the full category menu and the shop’s Cornish address in the header.' } as Media,
  phones: [
    { image: phonePdp, alt: 'A Drink Finder product page on mobile, with one, six and twelve bottle offers.' },
    { image: phonePdp, alt: '' },
    { image: phonePdp, alt: '' },
    { image: phonePdp, alt: '' },
  ] as Media[],
};

const WORK_INTRO = {
  eyebrow: 'The work',
  heading: 'Four decisions behind the redesign',
  body: 'The Drink Finder work started with a UX review of the old site, before any design. The review showed which areas to improve, and that is where the concepts started.',
};

// Image and text rows, in Figma order. `flip` puts the media on the left.
// [CONFIRM] Figma uses one search screen (nav-search.jpg) in rows one, two and four as a placeholder.
// It is used here for the nav row it shows; the other rows keep their own screens until final
// tall phone screens (375 × 820) are ready.
const HIGHLIGHTS = [
  {
    eyebrow: 'Shopify collection page design',
    heading: 'Compare bottles without opening every one.',
    body: 'Shopify collection page design is where wine shoppers compare. A Show extras switch opens every product card to show style, grape and country, so they compare side by side before they click.',
    media: { image: COMPARE.poster, video: COMPARE.video, alt: 'A Drink Finder collection on mobile, with the Show extras switch turning on style, grape and country on every card.' },
    link: { label: 'See the comparison toggle', href: `${URLS.innovations}#comparison-toggle` },
    flip: false,
  },
  {
    eyebrow: 'Shopify product page design',
    heading: 'Make the saving easy to see.',
    body: "Shopify product page design puts grape, region and vintage next to the bottle. Six and twelve bottle offers are buttons you tap, and the basket shows the next saving. A good offer doesn't need pushing.",
    media: { image: stillPdp, alt: 'A Drink Finder product page, with one, six and twelve bottle offers as buttons above the price.' },
    flip: true,
  },
  {
    eyebrow: 'Shopify navigation design',
    heading: 'The nav is your site.',
    body: 'I designed Drink Finder’s mobile navigation from scratch, so a customer gets from the home screen to a Spanish Rioja or an organic Cornish wine in a few taps. Search suggests popular searches and bottles before you type.',
    media: { image: navSearch, alt: 'Drink Finder search on mobile, with popular searches and popular products showing before you type.' },
    flip: false,
  },
  {
    eyebrow: 'Shopify UX review',
    heading: 'Design for what shoppers actually saw.',
    body: 'The Shopify UX review mapped every screen at real phone sizes. Sticky sign-up buttons and a chat widget covered the buttons that mattered, so the offer moved into a notifications button in the header.',
    media: { image: uxHome, alt: 'The Drink Finder homepage on mobile, with nothing covering the buttons.' },
    flip: true,
  },
];

// Scrolling column of screens beside a sticky photo.
// [CONFIRM] Figma repeats one collection screen five times; swap in the five final screens.
const GALLERY = {
  label: 'More Drink Finder screens',
  listLabel: 'Drink Finder brand collection screens',
  screens: Array.from({ length: 5 }, (_, i) => ({
    image: phoneBrandCollection,
    alt: i === 0 ? 'A Drink Finder brand collection page on mobile, with the distillery story above the products.' : '',
  })) as Media[],
  photo: { image: cocktail, alt: '' } as Media,
  // Describes the screens beside it. [CONFIRM] Rewrite when the five final screens are in.
  caption: 'Drink Finder brand collection pages on mobile, with each distillery’s story above its bottles.',
};

const BRAND = {
  background: brandBg,
  eyebrow: 'Brand refinement and design system',
  heading: 'Still Drink Finder, sharper on a phone.',
  body: 'A brand refinement, not a rebrand: a tighter logomark for small screens, type for reading on a phone and colours that work the same on every page. Every screen was designed mobile first in Figma and handed over as a design system.',
  media: { image: phonePdp, alt: 'A Drink Finder product page on mobile in the refined brand.' } as Media,
};

const TESTIMONIAL = {
  eyebrow: 'Drink Finder testimonial',
  heading: 'In the client’s words.',
  quote:
    'Our site is a beast handling the distinct functional requirements for wine vs. spirits, managing wholesale and retail channels, and juggling complex shipping metrics. Ant was incredibly accommodating, ensuring the site received a modern upgrade without alienating our core customers. He kept the ‘Drink Finder’ soul intact while significantly smoothing out the user journey. … He didn’t just give us a facelift; he built a platform that performs.',
  // Name, role and year from the testimonials record, as on the homepage.
  cite: creditLine(testimonial('drink-finder')),
};

export const DATA: CaseStudyPageData = {
  meta: META,
  client: CLIENT,
  hero: HERO,
  brief: BRIEF,
  details: DETAILS,
  showcase: SHOWCASE,
  workIntro: WORK_INTRO,
  highlights: HIGHLIGHTS,
  gallery: GALLERY,
  feature: BRAND,
  testimonial: TESTIMONIAL,
  more: { ...MORE_HEADING, cards: [card('East at Home'), card('Fuzzball'), card('Thameen London')] },
};
