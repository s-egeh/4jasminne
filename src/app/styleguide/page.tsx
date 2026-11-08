import type { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { SwooshRule } from '@/components/motion/SwooshRule';
import { Accordion } from '@/components/ui/Accordion';
import { Button, ButtonLink, IconButton, TextLink } from '@/components/ui/Button';
import { CsrCard, FleetCard, ServiceCard, ValueCard } from '@/components/ui/Card';
import { Checkbox, Field, Input, Select, Textarea } from '@/components/ui/Field';
import { ImagePlaceholder, MonogramTile, WordmarkTile } from '@/components/ui/Media';
import { Eyebrow, SectionHeader } from '@/components/ui/SectionHeader';
import { Badge, Divider, IndexTag, Stat } from '@/components/ui/Stat';
import { Tabs } from '@/components/ui/Tabs';
import { FAQS } from '@/data/faq';
import { FLEET } from '@/data/fleet';
import { SERVICES } from '@/data/services';
import { pageMetadata } from '@/lib/seo';

/**
 * Internal style guide — every component variant and state in one place.
 *
 * Kept out of the sitemap and marked noindex. It is a build tool: when a
 * component drifts, this page is where it shows up first.
 */
export const metadata: Metadata = pageMetadata({
  title: 'Style guide',
  description: 'Internal component reference for the 4Jasmine Dr website.',
  path: '/styleguide',
  noindex: true,
});

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-14">
      <h2 className="u-eyebrow text-gold-ink">{title}</h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <div className="bg-bone pb-section pt-40 md:pt-48">
      <div className="container-site">
        <p className="u-mono text-[11px] text-gold-ink">Internal — noindex, excluded from sitemap</p>
        <h1 className="mt-4 t-display-l font-bold text-ink-900">Style guide</h1>

        <Block title="Colour">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {[
              ['ink-900', 'bg-ink-900'],
              ['ink-800', 'bg-ink-800'],
              ['ink-700', 'bg-ink-700'],
              ['ink-500', 'bg-ink-500'],
              ['danger (validation only)', 'bg-danger'],
              ['gold', 'bg-gold'],
              ['gold-dark', 'bg-gold-dark'],
              ['gold-ink (text)', 'bg-gold-ink'],
              ['bone', 'bg-bone'],
              ['paper', 'bg-paper'],
              ['slate-600', 'bg-slate-600'],
              ['slate-400', 'bg-slate-400'],
            ].map(([name, className]) => (
              <div key={name}>
                <div className={`h-20 w-full border border-line ${className}`} />
                <p className="u-mono mt-2 text-[10px] text-slate-600">{name}</p>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Type scale">
          <div className="flex flex-col gap-6">
            <p className="t-display-xl font-display font-bold">Display XL</p>
            <p className="t-display-l font-display font-bold">Display L</p>
            <p className="t-h2 font-display font-bold">Heading 2</p>
            <p className="t-h3 font-display font-bold">Heading 3</p>
            <p className="t-h4 font-display font-semibold">Heading 4</p>
            <p className="max-w-measure t-body-lg text-slate-600">
              Body large — intro paragraphs sit at this size with a 1.65 line height and a 72ch
              measure.
            </p>
            <p className="max-w-measure text-slate-600">
              Body — the default paragraph size across the site.
            </p>
            <p className="t-small text-slate-600">Small — captions and card descriptions.</p>
            <p className="u-eyebrow text-gold-ink">Eyebrow — mono, uppercase, 0.14em</p>
          </div>
        </Block>

        <Block title="Signature elements">
          <div className="flex flex-col gap-10">
            <div>
              <p className="u-mono mb-3 text-[10px] text-slate-600">Swoosh rule</p>
              <SwooshRule />
            </div>

            <div>
              <p className="u-mono mb-3 text-[10px] text-slate-600">Eyebrow</p>
              <Eyebrow>Competitive advantage</Eyebrow>
            </div>

            <div>
              <p className="u-mono mb-3 text-[10px] text-slate-600">Manifest stat cells</p>
              <div className="grid grid-cols-1 sm:grid-cols-3">
                <Stat label="Services" count={4} />
                <Stat label="Base" value="Tema" />
                <Stat label="Coverage" value="Nationwide" />
              </div>
            </div>
          </div>
        </Block>

        <Block title="Buttons">
          <div className="flex flex-col gap-10">
            <div>
              <p className="u-mono mb-4 text-[10px] text-slate-600">Primary — lg / md / sm</p>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="lg" withArrow>
                  Request a quote
                </Button>
                <Button size="md">Send message</Button>
                <Button size="sm">Accept</Button>
                <Button disabled>Disabled</Button>
                <Button loading>Sending</Button>
              </div>
            </div>

            <div>
              <p className="u-mono mb-4 text-[10px] text-slate-600">Secondary on light</p>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="secondary-light" size="lg">
                  View all services
                </Button>
                <Button variant="secondary-light" disabled>
                  Disabled
                </Button>
              </div>
            </div>

            <div className="bg-ink-900 p-8">
              <p className="u-mono mb-4 text-[10px] text-slate-400">Secondary on dark</p>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="secondary-dark" size="lg">
                  Talk to us
                </Button>
                <Button variant="secondary-dark" disabled>
                  Disabled
                </Button>
              </div>
            </div>

            <div>
              <p className="u-mono mb-4 text-[10px] text-slate-600">Ghost / text link and icon button</p>
              <div className="flex flex-wrap items-center gap-6">
                <TextLink href="/about">Read our full profile</TextLink>
                <ButtonLink href="/services" variant="ghost">
                  Explore service
                </ButtonLink>
                <IconButton label="Example icon button">
                  <ShieldCheck aria-hidden="true" strokeWidth={1.5} className="h-[18px] w-[18px]" />
                </IconButton>
              </div>
            </div>
          </div>
        </Block>

        <Block title="Badges, tags and rules">
          <div className="flex flex-wrap items-center gap-4">
            <Badge>Free Zone Enclave</Badge>
            <IndexTag>01</IndexTag>
            <Divider className="w-40" />
          </div>
        </Block>

        <Block title="Section header">
          <SectionHeader
            eyebrow="What we do"
            heading="Four services, one accountable partner."
            intro="Clients reach one team for freight, storage, distribution and forwarding."
            cta={<TextLink href="/services">View all services</TextLink>}
          />
        </Block>

        <Block title="Cards">
          <div className="flex flex-col gap-10">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <ServiceCard
                index={SERVICES[0].index}
                title={SERVICES[0].name}
                description={SERVICES[0].short}
                href={`/services/${SERVICES[0].slug}`}
                image={SERVICES[0].image}
                imageAlt={SERVICES[0].imageAlt}
              />
              <FleetCard
                name={FLEET[0].name}
                summary={FLEET[0].summary}
                image={FLEET[0].image}
                imageAlt={FLEET[0].imageAlt}
                specs={FLEET[0].specs}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="border border-line">
                <ValueCard
                  index="01"
                  title="Integrity"
                  description="We conduct business honestly and transparently."
                  icon={ShieldCheck}
                  onDark={false}
                />
              </div>
              <CsrCard
                title="Card title"
                description="A short line describing the item on this card."
                image="/images/gallery/gallery-goods-receiving.jpg"
                imageAlt="Example card image"
              />
            </div>
          </div>
        </Block>

        <Block title="Placeholders">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <ImagePlaceholder className="aspect-card w-full" label="hero-highway-truck.jpg" />
            <MonogramTile initials="4J" className="aspect-portrait w-full" />
            <div className="flex aspect-card w-full items-center justify-center border border-line">
              <WordmarkTile name="Client name" />
            </div>
          </div>
        </Block>

        <Block title="Form controls">
          <div className="grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
            <Field id="sg-name" label="Full name" required>
              <Input id="sg-name" placeholder="Kwame Mensah" />
            </Field>
            <Field id="sg-error" label="Phone" required error="Enter a phone number we can reach you on.">
              <Input id="sg-error" invalid />
            </Field>
            <Field id="sg-select" label="Enquiry type" required>
              <Select id="sg-select" defaultValue="">
                <option value="" disabled>
                  Select an enquiry type
                </option>
                <option>Freight and haulage</option>
              </Select>
            </Field>
            <Field id="sg-disabled" label="Disabled">
              <Input id="sg-disabled" disabled value="Read only" readOnly />
            </Field>
            <Field id="sg-textarea" label="Message" className="sm:col-span-2">
              <Textarea id="sg-textarea" />
            </Field>
            <Checkbox
              id="sg-consent"
              label="I agree to be contacted about this enquiry."
              className="sm:col-span-2"
            />
          </div>
        </Block>

        <Block title="Accordion">
          <Accordion items={FAQS.slice(0, 3)} />
        </Block>

        <Block title="Tabs">
          <Tabs
            items={SERVICES.slice(0, 3).map((service) => ({
              id: service.slug,
              label: service.name,
              panel: <p className="max-w-measure text-slate-600">{service.summary}</p>,
            }))}
          />
        </Block>

        <Block title="Motion">
          <Reveal>
            <p className="max-w-measure text-slate-600">
              This paragraph uses the Reveal primitive: fade plus a 24px rise over 420ms, once only,
              collapsing to a 150ms opacity fade under reduced motion.
            </p>
          </Reveal>
        </Block>
      </div>
    </div>
  );
}
