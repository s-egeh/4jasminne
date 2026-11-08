import { Reveal } from '@/components/motion/Reveal';
import { SwooshRule } from '@/components/motion/SwooshRule';
import { TextMask } from '@/components/motion/TextMask';
import { TextLink } from '@/components/ui/Button';
import { GhanaOutline } from '@/components/ui/GhanaOutline';
import { Eyebrow } from '@/components/ui/SectionHeader';

/* [TODO-CLIENT: review wording] — positioning, not claims of record. */
const ADVANTAGES = [
  {
    index: '01',
    title: 'One team, port to delivery',
    body: 'Freight, storage, distribution and forwarding are run by one team, so goods do not change hands between companies on their way from the port to your customer.',
  },
  {
    index: '02',
    title: 'Close to the port',
    body: 'Based in the Free Zone Enclave in Tema, within reach of Tema Port and of the roads that run north, west and into Accra.',
  },
  {
    index: '03',
    title: 'Planned before it is promised',
    body: 'Dates are committed against the vehicles, storage space and people actually available, and the price is agreed before anything moves.',
  },
];

export function WhyUs() {
  return (
    <section aria-labelledby="why-heading" className="grain section-y relative overflow-hidden bg-ink-900">
      <GhanaOutline
        className="pointer-events-none absolute -right-12 top-1/2 h-[520px] w-auto -translate-y-1/2 text-white opacity-[0.06] lg:right-16"
      />

      <div className="container-site relative z-10 grid grid-cols-1 gap-x-6 gap-y-12 lg:grid-cols-12">
        {/* Five columns, not four, so the heading gets a 22ch measure and
            holds to two lines at 1280 and above. */}
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow onDark>Competitive advantage</Eyebrow>
          </Reveal>

          <SwooshRule className="mt-5" />

          <TextMask
            as="h2"
            id="why-heading"
            text="One team. Fewer handoffs."
            delay={90}
            className="mt-5 max-w-head t-h2 text-white"
          />

          {/*
            A pull quote attributed to the previous company's profile sat here.
            It returns only with a quote 4Jasmine Dr has approved and can
            attribute; until then the column closes on a route into the detail.
          */}
          <Reveal delay={160} className="mt-10 block">
            <TextLink href="/services" className="text-white hover:text-gold">
              See how the services fit together
            </TextLink>
          </Reveal>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div className="border-t border-line-dark">
            {ADVANTAGES.map((item, index) => (
              <Reveal key={item.index} delay={index * 70}>
                <div className="flex flex-col gap-4 border-b border-line-dark py-9 sm:flex-row sm:gap-10">
                  <span className="u-mono shrink-0 text-[12px] text-gold">{item.index}</span>
                  <div>
                    <h3 className="t-h4 font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 max-w-measure text-slate-400">{item.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
