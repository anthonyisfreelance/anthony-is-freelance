// Brand and campaign projects outside Shopify: Dyson and Wrangler (one page per brand, two projects each)
// and the identity work behind the logos on the branding page. All render through
// src/components/project/ProjectPage.astro, which follows the case study layout.
// Images and videos came from the old WordPress portfolio pages (1 November 2026), filed by brand:
//   src/assets/brands/<brand>/<name>.webp|jpg   and   public/video/<brand>/<name>.mp4
// A video plays over the still with the same name. Replace a file under the same name to update it.
import { URLS } from './site';
import { slot } from './case-studies/types';
import type { ProjectPageData } from './project-types';

export const DYSON: ProjectPageData = {
  brand: "dyson",
  client: "Dyson",
  meta: {
    path: URLS.dyson,
    title: "Dyson Product Launch Design | Anthony Bliss",
    description: "Dyson new product launches designed by Anthony Bliss as a freelance senior designer: tease, email, web pages, social and display, every digital touchpoint.",
    breadcrumbs: [{ name: "Home", path: URLS.home }, { name: "About", path: URLS.about }, { name: "Dyson", path: URLS.dyson }],
  },
  hero: { eyebrow: "Dyson new product launch design", heading: "The whole launch, every touchpoint.", standfirst: "From January 2015 to February 2018 I was a freelance senior designer in Dyson’s digital team in Malmesbury, designing new product launches from first tease to final advert: tease imagery, email, website pages, social and display advertising. Every digital touchpoint for new machines. Here are two of those launch campaigns: the Cinetic Big Ball and the American upright range.", image: slot("dyson", "hero-lifestyle", "Dyson Cinetic Big Ball vacuum under a single spotlight", "Hero") },
  brief: { eyebrow: "The Dyson brief", heading: "One clear story for each new machine.", body: ["Each Dyson launch needed one story told across every digital touchpoint: tease imagery first, then email, the website pages, then social and display advertising. As senior designer in the digital team, I designed across all of them."] },
  facts: [{ label: "Client", value: "Dyson" }, { label: "Role", value: "Freelance senior designer" }, { label: "When", value: "January 2015 to February 2018" }, { label: "Where", value: "Dyson, Malmesbury" }, { label: "Designed", value: "Tease imagery, email, website pages, social and display advertising" }],
  groups: [
    { id: "cinetic", eyebrow: "Dyson Cinetic Big Ball", heading: "Positioning Dyson’s most premium vacuum.", body: ["The Cinetic Big Ball is the vacuum with no filters to wash or replace. It self-rights, self-adjusts and needs no maintenance. As senior designer in the digital team, I helped position it as Dyson’s most premium vacuum, from the first tease to the targeted display adverts."], rows: [
      { label: "Tease video", items: [
        { media: slot("dyson", "cinetic-tease-imagery-1", "Dyson: tease video", "cinetic-tease-imagery-1") },
      ] },
      { label: "Website, overview page", items: [
        { media: slot("dyson", "cinetic-website-overview-1", "Dyson Cinetic homepage website design", "cinetic-website-overview-1") },
        { media: slot("dyson", "cinetic-website-overview-2", "Dyson Cinetic homepage website design", "cinetic-website-overview-2") },
        { media: slot("dyson", "cinetic-website-overview-3", "Dyson Cinetic homepage website design", "cinetic-website-overview-3") },
        { media: slot("dyson", "cinetic-website-overview-4", "Dyson Cinetic homepage website design", "cinetic-website-overview-4") },
      ] },
      { label: "Website, technology page", items: [
        { media: slot("dyson", "cinetic-website-technology-1", "Dyson Cinetic homepage website design", "cinetic-website-technology-1") },
        { media: slot("dyson", "cinetic-website-technology-2", "Dyson: website, technology page", "cinetic-website-technology-2") },
        { media: slot("dyson", "cinetic-website-technology-3", "Dyson: website, technology page", "cinetic-website-technology-3") },
        { media: slot("dyson", "cinetic-website-technology-4", "Dyson: website, technology page", "cinetic-website-technology-4") },
      ] },
      { label: "Website, features page", items: [
        { media: slot("dyson", "cinetic-website-features-1", "Dyson Cinetic homepage website design", "cinetic-website-features-1") },
        { media: slot("dyson", "cinetic-website-features-2", "Dyson Cinetic homepage website design", "cinetic-website-features-2") },
        { media: slot("dyson", "cinetic-website-features-3", "Dyson Cinetic homepage website design", "cinetic-website-features-3") },
        { media: slot("dyson", "cinetic-website-features-4", "Dyson Cinetic homepage website design", "cinetic-website-features-4") },
        { media: slot("dyson", "cinetic-website-features-5", "Dyson Cinetic homepage website design", "cinetic-website-features-5") },
      ] },
      { label: "Targeted display adverts", adSize: true, items: [
        { media: slot("dyson", "cinetic-display-advertising-targeted-adverts-1", "Dyson: targeted display adverts", "cinetic-display-advertising-targeted-adverts-1") },
        { media: slot("dyson", "cinetic-display-advertising-targeted-adverts-2", "Dyson: targeted display adverts", "cinetic-display-advertising-targeted-adverts-2") },
        { media: slot("dyson", "cinetic-display-advertising-targeted-adverts-3", "Dyson: targeted display adverts", "cinetic-display-advertising-targeted-adverts-3") },
      ] },
    ] },
    { id: "american-uprights", eyebrow: "Dyson American uprights", heading: "Two machines, one upright range, repositioned for the US.", body: ["Dyson repositioned its upright category for the American market with two machines. The Ball Multifloor 2 is the entry-level machine for first-time buyers, and the Ball Animal 2 is the trade-up for bigger homes that need a deeper clean. Every piece had to make the difference between them clear at a glance."], rows: [
      { label: "Tease imagery", items: [
        { media: slot("dyson", "uprights-tease-imagery-1", "Dyson uprights Animal 2 social campaign image", "uprights-tease-imagery-1") },
        { media: slot("dyson", "uprights-tease-imagery-2", "Dyson uprights Multifloor 2 social campaign image", "uprights-tease-imagery-2") },
      ] },
      { label: "Hero panels", items: [
        { media: slot("dyson", "uprights-hero-panels-1", "Dyson uprights Multifloor 2 campaign image", "uprights-hero-panels-1") },
        { media: slot("dyson", "uprights-hero-panels-2", "Dyson uprights Animal 2 campaign image", "uprights-hero-panels-2") },
      ] },
      { label: "Website pages", items: [
        { media: slot("dyson", "uprights-website-1", "Dyson uprights Multifloor 2 website design", "uprights-website-1") },
        { media: slot("dyson", "uprights-website-2", "Dyson uprights Animal 2 website design", "uprights-website-2") },
        { media: slot("dyson", "uprights-website-3", "Dyson uprights Animal 2 website design", "uprights-website-3") },
        { media: slot("dyson", "uprights-website-4", "Dyson uprights Animal 2 website design", "uprights-website-4") },
        { media: slot("dyson", "uprights-website-5", "Dyson: website pages", "uprights-website-5") },
        { media: slot("dyson", "uprights-website-6", "Dyson uprights Multifloor 2 website design", "uprights-website-6") },
      ] },
      { label: "Social adverts", items: [
        { media: slot("dyson", "uprights-social-advertising-1", "Dyson uprights Multifloor 2 social campaign", "uprights-social-advertising-1") },
        { media: slot("dyson", "uprights-social-advertising-2", "Dyson uprights Animal 2 social campaign", "uprights-social-advertising-2") },
      ] },
      { label: "Targeted display adverts", adSize: true, items: [
        { media: slot("dyson", "uprights-display-advertising-targeted-adverts-1", "Dyson: targeted display adverts", "uprights-display-advertising-targeted-adverts-1") },
        { media: slot("dyson", "uprights-display-advertising-targeted-adverts-2", "Dyson: targeted display adverts", "uprights-display-advertising-targeted-adverts-2") },
      ] },
    ] },
  ],
  card: { meta: "Product launches · Home technology", claim: "Full launch campaigns, from tease to display." },
  enquiry: "Bring launch-level design to your store.",
};

