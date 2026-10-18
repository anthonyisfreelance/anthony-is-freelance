// Homepage content. Structure from Figma, gaps filled from page-copy/homepage.md.
// Anything marked [CONFIRM] shows on the preview so it can't slip through.
import { URLS, ENTITY } from './site';

import drinkFinder from '../assets/home/drink-finder.jpg';
import eastAtHome from '../assets/home/east-at-home.jpg';
import wideFitShoes from '../assets/home/wide-fit-shoes.jpg';
import badgeDrinkFinder from '../assets/home/badge-drink-finder.png';
import badgeEastAtHome from '../assets/home/badge-east-at-home.png';
import innovationScreen from '../assets/home/innovation-screen.png';

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
    '20+ years of brand and ecommerce design',
    'UK eCommerce Website of the Year 2026',
    '13 Shopify launches since 2023',
  ],
};

export const STORIES = {
  eyebrow: 'Shopify expert UK',
  heading: 'Good design gets noticed. Great design gets results.',
  intro:
    "These are stores I've designed since going independent in 2023 for growing brands on Shopify or Shopify Plus.",
  link: { label: 'View client success stories', href: URLS.work },
  featured: {
    client: 'Drink Finder',
    meta: 'Food & drink · 2025',
    claim: '34% more website sales after moving to Shopify',
    image: drinkFinder,
    badge: badgeDrinkFinder,
    badgeAlt: 'Winner, UK eCommerce Awards 2026',
    href: URLS.caseStudies.drinkFinder,
  },
  cards: [
    {
      client: 'East at Home',
      meta: 'Food & drink · 2025',
      claim: '82% more revenue after a mobile-first redesign',
      image: eastAtHome,
      badge: badgeEastAtHome,
      badgeAlt: 'Winner, UK eCommerce Awards 2026',
      href: URLS.caseStudies.eastAtHome,
    },
    {
      client: 'Wide Fit Shoes',
      meta: 'Fashion · 2025',
      claim: 'A theme rebuild running both the UK and US stores',
      image: wideFitShoes,
      href: URLS.caseStudies.wideFitShoes,
    },
    {
      // Newest launch. Image and case study to come.
      client: 'Sensational Eyes',
      meta: 'Beauty · 2026',
      claim: '[CONFIRM: a theme customisation for a relaunched eye cream, and what it changed]',
    },
  ],
};

export const BRANDS = {
  eyebrow: 'Shopify designer Cornwall, UK',
  heading: 'Brands that trust me',
  // Logo files to come. Order from the copy doc.
  logos: [
    'Dyson',
    'Wrangler',
    'Drink Finder',
    'East at Home',
    'Thameen London',
    'Projektityyny',
    'Sensational Eyes',
    'Fuzzball',
  ],
};

export const SERVICES = {
  eyebrow: 'Shopify website design services',
  heading: 'One designer, nine ways to help your store.',
  intro:
    'I design Shopify and Shopify Plus stores for DTC brands, with my whole attention on the design. For the build, I team up with great Shopify developers.',
  link: { label: 'View all Shopify design services', href: URLS.services },
  items: [
    { name: 'Branding', line: 'Identity work for brands launching or relaunching.', href: URLS.branding },
    { name: 'UX design', line: 'Research, flows and wireframes before anything gets styled.', href: URLS.ux },
    { name: 'Bespoke store design', line: 'The shopping journey designed from scratch, with no theme constraints.', href: URLS.bespoke },
    { name: 'Shopify Plus design', line: 'Enterprise stores for high-volume brands.', href: URLS.plus },
    { name: 'Migrations', line: 'Moving to Shopify from Magento, WooCommerce, BigCommerce, Wix or a custom platform.', href: URLS.migrations },
    { name: 'Theme customisations', line: 'Premium themes that stop looking off the shelf.', href: URLS.theme },
    { name: 'Shopify CRO', line: 'Your analytics show where customers leave. I find out why, design the fix and measure it.', href: URLS.cro },
    { name: 'Shopify subscriptions', line: "Recurring purchase flows that people don't cancel.", href: URLS.subscriptions },
    { name: 'AI search visibility', line: 'Stores designed so AI assistants like ChatGPT can find, read and recommend them.', href: URLS.aiSearch },
  ],
};

export const ABOUT = {
  eyebrow: 'Freelance Shopify UX designer',
  heading: 'You get all of my experience, not just my time.',
  paragraphs: [
    "I'm Anthony Bliss, a freelance Shopify designer based in Cornwall, UK. I started my career in brand identity across Bath and Bristol before moving into digital, and for the past six years I've focused exclusively on Shopify, working with DTC brands across the UK on everything from bespoke store builds to CRO and UX improvements.",
    'Before specialising in ecommerce, I spent three and a half years as a senior freelance designer at Dyson, overseeing complete campaigns for new product launches. I then moved to Cornwall and spent five and a half years inside a leading Shopify agency, eventually progressing to Creative Director.',
  ],
  link: { label: 'More about how I work', href: URLS.about },
  imageAlt: 'Anthony Bliss, Falmouth, Cornwall',
};

