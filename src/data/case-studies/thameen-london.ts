// Thameen London case study. Copy from the "Case study copy: Thameen London" doc (20 October 2026).
// Screens drop in by name: see src/assets/brands/README.md.
import { testimonial, creditLine } from '../testimonials';
import { SERVICE, BUILDER, slot, photo, photoMedia, moreFor, breadcrumbs, MORE_HEADING, type CaseStudyPageData, desktopSplit } from './types';
import bottles from '../../assets/brands/thameen/bottles.jpg';
import collection from '../../assets/brands/thameen/collection.jpg';

const B = 'thameen';
const PATH = '/work/thameen-london/';

export const DATA: CaseStudyPageData = {
  meta: {
    path: PATH,
    title: 'Thameen London Shopify Case Study: Off Headless',
    description:
      'How I designed Thameen London’s move off headless Shopify, onto a premium theme customised until it looks bespoke for a luxury fragrance house.',
    breadcrumbs: breadcrumbs('Thameen London', PATH),
  },
  // thameenlondon.com redirects here (checked 25 October 2026)
  client: { name: 'Thameen London', url: 'https://thameenfragrance.com/', display: 'thameenfragrance.com' },
  hero: {
    eyebrow: 'Thameen London Shopify case study',
    heading: 'Off headless, onto a premium theme',
    standfirst:
      'Thameen London is a niche luxury fragrance house, stocked in Harrods and boutiques worldwide. When the store moved off a headless set-up onto a premium Shopify theme, I chose the theme with the team and customised it until it looked bespoke.',
    image: photoMedia(B, 'hero'),
  },
  brief: {
    eyebrow: "Thameen London Shopify brief",
    heading: "Take back control without losing the luxury",
    body: [
      'The Thameen London brief started with a headless Shopify store the team found hard to manage and update. They wanted Shopify 2.0, so they could run their own content.',
      'A well-chosen premium theme was the right first step: a flexible platform now, with a bespoke build to revisit once they had more data and content. The challenge was making a theme feel like Extraits de Parfum priced from £200.',
    ],
  },
  details: {
    sector: 'Beauty',
    services: [SERVICE.theme, SERVICE.ux, SERVICE.cro],
    builtBy: { ...BUILDER.cartmasters, href: 'https://cartmasters.co.uk/work/thameen-london/' },
    live: 'March 2026',
    liveIso: '2026-03-20',
    // No Results row: GA4 only started tracking at launch, so there's no before and after.
    rows: [
      {
        label: 'In their words',
        value: '“A journey that feels both effortless for the customer and truly reflective of Thameen’s luxury positioning.” Nour Abdel-Motaal, General Manager',
      },
      { label: 'Theme', value: 'Sleek' },
    ],
  },
  showcase: {
    label: 'Thameen London screens',
    background: photo(B, 'showcase-photo'),
    desktop: slot(B, 'showcase-desktop', 'The Thameen London store on desktop: the homepage, a fragrance collection and a product page.', 'Desktop store recording'),
    phones: [
      slot(B, 'showcase-phone-1', 'The Thameen London homepage on mobile.', 'Homepage'),
      slot(B, 'showcase-phone-2', 'The Thameen London fragrance collection on mobile.', 'Fragrance collection'),
      slot(B, 'showcase-phone-3', 'A Thameen London product page on mobile.', 'Product page'),
      slot(B, 'showcase-phone-4', 'The Thameen London navigation on mobile.', 'Navigation'),
    ],
  },
  workIntro: {
    eyebrow: "Thameen London Shopify theme build",
    heading: "Calm from header to checkout",
    body: 'The Thameen London work started with choosing the theme, before any design. Getting that right saves time and money later, and every decision after it built on that choice.',
  },
  highlights: [
    {
      eyebrow: 'Shopify theme selection',
      heading: 'Two shortlisted, one chosen together.',
      body: 'Choosing the theme is where a build like Thameen London’s is won or lost. I shortlisted two with the right bones for content and conversion, and we chose Sleek together for its structure and room to push.',
      media: slot(B, 'work-01', 'The Thameen London homepage on mobile, built on the Sleek theme.', 'The homepage hero'),
    },
    {
      eyebrow: 'Shopify header and footer design',
      heading: 'The frame round every page.',
      body: 'The header and footer made the biggest difference on Thameen. They frame every page, so getting them right lifts the whole store. The header sits quietly against the editorial imagery.',
      media: slot(B, 'work-02', 'The Thameen London footer on mobile, with its refined spacing and structure.', 'The header and footer'),
    },
    {
      eyebrow: 'Editorial product card design',
      heading: 'Add to bag from the collection.',
      body: 'Thameen London’s range is tight, so the collection became a full-width, editorial grid with the bottles front and centre. Customers add straight from the collection, without opening every product page.',
      media: (() => {
        const m = slot(B, 'work-03', 'Thameen London product cards on mobile, with add to bag on each bottle.', 'The collection recording');
        return { ...m, image: m.image ?? collection };
      })(),
    },
    {
      eyebrow: 'Shopify cart and search design',
      heading: 'Unhurried to the end.',
      body: 'Thameen London’s cart, search and overlays are styled like the rest of the store, so the calm carries through to checkout and nothing drops back to the theme default.',
      media: slot(B, 'work-04', 'Thameen London search and the bag on mobile, styled to match the store.', 'The cart and search recording'),
    },
  ],
  // One 50/50 halfway through the work (27 October 2026): this photo sticks at full height while
  // desktop screens scroll past on the tint. Drop in split-desktop-1 to -3.
  splits: [desktopSplit(B, 'Thameen London', photoMedia(B, 'split-1-photo', bottles), '#81ABFB', 3, [
    { name: 'split-desktop-4', alt: 'The Thameen London bag opening on desktop, with one fragrance in it.', label: 'Desktop bag' },
    { name: 'split-desktop-5', alt: 'The Thameen London homepage on desktop, from Our olfactory treasures down to the footer.', label: 'Desktop homepage' },
  ], ['The Thameen London homepage on desktop, from the Patiala and Royal Sapphire campaign to the bestselling Extraits de Parfum.', 'The Thameen London fragrance collection on desktop, with a filter and an add to bag button on every bottle.', 'The Thameen London Opaline product page on desktop, down to You may also like, with add to bag sticking at the bottom.'])],
  feature: {
    background: photo(B, 'feature-photo'),
    eyebrow: 'Luxury ecommerce styling',
    heading: 'Every screen still feels like Thameen.',
    body: 'Thameen’s styling covers every section: product and collection pages, the cart, overlays, type, buttons and hover states. I mapped which refinements needed custom CSS and made sure each was built cleanly, so nothing looks off-the-shelf.',
    media: slot(B, 'feature', 'A Thameen London screen on mobile, styled to match the brand.', 'Theme styling screen'),
  },
  testimonial: {
    eyebrow: 'Thameen London testimonial',
    heading: 'In the client’s words.',
    quote:
      'Most importantly, he completely transformed the way the brand comes to life digitally. The new UX elevated the website into a much more modern, intuitive and premium experience, creating a journey that feels both effortless for the customer and truly reflective of Thameen’s luxury positioning.',
    cite: creditLine(testimonial('thameen-london')),
  },
  more: { ...MORE_HEADING, cards: moreFor('Thameen London') },
  enquiry: 'Headless store too hard to run?',
};
