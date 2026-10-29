// The testimonials record: every client quote, word for word, with one credit and year.
// Every excerpt on the site (homepage, project form, case studies) copies from here and links to
// its anchor on the testimonials page. Copy from page-copy/testimonials.md (8 October 2026).
// Client quotes keep the client's own spelling and punctuation, so the style rules don't apply.
import { URLS, ENTITY } from './site';

export interface Testimonial {
  id: string; // anchor on the testimonials page
  client: string;
  quote: string[]; // paragraphs
  name: string;
  credit: string; // role and company, after the name
  year: string;
  caseStudy?: string; // only once the case study page is live
  google?: { href: string; label: string }; // the client's own Google review, when there is one
  measured?: string; // the measured figure, where the client quotes a number
}

// [CONFIRM] years for every quote except Jon Wigmore's (2026, from the results he cites).
// [CONFIRM] direct links to Ali's, Jamie's and Jaideep's Google reviews; the profile stands in.
export const TESTIMONIALS_LIST: Testimonial[] = [
  {
    id: 'east-at-home',
    client: 'East at Home',
    quote: [
      'When I first saw Anthony’s work I knew that he was the right person for us, my initial hunch turned out to be correct. He was a joy to work with, a true craftsman who takes pride in his work with expert knowledge and delivers amazing results.',
    ],
    name: 'Ali Zaman',
    credit: 'Owner, East at Home',
    year: '2026',
    caseStudy: URLS.caseStudies.eastAtHome,
    google: { href: ENTITY.googleReviews, label: 'March 2026' },
  },
  {
    id: 'drink-finder',
    client: 'Drink Finder',
    quote: [
      'Working with Ant Bliss on the Drink Finder refresh was a standout experience. Having a local designer who could balance in-person visits with seamless video calls made the collaboration feel incredibly personal and productive.',
      "Our site is a beast handling the distinct functional requirements for wine vs. spirits, managing wholesale and retail channels, and juggling complex shipping metrics. Ant was incredibly accommodating, ensuring the site received a modern upgrade without alienating our core customers. He kept the 'Drink Finder' soul intact while significantly smoothing out the user journey.",
      "Despite launching during a globally challenging economic period where luxury items like fine wines and spirits are often the first to be cut from budgets, the results have been phenomenal. Seeing a 34% YoY increase in gross revenue and a 32% jump in customer count is a testament to the effectiveness of Ant's UX/UI strategy. He didn't just give us a facelift; he built a platform that performs.",
    ],
    name: 'Jon Wigmore',
    credit: 'Marketing & E-Commerce, Constantine Stores Ltd, home of Drink Finder',
    year: '2026',
    caseStudy: URLS.caseStudies.drinkFinder,
    measured:
      'Comparing the six months since launch, September to February, with the same period the year before, website sales rose 34% and customers 32%. Source: EPoS till data, marketplaces excluded.',
  },
  {
    id: 'hartnack-and-co',
    client: 'Hartnack & Co',
    // [CONFIRM] Nick's OK for the quote ending before the sentence that names the developer.
    quote: [
      'After many failed attempts to find a Shopify designer and developer anywhere in the world who could understand how our markets worked, but more importantly could design a website that could “make” a product, we discovered Anthony, just down the road in Cornwall.',
      'Anthony totally understood what we needed in terms of style and UI/UX and the complexity of buying a bespoke product online and the conditional logic it takes with all the many, many options. He put up with a large amount of indecisiveness on our part and he delivered a website that looks amazing but also works perfectly and we only wish we had found him earlier.',
    ],
    name: 'Nick Hartnack',
    credit: 'Partner, Hartnack & Company',
    year: '2025',
  },
  {
    id: 'thameen-london',
    client: 'Thameen London',
    quote: [
      'Working with Anthony on the Thameen website was a fantastic experience from start to finish. He was incredibly proactive & organised, which made the entire process feel seamless and well-managed. Beyond being a pleasure to work with personally, his friendly and collaborative approach made even complex decisions feel easy to navigate.',
      "Most importantly, he completely transformed the way the brand comes to life digitally. The new UX elevated the website into a much more modern, intuitive and premium experience, creating a journey that feels both effortless for the customer and truly reflective of Thameen's luxury positioning. Anthony brought structure, clarity and a strong strategic eye throughout, and the end result has genuinely moved the brand forward in a meaningful way.",
    ],
    name: 'Nour Abdel-Motaal',
    credit: 'General Manager, Thameen London',
    year: '2026',
  },
  {
    id: 'whistlefish',
    client: 'Whistlefish',
    quote: [
      'The design process and finalised site helped our brand leap into its next phase with a fresh, clean look that our customers immediately loved. Working with Anthony and the wider development team was a great experience, and one we’d be happy to repeat in the future.',
      'The new UX and UI were exceptional — customers could find products and complete purchases effortlessly, while the clean, professional design made browsing intuitive and trustworthy. Using Figma as a templating system meant all of our building blocks worked seamlessly together, and we’ve since been able to carry that framework into our own design team, making adjustments easily while staying true to the original vision.',
    ],
    name: 'Will Manders',
    credit: 'Head of Ecommerce, Whistlefish',
    year: '2025',
  },
  {
    id: 'east-west-apparel',
    client: 'East West Apparel',
    quote: [
      'Ant was great to work with, personable, very professional, accommodating, punctual, creative and intune. I am very pleased with the outcome of our website and the increase in sales because of it. I highly recommend working with him and intend to do so when the time is right again.',
    ],
    name: 'Jamie Lee',
    credit: 'Owner, East West Apparel',
    year: '2025',
    google: { href: ENTITY.googleReviews, label: 'March 2026' },
  },
  {
    id: 'window-fleur',
    client: 'Window Fleur',
    quote: [
      'Ant was fantastic to work with—professional, efficient, and made the whole process seamless. Our website saw huge improvements, and we’ll definitely be working with him again for future projects. He also has great industry contacts, which was a real bonus!',
    ],
    name: 'Frannie Liddle',
    credit: 'Co-Founder/Creative Director, Window Fleur',
    year: '2025',
  },
  {
    id: 'zen-maitri',
    client: 'Zen Maitri',
    quote: [
      'It has been such a pleasure to work with Anthony. We are a premium health and wellness brand and we were looking to do a revamp of our website to make it more user friendly, cleaner and sleeker. We were introduced to Anthony through a colleague.',
      'Anthony is a careful listener and he immediately grasped what we were trying to do. He has an incredible eye for design and functionality, two skills that you rarely find in the same person. We were also impressed by how data driven Anthony was: the first thing he did was do an analysis of our website to identify click rates and where page views were dropping off. This analysis allowed us to figure out where exactly our priorities need to be. We were extremely pleased with the end result and we would not hesitate to recommend Anthony. He has become our go to for all things UX related. Thank you Anthony!',
    ],
    name: 'Jaideep Shah',
    credit: 'Director, Zen Maitri',
    year: '2026',
    google: { href: ENTITY.googleReviews, label: 'March 2026' },
  },
];

