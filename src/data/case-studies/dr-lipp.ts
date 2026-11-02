// Dr Lipp case study. Copy from the "Case study copy: Dr Lipp" doc (20 October 2026).
// Screens drop in by name, see src/assets/brands/README.md. Since 2 November 2026 every screen comes from the
// Dr Lipp Design System Figma file (placeholder copy replaced on copies, page "Portfolio exports (copies)"),
// apart from the feature row, which is still the launch recording of the Clean Beauty Charter page.
import { SERVICE, BUILDER, slot, photo, photoMedia, moreFor, breadcrumbs, MORE_HEADING, type CaseStudyPageData } from './types';

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
    eyebrow: "Dr Lipp Shopify brief",
    heading: "A cult brand held back by its store",
    body: [
      'The Dr Lipp brief was a new Shopify theme with a design that matched the brand. The team needed sections they could use for every page and campaign.',
    ],
  },
  details: {
    sector: 'Beauty',
    services: [SERVICE.theme, SERVICE.ux],
    builtBy: BUILDER.cartmasters,
    live: 'May 2024',
    liveIso: '2024-05-05',
    // Average order value and returning customer rate fell over the same period: don't claim them anywhere.
    rows: [
      { label: 'Results', value: '38% higher conversion rate. 28% more orders. 15% more sales.' },
      { label: 'Measured', value: 'From launch on 5 May 2024 to 3 February 2025, compared with the previous period. Shopify data.' },
      { label: 'Screens', value: 'Shown as designed in Figma, apart from the Clean Beauty Charter page. The live store has changed since.' },
    ],
  },
  showcase: {
    label: 'Dr Lipp screens',
    background: photo(B, 'showcase-photo'),
    desktop: slot(B, 'showcase-desktop', 'A scroll down the Dr Lipp homepage on desktop.', 'Desktop design recording'),
    phones: [
      // From the Figma file (2 November 2026): video, still, video, still.
      slot(B, 'showcase-phone-1', 'A scroll down the Dr Lipp All Ways product page on mobile.', 'Product page'),
      slot(B, 'showcase-phone-2', 'The Dr Lipp shop all collection on mobile.', 'Collection'),
      slot(B, 'showcase-phone-3', 'The Dr Lipp shopping bag sliding in over a product page on mobile, with a free shipping bar and suggestions.', 'Cart'),
      slot(B, 'showcase-phone-4', 'Dr Lipp search on mobile, with related products and articles.', 'Search'),
    ],
  },
  workIntro: {
    eyebrow: "Dr Lipp Shopify 2.0 design",
    heading: "Built to keep growing",
    body: 'The Dr Lipp work started with a refined design system and ended with every Shopify 2.0 section designed and prototyped in Figma, tested on a real phone before the build.',
  },
  highlights: [
    {
      eyebrow: 'Skincare navigation design',
      heading: '[CONFIRM: what it does for shoppers]',
      body: 'Dr Lipp’s navigation [CONFIRM: one design decision, for example routes by product or by concern].',
      media: slot(B, 'work-01', 'The Dr Lipp menu on mobile, opening Shop all and then Bundle & Save, each with its products in the menu.', 'The navigation recording'),
    },
    {
      eyebrow: 'Multi-use product page design',
      heading: 'Usage, ingredients, how to use.',
      body: 'A multi-use balm needs to answer how to use it. Each Dr Lipp product page sets out usage, ingredients and how to use in its own section.',
      media: slot(B, 'work-02', 'The 5 in 1 section of the Dr Lipp All Ways product page on mobile: make-up remover, face cleanser, body wash, shampoo and shaving foam.', 'The product page usage section'),
    },
    {
      eyebrow: 'Shopify 2.0 sections',
      heading: 'A library the team builds with.',
      body: 'I designed sections for every page type, so the Dr Lipp team can build new pages and campaigns from the theme editor without the design drifting.',
      media: slot(B, 'work-03', 'A scroll through the full library of Dr Lipp Shopify 2.0 sections on mobile.', 'The all-sections recording'),
    },
  ],
  // One 50/50 halfway through the work (27 October 2026): this photo sticks at full height while
  // desktop screens scroll past on the tint. Both screens from the Figma file (2 November 2026).
  splits: [
    {
      label: 'Dr Lipp on desktop',
      photo: photoMedia(B, 'split-1-photo'),
      screens: [
        { device: 'desktop', media: slot(B, 'split-desktop-1', 'The Dr Lipp homepage on desktop, opening the Shop all, What’s up and Bundle & Save menus.', 'Desktop navigation') },
        { device: 'desktop', media: slot(B, 'split-desktop-2', 'A Dr Lipp product page on desktop, with single, twin and triple pack prices.', 'Desktop product page') },
      ],
      tint: '#ECD5C9',
    },
  ],
  feature: {
    background: photo(B, 'feature-photo'),
    eyebrow: 'Accessible ecommerce design',
    heading: 'Refined, accessible and ready to grow.',
    body: 'Dr Lipp’s design system refines the brand into a modern, accessible set of elements, states and components. Every page was built from it and prototyped in Figma, so the purchase journey was tested on a real phone before the build.',
    media: slot(B, 'feature', 'The Dr Lipp Clean Beauty Charter page on mobile, built from the design system.', 'Design system screen'),
  },
  // No quote yet: ask Dr Lipp, or the agency if the work came through one. The page goes live either way.
  more: { ...MORE_HEADING, cards: moreFor('Dr Lipp') },
  enquiry: 'Is your store holding your brand back?',
};
