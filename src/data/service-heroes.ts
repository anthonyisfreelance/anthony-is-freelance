// One hero image per service, from Drive site-images/services/<service>/ (29 October 2026). The same
// image is used on the homepage services hover, the services landing page and the service page itself,
// so the picture stays the same all the way through. A -top, -bottom or -centre in the Drive name
// sets which part of the photo stays in view when it's cropped. Shopify Plus has no image yet.
import type { ImageMetadata } from 'astro';
import { URLS } from './site';
import branding from '../assets/site/services/hero-branding.jpg';
import ux from '../assets/site/services/hero-ux.jpg';
import bespoke from '../assets/site/services/hero-bespoke.jpg';
import cro from '../assets/site/services/hero-cro.jpg';
import migrations from '../assets/site/services/hero-migrations.jpg';
import subscriptions from '../assets/site/services/hero-subscriptions.jpg';
import theme from '../assets/site/services/hero-theme.jpg';
import aiSearch from '../assets/site/services/hero-ai-search.jpg';

export interface ServiceHero { image: ImageMetadata; imagePosition?: string }

export const SERVICE_HEROES: Record<string, ServiceHero> = {
  [URLS.branding]: { image: branding },
  [URLS.ux]: { image: ux },
  [URLS.bespoke]: { image: bespoke },
  [URLS.cro]: { image: cro, imagePosition: 'center bottom' },
  [URLS.migrations]: { image: migrations, imagePosition: 'center top' },
  [URLS.subscriptions]: { image: subscriptions, imagePosition: 'center' },
  [URLS.theme]: { image: theme },
  [URLS.aiSearch]: { image: aiSearch },
};

/** The hero for a service page's data: its image and crop, decorative so no alt. */
export const serviceHero = (href: string): Partial<ServiceHero> & { imageAlt?: string } =>
  SERVICE_HEROES[href] ? { ...SERVICE_HEROES[href], imageAlt: '' } : {};
