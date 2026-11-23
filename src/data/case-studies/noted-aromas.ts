// Noted. Aromas case study. Copy from the "Case study copy: Noted. Aromas" doc (rev 12, 23 November 2026).
// Every screen is a signed-off Figma design (Noted Design System file), not the live store, which
// runs part of the design and a Black Friday sale state. Lifestyle photos are the brand's own shoot.
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
    heading: 'Scent discovery for a brand with 1M+ customers',
    standfirst:
      'Noted. Aromas is a Durham fragrance brand selling designer-inspired perfumes and aftershaves, made in the UK, to more than a million customers. The brand had outgrown its Shopify theme. Working with eComplete, I designed a bespoke store around one job: helping shoppers find the right scent in a big range.',
    // The brand's claw machine film, played forwards then backwards so the loop has no jump.
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
    desktop: slot(B, 'showcase-desktop', 'The Noted. Aromas homepage design on desktop, led by a full-width lifestyle photo.', 'Desktop homepage'),
    phones: [
      slot(B, 'showcase-phone-1', 'The Noted. Aromas homepage design on mobile, with trust messages and shopping routes in the header.', 'Homepage'),
      slot(B, 'showcase-phone-2', 'The Noted. Aromas mobile menu design, sorted by gender, occasion, scent and mood.', 'Menu'),
      slot(B, 'showcase-phone-3', 'A Noted. Aromas product page design on mobile, with the size choice and price per ml.', 'Product page'),
      slot(B, 'showcase-phone-4', 'The Noted. Aromas filter and sort design on mobile.', 'Filters'),
    ],
  },
  workIntro: {
    eyebrow: 'Noted. Aromas Shopify store design',
    heading: 'Every route leads to a scent',
    body:
      'Shoppers arrive knowing a designer fragrance, a mood, or nothing at all. Each one gets a short route to a bottle, and all of it works one-handed on a phone. No single feature carries this store. It is a lot of small decisions pulling the same way. The screens here are the signed-off designs.',
  },
  highlights: [
    {
      eyebrow: 'Shopify navigation design',
      heading: 'A menu that sells as well as sorts.',
      body: 'I designed a bespoke header that puts trust and shopping routes first. The mobile menu is rebuilt around how people choose a fragrance: who it is for, the occasion and the scent family. The second level brings in the brand’s own photography.',
      media: slot(B, 'work-01', 'The Noted. Aromas mobile menu design, second level, with a photo for Women’s and shop by occasion and scent.', 'Menu design'),
    },
    {
      eyebrow: 'Shopify homepage design',
      heading: 'Photography that runs full portrait.',
      body: 'The homepage is rebuilt around lifestyle photography. Section headings and buttons stick as you scroll, so images can run full portrait while the call to action stays on screen. A Shop by Scent panel fits eight scent families into a strip 120px high. An image-led footer closes the page.',
      media: slot(B, 'work-02', 'The Noted. Aromas homepage design on mobile: the Sweet State collection, the Shop by Scent strip and As worn by.', 'Homepage design'),
    },
    {
      eyebrow: 'Collection page filtering',
      heading: 'Filters always under the thumb.',
      body: 'This project was about discovery, so filtering leads. On mobile the filter bar is fixed to the bottom of every collection page. Editorial sections and a quiz prompt break up long grids. Intro copy and FAQs are structured for search engines and AI search.',
      media: slot(B, 'work-03', 'A Noted. Aromas collection page design on mobile, with a quiz prompt in the grid and the filter bar fixed at the bottom.', 'Collection design'),
    },
    {
      eyebrow: 'Quick add product cards',
      heading: 'Pick a size without leaving the grid.',
      body: 'Each card lets you pick a size and add to basket without opening the product page. Every size shows its price and saving, with the designer original’s RRP beside it for comparison. On desktop the size picker opens in place when you click.',
      media: slot(B, 'work-04', 'The Noted. Aromas add to basket sheet on mobile: 5ml, 50ml and 100ml, each with its price per ml.', 'Quick add design'),
    },
    {
      eyebrow: 'Fragrance product page design',
      heading: 'Lead with the scent it’s inspired by.',
      body: 'Product pages lead with the fragrance it is inspired by, price per ml and a clear size choice. Notes are grouped under their scent family. The live pages use part of what I designed so far.',
      media: slot(B, 'work-05', 'A Noted. Aromas product page design on mobile: sizes with price per ml, free gift progress and add to basket.', 'Product page design'),
    },
    {
      eyebrow: 'Shopify basket design',
      heading: 'Every offer, one step at a time.',
      body: 'The basket is cleaner and works harder. Stepped progress shows which offer you have unlocked and how far you are from the next, free delivery included. I designed the steps around a free gift threshold. The live store adapts them for sale events. Recommendations add in one tap.',
      media: slot(B, 'work-06', 'The Noted. Aromas basket design on mobile, with free gift and free delivery steps above the products.', 'Basket design'),
    },
    {
      eyebrow: 'Fragrance quiz design',
      heading: 'One question, one tap.',
      body: 'I designed the screen toolkit for the quiz: one question per screen, answers chosen in a tap, results that link straight to products. eComplete built the full quiz from it.',
      media: slot(B, 'work-07', 'A Noted. Aromas fragrance quiz screen design: what are you shopping for, with four photo answers.', 'Quiz design'),
    },
  ],
  // The one desktop 50/50, halfway: the Portofino clouds photo sticks while three desktop designs pass.
  splits: [desktopSplit(B, 'Noted. Aromas', photoMedia(B, 'split-1-photo'), '#D3E3F3', 3, [], [
    'The Noted. Aromas collection page design on desktop, with filters across the top.',
    'Noted. Aromas product cards on desktop, with a Not sure what to choose quiz tile in the grid.',
    'The Noted. Aromas Monte Carlo product page design on desktop.',
  ])],
  // The brand's shoot, between the work rows (23 November 2026). Alt text never names another brand.
  bands: [
    {
      after: 2, layout: 'grid', label: 'Noted. Aromas Sweet State photography',
      photos: [
        pic('band-grid-1', 'A Santa Barbara bottle in a pink cocktail glass, held to the lips'),
        pic('band-grid-2', 'A Santa Barbara bottle revealed under a silver cloche on pink'),
        pic('band-grid-3', 'A Palm Springs bottle in melting pink marshmallow'),
        pic('band-grid-4', 'A Palm Springs 5ml bottle in a pink drink'),
      ],
    },
    {
      after: 5, layout: 'drift', label: 'Noted. Aromas fragrance photography',
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
      after: 7, layout: 'mosaic', label: 'Noted. Aromas night photography',
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
    heading: 'Blocks the team builds campaigns with.',
    body: 'Everything sits in one mobile-first design system in Figma: type, colour, components and page blocks. The brand team can combine blocks to build campaign pages without commissioning new designs each time.',
    media: slot(B, 'work-08', 'Noted. Aromas promo tiles from the design system, the Lille collection repeated as a campaign block.', 'Design system'),
  },
  // Testimonial: Jake Heath, eCommerce Director, eComplete. Quote to come; the page goes live without it.
  more: { ...MORE_HEADING, cards: moreFor('Noted. Aromas') },
  enquiry: 'Great products, hard to find?',
};
