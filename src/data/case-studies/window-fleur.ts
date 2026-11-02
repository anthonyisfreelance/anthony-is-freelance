// Window Fleur case study. Copy from the "Case study copy: Window Fleur" doc (20 October 2026).
// No photos or screens in the repo yet: everything drops in by name, see src/assets/brands/README.md.
import { testimonial, creditLine } from '../testimonials';
import { SERVICE, BUILDER, slot, innovationSlot, innovationLink, photo, photoMedia, moreFor, breadcrumbs, MORE_HEADING, type CaseStudyPageData, desktopSplit } from './types';

const B = 'window-fleur';
const PATH = '/portfolio/window-fleur-shopify-case-study/';

export const DATA: CaseStudyPageData = {
  meta: {
    path: PATH,
    title: 'Window Fleur Shopify Case Study: Three Pages in One Screen',
    description:
      'How I redesigned Window Fleur’s subscription journey into one mobile screen, then rebuilt the whole Shopify store around an accessible design system.',
    breadcrumbs: breadcrumbs('Window Fleur', PATH),
  },
  // [CONFIRM] store URL
  client: { name: 'Window Fleur', url: 'https://windowfleur.com/', display: 'windowfleur.com' },
  hero: {
    eyebrow: 'Window Fleur Shopify case study',
    heading: 'A subscription flow in one screen',
    // [CONFIRM] what Window Fleur sells, in their words.
    standfirst:
      'Window Fleur sells window boxes and flowers by subscription. I turned its three-page product journey into one mobile screen, then designed a new Shopify store around it, full of personality and built to accessible standards.',
    image: photoMedia(B, 'hero'),
  },
  brief: {
    eyebrow: "Window Fleur Shopify brief",
    heading: "A store that looked nice but didn’t convert",
    body: [
      'The Window Fleur store looked good, but it was passive. Buying took three pages, conversion was poor, and a closer look showed it didn’t meet modern accessibility standards.',
      'The job was to keep the brand’s character and make the store work: a shorter journey, clearer type and buttons that stand out.',
    ],
  },
  details: {
    sector: 'Home',
    services: [SERVICE.bespoke, SERVICE.ux, SERVICE.subscriptions],
    builtBy: BUILDER.cartmasters,
    live: 'August 2024',
    liveIso: '2024-08',
    rows: [{ label: 'In their words', value: '“Our website saw huge improvements.” Frannie Liddle, Co-Founder and Creative Director' }],
  },
  showcase: {
    label: 'Window Fleur screens',
    background: photo(B, 'showcase-photo'),
    desktop: slot(B, 'showcase-desktop', 'The Window Fleur store on desktop: the homepage, the our story page and a Bloom Bag product page.', 'Desktop click-around recording'),
    phones: [
      slot(B, 'showcase-phone-1', 'The Window Fleur homepage on mobile.', 'Homepage'),
      slot(B, 'showcase-phone-2', 'The Window Fleur menu on mobile, opening over the page and closing again.', 'Navigation'),
      slot(B, 'showcase-phone-3', 'A Window Fleur Bloom Bag product page on mobile, choosing a bag size, the plants and a box.', 'Product page'),
      slot(B, 'showcase-phone-4', 'A Window Fleur autumn plant kit on mobile, with the Classic and Luxe kit sizes.', 'Plant kit'),
    ],
  },
  workIntro: {
    eyebrow: "Window Fleur Shopify subscription design",
    heading: "Built around one product page",
    body: 'The Window Fleur work started with a single product page prototype, before the rest of the store. It turned a three-page journey into one screen, and the full redesign grew from there.',
  },
  highlights: [
    {
      eyebrow: 'Shopify subscription design',
      heading: 'Three pages redesigned into one screen.',
      body: 'The Window Fleur redesign started with the product page. The three-page journey became one mobile screen, with slide-ups for the details, so customers set up a subscription without leaving it.',
      link: innovationLink('See three pages in one screen', 'three-pages-one-screen'),
      media: innovationSlot('three-pages-one-screen', 'The Window Fleur product page on mobile, with the subscription set up on one screen.', 'The product page'),
    },
    {
      eyebrow: 'Shopify accessibility design',
      heading: 'Personality that passes the checks.',
      body: 'Accessibility is hardest when the brand is playful. I reworked the type ratios so text reads clearly and the calls to action stand out, without losing Window Fleur’s character.',
      media: slot(B, 'work-02', 'The Window Fleur size guide on mobile, with clear type and a strong call to action.', 'The size guide slide-up'),
    },
    // The collection filters row came out (feedback #349, 2 November 2026): the store has hardly any filters.
  ],
  // One 50/50 halfway through the work (27 October 2026): this photo sticks at full height while
  // desktop screens scroll past on the tint. Drop in split-desktop-1 to -3.
  splits: [{ ...desktopSplit(B, 'Window Fleur', photoMedia(B, 'split-1-photo'), '#DAC5C9', 3, [
    { name: 'split-desktop-4', alt: 'A Window Fleur product page on desktop, from We’re green, inside and out down to the footer.', label: 'Desktop product page' },
  ], ['The Window Fleur homepage on desktop, from the ready-planted window boxes hero to the four steps of how it works.', 'The Window Fleur how it works page on desktop, with the seasonal cycle of Bloom Bags from spring to winter.', 'The Window Fleur Autumn Bloom Bags page on desktop, choosing a bag size, the plants and a box before adding to cart.']), after: 2 }],
  feature: {
    background: photo(B, 'feature-photo'),
    eyebrow: 'Pattern-led ecommerce design',
    heading: 'Patterns that carry the selling messages.',
    body: 'Window Fleur’s brand patterns run through the store and carry its key shopping messages, so the reasons to buy feel fun and memorable rather than pushy. I checked the finished build against the designs before launch.',
    media: slot(B, 'feature', 'Window Fleur’s brand patterns on mobile, across the homepage, how it works and a Bloom Bag product page.', 'Brand patterns screen'),
  },
  // A verbatim excerpt. The original has an em dash after "work with", shown here as a comma [CONFIRM].
  testimonial: {
    eyebrow: 'Window Fleur testimonial',
    heading: 'In the client’s words.',
    quote:
      'Ant was fantastic to work with, professional, efficient, and made the whole process seamless. Our website saw huge improvements, and we’ll definitely be working with him again for future projects.',
    cite: creditLine(testimonial('window-fleur')),
  },
  more: { ...MORE_HEADING, cards: moreFor('Window Fleur') },
  enquiry: 'Store looks good but doesn’t convert?',
};
