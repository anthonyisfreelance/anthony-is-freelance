// Earlier work: campaign design (Dyson 2015 to 2018, Wrangler 2021 and 2022), linked from About. Not Shopify
// proof, so these pages stay off the work page and its filters. Old WordPress URLs 301 here
// (public/_redirects, redirect map rows 54 to 57). Copy rewritten from the WordPress excerpts,
// 1 November 2026.
//
// Images drop in by name, the same as the case studies:
//   src/assets/brands/<brand>/<project>-lead.jpg      the wide image at the top of each project
//   src/assets/brands/<brand>/<project>-1.jpg to -4    the grid under it
//   public/video/<brand>/<same name>.mp4               a video with the same name plays over its still
// Until a file is there, its spot shows a grey placeholder naming it.
import { URLS } from './site';

export interface EarlierProject {
  id: string;
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  made: string[];
  /** Grid images: how many, their shape (CSS aspect ratio) and what each one is. */
  grid: { aspect: string; cols: 2 | 3 | 4; labels: string[] };
  /** Shape of the lead image (CSS aspect ratio). */
  leadAspect: string;
  leadLabel: string;
}

export interface EarlierWork {
  brand: string;
  path: string;
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  intro: string;
  facts: { term: string; value: string }[];
  projects: EarlierProject[];
  closing: { eyebrow: string; heading: string; text: string };
}

export const DYSON: EarlierWork = {
  brand: 'dyson',
  path: URLS.dyson,
  title: 'Dyson Product Launch Design | Anthony Bliss',
  description:
    'Two Dyson launches Anthony Bliss designed as a freelance senior digital designer: the Cinetic Big Ball and the American upright range, across web, social and display.',
  eyebrow: 'Dyson product launch design',
  heading: 'Two Dyson launches, from first tease to the product page.',
  intro:
    'I spent just over three years as a freelance senior digital designer in Dyson’s digital team in Malmesbury, from January 2015 to February 2018. These are two of the launches I designed for.',
  facts: [
    { term: 'Role', value: 'Senior digital designer (freelance)' },
    { term: 'When', value: 'January 2015 to February 2018' },
    { term: 'Where', value: 'Dyson, Malmesbury' },
    { term: 'Designed', value: 'Tease imagery, website pages, social and display advertising' },
  ],
  projects: [
    {
      id: 'cinetic',
      eyebrow: 'Dyson Cinetic launch.',
      heading: 'Positioning Dyson’s most premium vacuum.',
      paragraphs: [
        'The Dyson Cinetic launch introduced a vacuum that self-rights, self-adjusts and needs no filters, so there is no maintenance. Working as senior designer in the digital team, I helped position it as Dyson’s most premium vacuum.',
        'The launch ran from tease imagery through to the website, where the overview, technology and features pages each had a job to do, then targeted display advertising.',
      ],
      made: ['Tease imagery', 'Website overview, technology and features pages', 'Targeted display adverts'],
      leadAspect: '16/9',
      leadLabel: 'cinetic-lead: tease image',
      grid: { aspect: '16/10', cols: 2, labels: ['cinetic-1: website overview', 'cinetic-2: website technology', 'cinetic-3: website features', 'cinetic-4: display advert'] },
    },
    {
      id: 'american-uprights',
      eyebrow: 'Dyson American uprights.',
      heading: 'Repositioning the upright range for the US market.',
      paragraphs: [
        'Dyson repositioned its upright category for the American market with two machines: the Ball Multifloor 2, an entry-level model for first-time buyers, and the Ball Animal 2, a trade-up for bigger homes that need a deeper clean.',
        'The design had to make the difference between the two clear at a glance, from the hero panels and website through to social and display advertising.',
      ],
      made: ['Tease imagery', 'Hero panels', 'Website pages', 'Social adverts', 'Display adverts'],
      leadAspect: '16/9',
      leadLabel: 'uprights-lead: tease image',
      grid: { aspect: '16/10', cols: 2, labels: ['uprights-1: hero panel', 'uprights-2: website', 'uprights-3: social advert', 'uprights-4: display advert'] },
    },
  ],
  closing: {
    eyebrow: 'What Dyson taught me',
    heading: 'How a launch at global scale comes together.',
    text: 'Every machine had one clear story, and every screen from the first tease to the product page had to tell it. I bring that discipline to every Shopify store I design.',
  },
};

