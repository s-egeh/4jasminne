/**
 * Canonical origin. Must match DEFAULT_SITE_URL in src/lib/utils.ts, and
 * SITE_URL / NEXT_PUBLIC_SITE_URL must be set to the same value on the host.
 * See README, "Canonical URL".
 */
const DEFAULT_SITE_URL = 'https://4jasminedrive.com';

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  /*
   * The styleguide is a build tool, not a page — it never gets indexed.
   *
   * The manifest and the file-convention icons are static routes in the build
   * output but they are not documents. next-sitemap walks the route manifest
   * and cannot tell the difference, so it would list /icon.png and
   * /apple-icon.png as crawlable URLs alongside the real pages.
   *
   * /team, /clients, /csr and /gallery are switched off until the client
   * supplies their content. This config is CommonJS and cannot import the
   * TypeScript flags that govern them, so publishing one means two changes:
   * supply its data (TEAM, CLIENTS or CSR_INITIATIVES, or set GALLERY_PUBLISHED
   * to true), and delete its path from this array.
   */
  exclude: [
    '/styleguide',
    '/manifest.webmanifest',
    '/icon.png',
    '/apple-icon.png',
    '/team',
    '/clients',
    '/csr',
    '/gallery',
  ],
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/', disallow: ['/styleguide'] }],
  },
  transform: async (config, path) => ({
    loc: path,
    changefreq: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1.0 : path.startsWith('/services') ? 0.8 : 0.7,
    lastmod: new Date().toISOString(),
  }),
};
