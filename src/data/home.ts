// Homepage content. Structure from Figma, copy from the shortened homepage doc (18 October 2026):
// a line stays only if it's a fact nobody else can claim, a number with its window and source, or a
// line people would quote. Mobile shows fewer cards in some sections; every card stays in the HTML.
// Anything marked [CONFIRM] shows on the preview so it can't slip through.
import { URLS, ENTITY } from './site';

import drinkFinder from '../assets/brands/drink-finder/card.jpg';
import eastAtHome from '../assets/brands/east-at-home/card.jpg';
import fuzzball from '../assets/brands/fuzzball/card.jpg';
import projektityyny from '../assets/brands/projektityyny/card.jpg';
import thameen from '../assets/brands/thameen/bottles.jpg';
import badgeDrinkFinder from '../assets/brands/drink-finder/badge-award.png';
import badgeEastAtHome from '../assets/brands/east-at-home/badge-award.png';
import { INNOVATIONS_LIST } from './innovations';
import { testimonial, creditLine } from './testimonials';

export const META = {
  title: 'Shopify Designer UK | Shopify Expert for DTC Brands',
  description:
    "I'm Anthony Bliss, a freelance Shopify UX designer in Cornwall. Winner of UK eCommerce Website of the Year 2026. Bespoke stores for DTC brands.",
};

export const HERO = {
  eyebrow: 'Freelance Shopify designer',
  lines: ['Beautifully designed.', 'Built to convert.'],
  intro:
    "I'm Anthony Bliss, a freelance Shopify designer in Falmouth, Cornwall, designing Shopify and Shopify Plus stores for UK DTC brands.",
  ctas: [
    { label: 'Start a project', href: URLS.contact },
    { label: 'View my success stories', href: URLS.work },
  ],
  rating: '5.0 from 6 Google reviews',
  trust: [
    '20+ years of brand and ecommerce experience',
    'UK eCommerce Website of the Year 2026',
    '13 Shopify launches since 2023',
  ],
};

export const STORIES = {
  eyebrow: 'Shopify expert UK',
  heading: 'Good design gets noticed. Great design gets results.',
  link: { label: 'View all Shopify success stories', href: URLS.work },
  featured: {
    client: 'Drink Finder',
    meta: 'Food & drink · August 2025',
    claim: '34% more website sales after moving to Shopify',
    image: drinkFinder,
    badge: badgeDrinkFinder,
    badgeAlt: 'Winner, UK eCommerce Awards 2026',
    href: URLS.caseStudies.drinkFinder,
  },
  // Desktop shows the first three under the featured story; the last shows on phones only.
  cards: [
    {
      client: 'East at Home',
      meta: 'Food & drink · October 2025',
      claim: '82% more revenue after a mobile-first redesign',
      image: eastAtHome,
      badge: badgeEastAtHome,
      badgeAlt: 'Winner, UK eCommerce Awards 2026',
      href: URLS.caseStudies.eastAtHome,
    },
    {
      client: 'Fuzzball',
      meta: 'Pets · August 2025',
      claim: '63% higher conversion rate after a subscription redesign',
      image: fuzzball,
      href: '/portfolio/fuzzball-shopify-website-design-case-study/',
    },
    {
      client: 'Projektityyny',
      meta: 'Home · June 2026',
      claim: 'A mobile-first store launch for a Nordic-inspired textiles brand',
      image: projektityyny,
      href: '/portfolio/projektityyny-shopify-website-design-case-study/',
    },
    {
      client: 'Thameen London',
      meta: 'Beauty · March 2026',
      claim: 'Off headless, onto a premium theme the team runs themselves',
      image: thameen,
      href: '/portfolio/thameen-london-shopify-website-design-case-study/',
      mobileOnly: true,
    },
  ],
};

export const BRANDS = {
  eyebrow: 'Shopify designer Cornwall, UK',
  heading: 'Brands that trust me',
  // [DRAFT] reword in your voice, and [CONFIRM] all four are cleared to name.
  line: "I've designed for Dyson, Wrangler, Drink Finder and East at Home, with no set style and no favoured sector.",
  // White logos in public/logos/<slug>.svg (from Drive client-logos). Four a row, two rows, at every size.
  // Thameen London and Projektityyny come back when their logos are in.
  logos: [
    { name: 'Dyson', slug: 'dyson' },
    { name: 'Wrangler', slug: 'wrangler' },
    { name: 'Drink Finder', slug: 'drink-finder' },
    { name: 'East at Home', slug: 'east-at-home' },
    { name: 'Fuzzball', slug: 'fuzzball' },
    { name: 'Wide Fit Shoes', slug: 'wide-fit-shoes' },
    { name: 'Dr Lipp', slug: 'dr-lipp' },
    { name: 'Whistlefish', slug: 'whistlefish' },
  ],
};

