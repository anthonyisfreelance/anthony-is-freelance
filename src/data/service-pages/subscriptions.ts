// Subscriptions. Copy: page-copy/service-pages.md, Page 7. No FAQ block: the
// buyer questions sit in the body as question headings instead.
import { URLS } from '../site';
import type { ServicePage } from './types';
import { serviceHero } from '../service-heroes';
import { card, hubPrice, ROUTING_EYEBROW, PRICE_NOTE, PROCESS_INTRO, QUOTE } from './shared';

export const SUBSCRIPTIONS: ServicePage = {
  meta: {
    title: 'Shopify Subscription Design | Anthony is Freelance',
    description:
      'Shopify subscription design: product pages, quizzes and build-a-box flows that are easy to join, pause and change. Designed around your subscription app.',
    path: URLS.subscriptions,
    name: 'Subscriptions',
    serviceType: 'Shopify subscription design',
  },
  hero: {
    eyebrow: 'Shopify subscription design',
    heading: 'Easy to join. Easy to stay.',
    intro:
      'Shopify subscription design covers the pages and flows customers use to subscribe: product pages with subscription options, quizzes, build-a-box journeys and account pages for pausing or changing an order. I design them so every choice is clear, however complex the subscription app behind them. Subscription design is usually part of a theme customisation or bespoke project, and priced with it. At Fuzzball, the conversion rate rose 63% in the 12 months after launch.',
    cta: { label: 'Start a subscription project', href: '#start-a-project' },
    ...serviceHero(URLS.subscriptions),
    caption: "Fuzzball. The cat food quiz on mobile.",
  },
  trust: ['Priced with your theme or bespoke project', 'Designed around Recharge and other apps', '20+ years of brand and ecommerce experience'],
  included: {
    heading: 'What subscription design includes',
    items: [
      'Product pages where subscribe and one-off purchase sit side by side, with the saving and the frequency clear',
      'Quizzes that recommend a plan, then let customers change it',
      "Build-a-box flows, with a summary page that shows exactly what's coming and when",
      'Account pages where pausing, skipping and swapping take one tap',
      'Recommendations that feel natural, not pushed',
      "I'd rather a customer pauses than cancels, so pausing is never hidden.",
    ],
  },
  fit: {
    heading: 'Who subscription design is right for',
    items: [
      'Repeat purchase is your business model.',
      'Customers find your subscription options confusing, especially on mobile.',
      "You're adding a quiz or a build-a-box and want it to feel simple.",
    ],
  },
  proof: {
    heading: "Shopify subscription stores I've designed",
    link: { label: 'View all subscription work', href: `${URLS.work}#subscriptions` },
    cards: [card('Fuzzball'), card('Window Fleur')],
  },
  routing: {
    eyebrow: ROUTING_EYEBROW,
    heading: "When subscription design isn't the right call",
    routes: [
      { situation: 'You need the subscription app set up or moved.', body: "That's developer work. I design around what your app can do and brief the developer, and I can introduce one.", links: [] },
      { situation: 'Subscriptions are a small part of your range.', body: 'A subscribe option on a few products fits inside a theme customisation.', links: [{ label: 'Theme customisations', href: URLS.theme }] },
      { situation: 'The subscription is the product.', body: 'When the quiz and the box are the business, design the whole store around them, as Fuzzball did.', links: [{ label: 'Bespoke store design', href: URLS.bespoke }] },
      { situation: 'Plenty start the quiz. Few subscribe.', body: "If the subscription flow is designed and people still drop out of it, you don't need a redesign. Find the step where they leave and fix that.", links: [{ label: 'Shopify CRO', href: URLS.cro }] },
    ],
  },
  process: {
    eyebrow: 'Shopify subscription design process',
    heading: 'How a project runs',
    intro: PROCESS_INTRO,
    steps: [
      { title: 'Understand', body: 'A call, a tailored quote and, where it helps, a UX review of your subscription journey.' },
      { title: 'Design', body: 'Product pages, quizzes and account pages designed around your subscription app, with weekly calls and two rounds of feedback.' },
      { title: 'Launch', body: 'The developer builds it and sets up the app, and I check every step on real devices.' },
      { title: 'Measure and improve', body: 'I check conversion rate and average order value at one, three and seven days after launch.' },
    ],
  },
  innovations: {
    eyebrow: 'Subscription design innovations',
    heading: 'Subscriptions without the confusion.',
    intro: 'Subscription logic is complicated. None of it should reach the customer.',
    items: [
      { client: 'Fuzzball', title: 'Subscription-only product cards', body: 'A lock icon and an "only on subscription" label replace Add to Bag, so expectations are set before the click.' },
      { client: 'Fuzzball', title: 'Trial and subscription, split clearly', body: 'The cart shows which items are the trial and which repeat, so nobody signs up by accident.' },
      { client: 'Window Fleur', title: 'Three pages in one screen', body: 'A three-page subscription journey rebuilt as one mobile screen, with slide-ups holding the detail.' },
    ],
  },
  testimonial: {
    heading: 'Window Fleur on their redesign. Simpler to subscribe.',
    quote:
      "Ant was fantastic to work with—professional, efficient, and made the whole process seamless. Our website saw huge improvements, and we'll definitely be working with him again for future projects. He also has great industry contacts, which was a real bonus!",
    cite: 'Frannie Liddle, Co-Founder and Creative Director, Window Fleur',
  },
  price: {
    eyebrow: 'Subscription design price',
    heading: 'How much does Shopify subscription design cost?',
    notes: [PRICE_NOTE],
    cta: QUOTE,
    caption: 'Subscriptions at a glance',
    rows: [
      ['Starting price', `${hubPrice('Subscriptions')} [CONFIRM]`],
      ['Design time', 'Usually runs inside a theme customisation or bespoke project [CONFIRM]'],
      ['Build time', '[CONFIRM]'],
      ['What you get', 'Subscription product pages, quiz or build-a-box flows and account pages, designed around your subscription app'],
      ['Who builds it', 'A developer I introduce, or your own team or agency, quoted separately, including the app setup'],
    ],
  },
  faqs: {
    eyebrow: 'Shopify subscription design FAQs',
    heading: 'Before you get in touch.',
    items: [
      { q: "Should I use a quiz?", a: ["Use one when customers need help choosing, like Fuzzball's meal plans built around each cat. If people already know what they want, a quiz only slows them down."] },
      { q: "Which subscription apps do you design for?", a: ['Recharge, which Window Fleur runs on. [CONFIRM any others you’ve designed for, and which app Fuzzball uses] I design within what your app allows, so the brief to the developer holds no surprises.'] },
    ],
  },
  extras: [
    { kind: 'todo', after: 'price', title: 'Articles', note: 'None yet about subscriptions. The section stays off until one is published.' },
  ],
  cta: { eyebrow: 'Start a subscription design project', heading: 'Tell me how customers subscribe now.' },
};