export const testimonial = (id: string) => TESTIMONIALS_LIST.find((t) => t.id === id)!;
/** "Name, Role, Company · Year", the one credit line every excerpt uses. */
export const creditLine = (t: Testimonial) => `${t.name}, ${t.credit} · ${t.year}`;

export const TESTIMONIALS_PAGE = {
  path: URLS.testimonials,
  title: 'Anthony Bliss Reviews | Shopify Design Client Testimonials',
  description:
    'What Drink Finder, East at Home and six more Shopify clients say about working with Anthony Bliss. Word for word, named and dated.',
  eyebrow: 'Shopify designer reviews',
  heading: 'What clients say about past projects.',
  intro:
    'Eight brands, including Drink Finder, East at Home and Thameen London, on working with Anthony Bliss, a freelance Shopify designer in Cornwall. Each quote is as the client wrote it, with their name, role, company and the year they gave it.',
  // Only platforms with reviews on them. [CONFIRM] Clutch rating and LinkedIn recommendations.
  trust: [{ text: '5.0', note: '(6 reviews)', href: ENTITY.googleReviews }],
  list: { eyebrow: 'Shopify client testimonials', heading: 'Named, dated and linked.' },
  cta: {
    eyebrow: 'Start a Shopify project',
    heading: 'Tell me about your store.',
    intro: 'A brief is ideal, but a few lines about your store is plenty to start.',
  },
};
