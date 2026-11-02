// Site-wide facts. One source for the header, footer and schema.

export const SITE = 'https://anthonyis.uk';

export const ENTITY = {
  person: {
    id: `${SITE}/#anthony-bliss`,
    name: 'Anthony Bliss',
    jobTitle: 'Freelance Shopify designer',
    // As on the About page and LinkedIn (29 October 2026): taught at Somerset, a University of Plymouth partner college.
    alumniOf: ['Somerset College of Arts and Technology', 'University of Plymouth'],
    description:
      'Anthony Bliss is a freelance Shopify designer in Falmouth, Cornwall, with over 20 years in brand and ecommerce design, including just over three years on Dyson product launches. He designs bespoke Shopify and Shopify Plus stores for DTC brands, with UX and conversion rate optimisation built in.',
    // Skills carried over from the WordPress schema (knowsAbout and hasOccupation skills), brought up to
    // date with the eight services. Well-known topics link to Wikipedia so search engines can't mistake them.
    knowsAbout: [
      { name: 'Shopify', sameAs: 'https://en.wikipedia.org/wiki/Shopify' },
      { name: 'Shopify Plus' },
      { name: 'Shopify website design' },
      { name: 'Ecommerce design' },
      { name: 'User experience design', sameAs: 'https://en.wikipedia.org/wiki/User_experience_design' },
      { name: 'User interface design', sameAs: 'https://en.wikipedia.org/wiki/User_interface_design' },
      { name: 'Conversion rate optimisation', sameAs: 'https://en.wikipedia.org/wiki/Conversion_rate_optimization' },
      { name: 'Shopify migration' },
      { name: 'Shopify subscriptions' },
      { name: 'Shopify theme customisation' },
      { name: 'Brand identity design' },
      { name: 'Design systems' },
      { name: 'Figma', sameAs: 'https://en.wikipedia.org/wiki/Figma_(software)' },
      { name: 'AI search visibility' },
    ],
    skills: ['Shopify design', 'UX design', 'UI design', 'Conversion rate optimisation', 'Ecommerce strategy', 'Brand design', 'Design systems', 'Figma prototyping'],
  },
  // Wins only, with the organiser's category names (awards page). Shortlists stay on the awards page.
  awards: ['UK eCommerce Website of the Year 2026 (UK eCommerce Awards), for Drink Finder', 'UK User Experience of the Year 2026 (UK eCommerce Awards), for East at Home'],
  business: {
    id: `${SITE}/#business`,
    name: 'Anthony is Freelance',
    legalName: 'Anthonyis Limited',
    companyNumber: '10575474',
    // Shown on the privacy page only, not the footer (Anthony, 2 November 2026). From the Companies House
    // officers page; it's the accountant's address. [CONFIRM] it matches the registered office.
    registeredOffice: 'Unit 3 Building B, Green Court, Truro Business Park, Threemilestone, Truro, Cornwall, TR4 9LF',
    telephone: '+441326702184',
    telephoneDisplay: '01326702184',
    email: 'hello@anthonyis.uk',
    description: 'Anthony is Freelance is the Shopify design practice of Anthony Bliss: Shopify and Shopify Plus store design, UX and conversion rate optimisation for DTC brands across the UK, from Falmouth, Cornwall.',
    // Anthonyis Limited was incorporated in 2017 (Companies House), as in the WordPress schema.
    foundingDate: '2017',
    priceRange: 'From £800 + VAT',
    locality: 'Falmouth',
    region: 'Cornwall',
    country: 'GB',
    // Matches the contact page: Monday to Friday, 9am to 4pm, UK time.
    hours: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '16:00' },
  },
  website: {
    id: `${SITE}/#website`,
    name: 'Anthony is Freelance',
  },
  // Profiles that describe this same business, for Google and AI search to join up (24 October 2026).
  // Keep only profiles that are active and match the site's name, address and phone.
  sameAs: [
    'https://www.linkedin.com/in/anthony-is-freelance/',
    'https://g.page/anthonyis-freelance',
    'https://clutch.co/profile/anthony-freelance',
    'https://www.designrush.com/agency/profile/anthony-is-freelance',
    'https://find-and-update.company-information.service.gov.uk/company/10575474',
  ],
  companiesHouse: 'https://find-and-update.company-information.service.gov.uk/company/10575474',
  googleReviews: 'https://g.page/anthonyis-freelance',
};

