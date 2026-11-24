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
    rows: [{ label: 'My part', value: 'UX, wireframes, UI and prototypes. eComplete built the theme and runs the ongoing work.' }],
  },
  showcase: {
    label: 'Noted. Aromas designs',
    background: photo(B, 'showcase-photo'),
    desktop: slot(B, 'showcase-desktop', 'The Noted. Aromas store on desktop: the homepage, then the Women’s collection.', 'Desktop store'),
    phones: [
      slot(B, 'showcase-phone-1', 'The Noted. Aromas homepage on mobile, with trust messages and shopping routes in the header.', 'Homepage'),
      slot(B, 'showcase-phone-2', 'The Noted. Aromas Women’s collection on mobile, with sizes and Add to Basket on every card.', 'Collection'),
      slot(B, 'showcase-phone-3', 'A Noted. Aromas product page on mobile, from the price and sizes down to the scent notes.', 'Product page'),
      slot(B, 'showcase-phone-4', 'Filter & Sort opening from the bar at the bottom of a Noted. Aromas collection, then the scent families.', 'Filters'),
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
      media: slot(B, 'work-01', 'The Noted. Aromas mobile menu opening Women’s: a photo, then shop by occasion and by scent.', 'Menu'),
    },
    {
      // Added 24 November 2026 at Anthony's request. DRAFT copy: written from his description before the
      // live search could be checked. Sharpen with what the panel actually groups once the clip is recorded.
      eyebrow: 'Shopify search design',
      heading: 'Search that helps before you type.',
      body: 'Open search on a phone and the routes into the range are already there, grouped and ready to tap, before a single letter is typed. A shopper who knows the name types it. One who doesn’t still has somewhere to go.',
      media: slot(B, 'work-08', 'Search opening on the Noted. Aromas mobile store, with routes into the range grouped before anything is typed.', 'Search'),
    },
    {
      eyebrow: 'Shopify homepage design',
      heading: 'Full-portrait photography, the button always in reach.',
      body: 'The homepage is rebuilt around lifestyle photography. Section headings and buttons stick as you scroll, so images run full portrait and the call to action never leaves the screen. A Shop by Scent panel fits eight scent families into a strip 120px high. An image-led footer closes the page.',
      media: slot(B, 'work-02', 'The Noted. Aromas homepage on mobile: headings and buttons stay put while the portrait photos scroll past.', 'Homepage'),
    },
    {
      eyebrow: 'Collection page filtering',
      heading: 'Filters under the thumb, a next step in every grid.',
      body: 'This project was about discovery, so filtering leads. On mobile the filter bar is fixed to the bottom of every collection page, always one tap away. Shop by Scent and a quiz prompt sit inside the grid, so a shopper who stalls has somewhere to go. Intro copy and FAQs are structured for search engines and AI search.',
      media: slot(B, 'work-03', 'A Noted. Aromas collection on mobile: Shop by Scent and a quiz prompt in the grid, the filter bar fixed at the bottom.', 'Collection'),
    },
    {
      eyebrow: 'Quick add product cards',
      heading: 'Size, saving and basket, without leaving the grid.',
      body: 'Every card does a product page’s job. It names the designer fragrance it is inspired by and shows that original’s RRP. Each size shows its price and saving, with the top pick already selected. One more tap adds it to the basket. On desktop the size picker opens in place when you click.',
      media: slot(B, 'work-04', 'Picking 100ml on a Noted. Aromas product card and adding it, the basket sliding in.', 'Quick add'),
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
      body: 'For shoppers who arrive knowing nothing, the quiz does the selling. One question per screen, answers chosen in a tap, results that link straight to products. I designed the screen toolkit. eComplete built the full quiz from it.',
      media: slot(B, 'work-07', 'The Noted. Aromas fragrance quiz on mobile: who it is for, then one question per screen.', 'Quiz'),
    },
  ],
  // The one desktop 50/50, halfway: the Portofino clouds photo sticks while the desktop screens pass.
  // TO DO (24 November 2026): screen 2 becomes the desktop menu once recorded (drop it in as split-desktop-2
  // and change its alt below); the two collection clips side by side were too alike. The Christmas gift shop
  // joins as a fourth screen by itself when split-desktop-4 is dropped in.
  splits: [desktopSplit(B, 'Noted. Aromas', photoMedia(B, 'split-1-photo'), '#D3E3F3', 3, [
    { name: 'split-desktop-4', alt: 'The Noted. Aromas Christmas gift shop on desktop.', label: 'Christmas gift shop' },
  ], [
    'A Noted. Aromas collection on desktop, with filters across the top.',
    'Noted. Aromas product cards on desktop, from the Shop by Scent strip to the quiz tile in the grid.',
    'The Noted. Aromas Monte Carlo product page on desktop, down to the scent notes.',
  ])],
  // The brand's shoot, between the work rows (23 November 2026). Alt text never names another brand.
  bands: [
    {
      after: 3, layout: 'grid', label: 'Noted. Aromas Sweet State photography',
      photos: [
        pic('band-grid-1', 'A Santa Barbara bottle in a pink cocktail glass, held to the lips'),
        pic('band-grid-2', 'A Santa Barbara bottle revealed under a silver cloche on pink'),
        pic('band-grid-3', 'A Palm Springs bottle in melting pink marshmallow'),
        pic('band-grid-4', 'A Palm Springs 5ml bottle in a pink drink'),
      ],
    },
    {
      after: 6, layout: 'drift', label: 'Noted. Aromas fragrance photography',
      photos: [
        pic('band-drift-1', 'Ankara on crushed ice with pink grapefruit'),
        pic('band-drift-2', 'Havana among star anise, dried orange and cinnamon'),
        pic('band-drift-3', 'Ankara among raspberries, sage and fig leaves'),
        pic('band-drift-4', 'Monte Carlo on a bed of jasmine flowers'),
        pic('band-drift-5', 'Zanzibar on crushed ice with lemons'),
        pic('band-drift-6', 'Sofia among spring flowers and ferns'),
        pic('band-drift-7', 'Doha on a bunch of roses'),
        pic('band-drift-8', 'Three bottles among orange poppies'),
        pic('band-drift-9', 'Lisbon floating above a hand against a blue sky'),
        pic('band-drift-10', 'Portofino on a striped sun lounger with coffee and the paper'),
        pic('band-drift-11', 'Zanzibar on coiled rope on a beach'),
        pic('band-drift-12', 'Havana held up to a blue sky'),
        pic('band-drift-13', 'A Noted. Aromas bottle in a straw bag in a meadow'),
        pic('band-drift-14', 'Rome on the boot of a classic car with coffees'),
        pic('band-drift-15', 'Riyadh held in both hands on a white towel'),
        pic('band-drift-16', 'Riyadh in a wooden tray with a drink'),
      ],
    },
    {
      after: 8, layout: 'mosaic', label: 'Noted. Aromas night photography',
      photos: [
        pic('band-mosaic-1', 'Monte Carlo held out of a car window at night'),
        pic('band-mosaic-2', 'Saint-Tropez held in both hands on dark green'),
        pic('band-mosaic-3', 'Monte Carlo sprayed on the neck'),
        pic('band-mosaic-4', 'Doha held by a woman relaxing at a café table'),
      ],
    },
  ],
  feature: {
    eyebrow: 'Shopify design system',
    heading: 'Campaign pages without a new design project.',
    body: 'Everything sits in one mobile-first design system in Figma: type, colour, components and page blocks. The brand team can combine blocks to build campaign pages without commissioning new designs each time.',
    media: slot(B, 'feature', 'The Noted. Aromas Christmas gift shop on mobile, a campaign page on the live store.', 'Campaign page'),
  },
  // Testimonial: Jake Heath, eCommerce Director, eComplete. Quote to come; the page goes live without it.
  more: { ...MORE_HEADING, cards: moreFor('Noted. Aromas') },
  enquiry: 'Great products, hard to find?',
};
