// Dovecote Northumberland case study (21 November 2026). Copy from Anthony's brief in chat, checked
// against the live store and Tim's launch email to Deborah (29 October 2026). No copy doc for this one.
// Photos are Dovecote's own (Drive: Anthonyis Clients/Dovecote Northumberland/Client assets).
// Screens and recordings drop in by name: see src/assets/brands/README.md.
// No testimonial and no Results row yet: no quote, and no analytics access to compare periods.
import { SERVICE, BUILDER, slot, innovationSlot, innovationLink, photo, photoMedia, moreFor, breadcrumbs, MORE_HEADING, type CaseStudyPageData, desktopSplit } from './types';

const B = 'dovecote';
const PATH = '/work/dovecote-northumberland/';

export const DATA: CaseStudyPageData = {
  meta: {
    path: PATH,
    title: 'Dovecote Northumberland Shopify Case Study: Shop by Fragrance',
    description:
      'How I redesigned Dovecote Northumberland’s Shopify store inside its theme, so customers can shop its hand-poured candles and diffusers by scent.',
    breadcrumbs: breadcrumbs('Dovecote Northumberland', PATH),
  },
  client: { name: 'Dovecote Northumberland', url: 'https://www.dovecotenorthumberland.co.uk/', display: 'dovecotenorthumberland.co.uk' },
  hero: {
    eyebrow: 'Dovecote Northumberland Shopify case study',
    heading: 'Every scent, easy to find',
    standfirst:
      'Dovecote Northumberland hand pours luxury candles, diffusers and room sprays in its Alnwick studio, and sells them from its shop on Fenkle Street. I redesigned its Shopify store inside the existing theme, so customers can now shop the whole range by scent.',
    image: photoMedia(B, 'hero'),
  },
  brief: {
    eyebrow: 'Dovecote Northumberland Shopify brief',
    heading: 'Square pegs in a round theme',
    body: [
      'The Dovecote Northumberland store was built by its founder on Shopify’s Pipeline theme. It had taken the brand a long way, which says a lot about the products, but the theme was being asked to do things it wasn’t built for.',
      'Every scent sat in a dropdown on the product page. The first ask was to take the scents out of the button, but the real problem was finding them at all. With press in British Vogue and Living North on the way, the store also needed to look as calm and premium as the candles.',
    ],
  },
  details: {
    sector: 'Home',
    services: [SERVICE.theme, SERVICE.ux, SERVICE.cro],
    builtBy: BUILDER.cartmasters,
    live: 'October 2026',
    liveIso: '2026-10-29',
    rows: [{ label: 'Theme', value: 'Pipeline' }],
  },
  showcase: {
    label: 'Dovecote Northumberland screens',
    background: photo(B, 'showcase-photo'),
    desktop: slot(B, 'showcase-desktop', 'The Dovecote Northumberland store on desktop: the homepage, a fragrance family and a product page.', 'Desktop store recording'),
    phones: [
      slot(B, 'showcase-phone-1', 'The Dovecote Northumberland homepage on mobile.', 'Homepage'),
      slot(B, 'showcase-phone-2', 'The Dovecote Northumberland menu on mobile, with Shop by Fragrance open.', 'Navigation'),
      slot(B, 'showcase-phone-3', 'A Dovecote Northumberland fragrance family collection on mobile.', 'Fragrance family'),
      slot(B, 'showcase-phone-4', 'A Dovecote Northumberland product page on mobile.', 'Product page'),
    ],
  },
  workIntro: {
    eyebrow: 'Dovecote Northumberland theme customisation',
    heading: 'Restructured around the scent',
    body: 'The Dovecote Northumberland work started with a look across the whole store, rather than a full UX review. I refined the colour palette so text and buttons are accessible without losing the calm, then designed every section in Figma inside the theme, ready for the build.',
  },
  highlights: [
    {
      eyebrow: 'Shop by fragrance design',
      heading: 'Every scent out of the dropdown.',
      body: 'Finding a Dovecote scent used to mean opening a product and working through a dropdown. I restructured the range so every scent has its own product, grouped into five families and the Northumberland Collection. Customers start from the scent they love, not the product type.',
      link: innovationLink('See shop by scent', 'shop-by-scent'),
      media: innovationSlot('shop-by-scent', 'Dovecote Northumberland’s Shop by Fragrance on mobile, from the fragrance families to a family and a product.', 'Shop by fragrance recording'),
    },
    {
      eyebrow: 'Fragrance-led navigation',
      heading: 'Two ways in, and room for the season.',
      body: 'The Dovecote Northumberland menu uses the theme’s own design. My work was the structure: two ways in, Shop by Fragrance and Shop by Product, with a seasonal slot first, so Christmas gets the top spot without a rebuild.',
      media: slot(B, 'work-02', 'The Dovecote Northumberland menu on mobile, with Christmas, Shop by Fragrance and Shop by Product.', 'The menu recording'),
    },
    {
      eyebrow: 'Scent count product cards',
      heading: 'The choice shows before the click.',
      body: 'Each card on a Dovecote collection page says how many scents that product comes in, with a clear add to bag. Customers see the choice before they open a product, not after.',
      media: slot(B, 'work-03', 'Dovecote Northumberland product cards on mobile, each showing its number of scents and an add to bag button.', 'The collection recording'),
    },
    {
      eyebrow: 'Fragrance product page design',
      heading: 'Add to bag first, then every other scent.',
      body: 'The Dovecote Northumberland product page puts add to bag and the key messages high up, where people decide. The fragrance family sits above the title, a See all scents link sits under the scent name, and Complete the set offers the same scent as a candle, refill or oil.',
      link: innovationLink('See every scent, one tap away', 'every-scent-one-tap'),
      media: innovationSlot('every-scent-one-tap', 'A Dovecote Northumberland reed diffuser page on mobile, tapping See all 15 scents to open every scent.', 'The product page recording'),
    },
    {
      eyebrow: 'Proof-first homepage design',
      heading: 'The Google rating leads, the shop follows.',
      body: 'The Dovecote Northumberland homepage leads with proof, with the Google rating in the header. The selling points sit under the hero, hand poured in Northumberland and delivered across the UK, then clear signposts take customers into fragrances, products and gifts.',
      media: slot(B, 'work-05', 'The Dovecote Northumberland homepage on mobile, from the Google rating in the header to the collection signposts.', 'The homepage recording'),
    },
  ],
  // One 50/50 halfway through the work: the wax melts photo sticks at full height while desktop
  // screens scroll past on a tint taken from its marble. Drop in split-desktop-1 to -3.
  // Hero is the diffuser photo (21 November 2026), so the 50/50 moved to the wax melts.
  splits: [{ ...desktopSplit(B, 'Dovecote Northumberland', photoMedia(B, 'split-1-photo'), '#E6E4E0', 3, [], [
    'The Dovecote Northumberland homepage on desktop, from the Google rating in the header to the fragrance families.',
    'The Dovecote Northumberland Shop by Fragrance menu on desktop, with the five fragrance families.',
    'A Dovecote Northumberland product page on desktop, down to Complete the set.',
  ]), after: 2 }],
  // Trade (21 November 2026): built by Tim (Cartmasters), planned as part of the project. Anthony: "mostly Tim
  // but it has still been thought about". Page: /pages/become-a-stockist.
  feature: {
    eyebrow: 'Shopify trade and wholesale',
    heading: 'Stockists buy from the same store.',
    body: 'Dovecote Northumberland’s trade customers apply on the Become a Stockist page, as Wholesale or Hospitality, and a valid VAT number approves them straight away. They sign in with a code emailed to them, then see their own prices, postage and trade-only refills. Cartmasters built it, and it was planned into the store from the start.',
    media: slot(B, 'feature', 'The Dovecote Northumberland Become a Stockist page on mobile, choosing Wholesale or Hospitality and applying for trade pricing.', 'Trade screen'),
  },
  more: { ...MORE_HEADING, cards: moreFor('Dovecote Northumberland') },
  enquiry: 'Customers struggling to find the right product?',
};
