import { Reveal } from '@/components/motion/Reveal';
import { DIVISIONS, ORG_HEAD } from '@/data/org';
import { cn } from '@/lib/utils';

/**
 * The company structure, built in HTML and CSS rather than exported as an
 * image — so it stays selectable, translatable, readable to a screen reader
 * and legible at any zoom. Two placements: /about and /team.
 *
 * The connectors are decorative: the relationship is already carried by the
 * list semantics, so a screen reader gets the structure without them.
 */
export function OrgDiagram({ onDark = false, className }: { onDark?: boolean; className?: string }) {
  const line = onDark ? 'border-line-dark' : 'border-line';
  const rule = onDark ? 'bg-line-dark' : 'bg-line';

  return (
    <div className={cn('flex flex-col items-center', className)}>
      {/* Head of the structure */}
      <Reveal className="w-full max-w-[420px]">
        <div
          className={cn(
            'border px-7 py-6 text-center',
            line,
            onDark ? 'bg-ink-800' : 'bg-paper',
          )}
        >
          <h3 className={cn('t-h4 font-semibold', onDark ? 'text-white' : 'text-ink-900')}>
            {ORG_HEAD.name}
          </h3>
          <p className={cn('mt-2 t-small', onDark ? 'text-slate-400' : 'text-slate-600')}>
            {ORG_HEAD.note}
          </p>
        </div>
      </Reveal>

      {/* Vertical drop from the CEO box */}
      <span aria-hidden="true" className={cn('h-10 w-px shrink-0', rule)} />

      {/* Horizontal spine, desktop only — below xl the boxes simply stack. */}
      <span
        aria-hidden="true"
        className={cn('hidden h-px w-[calc(100%-2rem)] xl:block', rule)}
      />

      <ul className="grid w-full grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-4">
        {DIVISIONS.map((division, index) => (
          <Reveal key={division.name} delay={index * 70} className="flex flex-col items-center">
            <li className="flex w-full flex-col items-center">
              {/* Riser up to the spine */}
              <span aria-hidden="true" className={cn('hidden h-10 w-px xl:block', rule)} />

              <div className={cn('w-full border p-6', line, onDark ? 'bg-ink-800' : 'bg-paper')}>
                <h4 className={cn('t-h4 font-semibold', onDark ? 'text-white' : 'text-ink-900')}>
                  {division.name}
                </h4>

                <ul className={cn('mt-4 border-t', line)}>
                  {division.owns.map((item) => (
                    <li
                      key={item}
                      className={cn(
                        'border-b py-2.5 u-mono text-[10px]',
                        line,
                        onDark ? 'text-slate-400' : 'text-slate-600',
                      )}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
