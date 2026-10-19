// Articles: every live article, one category each (page-copy/articles.md, 1 October 2026).
// Titles, URLs, dates and excerpts from WordPress, 19 October 2026. The excerpt is the first
// sentence of the article's own excerpt; cards don't show it (Figma), the schema does. Featured images come across with the articles.
import { URLS } from './site';

export const ARTICLE_CATEGORIES = [
  { id: 'shopify-cro', label: 'Shopify CRO', service: URLS.cro },
  { id: 'design-and-ux', label: 'Design and UX', service: URLS.ux },
  { id: 'shopify-platform', label: 'Shopify platform', service: URLS.services },
  { id: 'ecommerce-strategy', label: 'Ecommerce strategy', service: URLS.home },
  { id: 'news', label: 'News', service: URLS.work },
] as const;
export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number]['id'];

export interface Article {
  title: string;
  href: string;
  date: string; // ISO publish date
  category: ArticleCategory;
  excerpt: string;
}

// Newest first.
export const ARTICLES_LIST: Article[] = [
  { title: 'What Is a Good Conversion Rate on Shopify?', href: '/articles/good-conversion-rate-shopify/', date: '2026-09-20', category: 'shopify-cro', excerpt: 'A good Shopify conversion rate is above 3.2%, which puts a store in the top 20%.' },
  { title: 'Two Wins from Four Shortlistings at the UK eCommerce Awards 2026', href: '/articles/shortlisted-uk-ecommerce-awards-2026/', date: '2026-08-30', category: 'news', excerpt: 'I won two categories at the UK eCommerce Awards 2026 from four shortlistings, for my work with Drink Finder and East at Home.' },
  { title: "What Is a Shopify UX Review (And Why It's Where Every Project Should Start)", href: '/articles/shopify-ux-review/', date: '2026-05-13', category: 'design-and-ux', excerpt: 'A Shopify UX review is where every project should start, and yet most agencies skip it in favour of made-up personas and assumptions.' },
  { title: 'Shopify Product Card Design: The Art of Cards That Convert', href: '/articles/shopify-product-card-design/', date: '2026-05-05', category: 'design-and-ux', excerpt: 'Product cards are the most fundamental component of any ecommerce site, and the place where premium Shopify themes quietly underperform.' },
  { title: 'Benefits of Shopify Plus: Should You Upgrade in 2026?', href: '/articles/benefits-of-shopify-plus/', date: '2026-04-30', category: 'shopify-platform', excerpt: 'If you are already running a Shopify store and weighing up whether to move to Plus, this article is for you.' },
  { title: 'What Is Generative Engine Optimisation (GEO) and Why Every Shopify Brand Needs It in 2026', href: '/articles/generative-engine-optimisation-shopify/', date: '2026-03-24', category: 'ecommerce-strategy', excerpt: 'Getting found online used to mean one thing: ranking on Google.' },
  { title: 'Shopify Agentic Commerce: What UK Brands Need to Know', href: '/articles/shopify-agentic-storefronts/', date: '2026-03-18', category: 'shopify-platform', excerpt: 'The way people discover and buy products online is changing faster than at any point since mobile shopping took off.' },
  { title: 'How to Design a Shopify Website in 2026 (And When to Hire Someone Instead)', href: '/articles/how-to-design-a-shopify-website-2026/', date: '2026-03-16', category: 'design-and-ux', excerpt: 'Designing a Shopify website in 2026 is not the same as it was five years ago.' },
  { title: 'Shopify Pricing 2026: What Does Shopify Actually Cost?', href: '/articles/shopify-pricing-2026/', date: '2026-03-04', category: 'shopify-platform', excerpt: "If you're looking at Shopify for the first time, the pricing page looks fairly straightforward." },
  { title: 'What DTC Brands Should Look for in a Shopify Designer', href: '/articles/what-dtc-brands-should-look-for-shopify-designer/', date: '2026-02-25', category: 'ecommerce-strategy', excerpt: 'Direct-to-consumer brands operate differently from traditional ecommerce.' },
  { title: 'What is a Shopify Partner? (And Why It Matters in 2026)', href: '/articles/what-is-a-shopify-partner/', date: '2026-02-15', category: 'shopify-platform', excerpt: "If you're hiring a Shopify designer, developer, or agency, you'll probably see some mention they're a Shopify Partner." },
  { title: 'Klaviyo Pricing 2026: Complete Breakdown for Shopify Stores', href: '/articles/klaviyo-pricing-2026-complete-breakdown-for-shopify-stores/', date: '2026-02-14', category: 'shopify-platform', excerpt: "If you're running a Shopify store, you've probably heard about Klaviyo." },
  { title: 'Why Conversion Rate Optimisation Is Still a Human Skill', href: '/articles/why-conversion-rate-optimisation-is-still-a-human-skill/', date: '2026-01-29', category: 'shopify-cro', excerpt: 'Conversion rate optimisation isn’t about tools, dashboards, or automated tests.' },
  { title: 'What to Look for When Hiring a Shopify Designer (2026 Guide)', href: '/articles/what-to-look-for-hiring-shopify-designer/', date: '2025-11-11', category: 'ecommerce-strategy', excerpt: 'Hiring a Shopify designer is a big decision.' },
  { title: 'What Makes a Good Landing Page?', href: '/articles/what-makes-a-good-landing-page/', date: '2025-11-10', category: 'shopify-cro', excerpt: 'When it comes to ecommerce, a landing page can make or break your conversions.' },
  { title: 'Shopify Collabs in 2026: The Complete Guide to Creator Marketing', href: '/articles/shopify-collabs-in-2025-harnessing-the-creator-economy-for-growth/', date: '2025-09-10', category: 'shopify-platform', excerpt: 'Over the last few years, influencer marketing has evolved from a niche tactic into a mainstream growth channel.' },
  { title: 'Product Comparisons for Shopify Stores: How Better UX Boosts Conversions', href: '/articles/product-comparisons-for-shopify-stores-how-better-ux-boosts-conversions/', date: '2025-08-26', category: 'design-and-ux', excerpt: 'When a customer lands on your Shopify store, they’re either ready to buy or still weighing up their options.' },
  { title: 'Voice Search Optimisation for Shopify Stores: A Complete 2026 Guide', href: '/articles/voice-search-optimisation-for-shopify-stores-a-complete-2025-guide/', date: '2025-08-24', category: 'ecommerce-strategy', excerpt: 'The way people search online is changing.' },
  { title: 'Why Off-the-Shelf Shopify Themes Hold Stores Back in 2026', href: '/articles/why-off-the-shelf-shopify-themes-hold-stores-back-in-2025/', date: '2025-07-30', category: 'design-and-ux', excerpt: 'Why choosing convenience over strategy might be costing your business more than you think.' },
  { title: '25 Biggest Brands using Shopify in 2026', href: '/articles/25-biggest-brands-using-shopify-in-2025/', date: '2025-03-13', category: 'shopify-platform', excerpt: 'Shopify has emerged as a leading platform within the eCommerce industry.' },
  { title: 'How to Increase Conversion Rates on Your Shopify Store', href: '/articles/how-to-increase-conversion-rates-on-your-shopify-store/', date: '2025-03-03', category: 'shopify-cro', excerpt: 'Driving traffic to your Shopify store is only half the battle; the real challenge is converting visitors into paying customers.' },
  { title: 'Shopify vs Shopify Plus', href: '/articles/shopify-vs-shopify-plus/', date: '2025-02-19', category: 'shopify-platform', excerpt: 'When setting up or expanding an online store, Shopify is frequently one of the first platforms that comes to mind.' },
  { title: 'Microinteractions in Shopify Website Design', href: '/articles/microinteractions-in-shopify-website-design/', date: '2025-02-17', category: 'design-and-ux', excerpt: 'In today’s digital-first world, user experience (UX) and user interface (UI) design are essential for keeping users engaged.' },
  { title: '6 Strategies for your Homeware & Lifestyle Shopify Store', href: '/articles/strategies-for-your-homeware-lifestyle-shopify-store/', date: '2024-01-18', category: 'design-and-ux', excerpt: 'For this article I am going to be diving in and sharing the knowledge & experience I have as a Shopify Designer.' },
];