export const WRANGLER: ProjectPageData = {
  brand: "wrangler",
  client: "Wrangler",
  meta: {
    path: URLS.wrangler,
    title: "Wrangler Social Campaign Design | Anthony Bliss",
    description: "Social and video campaigns Anthony Bliss designed for Wrangler as a freelance senior designer. Two highlights: Women’s Heritage and the 75th anniversary.",
    breadcrumbs: [{ name: "Home", path: URLS.home }, { name: "About", path: URLS.about }, { name: "Wrangler", path: URLS.wrangler }],
  },
  hero: { eyebrow: "Wrangler social campaigns", heading: "Campaign after campaign, across social.", standfirst: "As a freelance senior designer I’ve designed a long run of Wrangler’s social and video campaigns across Instagram, Facebook and YouTube, from the first awareness post to the shopping ads. Here are two highlights, each one a full campaign: the spring/summer 2021 Women’s Heritage launch with Georgia May Jagger, and the spring/summer 2022 campaign for the brand’s 75th anniversary.", image: slot("wrangler", "hero-lifestyle", "Georgia May Jagger in Wrangler Women’s Heritage jeans", "Hero") },
  brief: { eyebrow: "The Wrangler brief", heading: "Stop the scroll, then sell the denim.", body: ["Each campaign had to work in the few seconds people give a post. Instagram Stories, Facebook carousels and short YouTube shopping ads each had their own job, from awareness through to shopping."] },
  facts: [{ label: "Client", value: "Wrangler" }, { label: "Role", value: "Freelance senior designer" }, { label: "When", value: "Spring/summer 2021 and 2022" }, { label: "Designed", value: "Instagram Stories, Facebook carousels and YouTube shopping ads" }],
  groups: [
    { id: "womens-heritage", eyebrow: "Wrangler Women’s Heritage", heading: "A full social campaign with Georgia May Jagger.", body: ["Wrangler chose Georgia May Jagger as the face of its new women’s denim collection, inspired by heritage cuts from its long history. I designed the full social campaign around her.", "Four Facebook carousels took people from awareness to shopping, and the Stories mixed stills and video to break the swiping rhythm. The YouTube shopping ads ran at 6 and 15 seconds. Six seconds is very little time to land a message, so the music did a lot of the work, with the logo sting and the call to action timed to the beat."], rows: [
      { label: "Instagram Stories", items: [
        { media: slot("wrangler", "heritage-instagram-stories-1", "Wrangler Womens heritage campaign mobile screens", "heritage-instagram-stories-1") },
      ] },
      { label: "Facebook carousels", items: [
        { media: slot("wrangler", "heritage-facebook-carousels-1", "Wrangler: facebook carousels", "heritage-facebook-carousels-1"), caption: "Carousel 1, awareness: the start of the journey" },
        { media: slot("wrangler", "heritage-facebook-carousels-2", "Wrangler: facebook carousels", "heritage-facebook-carousels-2"), caption: "Carousel 2, awareness: more of the story behind the campaign" },
        { media: slot("wrangler", "heritage-facebook-carousels-3", "Wrangler: facebook carousels", "heritage-facebook-carousels-3"), caption: "Carousel 3, shopping: the different styles and cuts" },
        { media: slot("wrangler", "heritage-facebook-carousels-4", "Wrangler: facebook carousels", "heritage-facebook-carousels-4"), caption: "Carousel 4, shopping: the colours of the style people interacted with" },
      ] },
      { label: "YouTube shopping ads", items: [
        { media: slot("wrangler", "heritage-youtube-6-seconds-1", "Wrangler: youtube shopping ads", "heritage-youtube-6-seconds-1"), caption: "6 seconds" },
        { media: slot("wrangler", "heritage-youtube-15-seconds-1", "Wrangler: youtube shopping ads", "heritage-youtube-15-seconds-1"), caption: "15 seconds" },
      ] },
    ] },
    { id: "ao22", eyebrow: "Wrangler 75th anniversary", heading: "One visual thread through a campaign with sparse assets.", body: ["The spring/summer 2022 campaign marked Wrangler’s 75th anniversary. The assets were sparse and the supplied videos carried the wrong messaging.", "I created a thread that could run through the whole campaign: an incidental graphic alongside the main imagery that gave the Stories and in-feed posts a look of their own."], rows: [
      { label: "Instagram Stories", items: [
        { media: slot("wrangler", "ao22-instagram-stories-1", "Wrangler: instagram stories", "ao22-instagram-stories-1") },
      ] },
      { label: "Facebook carousels", items: [
        { media: slot("wrangler", "ao22-facebook-carousels-1", "Wrangler: facebook carousels", "ao22-facebook-carousels-1") },
        { media: slot("wrangler", "ao22-facebook-carousels-2", "Wrangler Facebook campaign carousel on mobile screens", "ao22-facebook-carousels-2") },
        { media: slot("wrangler", "ao22-facebook-carousels-3", "Wrangler Facebook campaign carousel on mobile screens", "ao22-facebook-carousels-3") },
      ] },
    ] },
  ],
  card: { meta: "Social campaigns · Fashion", claim: "Social and video campaigns made for the scroll." },
  enquiry: "Make your store stop the scroll.",
};

