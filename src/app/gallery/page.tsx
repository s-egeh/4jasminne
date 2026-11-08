import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CTABand } from '@/components/sections/CTABand';
import { GalleryGrid } from '@/components/sections/GalleryGrid';
import { RelatedLinks } from '@/components/sections/RelatedLinks';
import { PageHero } from '@/components/sections/PageHero';
import { GALLERY_PUBLISHED } from '@/data/gallery';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Gallery',
  description:
    'Photographs of 4Jasmine Dr vehicles, the warehouse in the Free Zone Enclave, distribution runs, port collections and the team behind them in Tema, Ghana.',
  path: '/gallery',
  // Unlinked and unindexed until there are real photographs to show.
  noindex: !GALLERY_PUBLISHED,
});

export default function GalleryPage() {
  return (
    <>
      <PageHero
        heading="Gallery"
        standfirst="Our vehicles, our warehouse and our people."
        image="/images/gallery/gallery-12.jpg"
        imageAlt="A 4Jasmine Dr truck on a national highway at dusk"
        crumbs={[{ label: 'Gallery', href: '/gallery' }]}
      />

      <section aria-labelledby="gallery-heading" className="section-y bg-bone">
        <div className="container-site">
          <h2 id="gallery-heading" className="sr-only">
            Photographs
          </h2>
          {/* useSearchParams needs a Suspense boundary during prerender. */}
          <Suspense fallback={<div className="h-[60vh]" aria-hidden="true" />}>
            <GalleryGrid />
          </Suspense>

          <div className="mt-14">
            <RelatedLinks
              lead="What is in these photographs is described in full on"
              links={[
                { label: 'the fleet page', href: '/fleet' },
                { label: 'our services', href: '/services' },
                { label: 'coverage and corridors', href: '/coverage' },
              ]}
            />
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
