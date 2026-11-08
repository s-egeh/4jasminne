import { CLIENTS_PUBLISHED } from './clients';
import { CSR_PUBLISHED } from './csr';
import { GALLERY_PUBLISHED } from './gallery';
import { SERVICES } from './services';
import { TEAM_PUBLISHED } from './team';

export interface NavChild {
  label: string;
  href: string;
  description: string;
}

export interface NavItem {
  label: string;
  href: string;
  /** Present on the two dropdown items — drives the desktop mega-menu. */
  children?: NavChild[];
  /** Optional image + CTA for the mega-menu's fifth column. */
  feature?: { image: string; imageAlt: string; line: string; cta: { label: string; href: string } };
}

/*
 * Both dropdown triggers are disclosure buttons, not links — a trigger that
 * both navigates and opens is the pattern that breaks on touch, where the first
 * tap has to mean one thing or the other. The section's own landing page is
 * therefore always the first card in its panel, so /about and /services stay
 * one interaction away on every input type.
 */

/*
 * /team, /clients, /csr and /gallery are switched on by their data. Each route
 * still exists, but it is linked from here only once its data file holds real
 * content — see TEAM_PUBLISHED, CLIENTS_PUBLISHED, CSR_PUBLISHED and
 * GALLERY_PUBLISHED. Supplying the content brings the link back; nothing here
 * needs editing. Each one is also listed in the `exclude` array of
 * next-sitemap.config.js, which has to be edited by hand when it is published.
 */
export const NAV: NavItem[] = [
  {
    label: 'About',
    href: '/about',
    children: [
      { label: 'About us', href: '/about', description: 'Who we are and what the business does.' },
      ...(TEAM_PUBLISHED
        ? [{ label: 'Management team', href: '/team', description: 'The people accountable for your goods.' }]
        : []),
      {
        label: 'Safety & compliance',
        href: '/safety-compliance',
        description: 'What we hold ourselves to, and what we can evidence.',
      },
      ...(CSR_PUBLISHED
        ? [{ label: 'Corporate social responsibility', href: '/csr', description: 'Where we invest, and why.' }]
        : []),
      { label: 'FAQ', href: '/faq', description: 'Answers to the questions we are asked most.' },
      ...(GALLERY_PUBLISHED
        ? [{ label: 'Gallery', href: '/gallery', description: 'Our vehicles, warehouse and people.' }]
        : []),
    ],
    feature: {
      image: '/images/gallery/gallery-head-office.jpg',
      imageAlt: 'The 4Jasmine Dr office in the Free Zone Enclave, Tema',
      line: 'Logistics and distribution from the Free Zone Enclave, Tema.',
      cta: { label: 'Read about us', href: '/about' },
    },
  },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'All services', href: '/services', description: 'The four services at a glance.' },
      ...SERVICES.map((service) => ({
        label: service.name,
        href: `/services/${service.slug}`,
        description: service.menuLine,
      })),
    ],
    feature: {
      image: '/images/hero/hero-vehicle-loading.jpg',
      imageAlt: '4Jasmine Dr vehicles at the warehouse in the Free Zone Enclave, Tema',
      line: 'Freight, storage, distribution and forwarding from one team.',
      cta: { label: 'Request a quote', href: '/quote' },
    },
  },
  { label: 'Fleet', href: '/fleet' },
  { label: 'Coverage', href: '/coverage' },
  ...(CLIENTS_PUBLISHED ? [{ label: 'Clients', href: '/clients' }] : []),
  { label: 'Contact', href: '/contact' },
];

export const FOOTER_COMPANY_LINKS = [
  { label: 'About us', href: '/about' },
  ...(TEAM_PUBLISHED ? [{ label: 'Management team', href: '/team' }] : []),
  { label: 'Safety & compliance', href: '/safety-compliance' },
  ...(CLIENTS_PUBLISHED ? [{ label: 'Clients & partners', href: '/clients' }] : []),
  ...(CSR_PUBLISHED ? [{ label: 'Corporate social responsibility', href: '/csr' }] : []),
  ...(GALLERY_PUBLISHED ? [{ label: 'Gallery', href: '/gallery' }] : []),
  { label: 'Request a quote', href: '/quote' },
  { label: 'Contact us', href: '/contact' },
];

export const FOOTER_SERVICE_LINKS = [
  ...SERVICES.map((service) => ({ label: service.name, href: `/services/${service.slug}` })),
  { label: 'Our fleet', href: '/fleet' },
  { label: 'Coverage & corridors', href: '/coverage' },
  { label: 'FAQ', href: '/faq' },
];
