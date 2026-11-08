import type { MetadataRoute } from 'next';
import { COMPANY } from '@/data/company';

/**
 * Web app manifest, served at /manifest.webmanifest and linked automatically.
 *
 * Written by hand rather than shipping the generator's `site.webmanifest`,
 * whose defaults were wrong in three ways: empty `name` and `short_name`, a
 * white theme and background against an ink-dark site, and icon paths rooted at
 * `/` where the files do not live.
 *
 * Icons are generated from the client's logo by scripts/build-logo-variants.mjs. The maskable entry is a separate
 * file rather than `purpose: 'any maskable'` on the square ones, because
 * Android crops an installed icon to the launcher's shape and the artwork needs
 * the 80% safe circle to survive it.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: COMPANY.name,
    short_name: COMPANY.name,
    description: COMPANY.tagline,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#0E2C4E',
    theme_color: '#0E2C4E',
    lang: 'en-GH',
    dir: 'ltr',
    categories: ['business'],
    icons: [
      { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      {
        src: '/brand/icon-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
