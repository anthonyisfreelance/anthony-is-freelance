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

## Case study pages: drop in, no code

Every case study page renders from `src/data/case-studies/<client>.ts` through one template (the Drink Finder layout). Until a file is there, its spot shows a grey placeholder naming what goes in it. Drop a file in under these names and the page picks it up on the next build:

| File name | Where it shows |
| --- | --- |
| `hero` | The photo beside the headline |
| `showcase-photo` | The full-bleed photo behind the desktop and phone screens |
| `showcase-desktop` | The desktop screen (916:518) |
| `showcase-phone-1` to `-4` | The four phones under it (293:567) |
| `gallery-photo` | The sticky photo beside the scrolling screens |
| `gallery-1` to `-5` | The five scrolling screens |
| `work-01`, `work-02`... | The screen beside each work row, in page order (375:820) |
| `feature-photo` | The full-bleed photo behind the feature section |
| `feature` | The screen in the feature section (square) |

Stills go in `src/assets/brands/<brand>/` (.jpg, .png or .webp). A recording with the same name in `public/video/<brand>/` plays over its still. Rows that link to an innovation use that innovation's still and recording instead (see above), so one file fills both pages. The order of the screens and which photo goes where are in each client's case study copy doc.

## Other images

Elsewhere, pages import an image by its path, so replacing a file with one of the **same name** updates every page that uses it. A new image needs one line in the page's data file, so ask Claude to wire it in.

Common names, where they exist:

- `card.jpg`: the case study card (homepage, work page, menus). 4:5 or square, at least 1200px wide.
- `hero.jpg`: the case study header image.
- `menu.jpg`: the photo in the mega menu feature.
- `badge-award.png`: the award badge.

## Article images

Each article has a folder at `src/assets/articles/<article slug>/`. Drop in the images using the same file names as on WordPress (for example `Shopify-product-card-designs.webp`) and they replace the placeholders on the next build. Until then each placeholder shows the image's alt text, so you can see which one goes where. The file names for each article are in its content file, `src/data/article-content/<slug>.json`.
