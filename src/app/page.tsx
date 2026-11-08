import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { Reveal } from '@/components/motion/Reveal';
import { CargoTypes } from '@/components/sections/CargoTypes';
import { ClientsMarquee } from '@/components/sections/ClientsMarquee';
import { ContactBlock } from '@/components/sections/ContactBlock';
import { CorridorStrip } from '@/components/sections/CorridorStrip';
import { CSRStrip } from '@/components/sections/CSRStrip';
import { CTABand } from '@/components/sections/CTABand';
import { HeroSlider } from '@/components/sections/HeroSlider';
import { HowAJobRuns } from '@/components/sections/HowAJobRuns';
import { IndustryOutlook } from '@/components/sections/IndustryOutlook';
import { IntroSplit } from '@/components/sections/IntroSplit';
import { MapEmbed } from '@/components/sections/MapEmbed';
import { ServicesGrid } from '@/components/sections/ServicesGrid';
import { TeamGrid } from '@/components/sections/TeamGrid';
import { ValuesGrid } from '@/components/sections/ValuesGrid';
import { WhyUs } from '@/components/sections/WhyUs';

/*
 * Swiper is the single largest dependency on this page and the fleet rail is the
 * only thing below the fold that needs it. Splitting it keeps Swiper out of the
 * homepage's first load; the hero's instance is the one that has to be there.
 */
const FleetRail = dynamic(() =>
  import('@/components/sections/FleetRail').then((mod) => mod.FleetRail),
);
import { TextLink } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TEAM, TEAM_PUBLISHED } from '@/data/team';
import { HOME_DESCRIPTION, HOME_TITLE, SITE_NAME } from '@/lib/seo';
import { absoluteUrl } from '@/lib/utils';

export const metadata: Metadata = {
  // Home keeps the default title from the root layout rather than the template.
  alternates: { canonical: absoluteUrl('/') },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: absoluteUrl('/'),
    locale: 'en_GH',
    images: [{ url: '/brand/og-image.jpg', width: 1200, height: 630, alt: SITE_NAME }],
  },
};

export default function HomePage() {
  return (
    <>
      {/* 1 — Hero slider (dark) */}
      <HeroSlider />

      {/* 2 — Corridor strip (dark) */}
      <CorridorStrip />

      {/* 3 — Introduction split (light) */}
      <IntroSplit />

      {/* 4 — Services grid (light) */}
      <ServicesGrid />

      {/* 5 — Cargo we carry (paper) */}
      <CargoTypes />

      {/* 6 — Why 4Jasmine Dr (dark) */}
      <WhyUs />

      {/* 7 — How a job runs (dark) */}
      <HowAJobRuns />

      {/* 8 — Fleet rail (light) */}
      <FleetRail />

      {/* 9 — Clients marquee (light) */}
      <ClientsMarquee />

      {/* 10 — Core values (dark) */}
      <ValuesGrid />

      {/* 11 — Industry outlook (light) */}
      <IndustryOutlook />

      {/* 12 — Leadership preview (light). Omitted until the team is supplied. */}
      {TEAM_PUBLISHED ? (
        <section aria-labelledby="leadership-heading" className="section-y bg-bone">
          <div className="container-site">
            <SectionHeader
              headingId="leadership-heading"
              eyebrow="Management"
              heading="The people accountable for your goods."
              cta={<TextLink href="/team">Meet the team</TextLink>}
            />
            <TeamGrid members={TEAM} hideLastOnSmall className="mt-14 xl:grid-cols-5" />
          </div>
        </section>
      ) : null}

      {/* 13 — CSR strip (dark) */}
      <CSRStrip />

      {/* 14 — Contact / quote band (light) */}
      <section aria-labelledby="home-contact-heading" className="section-y bg-bone">
        <div className="container-site grid grid-cols-1 gap-x-6 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeader
              headingId="home-contact-heading"
              eyebrow="Get in touch"
              heading="Tell us what needs moving."
              intro="Send the load details and operations will come back with pricing and available dates."
            />
            <Reveal delay={140} className="mt-10">
              <EnquiryForm />
            </Reveal>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal>
              <ContactBlock showHours={false} />
            </Reveal>
            <Reveal delay={120} className="mt-8">
              <MapEmbed height={300} />
            </Reveal>
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
