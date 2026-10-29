// About: the site's entity page. Who Anthony Bliss is, what he's done since August 2023 and how he
// thinks. Copy from page-copy/about.md (2 October 2026). Never reuses the homepage bio's sentences.
import { URLS } from './site';
import { AWARD_LINKS } from './awards';

export const ABOUT_PAGE = {
  path: URLS.about,
  title: 'About Anthony Bliss | Freelance Shopify Designer, Cornwall',
  description:
    'From brand identity in Bath and Bristol to Dyson launches to Shopify. How Anthony Bliss works, what he believes and why he still designs every screen.',
  eyebrow: 'About Anthony Bliss',
  heading: 'Over twenty years and still crafting pixels.',
  // The page's main extraction target: every entity fact once.
  intro:
    "I'm Anthony Bliss, a freelance Shopify designer based in Falmouth, Cornwall. I design Shopify and Shopify Plus stores for UK DTC brands, trading as Anthony is Freelance through Anthonyis Limited, company number 10575474. I've worked in design for over 20 years, and I've been independent since August 2023.",
  // [CONFIRM] month and year the photo was taken, and alt text against the photo.
  photoAlt: 'Anthony Bliss, freelance Shopify designer, in Falmouth, Cornwall',
  photoCaption: 'Anthony Bliss in Falmouth, Cornwall.',
};

export const CAREER = {
  eyebrow: 'Shopify design experience',
  heading: 'Brand identity first, then Dyson, then Shopify.',
  paragraphs: [
    "My design career started in brand identity, first as a graphic designer at Studio 108 in Corsham, then freelancing for Bath and Bristol agencies including The House, Halo Media, Taxi Studio and Fiasco Design. For ten years I designed identities and campaigns, and learnt how to tell a brand's story. I still use that on every Shopify store, whether it's the tone of voice, a bit of restraint or one small design touch that makes the store feel like that brand.",
    'Then I spent just over three years as a freelance senior digital designer at Dyson, working on new product launches across every digital touchpoint. I wanted to see how a launch at that scale really comes together and be a part of creating it.',
    "I moved to Cornwall to raise my family by the sea, and my work moved into ecommerce. I spent five and a half years inside a Shopify agency in Falmouth, rising to Creative Director. Ecommerce taught me restraint. Branding is about bringing ideas to life, but a store has to sell, so every idea has to earn its place. It's still problem-solving, just a different kind. Since 2020 I've worked only on Shopify. Leading a design team taught me I'd always rather be a doer than a talker, so in August 2023 I went independent.",
  ],
  // The book title is set in italics on the page.
  degree: {
    before: 'I did my degree in graphic design at Somerset College of Arts and Technology, a University of Plymouth partner college, on an ideas-led course where ',
    book: 'A Smile in the Mind',
    after:
      " was the bible. The pressure was to have the best idea every time, and I wasn't always confident. Results, clients and colleagues changed that. CRO always involves some guesswork, but twenty years of results, tests and trends coming and going means mine are educated guesses.",
  },
};

// The whole career as dated facts, one row each, matching LinkedIn (29 October 2026).
// The agency is never named. `datetime` feeds the <time> element where the date is known.
export const CAREER_TABLE = {
  eyebrow: 'Shopify designer career',
  heading: 'Over twenty years, from brand identity to Shopify.',
  caption: "Anthony Bliss's design career",
  head: ['When', 'Role', 'What it taught me'],
  rows: [
    { when: 'October 2005 to October 2010', datetime: '2005-10', role: 'Graphic designer at Studio 108 Design Partnership, Corsham', taught: 'Learning my trade as a graphic designer' },
    { when: '2010 to 2015', datetime: '2010', role: 'Freelance brand designer for agencies in Bath and Bristol, including The House, Halo Media, Taxi Studio and Fiasco Design', taught: "How to tell a brand's story" },
    { when: 'January 2015 to February 2018', datetime: '2015-01', role: 'Senior digital designer at Dyson (freelance), new product launches', taught: 'How a launch at global scale comes together' },
    { when: 'March 2018 to August 2023', datetime: '2018-03', role: 'A Shopify agency in Falmouth, rising to Creative Director', taught: 'Handling the mix of pressure along with creative output.' },
    { when: 'Since 2020 (the Covid shift)', datetime: '2020', role: 'Shopify only', taught: 'The joy of being able to use all of my skills (brand, UX and UI design) on a single project.' },
    { when: 'August 2023', datetime: '2023-08', role: 'Went independent as Anthony is Freelance', taught: 'Finally reached a work-life balance.' },
    { when: '30 September 2026', datetime: '2026-09-30', role: 'UK eCommerce Website of the Year (Drink Finder) and UK User Experience of the Year (East at Home), from four shortlistings', taught: "I've always taken pride in my work and in working directly with clients. But being recognised under my own name, with no employer taking the credit, hits differently." },
  ],
};