export const CHOP_CHOP: ProjectPageData = {
  brand: "chop-chop",
  client: "Chop Chop",
  meta: {
    path: '/work/chop-chop/',
    title: "Chop Chop Brand Identity | Anthony Bliss",
    description: "Brand identity by Anthony Bliss for Chop Chop, a street food pop-up in Bristol: logo, messaging, packaging, signage and an interior concept, all played with chopsticks.",
    breadcrumbs: [{ name: "Home", path: URLS.home }, { name: "Branding", path: URLS.branding }, { name: "Chop Chop", path: '/work/chop-chop/' }],
  },
  hero: { eyebrow: "Chop Chop brand identity", heading: "Street food, brought to life.", standfirst: "Chop Chop is a street food pop-up in Bristol. I designed the brand identity and brought it to life by playing with the chopsticks, from the logo to the packaging, the signage and the interior.", image: slot("chop-chop", "signage-1", "Chop Chop street food signage in Bristol", "Hero") },
  brief: { eyebrow: "The Chop Chop brief", heading: "A new pop-up needed a brand people remember.", body: ["Street food is sold from the bag, the box, the sign and the stall itself, so the identity had to work on all of them. The chopsticks became the thread through every piece."] },
  facts: [{ label: "Client", value: "Chop Chop" }, { label: "Role", value: "Freelance senior designer" }, { label: "Sector", value: "Street food, Bristol" }, { label: "Services", value: "Brand identity" }, { label: "Designed", value: "Logo, brand messaging, poster, packaging, bag, signage and an interior concept" }],
  groups: [
    { rows: [
      { label: "Logo", logo: { src: "/logos/identity/chop-chop.svg", alt: "Street food logo design Bristol", width: 408, height: 453 }, items: [] },
      { label: "Brand messaging", items: [
        { media: slot("chop-chop", "brand-messaging-1", "Street food brand messaging design Bristol", "brand-messaging-1") },
        { media: slot("chop-chop", "brand-messaging-2", "Street food brand messaging design Bristol", "brand-messaging-2") },
      ] },
      { label: "Poster", items: [
        { media: slot("chop-chop", "poster-1", "Street food brand poster design Bristol", "poster-1") },
      ] },
      { label: "Packaging", items: [
        { media: slot("chop-chop", "packaging-1", "Street food packaging design Bristol", "packaging-1") },
      ] },
      { label: "Bag", items: [
        { media: slot("chop-chop", "bag-1", "Street food packaging design Bristol", "bag-1") },
      ] },
      { label: "Signage", items: [
        { media: slot("chop-chop", "signage-1", "Street food brand signge Bristol", "signage-1") },
      ] },
      { label: "Interior partition concept", items: [
        { media: slot("chop-chop", "interior-partition-concept-1", "Street food brand partition design Bristol", "interior-partition-concept-1") },
      ] },
    ] },
  ],
  card: { meta: "Brand identity · Street food", claim: "A street food brand played with chopsticks." },
  enquiry: "Bring brand thinking to your Shopify store.",
};

