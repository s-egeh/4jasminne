import type { Metadata } from 'next';
import { Reveal } from '@/components/motion/Reveal';
import { ContactBlock } from '@/components/sections/ContactBlock';
import { CTABand } from '@/components/sections/CTABand';
import { PageHero } from '@/components/sections/PageHero';
import { CellGrid, FactorTable } from '@/components/sections/ContentBlocks';
import { SectionHeader, SectionIndex } from '@/components/ui/SectionHeader';
import {
  DOCUMENTATION_PROVIDED,
  FINANCIAL_COMPLIANCE,
  OPERATIONAL_SAFETY,
  PROCUREMENT_COPY,
  SAFETY_STANDFIRST,
  TRADE_COMPLIANCE,
  VEHICLE_COMPLIANCE,
} from '@/data/safety';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Safety, compliance and documentation',
  description:
    'How 4Jasmine Dr handles safety in the warehouse and on the road, vehicle compliance, import and export documentation, and the records clients receive.',
  path: '/safety-compliance',
});

export default function SafetyCompliancePage() {
  return (
    <>
      <PageHero
        heading="Safety, compliance and documentation"
        standfirst={SAFETY_STANDFIRST}
        image="/images/gallery/gallery-16.jpg"
        imageAlt="4Jasmine Dr drivers being briefed before departure"
        crumbs={[
          { label: 'About', href: '/about' },
          { label: 'Safety & compliance', href: '/safety-compliance' },
        ]}
      />

      {/* 1 — In the warehouse and on the road */}
      <section aria-labelledby="operational-safety-heading" className="section-y relative bg-bone">
        <div className="container-site relative">
          <SectionIndex>01</SectionIndex>

          <SectionHeader
            headingId="operational-safety-heading"
            eyebrow="Warehouse and road"
            heading="Safety is supervised, not assumed."
            intro="Goods pass through several pairs of hands between the port and the customer. These are the practices they pass through in the warehouse and on the road."
            width="wide"
          />

          <CellGrid
            cells={OPERATIONAL_SAFETY.map((block) => ({
              title: block.title,
              description: block.description,
            }))}
            columns={3}
            className="mt-14"
          />
        </div>
      </section>

      {/* 2 — Vehicle compliance (dark) */}
      <section aria-labelledby="vehicle-compliance-heading" className="grain section-y relative bg-ink-900">
        <div className="container-site relative z-10">
          <SectionIndex onDark>02</SectionIndex>

          <SectionHeader
            headingId="vehicle-compliance-heading"
            eyebrow="Vehicle compliance"
            heading="Maintained per vehicle, recorded per vehicle."
            intro="Compliance on a fleet is not a single certificate. It is held, renewed and evidenced vehicle by vehicle."
            onDark
            width="wide"
          />

          <CellGrid
            cells={VEHICLE_COMPLIANCE.map((block) => ({
              title: block.title,
              description: block.description,
            }))}
            columns={4}
            onDark
            className="mt-14"
          />
        </div>
      </section>

      {/* 3 — Import, export, tax and accounting */}
      <section aria-labelledby="regulatory-heading" className="section-y bg-paper">
        <div className="container-site relative">
          <SectionIndex>03</SectionIndex>

          <SectionHeader
            headingId="regulatory-heading"
            eyebrow="Regulatory"
            heading="Import, export, tax and accounting."
            width="tight"
          />

          <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2">
            <Reveal>
              <div className="flex h-full flex-col border-t border-line pt-8">
                <h3 className="u-eyebrow text-gold-ink">Import and export</h3>
                <p className="mt-6 max-w-measure t-body-lg text-slate-600">{TRADE_COMPLIANCE}</p>
              </div>
            </Reveal>

            <Reveal delay={70}>
              <div className="flex h-full flex-col border-t border-line pt-8">
                <h3 className="u-eyebrow text-gold-ink">Tax and accounting</h3>
                <p className="mt-6 max-w-measure t-body-lg text-slate-600">
                  {FINANCIAL_COMPLIANCE}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4 — Documentation we provide */}
      <section aria-labelledby="documentation-heading" className="section-y bg-bone">
        <div className="container-site relative">
          <SectionIndex>04</SectionIndex>

          <div className="grid grid-cols-1 gap-x-6 gap-y-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeader
                headingId="documentation-heading"
                eyebrow="Documentation"
                heading="What you receive."
                width="default"
              />
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal>
                <FactorTable rows={DOCUMENTATION_PROVIDED} />
              </Reveal>
              <Reveal delay={100}>
                <p className="mt-8 max-w-measure t-small text-slate-600">
                  Records exist so that you can reconcile what arrived, and what is in storage,
                  against what you were invoiced for — without asking us to reconstruct it after the
                  fact.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 5 — Requesting compliance documents */}
      <section aria-labelledby="procurement-heading" className="section-y bg-paper">
        <div className="container-site grid grid-cols-1 gap-x-6 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeader
              headingId="procurement-heading"
              eyebrow="For procurement teams"
              heading="Requesting compliance documents."
              intro={PROCUREMENT_COPY}
            />
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal>
              <ContactBlock showHours={false} />
            </Reveal>
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
