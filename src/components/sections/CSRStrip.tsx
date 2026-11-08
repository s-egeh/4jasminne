import { Reveal } from '@/components/motion/Reveal';
import { SwooshRule } from '@/components/motion/SwooshRule';
import { TextMask } from '@/components/motion/TextMask';
import { TextLink } from '@/components/ui/Button';
import { Figure } from '@/components/ui/Media';
import { Eyebrow } from '@/components/ui/SectionHeader';
import { CSR_INITIATIVES } from '@/data/csr';

export function CSRStrip() {
  // Renders only once the client supplies its community work.
  if (CSR_INITIATIVES.length === 0) return null;

  // Third and fourth photographs when there are four, otherwise the first two.
  const primary = CSR_INITIATIVES[2] ?? CSR_INITIATIVES[0];
  const secondary = CSR_INITIATIVES[3] ?? CSR_INITIATIVES[1];

  return (
    <section aria-labelledby="csr-strip-heading" className="grain section-y relative bg-ink-900">
      <div className="container-site relative z-10 grid grid-cols-1 items-center gap-x-6 gap-y-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-6">
          <div className="relative pb-14 pr-14">
            <Figure
              src={primary.image}
              alt={primary.imageAlt}
              className="aspect-card w-full border-b border-gold"
              imageClassName="h-full w-full"
              sizes="(min-width: 1024px) 620px, 100vw"
            />
            {secondary && secondary !== primary ? (
              <Figure
                src={secondary.image}
                alt={secondary.imageAlt}
                className="absolute bottom-0 right-0 aspect-portrait w-[42%] border-[6px] border-ink-900"
                imageClassName="h-full w-full"
                sizes="260px"
              />
            ) : null}
          </div>
        </Reveal>

        <div className="lg:col-span-5 lg:col-start-8">
          <Reveal>
            <Eyebrow onDark>Responsibility</Eyebrow>
          </Reveal>

          <SwooshRule className="mt-5" />

          <TextMask
            as="h2"
            id="csr-strip-heading"
            text="Investing where we operate."
            delay={90}
            className="mt-5 t-h2 text-white"
          />

          <Reveal delay={140}>
            <p className="mt-6 max-w-measure text-slate-400">
              Investment is directed at the communities that host our operations and at the road users
              who share our routes.
            </p>
          </Reveal>

          <ul className="mt-9 border-t border-line-dark">
            {CSR_INITIATIVES.map((initiative, index) => (
              <Reveal key={initiative.slug} delay={index * 70} as="li" className="block">
                <span className="flex items-center gap-4 border-b border-line-dark py-4">
                  <span aria-hidden="true" className="h-1 w-1 shrink-0 bg-gold" />
                  <span className="u-mono text-[11px] text-white/80">{initiative.title}</span>
                </span>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={200} className="mt-9">
            <TextLink href="/csr" className="text-white hover:text-gold">
              Read about our CSR
            </TextLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
