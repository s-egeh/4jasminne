import type { Metadata } from 'next';
import { Reveal } from '@/components/motion/Reveal';
import { ScrollDrawLine } from '@/components/motion/ScrollDrawLine';
import { SwooshRule } from '@/components/motion/SwooshRule';
import { TextMask } from '@/components/motion/TextMask';
import { CellGrid, PullQuote } from '@/components/sections/ContentBlocks';
import { CTABand } from '@/components/sections/CTABand';
import { OrgDiagram } from '@/components/sections/OrgDiagram';
import { PageHero } from '@/components/sections/PageHero';
import { Timeline } from '@/components/sections/Timeline';
import { ValuesGrid } from '@/components/sections/ValuesGrid';
import { TextLink } from '@/components/ui/Button';
import { Figure } from '@/components/ui/Media';
import { Eyebrow, SectionHeader } from '@/components/ui/SectionHeader';
import { TeamPortrait } from '@/components/ui/TeamPortrait';
import { Tabs } from '@/components/ui/Tabs';
import { MILESTONES } from '@/data/milestones';
import { OPERATING_STANDARDS } from '@/data/operations';
import { DIVISIONS, ORG_INTRO } from '@/data/org';
import { CEO, CEO_STATEMENT, TEAM_PUBLISHED } from '@/data/team';
import {
  BUSINESS_MODEL_PARAGRAPH,
  COMPANY_OVERVIEW_PARAGRAPHS,
  FUTURE_PLANS,
  GOVERNANCE,
  MISSION,
  STRATEGIC_PILLARS,
  VISION,
} from '@/data/company';
import { DIVISION_CLOSING, SERVICES } from '@/data/services';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'About us',
  description:
    '4Jasmine Dr is a logistics and distribution business in the Free Zone Enclave, Tema, offering road freight, warehousing, distribution and forwarding.',
  path: '/about',
});

