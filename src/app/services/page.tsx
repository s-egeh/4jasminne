import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { CTABand } from '@/components/sections/CTABand';
import { PageHero } from '@/components/sections/PageHero';
import { Accordion } from '@/components/ui/Accordion';
import { TextLink } from '@/components/ui/Button';
import { Figure } from '@/components/ui/Media';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { IndexTag } from '@/components/ui/Stat';
import { FAQS } from '@/data/faq';
import { PROCESS_STEPS, SERVICES } from '@/data/services';
import { pageMetadata } from '@/lib/seo';
import { cn } from '@/lib/utils';

export const metadata: Metadata = pageMetadata({
  title: 'Services',
  description:
    'Road freight and haulage, warehousing and storage, scheduled and last-mile distribution, and freight forwarding from the Free Zone Enclave in Tema.',
  path: '/services',
});

export default function ServicesPage() {
  return (
    <>
      {/*
        No FAQPage markup here. The same questions are marked up on /faq, and
        duplicate FAQ structured data across pages is a well-known flag — the
        page still renders its FAQ section for readers, it just does not claim
        the answers a second time. /faq is the canonical source.
      */}

      <PageHero
        heading="Services"
        standfirst="Freight, storage, distribution and forwarding — delivered by one accountable team."
        image="/images/hero/hero-03.jpg"
        imageAlt="4Jasmine Dr vehicles at the warehouse in the Free Zone Enclave, Tema"
        crumbs={[{ label: 'Services', href: '/services' }]}
      />

      {/* 1 — Alternating full-width rows. Deliberately not the homepage grid. */}
      <section aria-labelledby="divisions-heading" className="section-y bg-bone">
        <div className="container-site">
          <SectionHeader
            headingId="divisions-heading"
            eyebrow="Services"
            heading="Four services that work off the same schedule."
            intro="Freight, storage, distribution and forwarding are run by one team, so a delay in one is visible to the people responsible for the others."
          />

          <div className="mt-16 border-t border-line">
            {SERVICES.map((service, index) => {
              const reversed = index % 2 === 1;
              return (
                <Reveal key={service.slug}>
                  <article className="grid grid-cols-1 items-center gap-x-10 gap-y-8 border-b border-line py-16 lg:grid-cols-12 lg:py-24">
                    <div
                      className={cn(
                        'lg:col-span-6',
                        // Mobile always shows image first: consistency beats
                        // mirrored order when the columns collapse.
                        reversed ? 'lg:order-2 lg:col-start-7' : 'lg:order-1',
                      )}
                    >
                      <Figure
                        src={service.image}
                        alt={service.imageAlt}
                        className="aspect-card w-full border-b border-gold"
                        imageClassName="h-full w-full"
                        sizes="(min-width: 1024px) 620px, 100vw"
                      />
                    </div>

                    <div
                      className={cn(
                        'lg:col-span-5',
                        reversed ? 'lg:order-1 lg:col-start-1' : 'lg:order-2 lg:col-start-8',
                      )}
                    >
                      <IndexTag>{service.index}</IndexTag>
                      <h3 className="mt-5 t-h3 font-bold text-ink-900">{service.heading}</h3>
                      <p className="mt-4 max-w-measure text-slate-600">{service.summary}</p>

                      <ul className="mt-7 flex flex-col gap-3">
                        {service.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-3 t-small text-slate-600">
                            <Check
                              aria-hidden="true"
                              strokeWidth={1.5}
                              className="mt-1 h-4 w-4 shrink-0 text-gold-ink"
                            />
                            {bullet}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-8">
                        <TextLink href={`/services/${service.slug}`}>Explore service</TextLink>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2 — How we work (dark). A genuine sequence, so numbering means something. */}
      <section aria-labelledby="process-heading" className="grain section-y relative bg-ink-900">
        <div className="container-site relative z-10">
          <SectionHeader
            headingId="process-heading"
            eyebrow="How we work"
            heading="From enquiry to confirmed delivery."
            onDark
          />

          <ol className="mt-14 grid grid-cols-1 gap-px border border-line-dark bg-line-dark md:grid-cols-4">
            {PROCESS_STEPS.map((step, index) => (
              <Reveal key={step.index} delay={index * 90} as="li" className="block bg-ink-900">
                <div className="relative flex h-full flex-col gap-4 p-8">
                  <span className="u-mono text-[12px] text-gold">{step.index}</span>
                  <h3 className="t-h4 font-semibold text-white">{step.title}</h3>
                  <p className="t-small text-slate-400">{step.description}</p>

                  {index < PROCESS_STEPS.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="absolute -right-[7px] top-1/2 hidden h-0 w-0 -translate-y-1/2 border-y-[5px] border-l-[7px] border-y-transparent border-l-gold md:block"
                    />
                  ) : null}
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 3 — FAQ */}
      <section aria-labelledby="faq-heading" className="section-y bg-bone">
        <div className="container-site grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            {/* The link goes under the header, not in the `cta` slot: as a
                sibling it sits beside the heading and squeezes it to three
                lines inside this five-column cell. */}
            <SectionHeader
              headingId="faq-heading"
              eyebrow="Questions"
              heading="Answers before you call."
              width="tight"
            >
              <TextLink href="/faq">See all questions</TextLink>
            </SectionHeader>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal>
              <Accordion items={FAQS} defaultOpen={0} />
            </Reveal>
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
