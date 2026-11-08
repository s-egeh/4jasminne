import { KeyFacts } from '@/components/sections/ContentBlocks';
import { Reveal } from '@/components/motion/Reveal';
import { SwooshRule } from '@/components/motion/SwooshRule';
import { TextMask } from '@/components/motion/TextMask';
import { TextLink } from '@/components/ui/Button';
import { Figure } from '@/components/ui/Media';
import { Eyebrow } from '@/components/ui/SectionHeader';
import { COMPANY_OVERVIEW_PARAGRAPHS } from '@/data/company';

/** Section 3 — 5/7 split. Asymmetric by design; 6/6 reads as a template. */
export function IntroSplit() {
  return (
    <section aria-labelledby="intro-heading" className="section-y bg-bone">
      <div className="container-site grid grid-cols-1 gap-x-6 gap-y-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow>Who we are</Eyebrow>
          </Reveal>

          <SwooshRule className="mt-5" />

          {/* Shortened per C12 — the full sentence now opens the right column,
              which is where a sentence that long belongs. */}
          <TextMask
            as="h2"
            id="intro-heading"
            text="Port to shelf, one team."
            delay={90}
            className="mt-5 max-w-head-tight t-h2 text-ink-900"
          />

          <Reveal delay={150} className="mt-8">
            <TextLink href="/about">Read our full profile</TextLink>
          </Reveal>

          {/* Key facts — fills the dead lower-left this split used to leave
              empty with something a reader is actually looking for. */}
          <Reveal delay={200} className="mt-10 block">
            <KeyFacts
              rows={[
                { label: 'Head office', value: 'FREE ZONE ENCLAVE, TEMA' },
                { label: 'Port', value: 'TEMA' },
                { label: 'Coverage', value: 'NATIONWIDE, PLUS WEST AFRICAN SUB-REGION' },
                { label: 'Engagement', value: 'PER CONSIGNMENT OR ONGOING' },
              ]}
            />
          </Reveal>

          {/* Stacked pair: 4:5 portrait overlapping a 16:10 by 40px. */}
          <Reveal delay={200} className="relative mt-14 hidden max-w-[420px] lg:block">
            <Figure
              src="/images/gallery/gallery-morning-dispatch.jpg"
              alt="Trucks lined up before dispatch"
              className="aspect-card w-full"
              imageClassName="h-full w-full"
              sizes="420px"
            />
            <Figure
              src="/images/gallery/gallery-load-check.jpg"
              alt="A driver checking how a load is secured before departure"
              className="absolute -bottom-10 right-0 aspect-portrait w-[45%] border-[6px] border-bone"
              imageClassName="h-full w-full"
              sizes="200px"
            />
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal>
            <p className="max-w-measure t-body-lg font-medium text-ink-900">
              Freight, storage, distribution and forwarding, run by one team.
            </p>
          </Reveal>

          <div className="mt-6 flex flex-col gap-6">
            {COMPANY_OVERVIEW_PARAGRAPHS.map((paragraph, index) => (
              <Reveal key={paragraph.slice(0, 24)} delay={index * 70}>
                <p className="max-w-measure t-body-lg text-slate-600">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          {/*
            No figures. The stat row that sat here carried the previous
            company's numbers; no truck count, client count, tonnage or years in
            business has been supplied for 4Jasmine Dr, and none is invented.
            The Stat component is still in the codebase for when one is.
          */}
        </div>
      </div>
    </section>
  );
}
