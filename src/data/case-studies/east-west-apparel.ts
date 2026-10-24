// East West Apparel case study. Copy from the "Case study copy: East West Apparel" doc (20 October 2026).
// No photos or screens in the repo yet: everything drops in by name, see src/assets/brands/README.md.
import { testimonial, creditLine } from '../testimonials';
import { SERVICE, slot, photo, photoMedia, moreFor, breadcrumbs, MORE_HEADING, type CaseStudyPageData } from './types';

const B = 'east-west-apparel';
const PATH = '/portfolio/east-west-apparel-shopify-website-design-case-study/';

export const DATA: CaseStudyPageData = {
  meta: {
    path: PATH,
    title: 'East West Apparel Shopify Case Study: WooCommerce Migration',
    description:
      'How I moved East West Apparel from WooCommerce to Shopify with a grunge look of its own, built on a modular system that keeps shopping easy.',
    breadcrumbs: breadcrumbs('East West Apparel', PATH),
  },
  // [CONFIRM] store URL
  client: { name: 'East West Apparel', url: 'https://eastwestapparel.co.uk/', display: 'eastwestapparel.co.uk' },
  hero: {
    eyebrow: 'East West Apparel Shopify case study',
    heading: 'Grunge on top, order beneath',
    standfirst:
      'East West Apparel sells clothing from independent makers like Heimat, Loop & Weft, Stevenson and The Strike Gold. I moved it from WooCommerce to Shopify with an anti-design look of its own, built on a modular system that keeps shopping easy.',
    image: photoMedia(B, 'hero'),
  },
  brief: {
    eyebrow: "East West Apparel Shopify migration brief",
    heading: "More than a platform move",
    body: [
      'The East West Apparel brief started as a move from WooCommerce to Shopify. It became a chance to give the store the raw, community-led personality of the shop and its brands.',
      'The catch was keeping that personality without breaking ecommerce best practice, so the grit couldn’t get in the way of finding a size and buying.',
    ],
  },
  details: {
    sector: 'Fashion',
    services: [SERVICE.migrations],
    live: '2025', // [CONFIRM] month
    rows: [
      {
        label: 'In their words',
        value: '“I am very pleased with the outcome of our website and the increase in sales because of it.” Jamie Lee, Owner',
      },
    ],
  },
  showcase: {
    label: 'East West Apparel screens',
    background: photo(B, 'showcase-photo'),
    desktop: slot(B, 'showcase-desktop', 'The East West Apparel store on desktop: the homepage with its torn-edge textures, a collection and a product page.', 'Desktop UI recording'),
    phones: [
      slot(B, 'showcase-phone-1', 'The East West Apparel homepage on mobile.', 'Homepage'),
      slot(B, 'showcase-phone-2', 'An East West Apparel collection on mobile.', 'Collection'),
      slot(B, 'showcase-phone-3', 'The East West Apparel navigation on mobile.', 'Navigation'),
      slot(B, 'showcase-phone-4', 'East West Apparel search on mobile.', 'Search'),
    ],
  },
  workIntro: {
    eyebrow: "East West Apparel Shopify design",
    heading: "Four decisions behind the migration",
    body: 'The East West Apparel work started with the move from WooCommerce and ended with a modular Shopify design system under a grunge surface.',
  },
  highlights: [
    {
      eyebrow: 'Shopify UI design',
      heading: 'Anti-design, with UX underneath.',
      body: 'Shopify UI design for East West Apparel embraces textured backgrounds, torn edges and imperfect visuals. Underneath, every layout follows ecommerce best practice, so the character never costs clarity.',
      media: slot(B, 'work-01', 'East West Apparel’s homepage on mobile, with torn edges and textured backgrounds.', 'The grunge UI recording'),
    },
    {
      eyebrow: 'Size-first product card design',
      heading: 'See your size before you click.',
      body: 'Size-first product card design fixed the old store’s biggest frustration. Customers clicked into products only to find their size gone. Every card now shows available sizes, inside a rough-edged frame.',
      media: slot(B, 'work-02', 'An East West Apparel product card showing available sizes.', 'The product card recording'),
    },
    {
      eyebrow: 'Modular product page design',
      heading: 'Boxed, modular, calm.',
      body: 'Modular product page design at East West Apparel uses a boxed layout. Images, fabric details, sizing and add to bag each have their place, so a rough look still reads calmly.',
      media: slot(B, 'work-03', 'An East West Apparel product page with boxed sections for images, fabric and sizing.', 'The product page recording'),
    },
    {
      eyebrow: 'Shopify icon design',
      heading: 'Hand-drawn, like the brands.',
      body: 'Shopify icons don’t have to be stock. I drew a bespoke set by hand to match the handmade feel of the brands East West Apparel sells.',
      media: slot(B, 'work-04', 'East West Apparel’s hand-drawn icon set.', 'The icon set'),
    },
  ],
  // 50/50 blocks between the work rows, in place of the sticky gallery (23 October 2026).
  splits: [
    {
      after: 1,
      label: "The East West Apparel USP badges",
      photo: photoMedia(B, 'split-1-photo'),
      screen: slot(B, 'split-1-screen', "The East West Apparel USP badges on mobile.", "USP badges"),
      tint: '#B0B4B9',
      photoSide: 'right',
      caption: "Hand-drawn USP badges on mobile, with torn edges on a grid that still lines up.",
    },
    {
      after: 3,
      label: "The East West Apparel icon block",
      photo: photoMedia(B, 'split-2-photo'),
      screen: slot(B, 'split-2-screen', "The East West Apparel hand-drawn icon block on mobile.", "Hand-drawn icon block"),
      tint: '#B0B4B9',
      caption: "The hand-drawn icon block on mobile, drawn to match the brands East West Apparel sells.",
    },
  ],
  feature: {
    background: photo(B, 'feature-photo'),
    eyebrow: 'Streetwear design system',
    heading: 'Raw on the surface, aligned underneath.',
    body: 'East West Apparel’s design system is modular. Every block can be swapped, stacked or reconfigured and still line up, so the team can keep the look raw and expressive without breaking how the store works.',
    media: slot(B, 'feature', 'An East West Apparel screen in the modular design system.', 'Design system screen'),
  },
  // A verbatim excerpt, cut before "I highly recommend". "Intune" is as written.
  testimonial: {
    eyebrow: 'East West Apparel testimonial',
    heading: 'In the client’s words.',
    quote:
      'Ant was great to work with, personable, very professional, accommodating, punctual, creative and intune. I am very pleased with the outcome of our website and the increase in sales because of it.',
    cite: creditLine(testimonial('east-west-apparel')),
  },
  more: { ...MORE_HEADING, cards: moreFor('East West Apparel') },
};