// Existing live URLs, so links keep working through the move.
export const URLS = {
  home: '/',
  services: '/shopify-website-design/',
  branding: '/freelance-brand-designer/',
  ux: '/freelance-ux-ui-designer/',
  bespoke: '/shopify-website-design/bespoke-shopify-store-builds/',
  plus: '/shopify-website-design/shopify-plus-design/', // new page, URL from the service pages doc [CONFIRM]
  migrations: '/shopify-website-design/shopify-migration/',
  theme: '/shopify-website-design/shopify-theme-customisation/',
  cro: '/shopify-website-design/shopify-conversion-rate-optimisation/',
  subscriptions: '/shopify-website-design/shopify-subscriptions/',
  aiSearch: '/shopify-website-design/shopify-ai-search-design/',
  work: '/work/',
  innovations: '/innovations/',
  awards: '/awards/', // new page, the full award record
  awardsStory: '/articles/shortlisted-uk-ecommerce-awards-2026/',
  testimonials: '/testimonials/',
  articles: '/articles/',
  about: '/about/',
  contact: '/contact/',
  contactThanks: '/contact/thanks/', // noindex, where the form lands without JavaScript
  privacy: '/privacy-policy/', // new page (29 October 2026)
  dyson: '/work/dyson/', // earlier work, new page (1 November 2026)
  wrangler: '/work/wrangler/', // earlier work, new page (1 November 2026)
  caseStudies: {
    drinkFinder: '/work/drink-finder/',
    eastAtHome: '/work/east-at-home/',
    wideFitShoes: '/work/wide-fit-shoes/',
  },
};

// The Google rating, worded once for every tile on the site. The G, stars and text sit on one line.
export const GOOGLE_RATING = { google: true, stars: true, text: '5.0', note: '(6 reviews)', srText: ' on Google' } as const;

export const ANNOUNCEMENT = {
  text: 'Winner, UK eCommerce Website of the Year, UK eCommerce Awards 2026',
  href: URLS.caseStudies.drinkFinder,
};

export const NAV = [
  { label: 'Shopify Services', href: URLS.services },
  { label: 'Shopify Success Stories', href: URLS.work },
  { label: 'Articles', href: URLS.articles },
];

export const FOOTER_COLUMNS = [
  {
    title: 'Services',
    links: [
      { label: 'Branding', href: URLS.branding },
      { label: 'UX design', href: URLS.ux },
      { label: 'Bespoke store design', href: URLS.bespoke },
      { label: 'Shopify CRO', href: URLS.cro },
      { label: 'Migrations', href: URLS.migrations },
      { label: 'Subscriptions', href: URLS.subscriptions },
      { label: 'Theme customisations', href: URLS.theme },
      { label: 'AI search visibility', href: URLS.aiSearch },
    ],
  },
  {
    title: 'Work',
    links: [
      { label: 'Shopify success stories', href: URLS.work },
      { label: 'Shopify innovations', href: URLS.innovations },
      { label: 'Awards', href: URLS.awards },
      { label: 'Client testimonials', href: URLS.testimonials },
    ],
  },
  {
    title: 'Articles',
    links: [
      { label: 'All Shopify Articles', href: URLS.articles },
      {
        label: 'How to Increase Conversion Rates on Your Shopify Store',
        href: '/articles/how-to-increase-conversion-rates-on-your-shopify-store/',
      },
      {
        label: 'Product Comparisons for Shopify Stores: How Better UX Boosts Conversions',
        href: '/articles/product-comparisons-for-shopify-stores-how-better-ux-boosts-conversions/',
      },
      {
        label: '25 Biggest Brands Using Shopify in 2026',
        href: '/articles/25-biggest-brands-using-shopify-in-2025/',
      },
    ],
  },
];

// [CONFIRM] which profiles are active. The design shows Facebook twice.
// Footer profile links (24 October 2026). Named text links, not icons, so each one tells people and
// crawlers what it is. Only profiles that back up who I am: the person, reviews, and the directories
// AI answers cite for Shopify designers. Social channels come back only once they're active.
export const SOCIAL = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/anthony-is-freelance/' },
  { label: 'Google reviews', href: 'https://g.page/anthonyis-freelance' },
  { label: 'Clutch', href: 'https://clutch.co/profile/anthony-freelance' },
  { label: 'DesignRush', href: 'https://www.designrush.com/agency/profile/anthony-is-freelance' },
];

// Mega menu. Same data drives the desktop panels and the compact/mobile menu.
export const MEGA = {
  services: {
    label: 'Shopify Services',
    viewAll: { label: 'View all services', href: URLS.services },
    columns: [
      [
        // Shopify Plus off for now (comment, 21 October 2026). Four and four.
        { label: 'Branding', href: URLS.branding },
        { label: 'UX design', href: URLS.ux },
        { label: 'Bespoke store design', href: URLS.bespoke },
        { label: 'Theme customisations', href: URLS.theme },
      ],
      [
        { label: 'Shopify CRO', href: URLS.cro },
        { label: 'Migrations', href: URLS.migrations },
        { label: 'Subscriptions', href: URLS.subscriptions },
        { label: 'AI search visibility', href: URLS.aiSearch },
      ],
    ],
  },
  work: {
    label: 'Shopify Success Stories',
    viewAll: { label: 'View all success stories', href: URLS.work },
    links: [
      { label: 'Shopify innovations', href: URLS.innovations },
      { label: 'Awards', href: URLS.awards },
      { label: 'Client testimonials', href: URLS.testimonials },
    ],
  },
  articles: {
    label: 'Articles',
    viewAll: { label: 'View all articles', href: URLS.articles },
    latestLabel: 'Latest articles',
    mostReadLabel: 'Most read',
  },
} as const;
