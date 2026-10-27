// Whistlefish case study. Copy from the "Case study copy: Whistlefish" doc (20 October 2026).
// Screens drop in by name: see src/assets/brands/README.md.
import { testimonial, creditLine } from '../testimonials';
import { SERVICE, slot, innovationSlot, innovationLink, photo, photoMedia, moreFor, breadcrumbs, MORE_HEADING, type CaseStudyPageData, desktopSplit } from './types';
import apron from '../../assets/brands/whistlefish/apron.jpg';
import cards from '../../assets/brands/whistlefish/cards.jpg';

const B = 'whistlefish';
const PATH = '/portfolio/whistlefish-2-0-shopify-website-design-case-study/';

export const DATA: CaseStudyPageData = {
  meta: {
    path: PATH,
    title: 'Whistlefish Shopify Case Study: A Design System They Run',
    description:
      'How I redesigned Whistlefish’s Shopify store mobile first, with a Figma design system their own team now uses to build new pages.',
    breadcrumbs: breadcrumbs('Whistlefish', PATH),
  },
  // [CONFIRM] store URL
  client: { name: 'Whistlefish', url: 'https://whistlefish.com/', display: 'whistlefish.com' },
  hero: {
    eyebrow: 'Whistlefish Shopify case study',
    heading: 'A design system their team runs',
    // [CONFIRM] the first sentence: what Whistlefish is and sells, in their words.
    standfirst:
      'Whistlefish is a Cornish greeting card and gift brand, with thousands of designs sold online and in its own shops. I redesigned its Shopify store mobile first as part of its move to Shopify 2.0, with a design system its own team now builds on.',
    image: photoMedia(B, 'hero'),
  },
  brief: {
    eyebrow: "Whistlefish Shopify brief",
    heading: "A system for every season’s gifting pages",
    body: [
      'The Whistlefish brief was a refresh for the move to Shopify 2.0. The team needed to build landing pages for each gifting season themselves, without the design drifting.',
      'Greeting cards sell for a few pounds and often in multiples, so the store also had to make buying several easy, and set up the next round of conversion work.',
    ],
  },
  details: {
    sector: 'Stationery & gifts',
    services: [SERVICE.bespoke, SERVICE.ux, SERVICE.cro],
    live: '8 April 2025',
    liveIso: '2025-04-08',
    rows: [
      { label: 'In their words', value: '“We’ve since been able to carry that framework into our own design team.” Will Manders, Head of Ecommerce' },
    ],
  },
  showcase: {
    label: 'Whistlefish screens',
    background: photo(B, 'showcase-photo', cards),
    desktop: slot(B, 'showcase-desktop', 'The Whistlefish store on desktop: the homepage, a greeting card collection and a product page.', 'Desktop click-around recording'),
    phones: [
      slot(B, 'showcase-phone-1', 'The Whistlefish homepage on mobile.', 'Homepage'),
      slot(B, 'showcase-phone-2', 'A Whistlefish card collection on mobile.', 'Card collection'),
      slot(B, 'showcase-phone-3', 'The Whistlefish greeting cards menu on mobile.', 'Greeting cards menu'),
      slot(B, 'showcase-phone-4', 'The Whistlefish gallery on mobile.', 'Gallery'),
    ],
  },
  workIntro: {
    eyebrow: "Whistlefish Shopify design",
    heading: "Artwork first, from menu to cart",
    body: 'The Whistlefish work started with the mobile navigation, where most browsing happens, and ended with a full set of Shopify 2.0 sections in a clickable Figma prototype.',
  },
  highlights: [
    {
      eyebrow: 'Drill-down navigation design',
      heading: 'Drill down without losing your place.',
      body: 'Drill-down navigation design for a big range on a small screen. One block lets shoppers drill down through collections and sub-collections, with Whistlefish’s artwork kept front and centre.',
      media: slot(B, 'work-01', 'Drilling down through Whistlefish collections and sub-collections from one block on mobile.', 'The collection drill-down recording'),
    },
    {
      eyebrow: 'Image-first product card design',
      heading: 'Let the picture lead.',
      body: 'Image-first product card design for greeting cards puts the artwork first. Names are cut to one line, and Add sits on the card and turns into a quantity picker, so buying several is quick.',
      link: innovationLink('See image-first product cards', 'image-first-product-cards'),
      media: innovationSlot('image-first-product-cards', 'Whistlefish product cards on mobile, with Add turning into a quantity picker.', 'The collection recording'),
    },
    {
      eyebrow: 'Greeting card product page design',
      heading: 'The card, then the details.',
      body: 'Greeting card product page design at Whistlefish keeps the artwork in focus, with details like the type of ink where people expect them. The Rewards Club sits quietly beside the purchase, not in its way.',
      media: slot(B, 'work-03', 'A Whistlefish product page on mobile, with the card artwork above its details.', 'The product page recording'),
    },
    {
      eyebrow: 'Shopify search design',
      heading: 'Searches, collections and products, apart.',
      body: 'Shopify search design at Whistlefish splits results into popular searches, collections and products. Clear hierarchy means nobody sifts through cards they didn’t ask for.',
      media: slot(B, 'work-04', 'Whistlefish search on mobile, with popular searches, collections and products in separate groups.', 'The search recording'),
    },
    {
      eyebrow: 'Multi-buy cart design',
      heading: 'Show how close the next offer is.',
      body: 'Multi-buy cart design shows how many more cards unlock a deal, then applies it automatically. Delivery messages sit beside it, so nothing is left to guess.',
      media: slot(B, 'work-05', 'The Whistlefish cart on mobile, showing how many more cards unlock an offer.', 'The cart recording'),
    },
  ],
  // One 50/50 halfway through the work (27 October 2026): this photo sticks at full height while
  // desktop screens scroll past on the tint. Drop in split-desktop-1 to -3.
  splits: [desktopSplit(B, 'Whistlefish', photoMedia(B, 'split-1-photo', photo(B, 'gallery-photo')), '#D6D6C9')],
  feature: {
    background: photo(B, 'feature-photo'),
    eyebrow: 'Team-run design system',
    heading: 'Built for the team that runs it.',
    body: 'Whistlefish’s design system is a Figma file set up as a templating system, with rules for how the script and sans fonts behave in the theme editor. A Christmas landing page showed the team how quickly a season can be built from it.',
    link: innovationLink('See a design system the client’s team runs', 'design-system-team-runs'),
    media: slot(B, 'feature', 'The Whistlefish Christmas landing page on mobile.', 'Christmas landing page'),
  },
  // A verbatim excerpt that leaves out the line about the wider development team.
  testimonial: {
    eyebrow: 'Whistlefish testimonial',
    heading: 'In the client’s words.',
    quote:
      'The design process and finalised site helped our brand leap into its next phase with a fresh, clean look that our customers immediately loved. … Using Figma as a templating system meant all of our building blocks worked seamlessly together, and we’ve since been able to carry that framework into our own design team, making adjustments easily while staying true to the original vision.',
    cite: creditLine(testimonial('whistlefish')),
  },
  more: { ...MORE_HEADING, cards: moreFor('Whistlefish') },
};
