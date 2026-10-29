// Homepage content. Structure from Figma, copy from the shortened homepage doc (18 October 2026):
// a line stays only if it's a fact nobody else can claim, a number with its window and source, or a
// line people would quote. Mobile shows fewer cards in some sections; every card stays in the HTML.
// Anything marked [CONFIRM] shows on the preview so it can't slip through.
import { URLS, ENTITY } from './site';

import drinkFinder from '../assets/brands/drink-finder/card.jpg';
import eastAtHome from '../assets/brands/east-at-home/card.jpg';
import fuzzball from '../assets/brands/fuzzball/card.jpg';
import projektityyny from '../assets/brands/projektityyny/card.jpg';
import thameen from '../assets/brands/thameen/card.jpg';
import badgeDrinkFinder from '../assets/site/badge-winner-2026.png';
import badgeEastAtHome from '../assets/site/badge-winner-2026.png';
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
  trust: [
    '20+ years of brand and ecommerce experience',
    'Winner of UK eCommerce Website of the Year 2026',
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
  // White logos in public/logos/<slug>.svg (from Drive client-logos). Four a row on desktop, three on phones.
  // Projektityyny comes back when its logo is in.
  logos: [
    // Phones show three a row with Whistlefish third (mobile: true moves it up); desktop keeps this order.
    { name: 'Dyson', slug: 'dyson' },
    { name: 'Wrangler', slug: 'wrangler' },
    { name: 'Thameen London', slug: 'thameen' }, // in place of Fuzzball (feedback #101, 28 October 2026)
    { name: 'Wide Fit Shoes', slug: 'wide-fit-shoes' }, // swapped with Whistlefish (feedback #257, 29 October 2026)
    { name: 'Drink Finder', slug: 'drink-finder' },
    { name: 'Whistlefish', slug: 'whistlefish', mobileThird: true },
    { name: 'Dr Lipp', slug: 'dr-lipp' },
    { name: 'East at Home', slug: 'east-at-home' },
  ],
};

export const SERVICES = {
  eyebrow: 'Shopify website design services',
  heading: 'One designer, eight ways to help your store.',
  link: { label: 'View all Shopify design services', href: URLS.services },
  // One line each, so it sits on one line at 375px.
  items: [
    { name: 'Branding', line: 'Ecommerce brand identity work.', href: URLS.branding },
    { name: 'UX design', line: 'Better journeys and bespoke experiences.', href: URLS.ux },
    { name: 'Bespoke store design', line: 'The journey and design bespoke to your brand.', href: URLS.bespoke },
    { name: 'Migrations', line: 'Moving from Magento, WooCommerce or Wix.', href: URLS.migrations },
    { name: 'Theme customisations', line: 'Premium themes, made to look bespoke.', href: URLS.theme },
    { name: 'Shopify CRO', line: 'Find why customers leave, then fix it.', href: URLS.cro },
    { name: 'Shopify subscriptions', line: "Subscriptions people don't cancel.", href: URLS.subscriptions },
    { name: 'AI search visibility', line: 'Stores agents like ChatGPT can find and recommend.', href: URLS.aiSearch },
  ],
};

