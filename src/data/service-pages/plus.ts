// Shopify Plus design. Copy: page-copy/service-pages.md, Page 4. New page.
import { URLS } from '../site';
import type { ServicePage } from './types';
import { card, hubPrice, ROUTING_EYEBROW, PRICE_NOTE, PROCESS_INTRO, TRUST_COMMON, QUOTE } from './shared';

export const PLUS: ServicePage = {
  meta: {
    title: 'Shopify Plus Website Design UK | Anthony is Freelance',
    description:
      'Shopify Plus website design for brands on Plus or moving to it. Checkout, markets and wholesale designed around your customers, priced as a bespoke design.',
    path: URLS.plus,
    name: 'Shopify Plus design',
    serviceType: 'Shopify Plus website design',
  },
  hero: {
    eyebrow: 'Shopify Plus website design',
    heading: 'Design for when the stakes go up.',
    intro:
      "Shopify Plus design is store design for brands on Shopify's enterprise plan, where more traffic, a customisable checkout, wholesale and more than one market raise the stakes. I design Plus stores as bespoke projects, often alongside an in-house team or agency. Shopify Plus design is priced as a bespoke design, from £10,000 + VAT, design only. [CONFIRM] Jing Tea runs on a Plus store I designed.",
    cta: { label: 'Start a Plus project', href: '#start-a-project' },
    caption: 'Jing Tea. The collection page on Shopify Plus.',
  },
  trust: ['Works with your team or agency', 'Priced as bespoke', ...TRUST_COMMON.slice(0, 1)],
  included: {
    heading: 'What changes when you design for Shopify Plus',
    items: [
      'The checkout. Plus opens up more of Shopify’s checkout, so trust signals and delivery information can be designed into it, not bolted on after.',
      'Wholesale. Trade customers can see their own prices and order forms, so retail and wholesale journeys are designed side by side.',
      'More than one market. Currency, language and delivery by country, planned into the navigation and product pages from the start.',
      'More people building pages. A tight design system matters more when several people add content, so it stays on brand a year after launch.',
    ],
  },
  fit: {
    heading: 'Right for you if',
    items: [
      "You're already on Plus, or your developer has recommended moving.",
      'You sell to trade customers or in more than one country.',
      'Several people build pages, and consistency is slipping.',
    ],
  },
  proof: {
    heading: "Shopify Plus stores I've designed",
    link: { label: 'View all Shopify success stories', href: URLS.work },
    cards: [card('Jing Tea')],
  },
  routing: {
    eyebrow: ROUTING_EYEBROW,
    heading: "When Shopify Plus design isn't the right call",
    intro: "Most DTC brands don't need Plus. Here's when I'd send you elsewhere.",
    routes: [
      { situation: "You're not sure you need Plus.", body: "Usually you don't, until volume, wholesale or several markets make its features pay for themselves. My Shopify vs Shopify Plus article covers where the line sits. Standard Shopify with a bespoke design covers most brands.", links: [{ label: 'Bespoke store design', href: URLS.bespoke }] },
      { situation: 'Your Plus store is fine, but conversion has stalled.', body: "You don't need a new store. You need the leaking steps found and fixed.", links: [{ label: 'Shopify CRO', href: URLS.cro }] },
      { situation: 'You need the checkout or integrations built.', body: "That's work for your developer or agency. I design what they build and QA it, but I don't write the code.", links: [] },
    ],
  },
  process: {
    eyebrow: 'Shopify Plus design process',
    heading: 'How a project runs',
    intro: PROCESS_INTRO,
    steps: [
      { title: 'Understand', body: 'A call, a fixed-price proposal and, where it helps, a UX review, often alongside your in-house team or agency.' },
      { title: 'Design', body: 'Designed as a bespoke project, with a weekly call and two rounds of feedback in Figma.' },
      { title: 'Launch', body: 'Your team, your agency or the developer I introduce builds it, and I check every screen before launch.' },
      { title: 'Measure and improve', body: 'I check conversion rate and average order value at one, three and seven days after launch.' },
    ],
  },
  price: {
    eyebrow: 'Shopify Plus design price',
    heading: 'How much does Shopify Plus website design cost?',
    notes: [PRICE_NOTE, 'Plus stores usually have more templates, markets and customer types to design for. Shopify charges for the Plus plan itself.'],
    cta: QUOTE,
    caption: 'Shopify Plus design at a glance',
    rows: [
      ['Starting price', `${hubPrice('Shopify Plus design')} [CONFIRM]`],
      ['Design time', 'Six to eight weeks, as a bespoke design'],
      ['Build time', 'About the same again'],
      ['What you get', 'The full Figma file: design system, every template and a clickable prototype'],
      ['Who builds it', 'A developer I introduce, or your own team or agency, quoted separately'],
    ],
  },
  faqs: {
    eyebrow: 'Before you get in touch',
    heading: 'Shopify Plus design questions',
    items: [
      { q: 'Do I need Shopify Plus?', a: ["Usually not until volume, wholesale or selling in several countries makes Plus's features pay for themselves. Standard Shopify runs most DTC brands well. My Shopify vs Shopify Plus article explains where the line sits."] },
      { q: 'Can you work with our in-house developers or agency?', a: ['Yes. On Plus projects I often work alongside an in-house team or agency as design lead. I hand over a Figma design system they build from, and QA what they build.'] },
      { q: 'Can you design the Shopify checkout?', a: ["On Plus, yes, within what Shopify allows. The checkout stays Shopify's own, so the work is in the details: trust signals, delivery information and branding in the places Shopify opens up. On other plans you can change the branding, but far less else."] },
    ],
  },
  extras: [
    { kind: 'todo', after: 'proof', title: 'More Plus proof', note: 'Big Dude Clothing joins once its case study is cleared to name. Gee Hair once it launches. The Plus filter on the work page appears with a second Plus project.' },
    { kind: 'todo', after: 'process', title: 'Shopify Plus innovations', note: 'Off for now: none of the 13 innovations come from Plus projects yet. Returns when Big Dude Clothing or Gee Hair adds one.' },
    { kind: 'todo', after: 'process', title: 'Testimonial', note: 'A verbatim quote from Big Dude Clothing or Jing Tea, with name, role and permission, plus a heading line from it.' },
    { kind: 'todo', after: 'faqs', title: 'Articles', note: 'Shopify vs Shopify Plus, and Benefits of Shopify Plus: Should You Upgrade in 2026? Need their links.' },
  ],
};
