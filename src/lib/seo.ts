import type { Metadata } from 'next';
import { isImageAvailable } from './images';
import { absoluteUrl } from './utils';

export const SITE_NAME = '4Jasmine Dr';
export const TITLE_TEMPLATE = '%s | 4Jasmine Dr';

/** The homepage keeps this title rather than the template. Used by the root layout and the homepage. */
export const HOME_TITLE = '4Jasmine Dr | Logistics & Distribution in Tema, Ghana';
export const HOME_DESCRIPTION =
  'Logistics and distribution from the Free Zone Enclave in Tema: road freight, warehousing, last-mile distribution and freight forwarding across Ghana.';

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  /** Override the default share card. */
  image?: string;
  noindex?: boolean;
}

export function pageMetadata({ title, description, path, image, noindex }: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  // A page photograph that has not been supplied yet would be a share card
  // pointing at a 404, so the brand card stands in until it lands.
  const ogImage = image && isImageAvailable(image) ? image : '/brand/og-image.jpg';

  return {
    title,
    description,
    alternates: { canonical: url },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      locale: 'en_GH',
      images: [
        {
          url: absoluteUrl(ogImage),
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — logistics and distribution, Tema, Ghana`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [absoluteUrl(ogImage)],
    },
  };
}
