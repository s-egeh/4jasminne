import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { CellGrid, FactorTable, ScopeColumns } from '@/components/sections/ContentBlocks';
import { CTABand } from '@/components/sections/CTABand';
import { ImageStrip } from '@/components/sections/ImageStrip';
import { PageHero } from '@/components/sections/PageHero';
import { ServiceExtras } from '@/components/sections/ServiceExtras';
import { Accordion } from '@/components/ui/Accordion';
import { ButtonLink, TextLink } from '@/components/ui/Button';
import { Eyebrow, SectionHeader } from '@/components/ui/SectionHeader';
import { getServiceFaqs } from '@/data/faq';
import { ENQUIRY_CHECKLIST, PRICING_CLOSING, PRICING_FACTORS } from '@/data/operations';
import {
  getService,
  getSiblingServices,
  SECTORS,
  SERVICE_SCOPE,
  SERVICES,
} from '@/data/services';
import { serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const service = getService(params.slug);
  if (!service) return {};

  /*
   * Standfirst plus summary, cut at a word boundary to stay inside the 160
   * characters a search result shows — never mid-word.
   */
  const full = `${service.standfirst} ${service.summary}`;
  const description =
    full.length <= 158
      ? full
      : `${full.slice(0, full.lastIndexOf(' ', 157)).replace(/[\s,;:—-]+$/, '')}…`;

  return pageMetadata({
    title: service.heading,
    description,
    path: `/services/${service.slug}`,
    image: service.heroImage,
  });
}