export const SPICY_GURU: ProjectPageData = {
  brand: "spicy-guru",
  client: "Spicy Guru",
  meta: {
    path: '/work/spicy-guru/',
    title: "Spicy Guru Brand Identity | Anthony Bliss",
    description: "Brand identity by Anthony Bliss for Spicy Guru, bringing Mehedi Mahmud’s flavours to the streets of Britain: a logo that became a person, embroidery and packaging.",
    breadcrumbs: [{ name: "Home", path: URLS.home }, { name: "Branding", path: URLS.branding }, { name: "Spicy Guru", path: '/work/spicy-guru/' }],
  },
  hero: { eyebrow: "Spicy Guru brand identity", heading: "A logo that became a person.", standfirst: "Spicy Guru brings Mehedi Mahmud’s flavours, the spice guru himself, to the streets of Britain. Making the logo into a person gave the brand a more personal feel, with a witty design touch hidden in the identity.", image: slot("spicy-guru", "hero-lifestyle", "Spicy Guru logo embroidered on fabric", "Hero") },
  brief: { eyebrow: "The Spicy Guru brief", heading: "Put the guru into the brand.", body: ["The brand is built on one man’s flavours, so the identity needed to feel personal. Turning the logo into a person did that, and it carried through to the embroidered logo and the packaging."] },
  facts: [{ label: "Client", value: "Spicy Guru" }, { label: "Role", value: "Freelance senior designer" }, { label: "Sector", value: "Food" }, { label: "Services", value: "Brand identity" }, { label: "Designed", value: "Logo, embroidered logo and packaging" }],
  groups: [
    { rows: [
      { label: "Logo", logo: { src: "/logos/identity/spicy-guru.svg", alt: "Spicy Guru logo", width: 501, height: 843 }, items: [] },
      { label: "Embroidered logo", items: [
        { media: slot("spicy-guru", "embroidered-logo-1", "Spicy Guru embroidered logo", "embroidered-logo-1") },
      ] },
      { label: "Packaging", items: [
        { media: slot("spicy-guru", "packaging-1", "Spicy Guru packaging", "packaging-1") },
      ] },
    ] },
  ],
  card: { meta: "Brand identity · Food", claim: "A logo that became a person." },
  enquiry: "Bring brand thinking to your Shopify store.",
};

