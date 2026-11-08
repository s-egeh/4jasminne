export interface CsrInitiative {
  slug: string;
  title: string;
  /** One line, used by the homepage strip and the card grid. */
  description: string;
  /** Full paragraph, used by the alternating rows on /csr. */
  detail: string;
  image: string;
  imageAlt: string;
}

/**
 * [TODO-CLIENT] Community and sustainability work the business actually does,
 * with photographs of it.
 *
 * Empty until supplied. While it is empty, /csr returns a 404, is left out of
 * the navigation, the footer and the sitemap, and the homepage CSR strip does
 * not render. Add initiatives and it all switches back on; the sitemap is the
 * one manual step — remove '/csr' from the `exclude` array in
 * next-sitemap.config.js.
 *
 * The homepage strip shows the photographs of the third and fourth entries, so
 * supply at least four, or adjust CSRStrip.
 */
export const CSR_INITIATIVES: CsrInitiative[] = [];

export const CSR_PUBLISHED = CSR_INITIATIVES.length > 0;

/*
 * The copy blocks on /csr. Each renders only when it is non-empty, so the page
 * can be switched on with the initiatives alone and the rest added later.
 * [TODO-CLIENT] Supply in the client's own words.
 */
export const CSR_INTRO = '';

export const CSR_SUSTAINABILITY = '';

/** Sustainability in operations — /csr, dark band. */
export const SUSTAINABILITY_BLOCKS: { title: string; description: string }[] = [];

/** How initiatives are chosen — /csr. */
export const CSR_SELECTION = '';
