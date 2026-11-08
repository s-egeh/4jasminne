import Link from 'next/link';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Figure } from './Media';

interface ServiceCardProps {
  index: string;
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
  className?: string;
}

/**
 * Service card — 16:10 image with ink scrim, mono index in a hairline box over
 * the image, hairline border that turns gold on hover.
 */
export function ServiceCard({
  index,
  title,
  description,
  href,
  image,
  imageAlt,
  className,
}: ServiceCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative flex h-full flex-col border border-line bg-paper transition-[border-color,box-shadow] duration-fast ease-out-expo hover:border-gold hover:shadow-elevate',
        className,
      )}
    >
      <div className="relative aspect-card overflow-hidden">
        <Figure
          src={image}
          alt={imageAlt}
          className="absolute inset-0 h-full w-full"
          imageClassName="h-full w-full transition-transform duration-base ease-out-expo group-hover:scale-[1.04]"
          sizes="(min-width: 1024px) 640px, 100vw"
        />
        <span aria-hidden="true" className="card-scrim pointer-events-none absolute inset-0" />
        <span
          aria-hidden="true"
          className="absolute left-4 top-4 inline-flex h-8 w-9 items-center justify-center border border-white/40 font-mono text-[11px] font-medium tracking-[0.12em] text-white"
        >
          {index}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6 sm:p-7">
        <h3 className="t-h4 font-semibold text-ink-900">{title}</h3>
        <p className="t-small text-slate-600">{description}</p>

        <span className="mt-auto inline-flex items-center gap-[10px] pt-5 font-mono text-[12px] font-medium uppercase tracking-[0.1em] text-ink-900 transition-colors duration-fast group-hover:text-gold-ink">
          Explore service
          <ArrowRight
            aria-hidden="true"
            strokeWidth={1.5}
            className="h-4 w-4 transition-transform duration-fast ease-out-expo group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}

interface ValueCardProps {
  index: string;
  title: string;
  description: string;
  icon: LucideIcon;
  onDark?: boolean;
  className?: string;
}

/**
 * Value card — no image. Cells share borders so the group reads as a table
 * rather than a row of floating boxes.
 */
export function ValueCard({ index, title, description, icon: Icon, onDark = true, className }: ValueCardProps) {
  return (
    <div
      className={cn(
        'group relative flex flex-col gap-4 p-7 transition-colors duration-fast sm:p-9',
        onDark ? 'hover:bg-white/[0.03]' : 'hover:bg-paper',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'absolute right-6 top-7 font-mono text-[11px] font-medium tracking-[0.12em]',
          onDark ? 'text-white/55' : 'text-slate-600',
        )}
      >
        {index}
      </span>

      <Icon aria-hidden="true" strokeWidth={1.5} className="h-8 w-8 text-gold" />

      <h3 className={cn('t-h4 font-semibold', onDark ? 'text-white' : 'text-ink-900')}>{title}</h3>
      <p className={cn('max-w-[38ch] t-small', onDark ? 'text-slate-400' : 'text-slate-600')}>
        {description}
      </p>
    </div>
  );
}

interface CsrCardProps {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  className?: string;
}

/** CSR card — title sits over the image on a bottom-anchored ink gradient. */
export function CsrCard({ title, description, image, imageAlt, className }: CsrCardProps) {
  return (
    <article className={cn('group flex flex-col', className)}>
      <div className="relative aspect-card overflow-hidden border-b border-gold">
        <Figure
          src={image}
          alt={imageAlt}
          className="absolute inset-0 h-full w-full"
          imageClassName="h-full w-full transition-transform duration-base ease-out-expo group-hover:scale-[1.04]"
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
        <span aria-hidden="true" className="card-scrim pointer-events-none absolute inset-0" />
        <h3 className="absolute inset-x-0 bottom-0 p-6 t-h4 font-semibold text-white">{title}</h3>
      </div>
      <p className="pt-5 t-small text-slate-600">{description}</p>
    </article>
  );
}

/** Fleet card — image plus a hairline-separated spec table in mono type. */
export function FleetCard({
  name,
  summary,
  image,
  imageAlt,
  specs,
  onOpen,
  className,
}: {
  name: string;
  summary: string;
  image: string;
  imageAlt: string;
  specs: { label: string; value: string }[];
  onOpen?: () => void;
  className?: string;
}) {
  const body = (
    <>
      <div className="relative aspect-card overflow-hidden">
        <Figure
          src={image}
          alt={imageAlt}
          className="absolute inset-0 h-full w-full"
          imageClassName="h-full w-full transition-transform duration-base ease-out-expo group-hover:scale-[1.04]"
          sizes="(min-width: 1024px) 420px, (min-width: 768px) 50vw, 90vw"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="t-h4 font-semibold text-ink-900">{name}</h3>
        <p className="pt-2 t-small text-slate-600">{summary}</p>

        <dl className="mt-6 border-t border-line">
          {specs.map((spec) => (
            <div key={spec.label} className="flex items-start justify-between gap-4 border-b border-line py-3">
              <dt className="u-mono text-[10px] text-gold-ink">{spec.label}</dt>
              <dd className="u-mono text-right text-[10px] text-ink-900">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );

  const classes = cn(
    'group flex h-full flex-col border border-line bg-paper text-left transition-[border-color,box-shadow] duration-fast ease-out-expo hover:border-gold hover:shadow-elevate',
    className,
  );

  if (onOpen) {
    return (
      <button type="button" onClick={onOpen} className={classes} aria-label={`View images of ${name}`}>
        {body}
      </button>
    );
  }

  return <div className={classes}>{body}</div>;
}
