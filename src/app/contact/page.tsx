import type { Metadata } from 'next';
import { Mail, MapPin, Phone } from 'lucide-react';
import { ContactForm } from '@/components/forms/ContactForm';
import { Reveal } from '@/components/motion/Reveal';
import { ContactBlock } from '@/components/sections/ContactBlock';
import { CellGrid } from '@/components/sections/ContentBlocks';
import { MapEmbed } from '@/components/sections/MapEmbed';
import { PageHero } from '@/components/sections/PageHero';
import { RelatedLinks } from '@/components/sections/RelatedLinks';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ACTIVE_ADDRESSES, COMPANY } from '@/data/company';
import { ENQUIRY_CHECKLIST } from '@/data/operations';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Contact us',
  description:
    'Contact the 4Jasmine Dr operations team in the Free Zone Enclave, Tema, about road freight, warehousing, distribution or an import or export shipment.',
  path: '/contact',
});

export default function ContactPage() {
  const headOffice = ACTIVE_ADDRESSES[0];

  return (
    <>
      <PageHero
        heading="Contact us"
        standfirst="Talk to the operations team about a consignment, storage or a shipment."
        image="/images/gallery/gallery-23.jpg"
        imageAlt="The 4Jasmine Dr office in the Free Zone Enclave, Tema"
        crumbs={[{ label: 'Contact', href: '/contact' }]}
        height="short"
      />

      {/* 1 — Three contact cards */}
      <section aria-labelledby="contact-cards-heading" className="section-y bg-bone">
        <div className="container-site">
          <h2 id="contact-cards-heading" className="sr-only">
            How to reach us
          </h2>

          <div className="grid grid-cols-1 border-l border-t border-line md:grid-cols-3">
            <Reveal className="border-b border-r border-line">
              <div className="flex h-full flex-col gap-5 p-8">
                <Phone aria-hidden="true" strokeWidth={1.5} className="h-6 w-6 text-gold" />
                <h3 className="u-eyebrow text-slate-600">Call us</h3>
                <ul className="flex flex-col gap-3">
                  {COMPANY.phones.map((phone) => (
                    <li key={phone.tel}>
                      <a
                        href={`tel:${phone.tel}`}
                        className="group flex min-h-11 flex-col justify-center transition-colors duration-fast hover:text-gold-ink lg:min-h-0"
                      >
                        <span className="u-mono text-[10px] text-gold-ink">{phone.label}</span>
                        <span className="u-mono mt-1 text-[13px] text-ink-900 group-hover:text-gold-ink">
                          {phone.display}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={70} className="border-b border-r border-line">
              <div className="flex h-full flex-col gap-5 p-8">
                <Mail aria-hidden="true" strokeWidth={1.5} className="h-6 w-6 text-gold" />
                <h3 className="u-eyebrow text-slate-600">Email us</h3>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="flex min-h-11 items-center text-ink-900 transition-colors duration-fast hover:text-gold-ink lg:min-h-0"
                >
                  {COMPANY.email}
                </a>
                <p className="t-small text-slate-600">Enquiries are read by the operations team.</p>
              </div>
            </Reveal>

            <Reveal delay={140} className="border-b border-r border-line">
              <div className="flex h-full flex-col gap-5 p-8">
                <MapPin aria-hidden="true" strokeWidth={1.5} className="h-6 w-6 text-gold" />
                <h3 className="u-eyebrow text-slate-600">Visit us</h3>
                <address className="not-italic text-ink-900">
                  {headOffice.lines.join(', ')}
                  <br />
                  {headOffice.region}, {headOffice.country}
                </address>
                <a
                  href={COMPANY.mapDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="u-mono mt-auto inline-flex min-h-11 items-center text-[11px] text-gold-ink underline decoration-gold underline-offset-4 transition-colors duration-fast hover:text-gold-ink lg:min-h-0"
                >
                  Get directions
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2 — Form and map */}
      <section aria-labelledby="contact-form-heading" className="section-y bg-bone pt-0">
        <div className="container-site grid grid-cols-1 gap-x-6 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeader
              headingId="contact-form-heading"
              eyebrow="Send a message"
              heading="Tell us what you need."
            />
            <Reveal delay={140} className="mt-10">
              <ContactForm />
            </Reveal>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal>
              <ContactBlock />
            </Reveal>
            <Reveal delay={120} className="mt-10 no-print">
              <MapEmbed height={380} />
            </Reveal>
          </div>
        </div>
      </section>

      {/*
        Direct department contacts (operations, warehouse, accounts) are
        deliberately not rendered. [TODO-CLIENT] supply the routing addresses
        and the section can be switched on; shipping placeholder rows would be
        worse than omitting it.
      */}

      {/* 3 — How to find us */}
      <section aria-labelledby="find-us-heading" className="section-y bg-paper">
        <div className="container-site grid grid-cols-1 gap-x-6 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeader
              headingId="find-us-heading"
              eyebrow="Getting here"
              heading="How to find us."
              width="tight"
            />
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <p className="max-w-measure t-body-lg text-slate-600">
                Our office is in the Free Zone Enclave in Tema. It is an enclave address rather than
                a street-numbered one, so satellite navigation will get you to the area but not to
                the door.
              </p>
            </Reveal>

            {/*
              [TODO-CLIENT] Supply landmark-based directions — the junction to
              turn at, the neighbouring business, and what the gate looks like.
              Until then this says honestly that the pin is approximate rather
              than inventing a landmark that may not exist.
            */}
            <Reveal delay={70}>
              <p className="mt-5 max-w-measure t-body-lg text-slate-600">
                Call the operations line before you set off and we will tell you how to find us. If
                you are arriving with a vehicle to load or unload, tell us in advance so the bay is
                clear when you get here.
              </p>
            </Reveal>

            <Reveal delay={140} className="mt-8 block">
              <a
                href={COMPANY.mapDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="u-mono inline-flex min-h-11 items-center text-[12px] text-ink-900 u-underline lg:min-h-0"
              >
                Open directions in Google Maps
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4 — What to include in your enquiry */}
      <section aria-labelledby="enquiry-checklist-heading" className="section-y bg-bone">
        <div className="container-site">
          <SectionHeader
            headingId="enquiry-checklist-heading"
            eyebrow="Before you write"
            heading="What to include in your enquiry."
            intro="Send these six things and the first reply can be a quote rather than a question."
            width="wide"
          />

          <CellGrid cells={ENQUIRY_CHECKLIST} columns={3} className="mt-14" />

          <div className="mt-14">
            <RelatedLinks
              lead="If you would rather read before you write, start with"
              links={[
                { label: 'the quote form', href: '/quote' },
                { label: 'where we run', href: '/coverage' },
                { label: 'the questions we are asked most', href: '/faq' },
              ]}
            />
          </div>
        </div>
      </section>


      {/* No pre-footer CTA here: asking again on the contact page is pushy. */}
    </>
  );
}