export const MILSOM_PLACE: ProjectPageData = {
  brand: "milsom-place",
  client: "Milsom Place",
  meta: {
    path: '/work/milsom-place/',
    title: "Milsom Place Brand Identity | Anthony Bliss",
    description: "Brand identity by Anthony Bliss for Milsom Place in Bath: my place, our place, your place, across signage, imagery, a brochure and a responsive website. Concept by The House.",
    breadcrumbs: [{ name: "Home", path: URLS.home }, { name: "Branding", path: URLS.branding }, { name: "Milsom Place", path: '/work/milsom-place/' }],
  },
  hero: { eyebrow: "Milsom Place brand identity", heading: "My place, our place, your place.", standfirst: "Milsom Place is a smart retail area in Bath with some real hidden gems. The repositioning celebrated the place, its mix of independent boutiques and big names, and the stories within it. I designed it across signage, imagery, print and a responsive website, before responsive websites became the norm.", image: slot("milsom-place", "signage-1", "Milsom Place signage", "Hero") },
  brief: { eyebrow: "The Milsom Place brief", heading: "Reposition a retail area around its people.", body: ["The idea of my place, our place, your place put the people behind the shops at the centre of the brand, from the hero imagery and posters to the autumn brochure and the website.", "Creative concept and direction by The House."] },
  facts: [{ label: "Client", value: "Milsom Place, Bath" }, { label: "Role", value: "Freelance senior designer" }, { label: "Sector", value: "Retail destination" }, { label: "Concept", value: "The House" }, { label: "Designed", value: "Logo, signage, hero imagery, poster, brochure and a responsive website" }],
  groups: [
    { rows: [
      { label: "Logo", logo: { src: "/logos/identity/milsom-place.svg", alt: "Milsom Place white logo", width: 738, height: 362 }, items: [] },
      { label: "Signage", items: [
        { media: slot("milsom-place", "signage-1", "Milsom Place signage", "signage-1") },
      ] },
      { label: "Hero imagery", items: [
        { media: slot("milsom-place", "hero-imagery-1", "Milsom Place welcome brand image", "hero-imagery-1") },
        { media: slot("milsom-place", "hero-imagery-2", "Milsom Place brand image", "hero-imagery-2") },
        { media: slot("milsom-place", "hero-imagery-3", "Milsom Place brand image", "hero-imagery-3") },
        { media: slot("milsom-place", "hero-imagery-4", "Milsom Place brand image", "hero-imagery-4") },
      ] },
      { label: "Poster", items: [
        { media: slot("milsom-place", "poster-1", "Milsom Place poster design", "poster-1") },
      ] },
      { label: "Brochure", items: [
        { media: slot("milsom-place", "brochure-1", "Milsom Place brochure design", "brochure-1") },
        { media: slot("milsom-place", "brochure-2", "Milsom Place brochure Autumn cover design", "brochure-2") },
        { media: slot("milsom-place", "brochure-3", "Milsom Place brochure Autumn cover design", "brochure-3") },
        { media: slot("milsom-place", "brochure-4", "Milsom Place brochure design", "brochure-4") },
      ] },
      { label: "Website", items: [
        { media: slot("milsom-place", "website-1", "Milsom Place desktop website design", "website-1") },
        { media: slot("milsom-place", "website-2", "Milsom Place mobile website design", "website-2") },
      ] },
    ] },
  ],
  card: { meta: "Brand identity · Retail", claim: "A retail area repositioned around its people." },
  enquiry: "Bring brand thinking to your Shopify store.",
};

