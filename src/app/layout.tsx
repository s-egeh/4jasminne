import type { Metadata, Viewport } from 'next';
import { Analytics } from '@/components/layout/Analytics';
import { FloatingActions } from '@/components/layout/FloatingActions';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { PageTransition } from '@/components/layout/PageTransition';
import { Preloader } from '@/components/layout/Preloader';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { organizationSchema } from '@/lib/schema';
import { absoluteUrl } from '@/lib/utils';
import { HOME_DESCRIPTION, HOME_TITLE, SITE_NAME, TITLE_TEMPLATE } from '@/lib/seo';
import { fontVariables } from './fonts';
import '@/styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl('/')),
  title: {
    default: HOME_TITLE,
    template: TITLE_TEMPLATE,
  },
  description: HOME_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { telephone: true, address: true, email: true },
  /*
   * No `icons` block. The browser and device icons are file-convention files —
   * src/app/favicon.ico, icon.png and apple-icon.png — and Next emits the link
   * tags for them itself. Declaring them here as well produced two sets of
   * tags pointing at two copies of the same artwork.
   */
};

export const viewport: Viewport = {
  themeColor: '#0E2C4E',
  width: 'device-width',
  initialScale: 1,
  // Lets the page paint into the iOS safe areas; every fixed element that could
  // land under the home indicator pads itself back out with env(safe-area-*).
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GH" className={fontVariables}>
      <body>
        <script
          type="application/ld+json"
          // Organization and LocalBusiness sit on every page so the entity is
          // unambiguous regardless of which page is crawled first.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />

        <a
          href="#main"
          className="sr-only-focusable fixed left-6 top-6 z-[110] bg-ink-900 px-5 py-3 font-mono text-[12px] font-medium uppercase tracking-[0.12em] text-white"
        >
          Skip to content
        </a>

        <Preloader />
        <SmoothScroll />
        <PageTransition />

        <Header />

        <main id="main">{children}</main>

        <Footer />
        <FloatingActions />
        <Analytics />
      </body>
    </html>
  );
}
