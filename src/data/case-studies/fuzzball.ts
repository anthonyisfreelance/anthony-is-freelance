// Fuzzball case study. Copy from the "Case study copy: Fuzzball" doc (20 October 2026).
// Screens drop in by name: see src/assets/brands/README.md.
import { SERVICE, slot, innovationSlot, innovationLink, photo, photoMedia, moreFor, breadcrumbs, MORE_HEADING, type CaseStudyPageData, desktopSplit } from './types';
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
    eyebrow: "Fuzzball Shopify subscription brief",
    heading: "Fix the quiz and bag, where people left",
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
    desktop: slot(B, 'showcase-desktop', 'The Fuzzball store on desktop: the homepage, the products collection and a product page.', 'Desktop experience recording'),
    phones: [
      slot(B, 'showcase-phone-1', 'The Fuzzball homepage on mobile.', 'Homepage'),
      slot(B, 'showcase-phone-2', 'The Fuzzball collection on mobile.', 'Collection'),
      slot(B, 'showcase-phone-3', 'The first Fuzzball quiz step on mobile.', 'First quiz step'),
      slot(B, 'showcase-phone-4', 'The Fuzzball quiz completion screen on mobile.', 'Quiz completion'),
    ],
  },
  workIntro: {
    eyebrow: "Fuzzball Shopify subscription design",
    heading: "From quiz to repeat order",
    body: 'The Fuzzball work started with a UX review of the subscription journey, before any design. The review showed where customers dropped off, and that is where the concepts started.',
  },
  highlights: [
    {
      eyebrow: 'Subscription menu design',
      heading: 'Explain the subscription before the click.',
      body: 'Subscription menu design at Fuzzball does more than list products. The menu carries quality, delivery and how-it-works messages, so people trust the subscription before they start the quiz.',
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
      eyebrow: 'Subscription-only product cards',
      heading: 'Set expectations before the click.',
      body: 'Subscription-only product cards show a lock icon, an “Only available on subscription” label and View Product instead of Add to Bag. Nobody finds out at the last step.',
      link: innovationLink('See subscription-only product cards', 'subscription-only-cards'),
      media: innovationSlot('subscription-only-cards', 'A Fuzzball product card on mobile, locked with an Only available on subscription label.', 'A subscription-only card'),
    },
    {
      eyebrow: 'Pet food product page design',
      heading: 'Ingredients and benefits at a glance.',
      body: 'Pet food product page design at Fuzzball sets out ingredients and benefits with icons and short callouts for scan readers, plus quick links to build a subscription box, including for quiz-only products.',
      media: slot(B, 'work-05', 'A Fuzzball product page on mobile, with ingredient icons and a link to build a box.', 'The product page recording'),
    },
  ],
  // One 50/50 halfway through the work (27 October 2026): this photo sticks at full height while
  // desktop screens scroll past on the tint. Drop in split-desktop-1 to -3.
  splits: [desktopSplit(B, 'Fuzzball', photoMedia(B, 'split-1-photo'), '#DDF7F5')],
  feature: {
    background: photo(B, 'feature-photo'),
    eyebrow: 'App-like brand design',
    heading: 'A quiz that feels like Fuzzball.',
    body: 'Fuzzball’s interface feels more like an app than a shop: rounded corners, bold hover states and animated icons. On the quiz, the cat chases a ball along the progress bar, so finishing it feels like part of the brand, not a form.',
    link: innovationLink('See a progress bar with character', 'progress-bar-with-character'),
    media: innovationSlot('progress-bar-with-character', 'The Fuzzball quiz progress bar on mobile, with the cat chasing a ball.', 'The progress bar recording'),
  },
  // No quote yet: ask Fuzzball, or the agency if the work came through one. The page goes live either way.
  more: { ...MORE_HEADING, cards: moreFor('Fuzzball') },
};
