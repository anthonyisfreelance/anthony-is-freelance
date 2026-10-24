// Projektityyny case study. Copy from the "Case study copy: Projektityyny" doc (20 October 2026).
// Photos from Drive (site-images/case-studies/projektityyny). Screens drop in by name: see README.
import { SERVICE, slot, innovationSlot, innovationLink, photo, photoMedia, moreFor, breadcrumbs, MORE_HEADING, type CaseStudyPageData } from './types';
import shopByRoom from '../../assets/brands/projektityyny/shop-by-room.jpg';
import quilts from '../../assets/brands/projektityyny/lifestyle-03.jpg';
import lampshades from '../../assets/brands/projektityyny/lifestyle-04.jpg';
import cushions from '../../assets/brands/projektityyny/lifestyle-05.webp';

const B = 'projektityyny';
const PATH = '/portfolio/projektityyny-shopify-website-design-case-study/';

export const DATA: CaseStudyPageData = {
  meta: {
    path: PATH,
    title: 'Projektityyny Shopify Case Study: Shop by Room or Print',
    description:
      'How I designed a bespoke Shopify store for Projektityyny, a Nordic textiles brand from West Dorset, mobile first, with routes by product, room or print.',
    breadcrumbs: breadcrumbs('Projektityyny', PATH),
  },
  client: { name: 'Projektityyny', url: 'https://projektityyny.com/', display: 'projektityyny.com' },
  hero: {
    eyebrow: 'Projektityyny Shopify case study',
    heading: 'Shop by product, room or print',
    standfirst:
      'Projektityyny is a Nordic home textiles brand from West Dorset, known for its patchwork quilts, with more than 115,000 followers on Instagram and features in Vogue, Elle Decoration and House & Garden. I designed its bespoke Shopify store mobile first, with the brand’s photography leading every page.',
    image: photoMedia(B, 'hero'),
  },
  brief: {
    eyebrow: 'Projektityyny bespoke Shopify brief',
    heading: 'A store as considered as the quilts',
    body: [
      'The Projektityyny brief was a bespoke Shopify store for a brand that had outgrown its old one. The product and the photography were already beautiful. The store wasn’t keeping up.',
      'The old site dropped customers into collections and left them to filter. The job was to open up the range, let the photography lead and give the team a system to grow with.',
    ],
  },
  details: {
    sector: 'Home',
    services: [SERVICE.bespoke],
    live: '5 June 2026',
    liveIso: '2026-06-05',
    // No Results row until there's a verified figure with a window.
    rows: [
      { label: 'Designed for', value: 'Over 80% of visitors on mobile, from the UX review of the old store.' },
      { label: 'Measured', value: 'GA4 visitors by device on the old store: 81% on mobile in September and October 2024, 84% in February 2025.' },
    ],
  },
  showcase: {
    label: 'Projektityyny screens',
    background: photo(B, 'showcase-photo', lampshades),
    desktop: slot(B, 'showcase-desktop', 'The Projektityyny store on desktop: the homepage hero and the image-led category blocks.', 'Desktop homepage scroll'),
    phones: [
      slot(B, 'showcase-phone-1', 'The Projektityyny homepage on mobile.', 'Homepage'),
      slot(B, 'showcase-phone-2', 'The Projektityyny all-products collection on mobile.', 'All-products collection'),
      slot(B, 'showcase-phone-3', 'Projektityyny search on mobile.', 'Search'),
      slot(B, 'showcase-phone-4', 'The Projektityyny basket on mobile.', 'Basket'),
    ],
  },
  workIntro: {
    eyebrow: 'Projektityyny Shopify store design',
    heading: 'Built around the photography',
    body: 'The Projektityyny work started with a UX review of the old store, before any design. The review showed who was shopping and how, and that is where the concepts started.',
  },
  highlights: [
    {
      eyebrow: 'Purchase journey review',
      heading: 'Start with where people shop.',
      body: 'The purchase journey review mapped the whole journey and the GA4 data. Over 80% of visitors were on a phone, so every screen was designed mobile first, then scaled up to desktop.',
      media: slot(B, 'work-01', 'The Projektityyny mobile menu, with routes to shop by product, room, print and colour, and search.', 'The main mobile menu'),
    },
    {
      eyebrow: 'Image-led navigation design',
      heading: 'Shop the way people think about home.',
      body: 'Image-led navigation design gives Projektityyny three routes in: by product, by room and by print. Each leads to its own page, so the menu becomes the start of shopping, not a list of links.',
      link: innovationLink('See shop by product, room or print', 'shop-by-product-room-print'),
      media: (() => {
        const m = innovationSlot('shop-by-product-room-print', 'Shop by room on the Projektityyny mobile menu: nursery, children’s bedroom, adult bedroom and dining room.', 'The navigation recording');
        return { ...m, image: m.image ?? shopByRoom };
      })(),
    },
    {
      eyebrow: 'Shopify homepage design',
      heading: 'Let the photography lead.',
      body: 'Shopify homepage design at Projektityyny puts full-bleed photography, considered pacing and generous space first. The design never competes with the prints. It frames them.',
      media: slot(B, 'work-03', 'Projektityyny’s image-led homepage blocks scrolling on mobile.', 'The image-led recording'),
    },
    {
      eyebrow: 'Shopify lookbook design',
      heading: 'Keep every collection earning.',
      body: 'Shopify lookbook pages keep every past Projektityyny collection live and shoppable. As of October 2026 there are 17, going back to 2020, so the campaign photography keeps working long after the season ends.',
      link: innovationLink('See a lookbook archive that keeps earning', 'lookbook-archive'),
      media: innovationSlot('lookbook-archive', 'A Projektityyny lookbook on mobile, with shoppable image tiles and product tags.', 'The lookbook recording'),
    },
    {
      eyebrow: 'Shopify cross-sell design',
      heading: 'Styling advice, not random picks.',
      body: 'Shopify cross-sell design at Projektityyny curates what goes with each quilt, and lets customers shop the same colour or print. It reads like styling advice from the brand, not a sales tactic.',
      media: slot(B, 'work-05', 'A Projektityyny quilt product page on mobile, with the goes well with row.', 'The product page recording'),
    },
  ],
  // Lifestyle-led layout: no sticky gallery. Two 50/50 splits break up the work rows instead
  // (Figma 48323:17501 and 48323:17511), each with a tint picked from its photo.
  splits: [
    {
      after: 2,
      label: 'The Projektityyny collection page',
      photo: { image: photo(B, 'split-1-photo', cushions), alt: '' },
      screen: slot(B, 'split-1-screen', 'The Projektityyny all home textiles page on mobile, with quilts, baby quilts, bags, cushions and bedding to pick from above the products.', 'Collection page'),
      tint: '#E7D7BB',
      caption: 'The all home textiles page on mobile, with quilts, cushions, bedding and bags to choose from before the first product.',
    },
    {
      after: 3,
      label: 'The Projektityyny category tiles',
      photo: photoMedia(B, 'split-2-photo'),
      screen: slot(B, 'split-2-screen', 'Image-led category tiles on the Projektityyny homepage on mobile: quilts, baby quilts, cushions, canopies and bows.', 'Category tiles'),
      tint: '#B6BCB5',
      photoSide: 'right',
      caption: 'Category tiles on the Projektityyny homepage. Over 80% of visitors shop on a phone, so each part of the range is one tap away.',
    },
  ],
  feature: {
    background: photo(B, 'feature-photo', quilts),
    eyebrow: 'Figma design system',
    heading: 'Restraint that lets the prints lead.',
    body: 'Projektityyny’s Figma design system pulls back anything that competes with the product: tighter type, deliberate spacing and room to breathe. Colour contrast and type sizes were set for accessibility from the start, and every screen was handed over in Figma.',
    media: slot(B, 'feature', 'A Projektityyny screen on mobile in the design system.', 'Design system screen'),
  },
  // No quote yet: ask Projektityyny, or the agency if the work came through one. The page goes live either way.
  more: { ...MORE_HEADING, cards: moreFor('Projektityyny') },
};
