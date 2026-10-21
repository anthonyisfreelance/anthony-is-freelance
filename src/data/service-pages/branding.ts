// Branding. Copy: page-copy/service-pages.md, Page 8. Keeps /freelance-brand-designer/.
import { URLS } from '../site';
import type { ServicePage } from './types';
import { hubPrice, ROUTING_EYEBROW, PRICE_NOTE, PROCESS_INTRO, QUOTE } from './shared';

export const BRANDING: ServicePage = {
  meta: {
    title: 'Freelance Brand Designer for Shopify | Anthony is Freelance',
    description:
      'Brand design for Shopify brands, from a refined logo, palette and typeface to a full identity, designed alongside the store it lives in. Since 2002.',
    path: URLS.branding,
    name: 'Branding',
    serviceType: 'Ecommerce brand identity',
  },
  hero: {
    eyebrow: 'Brand design for Shopify brands',
    heading: 'Make the brand as good as the product.',
    intro:
      "I'm a brand designer first. I spent my first decade in brand identity at agencies in Bath and Bristol before moving into Shopify, so I can refine your brand and design the store it lives in. Most of my branding work refines rather than replaces: logo, palette, typeface and how the brand behaves on screen. Branding is quoted on scope, from a refinement to a full identity. [CONFIRM] For Drink Finder, a merchant trading for over 65 years, I refined the logo, palette and typeface alongside the new store.",
    cta: { label: 'Start a brand project', href: '#start-a-project' },
    caption: 'Window Fleur. The rebrand carried across the store.',
  },
  trust: ['Brand design since 2002', 'Designed with the store', 'UK eCommerce Website of the Year 2026'],
  included: {
    heading: 'What brand design includes',
    items: [
      'A logo refinement, or a new identity where one is needed',
      'A colour palette with meaning, not just a set of swatches',
      'Typefaces chosen for the brand and tested at product-card size',
      'Flexible guidelines that help your team make new things, rather than rules that stop them',
      "The brand carried into the store's design system: buttons, cards, photography direction [CONFIRM tone of voice]",
    ],
  },
  fit: {
    heading: 'Right for you if',
    items: [
      'You got the product out with a basic brand, and now the brand needs to catch up.',
      "You're redesigning the store and want the brand refined at the same time.",
      'Your brand looks different on the site, in social posts and on the packaging.',
    ],
  },
  routing: {
    eyebrow: ROUTING_EYEBROW,
    heading: "When brand design isn't the right call",
    routes: [
      { situation: "You're happy with your identity.", body: 'Then keep it. Most of my projects refine rather than replace, and the store design brings the brand through anyway.', links: [{ label: 'Theme customisations', href: URLS.theme }, { label: 'Bespoke store design', href: URLS.bespoke }] },
      { situation: 'You need naming, strategy and a full rebrand.', body: "That's a job for a brand agency with a strategy team. I'll say so on the call. [CONFIRM]", links: [] },
      { situation: "The brand is fine, the store isn't.", body: 'Put the budget into the store.', links: [{ label: 'Bespoke store design', href: URLS.bespoke }] },
      { situation: "Customers like the brand, but can't find things.", body: "That isn't a brand problem. It starts with the navigation.", links: [{ label: 'Shopify UX design', href: URLS.ux }] },
    ],
  },
  process: {
    eyebrow: 'Shopify brand design process',
    heading: 'How a project runs',
    intro: PROCESS_INTRO,
    steps: [
      { title: 'Understand', body: 'A call, a fixed-price proposal, and a look at the brand as it stands, online and off.' },
      { title: 'Design', body: 'Logo, palette, typeface and how the brand behaves on screen, refined with weekly calls and two rounds of feedback.' },
      { title: 'Launch', body: 'The refined brand goes straight into the store design, so it works on screen from day one.' },
      { title: 'Measure and improve', body: 'Once the store is live, I check conversion rate and average order value at one, three and seven days.' },
    ],
  },
  innovations: {
    eyebrow: 'Brand design innovations',
    heading: 'Where the brand meets the interface.',
    intro: 'A brand earns its keep in the small moments: an icon, a loading bar, a logo at phone size.',
    items: [
      { client: 'Fuzzball', title: 'A progress bar with character', body: "The brand's cat chases a ball along the quiz progress bar, so finishing the quiz feels fun." },
    ],
  },
  price: {
    eyebrow: 'Branding price',
    heading: 'How much does brand design for a Shopify brand cost?',
    notes: [PRICE_NOTE],
    cta: QUOTE,
    caption: 'Branding at a glance',
    rows: [
      ['Starting price', `${hubPrice('Branding')} [CONFIRM]`],
      ['Design time', '[CONFIRM]'],
      ['Build time', 'No build for the brand itself. It carries into your store design'],
      ['What you get', "Logo, palette, typefaces and flexible guidelines, carried into the store's design system"],
      ['Who builds it', 'On a store project, a developer I introduce, or your own team or agency, quoted separately'],
    ],
  },
  extras: [
    {
      kind: 'text',
      after: 'trust',
      id: 'why-together',
      eyebrow: 'Brand and store together',
      heading: 'Why brand and store work better designed together',
      paragraphs: [
        "A brand that's never been tested on a product card falls apart the moment it meets one. Designing both together means the brand is built for the places customers actually see it: product cards, buttons, navigation and the add-to-basket moment.",
        'Ecommerce also taught me restraint. Sometimes the brand comes through in a tone of voice or one small design touch, not in more decoration.',
      ],
    },
    {
      // Logos from Drive services/branding, made white for the dark page. Four then three on desktop, two a row on phones.
      kind: 'logos',
      after: 'included',
      id: 'identity-work',
      eyebrow: 'Brand identity',
      heading: 'Identity work',
      logos: [
        { name: 'Norton Radstock College', src: '/logos/identity/norton-radstock-college.svg' },
        { name: 'Electronic Sound Magazine', src: '/logos/identity/electronic-sound.svg' },
        { name: 'Chop Chop', src: '/logos/identity/chop-chop.svg' },
        { name: 'Milsom Place', src: '/logos/identity/milsom-place.svg' },
        { name: 'Spicy Guru', src: '/logos/identity/spicy-guru.svg' },
        { name: 'Drink Finder', src: '/logos/identity/drink-finder.svg' },
        { name: 'Seatool', src: '/logos/identity/seatool.svg' },
      ],
    },
    { kind: 'todo', after: 'innovations', title: 'Testimonial', note: 'A verbatim quote from Jon Wigmore about the Drink Finder brand refinement, with permission, plus a heading line from it.' },
    { kind: 'todo', after: 'price', title: 'Questions and articles', note: 'No FAQ block and no branding articles yet, by design. Add when questions come up on calls.' },
  ],
};
