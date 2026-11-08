import type { Metadata } from 'next';
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { Reveal } from '@/components/motion/Reveal';
import { CTABand } from '@/components/sections/CTABand';
import { RelatedLinks } from '@/components/sections/RelatedLinks';
import { PageHero } from '@/components/sections/PageHero';
import { SectionHeader, SectionIndex } from '@/components/ui/SectionHeader';
import { KeyFacts } from '@/components/sections/ContentBlocks';
import { COVERAGE_COPY } from '@/data/coverage';
import { COMPANY } from '@/data/company';
import { CoverageNetwork } from '@/components/sections/CoverageNetwork';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Coverage and corridors',
  description:
    'Distribution nationwide from the Free Zone Enclave in Tema, with regular routes to Accra, Kumasi, Takoradi and Tamale and movement into West Africa.',
  path: '/coverage',
});

export default function CoveragePage() {
  return (
    <>
      <PageHero
        heading="Coverage and corridors"
        standfirst={COVERAGE_COPY.standfirst}
        image="/images/hero/hero-02.jpg"
        imageAlt="A 4Jasmine Dr truck on the trunk road between Tema and Kumasi"
        crumbs={[{ label: 'Coverage', href: '/coverage' }]}
      />

      {/* 1 — Where we run */}
      <section aria-labelledby="corridors-heading" className="section-y relative bg-bone">
        <div className="container-site relative">
          <SectionIndex>01</SectionIndex>

          <div className="grid grid-cols-1 gap-x-6 gap-y-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeader
                headingId="corridors-heading"
                eyebrow="Where we run"
                heading="The routes we run most often."
                width="default"
              >
                <KeyFacts
                  rows={[
                    { label: 'Base', value: 'FREE ZONE ENCLAVE, TEMA' },
                    { label: 'Domestic', value: 'NATIONWIDE' },
                    { label: 'Sub-region', value: 'WEST AFRICA, CASE BY CASE' },
                    { label: 'Engagement', value: 'PER CONSIGNMENT OR ONGOING' },
                  ]}
                />
              </SectionHeader>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <div className="flex flex-col gap-5">
                {COVERAGE_COPY.whereWeRun.map((paragraph, index) => (
                  <Reveal key={paragraph.slice(0, 24)} delay={index * 70}>
                    <p className="max-w-measure t-body-lg text-slate-600">{paragraph}</p>
                  </Reveal>
                ))}
              </div>

              {/*
                The corridor list used to sit here and the map sat alone in the
                next section. They belong together — the list is what the map is
                illustrating — so both now live in section 02.
              */}
            </div>
          </div>
        </div>
      </section>

      {/* 2 — Map (dark) */}
      <section aria-labelledby="coverage-map-heading" className="grain section-y relative bg-ink-900">
        <div className="container-site relative z-10">
          <SectionIndex onDark>02</SectionIndex>

          <SectionHeader
            headingId="coverage-map-heading"
            eyebrow="The network"
            heading="Where the goods go."
            intro="The ring marks the base in Tema. The short runs into Accra and from the port sit too close to the hub to draw, so they are listed rather than mapped."
            onDark
          />

          <Reveal delay={120} className="mt-14 block">
            <CoverageNetwork />
          </Reveal>
        </div>
      </section>

      {/* 3 — Cross-border */}
      <section aria-labelledby="cross-border-heading" className="section-y bg-paper">
        <div className="container-site relative">
          <SectionIndex>03</SectionIndex>

          <div className="grid grid-cols-1 gap-x-6 gap-y-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeader
                headingId="cross-border-heading"
                eyebrow="Cross-border"
                heading="Into the sub-region."
                width="tight"
              />
            </div>

            <div className="flex flex-col gap-5 lg:col-span-6 lg:col-start-7">
              {COVERAGE_COPY.crossBorder.map((paragraph, index) => (
                <Reveal key={paragraph.slice(0, 24)} delay={index * 70}>
                  <p className="max-w-measure t-body-lg text-slate-600">{paragraph}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4 — Planning around access */}
      <section aria-labelledby="access-heading" className="section-y bg-bone">
        <div className="container-site relative">
          <SectionIndex>04</SectionIndex>

          <div className="grid grid-cols-1 gap-x-6 gap-y-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeader
                headingId="access-heading"
                eyebrow="Route conditions"
                heading="Why access changes the price."
                width="default"
              >
                <KeyFacts
                  rows={[
                    { label: 'Access', value: 'LOADING BAY, STREET WIDTH, TURNING ROOM' },
                    { label: 'Hours', value: 'WHEN THE DELIVERY POINT CAN RECEIVE' },
                    { label: 'Turnaround', value: 'TIME THE VEHICLE IS HELD' },
                  ]}
                />
              </SectionHeader>
            </div>

            <div className="flex flex-col gap-5 lg:col-span-6 lg:col-start-7">
              {COVERAGE_COPY.access.map((paragraph, index) => (
                <Reveal key={paragraph.slice(0, 24)} delay={index * 70}>
                  <p className="max-w-measure t-body-lg text-slate-600">{paragraph}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5 — Route not listed */}
      <section aria-labelledby="coverage-cta-heading" className="section-y bg-paper">
        <div className="container-site grid grid-cols-1 gap-x-6 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeader
              headingId="coverage-cta-heading"
              eyebrow="Ask us"
              heading="Route not listed? Ask us."
              intro="The routes above are the regular runs, not the limit of where we go. Send the collection and delivery points and operations will price it."
            />
            <Reveal delay={140} className="mt-10 block">
              <EnquiryForm />
            </Reveal>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal>
              <div className="border border-line bg-bone p-7">
                <h3 className="u-eyebrow text-gold-ink">Rather call?</h3>
                <p className="mt-5 t-small text-slate-600">
                  Operations can tell you on the phone whether a route is workable before you put
                  anything in writing.
                </p>
                <a
                  href={`tel:${COMPANY.phones[0].tel}`}
                  className="mt-6 inline-flex min-h-11 items-center u-mono text-[12px] text-ink-900 u-underline lg:min-h-0"
                >
                  {COMPANY.phones[0].display}
                </a>
              </div>
            </Reveal>
          </div>

          <div className="mt-14">
            <RelatedLinks
              lead="Coverage is only half the answer — the rest is in"
              links={[
                { label: 'how freight and haulage works', href: '/services/freight-haulage' },
                { label: 'the vehicles we use', href: '/fleet' },
                { label: 'the questions we are asked most', href: '/faq' },
              ]}
            />
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
