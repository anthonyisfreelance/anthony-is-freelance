// Food and drink sector page (27 November 2026, unlisted). The template is SectorPage.astro.
//
// Voice (27 November 2026): authoritative, almost no "I". The results and the clients are the subject of
// each sentence, and Anthony is named where "I" would have been. Every line is a fact from the two case
// studies: no slogans, nothing that couldn't be checked. Headings carry the message, so most sections
// have no body copy under them. More proof, more celebration: big numbers, award wins, client photos.
//
// Six rules keep this page off the homepage's broad terms (agreed 27 November 2026):
//   1. "Designer" always has the sector attached. Never "Shopify designer UK" or "Shopify expert".
//   2. "Designer" sits in the title tag, the H1 and the byline link only. H2 eyebrows use sector nouns.
//   3. No "UK" beside "designer".
//   4. Sector first in the URL and the title tag.
//   5. One link to the homepage, anchored "freelance Shopify designer", in the byline.
//   6. Links into this page use sector anchors, e.g. "Shopify design for food and drink brands".
//
// Figures appear twice at most: 34% and 82% on their cards and in the results numbers.
import { URLS, GOOGLE_RATING } from '../site';
import { AWARD_LINKS } from '../awards';
import { SERVICES_GRID } from '../services';
import { card } from '../service-pages/shared';
import type { SectorPage } from './types';
import heroImage from '../../assets/brands/east-at-home/feature-photo.jpg';
import resultsImage from '../../assets/brands/drink-finder/margarita.jpg';
import vineyard from '../../assets/brands/drink-finder/vineyard.jpg';
import curry from '../../assets/brands/east-at-home/showcase-photo.jpg';
import dfSavings from '../../assets/brands/drink-finder/work-savings-mobile.jpg';
import dfMenu from '../../assets/brands/drink-finder/work-menu-mobile.jpg';
import eahQuantity from '../../assets/brands/east-at-home/work-03.jpg';
import eahBundle from '../../assets/brands/east-at-home/work-05.jpg';