export const SERVICES = {
  eyebrow: 'Shopify website design services',
  heading: 'One designer, nine ways to help your store.',
  link: { label: 'View all Shopify design services', href: URLS.services },
  // One line each, so it sits on one line at 375px.
  items: [
    { name: 'Branding', line: 'Identity for new and relaunched brands.', href: URLS.branding },
    { name: 'UX design', line: 'Research, flows and wireframes first.', href: URLS.ux },
    { name: 'Bespoke store design', line: 'Every template designed from scratch.', href: URLS.bespoke },
    { name: 'Shopify Plus design', line: 'Stores for high-volume brands.', href: URLS.plus },
    { name: 'Migrations', line: 'Moving from Magento, WooCommerce or Wix.', href: URLS.migrations },
    { name: 'Theme customisations', line: 'Premium themes, made to look bespoke.', href: URLS.theme },
    { name: 'Shopify CRO', line: 'Find why customers leave, then fix it.', href: URLS.cro },
    { name: 'Shopify subscriptions', line: "Subscriptions people don't cancel.", href: URLS.subscriptions },
    { name: 'AI search visibility', line: 'Stores ChatGPT can find and recommend.', href: URLS.aiSearch },
  ],
};

export const ABOUT = {
  eyebrow: 'Freelance Shopify UX designer',
  heading: 'All of my experience, not just my time.',
  // The first sentence names the award: it's the sentence AI tools lift to describe you.
  // "Drink Finder" links to its case study.
  lead: {
    before: "I'm Anthony Bliss, a freelance Shopify designer based in Cornwall, UK, and the designer behind ",
    link: { label: 'Drink Finder', href: URLS.caseStudies.drinkFinder },
    after:
      ", UK eCommerce Website of the Year 2026. I started my career in brand identity across Bath and Bristol before moving into digital, and since 2020 I've focused exclusively on Shopify, working with DTC brands across the UK on everything from bespoke store builds to CRO and UX improvements.",
  },
  paragraphs: [
    'Before specialising in ecommerce, I spent three and a half years as a senior freelance designer at Dyson, overseeing complete campaigns for new product launches. I then moved to Cornwall and spent five and a half years inside a leading Shopify agency, eventually progressing to Creative Director.',
  ],
  link: { label: 'More about how I work', href: URLS.about },
  imageAlt: 'Anthony Bliss, freelance Shopify designer, Falmouth, Cornwall',
};

export const PROCESS = {
  eyebrow: 'Shopify design process',
  heading: 'Each project starts with finding the problem.',
  link: { label: 'See how each service works', href: URLS.services },
  steps: [
    {
      title: 'Understand',
      // [CONFIRM] wording.
      body: "A call about your business, then a UX review of your live store where the project needs one. From there I'll tell you honestly whether a theme customisation or a bespoke store is the right fit, even when that's the smaller job.",
    },
    {
      title: 'Design',
      body: 'Options first, then the details, mobile first. Bespoke stores are designed in Figma. Theme customisations are designed straight into the theme.',
    },
    { title: 'Launch', body: 'Every screen checked on real devices before it goes live, with one question: would I buy this?' },
    {
      title: 'Measure and improve',
      body: 'I check conversion rate and average order value at one, three and seven days, then keep improving if you want to.',
    },
  ],
};

export const INNOVATIONS = {
  eyebrow: 'Shopify UX design wins',
  heading: 'The small details that make the difference',
  link: { label: 'See all Shopify innovations', href: URLS.innovations },
  // From the innovation records, each with its own line. Phones show the first two.
  items: (
    [
      ['comparison-toggle', 'Expand origin, region and vintage to compare bottles side by side, without leaving the listing.'],
      ['dinner-question-cards', 'Every card shows spice level, dietary needs and flavour, in a list built for comparing on mobile.'],
      ['image-first-product-cards', 'Product names truncated on purpose, because nobody buys a greeting card for its name.'],
    ] as const
  ).map(([slug, body]) => {
    const it = INNOVATIONS_LIST.find((i) => i.slug === slug)!;
    return { client: it.client, title: it.name, body, href: `${URLS.innovations}#${slug}`, image: it.poster, video: it.video, alt: it.alt, anchor: it.anchor };
  }),
};

export const RESULTS = {
  eyebrow: 'Shopify success stories',
  heading: 'Good design shows up in the numbers',
  items: [
    {
      number: '82%',
      label: 'East at Home revenue growth',
      caption: 'October to June vs the year before · Google Analytics, UK sessions',
    },
    {
      number: '63%',
      label: 'Fuzzball conversion rate growth',
      caption: 'August 2025 to August 2026 vs the year before · Google Analytics',
    },
    {
      number: '32%',
      label: 'More Drink Finder customers',
      caption: 'September to February vs the year before · EPoS till data, marketplaces excluded',
    },
    {
      number: '2×',
      label: 'Winner, UK eCommerce Awards 2026',
      caption: 'UK eCommerce Website of the Year and UK User Experience of the Year',
    },
  ],
};

