// Shopify CRO. Copy: page-copy/service-pages.md, Page 5.
import { URLS } from '../site';
import type { ServicePage } from './types';
import { serviceHero } from '../service-heroes';
import { card, hubPrice, ROUTING_EYEBROW, PRICE_NOTE, QUOTE, ALL_ARTICLES, ARTICLE } from './shared';

export const CRO: ServicePage = {
  meta: {
    title: 'Shopify CRO | Conversion Rate Optimisation | Anthony is Freelance',
    description:
      'Shopify CRO and conversion rate optimisation that starts with your data. At East at Home, conversion rose 14% over eight months. By Anthony Bliss.',
    path: URLS.cro,
    name: 'Shopify CRO',
    serviceType: 'Shopify conversion rate optimisation',
    minPrice: 3000,
  },
  hero: {
    eyebrow: 'Shopify CRO',
    heading: 'Find what is holding your store back. Fix it.',
    intro:
      'Shopify CRO, short for Shopify conversion rate optimisation, means finding the steps where customers leave your store, redesigning them, and measuring the result against the same period before. I start with your analytics and a UX review, then design the changes and measure them once they’re live. Shopify CRO starts from £3,000 + VAT, quoted after a UX review once we know what it finds. At East at Home, conversion rose 14% and revenue 82% over the eight months after launch, against the same months the year before.',
    cta: { label: 'Start with a UX review', href: '#start-a-project' },
    ...serviceHero(URLS.cro),
    caption: 'East at Home. Quantity savings on the product page.',
  },
  trust: ['Quoted after a UX review', 'From three weeks', 'Works with the analytics you already have'],
  included: {
    heading: 'Shopify CRO: what I look at first',
    items: [
      'Trust. Would I trust this store if I landed on it cold?',
      'The shopping information. When will it arrive, what does delivery cost, and can I send it back?',
      'The navigation. It’s where most customers go first, and it shows how the whole journey holds up.',
      'The product cards. The most-seen part of any store, and the most often rushed.',
      'The cart. Every extra decision in a slide-out cart is a chance to lose the sale. More big brands are going back to a simple cart page.',
    ],
  },
  fit: {
    heading: "Shopify CRO: who it's for",
    items: [
      'Your traffic is steady, but sales haven’t kept up.',
      'Your conversion rate has stalled, or dropped after a change.',
      'You’re happy with how the store looks, and want it to work harder.',
    ],
  },
  proof: {
    heading: 'Shopify CRO results from real stores',
    link: { label: 'View all Shopify CRO work', href: `${URLS.work}#shopify-cro` },
    cards: [card('East at Home'), card('Fuzzball'), card('Dr Lipp')],
  },
  routing: {
    eyebrow: ROUTING_EYEBROW,
    heading: "When Shopify CRO isn't the right call",
    intro: 'CRO works on a store with enough visitors and analytics where we can dive in and find out key areas that are failing. Then formulate a plan to put things right.',
    routes: [
      { situation: "You don't have much traffic yet.", body: 'CRO needs visitors to measure. With small numbers, changes are hard to read, and the budget is better spent getting people to the store. My article on good conversion rates shows where you stand.', links: [{ label: 'Article: What Is a Good Conversion Rate on Shopify?', href: ARTICLE.goodConversion.href }] },
      { situation: 'Your store is new.', body: "Give it a few months of sales, so there's a baseline to measure against. Until then, a UX review catches the obvious problems.", links: [{ label: 'Shopify UX design', href: URLS.ux }] },
      { situation: 'The theme is the problem.', body: "If every fix needs a workaround, you're patching a store that has run out of road.", links: [{ label: 'Bespoke store design', href: URLS.bespoke }, { label: 'Theme customisations', href: URLS.theme }] },
      { situation: 'You need an app set up.', body: 'Installing and configuring an analytics or CRO app is developer work, and quicker than a CRO project. I can introduce a developer. Once the data is coming in, CRO puts it to work.', links: [] },
    ],
  },
  process: {
    eyebrow: 'Shopify CRO process',
    heading: 'How a project runs',
    intro:
      'The best way to start a CRO project is with a UX review of your live store. I go through your GA4 data first to see who shops and where they drop off, then map the entire purchase journey on a Miro board, screen by screen. Throughout, I ask one question: would I buy this product?',
    steps: [
      { title: 'Understand', body: 'Your analytics and a UX review on a Miro board of real screenshots, showing where customers leave and why.' },
      { title: 'Design', body: 'We agree what to fix first, then I prototype the changes in Figma, from small fixes to bigger redesigns.' },
      { title: 'Launch', body: 'The developer builds the changes, and I check them before they go live.' },
      { title: 'Measure and improve', body: 'Results compared with the same period the year before, then the next round of fixes.' },
    ],
  },
  testimonial: {
    heading: 'Zen Maitri on Shopify CRO. Data first, then design.',
    quote:
      'We were very impressed by how data-driven Anthony was: the first thing he did was do an analysis of our website to identify click rates and where page views were dropping off. This analysis allowed us to figure out where exactly our priorities need to be. We were extremely pleased with the end result and we would not hesitate to recommend Anthony.',
    cite: 'Jaideep Shah, Director, Zen Maitri',
  },
  price: {
    eyebrow: 'Shopify CRO price',
    heading: 'How much does Shopify CRO cost?',
    notes: [PRICE_NOTE, 'The price is dependent on how many design changes and sections come out of the review, and how many tests we set up.'],
    cta: QUOTE,
    caption: 'Shopify CRO at a glance',
    rows: [
      ['Starting price', hubPrice('Shopify CRO')],
      ['Design time', 'From three weeks for a review and tweaks, depending on how many changes there are'],
      ['Build time', 'Depends on how many changes the review finds'],
      ['What you get', 'A UX review on a Miro board, an agreed list of fixes, and the changes designed in Figma'],
      ['Who builds it', 'A developer I introduce, or your own team or agency, quoted separately'],
    ],
  },
  comparison: {
    eyebrow: 'Shopify CRO vs a redesign',
    heading: 'Which does your store need?',
    caption: 'Shopify CRO and a store redesign compared, design only, checked November 2026',
    columns: [
      { label: 'Shopify CRO', href: URLS.cro, current: true },
      { label: 'A redesign, theme or bespoke', href: URLS.services },
    ],
    rows: [
      ['The question', 'Which steps lose sales, and how do we fix them?', 'Has the store outgrown its theme or its brand?'],
      ['Scope', 'The steps that lose sales, fixed in priority order', 'Every key template, the navigation and the design system'],
      ['Starting price', 'From £3,000 + VAT', 'From £5,000 + VAT for a theme customisation, £10,000 + VAT for bespoke'],
      ['Time', 'From three weeks for a review and tweaks', 'Six to ten weeks for a theme, six to eight weeks of design for bespoke'],
      ['Best when', 'The store works, but sales have stalled', 'The theme keeps fighting you, or the brand has moved on'],
    ],
  },
  faqs: {
    eyebrow: 'Shopify conversion rate optimisation FAQs',
    heading: 'Before you get in touch.',
    items: [
      { q: 'What is Shopify CRO?', a: ["Shopify CRO, or conversion rate optimisation, is improving your store so more visitors buy. It means finding where customers leave, redesigning those steps and measuring the result. A store is never finished, so it's ongoing work, not a one-off."] },
      { q: 'What is a good conversion rate on Shopify?', a: ['Above 3.2% puts a Shopify store in the top 20%, and the average is 1.4%. Your sector matters more than the average, so compare yourself with similar stores.'] },
      { q: 'How long does CRO take to show results?', a: ["It depends on what's being measured. For a CRO change, I usually compare a week against a week, and make sure it's a fair test, with no sale or campaign flattering one side. For a case study, I show a longer stretch so the figure reflects the whole new store, and I always say which dates and which data it comes from."] },
      { q: 'Can you work with my existing developer?', a: ['Yes. I design the changes in Figma and brief your developer, then QA what they build before it goes live.'] },
      { q: 'Do I need CRO help if I already use an analytics app?', a: ["An analytics app shows you what happened and where. It can't design the change that fixes it, or judge whether that change suits your brand. I start from what your app already shows, so if it has found the drop-off, we go straight to the fix."] },
      { q: "Which conversion tactics won't you use?", a: ["No countdown timers, fake scarcity or upsells crammed into the cart drawer, unless we've agreed they're right for your brand. I'll bring ideas like these to the table and we decide together. I'll always flag anything that risks what's already working, even if it would lift the number this month."] },
      { q: "How do you measure Shopify CRO results?", a: ["With the cleanest data available, and I always say which: GA4 where it's reliable, and till or EPoS data where it isn't. I track conversion rate and average order value, and compare like with like, so a sale or a campaign doesn't flatter the result. Where traffic allows, we A/B test."] },
    ],
  },
  articles: {
    eyebrow: 'Shopify conversion rate articles',
    heading: 'Where to read more.',
    link: ALL_ARTICLES,
    items: [ARTICLE.goodConversion, ARTICLE.increaseConversion],
  },
  extras: [
    { kind: 'todo', after: 'process', title: 'Selling more without pushing', note: 'Innovations section, off for now. Multi-buy buttons, quantity savings and the other selling features were judged design details, not innovations. Waiting on your yes to show them unlabelled.' },
  ],
  cta: { eyebrow: 'Start a Shopify CRO project', heading: 'Tell me where customers leave.' },
};
