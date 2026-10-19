# anthonyis.uk

Static site for Anthony is Freelance. Astro + Tailwind v4, hosted on Cloudflare Workers (static assets, see wrangler.jsonc).

## Rules
- Designs come from Figma. Match them exactly; tokens live in `src/styles/global.css`.
- URLs: trailing slash on every page. Never change an existing live URL without a row in the redirect map.
- Redirects go in `public/_redirects` (true 301s at the edge). Never use Astro's `redirects` config.
- Schema: one `@graph` per page, built by a shared component from entity data with stable `@id`s. Never hand-write JSON-LD per page.
- British English in all copy.
- Keep JavaScript to a minimum. Performance target: 100 on Lighthouse mobile.
- Big screens: from 1920 to 2560px the heading size tokens grow with the screen, and past 2560 the page stops and centres (see the end of `global.css`). Set heading sizes with the type tokens, never fixed px, so they scale too.

## Commands
- `npm run dev` local preview
- `npm run build` production build to `dist/`
