import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { ServiceCard } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SERVICES } from '@/data/services';

export function ServicesGrid() {
  return (
    <section aria-labelledby="services-heading" className="section-y bg-bone">
      <div className="container-site">
        <SectionHeader
          headingId="services-heading"
          eyebrow="What we do"
          heading="Four services, one accountable partner."
          intro="Clients reach one team for freight, storage, distribution and forwarding — which removes the cost of coordinating four separate providers."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {SERVICES.map((service, index) => (
            <Reveal key={service.slug} delay={index * 70}>
              <ServiceCard
                index={service.index}
                title={service.name}
                description={service.short}
                href={`/services/${service.slug}`}
                image={service.image}
                imageAlt={service.imageAlt}
                className="h-full"
              />
            </Reveal>
          ))}
        </div>

        <Reveal delay={140} className="mt-12 flex justify-center">
          <ButtonLink href="/services" variant="secondary-light" size="lg" withArrow>
            View all services
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
