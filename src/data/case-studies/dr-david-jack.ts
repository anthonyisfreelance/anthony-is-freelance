// Dr David Jack case study. Facts from the "Dr David Jack: case study fact sheet" (25 November 2026), made in
// Anthony's Dr David Jack project. Every screen is recorded from the live store (drdavidjack.com, in its
// Black Friday state; re-record after the sale with Record Dr David Jack.command). Photos are the brand's own.
//
// Rules from the fact sheet. Keep to them in any edit:
//  - Never name a prescription-only medicine. The site's own term is "Anti-wrinkle injections".
//  - No scores or figures from eComplete's conversion audit until Jake Heath agrees. The audit is theirs.
//  - No "92%" study figures (design placeholders), no medical or outcome claims in our own words, and no
//    years in clinic, press titles or awards (none verified).
//  - Never the words "reassuringly expensive". The lift in feel is space, restraint and one line of colour.
//  - Patient before and after photos: only what the live store already shows in a screen recording.
// Still open (25 November 2026): the real go-live date, whether the client needs to approve the page, and
// whether these photo shoots are cleared for this site (Juliet Rees Jones, Dr David Jack).
import { SERVICE, BUILDER, slot, innovationSlot, innovationLink, photo, photoMedia, moreFor, breadcrumbs, MORE_HEADING, desktopSplit, type CaseStudyPageData, type Media } from './types';
import { brandImage } from '../media';

const B = 'dr-david-jack';
const PATH = '/work/dr-david-jack/';
const pic = (name: string, alt: string): Media => ({ image: brandImage(B, name), alt, label: 'Photo' });