export const NORTON_RADSTOCK_COLLEGE: ProjectPageData = {
  brand: "norton-radstock-college",
  client: "Norton Radstock College",
  meta: {
    path: '/work/norton-radstock-college/',
    title: "Norton Radstock College Brand Identity | Anthony Bliss",
    description: "Brand identity by Anthony Bliss for Norton Radstock College, The College That Works: logo, messaging, course icons and guide. Winner of a European Transform Award.",
    breadcrumbs: [{ name: "Home", path: URLS.home }, { name: "Branding", path: URLS.branding }, { name: "Norton Radstock College", path: '/work/norton-radstock-college/' }],
  },
  hero: { eyebrow: "Norton Radstock College identity", heading: "The college that works.", standfirst: "How do you reinvigorate a college where morale is low but its rate of getting students into work is high? Create a visual identity that celebrates those success rates, and give the college the tools to tell its success stories better.", image: slot("norton-radstock-college", "course-guide-1", "Norton Radstock College course guide covers", "Hero") },
  brief: { eyebrow: "The Norton Radstock College brief", heading: "Celebrate the results the college already had.", body: ["Built around the line The College That Works, the identity ran from the logo and brand messaging to course icons, the course guide and advertising. It won a European Transform Award.", "Creative concept and direction by The House."] },
  facts: [{ label: "Client", value: "Norton Radstock College" }, { label: "Role", value: "Freelance senior designer" }, { label: "Sector", value: "Further education" }, { label: "Concept", value: "The House" }, { label: "Recognition", value: "Winner, European Transform Award" }, { label: "Designed", value: "Logo, brand messaging, course icons, course guide, advertising and brand manual" }],
  groups: [
    { rows: [
      { label: "Logo", logo: { src: "/logos/identity/norton-radstock-college.svg", alt: "Norton Radstock College white logo", width: 705, height: 474 }, items: [] },
      { label: "Brand messaging", items: [
        { media: slot("norton-radstock-college", "brand-messaging-1", "Norton Radstock College brand message", "brand-messaging-1") },
        { media: slot("norton-radstock-college", "brand-messaging-2", "Norton Radstock College brand message", "brand-messaging-2") },
      ] },
      { label: "Course icons", items: [
        { media: slot("norton-radstock-college", "course-icons-1", "Norton Radstock College course logos", "course-icons-1") },
      ] },
      { label: "Course guide", items: [
        { media: slot("norton-radstock-college", "course-guide-1", "Norton Radstock College brochure covers photo", "course-guide-1") },
        { media: slot("norton-radstock-college", "course-guide-2", "Norton Radstock College brochure spread photo", "course-guide-2") },
        { media: slot("norton-radstock-college", "course-guide-3", "Norton Radstock College brochure covers photo", "course-guide-3") },
        { media: slot("norton-radstock-college", "course-guide-4", "Norton Radstock College brochure spread photo", "course-guide-4") },
      ] },
      { label: "Advertising", items: [
        { media: slot("norton-radstock-college", "advertising-1", "Norton Radstock college advert", "advertising-1") },
      ] },
      { label: "Brand manual", items: [
        { media: slot("norton-radstock-college", "brand-manual-1", "Norton Radstock College brand manual cover", "brand-manual-1") },
        { media: slot("norton-radstock-college", "brand-manual-2", "Norton Radstock College brand manual: logo elements", "brand-manual-2") },
        { media: slot("norton-radstock-college", "brand-manual-3", "Norton Radstock College brand manual: logo colours", "brand-manual-3") },
        { media: slot("norton-radstock-college", "brand-manual-4", "Norton Radstock College brand manual: imagery section opener", "brand-manual-4") },
        { media: slot("norton-radstock-college", "brand-manual-5", "Norton Radstock College brand manual: people imagery do’s and don’ts", "brand-manual-5") },
        { media: slot("norton-radstock-college", "brand-manual-6", "Norton Radstock College brand manual: course icons", "brand-manual-6") },
      ] },
    ] },
  ],
  card: { meta: "Brand identity · Education", claim: "An award-winning identity for The College That Works." },
  enquiry: "Bring brand thinking to your Shopify store.",
};

