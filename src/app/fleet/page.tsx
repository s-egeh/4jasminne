import type { Metadata } from 'next';
import {
  ClipboardCheck,
  GraduationCap,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { CellGrid } from '@/components/sections/ContentBlocks';
import { CTABand } from '@/components/sections/CTABand';
import { FleetFilterGrid } from '@/components/sections/FleetFilterGrid';
import { PageHero } from '@/components/sections/PageHero';
import { ButtonLink } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MAINTENANCE_PILLARS } from '@/data/fleet';
import { DRIVER_POINTS, DRIVERS_COPY, LOAD_SECURING, MAINTENANCE_BLOCKS } from '@/data/operations';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Our fleet',
  description:
    'Articulated and rigid trucks, light delivery vehicles, container trailers and warehouse handling equipment for freight and distribution from Tema.',
  path: '/fleet',
});

const ICONS: Record<string, LucideIcon> = {
  Wrench,
  ShieldCheck,
  ClipboardCheck,
  GraduationCap,
};

export default function FleetPage() {
  return (
    <>
      <PageHero
        heading="Our fleet"
        standfirst="Vehicles and handling equipment matched to the goods, maintained to schedule and checked before every departure."
        image="/images/fleet/fleet-articulated-truck.jpg"
        imageAlt="4Jasmine Dr trucks lined up in the Free Zone Enclave, Tema"
        crumbs={[{ label: 'Fleet', href: '/fleet' }]}
      />

      {/* 1 — Intro */}
      <section aria-labelledby="fleet-intro-heading" className="section-y bg-bone">
        <div className="container-site grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-12">
          {/* Five columns and a shorter heading; the full sentence now opens
              the right-hand column instead of breaking over three lines. */}
          <div className="lg:col-span-5">
            <SectionHeader
              headingId="fleet-intro-heading"
              eyebrow="The fleet"
              heading="Managed as one fleet."
              width="default"
            />
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="flex flex-col gap-6">
              <Reveal>
                <p className="max-w-measure t-body-lg font-medium text-ink-900">
                  A fleet, not a collection of vehicles.
                </p>
              </Reveal>
              <Reveal delay={40}>
                <p className="max-w-measure t-body-lg text-slate-600">
                  Vehicles and handling equipment are managed as one fleet. Maintenance schedules,
                  safety compliance and dispatch are planned together, so a breakdown is a
                  maintenance failure the business owns, not an excuse passed to the client.
                </p>
              </Reveal>
              <Reveal delay={70}>
                <p className="max-w-measure t-body-lg text-slate-600">
                  Each vehicle is matched to the job — a full load, a part load, a multi-drop
                  distribution run or a container from the port — rather than the job being bent to
                  fit whatever is free.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 2 — Equipment categories */}
      <section aria-labelledby="fleet-categories-heading" className="section-y bg-bone pt-0">
        <div className="container-site">
          <SectionHeader
            headingId="fleet-categories-heading"
            eyebrow="Equipment"
            heading="What the work calls for."
            intro="Select a category to filter. Each unit opens a set of photographs of that equipment in service."
          />
          <div className="mt-12">
            <FleetFilterGrid />
          </div>
        </div>
      </section>

      {/* 3 — Maintenance and safety (dark) */}
      <section aria-labelledby="maintenance-heading" className="grain section-y relative bg-ink-900">
        <div className="container-site relative z-10">
          <SectionHeader
            headingId="maintenance-heading"
            eyebrow="Maintenance &amp; safety"
            heading="A vehicle that turns up is the deliverable."
            onDark
          />

          <div className="mt-14 grid grid-cols-1 border-l border-t border-line-dark sm:grid-cols-2 lg:grid-cols-4">
            {MAINTENANCE_PILLARS.map((pillar, index) => {
              const Icon = ICONS[pillar.icon];
              return (
                <Reveal
                  key={pillar.title}
                  delay={index * 70}
                  className="border-b border-r border-line-dark"
                >
                  <div className="flex h-full flex-col gap-4 p-7">
                    <Icon aria-hidden="true" strokeWidth={1.5} className="h-7 w-7 text-gold" />
                    <h3 className="t-h4 font-semibold text-white">{pillar.title}</h3>
                    {pillar.lines.map((line) => (
                      <p key={line.slice(0, 20)} className="t-small text-slate-400">
                        {line}
                      </p>
                    ))}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4 — Inside the maintenance programme (dark) */}
      <section
        aria-labelledby="maintenance-programme-heading"
        className="grain section-y relative bg-ink-900 pt-0"
      >
        <div className="container-site relative z-10">
          <SectionHeader
            headingId="maintenance-programme-heading"
            eyebrow="Maintenance"
            heading="What the programme actually involves."
            intro="Four routines, run on every vehicle. None of them is remarkable on its own — the point is that they happen whether or not anything has gone wrong."
            onDark
            width="wide"
          />

          <CellGrid
            cells={MAINTENANCE_BLOCKS}
            columns={4}
            onDark
            className="mt-14"
          />
        </div>
      </section>

      {/* 5 — Our drivers */}
      <section aria-labelledby="drivers-heading" className="section-y bg-paper">
        <div className="container-site">
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeader
                headingId="drivers-heading"
                eyebrow="People"
                heading="The fleet is only as good as its drivers."
                width="default"
              />
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal>
                <p className="max-w-measure t-body-lg text-slate-600">{DRIVERS_COPY}</p>
              </Reveal>
            </div>
          </div>

          <CellGrid cells={DRIVER_POINTS} columns={4} className="mt-14" />
        </div>
      </section>

      {/* 6 — Load securing and handling */}
      <section aria-labelledby="securing-heading" className="section-y bg-bone">
        <div className="container-site">
          <SectionHeader
            headingId="securing-heading"
            eyebrow="Handling"
            heading="How a load is secured."
            intro="Securing is matched to the goods on board, and it is checked before departure rather than assumed."
            width="wide"
          />

          <CellGrid cells={LOAD_SECURING} columns={3} className="mt-14" />
        </div>
      </section>

      {/* 7 — Quote CTA */}
      <section aria-labelledby="fleet-cta-heading" className="section-y bg-bone">
        <div className="container-site flex flex-col items-start gap-8 border border-line bg-paper p-9 md:flex-row md:items-center md:justify-between md:p-14">
          <div>
            {/* Section-level heading, so it takes the section heading size. */}
            <h2 id="fleet-cta-heading" className="max-w-head t-h2 text-ink-900">
              Something to move?
            </h2>
            <p className="mt-3 max-w-measure text-slate-600">
              Tell us the goods and the route, and operations will match the vehicle to the job.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/quote" size="lg" withArrow>
              Request a quote
            </ButtonLink>
            <ButtonLink href="/services/freight-haulage" size="lg" variant="secondary-light">
              Freight and haulage
            </ButtonLink>
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
