// Hartnack & Co case study. Copy from the "Case study copy: Hartnack & Co" doc (20 October 2026).
// Screens drop in by name: see src/assets/brands/README.md.
import { testimonial, creditLine } from '../testimonials';
import { SERVICE, slot, innovationSlot, innovationLink, photo, photoMedia, moreFor, breadcrumbs, MORE_HEADING, type CaseStudyPageData, desktopSplit } from './types';
import box from '../../assets/brands/hartnack-and-co/box.jpg';

const B = 'hartnack-and-co';
const PATH = '/portfolio/hartnack-and-co-shopify-website-design-case-study/';

export const DATA: CaseStudyPageData = {
  meta: {
    path: PATH,
    title: 'Hartnack & Co Shopify Case Study: A Bespoke Product Builder',
    description:
      'How I designed a Shopify product builder for Hartnack & Co, so customers can make a bespoke binder or box from thousands of options.',
    breadcrumbs: breadcrumbs('Hartnack & Co', PATH),
  },
  // [CONFIRM] store URL
  client: { name: 'Hartnack & Co', url: 'https://hartnackandco.com/', display: 'hartnackandco.com' },
  hero: {
    eyebrow: 'Hartnack & Co Shopify case study',
    heading: 'Bespoke binders, built step by step',
    standfirst:
      'Hartnack & Co makes bespoke binders, boxes and log books to order, for businesses, pilots and weddings. I redesigned its Shopify store around a product builder that turns thousands of options into a few calm steps.',
    image: photoMedia(B, 'hero'),
  },
  brief: {
    eyebrow: "Hartnack & Co Shopify brief",
    heading: "Make a binder, not just buy one",
    body: [
      'The Hartnack & Co brief started with a UX review of the old store. Customers loved the products, but many dropped out of the customisation journey, overwhelmed by hundreds of possible variations.',
      'The job was to simplify, structure and guide that choice so it felt reassuring, and to give the brand a more refined, premium look.',
    ],
  },
  details: {
    sector: 'Stationery & gifts', // [CONFIRM] or bespoke leather goods
    services: [SERVICE.bespoke, SERVICE.ux],
    live: '19 June 2025',
    liveIso: '2025-06-19',
    // No Results row: GA4 shows the store down year on year since launch, so sales figures are off.
    rows: [],
  },
  showcase: {
    label: 'Hartnack & Co screens',
    background: photo(B, 'showcase-photo'),
    desktop: slot(B, 'showcase-desktop', 'The Hartnack & Co store on desktop: the homepage, all products and a binder product page.', 'Desktop collection recording'),
    phones: [
      slot(B, 'showcase-phone-1', 'The Hartnack & Co homepage on mobile.', 'Homepage'),
      slot(B, 'showcase-phone-2', 'The Hartnack & Co navigation on mobile.', 'Navigation'),
      slot(B, 'showcase-phone-3', 'A Hartnack & Co collection on mobile.', 'Collection'),
      slot(B, 'showcase-phone-4', 'Hartnack & Co search on mobile.', 'Search'),
    ],
  },
  workIntro: {
    eyebrow: "Hartnack & Co product builder design",
    heading: "Thousands of options, made simple",
    body: 'The Hartnack & Co work started with a UX review of the customisation journey, before any design. The review showed where customers gave up, and that is where the concepts started.',
  },
  // [CONFIRM] rows 2 to 5 are desktop recordings: keep the phone frame, or a wider desktop frame?
  highlights: [
    {
      eyebrow: 'Customisation UX review',
      heading: 'Simplify thousands of options.',
      body: 'The customisation UX review showed customers loved the products but dropped out of customisation, overwhelmed by hundreds of variations. The design had to guide the choice, not just list it.',
      media: slot(B, 'work-01', 'The Hartnack & Co homepage on mobile, with routes into binders, boxes and bespoke pieces.', 'The mobile homepage'),
    },
    {
      eyebrow: 'Comparison product card design',
      heading: 'Compare without clicking through.',
      body: 'Comparison product card design for similar products means showing what differs. Each card adds sizes, formats and materials, so decisive shoppers compare quickly and browsers find ideas.',
      media: slot(B, 'work-02', 'Hartnack & Co product cards showing sizes, formats and materials.', 'The desktop collection recording'),
    },
    {
      eyebrow: 'Shop by use landing pages',
      heading: 'Shop by what it’s for.',
      body: 'Shopify landing pages by use help customers who don’t yet know what they want. From business binders to pilot log books, each page shows the product in real life.',
      media: slot(B, 'work-03', 'The Hartnack & Co shop by use page, from business binders to pilot log books.', 'The shop by use recording'),
    },
    {
      eyebrow: 'Product builder design',
      heading: 'Thousands of variations, one step at a time.',
      body: 'Product builder design turns the product page into a builder. The choice is split into guided steps, with slide-up tips, bespoke icons and a cost tracker that stays on screen.',
      link: innovationLink('See the step-by-step product builder', 'product-builder'),
      media: innovationSlot('product-builder', 'Building a bespoke binder on the Hartnack & Co product page, with the cost tracker on screen.', 'The product page recording'),
    },
    {
      eyebrow: 'Shopify customer gallery design',
      heading: 'Copy a binder you love.',
      body: 'Shopify customer gallery design at Hartnack & Co shows past creations with the exact options chosen. New customers can point at one and say “that’s what I want”.',
      link: innovationLink('See a customer gallery with the options shown', 'customer-gallery'),
      media: innovationSlot('customer-gallery', 'The Hartnack & Co customer gallery, with the options chosen listed under each piece.', 'The customer gallery recording'),
    },
  ],
  // One 50/50 halfway through the work (27 October 2026): this photo sticks at full height while
  // desktop screens scroll past on the tint. Drop in split-desktop-1 to -3.
  splits: [desktopSplit(B, 'Hartnack & Co', photoMedia(B, 'split-1-photo', box), '#ADA093')],
  feature: {
    background: photo(B, 'feature-photo'),
    eyebrow: 'Shopify brand refinement',
    heading: 'Calm, premium, easy to read.',
    body: 'Hartnack & Co needed a refinement, not a rebrand. A tighter palette and typography made the store more luxurious and more accessible, and white space turned a complex shop into a calm one.',
    media: slot(B, 'feature', 'A Hartnack & Co screen in the refined brand.', 'Brand refinement screen'),
  },
  // A trimmed excerpt that leaves out the sentence naming the developer. Nick approves it before it goes live.
  testimonial: {
    eyebrow: 'Hartnack & Co testimonial',
    heading: 'In the client’s words.',
    quote:
      'After many failed attempts to find a Shopify designer and developer anywhere in the world who could understand how our markets worked, but more importantly could design a website that could “make” a product, we discovered Anthony, just down the road in Cornwall. … he delivered a website that looks amazing but also works perfectly and we only wish we had found him earlier.',
    cite: creditLine(testimonial('hartnack-and-co')),
  },
  more: { ...MORE_HEADING, cards: moreFor('Hartnack & Co') },
};
