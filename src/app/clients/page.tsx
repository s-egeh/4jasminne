import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Reveal } from '@/components/motion/Reveal';
import { ClientGrid } from '@/components/sections/ClientGrid';
import { CellGrid } from '@/components/sections/ContentBlocks';
import { CTABand } from '@/components/sections/CTABand';
import { PageHero } from '@/components/sections/PageHero';
import { TestimonialRail } from '@/components/sections/TestimonialRail';
import { ButtonLink } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  CLIENTS_PUBLISHED,
  PARTNERSHIP_COPY,
  PARTNERSHIP_POINTS,
  SECTOR_SUPPORT,
  TESTIMONIALS,
} from '@/data/clients';
import { SECTORS } from '@/data/services';
import { pageMetadata } from '@/lib/seo';

/*
 * /clients is switched off until the client supplies the companies it may name
 * (src/data/clients.ts). While CLIENTS is empty the route returns a 404 and
 * carries noindex, and it is left out of the navigation, the footer and the
 * sitemap.
 */
export const metadata: Metadata = pageMetadata({
  title: 'Clients and partners',
  description:
    'The companies 4Jasmine Dr moves, stores and distributes goods for from the Free Zone Enclave in Tema, and what an ongoing logistics arrangement involves.',
  path: '/clients',
  noindex: !CLIENTS_PUBLISHED,
});

export default function ClientsPage() {
  if (!CLIENTS_PUBLISHED) notFound();

  return (
    <>
      <PageHero
        heading="Clients and partners"
        standfirst="Ongoing arrangements with companies that depend on their goods arriving on time."
        image="/images/gallery/gallery-distributor-unloading.jpg"
        imageAlt="A delivery being unloaded at a distributor’s warehouse"
        crumbs={[{ label: 'Clients', href: '/clients' }]}
      />

      {/* 1 — Intro */}
      <section aria-labelledby="clients-intro-heading" className="section-y bg-bone">
        <div className="container-site">
          <h2 id="clients-intro-heading" className="sr-only">
            Our partnerships
          </h2>
          <Reveal>
            <p className="max-w-legal t-body-lg text-slate-600">{PARTNERSHIP_COPY.intro}</p>
          </Reveal>
        </div>
      </section>

      {/* 2 — Client grid */}
      <section aria-labelledby="client-grid-heading" className="section-y bg-bone pt-0">
        <div className="container-site">
          <SectionHeader
            headingId="client-grid-heading"
            eyebrow="Who we work with"
            heading="Companies we work for."
          />
          <div className="mt-12">
            <ClientGrid />
          </div>
        </div>
      </section>

      {/* Testimonials render only when real, attributed quotes exist. */}
      {TESTIMONIALS.length > 0 ? (
        <section aria-labelledby="testimonials-heading" className="section-y bg-bone pt-0">
          <div className="container-site">
            <SectionHeader
              headingId="testimonials-heading"
              eyebrow="In their words"
              heading="What clients say."
            />
            <div className="mt-12">
              <TestimonialRail />
            </div>
          </div>
        </section>
      ) : null}

      {/* 3 — Partnership approach (dark) */}
      <section aria-labelledby="partnership-heading" className="grain section-y relative bg-ink-900">
        <div className="container-site relative z-10">
          <SectionHeader
            headingId="partnership-heading"
            eyebrow="Partnership approach"
            heading="Capacity planned around your programme."
            onDark
          />

          <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-2">
            <Reveal>
              <p className="max-w-measure t-body-lg text-slate-400">
                {PARTNERSHIP_COPY.development}
              </p>
            </Reveal>
            <Reveal delay={70}>
              <p className="max-w-measure t-body-lg text-slate-400">
                {PARTNERSHIP_COPY.compliance}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4 — How we support each sector. Renders only when supplied. */}
      {SECTOR_SUPPORT.length > 0 ? (
        <section aria-labelledby="sector-support-heading" className="section-y bg-paper">
          <div className="container-site">
            <SectionHeader
              headingId="sector-support-heading"
              eyebrow="Service patterns"
              heading="How we support each sector."
              intro="What the work actually looks like, sector by sector. These are service patterns, not case studies — no client is named against an outcome and no figure is claimed."
              width="wide"
            />

            <CellGrid cells={SECTOR_SUPPORT} columns={3} className="mt-14" />
          </div>
        </section>
      ) : null}

      {/* 5 — What a partnership looks like (dark) */}
      <section aria-labelledby="partnership-points-heading" className="grain section-y relative bg-ink-900">
        <div className="container-site relative z-10">
          <SectionHeader
            headingId="partnership-points-heading"
            eyebrow="Partnership"
            heading="What an ongoing arrangement looks like."
            intro="The practical difference between an agreed arrangement and calling us when something needs moving."
            onDark
            width="wide"
          />

          <CellGrid cells={PARTNERSHIP_POINTS} columns={4} onDark className="mt-14" />
        </div>
      </section>


      {/* 7 — Sectors served */}
      <section aria-labelledby="client-sectors-heading" className="section-y bg-bone">
        <div className="container-site">
          <SectionHeader
            headingId="client-sectors-heading"
            eyebrow="Sectors served"
            heading="The sectors we work with."
          />

          <div className="mt-12 grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
            {SECTORS.map((sector, index) => {
              const Icon = sector.icon;
              return (
                <Reveal
                  key={sector.title}
                  delay={Math.min(index, 5) * 70}
                  className="border-b border-r border-line"
                >
                  <div className="flex h-full items-start gap-4 p-7">
                    <Icon aria-hidden="true" strokeWidth={1.5} className="mt-1 h-6 w-6 shrink-0 text-gold" />
                    <div>
                      <h3 className="t-h4 font-semibold text-ink-900">{sector.title}</h3>
                      <p className="mt-2 t-small text-slate-600">{sector.description}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8 — Work with us, from either side */}
      <section aria-labelledby="work-with-us-heading" className="section-y bg-bone pt-0">
        <div className="container-site">
          <h2 id="work-with-us-heading" className="sr-only">
            Work with us
          </h2>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="flex h-full flex-col border border-line bg-paper p-9 md:p-12">
                <h3 className="t-h3 font-bold text-ink-900">Become a client.</h3>
                <p className="mt-4 max-w-measure text-slate-600">
                  Send the details of the goods and operations will come back with pricing and
                  available dates. For repeat volume we agree a rate schedule rather than quoting
                  every consignment.
                </p>
                <div className="mt-8">
                  <ButtonLink href="/quote" size="lg" withArrow>
                    Request a quote
                  </ButtonLink>
                </div>
              </div>
            </Reveal>

            <Reveal delay={70}>
              <div className="flex h-full flex-col border border-line bg-paper p-9 md:p-12">
                <h3 className="t-h3 font-bold text-ink-900">Work with us.</h3>
                <p className="mt-4 max-w-measure text-slate-600">
                  If you run vehicles, storage or services that a logistics operation depends on,
                  tell us what you offer and where. Terms are agreed before anything moves.
                </p>
                <div className="mt-8">
                  <ButtonLink href="/contact" size="lg" variant="secondary-light">
                    Contact us
                  </ButtonLink>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
