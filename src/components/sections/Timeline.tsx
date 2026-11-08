import { Reveal } from '@/components/motion/Reveal';
import type { Milestone } from '@/data/milestones';
import { cn } from '@/lib/utils';

/**
 * Company milestones.
 *
 * Built and wired, but it renders nothing while MILESTONES is empty — and it
 * is empty, because no founding date or expansion year has been supplied and
 * none has been invented. Populate src/data/milestones.ts and the section
 * appears with no further code change.
 */
export function Timeline({
  milestones,
  onDark = false,
  className,
}: {
  milestones: Milestone[];
  onDark?: boolean;
  className?: string;
}) {
  if (milestones.length === 0) return null;

  return (
    <ol className={cn('flex flex-col', className)}>
      {milestones.map((milestone, index) => (
        <Reveal key={`${milestone.year}-${milestone.title}`} delay={index * 70}>
          <li className="grid grid-cols-1 gap-x-10 gap-y-3 py-8 sm:grid-cols-[minmax(0,10ch)_1fr]">
            <span className={cn('u-mono text-[11px]', onDark ? 'text-gold' : 'text-gold-ink')}>
              {milestone.year}
            </span>

            <div
              className={cn(
                'relative border-l pl-8',
                onDark ? 'border-line-dark' : 'border-line',
              )}
            >
              <span
                aria-hidden="true"
                className="absolute -left-[4.5px] top-1.5 h-2 w-2 bg-gold"
              />
              <h3 className={cn('t-h4 font-semibold', onDark ? 'text-white' : 'text-ink-900')}>
                {milestone.title}
              </h3>
              <p
                className={cn(
                  'mt-3 max-w-measure t-small',
                  onDark ? 'text-slate-400' : 'text-slate-600',
                )}
              >
                {milestone.description}
              </p>
            </div>
          </li>
        </Reveal>
      ))}
    </ol>
  );
}
