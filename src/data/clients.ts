export interface Client {
  name: string;
  sector: string;
  /**
   * Logo file path. If the file is not supplied, ClientTile renders the company
   * name as a wordmark in the utility typeface — a third-party logo is never
   * invented or downloaded.
   */
  logo: string | null;
}

/**
 * [TODO-CLIENT] Clients the business may name publicly, each with that
 * client's permission. Logos only if the client supplies them.
 *
 * Empty until supplied. While it is empty, /clients returns a 404, is left out
 * of the navigation, the footer and the sitemap, and the homepage clients
 * marquee does not render. Add entries and it all switches back on; the
 * sitemap is the one manual step — remove '/clients' from the `exclude` array
 * in next-sitemap.config.js.
 */
export const CLIENTS: Client[] = [];

export const CLIENTS_PUBLISHED = CLIENTS.length > 0;

/**
 * [TODO-CLIENT] Real testimonials with named people, companies and written
 * permission to publish. The TestimonialRail component is built and wired, but
 * stays unrendered while this array is empty. Nothing is ever invented here.
 */
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

export const TESTIMONIALS: Testimonial[] = [];

/*
 * Supporting copy for /clients. Generic by design — it describes how an
 * ongoing arrangement works, and names no client and claims no outcome.
 * [TODO-CLIENT: review wording] before /clients is switched on.
 */
export const PARTNERSHIP_COPY = {
  intro:
    'Most of the work worth doing in logistics is repeat work: the same goods, on the same routes, for the same customers, week after week. These are the companies 4Jasmine Dr works with.',
  development:
    'An ongoing arrangement means capacity is planned around your programme rather than sold consignment by consignment — vehicles and storage space set aside against your expected volume, and a rate agreed in advance.',
  compliance:
    'Where goods cross a border or pass through the port, documentation is prepared before they move. You can see how a consignment was received, stored and delivered.',
};

/* ------------------------------------------------------------------ *
 * How we support each sector — /clients.
 *
 * Service patterns, not case studies: no client is named against an
 * outcome, and no volume, saving or performance figure appears.
 * ------------------------------------------------------------------ */

export const SECTOR_SUPPORT: { title: string; description: string }[] = [];

/* ------------------------------------------------------------------ *
 * What an ongoing arrangement looks like — /clients, dark band.
 * ------------------------------------------------------------------ */

export const PARTNERSHIP_POINTS: { title: string; description: string }[] = [
  { title: 'Agreed rates', description: 'A rate schedule instead of consignment-by-consignment quoting.' },
  { title: 'Planned capacity', description: 'Vehicles and space reserved against your calendar.' },
  { title: 'One contact', description: 'A named person in operations who knows your account.' },
  { title: 'Records', description: 'Delivery records you can reconcile against invoices.' },
];
