// Window Fleur case study. Copy from the "Case study copy: Window Fleur" doc (20 October 2026).
// No photos or screens in the repo yet: everything drops in by name, see src/assets/brands/README.md.
import { testimonial, creditLine } from '../testimonials';
import { SERVICE, slot, innovationSlot, innovationLink, photo, photoMedia, moreFor, breadcrumbs, MORE_HEADING, type CaseStudyPageData, desktopSplit } from './types';

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
    heading: 'Three pages in one screen',
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
    services: [SERVICE.bespoke, SERVICE.subscriptions],
    live: 'August 2024',
    liveIso: '2024-08',
    rows: [{ label: 'In their words', value: '“Our website saw huge improvements.” Frannie Liddle, Co-Founder and Creative Director' }],
  },
  showcase: {
    label: 'Window Fleur screens',
    background: photo(B, 'showcase-photo'),
    desktop: slot(B, 'showcase-desktop', 'The Window Fleur store on desktop: the homepage, a collection and a product page.', 'Desktop click-around recording'),
    phones: [
      slot(B, 'showcase-phone-1', 'The Window Fleur homepage on mobile.', 'Homepage'),
      slot(B, 'showcase-phone-2', 'The Window Fleur navigation on mobile.', 'Navigation'),
      slot(B, 'showcase-phone-3', 'A Window Fleur collection on mobile.', 'Collection'),
      slot(B, 'showcase-phone-4', 'The Window Fleur shopping bag on mobile.', 'Shopping bag'),
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
      heading: 'Three pages in one screen.',
      body: 'Shopify subscription design at Window Fleur started with the product page. The three-page journey became one mobile screen, with slide-ups for the detail, so customers set up a subscription without leaving it.',
      link: innovationLink('See three pages in one screen', 'three-pages-one-screen'),
      media: innovationSlot('three-pages-one-screen', 'The Window Fleur product page on mobile, with the subscription set up on one screen.', 'The product page'),
    },
    {
      eyebrow: 'Shopify accessibility design',
      heading: 'Personality that passes the checks.',
      body: 'Shopify accessibility design is hardest when the brand is playful. I reworked the type ratios so text reads clearly and the calls to action stand out, without losing Window Fleur’s character.',
      media: slot(B, 'work-02', 'The Window Fleur size guide on mobile, with clear type and a strong call to action.', 'The size guide slide-up'),
    },
    {
      eyebrow: 'Shopify collection design',
      heading: 'Filters that don’t take over.',
      body: 'Shopify collection design at Window Fleur keeps filtering simple on a phone, with the brand’s patterns carrying shopping messages through the grid.',
      media: slot(B, 'work-03', 'The Window Fleur filters panel on mobile.', 'The filters panel'),
    },
  ],
  // One 50/50 halfway through the work (27 October 2026): this photo sticks at full height while
  // desktop screens scroll past on the tint. Drop in split-desktop-1 to -3.
  splits: [desktopSplit(B, 'Window Fleur', photoMedia(B, 'split-1-photo'), '#DAC5C9', 3, [
    { name: 'split-desktop-4', alt: 'A Window Fleur product page on desktop, from We’re green, inside and out down to the footer.', label: 'Desktop product page' },
  ])],
  feature: {
    background: photo(B, 'feature-photo'),
    eyebrow: 'Pattern-led brand design',
    heading: 'Patterns that carry the selling messages.',
    body: 'Window Fleur’s brand patterns run through the store and carry its key shopping messages, so the reasons to buy feel fun and memorable rather than pushy. I checked the finished build against the designs before launch.',
    media: slot(B, 'feature', 'A Window Fleur screen on mobile with the brand patterns.', 'Brand patterns screen'),
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
};
