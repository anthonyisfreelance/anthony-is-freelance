// Drink Finder case study. Copy from the Figma frame "Work - Drink FInder" (48175:18636),
// with page-copy/case-study-drink-finder.md filling the gaps where Figma has placeholder text.
import { URLS } from '../site';
import { COMPARE } from '../innovations';
import { testimonial, creditLine } from '../testimonials';
import hero from '../../assets/brands/drink-finder/hero.jpg';
import badge from '../../assets/site/badge-winner-2026.png';
import vineyard from '../../assets/brands/drink-finder/vineyard.jpg';
import aperol from '../../assets/brands/drink-finder/split-photo.jpg';
import stillDesktop from '../../assets/brands/drink-finder/still-desktop.jpg';
import { brandImage } from '../media';
import { SERVICE, slot, moreFor, MORE_HEADING, type CaseStudyPageData, type Media, type Split } from './types';

const B = 'drink-finder';

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
  eyebrow: 'Drink Finder Shopify migration brief',
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

// The full-width showcase under the brief: a scroll through the desktop site over a vineyard, then
// four phone screens. Files in src/assets/brands/drink-finder (stills) and public/video/drink-finder
// (recordings), found by name.
const SHOWCASE = {
  label: 'Drink Finder screens',
  background: vineyard,
  desktop: slot(B, 'work-website-scroll-desktop', 'Drink Finder on desktop, from the homepage to the red wine collection and a product page.', 'Desktop'),
  phones: [
    slot(B, 'work-homepage', 'The Drink Finder homepage on mobile.', 'Homepage'),
    slot(B, 'work-whiskey-mobile', 'Browsing the Drink Finder whisky collection on mobile.', 'Whisky'),
    slot(B, 'work-brand-page', 'A Drink Finder brand page on mobile, with the distillery’s story above its bottles.', 'Brand page'),
    slot(B, 'work-wine-pdp-mobile', 'A Drink Finder wine product page on mobile, with one, six and twelve bottle offers.', 'Wine product page'),
  ] as Media[],
};

const WORK_INTRO = {
  eyebrow: 'Drink Finder Shopify design',
  heading: 'What changed for wine shoppers',
  body: 'The Drink Finder work started with a UX review of the old site, before any design. The review showed which areas to improve, and that is where the concepts started.',
};

// Image and text rows, in Figma order. `flip` puts the media on the left. Each row's recording is
// named for the row: work-savings, work-menu and work-notifications.
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
    media: slot(B, 'work-savings-mobile', 'A Drink Finder product page on mobile, with one, six and twelve bottle offers as buttons above the price.', 'Savings'),
    flip: true,
  },
  {
    eyebrow: 'Shopify navigation design',
    heading: 'The nav is your site.',
    body: 'I designed Drink Finder’s mobile navigation from scratch, so a customer gets from the home screen to a Spanish Rioja or an organic Cornish wine in a few taps. Search suggests popular searches and bottles before you type.',
    media: slot(B, 'work-menu-mobile', 'The Drink Finder menu on mobile, from the home screen to a wine region in a few taps.', 'Menu'),
    flip: false,
  },
  {
    eyebrow: 'Shopify UX review',
    heading: 'Design for what shoppers actually saw.',
    body: 'The Shopify UX review mapped every screen at real phone sizes. Sticky sign-up buttons and a chat widget covered the buttons that mattered, so the offer moved into a notifications button in the header.',
    media: slot(B, 'work-notifications-mobile', 'Drink Finder on mobile, with the offers in a notifications button in the header and nothing covering the buttons.', 'Notifications'),
    flip: true,
  },
];

// One 50/50 halfway through the work, after row 2 of 5 (trial, 27 October 2026): the
// Aperol photo sticks at full height while desktop screens scroll past on a tint from it (Figma
// 48371:4927: #F6A553 at 50% over white). Desktop only, the one place the page shows it off
// after the hero. Drop in split-desktop-1 to -5 (stills or recordings); the first falls back to
// the homepage still, the others show a placeholder.
const SPLITS: Split[] = [
  {
    label: 'Drink Finder on desktop',
    photo: { image: aperol, alt: '' },
    screens: [
      { device: 'desktop', media: { ...slot(B, 'split-desktop-1', 'The Drink Finder homepage on desktop, from the wine and whisky categories to the top 10.', 'Desktop homepage'), image: brandImage(B, 'split-desktop-1') ?? stillDesktop } },
      { device: 'desktop', media: slot(B, 'split-desktop-2', 'The Drink Finder whisky collection on desktop.', 'Desktop collection') },
      { device: 'desktop', media: slot(B, 'split-desktop-3', 'A Drink Finder gin product page on desktop, with the details sticking beside the photos.', 'Desktop product page') },
      // The top 10 and the articles (feedback #135, 28 October 2026)
      { device: 'desktop', media: slot(B, 'split-desktop-4', 'The Drink Finder top 10 wines on desktop, each bottle ranked with a numbered badge.', 'Desktop top 10') },
      { device: 'desktop', media: slot(B, 'split-desktop-5', 'The Drink Finder blog on desktop, with articles filtered by events, news, recipes and visits.', 'Desktop articles') },
    ],
    tint: '#FAD1A9',
  },
];

// The last work row: the design system, on the plain background (27 October 2026, was the
// full-bleed feature section).
const BRAND = {
  eyebrow: 'Brand refinement and design system',
  heading: 'Still Drink Finder, sharper on a phone.',
  body: 'A brand refinement, not a rebrand: a tighter logomark for small screens, type for reading on a phone and colours that work the same on every page. Every screen was designed mobile first in Figma and handed over as a design system.',
  media: slot(B, 'work-design-system-mobile', 'Drink Finder on mobile in the refined brand, built from the design system.', 'Design system'),
  flip: false,
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
  highlights: [...HIGHLIGHTS, BRAND],
  splits: SPLITS,
  testimonial: TESTIMONIAL,
  more: { ...MORE_HEADING, cards: moreFor('Drink Finder') },
};