export const WRANGLER: EarlierWork = {
  brand: 'wrangler',
  path: URLS.wrangler,
  title: 'Wrangler Social Campaign Design | Anthony Bliss',
  description:
    'Two Wrangler social campaigns designed by Anthony Bliss: the Women’s Heritage launch with Georgia May Jagger and the 75th anniversary campaign, across Stories, carousels and YouTube.',
  eyebrow: 'Wrangler social campaign design',
  heading: 'Two Wrangler denim campaigns, made for the scroll.',
  intro:
    'I designed two social campaigns for Wrangler: the spring/summer 2021 Women’s Heritage launch and the spring/summer 2022 campaign for the brand’s 75th anniversary.',
  facts: [
    // [CONFIRM] freelance, or through the agency. Worded neutrally until then.
    { term: 'Role', value: 'Designer [CONFIRM freelance or agency]' },
    { term: 'When', value: 'Spring/summer 2021 and 2022' },
    { term: 'Designed', value: 'Instagram Stories, Facebook carousels and YouTube shopping ads' },
  ],
  projects: [
    {
      id: 'womens-heritage',
      eyebrow: 'Wrangler Women’s Heritage.',
      heading: 'A full social campaign with Georgia May Jagger.',
      paragraphs: [
        'Wrangler chose Georgia May Jagger as the face of its new women’s denim collection, inspired by heritage cuts from its long history. I designed the full social campaign around her.',
        'Four Facebook carousels took people from awareness to shopping: two told the story behind the campaign, then two showed the different cuts and the colours of the style they had interacted with. The Stories were built to break the swiping rhythm with a mix of stills and video.',
        'The YouTube shopping ads ran at 6 and 15 seconds. Six seconds is very little time to land a message, so the music did a lot of the work, with the logo sting and the call to action timed to the beat.',
      ],
      made: ['Instagram Stories', 'Four Facebook carousels, awareness to shopping', 'YouTube shopping ads, 6 and 15 seconds'],
      leadAspect: '16/9',
      leadLabel: 'heritage-lead: campaign image or YouTube ad',
      grid: { aspect: '9/16', cols: 4, labels: ['heritage-1: Story', 'heritage-2: carousel, awareness', 'heritage-3: carousel, shopping', 'heritage-4: carousel, colours'] },
    },
    {
      id: 'ao22',
      eyebrow: 'Wrangler 75th anniversary.',
      heading: 'One visual thread through a campaign with sparse assets.',
      paragraphs: [
        'The spring/summer 2022 campaign marked Wrangler’s 75th anniversary. The assets were sparse and the supplied videos carried the wrong messaging.',
        'I created a thread that could run through the whole campaign: an incidental graphic alongside the main imagery that gave the Stories and in-feed posts a look of their own.',
      ],
      made: ['Instagram Stories', 'Facebook carousels'],
      leadAspect: '16/9',
      leadLabel: 'ao22-lead: campaign image',
      grid: { aspect: '9/16', cols: 4, labels: ['ao22-1: Story', 'ao22-2: carousel', 'ao22-3: carousel', 'ao22-4: carousel'] },
    },
  ],
  closing: {
    eyebrow: 'What Wrangler taught me',
    heading: 'A few seconds to earn attention.',
    text: 'Social campaigns live or die in the first second of the scroll. The same is true of a product page on a phone, which is why every Shopify store I design starts with what a shopper sees first.',
  },
};
