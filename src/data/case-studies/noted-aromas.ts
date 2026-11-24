// Noted. Aromas case study. Copy from the "Case study copy: Noted. Aromas" doc (rev 12, 23 November 2026).
// Every screen is recorded from the live store (24 November 2026, in its Black Friday state; re-record
// after the sale with Record Noted Aromas.command). Lifestyle photos are the brand's own shoot.
// Words never used on this page: dupe, replica, clone. Say "designer-inspired".
import { SERVICE, BUILDER, slot, photo, photoMedia, moreFor, breadcrumbs, MORE_HEADING, desktopSplit, type CaseStudyPageData, type Media } from './types';
import { brandImage, brandVideo } from '../media';

const B = 'noted-aromas';
const PATH = '/work/noted-aromas/';
const pic = (name: string, alt: string): Media => ({ image: brandImage(B, name), alt, label: 'Photo' });

export const DATA: CaseStudyPageData = {
  meta: {
    path: PATH,
    title: 'Noted. Aromas Shopify Case Study: Bespoke Design for a 1M+ Customer Brand',
    description:
      'Bespoke Shopify design for Noted. Aromas, the designer-inspired fragrance brand with 1M+ customers. UX and UI built around scent discovery, in partnership with eComplete.',
    breadcrumbs: breadcrumbs('Noted. Aromas', PATH),
  },
  client: { name: 'Noted. Aromas', url: 'https://notedaromas.co.uk/', display: 'notedaromas.co.uk' },
  hero: {
    eyebrow: 'Noted. Aromas Shopify case study',
    // PLACEHOLDER: XX% is not a real figure. Anthony is asking Jake Heath (eComplete) for a product
    // discovery stat. Do not go live with XX%. Without a figure, delete `figure` and use the heading
    // 'Scent discovery for a brand with 1M+ customers'.
    figure: 'XX%',
    heading: 'more shoppers finding their scent',
    standfirst:
      'Noted. Aromas is a Durham fragrance brand selling designer-inspired perfumes and aftershaves, made in the UK, to more than a million customers. The brand had outgrown its Shopify theme. Working with eComplete, I designed a bespoke store where every screen has a job: prove the value, shorten the route to a bottle and raise the basket.',
    // The brand's claw machine film, cut to one full sway (frames 39 to 101 of the original, 2.6s):
    // the last frame runs into the first, so it loops with no jump and no reverse.
    image: {
      image: photo(B, 'hero'),
      video: brandVideo(B, 'hero'),
      alt: 'Three Noted. Aromas bottles held by a claw over a machine full of pink sweets',
      label: 'Hero film',
    },
  },
  brief: {
    eyebrow: 'Noted. Aromas Shopify brief',
    heading: 'Make a big range easy to shop, and look the part',
    body: [
      'The brand had outgrown its theme. Collection pages were flat lists, there was no guided way to find a scent, and strong product photography had nowhere to go.',
      'The brief asked for a bespoke Shopify theme: cleaner, more premium, mobile first, with building blocks the team could reuse for campaigns. eComplete’s CRO review pointed at product discovery as the gap, so discovery led the UX. Kickoff to signed-off mobile and desktop designs took under seven weeks.',
    ],
  },
  details: {
    sector: 'Beauty',
    services: [SERVICE.bespoke, SERVICE.ux, SERVICE.cro],
    builtBy: BUILDER.ecomplete,
    // TBC: the month the bespoke theme went live (doc, 23 November 2026).
    live: '2026',
    // No extra rows. "My part" came out (24 November 2026): every case study here is design only, so no
    // other page says it. A Results row goes here once Jake has a figure.
    rows: [],
  },
  showcase: {
    label: 'Noted. Aromas designs',
    background: photo(B, 'showcase-photo'),
    desktop: slot(B, 'showcase-desktop', 'The Noted. Aromas store on desktop: the homepage, then the Women’s collection.', 'Desktop store'),
    phones: [
      slot(B, 'showcase-phone-1', 'The Noted. Aromas homepage on mobile, with trust messages and shopping routes in the header.', 'Homepage'),
      slot(B, 'showcase-phone-2', 'The Noted. Aromas Women’s collection on mobile, with sizes and Add to Basket on every card.', 'Collection'),
      // Always still, recording, still, recording (24 November 2026). Phone 3 is a still, so it must
      // never have a showcase-phone-3.mp4 beside it.
      slot(B, 'showcase-phone-3', 'The Noted. Aromas mobile menu inside Women’s: a photo, then shop by occasion and by scent.', 'Menu'),
      slot(B, 'showcase-phone-4', 'A Noted. Aromas product page on mobile, from the price and sizes down to the scent notes.', 'Product page'),
    ],
  },
  workIntro: {
    eyebrow: 'Noted. Aromas Shopify store design',
    heading: 'Conversion designed in, not bolted on',
    body:
      'Most stores add conversion features after launch. This one was designed around them. Trust sits in the header. The price comparison sits on every card. Size, saving and add to basket are one tap apart. The basket shows the next offer before you ask. Shoppers arrive knowing a designer fragrance, a mood, or nothing at all, and each one gets a short route to a bottle, one-handed on a phone.',
  },
  highlights: [
    {
      eyebrow: 'Shopify navigation design',
      heading: 'A header that sells before you scroll.',
      body: 'The bespoke header puts proof first: customer numbers, delivery, the guarantee and reviews all sit above the first image. The mobile menu is rebuilt around how people choose a fragrance: who it is for, the occasion and the scent family. The second level brings in the brand’s own photography, so the menu sells as well as sorts.',
      media: slot(B, 'work-01', 'The Noted. Aromas header on mobile, then the menu opening and going into Women’s: a photo, then shop by occasion and by scent.', 'Header and menu'),
    },
    {
      // Added 24 November 2026 at Anthony's request. Copy checked against the live search panel the same day.
      eyebrow: 'Shopify search design',
      heading: 'Search that helps before you type.',
      body: 'Open search on a phone and the routes into the range are already there, before a single letter is typed. Gender, occasion and scent family sit as one-tap groups, with the bestsellers underneath. A shopper who knows a designer fragrance types its name and the match comes up first, with its rating and price. One who doesn’t still has somewhere to go.',
      media: slot(B, 'work-08', 'Search on the Noted. Aromas mobile store: gender, occasion and scent family groups, then a search for a designer fragrance bringing up its match.', 'Search'),
    },
    {
      eyebrow: 'Shopify homepage design',
      heading: 'Full-portrait photography, the button always in reach.',
      body: 'The homepage is rebuilt around lifestyle photography. Section headings and buttons stick as you scroll, so images run full portrait and the call to action never leaves the screen. A Shop by Scent panel fits eight scent families into a strip 120px high. An image-led footer closes the page.',
      media: slot(B, 'work-02', 'The Noted. Aromas homepage on mobile: headings and buttons stay put while the portrait photos scroll past, down to the product cards.', 'Homepage'),
    },
    {
      eyebrow: 'Collection page filtering',
      heading: 'Filters under the thumb, a next step in every grid.',
      // FIGURES NEED JAKE'S OK (24 November 2026). 5.8%, 87.7%, 4.7% and 21.5% are from eComplete's CRO
      // scorecard (last 30 days on the old store), which is theirs and not public. Anthony asked for them here.
      // If Jake says no, the fallback first lines are: 'The old store sold well to shoppers who knew what
      // they wanted. Cold traffic was the leak: most visits never reached the basket.'
      body: 'The old store already converted at 5.8%, about twice the average for fragrance. Shoppers who knew what they wanted bought. The leak was earlier: 87.7% of visits never reached the basket, and cold traffic from social added to basket at 4.7%, against 21.5% from search. So the collection page stopped being a list. On mobile the filter bar is fixed to the bottom of every collection, always one tap away. Shop by Scent and a quiz prompt sit inside the grid, so a shopper who stalls has somewhere to go. Intro copy and FAQs are structured for search engines and AI search.',
      media: slot(B, 'work-03', 'A Noted. Aromas collection on mobile: Shop by Scent and a quiz prompt in the grid, the filter bar fixed at the bottom.', 'Collection'),
    },
    {
      eyebrow: 'Quick add product cards',
      heading: 'Size, saving and basket, without leaving the grid.',
      // 24 November 2026: the clip is about the card, not the basket. The live cards have changed since launch
      // (the theme carries three card versions; the store shows the size picker), so this copy was checked
      // against the live card that day. The desktop line about a picker opening on click came out: on desktop
      // the sizes sit on the card too.
      body: 'Every card does a product page’s job. It names the designer fragrance it is inspired by and shows that original’s RRP. Each size shows its price and saving, with the top pick already selected. One more tap adds it to the basket. The card is the same on desktop: sizes in view, nothing to open.',
      media: slot(B, 'work-04', 'Choosing between 5ml, 50ml and 100ml on a Noted. Aromas product card, each size with its price and saving.', 'Product card'),
    },
    {
      eyebrow: 'Fragrance product page design',
      heading: 'The value case, made in the first screen.',
      body: 'Product pages lead with the fragrance it is inspired by, the price against the original’s RRP and the price per ml. The size choice is clear and the top pick is marked. Notes are grouped under their scent family. The live pages use part of what I designed so far.',
      media: slot(B, 'work-05', 'A Noted. Aromas product page on mobile: price against the RRP, sizes, then notes grouped by scent family.', 'Product page'),
    },
    {
      eyebrow: 'Shopify basket design',
      heading: 'A basket that raises the order.',
      body: 'Stepped progress shows which offer you have unlocked and exactly what the next one takes, free delivery included. Recommendations add in one tap, without leaving the basket. I designed the steps around a free gift threshold. The live store adapts them for sale events.',
      media: slot(B, 'work-06', 'The Noted. Aromas basket on mobile: the offer steps fill as the quantity goes from one to three.', 'Basket'),
    },
    {
      eyebrow: 'Fragrance quiz design',
      heading: 'From no idea to a shortlist in a few taps.',
      body: 'For shoppers who arrive knowing nothing, the quiz does the selling. One question per screen, answers chosen in a tap, then three matches that add straight to the basket. I designed the screen toolkit. eComplete built the full quiz from it.',
      media: slot(B, 'work-07', 'The Noted. Aromas fragrance quiz on mobile from start to finish: five questions, an email, then three matched fragrances.', 'Quiz'),
    },
  ],
  // The one desktop 50/50, halfway: the Portofino clouds photo sticks while the desktop screens pass.
  // Order (24 November 2026): homepage, collection, product page, Christmas gift shop. Until split-desktop-1
  // is recorded, screen 1 shows the homepage still from the showcase. The Christmas gift shop joins by itself
  // when split-desktop-4 is dropped in.
  splits: [desktopSplit(B, 'Noted. Aromas', photoMedia(B, 'split-1-photo'), '#D3E3F3', 3, [
    { name: 'split-desktop-4', alt: 'The Noted. Aromas Christmas gift shop on desktop: gifts by price, then by who they are for.', label: 'Christmas gift shop' },
  ], [
    'The Noted. Aromas homepage on desktop, from the hero down to the product cards.',
    'A Noted. Aromas collection on desktop, with filters across the top.',
    'The Noted. Aromas Monte Carlo product page on desktop, down to the scent notes.',
  ])],
  // The brand's shoot, between the work rows (23 November 2026). Alt text never names another brand.
  bands: [
    {
      // Three photos, 2px apart. Phones: the first full width, the other two side by side (24 November 2026).
      after: 3, layout: 'trio', label: 'Noted. Aromas Sweet State photography',
      photos: [
        pic('band-grid-1', 'A Santa Barbara bottle in a pink cocktail glass, held to the lips'),
        pic('band-grid-2', 'A Santa Barbara bottle revealed under a silver cloche on pink'),
        pic('band-grid-3', 'A Palm Springs bottle in melting pink marshmallow'),
      ],
    },
    {
      // Moved up one, to sit before the quiz (24 November 2026). The fourth photo was a daytime café shot;
      // it is now the other night-flash car photo, cropped wide from the portrait original.
      after: 7, layout: 'mosaic', label: 'Noted. Aromas night photography',
      photos: [
        pic('band-mosaic-1', 'Monte Carlo held out of a car window at night'),
        pic('band-mosaic-2', 'Saint-Tropez held in both hands on dark green'),
        pic('band-mosaic-3', 'Monte Carlo sprayed on the neck'),
        pic('band-mosaic-4', 'Palm Springs held in lace-gloved hands at a car window at night'),
      ],
    },
  ],
  feature: {
    eyebrow: 'Shopify design system',
    heading: 'Campaign pages without a new design project.',
    body: 'Everything sits in one mobile-first design system in Figma: type, colour, components and page blocks. The brand team can combine blocks to build campaign pages without commissioning new designs each time.',
    media: slot(B, 'feature', 'The Noted. Aromas Christmas gift shop on mobile, a campaign page on the live store.', 'Campaign page'),
  },
  // DUMMY (24 November 2026), so the section can be seen in place. These are not Jake's words. Swap in his
  // quote, or delete the block, before the page is launched.
  testimonial: {
    eyebrow: 'Noted. Aromas testimonial',
    heading: 'In the client’s words.',
    quote: 'Placeholder quote. Two or three lines from Jake go here: what the brief needed, what it was like to work together, and what the new store has done for Noted. Aromas since launch.',
    cite: 'Jake Heath, eCommerce Director, eComplete · 2026',
  },
  more: { ...MORE_HEADING, cards: moreFor('Noted. Aromas') },
  enquiry: 'Great products, hard to find?',
};
