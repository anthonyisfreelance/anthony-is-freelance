// East at Home case study. Copy from the "Case study copy: East at Home" doc (20 October 2026).
// Screens drop in by name: see src/assets/brands/README.md.
import { URLS } from '../site';
import { testimonial, creditLine } from '../testimonials';
import { SERVICE, slot, innovationSlot, innovationLink, photo, photoMedia, moreFor, breadcrumbs, MORE_HEADING, type CaseStudyPageData, desktopSplit } from './types';
import { brandVideo } from '../media';
import cardPhoto from '../../assets/brands/east-at-home/card.jpg';
import cardScreen from '../../assets/brands/east-at-home/card-screen.jpg';
import curry from '../../assets/brands/east-at-home/curry.jpg';
import badge from '../../assets/site/badge-winner-2026.png';

const B = 'east-at-home';
const PATH = URLS.caseStudies.eastAtHome;

export const DATA: CaseStudyPageData = {
  meta: {
    path: PATH,
    title: 'East at Home Shopify Case Study: 82% More Revenue',
    description:
      'How I redesigned East at Home’s Shopify store mobile first. 82% more revenue and a 14% higher conversion rate in the eight months after launch.',
    breadcrumbs: breadcrumbs('East at Home', PATH),
  },
  client: { name: 'East at Home', url: 'https://eastathome.com/', display: 'eastathome.com' },
  hero: {
    eyebrow: 'East at Home Shopify case study',
    figure: '82%',
    heading: 'more revenue after launch',
    standfirst:
      'East at Home makes restaurant-quality curry sauces and spice kits for cooking at home. I redesigned its Shopify store around how people choose a curry on their phone, and it won UK User Experience of the Year at the UK eCommerce Awards 2026.',
    image: photoMedia(B, 'hero', cardPhoto),
  },
  brief: {
    eyebrow: 'East at Home Shopify brief',
    heading: 'Protect conversion, then grow the basket',
    body: [
      'The East at Home brief was a redesign for a brand with bold new packaging and a conversion rate already worth protecting. The store had to match that confidence and work harder commercially.',
      'The job was to improve the shopping experience without breaking what worked, then lift average order value. Over half the traffic was on mobile, so the phone came first.',
    ],
  },
  details: {
    sector: 'Food & drink',
    services: [SERVICE.bespoke, SERVICE.cro, SERVICE.ux],
    live: '16 October 2025',
    liveIso: '2025-10-16',
    rows: [
      { label: 'Results', value: '82% more revenue. 14% higher conversion rate.' },
      { label: 'Measured', value: 'Comparing the eight months since launch, October to June, with the same period the year before. GA4, UK sessions.' },
    ],
    recognition: {
      text: 'Winner, UK User Experience of the Year, UK eCommerce Awards 2026. Also shortlisted for B2C eCommerce Website of the Year.',
      badge,
      badgeAlt: 'UK eCommerce Awards 2026 winner',
    },
  },
  showcase: {
    label: 'East at Home screens',
    background: photo(B, 'showcase-photo', curry),
    desktop: slot(B, 'showcase-desktop', 'The East at Home store on desktop: the homepage, a sauces collection, a product page and the bag.', 'Desktop journey recording'),
    phones: [
      slot(B, 'showcase-phone-1', 'The East at Home homepage on mobile.', 'Homepage'),
      slot(B, 'showcase-phone-2', 'The East at Home navigation on mobile.', 'Navigation'),
      slot(B, 'showcase-phone-3', 'East at Home search on mobile.', 'Search'),
      slot(B, 'showcase-phone-4', 'The East at Home recipes page on mobile.', 'Recipes page'),
    ],
  },
  workIntro: {
    eyebrow: 'East at Home Shopify UX design',
    heading: 'Five decisions behind the redesign',
    body: 'The East at Home work started with a UX review of the old store, before any design. The review showed where shoppers hesitated, and that is where the concepts started.',
  },
  highlights: [
    {
      eyebrow: 'Mobile UX review',
      heading: 'Find where shoppers hesitate.',
      body: 'The mobile UX review paired GA4 data with the whole purchase journey at common phone sizes. It showed which details shoppers needed sooner to tell one sauce from another.',
      media: slot(B, 'work-01', 'The East at Home UX review on mobile.', 'The UX review recording'),
    },
    {
      eyebrow: 'Shopify product card design',
      heading: 'Four answers before the click.',
      body: 'Shopify product card design decides a sauce shop. Every East at Home card shows heat in chilli icons, dietary information, reviews and the price, and on mobile the grid becomes a list so it stays readable.',
      link: innovationLink('See product cards that answer dinner questions', 'dinner-question-cards'),
      media: innovationSlot('dinner-question-cards', 'East at Home product cards on mobile, showing heat, dietary information, reviews and price.', 'The collection recording'),
    },
    {
      eyebrow: 'Quantity discount design',
      heading: 'Make the saving obvious.',
      body: 'Quantity discount design on East at Home’s product pages shows the saving as the quantity rises, 8% off three and 17% off ten. Ingredients, dietary information and reviews sit beside the jar, and cooking animations carry the key messages.',
      media: slot(B, 'work-03', 'An East at Home product page on mobile, with quantity savings above the add button.', 'A product page'),
    },
    {
      eyebrow: 'Shopify basket design',
      heading: 'Show what the next spend unlocks.',
      body: 'Shopify basket design here means two goals in the bag: free delivery at £35 and a free recipe book at £50. Customers see what the next item unlocks, and decide for themselves.',
      media: slot(B, 'work-04', 'The East at Home bag on mobile, with a two-tier progress bar towards free delivery and a free recipe book.', 'The bag recording'),
    },
    {
      eyebrow: 'Shopify bundle builder design',
      heading: 'Mix and match on a phone.',
      body: 'Shopify bundle builder design at East at Home lets customers mix and match sauces and kits on a phone, with clear feedback at every step, so a bigger order feels easy rather than complicated.',
      media: slot(B, 'work-05', 'Building a mix and match bundle of East at Home sauces on mobile.', 'The mix and match recording'),
    },
  ],
  // One 50/50 halfway through the work (27 October 2026): this photo sticks at full height while
  // desktop screens scroll past on the tint. Drop in split-desktop-1 to -3.
  splits: [desktopSplit(B, 'East at Home', photoMedia(B, 'split-1-photo'), '#84838C')],
  feature: {
    background: photo(B, 'feature-photo'),
    eyebrow: 'Shopify design system',
    heading: 'One system for every page and campaign.',
    // The brand itself was another agency's, so the copy credits the system, not the brand.
    body: 'East at Home’s design system balances a bold, playful brand with clean, scannable layouts. Every page was built from it as a clickable Figma prototype, so the team can make new landing pages and campaigns without the design drifting.',
    media: slot(B, 'feature', 'An East at Home screen on mobile in the design system.', 'Design system screen'),
  },
  testimonial: {
    eyebrow: 'East at Home testimonial',
    heading: 'In the client’s words.',
    quote:
      'When I first saw Anthony’s work I knew that he was the right person for us, my initial hunch turned out to be correct. He was a joy to work with, a true craftsman who takes pride in his work with expert knowledge and delivers amazing results.',
    cite: creditLine(testimonial('east-at-home')),
  },
  more: { ...MORE_HEADING, cards: moreFor('East at Home') },
};
