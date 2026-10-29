// Shopify UX design. Copy: page-copy/service-pages.md, Page 6.
// Lives at the existing /freelance-ux-ui-designer/ URL for now ([CONFIRM] the doc's move to
// /shopify-website-design/shopify-ux-design/ with a 301).
import { URLS } from '../site';
import type { ServicePage } from './types';
import { serviceHero } from '../service-heroes';
// Lifestyle hero from Drive services/<service>/hero-lifestyle.jpg
import { card, hubPrice, ROUTING_EYEBROW, PRICE_NOTE, PROCESS_INTRO, QUOTE, ALL_ARTICLES, ARTICLE, CRO_VS_UX } from './shared';

export const UX: ServicePage = {
  meta: {
    title: 'Shopify UX Design and UX Reviews | Anthony is Freelance',
    description:
      'Shopify UX design that starts with your navigation and your data. A UX review of your live store, then flows and wireframes, by Anthony Bliss.',
    path: URLS.ux,
    name: 'Shopify UX design',
    serviceType: 'Shopify UX design',
  },
  hero: {
    eyebrow: 'Shopify UX design',
    heading: 'Help customers find the right product.',
    intro:
      'Shopify UX design decides how customers find, compare and buy your products, before anything is styled. I start with a UX review of your live store: your analytics, your navigation and your reviews. Then I design the flows and wireframes that fix what the review finds. Shopify UX design is quoted on the call, based on the size of the store. East at Home won UK User Experience of the Year 2026.',
    cta: { label: 'Book a UX review', href: '#start-a-project' },
    ...serviceHero(URLS.ux),
    caption: 'Whistlefish. The collection drill-down on mobile.',
  },
  trust: ['UK User Experience of the Year 2026', 'Navigation first', 'Your real data, not personas'],
  included: {
    heading: 'Shopify UX review: what it covers',
    items: [
      'Your analytics. Who shops, on which devices, and where they drop off.',
      'Navigation and collections. How many routes lead to each product, and whether they match how people actually shop.',
      "Product cards and product pages. What customers need to decide, and whether it's there.",
      'Trust. Your reviews, delivery information and returns, as a first-time customer sees them.',
      'Cart and checkout. Every step and every extra decision.',
      'You get a Miro board of real screenshots from your store, annotated, then a call to walk through it and agree what to fix first.',
    ],
  },
  fit: {
    heading: "Shopify UX design: who it's for",
    items: [
      'Your range is big, and customers struggle to find the right product.',
      'Your products are complex, and choosing is the hard part.',
      "You're planning a redesign and want it based on evidence.",
    ],
  },
  proof: {
    heading: "Shopify UX design I've done",
    link: { label: 'View all Shopify UX design work', href: `${URLS.work}#shopify-ux-design` },
    cards: [card('East at Home'), card('Whistlefish'), card('Drink Finder')],
  },
  routing: {
    eyebrow: ROUTING_EYEBROW,
    heading: "When Shopify UX design isn't the right call",
    routes: [
      { situation: 'You just need the store to look current.', body: 'If the journey already works, a refresh on a premium theme is quicker.', links: [{ label: 'Theme customisations', href: URLS.theme }] },
      { situation: 'You know exactly which step loses sales.', body: 'Go straight to fixing and measuring that step.', links: [{ label: 'Shopify CRO', href: URLS.cro }] },
      { situation: "The journey is fine, the brand isn't.", body: "When customers find what they want but the store doesn't feel like you, it's a brand job.", links: [{ label: 'Branding', href: URLS.branding }] },
    ],
  },
  process: {
    eyebrow: 'Shopify UX design process',
    heading: 'How a project runs',
    intro: PROCESS_INTRO,
    steps: [
      { title: 'Understand', body: 'A call, a tailored quote, then a UX review of analytics, navigation, product pages, trust and checkout on Miro.' },
      { title: 'Design', body: 'We agree what to fix first, then flows and wireframes in Figma, mobile first, with two rounds of feedback.' },
      { title: 'Launch', body: "The work feeds a theme customisation, a bespoke design or your developer's list, and I check it before launch. [CONFIRM]" },
      { title: 'Measure and improve', body: 'I check conversion rate and average order value at one, three and seven days after launch.' },
    ],
  },
  innovations: {
    eyebrow: 'Shopify UX innovations',
    heading: 'Making the right product easy to find.',
    intro: "Most of these start in the navigation, because that's where customers go first.",
    items: [
      { client: 'Whistlefish', title: 'Image-first product cards', body: 'Product names truncated on purpose, because nobody buys a greeting card for its name.' },
      { client: 'East at Home', title: 'Product cards that answer dinner questions', body: 'Every card shows spice level, dietary needs and flavour, in a list built for comparing on mobile.' },
      { client: 'Projektityyny', title: 'Shop by product, room or print', body: 'Three image-led routes in from the navigation match how people think about their homes.' },
    ],
  },
  testimonial: {
    heading: 'Whistlefish on their Shopify UX. Found it, bought it.',
    quote:
      "The new UX and UI were exceptional — customers could find products and complete purchases effortlessly, while the clean, professional design made browsing intuitive and trustworthy. Using Figma as a templating system meant all of our building blocks worked seamlessly together, and we've since been able to carry that framework into our own design team, making adjustments easily while staying true to the original vision.",
    cite: 'Will Manders, Head of Ecommerce, Whistlefish',
  },
  price: {
    eyebrow: 'UX design price',
    heading: 'How much does Shopify UX design cost?',
    notes: [PRICE_NOTE],
    cta: QUOTE,
    caption: 'UX design at a glance',
    rows: [
      ['Starting price', `${hubPrice('UX design')} [CONFIRM]`],
      ['Design time', '[CONFIRM, e.g. two to three weeks from review to wireframes]'],
      ['Build time', "Depends on where the work goes: a theme customisation, a bespoke design or your developer's list [CONFIRM]"],
      ['What you get', 'A UX review on a Miro board, then flows and wireframes in Figma'],
      ['Who builds it', 'A developer I introduce, or your own team or agency, quoted separately'],
    ],
  },
  comparison: {
    eyebrow: CRO_VS_UX.eyebrow,
    heading: CRO_VS_UX.heading,
    caption: CRO_VS_UX.caption,
    columns: [
      { label: 'Shopify CRO', href: URLS.cro },
      { label: 'Shopify UX design', href: URLS.ux, current: true },
    ],
    rows: CRO_VS_UX.rows,
  },
  faqs: {
    eyebrow: 'Shopify UX design questions',
    heading: 'Before you get in touch.',
    items: [
      { q: "What's the difference between UX and CRO?", a: ["CRO is about conversion: lifting conversion rate and order value at the steps that lose sales. UX is the whole experience: finding products, joining the email list, coming back later. A customer who doesn't buy today but remembers you is a UX win, which is why I avoid stressful, time-pressured tactics."] },
      { q: 'Do you use personas?', a: ['I start from your real data instead: analytics, reviews and how customers actually move through the store. Invented personas are guesses, and a review built on guesses tends to confirm them.'] },
      { q: "Do the small details really matter?", a: ['The small things carry the store. I iterate a single button many times before it goes into the design system, and product cards get more time than any hero. For a timber merchant, I swapped the shopping basket icon for a flatbed trolley, because nobody puts a length of oak in a basket. [CONFIRM this is from before you went freelance]'] },
    ],
  },
  articles: {
    eyebrow: 'Shopify UX articles',
    heading: 'Where to read more.',
    link: ALL_ARTICLES,
    items: [ARTICLE.uxReview, ARTICLE.productComparisons],
  },
  extras: [
    {
      kind: 'text',
      after: 'trust',
      id: 'navigation-first',
      eyebrow: 'Why navigation first',
      heading: 'Shopify UX starts with your navigation',
      paragraphs: [
        "Years of watching session recordings taught me that customers go straight to the navigation. The navigation is your store. If customers can't find the right product, the product page doesn't matter, however good it is. So the navigation is the first thing I review, and the part I most enjoy getting right.",
      ],
    },
  ],
  cta: { eyebrow: 'Book a Shopify UX review', heading: 'Send me your store URL.' },
};