export const TESTIMONIALS = {
  eyebrow: 'Shopify designer UK',
  heading: 'What clients say about working with me.',
  links: [
    { label: 'Read all client testimonials', href: URLS.testimonials },
    { label: 'Read my Google reviews', href: ENTITY.googleReviews, external: true },
  ],
  // Excerpts copied word for word from the testimonials record, each linking to its full quote.
  // Phones show the first two. Logo to come for Zen Maitri.
  quotes: (
    [
      ['east-at-home', 'He was a joy to work with, a true craftsman who takes pride in his work with expert knowledge and delivers amazing results.', '/logos/east-at-home.svg'],
      ['drink-finder', "He didn't just give us a facelift; he built a platform that performs.", '/logos/drink-finder.svg'],
      ['zen-maitri', 'He has an incredible eye for design and functionality, two skills that you rarely find in the same person.', null],
    ] as const
  ).map(([id, quote, logo]) => ({ quote, cite: creditLine(testimonial(id)), logo, href: `${URLS.testimonials}#${id}` })),
};

export const ARTICLES = {
  eyebrow: 'Shopify design articles',
  heading: 'Findings from the stores I design',
  link: { label: 'View all articles', href: URLS.articles },
  // The four newest articles render from src/data/articles.ts.
};

export const FAQS = {
  eyebrow: 'Shopify web designer FAQs',
  heading: 'Before you get in touch',
  note: 'Prices and timelines checked September 2026.',
  items: [
    {
      q: 'How much does a freelance Shopify designer cost?',
      a: [
        'My projects start from £5,000 + VAT for a theme customisation and £10,000 + VAT for a bespoke store design. Both prices are for design only; the developer quotes the build separately.',
        'A theme customisation redesigns inside a premium theme, so the price depends on how far the theme needs pushing and how many templates change. A bespoke design starts from scratch, so it depends on how many templates and variants you need, and whether the brand needs refining first. Every project is quoted at a fixed price before it starts, and each service page has the detail.',
      ],
    },
    {
      q: 'How long does a Shopify store design take?',
      a: [
        "Six to eight weeks for a bespoke store design, with the build taking about the same again. A theme customisation takes four to eight weeks. The biggest variable is content, so having real copy and images early makes the most difference. I'm usually booked one to two months ahead.",
      ],
    },
    {
      q: 'Do you build the store as well as design it?',
      a: [
        "No. I'm a Shopify web designer, not a developer, which keeps my full attention on the design. The build is done by your own developer or agency, or by one of the Shopify developers I've worked with for years. You pay the developer directly, so you always know who's doing what. I stay involved through the build and check every screen before launch.",
      ],
    },
    {
      q: 'Should I hire a freelance Shopify designer or an agency?',
      a: [
        'Hire a freelancer when you want the senior person doing the work, not overseeing it. Agencies suit large programmes with several workstreams running at once, and I often work alongside them as their design partner. The fair worry with a freelancer is dealing with two people instead of one. I introduce the right developer, hand over a design system that leaves no guesswork, and stay involved until launch.',
      ],
    },
    {
      q: "What's it like working with you?",
      a: [
        'Personal and collaborative. You deal with me from the first call to the final sign-off, with a weekly call and feedback left straight in Figma. I don\'t hand over a finished design and say "there\'s your website". I show options, we talk them through, and we get there together. Jon Wigmore at Drink Finder called it "incredibly personal and productive".',
      ],
    },
    {
      q: "What's the difference between a bespoke build and theme customisation?",
      a: [
        'A bespoke build designs every template from scratch, with no theme limits. Theme customisation redesigns inside a premium theme, which is quicker and cheaper but caps how far the design can go, usually at the navigation. A good theme takes most brands a long way. When you keep adding to it and it starts working against you, bespoke is the better investment.',
      ],
    },
    {
      q: 'Do I still need a Shopify designer now there\'s AI?',
      a: [
        "If you're launching your first store, probably not yet. Shopify's AI store builder and a good theme will get you selling. A designer is worth it once the store has to fit a real brand and real customers, and the numbers show where it falls short. That's when brands usually come to me.",
      ],
      checked: 'Checked October 2026.',
    },
  ],
};

export const CONTACT = {
  eyebrow: 'Start a Shopify project',
  heading: 'Tell me where your store is now.',
  budgets: ['Under £5,000', '£5,000 – £10,000', '£10,000 – £20,000', '£20,000+', 'Not sure yet'],
  reply: 'I reply within two working days.',
  legal: 'Anthony Bliss · Falmouth, Cornwall · Anthonyis Limited, company number 10575474',
};

// The Start a project overlay (Figma "Overlay" 47742:10966 desktop, "Form" 48163:16962 mobile).
// Desktop has its own heading; phones reuse the eyebrow and heading above.
export const PROJECT_DIALOG = {
  heading: 'Start a project',
  aside: {
    heading: 'What clients say about working with me.',
    quote: 'He was a joy to work with, a true craftsman who takes pride in his work with expert knowledge and delivers amazing results.',
    cite: creditLine(testimonial('east-at-home')),
  },
  trust: ['20+ years ecommerce and brand experience', 'UK eCommerce Website of the Year 2026'],
};
