// Thameen London case study. Copy from the "Case study copy: Thameen London" doc (20 October 2026).
// Screens drop in by name: see src/assets/brands/README.md.
import { testimonial, creditLine } from '../testimonials';
import { SERVICE, slot, photo, photoMedia, card, breadcrumbs, MORE_HEADING, type CaseStudyPageData } from './types';
import bottles from '../../assets/brands/thameen/bottles.jpg';
import collection from '../../assets/brands/thameen/collection.jpg';

const B = 'thameen';
const PATH = '/portfolio/thameen-london-shopify-website-design-case-study/';

export const DATA: CaseStudyPageData = {
  meta: {
    path: PATH,
    title: 'Thameen London Shopify Case Study: Off Headless',
    description:
      'How I moved luxury fragrance house Thameen London off headless Shopify onto a premium theme, customised until it looks bespoke.',
    breadcrumbs: breadcrumbs('Thameen London', PATH),
  },
  // [CONFIRM] store URL
  client: { name: 'Thameen London', url: 'https://thameenlondon.com/', display: 'thameenlondon.com' },
  hero: {
    eyebrow: 'Thameen London Shopify case study',
    heading: 'Off headless, onto a premium theme',
    standfirst:
      'Thameen London is a niche luxury fragrance house, stocked in Harrods and boutiques worldwide. I moved its store off a headless set-up onto a premium Shopify theme, then customised it until it looked bespoke.',
    image: photoMedia(B, 'hero'),
  },
  brief: {
    eyebrow: 'The brief',
    heading: 'Take back control without losing the luxury',
    body: [
      'The Thameen London brief started with a headless Shopify store the team found hard to manage and update. They wanted Shopify 2.0, so they could run their own content.',
      'A well-chosen premium theme was the right first step: a flexible platform now, with a bespoke build to revisit once they had more data and content. The challenge was making a theme feel like Extraits de Parfum priced from £200.',
    ],
  },
  details: {
    sector: 'Beauty',
    services: [SERVICE.theme],
    live: '20 March 2026',
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
    eyebrow: 'The work',
    heading: 'Four decisions behind the theme build',
    body: 'The Thameen London work started with choosing the theme, before any design. Getting that right saves time and money later, and every decision after it built on that choice.',
  },
  highlights: [
    {
      eyebrow: 'Shopify theme selection',
      heading: 'Two shortlisted, one chosen together.',
      body: 'Shopify theme selection is where a theme build is won or lost. I shortlisted two with the right bones for content and conversion, and we chose Sleek together for its structure and room to push.',
      media: slot(B, 'work-01', 'The Thameen London homepage on mobile, built on the Sleek theme.', 'The homepage hero'),
    },
    {
      eyebrow: 'Shopify header and footer design',
      heading: 'The frame round every page.',
      body: 'Shopify header and footer design made the biggest difference on Thameen. They frame every page, so getting them right lifts the whole store. The header sits quietly against the editorial imagery.',
      media: slot(B, 'work-02', 'The Thameen London footer on mobile, with its refined spacing and structure.', 'The header and footer'),
    },
    {
      eyebrow: 'Shopify product card design',
      heading: 'Add to bag from the collection.',
      body: 'Shopify product card design for a tight range meant a full-width, editorial grid with the bottles front and centre. Customers add straight from the collection, without opening every product page.',
      media: (() => {
        const m = slot(B, 'work-03', 'Thameen London product cards on mobile, with add to bag on each bottle.', 'The collection recording');
        return { ...m, image: m.image ?? collection };
      })(),
    },
    {
      eyebrow: 'Shopify cart and search design',
      heading: 'Unhurried to the end.',
      body: 'Shopify cart and search design carries the same calm through to checkout. The cart, search and overlays are styled like the rest of the store, so nothing drops back to the theme default.',
      media: slot(B, 'work-04', 'The Thameen London cart and search on mobile, styled to match the store.', 'The cart and search recording'),
    },
  ],
  gallery: {
    label: 'More Thameen London screens',
    // [CONFIRM] five screens used nowhere else, for example the brand story, a fragrance family, gifting, the journal and account.
    screens: [1, 2, 3, 4, 5].map((n) => slot(B, `gallery-${n}`, '', `Screen ${n}`)),
    photo: photoMedia(B, 'gallery-photo'),
    caption: '[CONFIRM: describe the five screens once chosen]',
  },
  feature: {
    background: photo(B, 'feature-photo'),
    eyebrow: 'Shopify theme styling',
    heading: 'Every screen still feels like Thameen.',
    body: 'Thameen’s theme styling covers every section: product and collection pages, the cart, overlays, type, buttons and hover states. I mapped which refinements needed custom CSS and made sure each was built cleanly, so nothing looks off-the-shelf.',
    media: slot(B, 'feature', 'A Thameen London screen on mobile, styled to match the brand.', 'Theme styling screen'),
  },
  testimonial: {
    eyebrow: 'Thameen London testimonial',
    heading: 'In the client’s words.',
    quote:
      'Most importantly, he completely transformed the way the brand comes to life digitally. The new UX elevated the website into a much more modern, intuitive and premium experience, creating a journey that feels both effortless for the customer and truly reflective of Thameen’s luxury positioning.',
    cite: creditLine(testimonial('thameen-london')),
  },
  more: { ...MORE_HEADING, cards: [card('Wide Fit Shoes'), card('Dr Lipp'), card('Drink Finder')] },
};
