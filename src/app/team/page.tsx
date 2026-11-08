import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Reveal } from '@/components/motion/Reveal';
import { CellGrid } from '@/components/sections/ContentBlocks';
import { CTABand } from '@/components/sections/CTABand';
import { OrgDiagram } from '@/components/sections/OrgDiagram';
import { PageHero } from '@/components/sections/PageHero';
import { RelatedLinks } from '@/components/sections/RelatedLinks';
import { TeamGrid } from '@/components/sections/TeamGrid';
import { ButtonLink } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TeamPortrait } from '@/components/ui/TeamPortrait';
import { COMPANY, GOVERNANCE } from '@/data/company';
import {
  CAREERS_BLOCKS,
  CAREERS_COPY,
  DIVISIONS,
  GOVERNANCE_PRACTICE,
  ORG_INTRO,
} from '@/data/org';
import { CEO, MANAGERS, TEAM_PUBLISHED } from '@/data/team';
import { mailtoHref } from '@/lib/utils';
import { pageMetadata } from '@/lib/seo';

/*
 * /team is switched off until the client supplies the management team
 * (src/data/team.ts). While TEAM is empty the route returns a 404 and carries
 * noindex, and it is left out of the navigation, the footer and the sitemap.
 * Every section below also renders only when its own data exists, so the page
 * can be switched on with the team alone and the rest added later.
 */
export const metadata: Metadata = pageMetadata({
  title: 'Management team',
  description:
    'The management team at 4Jasmine Dr, the logistics and distribution business in the Free Zone Enclave, Tema: who runs each function and what they own.',
  path: '/team',
  noindex: !TEAM_PUBLISHED,
});

export default function TeamPage() {
  if (!TEAM_PUBLISHED) notFound();

  return (
    <>
      <PageHero
        heading="Management team"
        standfirst="The people accountable for your goods, from the port to the final delivery."
        image="/images/gallery/gallery-head-office.jpg"
        imageAlt="An office building"
        crumbs={[{ label: 'Team', href: '/team' }]}
      />

      {/* 1 — How governance works in practice. */}
      <section aria-labelledby="team-governance-heading" className="section-y bg-bone">
        <div className="container-site">
          <SectionHeader
            headingId="team-governance-heading"
            eyebrow="Governance"
            heading="How the business is run."
            intro={GOVERNANCE}
            width="wide"
          />

          {GOVERNANCE_PRACTICE.length > 0 ? (
            <CellGrid cells={GOVERNANCE_PRACTICE} columns={3} className="mt-14" />
          ) : null}
        </div>
      </section>

      {/* 2 — Chief executive feature */}
      {CEO ? (
        <section aria-labelledby="ceo-heading" className="section-y bg-bone pt-0">
          <div className="container-site grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <figure className="group border-l-2 border-gold pl-6">
                <TeamPortrait
                  src={CEO.photo}
                  alt={CEO.photoAlt}
                  initials={CEO.initials}
                  greyscale={false}
                  className="aspect-portrait w-full"
                  sizes="(min-width: 1024px) 500px, 100vw"
                />
                <figcaption className="u-mono mt-4 text-[11px] text-slate-600">{CEO.role}</figcaption>
              </figure>
            </Reveal>

            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal>
                <h2 id="ceo-heading" className="t-h2 text-ink-900">
                  {CEO.name}
                </h2>
                <p className="u-mono mt-3 text-[12px] text-gold-ink">{CEO.role}</p>
              </Reveal>

              <div className="mt-8 flex flex-col gap-6">
                {CEO.bio.map((paragraph, index) => (
                  <Reveal key={paragraph.slice(0, 24)} delay={70 + index * 70}>
                    <p className="max-w-measure t-body-lg text-slate-600">{paragraph}</p>
                  </Reveal>
                ))}
              </div>

              {CEO.credentials.length > 0 ? (
                <Reveal delay={210} className="mt-9">
                  <div className="border border-line bg-paper p-6">
                    <h3 className="u-eyebrow text-slate-600">Credentials</h3>
                    <p className="u-mono mt-3 text-[11px] normal-case tracking-[0.06em] text-ink-900">
                      {CEO.credentials.join(' · ')}
                    </p>
                  </div>
                </Reveal>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* 3 — Team grid */}
      {MANAGERS.length > 0 ? (
        <section aria-labelledby="managers-heading" className="section-y bg-bone pt-0">
          <div className="container-site">
            <SectionHeader
              headingId="managers-heading"
              eyebrow="Management"
              heading="The people running each function."
              intro="Select a card to read the full biography and credentials."
            />
            <TeamGrid members={MANAGERS} className="mt-14" />
          </div>
        </section>
      ) : null}

      {/* 4 — Departments and what they own */}
      {DIVISIONS.length > 0 ? (
        <section aria-labelledby="departments-heading" className="section-y bg-paper">
          <div className="container-site">
            <SectionHeader
              headingId="departments-heading"
              eyebrow="Departments"
              heading="What each function owns."
              intro={ORG_INTRO || undefined}
              width="wide"
            />

            <OrgDiagram className="mt-16" />
          </div>
        </section>
      ) : null}

      {/*
        5 — Careers. Renders only once the client supplies CAREERS_COPY.
        A full /careers page is built only when there are real vacancies —
        better than shipping a "Coming soon" route.
      */}
      {CAREERS_COPY ? (
        <section aria-labelledby="careers-heading" className="grain section-y relative bg-ink-900">
          <div className="container-site relative z-10">
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <SectionHeader
                  headingId="careers-heading"
                  eyebrow="Careers"
                  heading={`Working at ${COMPANY.name}.`}
                  onDark
                  width="default"
                />
              </div>

              <div className="lg:col-span-6 lg:col-start-7">
                <Reveal>
                  <p className="max-w-measure t-body-lg text-slate-400">{CAREERS_COPY}</p>
                </Reveal>
              </div>
            </div>

            {CAREERS_BLOCKS.length > 0 ? (
              <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {CAREERS_BLOCKS.map((block, index) => (
                  <Reveal key={block.title} delay={index * 70}>
                    <div className="flex h-full flex-col border border-line-dark p-8 lg:p-10">
                      <h3 className="u-eyebrow text-gold">{block.title}</h3>
                      <ul className="mt-6 border-t border-line-dark">
                        {block.points.map((point) => (
                          <li
                            key={point}
                            className="border-b border-line-dark py-4 t-small text-slate-400"
                          >
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : null}

            <Reveal delay={160} className="mt-12 block">
              <ButtonLink
                href={mailtoHref(COMPANY.email, 'Application — [role]')}
                external
                size="lg"
                withArrow
              >
                Send your CV
              </ButtonLink>
            </Reveal>
          </div>
        </section>
      ) : null}

      <section aria-label="Related pages" className="section-y-tight bg-bone">
        <div className="container-site">
          <RelatedLinks
            lead="What this team is accountable for is set out on"
            links={[
              { label: 'the about page', href: '/about' },
              { label: 'our fleet', href: '/fleet' },
              { label: 'safety and compliance', href: '/safety-compliance' },
            ]}
          />
        </div>
      </section>

      <CTABand />
    </>
  );
}
