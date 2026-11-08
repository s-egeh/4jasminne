/** @type {import('next').NextConfig} */

// Static export is opt-in via STATIC_EXPORT=true so the same codebase can ship to
// Vercel (default, with the /api/contact route) or to a cPanel shared host in Ghana.
// See README "Deploying to cPanel" for the trade-offs.
const isStaticExport = process.env.STATIC_EXPORT === 'true';

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  /*
   * The contact API route lives at `api/contact/route.api.ts`, and `api.ts` is
   * only a recognised page extension outside static export.
   *
   * `output: 'export'` refuses to build a POST route handler at all, so the
   * route has to disappear from the build rather than merely go unused. Gating
   * it on the extension keeps one codebase serving both deployment targets.
   * When it is gone, the forms fall back to NEXT_PUBLIC_FORM_ENDPOINT — see
   * src/lib/submit.ts.
   */
  pageExtensions: isStaticExport
    ? ['tsx', 'ts', 'jsx', 'js']
    : ['tsx', 'ts', 'jsx', 'js', 'api.ts'],

  ...(isStaticExport
    ? {
        output: 'export',
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {
        images: {
          formats: ['image/avif', 'image/webp'],
          deviceSizes: [360, 390, 640, 768, 1024, 1280, 1440, 1920, 2400],
        },

        /*
         * Long cache lives for the static assets under /public. Next already
         * fingerprints everything it emits under /_next/static and caches it
         * immutably; /public is served verbatim, so it needs saying here.
         *
         * Not available on the static-export target — `output: 'export'` emits
         * files and no server, so the equivalent rules belong in the cPanel
         * .htaccess. See README, "Deploying to cPanel".
         */
        async headers() {
          return [
            {
              source: '/brand/:path*',
              headers: [
                { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
              ],
            },
            {
              source: '/images/:path*',
              headers: [
                { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
              ],
            },
            {
              source: '/fonts/:path*',
              headers: [
                { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
              ],
            },
          ];
        },
      }),
};

export default nextConfig;
