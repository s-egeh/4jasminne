import { Check } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { SwooshRule } from '@/components/motion/SwooshRule';
import { TextMask } from '@/components/motion/TextMask';
import { TextLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/SectionHeader';
import { MARKET_DRIVERS } from '@/data/company';

export function IndustryOutlook() {
  // Renders only once the client supplies its own market drivers.
  if (MARKET_DRIVERS.length === 0) return null;

  return (
    <section aria-labelledby="outlook-heading" className="section-y bg-bone">
      <div className="container-site grid grid-cols-1 gap-x-6 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow>Market outlook</Eyebrow>
          </Reveal>

          <SwooshRule className="mt-5" />

          <TextMask
            as="h2"
            id="outlook-heading"
            text="Where the demand is going."
            delay={90}
            className="mt-5 max-w-[16ch] t-h2 text-ink-900"
          />

          <Reveal delay={140}>
            <p className="mt-7 max-w-measure t-body-lg text-slate-600">
              The forces shaping demand for logistics and distribution in Ghana, and what they mean
              for the businesses that move goods through Tema.
            </p>
          </Reveal>

          {/* Support block — the CTA and the one fact that makes the
              paragraph above matter to a reader choosing a haulier. */}
          <Reveal delay={190} className="mt-9 block">
            <TextLink href="/contact">Talk to us about capacity</TextLink>
          </Reveal>

        </div>

        <div className="lg:col-span-5">
          <ul className="border-t border-line">
            {MARKET_DRIVERS.map((driver, index) => (
              <Reveal key={driver.title} delay={index * 70} as="li" className="block">
                <div className="flex gap-4 border-b border-line py-6">
                  <Check aria-hidden="true" strokeWidth={1.5} className="mt-1 h-4 w-4 shrink-0 text-gold-ink" />
                  <div>
                    <h3 className="u-mono text-[11px] text-ink-900">{driver.title}</h3>
                    <p className="mt-2 t-small text-slate-600">{driver.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
