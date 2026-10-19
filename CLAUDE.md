# anthonyis.uk

Static site for Anthony is Freelance. Astro + Tailwind v4, hosted on Cloudflare Workers (static assets, see wrangler.jsonc).

## Rules
- Designs come from Figma. Match them exactly; tokens live in `src/styles/global.css`.
- URLs: trailing slash on every page. Never change an existing live URL without a row in the redirect map.
- Redirects go in `public/_redirects` (true 301s at the edge). Never use Astro's `redirects` config.
- Schema: one `@graph` per page, built by a shared component from entity data with stable `@id`s. Never hand-write JSON-LD per page.
- British English in all copy.
- Keep JavaScript to a minimum. Performance target: 100 on Lighthouse mobile.
- Big screens: from 1920 to 2560px the heading size tokens grow with the screen. Past 2560 the page margin grows so content stops at 2512px and centres, while edge-to-edge images and backgrounds keep running to the screen edges (see the end of `global.css`). Set heading sizes with the type tokens, never fixed px, so they scale too.
- Section headings sit in the left half of a 50/50 split (`lg:w-half`, 676px at 1440), links bottom right. Use `SectionIntro`.
- Edge-to-edge splits (photo to a screen edge, copy beside it) split on the centre line: `lg:grid-cols-2 lg:gap-gutter`, with the page margin only on the copy side.
- Images live by brand: `src/assets/brands/<brand>/`, videos in `public/video/<brand>/`, non-client images in `src/assets/site/`. Naming and the drop-in rules are in `src/assets/brands/README.md`.
- Innovations render from `src/data/innovations.ts`. Each one's still and recording are found by slug (`src/data/media.ts`), so dropping files in needs no code. Screen recordings use `video[data-autoplay]` (the shared script in `Base.astro`); nothing downloads until in view.

## Commands
- `npm run dev` local preview
- `npm run build` production build to `dist/`