export const ELECTRONIC_SOUND: ProjectPageData = {
  brand: "electronic-sound",
  client: "Electronic Sound",
  meta: {
    path: '/work/electronic-sound/',
    title: "Electronic Sound Magazine Design | Anthony Bliss",
    description: "Anthony Bliss rebranded and redesigned Electronic Sound, turning a one-off newsstand magazine into a monthly interactive app for tablet and mobile.",
    breadcrumbs: [{ name: "Home", path: URLS.home }, { name: "Branding", path: URLS.branding }, { name: "Electronic Sound", path: '/work/electronic-sound/' }],
  },
  hero: { eyebrow: "Electronic Sound magazine design", heading: "From one-off magazine to app.", standfirst: "Electronic Sound started as a one-off newsstand magazine. I rebranded and redesigned it as a standout monthly interactive app for the App Store newsstand, on tablet and mobile.", image: slot("electronic-sound", "hero-lifestyle", "Gary Numan holding the Electronic Sound app on a tablet", "Hero") },
  brief: { eyebrow: "The Electronic Sound brief", heading: "Turn a print one-off into an interactive monthly.", body: ["The rebrand covered the logo, the covers and the page designs, with animated covers and pages that made the most of the screen."] },
  facts: [{ label: "Client", value: "Electronic Sound" }, { label: "Role", value: "Freelance senior designer" }, { label: "Sector", value: "Music magazine" }, { label: "Services", value: "Brand identity, editorial and app design" }, { label: "Designed", value: "Logo, covers and page designs for tablet and mobile" }],
  groups: [
    { rows: [
      { label: "Logo", logo: { src: "/logos/identity/electronic-sound.svg", alt: "Electronic sound logo", width: 1400, height: 369 }, items: [] },
      { label: "Covers", items: [
        { media: slot("electronic-sound", "covers-1", "Electronic sound magazine Chromeo cover", "covers-1") },
        { media: slot("electronic-sound", "covers-2", "Electronic sound magazine Factory Floor cover", "covers-2") },
        { media: slot("electronic-sound", "covers-3", "Electronic sound magazine Gary Newman cover", "covers-3") },
        { media: slot("electronic-sound", "covers-4", "Electronic sound magazine Gary Newman cover", "covers-4") },
        { media: slot("electronic-sound", "covers-5", "Electronic sound magazine Karl Bartos cover", "covers-5") },
        { media: slot("electronic-sound", "covers-6", "Electronic sound magazine Devo cover", "covers-6") },
      ] },
      { label: "Page designs", items: [
        { media: slot("electronic-sound", "page-designs-1", "Electronic sound page design", "page-designs-1") },
        { media: slot("electronic-sound", "page-designs-4", "Electronic sound how to use the app design", "page-designs-4") },
      ] },
      { label: "Animated pages", items: [
        { media: slot("electronic-sound", "page-designs-2", "Electronic sound magazine Karl Bartos page", "page-designs-2") },
        { media: slot("electronic-sound", "page-designs-3", "Electronic sound magazine Dave Clarke page", "page-designs-3") },
      ] },
    ] },
  ],
  card: { meta: "Brand identity · Music magazine", claim: "A one-off magazine turned into a monthly app." },
  enquiry: "Bring brand thinking to your Shopify store.",
};

/** Every project page, in the order the More work cards cycle through. */
export const PROJECTS: ProjectPageData[] = [DYSON, WRANGLER, CHOP_CHOP, SPICY_GURU, MILSOM_PLACE, NORTON_RADSTOCK_COLLEGE, ELECTRONIC_SOUND];
