import { COMPANY } from '@/data/company';
import { FAQS, type FaqItem } from '@/data/faq';
import type { Service } from '@/data/services';
import { absoluteUrl } from './utils';

const headOffice = COMPANY.addresses[0];

/*
 * Fields held back from the structured data until the client confirms them.
 *
 * JSON-LD is read by search engines as a statement of fact about the business,
 * so a value that is assumed or still a default does not go into it — even
 * where the page itself shows the same value pending confirmation. Flip a flag
 * to true once the value in src/data/company.ts is confirmed.
 *
 * [TODO-CLIENT] email (assumed from the domain), legalName (registered name not
 * confirmed), hours (the defaults are a placeholder).
 *
 * There is deliberately no `geo` property: no coordinates have been supplied
 * for the premises, and the centre of Tema is not the location of the business.
 */
const CONFIRMED = {
  email: false,
  legalName: false,
  hours: false,
};

const DAY_NAMES: Record<string, string[]> = {
  'monday – friday': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  saturday: ['Saturday'],
  sunday: ['Sunday'],
};

/**
 * Opening hours, derived from COMPANY.hours rather than restated here — the
 * schema and the page were free to disagree while these were two lists.
 * "Closed" days are dropped: an OpeningHoursSpecification with no opens/closes
 * is invalid, and absence already means closed.
 */
function openingHours() {
  return COMPANY.hours
    .map((row) => {
      const times = row.hours.match(/(\d{2}:\d{2})\s*[–-]\s*(\d{2}:\d{2})/);
      const dayOfWeek = DAY_NAMES[row.days.trim().toLowerCase()];
      if (!times || !dayOfWeek) return null;
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek,
        opens: times[1],
        closes: times[2],
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);
}

const AREA_SERVED = [
  { '@type': 'Country', name: 'Ghana' },
  { '@type': 'Place', name: 'West Africa' },
];

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    '@id': absoluteUrl('/#organization'),
    name: COMPANY.name,
    ...(CONFIRMED.legalName ? { legalName: COMPANY.legalName } : {}),
    description: COMPANY.tagline,
    url: absoluteUrl('/'),
    logo: absoluteUrl('/brand/4jasmine-logo-full.png'),
    image: absoluteUrl('/brand/og-image.jpg'),
    ...(CONFIRMED.email ? { email: COMPANY.email } : {}),
    telephone: COMPANY.phones.map((phone) => phone.tel),
    address: {
      '@type': 'PostalAddress',
      streetAddress: headOffice.lines.join(', '),
      addressLocality: headOffice.locality,
      addressRegion: headOffice.region,
      addressCountry: headOffice.countryCode,
    },
    areaServed: AREA_SERVED,
    ...(CONFIRMED.hours ? { openingHoursSpecification: openingHours() } : {}),
    // sameAs is omitted entirely when no social accounts are confirmed.
    ...(COMPANY.socials.length > 0
      ? { sameAs: (COMPANY.socials as ReadonlyArray<{ href: string }>).map((social) => social.href) }
      : {}),
  };
}

export function serviceSchema(service: Service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.heading,
    description: service.standfirst,
    serviceType: service.division,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: { '@id': absoluteUrl('/#organization') },
    areaServed: AREA_SERVED,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${service.name} capabilities`,
      itemListElement: service.capabilities.map((capability) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: capability.title },
      })),
    },
  };
}

export function breadcrumbSchema(trail: { label: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}

/** Defaults to the /services excerpt; /faq passes the full set. */
export function faqSchema(items: FaqItem[] = FAQS) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}
