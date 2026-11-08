import type { ReactNode } from 'react';
import { Check, Minus, type LucideIcon } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ *
 * Small shared blocks used across several routes. Each one exists because
 * the same shape appears on three or more pages; anything used once stays
 * inline on its page instead of being abstracted for the sake of it.
 * ------------------------------------------------------------------ */

/**
 * Mono key-fact list in a hairline box. Fills the dead lower-left of a split
 * section with something a reader actually wants.
 */
export function KeyFacts({
  rows,
  onDark = false,
  className,
}: {
  rows: { label: string; value: string }[];
  onDark?: boolean;
  className?: string;
}) {
  return (
    <dl
      className={cn(
        'border',
        onDark ? 'border-line-dark' : 'border-line bg-paper',
        className,
      )}
    >
      {rows.map((row, index) => (
        <div
          key={row.label}
          className={cn(
            'flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-baseline sm:gap-6',
            index > 0 && (onDark ? 'border-t border-line-dark' : 'border-t border-line'),
          )}
        >
          <dt
            className={cn(
              'u-mono shrink-0 text-[10px] sm:w-[13ch]',
              onDark ? 'text-slate-400' : 'text-slate-600',
            )}
          >
            {row.label}
          </dt>
          <dd className={cn('u-mono text-[11px]', onDark ? 'text-white' : 'text-ink-900')}>
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Pull-quote in the display face with a gold vertical rule. Attribution is in
 * mono and is never a person unless a real person said it — a document is
 * cited as a document.
 */
export function PullQuote({
  children,
  attribution,
  onDark = false,
  size = 'md',
  className,
}: {
  children: ReactNode;
  attribution?: string;
  onDark?: boolean;
  size?: 'md' | 'lg';
  className?: string;
}) {
  return (
    <figure className={cn('border-l-2 border-gold pl-6', className)}>
      <blockquote
        className={cn(
          'font-display font-medium',
          size === 'lg' ? 'text-[clamp(1.35rem,2.2vw,1.625rem)]' : 'text-[clamp(1.15rem,1.8vw,1.5rem)]',
          'leading-[1.35] tracking-[-0.01em]',
          onDark ? 'text-white' : 'text-ink-900',
        )}
      >
        {children}
      </blockquote>
      {attribution ? (
        <figcaption
          className={cn('mt-4 u-mono text-[10px]', onDark ? 'text-slate-400' : 'text-slate-600')}
        >
          {attribution}
        </figcaption>
      ) : null}
    </figure>
  );
}

/**
 * Hairline table of label/value rows. Used for pricing factors and the
 * documentation list — anywhere a reader is scanning for a specific row.
 */
export function FactorTable({
  rows,
  onDark = false,
  className,
}: {
  rows: { label: string; value: string }[];
  onDark?: boolean;
  className?: string;
}) {
  return (
    <dl className={cn('border-t', onDark ? 'border-line-dark' : 'border-line', className)}>
      {rows.map((row) => (
        <div
          key={row.label}
          className={cn(
            'grid grid-cols-1 gap-1 py-4 sm:grid-cols-[minmax(0,15ch)_1fr] sm:gap-8',
            'border-b',
            onDark ? 'border-line-dark' : 'border-line',
          )}
        >
          <dt className={cn('u-mono text-[11px]', onDark ? 'text-gold' : 'text-gold-ink')}>
            {row.label}
          </dt>
          <dd className={cn('t-small', onDark ? 'text-slate-400' : 'text-slate-600')}>
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Two hairline-divided columns: what a service includes, and what it does not.
 * Being explicit about the second column is the point of the block.
 */
export function ScopeColumns({
  included,
  excluded,
  className,
}: {
  included: string[];
  excluded: string[];
  className?: string;
}) {
  return (
    <div className={cn('grid grid-cols-1 border border-line bg-paper lg:grid-cols-2', className)}>
      <div className="p-8 lg:p-10">
        <h3 className="u-eyebrow text-gold-ink">What&rsquo;s included</h3>
        <ul className="mt-6 flex flex-col gap-4">
          {included.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <Check
                aria-hidden="true"
                strokeWidth={2}
                className="mt-0.5 h-[18px] w-[18px] shrink-0 text-gold"
              />
              <span className="t-small text-ink-900">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-line p-8 lg:border-l lg:border-t-0 lg:p-10">
        <h3 className="u-eyebrow text-slate-600">What&rsquo;s not</h3>
        <ul className="mt-6 flex flex-col gap-4">
          {excluded.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <Minus
                aria-hidden="true"
                strokeWidth={2}
                className="mt-0.5 h-[18px] w-[18px] shrink-0 text-slate-400"
              />
              <span className="t-small text-slate-600">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Numbered steps connected by a hairline with gold arrowheads. The connector is
 * horizontal on desktop and vertical below it, and is decorative in both.
 */
export function StepList({
  steps,
  onDark = false,
  className,
}: {
  steps: { index: string; title: string; description: string }[];
  onDark?: boolean;
  className?: string;
}) {
  return (
    <ol className={cn('grid grid-cols-1 gap-y-10 sm:grid-cols-2 xl:grid-cols-5 xl:gap-x-6', className)}>
      {/* Reveal renders AS the <li>. Wrapping an <li> in a Reveal <div> puts a
          div directly inside the <ol>, which breaks the list semantics — the
          items stop being announced as a list at all. */}
      {steps.map((step, i) => (
        <Reveal key={step.index} delay={i * 70} as="li" className="relative block">
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-3">
              <span className={cn('u-mono text-[11px]', onDark ? 'text-gold' : 'text-gold-ink')}>
                {step.index}
              </span>
              {/* Connector — hidden on the last step and below xl. */}
              {i < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    'hidden flex-1 items-center xl:flex',
                    onDark ? 'text-line-dark' : 'text-line',
                  )}
                >
                  <span className="h-px flex-1 bg-current" />
                  <span
                    className="h-0 w-0 border-y-[3px] border-l-[5px] border-y-transparent"
                    style={{ borderLeftColor: 'var(--gold)' }}
                  />
                </span>
              ) : null}
            </div>

            <h3
              className={cn(
                'mt-5 t-h4 font-semibold',
                onDark ? 'text-white' : 'text-ink-900',
              )}
            >
              {step.title}
            </h3>
            <p className={cn('mt-3 t-small', onDark ? 'text-slate-400' : 'text-slate-600')}>
              {step.description}
            </p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}

/**
 * Hairline cell grid — icon, title, one line. The workhorse layout for cargo
 * types, sector support, standards and driver points.
 */
export function CellGrid({
  cells,
  columns = 3,
  onDark = false,
  className,
}: {
  cells: { title: string; description: string; icon?: LucideIcon }[];
  columns?: 2 | 3 | 4;
  onDark?: boolean;
  className?: string;
}) {
  const cols = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }[columns];

  return (
    <div
      className={cn(
        'grid grid-cols-1 border-l border-t',
        onDark ? 'border-line-dark' : 'border-line',
        cols,
        className,
      )}
    >
      {cells.map((cell, index) => {
        const Icon = cell.icon;
        return (
          <Reveal
            key={cell.title}
            delay={Math.min(index, 5) * 70}
            className={cn('border-b border-r', onDark ? 'border-line-dark' : 'border-line')}
          >
            <div className="flex h-full flex-col gap-4 p-7">
              {Icon ? (
                <Icon
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="h-[18px] w-[18px] shrink-0 text-gold"
                />
              ) : null}
              <h3 className={cn('t-h4 font-semibold', onDark ? 'text-white' : 'text-ink-900')}>
                {cell.title}
              </h3>
              <p className={cn('t-small', onDark ? 'text-slate-400' : 'text-slate-600')}>
                {cell.description}
              </p>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
