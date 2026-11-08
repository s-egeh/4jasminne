import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Reveal } from '@/components/motion/Reveal';
import { CellGrid, PullQuote } from '@/components/sections/ContentBlocks';
import { CTABand } from '@/components/sections/CTABand';
import { ImageStrip } from '@/components/sections/ImageStrip';
import { RelatedLinks } from '@/components/sections/RelatedLinks';
import { PageHero } from '@/components/sections/PageHero';
import { Figure } from '@/components/ui/Media';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  CSR_INITIATIVES,
  CSR_INTRO,
  CSR_PUBLISHED,
  CSR_SELECTION,
  CSR_SUSTAINABILITY,
  SUSTAINABILITY_BLOCKS,
} from '@/data/csr';
import { TEAM_PUBLISHED } from '@/data/team';
import { pageMetadata } from '@/lib/seo';

/*
 * /csr is switched off until the client supplies its community work
 * (src/data/csr.ts). While CSR_INITIATIVES is empty the route returns a 404 and
 * carries noindex, and it is left out of the navigation, the footer and the
 * sitemap. Each copy block below renders only when it has been supplied.
 */
export const metadata: Metadata = pageMetadata({
  title: 'Corporate social responsibility',
  description:
    'The community and sustainability work 4Jasmine Dr supports in Tema and along the routes it runs, and how the business chooses where to invest its time.',
  path: '/csr',
  noindex: !CSR_PUBLISHED,
});

export default function CsrPage() {
  if (!CSR_PUBLISHED) notFound();

  // The strip at the foot of the page shows the initiatives' own photographs.
  const programmeImages = CSR_INITIATIVES.slice(0, 3);

  return (
    <>
      <PageHero
        heading="Corporate social responsibility"
        standfirst="The community and sustainability work we support, in the places we operate."
        image={CSR_INITIATIVES[0].image}
        imageAlt={CSR_INITIATIVES[0].imageAlt}
        crumbs={[{ label: 'CSR', href: '/csr' }]}
      />

      {/* 1 — Intro, when supplied */}
      {CSR_INTRO ? (
        <section aria-labelledby="csr-intro-heading" className="section-y bg-bone">
          <div className="container-site">
            <h2 id="csr-intro-heading" className="sr-only">
              Our approach
            </h2>
            <Reveal>
              <p className="max-w-legal t-body-lg text-slate-600">{CSR_INTRO}</p>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/*
        2 — Initiatives.

        Each of the four was a card in a row of four, which gave every
        programme two lines and no room to say anything. They are now full
        alternating rows: image one side, copy the other, flipping each time.
      */}
      <section aria-labelledby="csr-initiatives-heading" className="section-y bg-bone pt-0">
        <div className="container-site">
          <SectionHeader
            headingId="csr-initiatives-heading"
            eyebrow="Programmes"
            heading="Where we put money and time."
            width="wide"
          />

          <div className="mt-16 flex flex-col gap-16 lg:gap-24">
            {CSR_INITIATIVES.map((initiative, index) => {
              const flipped = index % 2 === 1;
              return (
                <div
                  key={initiative.slug}
                  className="grid grid-cols-1 items-center gap-x-6 gap-y-8 lg:grid-cols-12"
                >
                  <Reveal
                    className={
                      flipped
                        ? 'lg:col-span-6 lg:col-start-7 lg:row-start-1'
                        : 'lg:col-span-6 lg:row-start-1'
                    }
                  >
                    <Figure
                      src={initiative.image}
                      alt={initiative.imageAlt}
                      className="aspect-card w-full border-b border-gold"
                      imageClassName="h-full w-full"
                      sizes="(min-width: 1024px) 600px, 100vw"
                    />
                  </Reveal>

                  <div
                    className={
                      flipped
                        ? 'lg:col-span-5 lg:col-start-1 lg:row-start-1'
                        : 'lg:col-span-5 lg:col-start-8 lg:row-start-1'
                    }
                  >
                    <Reveal delay={70}>
                      <h3 className="t-h3 font-bold text-ink-900">{initiative.title}</h3>
                    </Reveal>
                    <Reveal delay={120}>
                      <p className="mt-5 max-w-measure t-body-lg text-slate-600">
                        {initiative.detail}
                      </p>
                    </Reveal>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3 — Sustainability in operations (dark), when supplied */}
      {CSR_SUSTAINABILITY ? (
        <section aria-labelledby="sustainability-heading" className="grain section-y relative bg-ink-900">
          <div className="container-site relative z-10">
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <SectionHeader
                  headingId="sustainability-heading"
                  eyebrow="Sustainability"
                  heading="Treated as an operational matter."
                  onDark
                  width="default"
                />
              </div>
              <div className="lg:col-span-6 lg:col-start-7">
                <Reveal>
                  <p className="max-w-measure t-body-lg text-slate-400">{CSR_SUSTAINABILITY}</p>
                </Reveal>
              </div>
            </div>

            {SUSTAINABILITY_BLOCKS.length > 0 ? (
            <CellGrid cells={SUSTAINABILITY_BLOCKS} columns={3} onDark className="mt-14" />
          ) : null}
          </div>
        </section>
      ) : null}

      {/* 4 — How we choose initiatives, when supplied */}
      {CSR_SELECTION ? (
        <section aria-labelledby="csr-selection-heading" className="section-y bg-paper">
          <div className="container-site grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeader
                headingId="csr-selection-heading"
                eyebrow="Selection"
                heading="How we choose initiatives."
                width="tight"
              />
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal>
                <PullQuote>{CSR_SELECTION}</PullQuote>
              </Reveal>
            </div>
          </div>
        </section>
      ) : null}

      {/* 5 — Photographs from the programmes */}
      <section aria-labelledby="csr-gallery-heading" className="section-y bg-bone">
        <div className="container-site">
          <SectionHeader
            headingId="csr-gallery-heading"
            eyebrow="In the community"
            heading="Photographs from our programmes."
          />
          <div className="mt-12">
            <ImageStrip
              images={programmeImages.map((item) => ({
                src: item.image,
                alt: item.imageAlt,
                caption: item.title,
              }))}
            />
          </div>

          <div className="mt-14">
            <RelatedLinks
              lead="This work sits alongside"
              links={[
                { label: 'how the company is run', href: '/about' },
                { label: 'the standards we hold ourselves to', href: '/safety-compliance' },
                ...(TEAM_PUBLISHED
                  ? [{ label: 'the people accountable for it', href: '/team' }]
                  : [{ label: 'the questions we are asked most', href: '/faq' }]),
              ]}
            />
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
