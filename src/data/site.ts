// Site-wide facts. One source for the header, footer and schema.

export const SITE = 'https://anthonyis.uk';

export const ENTITY = {
  person: {
    id: `${SITE}/#anthony-bliss`,
    name: 'Anthony Bliss',
    jobTitle: 'Freelance Shopify designer',
  },
  business: {
    id: `${SITE}/#business`,
    name: 'Anthony is Freelance',
    legalName: 'Anthonyis Limited',
    companyNumber: '10575474',
    telephone: '+441326702184',
    telephoneDisplay: '01326702184',
    email: 'hello@anthonyis.uk',
    locality: 'Falmouth',
    region: 'Cornwall',
    country: 'GB',
  },
  website: {
    id: `${SITE}/#website`,
    name: 'Anthony is Freelance',
  },
  // [CONFIRM] Clutch profile URL. Keep only profiles that are active.
  sameAs: [
    'https://www.linkedin.com/in/anthony-is-freelance/',
    'https://g.page/anthonyis-freelance',
    'https://find-and-update.company-information.service.gov.uk/company/10575474',
  ],
  googleReviews: 'https://g.page/anthonyis-freelance',
};

// Existing live URLs, so links keep working through the move.
export const URLS = {
  home: '/',
  services: '/shopify-website-design/',
  branding: '/freelance-brand-designer/',
  ux: '/freelance-ux-ui-designer/',
  bespoke: '/shopify-website-design/bespoke-shopify-store-builds/',
  plus: '/shopify-website-design/', // [CONFIRM] no Shopify Plus page yet
  migrations: '/shopify-website-design/shopify-migration/',
  theme: '/shopify-website-design/shopify-theme-customisation/',
  cro: '/shopify-website-design/shopify-conversion-rate-optimisation/',
  subscriptions: '/shopify-website-design/shopify-subscriptions/',
  aiSearch: '/shopify-website-design/shopify-ai-search-design/',
  work: '/work/',
  innovations: '/work/', // [CONFIRM] innovations page URL
  awards: '/articles/shortlisted-uk-ecommerce-awards-2026/',
  testimonials: '/testimonials/',
  articles: '/articles/',
  about: '/about/',
  contact: '/contact/',
  caseStudies: {
    drinkFinder: '/portfolio/drink-finder-shopify-website-design-case-study/',
    eastAtHome: '/portfolio/east-at-home-shopify-website-design-case-study/',
    wideFitShoes: '/portfolio/wide-fit-shoes-shopify-case-study/',
  },
};

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
      { label: 'Shopify Plus design', href: URLS.plus },
      { label: 'Bespoke store design', href: URLS.bespoke },
      { label: 'Shopify CRO', href: URLS.cro },
      { label: 'Migrations', href: URLS.migrations },
      { label: 'Subscriptions', href: URLS.subscriptions },
      { label: 'Theme customisations', href: URLS.theme },
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
export const SOCIAL = [
  { label: 'Facebook', icon: '/icons/facebook.svg', href: '#' },
  { label: 'TikTok', icon: '/icons/tiktok.svg', href: '#' },
  { label: 'YouTube', icon: '/icons/youtube.svg', href: '#' },
];
