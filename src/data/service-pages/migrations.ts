// Migrations. Copy: page-copy/service-pages.md, Page 3.
import { URLS } from '../site';
import type { ServicePage } from './types';
import { serviceHero } from '../service-heroes';
import { card, hubPrice, ROUTING_EYEBROW, PRICE_NOTE, QUOTE } from './shared';

export const MIGRATIONS: ServicePage = {
  meta: {
    title: 'Shopify Migration Services UK | Anthony is Freelance',
    description:
      'Moving to Shopify from Magento, WooCommerce, BigCommerce or Wix? I design the new store on the way, so the move fixes what held you back. Prices inside.',
    path: URLS.migrations,
    name: 'Migrations',
    serviceType: 'Shopify migration design',
  },
  hero: {
    eyebrow: 'Shopify migration',
    heading: 'Move to Shopify, and fix what held you back.',
    intro:
      "A Shopify migration moves your store from another platform, such as Magento, WooCommerce, BigCommerce or Wix, onto Shopify. I design the new store, so the move fixes what the old platform held back instead of copying it across. A migration is priced and timed as a theme customisation or a bespoke design, depending on which the new store needs. Drink Finder's move lifted website sales 34%, September to February against the year before, and the store won UK eCommerce Website of the Year 2026.",
    cta: { label: 'Start a migration project', href: '#start-a-project' },
    ...serviceHero(URLS.migrations),
    caption: 'Drink Finder. The desktop journey after the move to Shopify.',
  },
  trust: ['UK eCommerce Website of the Year 2026', 'Your old store trades until launch', 'Priced as a theme or bespoke project'],
  included: {
    heading: 'What a Shopify migration includes',
    items: [
      'A UX review of your current store, so the move keeps what already works.',
      'A new navigation and collection structure, planned with the redirect map in mind.',
      'The new store designed, as a theme customisation or a bespoke design.',
      'A brief for the developer covering data, apps and integrations.',
      'QA of the new store before the switch, and checks after it.',
    ],
  },
  fit: {
    heading: 'Who a Shopify migration is right for',
    items: [
      'Your platform is holding back the checkout, the speed or the day-to-day running of the store.',
      'Your team spends more time fighting the platform than running the shop.',
      'You want the move to improve the store, not just relocate it.',
    ],
  },
  proof: {
    heading: "Shopify migrations I've designed",
    link: { label: 'View all migration work', href: `${URLS.work}#migrations` },
    cards: [card('Drink Finder'), card('East West Apparel')],
  },
  routing: {
    eyebrow: ROUTING_EYEBROW,
    heading: "When a Shopify migration isn't the right call",
    intro: 'Not every move to Shopify needs a designer, and not every problem needs a move.',
    routes: [
      { situation: 'You want a like-for-like copy.', body: "If nothing about the store needs to change, you need a developer, not a designer. I'm happy to point you to one.", links: [] },
      { situation: "You're already on Shopify, on an old theme.", body: "That isn't a migration. Moving to a current premium theme is quicker and cheaper.", links: [{ label: 'Theme customisations', href: URLS.theme }] },
      // TO DO (30 October 2026): hidden until the Shopify Plus page is live. Uncomment to bring it back.
      // { situation: "You're moving because of volume.", body: "If you're outgrowing Shopify's standard plans, check whether you need Plus before designing for it.", links: [{ label: 'Shopify Plus design', href: URLS.plus }] },
      { situation: 'Your old store already converts well.', body: 'Keep what works. A UX review first shows which journeys the new store must protect.', links: [{ label: 'Shopify UX design', href: URLS.ux }] },
      { situation: "The platform isn't the problem. The numbers are.", body: "If the store runs fine and just doesn't sell enough, moving it won't fix that. Find the steps that lose sales and fix those first.", links: [{ label: 'Shopify CRO', href: URLS.cro }] },
    ],
  },
  process: {
    eyebrow: 'Shopify migration process',
    heading: 'How the move runs',
    intro:
      'Every migration project starts with a UX review of your live store. I go through your GA4 data first to see who shops and where they drop off, then map the entire purchase journey on a Miro board, screen by screen. Throughout, I ask one question: would I buy this product?',
    steps: [
      { title: 'Understand', body: 'A call, a tailored quote, and a UX review of the old store: what sells and what the platform stops.' },
      { title: 'Design', body: 'New navigation, collections and a redirect map for every old URL, then the store designed with weekly calls.' },
      { title: 'Launch', body: 'The developer builds and moves your data while the old store keeps trading. Redirects tested before the switch.' },
      { title: 'Measure and improve', body: 'Conversion compared with the old store at one, three and seven days, then ongoing if you want it.' },
    ],
  },
  innovations: {
    eyebrow: 'Shopify migration innovations',
    heading: 'Fixing what the old platform got wrong.',
    intro: 'A migration is the moment to fix what customers hated about the old store. The UX review finds it before any design starts.',
    items: [
      { client: 'Drink Finder', title: 'An offers button instead of sticky pop-ups', body: 'Offers moved into a navigation button, so sign-up prompts no longer block checkout.' },
      { client: 'Drink Finder', title: 'Compare bottles without opening each one', body: "On the old store, search let customers down and comparing meant opening product page after product page. A comparison toggle on the collection page puts origin, region and vintage side by side, so customers now find bottles they'd never have clicked into." },
      { client: 'East West Apparel', title: "Modern UX that kept the brand's soul", body: "The old store was a dated custom design that ignored UX best practice. The new one keeps the shop's raw, independent character, with product cards that show sizes up front." },
    ],
  },
  testimonial: {
    heading: 'East West Apparel on their move to Shopify. Moved, and selling more.',
    quote:
      'Ant was great to work with, personable, very professional, accommodating, punctual, creative and intune. I am very pleased with the outcome of our website and the increase in sales because of it. I highly recommend working with him and intend to do so when the time is right again.',
    cite: 'Jamie Lee, Owner, East West Apparel',
  },
  price: {
    eyebrow: 'Shopify migration price',
    heading: 'How much does moving to Shopify cost?',
    notes: [PRICE_NOTE],
    cta: QUOTE,
    caption: 'Migrations at a glance',
    rows: [
      ['Starting price', hubPrice('Migrations')],
      ['Design time', 'As a theme customisation, six to ten weeks, build included, or as a bespoke design, six to eight weeks, design only'],
      ['Build time', 'As a bespoke design, about the same again. Big catalogues and long order histories add developer time'],
      ['What you get', 'The new store, designed as a theme customisation or a bespoke design, with a new navigation and collection structure'],
      ['Who builds it', 'A developer I introduce, or your own team or agency, quoted separately, including the data move and redirects'],
    ],
  },
  faqs: {
    eyebrow: 'Shopify migration FAQs',
    heading: 'Before you get in touch.',
    items: [
      { q: 'Will I lose my Google rankings when I move to Shopify?', a: ['Not if the redirects are done properly. Shopify uses its own URL formats, such as /products/ and /collections/, so every old URL needs a 301 redirect to its new home. I plan the new structure with that map in mind, the developer sets the redirects up, and an SEO specialist can check it where organic traffic matters. Expect some movement for a few weeks after launch.'] },
      { q: 'What is a Shopify migration?', a: ["A Shopify migration moves your store, products, customers and order history from another ecommerce platform onto Shopify. It's also the best moment to redesign, because the templates are being rebuilt anyway."] },
      { q: 'Should I redesign when I migrate, or move first?', a: ['Redesign on the way. Moving like-for-like and redesigning later means two launches, two rounds of risk to your rankings, and paying twice for the same templates.'] },
      { q: 'Will my store go offline during the move?', a: ['No. Your current store keeps trading until the new one is ready, and the switch happens on launch day when your domain is pointed at Shopify.'] },
    ],
  },
  extras: [
    {
      kind: 'table',
      after: 'included',
      id: 'who-does-what',
      heading: 'Who does what in a Shopify migration',
      caption: 'Who does what in a Shopify migration',
      head: ['Task', 'Who'],
      rows: [
        ['UX review and new store design', 'Me'],
        ['Navigation, collections and URL structure', 'Me, with the developer'],
        ['Products, customers and order history moved across', 'The developer'],
        ['301 redirects from every old URL', 'The developer, from a map we agree'],
        ['Apps, integrations and stock systems', 'The developer'],
        ['SEO checks before and after launch', 'An SEO specialist I can introduce, where the site relies on organic traffic'],
        ['QA before launch', 'Me and the developer'],
      ],
    },
    {
      kind: 'table',
      after: 'process',
      id: 'platforms',
      heading: "Platforms I've designed migrations from",
      caption: "Platforms I've designed migrations from",
      head: ['From', 'Client', 'What changed'],
      rows: [
        ['Legacy platform, with Sparkstone stock', 'Drink Finder', "A calmer store for thousands of products, and Shopify's checkout"],
        ['WooCommerce', 'East West Apparel', 'Product cards that show sizes up front, and a design system with its own character'],
        ['Headless', 'Thameen London', 'Shopify 2.0 on a premium theme that the client now runs themselves easily'],
      ],
    },
    { kind: 'todo', after: 'faqs', title: 'Articles', note: 'Off until a second migration article is published. Shopify Pricing 2026 can be linked inline from the price section meanwhile.' },
  ],
  cta: { eyebrow: 'Start your Shopify migration', heading: "Tell me where you're moving from." },
};
