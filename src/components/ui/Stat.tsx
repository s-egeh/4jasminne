import { cn } from '@/lib/utils';
import { CountUp } from '@/components/motion/CountUp';

interface StatProps {
  /** Mono label above the figure, left-aligned. */
  label: string;
  /** The figure itself. Pass `count` instead to animate a numeral. */
  value?: string;
  count?: number;
  suffix?: string;
  /** Small mono note under the figure — attribution, qualifier. */
  note?: string;
  onDark?: boolean;
  className?: string;
}

/**
 * Signature element 3 — the manifest stat cell. Mono label, large Archivo
 * figure, hairline box and a gold tick in the top-left corner, arranged like
 * entries on a shipping document.
 */
export function Stat({ label, value, count, suffix, note, onDark = false, className }: StatProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col gap-3 border p-6 sm:p-7',
        onDark ? 'border-line-dark' : 'border-line',
        className,
      )}
    >
      <span aria-hidden="true" className="absolute left-3 top-3 h-1 w-1 bg-gold" />

      <span className={cn('u-eyebrow', onDark ? 'text-slate-400' : 'text-slate-600')}>{label}</span>

      <span
        className={cn(
          'font-display text-[clamp(2.25rem,4vw,3.25rem)] font-bold leading-none tracking-[-0.02em]',
          onDark ? 'text-white' : 'text-ink-900',
        )}
      >
        {typeof count === 'number' ? <CountUp end={count} suffix={suffix} /> : value}
      </span>

      {note ? (
        <span className={cn('u-mono text-[10px] leading-relaxed', onDark ? 'text-slate-400' : 'text-slate-600')}>
          {note}
        </span>
      ) : null}
    </div>
  );
}

/** Small mono badge. 2px radius, hairline border. */
export function Badge({
  children,
  onDark = false,
  className,
}: {
  children: React.ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-badge border px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em]',
        onDark ? 'border-line-dark text-slate-400' : 'border-line text-slate-600',
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Mono index label inside a hairline box — used on service cards and rows. */
export function IndexTag({
  children,
  onDark = false,
  className,
}: {
  children: React.ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex h-8 w-9 items-center justify-center border font-mono text-[11px] font-medium tracking-[0.12em]',
        onDark ? 'border-white/30 text-white' : 'border-line text-ink-900',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Divider({ onDark = false, className }: { onDark?: boolean; className?: string }) {
  return <hr className={cn('border-0 border-t', onDark ? 'border-line-dark' : 'border-line', className)} />;
}
