import { Reveal } from '@/components/motion/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { cn } from '@/lib/utils';
import {
  CROSS_DOCKING_COPY,
  DISTRIBUTION_COPY,
  DISTRIBUTION_MODES,
  FORWARDING_COMPLIANCE_COPY,
  FORWARDING_SIDES,
  HAULAGE_COMPARISON,
  HAULAGE_PLANNING_COPY,
  STORAGE_COMPARISON,
  type ComparisonOption,
  type ServiceSlug,
} from '@/data/services';

/**
 * The sections that only make sense on one service page.
 *
 * Everything common to all four (scope, pricing, enquiry checklist, FAQ) lives
 * on the detail page itself. This component holds only what is genuinely
 * specific, keyed by slug — which is why it is a switch rather than a config
 * object. The four cases share a small set of section patterns, defined below.
 */
export function ServiceExtras({ slug }: { slug: ServiceSlug }) {
  if (slug === 'freight-haulage') {
    return (
      <>
        <Comparison
          id="haulage-comparison-heading"
          eyebrow="Two ways to send"
          heading="Full load or part load."
          intro="Neither is better. They suit different volumes and are priced differently, so it is worth knowing which one you are asking for."
          options={HAULAGE_COMPARISON}
        />
        <DarkCopy
          id="haulage-planning-heading"
          eyebrow="Planning"
          heading="The goods decide the vehicle."
          copy={HAULAGE_PLANNING_COPY}
        />
      </>
    );
  }

  if (slug === 'warehousing-storage') {
    return (
      <>
        <Comparison
          id="storage-comparison-heading"
          eyebrow="Storage terms"
          heading="Short term or long term."
          intro="What changes between them is how long the goods stay, and how the space is priced."
          options={STORAGE_COMPARISON}
        />
        <DarkCopy
          id="cross-docking-heading"
          eyebrow="Cross-docking"
          heading="No time on the shelf."
          copy={CROSS_DOCKING_COPY}
        />
      </>
    );
  }

  if (slug === 'distribution') {
    return (
      <>
        <Sides
          id="distribution-modes-heading"
          eyebrow="Two ways to distribute"
          heading="Scheduled runs or last-mile delivery."
          sides={DISTRIBUTION_MODES}
        />
        <DarkCopy
          id="distribution-handover-heading"
          eyebrow="At the delivery point"
          heading="A delivery ends at the signature."
          copy={DISTRIBUTION_COPY}
        />
      </>
    );
  }

  // freight-forwarding
  return (
    <>
      <section aria-labelledby="forwarding-compliance-heading" className="section-y bg-paper">
        <div className="container-site grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeader
              headingId="forwarding-compliance-heading"
              eyebrow="Documentation"
              heading="Paperwork before cargo."
              width="tight"
            />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <p className="max-w-measure t-body-lg text-slate-600">{FORWARDING_COMPLIANCE_COPY}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <Sides
        id="forwarding-sides-heading"
        eyebrow="Working with us"
        heading="What we do, and what we need."
        sides={FORWARDING_SIDES}
        tone="bone"
      />
    </>
  );
}

/* ------------------------------------------------------------------ *
 * Section patterns.
 * ------------------------------------------------------------------ */

/** Two options side by side, each with suits / priced / you get rows. */
function Comparison({
  id,
  eyebrow,
  heading,
  intro,
  options,
}: {
  id: string;
  eyebrow: string;
  heading: string;
  intro: string;
  options: ComparisonOption[];
}) {
  return (
    <section aria-labelledby={id} className="section-y bg-paper">
      <div className="container-site">
        <SectionHeader headingId={id} eyebrow={eyebrow} heading={heading} intro={intro} width="wide" />

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {options.map((option, index) => (
            <Reveal key={option.title} delay={index * 70}>
              <div className="flex h-full flex-col border border-line bg-bone p-8 lg:p-10">
                <h3 className="t-h3 font-bold text-ink-900">{option.title}</h3>

                <dl className="mt-8 border-t border-line">
                  {[
                    { label: 'Suits', value: option.suits },
                    { label: 'Priced', value: option.priced },
                    { label: 'You get', value: option.gets },
                  ].map((row) => (
                    <div key={row.label} className="border-b border-line py-4">
                      <dt className="u-mono text-[10px] text-gold-ink">{row.label}</dt>
                      <dd className="mt-2 t-small text-slate-600">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Dark band: a short heading on the left, one paragraph on the right. */
function DarkCopy({
  id,
  eyebrow,
  heading,
  copy,
}: {
  id: string;
  eyebrow: string;
  heading: string;
  copy: string;
}) {
  return (
    <section aria-labelledby={id} className="grain section-y relative bg-ink-900">
      <div className="container-site relative z-10 grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeader headingId={id} eyebrow={eyebrow} heading={heading} onDark width="tight" />
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal>
            <p className="max-w-measure t-body-lg text-slate-400">{copy}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/**
 * Two titled lists side by side. `bone` follows a paper section directly, so it
 * drops its top padding and its cards flip to paper — the same alternation the
 * comparison cards use.
 */
function Sides({
  id,
  eyebrow,
  heading,
  sides,
  tone = 'paper',
}: {
  id: string;
  eyebrow: string;
  heading: string;
  sides: { title: string; points: string[] }[];
  tone?: 'paper' | 'bone';
}) {
  return (
    <section
      aria-labelledby={id}
      className={cn('section-y', tone === 'bone' ? 'bg-bone pt-0' : 'bg-paper')}
    >
      <div className="container-site">
        <SectionHeader headingId={id} eyebrow={eyebrow} heading={heading} width="wide" />

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {sides.map((side, index) => (
            <Reveal key={side.title} delay={index * 70}>
              <div
                className={cn(
                  'flex h-full flex-col border border-line p-8 lg:p-10',
                  tone === 'bone' ? 'bg-paper' : 'bg-bone',
                )}
              >
                <h3 className="t-h3 font-bold text-ink-900">{side.title}</h3>
                <ul className="mt-8 border-t border-line">
                  {side.points.map((point) => (
                    <li key={point} className="border-b border-line py-4 t-small text-slate-600">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
