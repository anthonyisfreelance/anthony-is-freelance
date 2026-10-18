// Theme customisations. Copy: page-copy/service-pages.md, Page 2.
import { URLS } from '../site';
import type { ServicePage } from './types';
import { card, caseStudyHref, hubPrice, ROUTING_EYEBROW, PRICE_NOTE, PROCESS_INTRO, TRUST_COMMON, QUOTE, THEME_VS_BESPOKE_ROWS } from './shared';

export const THEME: ServicePage = {
  meta: {
    title: 'Shopify Theme Customisation UK | Anthony is Freelance',
    description:
      'Shopify theme customisation from £5,000 + VAT, design only. A premium theme redesigned around your brand, delivered as a live store in four to eight weeks.',
    path: URLS.theme,
    name: 'Theme customisations',
    serviceType: 'Shopify theme customisation',
    minPrice: 5000,
  },
  hero: {
    eyebrow: 'Shopify theme customisation',
    heading: "A premium theme that doesn't look like one.",
    intro:
      'Shopify theme customisation means taking a premium theme and redesigning it around your brand, products and customers, so it stops looking like the demo. I design straight into the theme and deliver a live store. Theme customisations start from £5,000 + VAT, design only, and take four to eight weeks. Thameen London, a fragrance house stocked in Harrods, runs on one.',
    cta: { label: 'Start a theme project', href: '#start-a-project' },
    caption: 'Thameen London. The desktop journey on the Sleek theme.',
  },
  trust: [`${hubPrice('Theme customisations')}`, 'Four to eight weeks', ...TRUST_COMMON.slice(0, 1)],
  included: {
    heading: 'What a theme customisation includes',
    items: [
      'A UX review of your current store before design starts',
      'A theme recommendation with the reasons, before you buy anything',
      'Every template styled in the theme: home, collection, product, cart and search',
      'Product cards, navigation, header and footer redesigned around your brand',
      "A short, clear brief for any custom sections the theme can't do",
      'Help with the content upload, so it goes live looking as designed [CONFIRM still offered]',
      'A live store, checked on real devices',
    ],
  },
  fit: {
    heading: 'Right for you if',
    items: [
      "You're a start-up, and you want real sales data before a bigger investment.",
      'You need to launch or relaunch quickly.',
      'Your range fits a clear, standard navigation.',
      'You want to see how far a good theme goes before committing to bespoke.',
    ],
  },
  proof: {
    heading: "Theme customisations I've designed",
    link: { label: 'View all theme customisation work', href: `${URLS.work}#theme-customisations` },
    cards: [card('Thameen London'), card('Wide Fit Shoes'), card('Sensational Eyes')],
  },
  routing: {
    eyebrow: ROUTING_EYEBROW,
    heading: "When a theme customisation isn't the right call",
    intro:
      "Most brands can go a long way on a good theme. These are the signs you've reached the end of it, when your products start to feel like square pegs in round holes.",
    routes: [
      { situation: "Your range has outgrown the theme's navigation.", body: 'Navigation is where themes fall down first. If customers need several routes into a big range, the store needs designing around your products.', links: [{ label: 'Bespoke store design', href: URLS.bespoke }] },
      { situation: 'Your product needs a buying journey no theme has.', body: "Configurators, quizzes and build-a-box flows don't come in a theme. They need designing from the product up.", links: [{ label: 'Bespoke store design', href: URLS.bespoke }, { label: 'Subscriptions', href: URLS.subscriptions }] },
      { situation: "The store looks right, but doesn't sell enough.", body: "A fresh look won't fix a journey that loses people. Find where they leave and fix that first.", links: [{ label: 'Shopify CRO', href: URLS.cro }] },
      { situation: "You're moving from another platform.", body: 'A move to Shopify changes what you need, so start there.', links: [{ label: 'Migrations', href: URLS.migrations }] },
      { situation: "You're not sure what's holding the store back.", body: 'A theme customisation changes how a store looks, not always how it works. A UX review first shows which of the two you need.', links: [{ label: 'Shopify UX design', href: URLS.ux }] },
      { situation: "You're launching your first store.", body: "Start with Shopify's AI store builder or a free theme, and come back when sales show what it needs.", links: [] },
    ],
    note: 'Thameen London did exactly this: a premium theme now, with a bespoke build to revisit once they have more data and content. The brand decisions, photography and content carry straight over when that day comes.',
  },
  process: {
    eyebrow: 'Shopify theme customisation process',
    heading: 'How a project runs',
    intro: PROCESS_INTRO,
    steps: [
      { title: 'Understand', body: 'A 30-minute call, a fixed-price proposal, a UX review where it helps, and a theme shortlist with reasons before anything is bought.' },
      { title: 'Design', body: 'Every template styled in the theme, with a weekly call and two rounds of feedback.' },
      { title: 'Launch', body: 'Where the theme runs out, I brief the developer on custom sections. Every screen checked on real devices.' },
      { title: 'Measure and improve', body: 'I check conversion rate and average order value at one, three and seven days after launch.' },
    ],
  },
  testimonial: {
    heading: 'Thameen London on their theme customisation. A theme, but not the theme.',
    quote:
      "Most importantly, he completely transformed the way the brand comes to life digitally. The new UX elevated the website into a much more modern, intuitive and premium experience, creating a journey that feels both effortless for the customer and truly reflective of Thameen's luxury positioning.",
    cite: 'Nour Abdel-Motaal, General Manager, Thameen London',
  },
  price: {
    eyebrow: 'Theme customisation price',
    heading: 'How much does a Shopify theme customisation cost?',
    notes: [PRICE_NOTE, "The price moves with how many templates change and how many custom sections the design needs. The theme licence is a one-off cost paid to the theme's maker."],
    cta: QUOTE,
    caption: 'Theme customisations at a glance',
    rows: [
      ['Starting price', hubPrice('Theme customisations')],
      ['Design time', 'Four to eight weeks'],
      ['Build time', 'Included in the four to eight weeks [CONFIRM]'],
      ['What you get', 'Designed straight into the theme and delivered as a live store'],
      ['Who builds it', 'A developer I introduce, or your own team or agency, quoted separately, for any custom sections'],
    ],
  },
  comparison: {
    eyebrow: 'Comparison',
    heading: 'Shopify theme vs bespoke. Which suits your store?',
    caption: 'Bespoke store design and theme customisation compared, design only, checked September 2026',
    columns: [
      { label: 'Bespoke store design', href: URLS.bespoke },
      { label: 'Theme customisations', href: URLS.theme, current: true },
    ],
    rows: THEME_VS_BESPOKE_ROWS,
    examples: [
      { client: 'Drink Finder', href: URLS.caseStudies.drinkFinder, alt: '' },
      { client: 'Thameen London', href: caseStudyHref('Thameen London'), alt: '' },
    ],
    note: 'Bespoke store design starts from £10,000 + VAT, design only, with six to eight weeks of design and about the same again for the build.',
  },
  faqs: {
    eyebrow: 'Before you get in touch',
    heading: 'Shopify theme customisation FAQs',
    items: [
      { q: 'Can I start with the AI store builder and customise it later?', a: ["Yes. Plenty of brands start on a generated or free theme and bring in a designer once sales show what it can't do. Your products, content and orders carry over, because it's all still Shopify."] },
      { q: 'What is Shopify theme customisation?', a: ['Shopify theme customisation is taking a premium pre-built theme and redesigning it through its settings, custom CSS and new sections, so it fits your brand and products and converts better than the default. Done well, it looks nothing like the theme it started as.'] },
      { q: 'Can a premium theme look unique?', a: ["Yes, if the work goes into what customers look at most: product cards, navigation, typography and spacing. Most stores on the same theme look alike because they keep the demo's defaults."] },
      { q: 'Can I move from a theme to bespoke later?', a: ["Yes. Many brands start on a theme and move to bespoke once their sales data shows what the theme can't do. The brand decisions, photography and content carry over."] },
      { q: 'How long does Shopify theme customisation take?', a: ['Four to eight weeks, depending on how many templates change and how much custom development the design needs. Client content is the usual holdup, so it helps to start it early.'] },
    ],
  },
  extras: [
    {
      kind: 'text',
      after: 'process',
      id: 'which-theme',
      eyebrow: 'Shopify themes',
      heading: 'Which Shopify theme should you choose?',
      paragraphs: [
        "I work most with Sleek, Prestige and Dawn, and I'll push others when a client is already on one, like Inpulse for Wide Fit Shoes. Sleek suits editorial and luxury brands, and Thameen London runs on it. Prestige suits fashion and lifestyle, and Dawn is a clean base for most product types.",
        'For Thameen I shortlisted two themes and we chose together, because picking the wrong one costs more later than choosing well now.',
      ],
    },
    { kind: 'todo', after: 'process', title: 'Theme customisation innovations', note: "Off for now: none of the 13 innovations come from theme projects. Returns if Wide Fit Shoes passes the innovations test." },
    { kind: 'todo', after: 'faqs', title: 'Articles', note: "Best Shopify themes and Shopify's AI Store Builder: A Designer's Honest Take, once both are published." },
  ],
};
