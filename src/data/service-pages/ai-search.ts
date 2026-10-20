// Shopify AI search visibility design. Copy: the service pages doc, Page 9, from the live WordPress page
// (checked 20 October 2026). Built into every project, never sold or priced on its own (brief, 11 October 2026).
import { URLS } from '../site';
import { COMPARE } from '../innovations';
import desktop from '../../assets/brands/drink-finder/still-desktop.jpg';
import type { ServicePage } from './types';
import { card, ROUTING_EYEBROW, ALL_ARTICLES } from './shared';

export const AI_SEARCH: ServicePage = {
  meta: {
    title: 'Shopify AI Search Visibility Design UK | Anthony is Freelance',
    description:
      'Shopify stores designed so AI assistants like ChatGPT and Google’s AI Mode can find, read and recommend them. Built into every store I design.',
    path: URLS.aiSearch,
    name: 'AI search visibility',
    serviceType: 'Shopify AI search visibility design',
  },
  hero: {
    eyebrow: 'Shopify AI search visibility design',
    heading: 'Found, read and recommended.',
    intro:
      "AI search visibility design is the part of a Shopify store's design that decides whether AI assistants like ChatGPT and Google's AI Mode can find it, read it correctly and recommend it. I build it into every store I design, bespoke or theme, using what I learn on my own site, where Google now shows me for more than five times as many long, AI-style searches as a year ago.",
    cta: { label: 'Get my store ready for AI search', href: '#start-a-project' },
    image: desktop,
    imageAlt: 'The Drink Finder homepage on desktop, with search, the full category menu and the shop’s Cornish address written in the header.',
    caption: 'Drink Finder. What it sells and where, written on the page rather than baked into images.',
  },
  trust: ['Built into every store I design', 'UK eCommerce Website of the Year 2026', '20+ years ecommerce and brand experience'],
  included: {
    heading: 'What AI search visibility design covers',
    items: [
      'Collections and landing pages built around the questions and uses your customers actually search for.',
      'Answer-first openings on product, collection and policy pages.',
      'Navigation that matches how people describe what they want.',
      'Sizes, materials, delivery and returns written on the page, not baked into images.',
      'Product pages in a clear order: what it is, key facts, delivery and returns, reviews, then FAQs.',
      'FAQs on the product and collection pages they answer, not tucked away on one FAQ page.',
      'Clear headings and real buttons, with Product, review and breadcrumb structured data briefed to the developer to match the page.',
      'Reviews linked to where they came from, awards and press with names and dates, and delivery, returns and guarantees in plain sight.',
    ],
  },
  fit: {
    heading: 'Right for you if',
    items: [
      "Shoppers ask ChatGPT about your category, and you don't come up, even where your products are the better fit.",
      "Your product facts sit where AI tools can't read them: sizes in images, specs in PDFs, delivery details in banners.",
      "You're planning a redesign or migration. It's the best moment to get this right, so the new store is ready for AI search from launch.",
      "Your products are on Shopify's AI channels, so what ChatGPT and Google's AI Mode read about you needs to be right.",
    ],
  },
  proof: {
    heading: 'Stores designed for people and AI tools',
    link: { label: 'View all Shopify success stories', href: URLS.work },
    cards: [card('Drink Finder'), card('East at Home'), card('Projektityyny')],
  },
  routing: {
    eyebrow: ROUTING_EYEBROW,
    heading: "When AI search visibility design isn't the right call",
    intro: "It's part of every store I design, so it's never the wrong call in a design project. These are the jobs it doesn't cover.",
    routes: [
      {
        situation: 'You want your brand mentioned more on other sites.',
        body: "That's GEO: content, digital PR and citation tracking, usually a monthly service from an SEO or GEO agency. It works alongside the design, not instead of it.",
        links: [],
      },
      {
        situation: "You need Shopify's AI channels switched on.",
        body: "That's a setting in your Shopify admin, or a job for your developer. I design what those channels read.",
        links: [],
      },
      {
        situation: 'Your store reads well, but shoppers still leave.',
        body: "AI tools are sending people. The steps that lose them are a conversion problem.",
        links: [{ label: 'Shopify CRO', href: URLS.cro }],
      },
    ],
  },
  process: {
    eyebrow: 'Shopify AI search design process',
    heading: 'How I design for AI search in every project',
    intro:
      'I build AI search into every Shopify store I design, from bespoke builds to theme customisations, rather than selling it as an extra. It comes down to three jobs: helping AI tools find the right page, understand what you sell, and trust you enough to recommend you.',
    steps: [
      {
        title: 'Help AI tools find the right page',
        body: 'When someone asks ChatGPT for the best wine for a summer barbecue, it looks for the one page that answers best. I plan the store around the questions your customers ask, then design a clear page for each one, with the answer in its opening lines.',
      },
      {
        title: 'Make every product detail readable',
        body: "AI agents don't see your photography. They read the text and the structure behind it, much like a screen reader. If it isn't written on the page, it doesn't exist to an AI. On Shopify Plus projects, I plan this with a technical SEO specialist from day one.",
      },
      {
        title: 'Give AI tools proof they can check',
        body: 'An AI recommends what it can verify. "Loved by thousands" carries little weight. A review score with its source, an award with its year and a returns policy in plain sight carry a lot, so I place proof where the decision happens.',
      },
    ],
  },
  innovations: {
    eyebrow: 'Shopify AI search design in practice',
    heading: 'Written down, where people and AI tools look.',
    intro: 'Each of these puts a fact or a route on the page as text, so shoppers and AI tools find the same answer.',
    items: [
      { client: 'Projektityyny', title: 'Shop by product, room or print', body: 'Routes in from the navigation that match how people describe what they want, each leading to its own page.' },
      { client: 'Hartnack & Co', title: 'Shop by use', body: 'A landing page for each use, from business binders to pilot log books, so every question has one clear page.' },
      { client: 'Drink Finder', title: 'A comparison toggle on the collection page', body: 'Country, region, vintage and style written on the collection page, so people and AI tools compare without opening every product.', screen: COMPARE.poster, video: COMPARE.video },
      { client: 'East at Home', title: 'Product cards that answer dinner questions', body: 'Spice level, dietary needs and flavour written on every card, with review counts and the Great Taste award where the decision happens.' },
    ],
  },
  price: {
    eyebrow: 'AI search visibility price',
    heading: 'How much does AI search visibility design cost?',
    notes: ["It isn't sold or priced on its own. It's part of every store I design, bespoke or theme, so the price is the price of the design project."],
    cta: { label: 'See all Shopify design services', href: URLS.services },
    caption: 'AI search visibility design at a glance',
    rows: [
      ['Price', 'Included with every design project'],
      ['Where it happens', 'Through the whole design, from the navigation plan to the product page order'],
      ['What you get', 'Answer-first pages, product details as text, structured data briefed to the developer, and checkable proof'],
      ['Who builds it', 'A developer I introduce, or your own team or agency'],
    ],
  },
  comparison: {
    eyebrow: 'AI search design vs GEO',
    heading: 'AI search visibility design vs GEO. Which does your store need?',
    caption: 'AI search visibility design and GEO compared, October 2026',
    columns: [
      { label: 'AI search visibility design', href: URLS.aiSearch, current: true },
      { label: 'GEO (generative engine optimisation)', href: '/articles/generative-engine-optimisation-shopify/' },
    ],
    rows: [
      ['The question', 'Can AI tools read and trust your store?', 'How often do AI tools mention your brand?'],
      ['Starts with', 'Your pages, product information and structure', 'Prompt research, content and mentions on other sites'],
      ['Covers', 'Page structure, product details as text, structured data briefed to the developer, checkable proof', 'Content, digital PR, citation tracking and technical SEO'],
      ['Who does it', 'A designer, as part of the store', 'An SEO or GEO agency, usually as a monthly service'],
      ['Best when', "You're redesigning, migrating, or your store is hard to read", 'Your store reads well and you want more mentions elsewhere'],
    ],
    notes: ['They work together. GEO gets your brand mentioned, and design decides what AI tools find when they reach your store.'],
  },
  faqs: {
    eyebrow: 'Shopify AI search FAQs',
    heading: 'Common questions about AI search and your Shopify store',
    items: [
      {
        q: 'What is AI search visibility design?',
        a: ["It's the part of a Shopify store's design that decides whether AI assistants and agents can find it, read it correctly and recommend it. That means answer-first pages, product details written as text, a structure people and machines can both read, and proof that can be checked. I build it into every store I design."],
      },
      { q: 'Can you guarantee my store appears in ChatGPT?', a: ['No, and nobody honestly can. The AI tools decide what they recommend. I design the store so it’s easy for them to read and to trust.'] },
      {
        q: 'How can I tell if AI tools are sending me customers?',
        a: ["In GA4, look for sessions whose source contains chatgpt, perplexity, gemini, copilot or claude, and see what those visitors go on to buy. A ready-made AI channel often undercounts, so filter by source yourself. Then ask ChatGPT and Google's AI Mode the questions your customers ask, and note whether your store comes up."],
      },
      {
        q: 'Is this the same as GEO?',
        a: ["GEO, or generative engine optimisation, is what agencies call getting cited by AI tools. Most of it is content, SEO and PR work, which isn't what I do. I handle the design side: structure, product information and proof, built into the store itself. On Shopify Plus and larger projects, I team up with a technical SEO specialist from the start, so site structure, redirects and structured data are planned alongside the design."],
      },
      {
        q: 'Do I need special AI markup or an llms.txt file?',
        a: ['No. Google says there are no extra requirements to appear in AI Overviews or AI Mode, and no special markup to add. An llms.txt file is optional. Clear pages, honest product information and structured data that matches the page come first.'],
      },
      {
        q: 'Does my Shopify theme already add structured data?',
        a: ['Most themes add basic product markup, such as name, price and availability. Reviews, shipping and returns often need adding through your review app or developer. I brief exactly what each page needs, and it always matches what shoppers can see.'],
      },
      {
        q: "How do I get my Shopify product pages into Google's AI Overviews?",
        a: ["Make them eligible for Google Search, then easy to quote. Google draws on the same pages as Search, so a product page needs to be indexed, with its key facts in text and structured data that matches what's visible. Nobody can choose which pages appear."],
      },
      {
        q: 'What is agentic commerce, and is my store ready for it?',
        a: ["Agentic commerce is AI agents browsing, comparing and buying for a shopper, such as checking out inside ChatGPT. Shopify's Agentic Storefronts put your products in ChatGPT, Copilot, Google's AI Mode and the Gemini app, managed from your Shopify admin. Agents judge your product information, policies and reviews, so a ready store has all three clear, complete and in text."],
      },
      {
        q: 'Does designing for AI agents help accessibility?',
        a: ['Yes. AI agents read a store through the same structure screen readers use: headings, labels, real buttons, and text instead of words baked into images. Designing for one helps the other, and it matters more now the European Accessibility Act covers many online shops selling to customers in the EU.'],
      },
      { q: "Does Shopify's AI shopping make store design matter less?", a: ['No. AI agents still judge your product information, reviews and policies, and all of that comes from your store.'] },
      { q: "Do you set up Shopify's AI channels?", a: ["No. That's a setting in your Shopify admin, or a job for your developer. I design what those channels read."] },
    ],
  },
  articles: {
    eyebrow: 'AI search insights',
    heading: 'What GEO and agentic commerce mean for Shopify brands',
    link: ALL_ARTICLES,
    items: [
      { category: 'Ecommerce strategy', title: 'What Is Generative Engine Optimisation (GEO) and Why Every Shopify Brand Needs It in 2026', href: '/articles/generative-engine-optimisation-shopify/' },
      { category: 'Shopify platform', title: 'Shopify Agentic Commerce: What UK Brands Need to Know', href: '/articles/shopify-agentic-storefronts/' },
    ],
  },
  extras: [
    {
      kind: 'text',
      after: 'trust',
      id: 'how-ai-search-changes-shopping',
      eyebrow: 'How AI search changes shopping',
      heading: 'What changes when AI does the searching',
      paragraphs: [
        "AI assistants don't browse a store the way people do. They read it, judge it and send shoppers straight to the page that answers their question. That changes what a store's design has to do.",
        "It's happening fast. In the first quarter of 2026, Shopify reported AI-driven traffic to its stores up eight times on a year earlier, and orders from AI searches up nearly 13 times (Shopify Q1 2026 results, reported by PYMNTS, 5 May 2026).",
      ],
      list: [
        { title: 'Shoppers skip your navigation.', body: "An AI assistant answers the question, then sends the shopper straight to one page. There's no menu or homepage journey to explain who you are, so every page they land on has to say what you sell and who it's for in its opening lines." },
        { title: 'Questions are longer and more specific.', body: 'People now ask for "a waterproof coat for a whippet under £60", not "dog coats". A store that states sizes, fit, materials and prices as text can answer that. A store that hides them in images and tabs can\'t.' },
        { title: 'AI agents shop as well as search.', body: 'AI agents can now compare products and buy on a shopper\'s behalf. They read product information, policies and reviews, not your photography, so a beautiful store with thin product detail gets passed over.' },
      ],
    },
  ],
};
