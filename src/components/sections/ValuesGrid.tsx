import { Award, Clock, Handshake, Leaf, Lightbulb, ShieldCheck, type LucideIcon } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { ValueCard } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CORE_VALUES } from '@/data/company';
import { cn, pad } from '@/lib/utils';

const ICONS: Record<string, LucideIcon> = {
  ShieldCheck,
  Award,
  Clock,
  Lightbulb,
  Leaf,
  Handshake,
};

/**
 * Six cells sharing borders so the group reads as a table on a manifest rather
 * than six floating boxes.
 */
export function ValuesGrid({
  onDark = true,
  full = false,
}: {
  onDark?: boolean;
  /** The About page uses the fuller descriptions. */
  full?: boolean;
}) {
  return (
    <section
      aria-labelledby="values-heading"
      className={cn('section-y', onDark ? 'grain relative bg-ink-900' : 'bg-bone')}
    >
      <div className="container-site relative z-10">
        <SectionHeader
          headingId="values-heading"
          eyebrow="Core values"
          heading="How we operate."
          align="centre"
          onDark={onDark}
        />

        <div
          className={cn(
            'mt-14 grid grid-cols-1 border-l border-t sm:grid-cols-2 lg:grid-cols-3',
            onDark ? 'border-line-dark' : 'border-line',
          )}
        >
          {CORE_VALUES.map((value, index) => (
            <Reveal
              key={value.title}
              delay={Math.min(index, 5) * 70}
              className={cn('border-b border-r', onDark ? 'border-line-dark' : 'border-line')}
            >
              <ValueCard
                index={pad(index + 1)}
                title={value.title}
                description={full ? value.full : value.short}
                icon={ICONS[value.icon]}
                onDark={onDark}
                className="h-full"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
