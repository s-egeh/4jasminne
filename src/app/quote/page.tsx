import type { Metadata } from 'next';
import { MessageCircle, Phone } from 'lucide-react';
import { QuoteForm } from '@/components/forms/QuoteForm';
import { Reveal } from '@/components/motion/Reveal';
import { PageHero } from '@/components/sections/PageHero';
import { RelatedLinks } from '@/components/sections/RelatedLinks';
import { ButtonLink } from '@/components/ui/Button';
import { PRIMARY_PHONE } from '@/data/company';
import { PRICING_FACTORS } from '@/data/operations';
import { pageMetadata } from '@/lib/seo';
import { whatsappHref } from '@/lib/utils';

export const metadata: Metadata = pageMetadata({
  title: 'Request a quote',
  description:
    'Send 4Jasmine Dr the goods, the collection and delivery points and the dates, and operations will return written pricing for freight, storage or delivery.',
  path: '/quote',
});

const NEXT_STEPS = [
  { index: '01', text: 'We review the details of the goods.' },
  { index: '02', text: 'Operations confirms availability and pricing.' },
  { index: '03', text: 'You receive a written quote.' },
];

export default function QuotePage() {
  return (
    <>
      <PageHero
        heading="Request a quote"
        standfirst="Give us the details of the goods and we will come back with pricing and available dates."
        image="/images/hero/hero-01.jpg"
        imageAlt="A loaded 4Jasmine Dr truck on a Ghanaian highway"
        crumbs={[{ label: 'Request a quote', href: '/quote' }]}
        height="shortest"
      />

      <section aria-labelledby="quote-heading" className="section-y bg-bone">
        <div className="container-site grid grid-cols-1 gap-x-6 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 id="quote-heading" className="sr-only">
              Quote request form
            </h2>
            <QuoteForm />
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal>
              <div className="border border-line bg-paper p-8 lg:sticky lg:top-[120px]">
                <h3 className="u-eyebrow text-gold-ink">What happens next</h3>

                <ol className="mt-6 border-t border-line">
                  {NEXT_STEPS.map((step) => (
                    <li key={step.index} className="flex gap-4 border-b border-line py-4">
                      <span className="u-mono shrink-0 text-[11px] text-gold-ink">{step.index}</span>
                      <span className="t-small text-slate-600">{step.text}</span>
                    </li>
                  ))}
                </ol>

                {/* What the price is built from — the same five factors the
                    service pages publish, condensed to fit the panel. */}
                <h3 className="mt-10 u-eyebrow text-gold-ink">What sets the price</h3>

                <dl className="mt-6 border-t border-line">
                  {PRICING_FACTORS.map((factor) => (
                    <div key={factor.label} className="border-b border-line py-3.5">
                      <dt className="u-mono text-[10px] text-slate-600">{factor.label}</dt>
                      <dd className="mt-1.5 t-small text-ink-900">{factor.value}</dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-8 font-display text-[17px] font-semibold text-ink-900">
                  Prefer to talk it through?
                </p>

                <div className="mt-5 flex flex-col gap-3">
                  <ButtonLink href={`tel:${PRIMARY_PHONE.tel}`} variant="secondary-light" size="md">
                    <Phone aria-hidden="true" strokeWidth={1.5} className="h-4 w-4" />
                    {PRIMARY_PHONE.display}
                  </ButtonLink>

                  <ButtonLink href={whatsappHref()} external variant="secondary-light" size="md">
                    <MessageCircle aria-hidden="true" strokeWidth={1.5} className="h-4 w-4" />
                    Chat on WhatsApp
                  </ButtonLink>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-12">
            <RelatedLinks
              lead="Not sure what to ask for? The detail is on"
              links={[
                { label: 'our services', href: '/services' },
                { label: 'coverage and corridors', href: '/coverage' },
                { label: 'the questions we are asked most', href: '/faq' },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
