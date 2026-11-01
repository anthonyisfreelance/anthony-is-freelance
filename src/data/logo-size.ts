// Testimonial logos (Figma _Master_Quote 48013:10726, feedback #283): the logo stacks above the credit and
// fits a 120 x 37 box, so wide, tall and square logos all sit the same way in every quote section.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const LOGO_BOX = { w: 120, h: 37 };

/** Width and height for a logo in public/ (e.g. "/logos/fuzzball.svg"), contained in the quote logo box. */
export function quoteLogoSize(src: string) {
  let ratio = 3;
  try {
    const vb = readFileSync(join(process.cwd(), 'public', src), 'utf8').match(/viewBox="[^"]*?([\d.]+)[\s,]+([\d.]+)"/);
    if (vb) ratio = Number(vb[1]) / Number(vb[2]);
  } catch {}
  let h = LOGO_BOX.h, w = h * ratio;
  if (w > LOGO_BOX.w) { w = LOGO_BOX.w; h = w / ratio; }
  return { w: Math.round(w), h: Math.round(h) };
}