export const categoryLabel = (id: ArticleCategory) => ARTICLE_CATEGORIES.find((c) => c.id === id)!.label;


export const ARTICLES_PAGE = {
  path: URLS.articles,
  title: 'Shopify Design and CRO Articles | Anthony is Freelance',
  description:
    'Articles on Shopify CRO, UX design and the platform by Anthony Bliss, a freelance Shopify designer in Cornwall. Every figure sourced and dated.',
  eyebrow: 'Shopify design and CRO articles',
  heading: 'Straight answers from real projects.',
  intro:
    "I'm Anthony Bliss, a freelance Shopify designer based in Cornwall, UK. These articles answer the questions DTC brands ask about their Shopify stores: what good looks like, what it costs and what actually moves the numbers. Every figure carries its source and the date it was checked, and where a point comes from client work, it links to the case study behind it.",
  author: {
    eyebrow: 'Shopify articles by Anthony Bliss',
    heading: 'Who writes them, and how.',
    // [CONFIRM] link "UK eCommerce Awards" to the organiser's winners page once you have the URL.
    award:
      'Anthony Bliss, a freelance Shopify designer in Cornwall, won two UK eCommerce Awards in 2026: UK eCommerce Website of the Year for Drink Finder and UK User Experience of the Year for East at Home.',
    experience:
      "I've worked in design for over 20 years: brand identity in Bath and Bristol, three and a half years at Dyson, then Shopify. I've been independent since August 2023. Every article here is held to the same rules:",
    rules: [
      'Each article answers one question, and answers it in the first sentence.',
      'Every figure carries its source and the month it was checked. Where sources disagree, the article says so.',
      "Client results only appear with the client's sign-off, the measurement window and the data source, worded exactly as on the case study.",
      'When an article is updated with new data, the date at the top changes and a line says what changed.',
    ],
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/anthony-is-freelance/', external: true },
      { label: 'About', href: URLS.about },
      { label: 'Shopify success stories', href: URLS.work },
    ],
  },
};