export const PRINCIPLES = {
  eyebrow: 'How I work',
  heading: 'What I believe about good Shopify design.',
  intro: 'These are the principles behind every Shopify store I design, whatever the brand or the brief.',
  items: [
    {
      title: 'Design only counts if it works.',
      body: 'A Shopify store can look great and still be completely passive. The numbers behind it decide whether the design is any good, because the point of the investment is to help your business make money.',
    },
    {
      title: 'The navigation is the most valuable element on your site.',
      body: "Product discovery comes first in every store I design. Years of watching Hotjar recordings show people go straight to the navigation, so if they can't find the right product there, the product page never gets its chance.",
    },
    {
      title: 'Easy to use comes first. Always.',
      body: 'Ease of use is never traded for looks. Distinctive can come in other forms: the typography, the pace of the interactions and how each choice is presented.',
    },
    {
      // [CONFIRM] happy to name John Smedley as a store you admire.
      title: "Brand and UX shouldn't fight.",
      body: "Not every Shopify store needs to behave like a conversion machine. John Smedley is gorgeous, unique and not heavily CRO focused, and it doesn't need to be. The question I ask is what this brand's shopping experience should feel like.",
    },
    {
      title: 'Trust before tactics.',
      body: "Trust is the first conversion question: would I trust this store if I landed on it cold? Then the shopping information, like when the product will actually arrive. I'd rather earn the sale than force it with stressful, time-based tactics, and if one might suit your brand, we talk it through first.",
    },
    {
      title: 'Good design outlasts trends.',
      body: 'I largely ignore design trends, because I want the stores I design to last five years or more. Some things from higher education never left me, like Swiss typography, generous spacing and editorial layouts, because they are timeless.',
    },
    {
      title: 'A website is never finished.',
      body: "A Shopify store is never finished, and that's what CRO means to me: always improving it and growing the numbers. Your analytics show where customers leave. I find out why, design the fix and measure it.",
    },
    {
      // The brief's locked no-commission wording.
      title: "I use your tools. I don't sell them.",
      body: "I work from the analytics your store already runs. A lot of agencies recommend 'partner' apps because they earn commission on them. I don't believe in that, and I earn nothing from the apps or tools I suggest, so my recommendation is simply what's best for your brand and your products. Where something can be designed into the store instead of added with another app, I'll usually suggest that first.",
    },
  ],
  link: { label: 'See how each service works', href: URLS.services },
};

export const INDEPENDENT = {
  eyebrow: 'Independent Shopify designer',
  heading: 'I could have built an agency.',
  paragraphs: [
    "I could have built an agency when I went independent. I chose to stay hands-on. I love the craft and the detail, and running an agency would mean doing less of the work I'm best at.",
    "The details are where I spend the most time. I'm painstaking about typography, and a single button goes through more versions than anyone would guess before it goes into the design system. Product cards get the same care, because they sit on almost every page of a store. The Figma file I hand over gets the same painstaking care so a developer is left with no guesswork. I like the jigsaw piece as much as the entire jigsaw.",
    "Running my own company has also taught me what it's like to be a founder. Every decision is yours, and so is the risk. My name is on every project, so I'm invested in how it does.",
  ],
};

export const FIT = {
  eyebrow: 'DTC brands I work with',
  heading: 'Ready for the next step.',
  paragraphs: [
    'The DTC brands I work best with have taken their Shopify store as far as they can on their own. They know their products and their customers, they care about both, and they need someone with a UX mind and a design eye to take the store to the next level.',
    "Most arrive with a wishlist or a brief already written, which is great. The best clients are down to earth, like to collaborate and trust me to do my job. That's when the work is at its best, and it's usually a lot of fun.",
  ],
  link: { label: 'Launching your first store? See theme customisations', href: URLS.theme },
};

export const ABOUT_FAQS = {
  eyebrow: 'Anthony Bliss FAQs',
  heading: 'Three questions people ask about me.',
  items: [
    {
      q: 'Are you a Shopify Partner?',
      a: [
        "Yes, I'm a Registered Shopify Partner. Shopify's higher tiers and its Partner Directory are based on revenue from the stores a partner creates, transfers or refers to Shopify. On my projects, the developer usually sets up the store, so that credit goes to them. My part is the design, and every case study publishes the results.",
      ],
      checked: 'Checked October 2026.',
    },
    {
      q: 'Do you use AI in your work?',
      a: [
        "Yes, for the groundwork. I use Claude, an AI assistant, to run projects, dig into your GA4 and Microsoft Clarity data, research in depth and test ideas, so we get to the insight faster. The design is different. I'll always be in the pixels, designing every screen myself in Figma. The craft and the details are the part I love, and they're what you're hiring me for. Model training is switched off on my account, and I only share what each project needs.",
      ],
      checked: 'Checked October 2026.',
    },
    {
      q: 'How many projects do you take on at once?',
      a: ['Two, run in sprints, so each one gets my full attention.'],
    },
  ],
};

export const ABOUT_CTA = {
  eyebrow: 'Work with Anthony Bliss',
  heading: "Tell me what's holding your store back.",
  intro: "A brief is ideal, but a few lines about your store is plenty to start. I'll reply within two working days.",
};
