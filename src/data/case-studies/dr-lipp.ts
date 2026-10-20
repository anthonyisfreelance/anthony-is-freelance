// Dr Lipp case study. Copy from the "Case study copy: Dr Lipp" doc (20 October 2026).
// No photos or screens in the repo yet: everything drops in by name, see src/assets/brands/README.md.
import { SERVICE, slot, photo, photoMedia, card, breadcrumbs, MORE_HEADING, type CaseStudyPageData } from './types';

const B = 'dr-lipp';
const PATH = '/portfolio/dr-lipp-shopify-website-case-study/';

export const DATA: CaseStudyPageData = {
  meta: {
    path: PATH,
    title: 'Dr Lipp Shopify Case Study: 38% Higher Conversion Rate',
    description:
      'How I re-themed cult beauty brand Dr Lipp on Shopify. Conversion rate up 38%, orders up 28% and sales up 15%, on Shopify data.',
    breadcrumbs: breadcrumbs('Dr Lipp', PATH),
  },
  // [CONFIRM] store URL
  client: { name: 'Dr Lipp', url: 'https://drlipp.com/', display: 'drlipp.com' },
  hero: {
    eyebrow: 'Dr Lipp Shopify case study',
    figure: '38%',
    heading: 'higher conversion rate',
    // [CONFIRM] what Dr Lipp sells, in their words.
    standfirst:
      'Dr Lipp is a cult beauty brand best known for its multi-use balm. I re-themed its Shopify store with a refined design system and a full library of Shopify 2.0 sections, so the team can build new pages from the theme editor.',
    image: photoMedia(B, 'hero'),
  },
  brief: {
    eyebrow: 'The brief',
    heading: 'A cult brand on a store that held it back',
    body: [
      // [CONFIRM] what wasn't working on the old store.
      'The Dr Lipp brief was a new Shopify theme with a design that matched the brand. The team needed sections they could use for every page and campaign.',
      '[CONFIRM: one or two lines on what the UX review or the client flagged, for example navigation or the product page.]',
    ],
  },
  details: {
    sector: 'Beauty',
    services: [SERVICE.theme],
    live: '5 May 2024',
    liveIso: '2024-05-05',
    // Average order value and returning customer rate fell over the same period: don't claim them anywhere.
    rows: [
      { label: 'Results', value: '38% higher conversion rate. 28% more orders. 15% more sales.' },
      { label: 'Measured', value: 'From launch on 5 May 2024 to 3 February 2025, compared with the previous period. Shopify data.' },
    ],
  },
  showcase: {
    label: 'Dr Lipp screens',
    background: photo(B, 'showcase-photo'),
    desktop: slot(B, 'showcase-desktop', 'The Dr Lipp store on desktop: the homepage, the navigation and a product page.', 'Desktop store recording'),
    phones: [
      slot(B, 'showcase-phone-1', 'The Dr Lipp homepage on mobile.', 'Homepage'),
      slot(B, 'showcase-phone-2', 'A Dr Lipp collection on mobile.', 'Collection'),
      slot(B, 'showcase-phone-3', 'The Dr Lipp cart on mobile.', 'Cart'),
      slot(B, 'showcase-phone-4', 'Dr Lipp search on mobile.', 'Search'),
    ],
  },
  workIntro: {
    eyebrow: 'The work',
    heading: 'Three decisions behind the re-theme',
    body: 'The Dr Lipp work started with a refined design system and ended with every Shopify 2.0 section designed and prototyped in Figma, tested on a real phone before the build.',
  },
  highlights: [
    {
      eyebrow: 'Shopify navigation design',
      heading: '[CONFIRM: what it does for shoppers]',
      body: 'Shopify navigation design for Dr Lipp [CONFIRM: one design decision, for example routes by product or by concern].',
      media: slot(B, 'work-01', 'The Dr Lipp navigation on mobile.', 'The navigation recording'),
    },
    {
      eyebrow: 'Shopify product page design',
      heading: 'Usage, ingredients, how to use.',
      body: 'Shopify product page design for a multi-use product means answering how to use it. Each Dr Lipp product page sets out usage, ingredients and how to use in its own section.',
      media: slot(B, 'work-02', 'A Dr Lipp product page on mobile, with the usage section open.', 'The product page recording'),
    },
    {
      eyebrow: 'Shopify 2.0 sections',
      heading: 'A library the team builds with.',
      body: 'Shopify 2.0 sections were designed for every page type, so the Dr Lipp team can build new pages and campaigns from the theme editor without the design drifting.',
      media: slot(B, 'work-03', 'The full library of Dr Lipp Shopify 2.0 sections.', 'The all-sections recording'),
    },
  ],
  gallery: {
    label: 'More Dr Lipp screens',
    screens: [
      slot(B, 'gallery-1', 'The Dr Lipp ingredients section on mobile.', 'Ingredients section'),
      slot(B, 'gallery-2', 'The Dr Lipp how to use section on mobile.', 'How to use'),
      slot(B, 'gallery-3', 'The Dr Lipp blog on mobile.', 'Blog'),
      slot(B, 'gallery-4', 'The Dr Lipp contact page on mobile.', 'Contact page'),
      slot(B, 'gallery-5', '', 'Fifth screen'), // [CONFIRM] a fifth screen
    ],
    photo: photoMedia(B, 'gallery-photo'),
    caption: 'Dr Lipp on mobile: ingredients, how to use and the blog, all built from the same Shopify 2.0 sections.',
  },
  feature: {
    background: photo(B, 'feature-photo'),
    eyebrow: 'Shopify design system',
    heading: 'Refined, accessible and ready to grow.',
    body: 'Dr Lipp’s design system refines the brand into a modern, accessible set of elements, states and components. Every page was built from it and prototyped in Figma, so the purchase journey was tested on a real phone before the build.',
    media: slot(B, 'feature', 'A Dr Lipp screen on mobile in the design system.', 'Design system screen'),
  },
  // No quote yet: ask Dr Lipp, or the agency if the work came through one. The page goes live either way.
  more: { ...MORE_HEADING, cards: [card('Thameen London'), card('Wide Fit Shoes'), card('East at Home')] },
};
