// Wide Fit Shoes case study. Copy from the "Case study copy: Wide Fit Shoes" doc (20 October 2026).
// Screens drop in by name: see src/assets/brands/README.md.
import { URLS } from '../site';
import { SERVICE, slot, photo, photoMedia, moreFor, breadcrumbs, MORE_HEADING, type CaseStudyPageData } from './types';
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
    ],
  },
  showcase: {
    label: 'Wide Fit Shoes screens',
    background: photo(B, 'showcase-photo'),
    desktop: slot(B, 'showcase-desktop', 'The Wide Fit Shoes store on desktop: the homepage, a collection and its sub-collection routes.', 'Desktop design recording'),
    phones: [
      slot(B, 'showcase-phone-1', 'The Wide Fit Shoes homepage on mobile.', 'Homepage'),
      slot(B, 'showcase-phone-2', 'The Wide Fit Shoes navigation on mobile.', 'Navigation'),
      slot(B, 'showcase-phone-3', 'A Wide Fit Shoes collection on mobile.', 'Collection'),
      slot(B, 'showcase-phone-4', 'The Wide Fit Shoes bag on mobile.', 'Bag'),
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
      media: slot(B, 'work-01', 'The Wide Fit Shoes mobile navigation, with clear routes into each collection.', 'The second-level navigation'),
    },
    {
      eyebrow: 'Wide fit product card design',
      heading: 'Width and colour before the click.',
      body: 'Shopify product card design usually means an image. Wide Fit Shoes customers also need the fit and the colours, so every card shows the width fitting and the colour options up front.',
      media: slot(B, 'work-02', 'Wide Fit Shoes product cards showing the width fitting and colour options.', 'The product cards'),
    },
    {
      eyebrow: 'Variant image design',
      heading: 'Colours shown as shoes.',
      body: 'Variant image design on Wide Fit Shoes product pages shows variants as images of the shoe, not plain swatches. The page was reordered into a clear hierarchy, with every button state mapped for the build.',
      media: slot(B, 'work-03', 'A Wide Fit Shoes product page, with colour variants shown as images of the shoe.', 'The product page recording'),
    },
    {
      eyebrow: 'Gift landing page design',
      heading: 'Send people somewhere useful.',
      body: 'Shopify landing pages work when they send people on. Collections by gift price, and one for the party season, gave the Christmas page somewhere useful to go next.',
      media: slot(B, 'work-04', 'The Wide Fit Shoes Christmas landing page, with signposts to gift price collections.', 'The landing pages recording'),
    },
  ],
  // 50/50 blocks between the work rows, in place of the sticky gallery (23 October 2026).
  splits: [
    {
      after: 2,
      label: "Wide Fit Shoes filters",
      photo: photoMedia(B, 'split-1-photo'),
      screen: slot(B, 'split-1-screen', "Wide Fit Shoes filters on mobile.", "Filters"),
      tint: '#B4C0D0',
      caption: "Filters on mobile, on the neutral palette built for easy reading.",
    },
    {
      after: 3,
      label: "Wide Fit Shoes product details",
      photo: photoMedia(B, 'split-2-photo'),
      screen: slot(B, 'split-2-screen', "Wide Fit Shoes product page information on mobile.", "Product page information"),
      tint: '#B4C0D0',
      photoSide: 'right',
      caption: "Product details on mobile, on the same palette, built for WCAG AAA contrast.",
    },
  ],
  feature: {
    background: photo(B, 'feature-photo'),
    eyebrow: 'Two-store design system',
    heading: 'One file for the UK and US.',
    body: 'Both Wide Fit Shoes stores run on one design system in Figma, with every Shopify 2.0 section mapped and styled. A neutral palette keeps it legible and lets the shoes do the talking, and new pages start from the file, not from scratch.',
    media: slot(B, 'feature', 'A Wide Fit Shoes screen on mobile in the design system.', 'Design system screen'),
  },
  // No quote yet: ask Wide Fit Shoes, or the agency if the work came through one. The page goes live either way.
  more: { ...MORE_HEADING, cards: moreFor('Wide Fit Shoes') },
};
