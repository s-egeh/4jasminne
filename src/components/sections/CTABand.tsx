import { Phone } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { TextMask } from '@/components/motion/TextMask';
import { Figure } from '@/components/ui/Media';
import { PRIMARY_PHONE } from '@/data/company';

/**
 * Pre-footer CTA band. Sits above the footer on every page except Contact,
 * where asking twice would be pushy.
 */
export function CTABand() {
  return (
    <section aria-labelledby="cta-band-heading" className="grain relative overflow-hidden bg-ink-800">
      {/* Faint truck silhouette behind the band. Renders nothing until the
          client supplies the file — never an "image pending" tile. */}
      <Figure
        src="/images/textures/truck-silhouette.png"
        alt=""
        decorative
        fallback="none"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]"
        imageClassName="h-full w-full object-cover"
        sizes="100vw"
      />

      {/*
        A 12-column grid rather than a flex row. As a flex row the heading cell
        was shrinking under the button pair and breaking over four lines
        rather than holding to two. Seven columns and
        a 20ch measure hold it to two lines at every desktop width.
      */}
      <div className="container-site relative z-10 grid grid-cols-1 items-center gap-x-6 gap-y-10 py-16 md:py-20 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <TextMask
            as="h2"
            id="cta-band-heading"
            text="A logistics partner you can plan around."
            className="max-w-[20ch] t-h2 text-white"
          />
          <Reveal delay={120}>
            <p className="mt-5 max-w-intro t-body-lg text-slate-400">
              Send the goods and the dates, and operations will come back with pricing and availability.
            </p>
          </Reveal>
        </div>

        {/* Both buttons share a min-width at desktop so the pair reads as a
            pair — the phone number used to make the second one much wider. */}
        <Reveal
          delay={180}
          className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end"
        >
          <ButtonLink href="/quote" size="lg" withArrow className="lg:min-w-[260px]">
            Request a quote
          </ButtonLink>
          <ButtonLink
            href={`tel:${PRIMARY_PHONE.tel}`}
            size="lg"
            variant="secondary-dark"
            className="lg:min-w-[260px]"
          >
            <Phone aria-hidden="true" strokeWidth={1.5} className="h-4 w-4" />
            Call {PRIMARY_PHONE.display}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