/* [TODO-CLIENT: review wording] */
const BUSINESS_MODEL = [
  {
    title: 'What clients pay for',
    body: 'Moving, storing and delivering goods, priced on the service, the distance, the volume and the handling. Some clients book consignment by consignment; others agree ongoing volume at a set rate.',
  },
  {
    title: 'What it takes',
    body: 'Vehicles, storage space, and people who handle goods carefully and plan honestly. Delays and damage are what cost a client most, so those are what the operation is built to avoid.',
  },
  {
    title: 'What clients get',
    body: 'Goods that arrive when agreed and in the condition they left in, and one point of contact from collection to delivery.',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        heading="About 4Jasmine Dr"
        standfirst="Logistics and distribution from the Free Zone Enclave in Tema, for the companies that import, manufacture and trade in Ghana."
        image="/images/hero/hero-highway-truck.jpg"
        imageAlt="A tanker truck on a mountain highway"
        crumbs={[{ label: 'About', href: '/about' }]}
      />

      {/* 1 — Company overview */}
      <section aria-labelledby="overview-heading" className="section-y bg-bone">
        <div className="container-site grid grid-cols-1 gap-x-6 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow>Company overview</Eyebrow>
            </Reveal>
            <SwooshRule className="mt-5" />
            {/* Kept short: a longer sentence broke over four lines here. */}
            <TextMask
              as="h2"
              id="overview-heading"
              text="From the port to the shelf."
              delay={90}
              className="mt-5 max-w-head t-h2 text-ink-900"
            />
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="flex flex-col gap-6">
              {[...COMPANY_OVERVIEW_PARAGRAPHS, BUSINESS_MODEL_PARAGRAPH].map((paragraph, index) => (
                <Reveal key={paragraph.slice(0, 24)} delay={index * 70}>
                  <p className="max-w-measure t-body-lg text-slate-600">{paragraph}</p>
                </Reveal>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 2 — How the business works (dark) */}
      <section aria-labelledby="model-heading" className="grain section-y relative bg-ink-900">
        <div className="container-site relative z-10">
          <SectionHeader
            headingId="model-heading"
            eyebrow="How it works"
            heading="What the client buys, and what it costs us to deliver."
            onDark
          />

          <div className="mt-14 grid grid-cols-1 border-l border-t border-line-dark md:grid-cols-3">
            {BUSINESS_MODEL.map((item, index) => (
              <Reveal key={item.title} delay={index * 70} className="border-b border-r border-line-dark">
                <div className="flex h-full flex-col gap-4 p-8 sm:p-10">
                  <h3 className="u-eyebrow text-gold">{item.title}</h3>
                  <p className="text-slate-400">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/*
        3 — Vision and mission. Placed between the two dark bands so the
        page keeps alternating light and dark while the sections that
        depend on client data (structure, pillars) are switched off.
      */}
      <section aria-labelledby="vision-heading" className="section-y bg-bone">
        <div className="container-site">
          <h2 id="vision-heading" className="sr-only">
            Vision and mission
          </h2>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {[
              { label: 'Vision', body: VISION },
              { label: 'Mission', body: MISSION },
            ].map((panel, index) => (
              <Reveal key={panel.label} delay={index * 70}>
                <div className="flex h-full flex-col gap-6 border border-line bg-paper p-9 sm:p-12">
                  <h3 className="u-eyebrow text-gold-ink">{panel.label}</h3>
                  <SwooshRule />
                  <p className="max-w-measure t-h3 font-semibold leading-snug text-ink-900">
                    {panel.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — How the business is organised. Omitted until the structure is supplied. */}
      {DIVISIONS.length > 0 ? (
        <section aria-labelledby="structure-heading" className="section-y bg-paper">
          <div className="container-site">
            <SectionHeader
              headingId="structure-heading"
              eyebrow="Structure"
              heading="How the business is organised."
              intro={ORG_INTRO || undefined}
              width="wide"
            />

            <OrgDiagram className="mt-16" />
          </div>
        </section>
      ) : null}

      {/* 5 — Operating standards (dark) */}
      <section aria-labelledby="standards-heading" className="grain section-y relative bg-ink-900">
        <div className="container-site relative z-10">
          <SectionHeader
            headingId="standards-heading"
            eyebrow="How we work"
            heading="The standards we hold ourselves to."
            onDark
            width="wide"
          />

          <CellGrid cells={OPERATING_STANDARDS} columns={4} onDark className="mt-14" />
        </div>
      </section>

      {/*
        6 — A statement from the chief executive.

        Renders only when the client has supplied both a featured team member
        and an approved statement in their own words (CEO_STATEMENT in
        src/data/team.ts). A ghost-written or unattributed leadership quote is
        worse than none, so nothing stands in for it.
      */}
      {CEO && CEO_STATEMENT ? (
        <section aria-labelledby="ceo-statement-heading" className="section-y bg-bone">
          <div className="container-site grid grid-cols-1 gap-x-6 gap-y-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Reveal>
                <TeamPortrait
                  src={CEO.photo}
                  alt={CEO.photoAlt}
                  initials={CEO.initials}
                  className="aspect-portrait w-full max-w-[380px]"
                  sizes="(min-width: 1024px) 380px, 90vw"
                />
              </Reveal>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <Reveal>
                <Eyebrow>From the Chief Executive</Eyebrow>
              </Reveal>
              <SwooshRule className="mt-2" />

              <h2 id="ceo-statement-heading" className="sr-only">
                A statement from the Chief Executive
              </h2>

              <Reveal delay={120} className="mt-8 block">
                <PullQuote size="lg" attribution={`${CEO.name} — ${CEO.role}`}>
                  {CEO_STATEMENT}
                </PullQuote>
              </Reveal>
            </div>
          </div>
        </section>
      ) : null}

      {/*
        7 — Milestones. Renders nothing while MILESTONES is empty, and it is
        empty because no dates have been supplied. See src/data/milestones.ts.
      */}
      {MILESTONES.length > 0 ? (
        <section aria-labelledby="milestones-heading" className="section-y bg-paper">
          <div className="container-site">
            <SectionHeader
              headingId="milestones-heading"
              eyebrow="Milestones"
              heading="How the business got here."
            />
            <Timeline milestones={MILESTONES} className="mt-12" />
          </div>
        </section>
      ) : null}


      {/* 8 — Core values */}
      <ValuesGrid onDark={false} full />

      {/* 9 — Strategic focus (dark). Omitted until the client supplies its own pillars. */}
      {STRATEGIC_PILLARS.length > 0 ? (
        <section aria-labelledby="pillars-heading" className="grain section-y relative bg-ink-900">
          <div className="container-site relative z-10">
            <SectionHeader
              headingId="pillars-heading"
              eyebrow="Strategic focus"
              heading="What the plan is built on."
              onDark
            />

            <ol className="relative mt-14 max-w-3xl">
              {/* Lead animation for this section: the connecting line draws itself
                  against scroll progress. Nothing else here moves. */}
              <ScrollDrawLine className="absolute bottom-12 left-[23px] top-12" />

              {STRATEGIC_PILLARS.map((pillar, index) => (
                <Reveal key={pillar.index} delay={Math.min(index, 5) * 70} as="li" className="block">
                  <div className="relative flex gap-6 pb-12">
                    <span className="relative z-10 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold bg-ink-900 font-mono text-[12px] font-medium tracking-[0.1em] text-gold">
                      {pillar.index}
                    </span>
                    <div className="pt-2.5">
                      <h3 className="t-h4 font-semibold text-white">{pillar.title}</h3>
                      <p className="mt-3 max-w-measure text-slate-400">{pillar.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {/* 10 — What we do (tabs) */}
      <section aria-labelledby="nature-heading" className="section-y bg-paper">
        <div className="container-site">
          <SectionHeader
            headingId="nature-heading"
            eyebrow="What we do"
            heading="Four services, in detail."
          />

          <Reveal delay={140} className="mt-12">
            <Tabs
              items={SERVICES.map((service) => ({
                id: service.slug,
                label: service.name,
                panel: (
                  <div className="grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                      <Figure
                        src={service.image}
                        alt={service.imageAlt}
                        className="aspect-card w-full border-b border-gold"
                        imageClassName="h-full w-full"
                        sizes="(min-width: 1024px) 520px, 100vw"
                      />
                    </div>

                    <div className="lg:col-span-6 lg:col-start-7">
                      <h3 className="t-h3 font-bold text-ink-900">{service.division}</h3>
                      <ul className="mt-6 border-t border-line">
                        {service.bullets.map((bullet) => (
                          <li key={bullet} className="border-b border-line py-4 text-slate-600">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-6 max-w-measure t-small text-slate-600">
                        {DIVISION_CLOSING[service.slug]}
                      </p>

                      <div className="mt-8">
                        <TextLink href={`/services/${service.slug}`}>Explore service</TextLink>
                      </div>
                    </div>
                  </div>
                ),
              }))}
            />
          </Reveal>
        </div>
      </section>

      {/* 11 — Governance (dark) */}
      <section aria-labelledby="governance-heading" className="grain section-y relative bg-ink-900">
        <div className="container-site relative z-10">
          <SectionHeader
            headingId="governance-heading"
            eyebrow="Governance"
            heading="Accountability, stated plainly."
            onDark
          />
          <Reveal delay={140} className="mt-10 max-w-legal">
            <p className="t-body-lg text-slate-400">{GOVERNANCE}</p>
          </Reveal>
          {TEAM_PUBLISHED ? (
            <Reveal delay={200} className="mt-8">
              <TextLink href="/team" className="text-white hover:text-gold">
                Meet the management team
              </TextLink>
            </Reveal>
          ) : null}
        </div>
      </section>

      {/* 12 — Future outlook. Omitted until the client supplies its own plans. */}
      {FUTURE_PLANS.length > 0 ? (
        <section aria-labelledby="future-heading" className="section-y bg-bone">
          <div className="container-site">
            <SectionHeader
              headingId="future-heading"
              eyebrow="Future outlook"
              heading="Where the business goes next."
            />

            <ol className="mt-14 grid grid-cols-1 border-l border-t border-line md:grid-cols-3 lg:grid-cols-5">
              {FUTURE_PLANS.map((plan, index) => (
                <Reveal
                  key={plan.index}
                  delay={Math.min(index, 5) * 70}
                  as="li"
                  className="block border-b border-r border-line"
                >
                  <div className="flex h-full flex-col gap-4 p-7">
                    <span className="u-mono text-[11px] text-gold-ink">{plan.index}</span>
                    <h3 className="t-h4 font-semibold text-ink-900">{plan.title}</h3>
                    <p className="t-small text-slate-600">{plan.description}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      <CTABand />
    </>
  );
}
