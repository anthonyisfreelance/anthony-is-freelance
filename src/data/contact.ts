// Contact: where every "Start a project" button can land, and every way to reach Anthony Bliss.
// Copy from page-copy/contact.md (8 October 2026). It doesn't sell: the other pages have done that.
import { URLS, ENTITY } from './site';

export const CONTACT_PAGE = {
  path: URLS.contact,
  title: 'Contact Anthony Bliss | Anthony is Freelance',
  description:
    "Start a Shopify design project with Anthony Bliss. Send a brief or a few lines about your store, and I'll reply within two working days.",
  eyebrow: 'Contact Anthony Bliss',
  heading: 'Start with a few lines about your store.',
  intro:
    'The quickest way to start a Shopify design project with Anthony Bliss is the form on this page. Every message comes straight to me, and I reply within two working days.',
  // [CONFIRM] booking month. One field, read by every final CTA once they show it.
  availability: 'Currently booking from [CONFIRM month].',
};

export const NEXT_STEPS = {
  heading: 'What happens next',
  steps: ['I reply within two working days.', 'A 30-minute call about your business and the project.', 'A fixed-price proposal with a timeline.'],
  // [CONFIRM] privacy notice page and its line on enquiry data; linked once it exists.
  privacy: 'I only use your details to reply to you.',
};

export const DETAILS = {
  id: 'details',
  eyebrow: 'Anthony Bliss contact details',
  heading: 'Email, phone and working hours.',
  // Must match the Google Business Profile exactly: AI tools and directories cross-check them.
  items: [
    { term: 'Email', value: ENTITY.business.email, href: `mailto:${ENTITY.business.email}` },
    { term: 'Phone', value: '01326 702184', href: `tel:${ENTITY.business.telephone}` },
    // [CONFIRM] working hours, then add them to the business schema.
    { term: 'Hours', value: 'Monday to Friday, [CONFIRM hours], UK time' },
    { term: 'Based in', value: 'Falmouth, Cornwall. I work with brands across the UK and abroad, by video call wherever you are.' },
  ],
};

export const OTHER = {
  id: 'other-enquiries',
  eyebrow: 'Other enquiries',
  heading: 'Press, agencies and current clients.',
  items: [
    {
      title: 'Press and awards.',
      text: 'Email me, and the award record and the organiser’s links are on the {link}.',
      link: { label: 'Awards page', href: URLS.awards },
    },
    {
      title: 'Agencies and developers.',
      text: 'I work alongside agencies and in-house teams as their design partner. Use the form and tell me about the project.',
    },
    {
      // [CONFIRM] the channel for current clients.
      title: 'Current clients.',
      text: 'Use our project email thread or bring it to the weekly call, so nothing gets lost.',
    },
    { title: 'Selling something.', text: "Email is best. I'll reply if it's something I need." },
  ],
};