export const FOOD_AND_DRINK: SectorPage = {
  meta: {
    title: 'Food and Drink Shopify Designer | Anthony is Freelance',
    description:
      'The UK eCommerce Website of the Year 2026 sells wine. The UK User Experience of the Year sells curry sauce. Anthony Bliss designed both stores.',
    path: '/food-and-drink-shopify-designer/',
    name: 'Food and drink brands',
    serviceName: 'Shopify design for food and drink brands',
    serviceType: 'Food and drink ecommerce website design',
    audience: 'Food and drink brands',
    // Live at its address for review links: noindex, out of the sitemap, menus and footer. Delete to launch.
    unlisted: true,
  },
  hero: {
    // No eyebrow on sector page H1s: the sector claim is the whole heading (27 November 2026).
    heading: 'Shopify designer for food and drink brands',
    intro:
      'The UK eCommerce Website of the Year 2026 sells wine. The UK User Experience of the Year sells curry sauce. Anthony Bliss designed both stores. Brands commission him directly, and agencies bring him in to lead the design.',
    cta: { label: 'Start a food and drink project', href: '#start-a-project' },
    image: heroImage,
    imageAlt: '',
    trust: [
      { text: 'Winner: UK eCommerce Website of the Year 2026', href: URLS.caseStudies.drinkFinder },
      { text: 'Winner: UK User Experience of the Year 2026', href: URLS.caseStudies.eastAtHome },
      GOOGLE_RATING,
      { text: '20+ years of brand and ecommerce experience', href: URLS.about },
    ],
  },
  work: {
    eyebrow: 'Food and drink Shopify work',
    heading: 'Judged the best in the UK. Twice.',
    cards: [card('Drink Finder'), card('East at Home')],
    note: 'UK eCommerce Awards 2026: four shortlistings, two wins.',
    noteLink: { label: 'See the winners on the organiser’s site', href: AWARD_LINKS.winners },
    link: { label: 'View all Shopify success stories', href: URLS.work },
  },
  results: {
    eyebrow: 'Food and drink Shopify results',
    heading: 'The numbers behind the awards.',
    image: resultsImage,
    imageAlt: '',
    // Windows and sources from the case studies (signed off with the clients for the awards).
    items: [
      { number: '34%', label: 'More website sales', caption: 'Drink Finder. September to February vs a year earlier. EPoS till data.' },
      { number: '32%', label: 'More customers', caption: 'Drink Finder. Same window and source.' },
      { number: '82%', label: 'More revenue', caption: 'East at Home. October to June vs a year earlier. GA4, UK sessions.' },
      { number: '14%', label: 'Higher conversion rate', caption: 'East at Home. Same window and source.' },
    ],
  },
  strips: {
    afterResults: { image: vineyard, alt: 'A vineyard at sunset, from the Drink Finder brand photography.', position: 'center 60%' },
    afterQuotes: { image: curry, alt: 'Two East at Home curries in steel dishes, from the brand photography.', position: 'center 35%' },
  },
  innovations: {
    eyebrow: 'Food and drink UX examples',
    heading: 'Built around how people buy food and drink.',
    // Matched to src/data/innovations.ts by name: the only three of the 13 from food and drink stores.
    items: [
      { client: 'Drink Finder', title: 'A comparison toggle on the collection page', body: 'One switch adds country, region, vintage and style to every card, so shoppers compare bottles without opening each one.' },
      { client: 'East at Home', title: 'Product cards that answer dinner questions', body: 'Heat, dietary needs, reviews and price on every card, in a list built for comparing on a phone.' },
      { client: 'Drink Finder', title: 'An offers button instead of sticky pop-ups', body: 'Offers moved into the navigation, so sign-up prompts no longer block the way to checkout.' },
    ],
    link: { label: 'See all Shopify innovations', href: URLS.innovations },
  },
  quotes: {
    eyebrow: 'Food and drink clients',
    heading: 'In their own words.',
    // Word for word from src/data/testimonials.ts. Different lines from the ones on the homepage.
    items: [
      { quote: 'He kept the ‘Drink Finder’ soul intact while significantly smoothing out the user journey.', cite: 'Jon Wigmore, Marketing & E-Commerce, Constantine Stores Ltd, home of Drink Finder · 2026', logo: 'drink-finder', href: `${URLS.testimonials}#drink-finder` },
      { quote: 'When I first saw Anthony’s work I knew that he was the right person for us, my initial hunch turned out to be correct.', cite: 'Ali Zaman, Owner, East at Home · 2026', logo: 'east-at-home', href: `${URLS.testimonials}#east-at-home` },
    ],
  },
  logos: {
    eyebrow: 'Ecommerce brands',
    heading: 'Food and drink, and far beyond.',
    // The logos are images, so this line names the clients for search and AI tools.
    line: 'Drink Finder and East at Home in food and drink, alongside Dyson, Wrangler, Thameen London, Whistlefish, Wide Fit Shoes and Dr Lipp. Every logo opens the work.',
    // Food and drink first, then the wider list. Same logos and links as the homepage.
    logos: [
      { name: 'Drink Finder', slug: 'drink-finder', href: URLS.caseStudies.drinkFinder },
      { name: 'East at Home', slug: 'east-at-home', href: URLS.caseStudies.eastAtHome },
      { name: 'Dyson', slug: 'dyson', href: URLS.dyson, mobileThird: true },
      { name: 'Wrangler', slug: 'wrangler', href: URLS.wrangler },
      { name: 'Thameen London', slug: 'thameen', href: '/work/thameen-london/' },
      { name: 'Whistlefish', slug: 'whistlefish', href: '/work/whistlefish/' },
      { name: 'Wide Fit Shoes', slug: 'wide-fit-shoes', href: '/work/wide-fit-shoes/' },
      { name: 'Dr Lipp', slug: 'dr-lipp', href: '/work/dr-lipp/' },
    ],
  },
  sells: {
    eyebrow: 'Food and drink Shopify stores',
    heading: 'Bigger baskets, without the hard sell.',
    items: [
      { client: 'Drink Finder', title: 'Multi-buy as buttons', body: 'One, six or twelve bottles, picked with one tap above the price.', screen: dfSavings, alt: 'A Drink Finder wine page on mobile, with one, six and twelve bottle buttons above the price.', href: URLS.caseStudies.drinkFinder },
      { client: 'East at Home', title: 'Savings that grow', body: 'The saving rises as customers add more pouches, right on the product page.', screen: eahQuantity, alt: 'An East at Home curry sauce page on mobile, with pack sizes and their savings.', href: URLS.caseStudies.eastAtHome },
      { client: 'East at Home', title: 'Mix and match', body: 'Customers build their own box of sauces and kits on a phone.', screen: eahBundle, alt: 'East at Home’s mix and match curry sauce builder on mobile.', href: URLS.caseStudies.eastAtHome },
      { client: 'Drink Finder', title: 'A menu for 5,000 products', body: 'Mobile navigation designed from scratch around the whole range.', screen: dfMenu, alt: 'The Drink Finder mobile menu, listing wine, whisky, rum, gin and more.', href: URLS.caseStudies.drinkFinder },
    ],
  },
  services: {
    eyebrow: 'Food and drink Shopify services',
    heading: 'Priced up front.',
    // Photo, link and price come from the services hub record; only the line is written for this page.
    items: [
      { name: 'Bespoke store design', body: 'Every template designed around the range. East at Home’s bespoke store won UK User Experience of the Year.' },
      { name: 'Migrations', body: 'A move to Shopify, redesigned on the way. Drink Finder’s won UK eCommerce Website of the Year.' },
      { name: 'Theme customisations', body: 'A premium theme reshaped around the products, for brands that need to move quickly.' },
      { name: 'Shopify CRO', body: 'Multi-buy offers, quantity savings and basket thresholds, tested on a live store.' },
    ],
    // The hub's price note, word for word, so prices read the same on both pages.
    note: SERVICES_GRID.note,
  },
  faqs: {
    eyebrow: 'Food and drink Shopify FAQs',
    heading: 'What brands ask before they start.',
    items: [
      {
        q: 'Can Shopify handle a food and drink range of 5,000 products?',
        a: ['Yes. Drink Finder sells more than 5,000 wines and spirits on Shopify. Its mobile navigation was designed from scratch around the range, and search shows popular searches and bottles before anyone types.'],
      },
      {
        q: 'Can a store move platforms without losing its regulars?',
        a: ['Yes. Drink Finder moved from a bespoke platform to Shopify in August 2025, after more than 65 years of trading. In Jon Wigmore’s words, the site got a modern upgrade “without alienating our core customers.”'],
      },
      {
        q: 'Can one Shopify store sell to retail and trade customers?',
        // [CONFIRM] what was designed for trade buyers, to make this answer specific.
        a: ['Yes. Drink Finder’s store serves retail and trade buyers, across wine and spirits.'],
      },
      {
        q: 'How long does a food and drink Shopify store take?',
        a: ['A bespoke store takes six to eight weeks to design, with the build about the same again. A theme customisation takes six to ten weeks in total.'],
      },
      {
        q: 'Do you work with agencies?',
        a: ['Yes. Brands commission the design directly, or agencies bring Anthony in to lead it. Expert Shopify developers, or the agency’s own team, build it, and every screen is checked on real devices before launch.'],
      },
      {
        q: 'What happens after launch?',
        a: ['Conversion rate and average order value are checked at one, three and seven days. After that, changes are tested a week against a week. Every store is handed over as a Figma design system, so new pages and campaigns stay on brand.'],
      },
    ],
  },
  cta: { eyebrow: 'Start a food and drink project', heading: 'What do you sell?' },
  sticky: {
    heading: 'Need help with your food and drink store?',
    line: 'The UK’s 2026 Website of the Year and User Experience of the Year both sell food and drink. Yours could be next.',
  },
  more: {
    eyebrow: 'More Shopify design',
    heading: 'Other sectors and services.',
    // Add the other two sector pages here when they go live.
    links: [
      { label: 'Bespoke store design', href: URLS.bespoke },
      { label: 'Theme customisations', href: URLS.theme },
      { label: 'Shopify CRO', href: URLS.cro },
    ],
  },
};
