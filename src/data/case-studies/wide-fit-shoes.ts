// Wide Fit Shoes case study. Copy from the "Case study copy: Wide Fit Shoes" doc (20 October 2026).
// Screens drop in by name: see src/assets/brands/README.md.
import { URLS } from '../site';
import { SERVICE, slot, photo, photoMedia, moreFor, breadcrumbs, MORE_HEADING, type CaseStudyPageData, desktopSplit } from './types';
import trainers from '../../assets/brands/wide-fit-shoes/card.jpg';

const B = 'wide-fit-shoes';
const PATH = URLS.caseStudies.wideFitShoes;

export const DATA: CaseStudyPageData = {
  meta: {
    path: PATH,
    title: 'Wide Fit Shoes Shopify Case Study: One System, Two Stores',
    description: 'How I redesigned Wide Fit Shoes on its existing Shopify theme, with one design system running its UK and US stores.',
    breadcrumbs: breadcrumbs('Wide Fit Shoes', PATH),
  },
  // [CONFIRM] store URLs. The US store is widefitshoes.com.
  client: { name: 'Wide Fit Shoes', url: 'https://widefitshoes.co.uk/', display: 'widefitshoes.co.uk' },
  hero: {
    eyebrow: 'Wide Fit Shoes Shopify case study',
    heading: 'One system, two stores',
    standfirst:
      'Wide Fit Shoes sells wide-fitting footwear through two Shopify stores, one for the UK and one for the US. I redesigned both on their existing theme, with one design system and product cards that show width and colour before the click.',
    image: photoMedia(B, 'hero', trainers),
  },
  brief: {
    eyebrow: "Wide Fit Shoes Shopify brief",
    heading: "Modernise both stores without changing theme",
    body: [
      'The Wide Fit Shoes brief was a modern design for the UK and US stores, built on the Shopify theme both already used. Navigation and search needed the most work.',
      'GA4 showed customers across a wide range of ages, so the design had to feel right to all of them: not too young, not too old, and easy to read.',
    ],
  },
  details: {
    sector: 'Fashion',
    services: [SERVICE.theme],
    live: '1 August 2024',
    liveIso: '2024-08-01',
    rows: [
      // [CONFIRM] colour contrast only, or wider AAA
      { label: 'Designed for', value: 'Customers of every age, on a palette built for WCAG AAA contrast.' },
      { label: 'Theme', value: 'Impulse' }, // [CONFIRM] the live page says "Inpulse"
      // #214 (28 October 2026): the live stores have moved on since, so the screens come from the Figma file.
      { label: 'Screens', value: 'Shown as designed in Figma. The live stores have changed since.' },
    ],
  },
  showcase: {
    label: 'Wide Fit Shoes screens',
    background: photo(B, 'showcase-photo'),
    // Built from the Figma file (#214, 28 October 2026), placeholder copy replaced on copies of the frames.
    desktop: slot(B, 'showcase-desktop', 'The Wide Fit Shoes design on desktop: the homepage, then a men’s collection and a product page.', 'Desktop design'),
    phones: [
      slot(B, 'showcase-phone-1', 'The Wide Fit Shoes homepage on mobile, scrolling from the hero to the newsletter sign-up.', 'Homepage'),
      slot(B, 'showcase-phone-2', 'Wide Fit Shoes search on mobile, with suggested searches, quick links and visual search.', 'Search'),
      slot(B, 'showcase-phone-3', 'A Wide Fit Shoes men’s collection on mobile, opening the colour and size filters.', 'Collection'),
      slot(B, 'showcase-phone-4', 'A Wide Fit Shoes product page on mobile, with the shopping bag sliding in.', 'Bag'),
    ],
  },
  workIntro: {
    eyebrow: "Wide Fit Shoes Shopify UX design",
    heading: "Two stores, one set of decisions",
    body: 'The Wide Fit Shoes work started with the GA4 data, before any design. The data showed who was shopping, and that is where the concepts started.',
  },
  highlights: [
    {
      eyebrow: 'Shopify UX design',
      heading: 'Inclusive for every age.',
      body: 'Shopify UX design for Wide Fit Shoes started with personas built from GA4. Customers ranged widely in age, so inclusivity guided every decision: clear type, calm layouts and no hover tricks.',
      media: slot(B, 'work-01', 'The Wide Fit Shoes mobile menu, opening Mens and then Shoes to show each collection.', 'The second-level navigation'),
    },
    {
      eyebrow: 'Wide fit product card design',
      heading: 'Width and colour before the click.',
      body: 'Shopify product card design usually means an image. Wide Fit Shoes customers also need the fit and the colours, so every card shows the width fitting and the colour options up front.',
      media: slot(B, 'work-02', 'A Wide Fit Shoes collection on mobile, with every product card showing the width fittings and colour options.', 'The product cards'),
    },
    {
      eyebrow: 'Variant image design',
      heading: 'Colours shown as shoes.',
      body: 'Variant image design on Wide Fit Shoes product pages shows variants as images of the shoe, not plain swatches. The page was reordered into a clear hierarchy, with every button state mapped for the build.',
      media: slot(B, 'work-03', 'A Wide Fit Shoes product page on mobile, from the colour and width options down to reviews and similar items.', 'The product page'),
    },
    {
      eyebrow: 'Gift landing page design',
      heading: 'Send people somewhere useful.',
      body: 'Shopify landing pages work when they send people on. Collections by gift price, and one for the party season, gave the Christmas page somewhere useful to go next.',
      media: slot(B, 'work-04', 'The Wide Fit Shoes Christmas landing page on mobile, with gifts by recipient and by budget.', 'The Christmas landing page'),
    },
  ],
  // One 50/50 halfway through the work (27 October 2026): this photo sticks at full height while
  // desktop screens scroll past on the tint. Four screens from the Figma file (#214, #263).
  splits: [desktopSplit(B, 'Wide Fit Shoes', photoMedia(B, 'split-1-photo'), '#B7CC97', 4, [], [
    // Feedback #263 (29 October 2026): the product page first, then the men's and Christmas landing pages, a collection fourth.
    'A Wide Fit Shoes product page on desktop, with the width and size options beside the gallery.',
    'The Wide Fit Shoes men’s landing page on desktop, with a row of categories and links by width.',
    'The Wide Fit Shoes Christmas landing page on desktop, with gifts by recipient, budget and brand.',
    'A Wide Fit Shoes men’s collection on desktop, with category links above the product cards.',
  ])],
  feature: {
    background: photo(B, 'feature-photo'),
    eyebrow: 'Two-store design system',
    heading: 'One file for the UK and US.',
    body: 'Both Wide Fit Shoes stores run on one design system in Figma, with every Shopify 2.0 section mapped and styled. A neutral palette keeps it legible and lets the shoes do the talking, and new pages start from the file, not from scratch.',
    media: slot(B, 'feature', 'The Wide Fit Shoes men’s landing page on mobile, built from the design system’s sections.', 'Men’s landing page'),
  },
  // No quote yet: ask Wide Fit Shoes, or the agency if the work came through one. The page goes live either way.
  more: { ...MORE_HEADING, cards: moreFor('Wide Fit Shoes') },
};
