// Alt text for photos, tiles and screens that render through shared components (cards, heroes,
// case study photos, article tiles), keyed by the file's path under src/assets. One line per file,
// so a photo has the same alt text on every page it appears on (4 November 2026).
// Alt text set in a page's own data (case study screens, article body images, innovations) wins
// over this list. A file that isn't here renders with empty alt.
import type { ImageMetadata } from 'astro';

export const ALT_TEXT: Record<string, string> = {
  // Article tiles: the hero on each article, the card everywhere else
  'articles/25-biggest-brands-using-shopify-in-2025/tile.png': 'Gymshark, Fenty Beauty and Kylie Cosmetics Shopify store homepages',
  'articles/benefits-of-shopify-plus/tile.png': 'Shopify Plus logo on a dark background',
  'articles/generative-engine-optimisation-shopify/tile.png': 'AI assistant logos above an Ask me anything search bar',
  'articles/good-conversion-rate-shopify/tile.png': 'Shopify logo beside a rising conversion rate line',
  'articles/how-to-design-a-shopify-website-2026/tile.png': 'Projektityyny and Hartnack & Co Shopify store designs on mobile',
  'articles/how-to-increase-conversion-rates-on-your-shopify-store/tile.png': 'A rising conversion rate line in blue and white',
  'articles/klaviyo-pricing-2026-complete-breakdown-for-shopify-stores/tile.png': 'The Drink Finder Shopify store on mobile beside the Klaviyo logo',
  'articles/microinteractions-in-shopify-website-design/tile.png': 'A hand tapping a blue button, a Shopify microinteraction',
  'articles/product-comparisons-for-shopify-stores-how-better-ux-boosts-conversions/tile.png': 'Two Wide Fit Shoes product cards side by side, comparing New Balance trainers',
  'articles/shopify-agentic-storefronts/tile.png': 'An AI shopping prompt asking for trainers, beside a product card with an Add to Bag button',
  'articles/shopify-collabs-in-2025-harnessing-the-creator-economy-for-growth/tile.png': 'Shopify logo above Instagram, TikTok, YouTube and Facebook icons',
  'articles/shopify-pricing-2026/tile.png': 'Shopify logo with a blue 2026 price tag',
  'articles/shopify-product-card-design/tile.png': 'East at Home, Thameen London and Drink Finder Shopify product card designs',
  'articles/shopify-ux-review/tile.png': 'A Miro board from a Shopify UX review, with sticky note annotations on mobile screens',
  'articles/shopify-vs-shopify-plus/tile.png': 'Shopify versus Shopify Plus logos',
  'articles/shortlisted-uk-ecommerce-awards-2026/tile.png': 'UK eCommerce Awards 2026 winner badge',
  'articles/strategies-for-your-homeware-lifestyle-shopify-store/tile.png': 'A stone basin and brass tap in a styled homeware bathroom',
  'articles/voice-search-optimisation-for-shopify-stores-a-complete-2025-guide/tile.png': 'A blue microphone icon for voice search',
  'articles/what-is-a-shopify-partner/tile.png': 'Shopify Partners badge with 2026 in blue',
  'articles/what-makes-a-good-landing-page/tile.png': 'Hartnack & Co, Wide Fit Shoes and Whistlefish Shopify landing pages on mobile',
  // Old WordPress alt text kept: this image ranked first in Google Images for "best shopify designer in the uk"
  'articles/why-conversion-rate-optimisation-is-still-a-human-skill/tile.png': 'A Nike product card with a 7.5% increase in sales',
  'articles/why-off-the-shelf-shopify-themes-hold-stores-back-in-2025/tile.png': 'A grid of Shopify theme demo homepages',

  // Article video stills (the caption under each says what the recording shows)
  'articles/product-comparisons-for-shopify-stores-how-better-ux-boosts-conversions/1-casper-poster.jpg': 'The Casper mattress comparison page on a phone',
  'articles/product-comparisons-for-shopify-stores-how-better-ux-boosts-conversions/3-drink-finder-poster.jpg': 'The Drink Finder wine collection on a phone, with extra product details showing',
  'articles/shopify-ux-review/drinkfind-ux-review-poster.jpg': 'A Drink Finder whisky page on mobile, on a Miro UX review board',
  'articles/shopify-ux-review/fuzzball-ux-review-poster.jpg': 'The Fuzzball homepage on mobile, on a Miro UX review board',

  // Case study cards: the photo
  'brands/dr-lipp/card.jpg': 'Black and white Dr Lipp campaign photo of four women sitting side by side, seen from behind',
  'brands/drink-finder/card.jpg': 'Blood orange cocktails and gin bottles on a green tablecloth, from Drink Finder',
  'brands/east-at-home/card.jpg': 'A bowl of East at Home curry with a knife and fork on a grey cloth',
  'brands/east-west-apparel/card.jpg': 'East West Apparel jeans and black leather boots, worn with a bandana',
  'brands/fuzzball/card.jpg': 'A Fuzzball chicken and salmon cat food pouch with kibble spilling out, on a pink background',
  'brands/hartnack-and-co/card.jpg': 'A Hartnack & Co bespoke folder beside a bottle of wine and a glass of whisky',
  'brands/jing-tea/card.jpg': 'Tea pickers working across green tea fields, from JING Tea',
  'brands/projektityyny/card.jpg': 'A woman holding an armful of Projektityyny cushions and throws',
  'brands/thameen/card.jpg': 'Thameen London blue fragrance bottles stacked on a dark purple set',
  'brands/thameen/bottles.jpg': 'Thameen London blue fragrance bottles stacked on a dark purple set',
  'brands/whistlefish/card.jpg': 'A hand holding Whistlefish greeting cards in a woodland',
  'brands/wide-fit-shoes/card.jpg': 'Red New Balance trainers from Wide Fit Shoes on a covered walkway',
  'brands/window-fleur/card.jpg': 'A Window Fleur window box full of yellow, purple and orange pansies',

  // Case study cards: the store on the phone beside the photo
  'brands/dr-lipp/card-screen.jpg': 'The Dr Lipp All Ways product page on mobile',
  'brands/drink-finder/card-screen.jpg': 'The Drink Finder Shopify homepage on mobile',
  'brands/east-at-home/card-screen.jpg': 'The East at Home Shopify homepage on mobile',
  'brands/east-west-apparel/card-screen.jpg': 'The East West Apparel Shopify homepage on mobile, featuring Double Helix boots',
  'brands/fuzzball/card-screen.jpg': 'The Fuzzball cat food subscription homepage on mobile',
  'brands/hartnack-and-co/card-screen.jpg': 'The Hartnack & Co Shopify homepage on mobile',
  'brands/jing-tea/card-screen.jpg': 'The JING Tea homepage on mobile',
  'brands/projektityyny/card-screen.jpg': 'The Projektityyny Shopify homepage on mobile',
  'brands/thameen/card-screen.jpg': 'The Thameen London Shopify homepage on mobile',
  'brands/whistlefish/card-screen.jpg': 'The Whistlefish Shopify homepage on mobile, with a 20 for £20 luxury cards offer',
  'brands/wide-fit-shoes/card-screen.jpg': 'The Wide Fit Shoes Shopify homepage on mobile',
  'brands/window-fleur/card-screen.jpg': 'The Window Fleur Shopify homepage on mobile',

  // Case study pages: the photo behind the showcase screens
  'brands/dr-lipp/showcase-photo.jpg': 'A woman with curly hair looking over her shoulder, from Dr Lipp',
  'brands/east-at-home/showcase-photo.jpg': 'East at Home curries served with rice in copper bowls',
  'brands/east-west-apparel/showcase-photo.jpg': 'A man in a black leather jacket, from East West Apparel',
  'brands/fuzzball/showcase-photo.jpg': 'A ginger cat reaching up out of a blue Fuzzball food bowl',
  'brands/hartnack-and-co/showcase-photo.jpg': 'An open book resting on a Hartnack & Co leather binder',
  'brands/projektityyny/showcase-photo.jpg': 'Projektityyny quilts draped across a grand room',
  'brands/thameen/showcase-photo.jpg': 'Thameen London fragrances with flowers, a butterfly and coral',
  'brands/whistlefish/showcase-photo.jpg': 'A woman holding a Whistlefish St Ives print above the harbour',
  'brands/wide-fit-shoes/showcase-photo.jpg': 'A grey New Balance trainer from Wide Fit Shoes, mid stride',
  'brands/window-fleur/showcase-photo.jpg': 'Orange, pink and yellow coneflowers in bloom, from Window Fleur',

  // Case study pages: the photo in the 50/50
  'brands/dr-lipp/split-1-photo.jpg': 'A smiling woman washing her face, from Dr Lipp',
  'brands/east-at-home/split-1-photo.jpg': 'Whole spices and dried chillies in a spice tin, from East at Home',
  'brands/east-west-apparel/split-1-photo.jpg': 'A suede shirt and leather belt worn with jeans, from East West Apparel',
  'brands/fuzzball/split-1-photo.jpg': 'A fluffy kitten reaching up on a mint green background, from Fuzzball',
  'brands/hartnack-and-co/split-1-photo.jpg': 'Close-up of a pink Hartnack & Co binder spine',
  'brands/projektityyny/split-1-photo.jpg': 'Two girls in white dresses throwing a Projektityyny cushion in the air',
  'brands/thameen/split-1-photo.jpg': 'Three Thameen London blue fragrance bottles reflected on a blue set',
  'brands/whistlefish/split-1-photo.jpg': 'A hand holding a Whistlefish birthday card above a sea cliff',
  'brands/wide-fit-shoes/split-1-photo.jpg': 'A woman in neon green trainers on wooden steps among plants, from Wide Fit Shoes',
  'brands/window-fleur/split-1-photo.jpg': 'Pink and white daisies in bloom, from Window Fleur',

  // Case study heroes and Drink Finder's photos
  'brands/drink-finder/hero.jpg': 'A man relaxing on a teal sofa with a pineapple cocktail, from Drink Finder',
  'brands/drink-finder/split-photo.jpg': 'An Aperol spritz with a slice of orange, from Drink Finder',
  'brands/drink-finder/vineyard.jpg': 'A vineyard at sunset',
  'brands/projektityyny/hero.webp': 'A woman carrying Projektityyny striped bags on a pebble beach',

  // Service heroes (services page cards and each service page)
  'site/services/hero-ai-search.jpg': 'Abstract purple and pink light on dark glass',
  'site/services/hero-bespoke.jpg': 'An open book resting on a Hartnack & Co leather binder',
  'site/services/hero-branding.jpg': 'Abstract orange and teal light',
  'site/services/hero-cro.jpg': 'A stack of freshly cooked naan breads on a wooden board',
  'site/services/hero-migrations.jpg': 'A woman tasting wine beside a bottle of Bollinger champagne',
  'site/services/hero-subscriptions.jpg': 'A Fuzzball chicken, tuna and salmon cat food pouch with kibble spilling out, on a yellow background',
  'site/services/hero-theme.jpg': 'Three Thameen London blue fragrance bottles reflected on a blue set',
  'site/services/hero-ux.jpg': 'A hand holding a greeting card and dried pink flowers',
  'site/services/service-hero-poster.jpg': 'A woman holding yellow fabric up against a blue sky',

  // Homepage
  // Starts with the old WordPress alt text of the showreel cover, which ranked for Shopify designer searches
  'site/showreel-poster.jpg': 'Anthony is Freelance Shopify web designer showreel: a woman in sunglasses and a black jacket',
  'site/services-section.jpg': 'A person in pink glasses reaching towards the camera under red light',
  'site/success-stories.jpg': 'A woman in a floral apron leaning against a log pile',
};

// Every image under src/assets, so an imported image can be traced back to its file. Vite gives an
// import and a glob of the same file the same module, so the lookup is by identity.
const ALL = import.meta.glob<{ default: ImageMetadata }>('../assets/**/*.{jpg,jpeg,png,webp,avif}', { eager: true });
const PATHS = new Map<ImageMetadata, string>(Object.entries(ALL).map(([k, m]) => [m.default, k.replace('../assets/', '')]));

/** Alt text for an image under src/assets, or '' when it has none. */
export function altFor(image?: ImageMetadata): string {
  if (!image) return '';
  const path = PATHS.get(image);
  return path ? ALT_TEXT[path] ?? '' : '';
}
