'use client';

import Image from 'next/image';
import { useState } from 'react';
import { isImageAvailable } from '@/lib/images';
import { cn } from '@/lib/utils';

interface FigureProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Decorative images pass alt="" and are hidden from assistive technology. */
  decorative?: boolean;
  /** Shown inside the placeholder when the file has not been supplied yet. */
  placeholderLabel?: string;
  /** Fixed dimensions instead of fill. */
  width?: number;
  height?: number;
  /**
   * How a missing file is handled.
   *
   * `placeholder` — the branded tile with its caption naming the asset. Correct
   *   for a figure the reader is looking at.
   * `plain` — the branded field with NO caption. For full-bleed backdrops that
   *   sit behind copy: the hero rendered its caption in the middle of the slide,
   *   directly beneath the H1, and although the layering was right and the
   *   headline painted over it, the caption still showed through the negative
   *   space of the letterforms and read as a rendering fault.
   * `none` — render nothing at all.
   */
  fallback?: 'placeholder' | 'plain' | 'none';
}

/**
 * next/image with a branded fallback. Photography for this site is supplied by
 * the client; until a file lands, the placeholder renders in its place so no
 * layout breaks and no stock or generated image is ever substituted for it.
 *
 * Two guards, in order:
 * 1. Build time — a path under /images/ that is not in the generated image
 *    manifest renders the placeholder straight away, in the server HTML, and
 *    the browser never requests the missing file. See src/lib/images.ts.
 * 2. Run time — a listed file that still fails to load swaps to the same
 *    placeholder through onError.
 */
export function Figure({
  src,
  alt,
  className,
  imageClassName,
  sizes = '100vw',
  priority = false,
  decorative = false,
  placeholderLabel,
  width,
  height,
  fallback = 'placeholder',
}: FigureProps) {
  const [errored, setErrored] = useState(false);
  const failed = errored || !isImageAvailable(src);

  if (failed && fallback === 'none') return null;

  // The wrapper always owns the box; the placeholder fills it absolutely. That
  // keeps a missing photo exactly the same size as a present one.
  if (failed) {
    return (
      <span className={cn('relative block overflow-hidden bg-ink-800', className)}>
        <ImagePlaceholder
          label={fallback === 'plain' ? undefined : (placeholderLabel ?? alt)}
          captioned={fallback !== 'plain'}
          aria-hidden={decorative ? true : undefined}
        />
      </span>
    );
  }

  // Decorative images get an empty alt and are hidden from assistive technology.
  const altText = decorative ? '' : alt;
  const common = {
    src,
    quality: 82,
    priority,
    /*
     * `priority` already preloads and drops loading="lazy", but it does not set
     * fetchpriority — so the LCP image still queues behind whatever the parser
     * found first. Saying it explicitly is the difference between the hero
     * arriving with the page and arriving after it.
     */
    ...(priority ? { fetchPriority: 'high' as const } : { loading: 'lazy' as const }),
    onError: () => setErrored(true),
    className: cn('img-grade object-cover', imageClassName),
    ...(decorative ? { 'aria-hidden': true as const } : {}),
  };

  if (width && height) {
    return (
      <span className={cn('relative block overflow-hidden bg-ink-800', className)}>
        <Image alt={altText} {...common} width={width} height={height} sizes={sizes} />
      </span>
    );
  }

  return (
    <span className={cn('relative block overflow-hidden bg-ink-800', className)}>
      <Image alt={altText} {...common} fill sizes={sizes} />
    </span>
  );
}

/**
 * Branded placeholder — ink field, hairline frame, gold tick and a mono label
 * naming the asset that is missing. Deliberately looks unfinished so a missing
 * photograph is visible during handover rather than quietly shipped.
 */
export function ImagePlaceholder({
  className,
  label,
  captioned = true,
  ...rest
}: {
  className?: string;
  label?: string;
  /** False for full-bleed backdrops, where the caption would sit under copy. */
  captioned?: boolean;
  'aria-hidden'?: boolean;
}) {
  return (
    <span
      className={cn(
        // absolute inset-0 by default: the placeholder fills whatever wrapper
        // sets the aspect ratio rather than defining its own height, which is
        // what made service cards render an oversized dark block.
        'absolute inset-0 flex items-center justify-center overflow-hidden bg-ink-800 p-6 text-center',
        className,
      )}
      {...rest}
    >
      <span className="pointer-events-none absolute inset-3 border border-line-dark" />
      <span className="pointer-events-none absolute left-3 top-3 h-1 w-1 bg-gold" />
      {captioned ? (
        <span
          className="u-mono relative max-w-[32ch] overflow-hidden text-[12px] leading-relaxed text-slate-400"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {label ? `Image pending — ${label}` : 'Image pending'}
        </span>
      ) : null}
    </span>
  );
}

/**
 * Wordmark tile for a client whose logo file has not been supplied. A
 * third-party logo is never invented, redrawn or downloaded.
 */
export function WordmarkTile({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={cn(
        'flex items-center justify-center px-4 text-center font-mono text-[11px] font-medium uppercase leading-tight tracking-[0.12em] text-ink-500',
        className,
      )}
    >
      {name}
    </span>
  );
}

/** Initials tile standing in for a team portrait that has not been supplied. */
export function MonogramTile({ initials, className }: { initials: string; className?: string }) {
  return (
    <span className={cn('flex items-center justify-center bg-ink-900', className)}>
      <span className="font-display text-[clamp(2rem,4vw,3rem)] font-bold tracking-tight text-white/85">
        {initials}
      </span>
    </span>
  );
}
