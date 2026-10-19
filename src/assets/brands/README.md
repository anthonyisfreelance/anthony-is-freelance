# Images and videos, by brand

Everything for a client lives in one folder named after the brand. The same photo often appears on several pages (the homepage, the work page, a service page, the case study and the menu), so filing by brand means one copy and one place to look.

```
src/assets/brands/<brand>/          photos and screens (Astro resizes and converts them at build)
src/assets/brands/<brand>/innovations/   one screen still per innovation
public/video/<brand>/               screen recordings (served as they are)
src/assets/site/                    anything that isn't a client's: your portrait, the showreel poster
```

Brand folders use the brand name in lower case with hyphens: `drink-finder`, `east-at-home`, `hartnack-and-co`. Start a new folder the same way for a new client.

## Innovations: drop in, no code

Each innovation has a slug, listed below. Add two files named after it and the innovations page picks them up on the next build:

1. **Screen still:** `src/assets/brands/<brand>/innovations/<slug>.jpg` (or .png). A phone screen, cropped to 216:376 (for example 1080 × 1880). It's the poster and the blurred background of the tile.
2. **Recording:** `public/video/<brand>/<slug>.mp4`. H.264, muted, the same crop as the still, ideally under 2MB.

Until the still is there, the entry shows an empty phone with "Recording to come". When you add a recording, put the date in `videoUploaded` on its record in `src/data/innovations.ts` (it goes in the video schema).

| Brand folder | Slug |
| --- | --- |
| drink-finder | comparison-toggle (done), offers-button |
| projektityyny | shop-by-product-room-print, lookbook-archive |
| whistlefish | image-first-product-cards, design-system-team-runs |
| east-at-home | dinner-question-cards |
| hartnack-and-co | product-builder, customer-gallery |
| fuzzball | subscription-only-cards, trial-subscription-split, progress-bar-with-character |
| window-fleur | three-pages-one-screen |

## Other images

Elsewhere, pages import an image by its path, so replacing a file with one of the **same name** updates every page that uses it. A new image needs one line in the page's data file, so ask Claude to wire it in.

Common names, where they exist:

- `card.jpg`: the case study card (homepage, work page, menus). 4:5 or square, at least 1200px wide.
- `hero.jpg`: the case study header image.
- `menu.jpg`: the photo in the mega menu feature.
- `badge-award.png`: the award badge.
