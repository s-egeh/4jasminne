import type { Metadata } from 'next';
import { Reveal } from '@/components/motion/Reveal';
import { CTABand } from '@/components/sections/CTABand';
import { PageHero } from '@/components/sections/PageHero';
import { Accordion } from '@/components/ui/Accordion';
import { ButtonLink } from '@/components/ui/Button';
import { ALL_FAQS, FAQ_GROUPS } from '@/data/faq';
import { faqSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Frequently asked questions',
  description:
    'Answers on delivery coverage, full and part loads, warehousing and cross-docking, distribution, freight forwarding and getting a quote from 4Jasmine Dr.',
  path: '/faq',
});

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(ALL_FAQS)) }}
      />

      <PageHero
        heading="Frequently asked questions"
        standfirst="The questions we are asked most, answered plainly. If yours is not here, ask it directly."
        image="/images/gallery/gallery-loading-bay.jpg"
        imageAlt="Goods staged at the 4Jasmine Dr loading bay ready for dispatch"
        crumbs={[
          { label: 'About', href: '/about' },
          { label: 'FAQ', href: '/faq' },
        ]}
        height="short"
      />

      <section aria-labelledby="faq-heading" className="section-y bg-bone">
        <div className="container-site">
          <h2 id="faq-heading" className="sr-only">
            Frequently asked questions
          </h2>

          <div className="grid grid-cols-1 gap-x-6 gap-y-12 lg:grid-cols-12">
            {/* Category nav — sticky from lg up, a plain jump list below it. */}
            <nav aria-label="FAQ categories" className="lg:col-span-3">
              <div className="lg:sticky lg:top-[120px]">
                <p className="u-eyebrow text-gold-ink">Categories</p>
                <ul className="mt-6 border-t border-line">
                  {FAQ_GROUPS.map((group) => (
                    <li key={group.id} className="border-b border-line">
                      <a
                        href={`#${group.id}`}
                        className="block py-3.5 u-mono text-[11px] text-slate-600 transition-colors duration-fast hover:text-gold-ink"
                      >
                        {group.label}
                      </a>
                    </li>
                  ))}
                </ul>

                <ButtonLink href="/contact" variant="secondary-light" className="mt-8 w-full">
                  Ask a question
                </ButtonLink>
              </div>
            </nav>

            <div className="flex flex-col gap-16 lg:col-span-8 lg:col-start-5">
              {FAQ_GROUPS.map((group) => (
                <div key={group.id} id={group.id} className="scroll-mt-[var(--header-h)]">
                  <Reveal>
                    <h3 className="u-eyebrow text-gold-ink">{group.label}</h3>
                  </Reveal>
                  <div className="mt-6">
                    <Accordion items={group.items} defaultOpen={null} headingLevel="h4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