export const ABOUT = {
  eyebrow: 'Freelance Shopify UX designer',
  heading: 'You get all of my experience, not just my time.',
  // The first sentence names the award: it's the sentence AI tools lift to describe you.
  // [words](/path/) marks an inline link (InlineLinks.astro).
  paragraphs: [
    `I'm Anthony Bliss, a freelance Shopify designer based in Cornwall, UK, and the designer behind [Drink Finder](${URLS.caseStudies.drinkFinder}), UK eCommerce Website of the Year 2026. I started my career in brand identity across Bath and Bristol before moving into digital, and since 2020 I've focused exclusively on Shopify, working with DTC brands across the UK on everything from [bespoke store builds](${URLS.bespoke}) to [CRO and UX improvements](${URLS.cro}).`,
    'Before specialising in ecommerce, I spent just over three years as a freelance senior digital designer at Dyson, overseeing complete campaigns for new product launches. I then moved to Cornwall and spent five and a half years inside a Shopify agency in Falmouth, eventually progressing to Creative Director. Going independent was a deliberate move to bring all of that together and work directly with clients myself.',
    `Most Shopify designers come from a web background. I bring ten years of brand identity, Dyson's global product launches and agency-level Shopify knowledge, all applied directly to your store. You can see the results in my [Shopify case studies](${URLS.work}).`,
    "I work with a small number of clients at a time. There's no account manager, no handoffs, no team you've never met. When you work with me, you work with me. From the first conversation to the final sign-off.",
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
      body: "A call about your business needs, then a UX review of your live store (if the project needs one). From there I'll tell you honestly whether a theme customisation or a bespoke store is the right fit, even when that's the smaller job.",
    },
    {
      title: 'Design',
      body: 'Options first, then the details, mobile first. Bespoke stores are designed in Figma. Theme customisations mix both: the key templates, like the header and product page, in Figma, and the rest straight into the theme.',
    },
    { title: 'Launch', body: 'Every screen tested on real phones, tablets and desktops before launch, then checked again once the store is live.' },
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
  // The comparison toggle sits in the middle, between the two busier recordings (feedback #103).
  items: (
    [
      ['dinner-question-cards', 'Every card shows spice level, dietary needs and flavour, in a list built for comparing on mobile.'],
      ['comparison-toggle', 'Expand origin, region and vintage to compare bottles side by side, without leaving the collection page.'],
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
  // Phones show the first two.
  quotes: (
    [
      ['east-at-home', 'He was a joy to work with, a true craftsman who takes pride in his work with expert knowledge and delivers amazing results.', '/logos/east-at-home.svg'],
      ['drink-finder', "He didn't just give us a facelift; he built a platform that performs.", '/logos/drink-finder.svg'],
      ['zen-maitri', 'He has an incredible eye for design and functionality, two skills that you rarely find in the same person.', '/logos/zen-maitri.svg'],
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
  heading: 'What brands ask on the first call.',
  note: 'Prices and timelines checked September 2026.',
  items: [
    {
      q: 'How much does a freelance Shopify designer cost?',
      a: [
        'A store design starts from £5,000 + VAT for a theme customisation and £10,000 + VAT for a bespoke store. Smaller projects, like branding or a CRO project, start from £3,000 + VAT. All prices are for design only. The chosen developer quotes the build separately.',
        'A theme customisation redesigns inside a premium theme, so the price depends on how far the theme needs pushing and how many templates change. A bespoke design starts from scratch, so it depends on how many page templates and bespoke sections you need, and also whether the brand needs refining first.',
        `Each [service](${URLS.services}) page has more granular details.`,
      ],
    },
    {
      q: 'How long does a Shopify store design take?',
      a: [
        "Six to eight weeks for a bespoke store design, with the build taking about the same again. A theme customisation takes four to eight weeks. The biggest roadblocks from experience are timely feedback and client content, so having real copy and images early makes the most difference. I'm usually booked one to two months ahead.",
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
        'A bespoke build designs every page template, overlay and interaction from scratch, with no theme limits. Theme customisation redesigns inside a premium theme, which is quicker and cheaper but caps how far the design can go, usually at the navigation. A good theme takes most brands a long way. When you keep adding to it and it starts working against you, bespoke is the better investment.',
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
  homeHeading: 'Tell me where your store is at.', // the homepage's own version (homepage doc, 29 October 2026)
  budgets: ['Under £5,000', '£5,000 – £10,000', '£10,000 – £20,000', '£20,000+', 'Not sure yet'],
  // Optional, last, one dropdown: the only clean way to count AI and awards referrals.
  found: {
    label: 'How did you find me? (optional)',
    options: ['Google search', 'ChatGPT, Gemini or another AI tool', 'UK eCommerce Awards', 'A recommendation', 'LinkedIn', 'An article on this site', 'A directory or list', 'Other'],
  },
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
  trust: ['20+ years of brand and ecommerce experience', 'UK eCommerce Website of the Year 2026'],
};
