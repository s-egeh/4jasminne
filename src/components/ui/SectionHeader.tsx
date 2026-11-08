import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/motion/Reveal';
import { SwooshRule } from '@/components/motion/SwooshRule';
import { TextMask } from '@/components/motion/TextMask';

interface EyebrowProps {
  children: ReactNode;
  className?: string;
  onDark?: boolean;
}

/** Gold hairline, 4px square tick, mono label. */
export function Eyebrow({ children, className, onDark = false }: EyebrowProps) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <span aria-hidden="true" className="inline-flex items-center gap-2">
        <span className="h-px w-6 bg-gold" />
        <span className="h-1 w-1 bg-gold" />
      </span>
      <span className={cn('t-mono-eyebrow', onDark ? 'text-gold' : 'text-gold-ink')}>{children}</span>
    </span>
  );
}

interface SectionHeaderProps {
  eyebrow: string;
  heading: string;
  intro?: string;
  cta?: ReactNode;
  align?: 'left' | 'centre';
  onDark?: boolean;
  className?: string;
  /** Ties the section's aria-labelledby to the heading. */
  headingId?: string;
  as?: 'h2' | 'h3';
  /**
   * Heading measure. `tight` (16ch) for short headings in narrow columns,
   * `default` (22ch) for split layouts, `wide` (26ch) for full-width bands.
   * Every option keeps an H2 to two lines at 1280px and above.
   */
  width?: 'tight' | 'default' | 'wide';
  /** Support block rendered under the header — stat cell, pull-quote, key facts. */
  children?: ReactNode;
}

const WIDTHS = {
  tight: 'max-w-head-tight',
  default: 'max-w-head',
  wide: 'max-w-head-wide',
};

export function SectionHeader({
  eyebrow,
  heading,
  intro,
  cta,
  align = 'left',
  onDark = false,
  className,
  headingId,
  as = 'h2',
  width = 'default',
  children,
}: SectionHeaderProps) {
  const centred = align === 'centre';

  return (
    <div
      className={cn(
        'flex flex-col gap-6',
        cta && !centred ? 'md:flex-row md:items-end md:justify-between md:gap-12' : '',
        className,
      )}
    >
      <div className={cn('flex flex-col', centred && 'items-center text-center')}>
        <Reveal>
          <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow>
        </Reveal>

        {/* 8px below the eyebrow, 20px above the heading — a fixed rhythm, not
            a floating element with unequal gaps on either side. */}
        <SwooshRule className={cn('mt-2', centred && 'mx-auto')} />

        <TextMask
          as={as}
          id={headingId}
          text={heading}
          delay={90}
          className={cn(
            'mt-5 t-h2',
            WIDTHS[width],
            centred && 'mx-auto',
            onDark ? 'text-white' : 'text-ink-900',
          )}
        />

        {intro ? (
          <Reveal delay={140}>
            <p
              className={cn(
                'mt-5 max-w-intro t-body-lg',
                centred && 'mx-auto',
                onDark ? 'text-slate-400' : 'text-slate-600',
              )}
            >
              {intro}
            </p>
          </Reveal>
        ) : null}

        {children ? <div className={cn('mt-10', centred && 'w-full')}>{children}</div> : null}
      </div>

      {cta ? (
        <Reveal delay={180} className={cn('shrink-0', centred && 'self-center')}>
          {cta}
        </Reveal>
      ) : null}
    </div>
  );
}

/**
 * Large faint mono index in the top-right of a section. Structural — it
 * numbers the page — and it fills the dead upper-right space that split
 * layouts otherwise leave empty.
 */
export function SectionIndex({ children, onDark = false }: { children: ReactNode; onDark?: boolean }) {
  return (
    <span aria-hidden="true" className={cn('section-index', onDark && 'section-index-dark')}>
      {children}
    </span>
  );
}
