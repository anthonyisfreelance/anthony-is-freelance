// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from './integrations/sitemap.mjs';

export default defineConfig({
  site: 'https://anthonyis.uk',
  // Match WordPress: every page URL ends in a slash.
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
