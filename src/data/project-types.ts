// The shape of a project page (src/components/project/ProjectPage.astro): brand and campaign work
// outside Shopify. Follows the case study layout, with the work as labelled rows of images.
import type { Media } from './case-studies/types';

export interface ProjectRow {
  /** What the row shows, for example "Packaging" or "Website, features page". */
  label: string;
  items: { media: Media; caption?: string }[];
}

export interface ProjectGroup {
  /** A page with two projects (Dyson, Wrangler) gives each its own heading. One-project pages leave them out. */
  id?: string;
  eyebrow?: string;
  heading?: string;
  body?: string[];
  rows: ProjectRow[];
}

export interface ProjectPageData {
  brand: string;
  client: string;
  meta: { path: string; title: string; description: string; breadcrumbs: { name: string; path: string }[] };
  hero: { eyebrow: string; heading: string; standfirst: string; image: Media };
  brief: { eyebrow: string; heading: string; body: string[] };
  facts: { label: string; value: string }[];
  groups: ProjectGroup[];
  /** The card other project pages show for this one. */
  card: { meta: string; claim: string };
  /** The second line of the enquiry form's heading. */
  enquiry: string;
}