export const DATA: CaseStudyPageData = {
  meta: {
    path: PATH,
    title: 'Dr David Jack Shopify Case Study: One Store for Skincare and Clinics',
    description:
      'Bespoke Shopify design for Dr David Jack, the doctor-led skincare brand with six aesthetic clinics. UX, UI and a design system that give shop and clinic one store, in partnership with eComplete.',
    breadcrumbs: breadcrumbs('Dr David Jack', PATH),
  },
  client: { name: 'Dr David Jack', url: 'https://drdavidjack.com/', display: 'drdavidjack.com' },
  hero: {
    eyebrow: 'Dr David Jack Shopify case study',
    // No result figure: there are no before and after analytics on record (fact sheet, question 16).
    heading: 'Skincare and six clinics in one Shopify store',
    standfirst:
      'Dr David Jack is a doctor-led skincare brand with six aesthetic clinics, in London, Edinburgh and the Cotswolds. Shop and clinic shared one Shopify store and competed for the same space. Working with eComplete, I designed a bespoke store that gives each side its own half of the menu, keeps the other one tap away, and feels as considered as the clinics do.',
    image: {
      image: photo(B, 'hero'),
      // 25 November 2026, Anthony's pick: Dr Jack with the range on coloured blocks (the Stellar shoot).
      alt: 'Dr David Jack in a linen jacket beside his skincare range, set on coloured blocks',
      label: 'Hero photo',
    },
    // His face sits in the top third, so the phone crop (4:3) is taken from there, not the middle.
    imagePosition: '50% 18%',
  },
  brief: {
    eyebrow: 'Dr David Jack Shopify brief',
    heading: 'Two sides of one business, and a store to match the clinics',
    body: [
      // The findings are eComplete's conversion audit of the old store, in words only. No scores.
      'The brand was strong. The store did not turn it into first orders. eComplete’s conversion audit of the old site found conflicting offers, weak navigation and no guided way in. Skincare and clinic fought for the same menu. Treatments were long blog articles, and booking took a three-step wizard.',
      'The client asked for a clear split between skincare and clinic, a luxury feel and room for the photography. eComplete set the priorities: product page, navigation and homepage, with first orders as the measure. I led the design, from site structure and wireframes to mobile and desktop UI and the design system. Kick-off to build-ready designs took eight weeks.',
    ],
  },
  details: {
    sector: 'Beauty',
    services: [SERVICE.bespoke, SERVICE.ux, SERVICE.cro],
    builtBy: BUILDER.ecomplete,
    // TBC: the real go-live date. Launch was planned for early October 2026 (fact sheet, question 6).
    live: '2026',
    rows: [],
  },
  showcase: {
    label: 'Dr David Jack designs',
    background: photo(B, 'showcase-photo'),
    desktop: slot(B, 'showcase-desktop', 'The Dr David Jack homepage on desktop, sliding through its campaign slides under the Skincare and Clinics header.', 'Desktop store'),
    phones: [
      // Always still, recording, still, recording. Phones 1 and 3 are stills, so they must never have an .mp4.
      slot(B, 'showcase-phone-1', 'The Dr David Jack homepage on mobile on its Art of Gifting slide, with Skincare and Clinics side by side under the logo.', 'Homepage'),
      slot(B, 'showcase-phone-2', 'The Dr David Jack skincare collection on mobile: category row, filters and product cards.', 'Collection'),
      slot(B, 'showcase-phone-3', 'The Dr David Jack Microbiome Facial treatment page on mobile: price, Book now and Get in touch.', 'Treatment page'),
      slot(B, 'showcase-phone-4', 'The Dr David Jack Serums collection on mobile, from the header down to the products.', 'Serums collection'),
    ],
  },
  workIntro: {
    eyebrow: 'Dr David Jack Shopify store design',
    heading: 'A premium feel, built from restraint',
    body:
      'The store had to feel as premium as the clinics and the products. So the design holds back. Generous space. Black, white and grey on a warm off-white. Serif capitals with wide spacing, square corners, and photography that runs edge to edge with the header laid over it. Colour is saved for one thin line. The products, the results and the people carry the page.',
  },
  highlights: [
    {
      eyebrow: 'Shopify navigation design',
      heading: 'Two businesses, one menu.',
      body: 'Skincare and Clinics sit side by side at the top of every page, as two halves of one header. Tap a side and the menu opens on it: concerns and categories on one, treatments, conditions and clinics on the other. The other half is always one tap away, and Book a treatment is pinned to the foot of both. Neither side is the afterthought.',
      link: innovationLink('See two businesses, one menu', 'two-businesses-one-menu'),
      media: innovationSlot('two-businesses-one-menu', 'The Dr David Jack mobile menu switching between its Skincare and Clinics sides.', 'Menu recording'),
    },
    {
      eyebrow: 'Shopify homepage design',
      heading: 'One question first: where do you start?',
      body: 'The homepage asks it outright and answers with two cards: start with skincare, or start with a treatment. From there each side leads into the other. Treatments, results and practitioners sit on the shop’s homepage, so the clinics lend their authority to the products.',
      media: slot(B, 'work-02', 'The Dr David Jack homepage on mobile, scrolling into Where do you start? and its two routes: skincare or the clinic.', 'Homepage'),
    },
    {
      eyebrow: 'Skincare collection page design',
      heading: 'A collection page that sells.',
      body: 'A shopper can choose and add without leaving the grid. A category row sits under the heading. Every card carries its review score, a one-line description, the concern it treats and a quick add. A free samples line sits above the grid, and a free virtual consultation is offered to anyone still unsure.',
      media: slot(B, 'work-03', 'The Dr David Jack Moisturisers and SPFs collection on mobile: the header, category row, filters and free samples line, then the first product card.', 'Collection'),
    },
    {
      eyebrow: 'Shop by skin concern',
      heading: 'One colour per concern.',
      body: 'It was hard to match a product to a skin concern. Now each of the four concerns has a colour, and it follows the shopper from the menu to the basket: a line beside the concern in Shop by Concern, the same line on every card, and again under the name on the product page. It is the only colour in the interface, so a shopper can scan a grid and find their concern.',
      media: slot(B, 'work-04', 'Shop by Concern in the Dr David Jack mobile menu, each concern with its colour line, then the Pigmentation page and the Oriel product page carrying the same yellow line.', 'Shop by concern'),
    },
    {
      eyebrow: 'Skincare product page design',
      heading: 'A product page in buying order.',
      body: 'The content was strong and the page was not. Now the page answers each doubt in the order it comes up: who it is for and who it isn’t, the benefits, the ingredients, the founder’s reasoning, how to use it, where it sits in a routine, then reviews and questions. A bar with the price and Add to bag follows you down, with links to jump to any part of the page.',
      media: slot(B, 'work-05', 'The Dr David Jack Stellar product page on mobile, using the links in its sticky Add to bag bar to jump to Key Benefits, The Routine and back.', 'Product page'),
    },
    {
      eyebrow: 'Free samples in the basket',
      heading: 'Samples that never block checkout.',
      body: 'The old sampling tool struggled past four sachets. Now adding to the bag opens a picker with six. Choose two with a tap each and a counter keeps score. Checkout stays live the whole time, so the offer adds value without adding a step.',
      media: slot(B, 'work-06', 'Adding Stellar to the bag on the Dr David Jack mobile store, then choosing two free samples from six.', 'Sample picker'),
    },
    {
      eyebrow: 'Clinic treatment page design',
      heading: 'Treatments as proper pages.',
      body: 'Treatments used to be long blog articles. Now each one opens with the price, Book now and Get in touch. A key information block follows, with icons for price, duration, discomfort, downtime and sessions. The commitment is clear before the patient reads on.',
      media: slot(B, 'work-07', 'A Dr David Jack facial treatment page on mobile, from the price and Book now down to the key information block.', 'Treatment page'),
    },
    {
      eyebrow: 'Clinic booking design',
      heading: 'Every way to book, on one screen.',
      body: 'Booking was a three-step wizard that hid the options. Now one overlay shows all four: send an enquiry, book online, book a skin consultation in clinic, or book a virtual consultation. It opens from a Book bar that stays at the foot of the page.',
      media: slot(B, 'work-08', 'The Dr David Jack booking overlay opening on mobile, with four ways to book on one screen.', 'Booking'),
    },
  ],
  // The one desktop 50/50, halfway: Dr Jack at work sticks while the desktop screens pass on the store's own
  // warm off-white. The treatments page joins by itself when split-desktop-4 is dropped in.
  splits: [desktopSplit(B, 'Dr David Jack', photoMedia(B, 'split-1-photo'), '#EDE6DC', 3, [
    { name: 'split-desktop-4', alt: 'The Dr David Jack treatments page on desktop, from the header down to its five treatment categories.', label: 'Treatments' },
  ], [
    'The Dr David Jack homepage on desktop, from the hero down to the first product panel.',
    'The Dr David Jack Shop All collection on desktop, from the header down to the first row of products.',
    'The Dr David Jack Stellar product page on desktop, from the buy box down to Who it’s for.',
  ])],
  bands: [
    {
      // The four concern colours, in the brand's own product photography. Follows the product page row,
      // one row after "One colour per concern" (the desktop 50/50 sits between them).
      after: 5, layout: 'grid', label: 'Dr David Jack product photography',
      photos: [
        pic('band-grid-1', 'A Dr David Jack Yellow Peel jar on a yellow set'),
        pic('band-grid-2', 'A Dr David Jack Stellar eye cream on red steps'),
        pic('band-grid-3', 'Dr David Jack Supernova and Afterglow on a green set'),
        pic('band-grid-4', 'A Dr David Jack Skin Cushion jar on a blue set'),
      ],
    },
  ],
  feature: {
    eyebrow: 'Shopify design system',
    heading: 'Twenty section types the client builds with.',
    body: 'Everything sits in one design system in Figma: 76 variables, 11 text styles, 47 icons and 20 Shopify section types, each with mobile and desktop variants. An All Sections template shows every one in place. In the built theme, the team can copy sections into new landing pages without a new design project.',
    media: slot(B, 'feature', 'The Dr David Jack clinics page on mobile, built from the section library.', 'Clinics page'),
  },
  // DUMMY (25 November 2026), so the section can be seen in place. These are not Jake's words. Swap in his
  // quote, or delete the block, before the page is launched.
  testimonial: {
    eyebrow: 'Dr David Jack testimonial',
    heading: 'In the client’s words.',
    quote: 'Placeholder quote. Two or three lines from Jake go here: what the brief needed, what it was like to work together, and what the new store has done for Dr David Jack since launch.',
    cite: 'Jake Heath, eCommerce Director, eComplete · 2026',
  },
  more: { ...MORE_HEADING, cards: moreFor('Dr David Jack') },
  enquiry: 'A shop and a service in one store?',
};