export const PROCESS = {
  eyebrow: 'Shopify design process',
  heading: 'I start with the problem, not the homepage.',
  intro:
    'Every project starts with a UX review of your live store, and the navigation is where I look first, because it shows how a store really sells. Then your reviews, your data and your customers. And one question I ask on every project: would I buy this?',
  link: { label: 'See how each service works', href: URLS.services },
  steps: [
    {
      title: 'Understand',
      body: "A call about your business, then a UX review of your live store. From there I'll tell you honestly whether a theme customisation or a bespoke store is the right fit, even when that's the smaller job.",
    },
    {
      title: 'Design',
      body: 'Options first, then the details, mobile first. Bespoke stores are designed in Figma. Theme customisations are designed straight into the theme.',
    },
    { title: 'Launch', body: 'Every screen checked on real devices before it goes live.' },
    {
      title: 'Measure and improve',
      body: 'I check conversion rate and average order value at one, three and seven days, then keep improving if you want to.',
    },
  ],
};

export const INNOVATIONS = {
  eyebrow: 'Shopify UX design wins',
  heading: 'The small details that make the difference',
  intro:
    "Every UX feature I design for a Shopify store starts with a customer's need. I work out what's getting in their way, come up with an idea, then craft it until it's right. Small details like these help people find the right product and buy with confidence.",
  link: { label: 'See all Shopify innovations', href: URLS.innovations },
  // Real UI images to come; all four use the Drink Finder screen for now.
  items: [
    {
      client: 'Drink Finder',
      title: 'A comparison toggle on the collection page',
      body: 'Expand origin, region and vintage to compare bottles side by side, without leaving the listing.',
      image: innovationScreen,
    },
    {
      client: 'East at Home',
      title: 'Product cards that answer dinner questions',
      body: 'Every card shows spice level, dietary needs and flavour, in a list built for comparing on mobile.',
      image: innovationScreen,
    },
    {
      client: 'Whistlefish',
      title: 'Image-first product cards',
      body: 'Product names truncated on purpose, because nobody buys a greeting card for its name.',
      image: innovationScreen,
    },
    {
      client: '[CONFIRM]',
      title: '[CONFIRM: fourth innovation]',
      body: 'The design has four slots and the copy doc has three.',
      image: innovationScreen,
    },
  ],
};

export const RESULTS = {
  eyebrow: 'Shopify success stories',
  heading: 'Good design shows up in the numbers',
  intro:
    'Every result here comes with the period it was measured over and where the number came from, because a percentage on its own proves nothing.',
  items: [
    {
      number: '82%',
      label: 'East at Home revenue growth',
      caption: 'October to June vs the year before · Google Analytics, UK sessions',
    },
    {
      number: '62.5%',
      label: 'Fuzzball purchase conversion lift',
      caption: '[CONFIRM: window and source]',
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
  intro:
    'Rated 5.0 from 6 Google reviews. Two UK eCommerce Awards 2026, including UK eCommerce Website of the Year.',
  links: [
    { label: 'View all testimonials', href: URLS.testimonials },
    { label: '5.0 Google reviews', href: ENTITY.googleReviews, external: true },
  ],
  // Logos to come for Drink Finder and Zen Maitri.
  quotes: [
    {
      quote: "He didn't just give us a facelift; he built a platform that performs.",
      cite: 'Jon Wigmore, Marketing and Ecommerce, Drink Finder · [CONFIRM year]',
      logo: null,
    },
    {
      quote: 'A true craftsman who takes pride in his work and delivers amazing results.',
      cite: 'Ali Zaman, Owner, East at Home · [CONFIRM year]',
      logo: '/icons/logo-east-at-home.svg',
    },
    {
      quote: 'He has an incredible eye for design and functionality, two skills that you rarely find in the same person.',
      cite: 'Jaideep Shah, Director, Zen Maitri · [CONFIRM year]',
      logo: null,
    },
  ],
};

export const ARTICLES = {
  eyebrow: 'Shopify design articles',
  heading: 'Findings from the stores I design',
  link: { label: 'View all articles', href: URLS.articles },
  // Featured images come across with the articles.
  items: [
    { category: 'Shopify CRO', title: 'What Is a Good Conversion Rate on Shopify?', href: '/articles/good-conversion-rate-shopify/' },
    { category: 'News', title: 'Two wins at the UK eCommerce Awards 2026', href: '/articles/shortlisted-uk-ecommerce-awards-2026/' },
    {
      category: 'Design and UX',
      title: "What Is a Shopify UX Review (And Why It's Where Every Project Should Start)",
      href: '/articles/shopify-ux-review/',
    },
    {
      category: 'Design and UX',
      title: 'Shopify Product Card Design: The Art of Cards That Convert',
      href: '/articles/shopify-product-card-design/',
    },
  ],
};

export const FAQS = {
  eyebrow: 'Before you get in touch',
  heading: 'Frequently asked questions',
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
    },
  ],
};

export const CONTACT = {
  eyebrow: 'Start a Shopify project',
  heading: 'Tell me where your store is now.',
  budgets: ['Under £5,000', '£5,000 – £10,000', '£10,000 – £20,000', '£20,000+', 'Not sure yet'],
  legal: 'Anthony Bliss · Falmouth, Cornwall · Anthonyis Limited, company number 10575474',
};
