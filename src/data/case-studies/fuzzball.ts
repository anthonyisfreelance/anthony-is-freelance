// Fuzzball case study. Copy from the "Case study copy: Fuzzball" doc (20 October 2026).
// Screens drop in by name: see src/assets/brands/README.md.
import { SERVICE, slot, innovationSlot, innovationLink, photo, photoMedia, card, breadcrumbs, MORE_HEADING, type CaseStudyPageData } from './types';
import pack from '../../assets/brands/fuzzball/card.jpg';
import treats from '../../assets/brands/fuzzball/treats.jpg';

const B = 'fuzzball';
const PATH = '/portfolio/fuzzball-shopify-website-design-case-study/';

export const DATA: CaseStudyPageData = {
  meta: {
    path: PATH,
    title: 'Fuzzball Shopify Case Study: 63% Higher Conversion Rate',
    description:
      'How I redesigned Fuzzball’s cat food subscription journey on Shopify. Conversion rate up 63% in the 12 months after launch, on GA4.',
    breadcrumbs: breadcrumbs('Fuzzball', PATH),
  },
  // [CONFIRM] store URL
  client: { name: 'Fuzzball', url: 'https://fuzzball.co.uk/', display: 'fuzzball.co.uk' },
  hero: {
    eyebrow: 'Fuzzball Shopify case study',
    figure: '63%',
    heading: 'higher conversion rate',
    standfirst:
      'Fuzzball is a premium, health-focused cat food brand sold by subscription, with an animated cat at the heart of its brand. I redesigned its Shopify store and subscription quiz so the personality helps people sign up instead of getting in the way.',
    image: photoMedia(B, 'hero', pack),
  },
  brief: {
    eyebrow: 'The brief',
    heading: 'Fix the quiz and the bag, where people left',
    body: [
      'The Fuzzball brief came from a UX review of the old journey. Customers were dropping off at two points: the quiz that builds their plan, and the bag where trial and subscription met.',
      'The job was to simplify both, show the value at every step and keep the brand’s playful character without slowing anyone down.',
    ],
  },
  details: {
    sector: 'Pets',
    services: [SERVICE.subscriptions, SERVICE.cro],
    live: '13 August 2025',
    liveIso: '2025-08-13',
    // Conversion rate leads, not revenue: paid social traffic nearly tripled over the same 12 months.
    rows: [
      { label: 'Results', value: '63% higher conversion rate.' },
      { label: 'Measured', value: 'Comparing the 12 months since launch, August 2025 to August 2026, with the same period the year before. GA4.' },
    ],
  },
  showcase: {
    label: 'Fuzzball screens',
    background: photo(B, 'showcase-photo', treats),
    desktop: slot(B, 'showcase-desktop', 'The Fuzzball store on desktop: the homepage, the navigation and a product page.', 'Desktop experience recording'),
    phones: [
      slot(B, 'showcase-phone-1', 'The Fuzzball homepage on mobile.', 'Homepage'),
      slot(B, 'showcase-phone-2', 'The Fuzzball collection on mobile.', 'Collection'),
      slot(B, 'showcase-phone-3', 'The first Fuzzball quiz step on mobile.', 'First quiz step'),
      slot(B, 'showcase-phone-4', 'The Fuzzball quiz completion screen on mobile.', 'Quiz completion'),
    ],
  },
  workIntro: {
    eyebrow: 'The work',
    heading: 'Five decisions behind the redesign',
    body: 'The Fuzzball work started with a UX review of the subscription journey, before any design. The review showed where customers dropped off, and that is where the concepts started.',
  },
  highlights: [
    {
      eyebrow: 'Shopify navigation design',
      heading: 'Explain the subscription before the click.',
      body: 'Shopify navigation design at Fuzzball does more than list products. The menu carries quality, delivery and how-it-works messages, so people trust the subscription before they start the quiz.',
      media: slot(B, 'work-01', 'The Fuzzball mobile menu, with quality, delivery and how-it-works messages beside the collections.', 'The navigation recording'),
    },
    {
      eyebrow: 'Shopify quiz design',
      heading: 'Fewer steps, every answer obvious.',
      body: 'Shopify quiz design balances what Fuzzball needs to know with what a customer will put up with. Fewer steps and clicks, clearer button states, and slide-up panels for anyone who wants more detail.',
      media: slot(B, 'work-02', 'A Fuzzball quiz step on mobile, with a slide-up panel explaining the question.', 'The quiz recording'),
    },
    {
      eyebrow: 'Shopify subscription cart design',
      heading: 'Trial and repeat, split clearly.',
      body: 'Shopify subscription cart design fixed the biggest drop-off. The quiz cart now separates the trial from the repeating order, so customers see exactly what they’re signing up to.',
      link: innovationLink('See trial and subscription, split clearly', 'trial-subscription-split'),
      media: innovationSlot('trial-subscription-split', 'The Fuzzball quiz cart on mobile, with the trial box above the repeating order.', 'The quiz cart'),
    },
    {
      eyebrow: 'Shopify product card design',
      heading: 'Set expectations before the click.',
      body: 'Shopify product card design for subscription-only products shows a lock icon, an “Only available on subscription” label and View Product instead of Add to Bag. Nobody finds out at the last step.',
      link: innovationLink('See subscription-only product cards', 'subscription-only-cards'),
      media: innovationSlot('subscription-only-cards', 'A Fuzzball product card on mobile, locked with an Only available on subscription label.', 'A subscription-only card'),
    },
    {
      eyebrow: 'Shopify product page design',
      heading: 'Ingredients and benefits at a glance.',
      body: 'Shopify product page design for Fuzzball sets out ingredients and benefits with icons and short callouts for scan readers, plus quick links to build a subscription box, including for quiz-only products.',
      media: slot(B, 'work-05', 'A Fuzzball product page on mobile, with ingredient icons and a link to build a box.', 'The product page recording'),
    },
  ],
  gallery: {
    label: 'More Fuzzball screens',
    screens: [
      slot(B, 'gallery-1', 'The Fuzzball quiz summary on mobile.', 'Quiz summary'),
      slot(B, 'gallery-2', 'The Fuzzball add to cart overlay on mobile.', 'Add to cart overlay'),
      slot(B, 'gallery-3', 'The Fuzzball bag on mobile.', 'Bag'),
      slot(B, 'gallery-4', 'The Fuzzball blog on mobile.', 'Blog'),
      slot(B, 'gallery-5', 'A Fuzzball blog article on mobile.', 'Blog article'),
    ],
    photo: photoMedia(B, 'gallery-photo'),
    caption: 'Fuzzball on mobile: the quiz summary, the bag and the blog, in the same playful system.',
  },
  feature: {
    background: photo(B, 'feature-photo'),
    eyebrow: 'Shopify brand design',
    heading: 'A quiz that feels like Fuzzball.',
    body: 'Fuzzball’s interface feels more like an app than a shop: rounded corners, bold hover states and animated icons. On the quiz, the cat chases a ball along the progress bar, so finishing it feels like part of the brand, not a form.',
    link: innovationLink('See a progress bar with character', 'progress-bar-with-character'),
    media: innovationSlot('progress-bar-with-character', 'The Fuzzball quiz progress bar on mobile, with the cat chasing a ball.', 'The progress bar recording'),
  },
  // No quote yet: ask Fuzzball, or the agency if the work came through one. The page goes live either way.
  more: { ...MORE_HEADING, cards: [card('Drink Finder'), card('East at Home'), card('Whistlefish')] },
};