export default function ServiceDetailPage({ params }: PageProps) {
  const service = getService(params.slug);
  if (!service) notFound();

  const siblings = getSiblingServices(service.slug);
  const scope = SERVICE_SCOPE[service.slug];
  const faqs = getServiceFaqs(service.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema(service)) }}
      />

      <PageHero
        heading={service.heading}
        standfirst={service.standfirst}
        image={service.heroImage}
        imageAlt={service.heroImageAlt}
        crumbs={[
          { label: 'Services', href: '/services' },
          { label: service.name, href: `/services/${service.slug}` },
        ]}
      />

      {/* 2 — Overview with the sticky "at a glance" card */}
      <section aria-labelledby="service-overview-heading" className="section-y bg-bone">
        <div className="container-site grid grid-cols-1 gap-x-6 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 id="service-overview-heading" className="sr-only">
              Overview
            </h2>
            <div className="flex flex-col gap-6">
              {service.overview.map((paragraph, index) => (
                <Reveal key={paragraph.slice(0, 24)} delay={index * 70}>
                  <p className="max-w-measure t-body-lg text-slate-600">{paragraph}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal>
              {/* Sticky on desktop only; on tablet and below it is a static
                  block above the capabilities, per the responsive notes. */}
              <div className="border border-line bg-paper p-7 lg:sticky lg:top-[120px]">
                <h3 className="u-eyebrow text-gold-ink">At a glance</h3>

                <dl className="mt-6 border-t border-line">
                  {service.glance.map((row) => (
                    <div key={row.label} className="border-b border-line py-4">
                      <dt className="u-mono text-[10px] text-slate-600">{row.label}</dt>
                      <dd className="mt-1.5 t-small text-ink-900">{row.value}</dd>
                    </div>
                  ))}
                </dl>

                <ButtonLink href="/quote" size="lg" withArrow className="mt-7 w-full">
                  Request a quote
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3 — Capabilities */}
      <section aria-labelledby="capabilities-heading" className="section-y bg-bone pt-0">
        <div className="container-site">
          <SectionHeader
            headingId="capabilities-heading"
            eyebrow="Capabilities"
            heading="What this service actually covers."
          />

          <div className="mt-14 grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
            {service.capabilities.map((capability, index) => {
              const Icon = capability.icon;
              return (
                <Reveal
                  key={capability.title}
                  delay={index * 70}
                  className="border-b border-r border-line"
                >
                  <div className="flex h-full flex-col gap-4 p-7">
                    <Icon aria-hidden="true" strokeWidth={1.5} className="h-7 w-7 text-gold" />
                    <h3 className="t-h4 font-semibold text-ink-900">{capability.title}</h3>
                    <p className="t-small text-slate-600">{capability.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4 — What's included / what's not */}
      <section aria-labelledby="scope-heading" className="section-y bg-paper">
        <div className="container-site">
          <SectionHeader
            headingId="scope-heading"
            eyebrow="Scope"
            heading="What's included, and what isn't."
            intro="Being explicit about the second column is the point. It is cheaper for both of us to disagree now than on the day."
            width="wide"
          />

          <Reveal delay={120} className="mt-14 block">
            <ScopeColumns included={scope.included} excluded={scope.excluded} />
          </Reveal>
        </div>
      </section>

      {/* 5 — Service-specific sections */}
      <ServiceExtras slug={service.slug} />

      {/* 6 — How this is priced */}
      <section aria-labelledby="pricing-heading" className="section-y bg-bone">
        <div className="container-site grid grid-cols-1 gap-x-6 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeader
              headingId="pricing-heading"
              eyebrow="Pricing"
              heading="How this is priced."
              width="tight"
            />
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <FactorTable rows={PRICING_FACTORS} />
            </Reveal>
            <Reveal delay={100}>
              <p className="mt-8 max-w-measure t-body-lg text-slate-600">{PRICING_CLOSING}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 7 — What we need from you */}
      <section aria-labelledby="checklist-heading" className="section-y bg-paper">
        <div className="container-site">
          <SectionHeader
            headingId="checklist-heading"
            eyebrow="Before you enquire"
            heading="What we need from you."
            intro="Send these six things and the first reply can be a quote rather than a question."
            width="wide"
          />

          <CellGrid
            cells={ENQUIRY_CHECKLIST}
            columns={3}
            className="mt-14"
          />

          <Reveal delay={140} className="mt-12 block">
            <ButtonLink href="/quote" size="lg" withArrow>
              Request a quote
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      {/* 8 — Service FAQ */}
      {faqs.length > 0 ? (
        <section aria-labelledby="service-faq-heading" className="section-y bg-bone">
          <div className="container-site grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              {/* Link under the header rather than in the `cta` slot — see
                  the note on /services: a sibling CTA squeezes the heading. */}
              <SectionHeader
                headingId="service-faq-heading"
                eyebrow="Questions"
                heading="Asked most often."
                width="tight"
              >
                <TextLink href="/faq">See all questions</TextLink>
              </SectionHeader>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <Accordion items={faqs} defaultOpen={null} />
            </div>
          </div>
        </section>
      ) : null}

      {/* 9 — Sector band (dark) */}
      <section aria-labelledby="sectors-heading" className="grain section-y relative bg-ink-900">
        <div className="container-site relative z-10">
          <SectionHeader
            headingId="sectors-heading"
            eyebrow="Who we serve"
            heading="The sectors this work supports."
            onDark
          />

          <div className="mt-14 grid grid-cols-1 border-l border-t border-line-dark sm:grid-cols-2 lg:grid-cols-3">
            {SECTORS.map((sector, index) => {
              const Icon = sector.icon;
              return (
                <Reveal
                  key={sector.title}
                  delay={Math.min(index, 5) * 70}
                  className="border-b border-r border-line-dark"
                >
                  <div className="flex h-full items-start gap-4 p-7">
                    <Icon aria-hidden="true" strokeWidth={1.5} className="mt-1 h-6 w-6 shrink-0 text-gold" />
                    <div>
                      <h3 className="t-h4 font-semibold text-white">{sector.title}</h3>
                      <p className="mt-2 t-small text-slate-400">{sector.description}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10 — Related imagery */}
      <section aria-labelledby="service-gallery-heading" className="section-y bg-bone">
        <div className="container-site">
          {/* An eyebrow is not a heading. The section still needs an
              accessible name, so the h2 is sr-only and the eyebrow is the
              decorative label it always was. */}
          <h2 id="service-gallery-heading" className="sr-only">
            {service.name} in service
          </h2>
          <Eyebrow>On the ground</Eyebrow>
          <div className="mt-8">
            <ImageStrip images={service.gallery} />
          </div>
        </div>
      </section>

      {/* 11 — Cross-links */}
      <section aria-labelledby="siblings-heading" className="section-y bg-bone pt-0">
        <div className="container-site">
          <SectionHeader
            headingId="siblings-heading"
            eyebrow="Other services"
            heading="The rest of what we run."
          />

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {siblings.map((sibling, index) => {
              const Icon = sibling.icon;
              return (
                <Reveal key={sibling.slug} delay={index * 70}>
                  <Link
                    href={`/services/${sibling.slug}`}
                    className="group flex h-full flex-col gap-4 border border-line bg-paper p-7 transition-[border-color,box-shadow] duration-fast ease-out-expo hover:border-gold hover:shadow-elevate"
                  >
                    <Icon aria-hidden="true" strokeWidth={1.5} className="h-7 w-7 text-gold" />
                    <h3 className="t-h4 font-semibold text-ink-900">{sibling.name}</h3>
                    <p className="t-small text-slate-600">{sibling.short}</p>
                    <span className="mt-auto inline-flex items-center gap-[10px] pt-4 font-mono text-[12px] font-medium uppercase tracking-[0.1em] text-ink-900 transition-colors duration-fast group-hover:text-gold-ink">
                      Explore service
                      <ArrowRight
                        aria-hidden="true"
                        strokeWidth={1.5}
                        className="h-4 w-4 transition-transform duration-fast ease-out-expo group-hover:translate-x-1"
                      />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
