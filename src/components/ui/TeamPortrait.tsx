'use client';

import Image from 'next/image';
import { useState } from 'react';
import { isImageAvailable } from '@/lib/images';
import { cn } from '@/lib/utils';
import { MonogramTile } from './Media';

/**
 * 4:5 portrait, greyscale restoring to full colour on hover over 420ms.
 *
 * When a photograph has not been supplied the fallback is a monogram tile —
 * never a stock photograph of a stranger, never a generated face, standing in
 * for a real named person.
 */
export function TeamPortrait({
  src,
  alt,
  initials,
  className,
  sizes = '(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw',
  greyscale = true,
}: {
  src: string;
  alt: string;
  initials: string;
  className?: string;
  sizes?: string;
  greyscale?: boolean;
}) {
  const [errored, setErrored] = useState(false);
  // Not in the build-time image manifest: monogram straight away, no request.
  const failed = errored || !isImageAvailable(src);

  return (
    <span className={cn('relative block overflow-hidden bg-ink-900', className)}>
      {failed ? (
        <MonogramTile initials={initials} className="absolute inset-0 h-full w-full" />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          quality={82}
          onError={() => setErrored(true)}
          className={cn(
            'img-grade object-cover transition-[filter,transform] duration-[420ms] ease-out-expo',
            greyscale && 'grayscale group-hover:grayscale-0',
          )}
        />
      )}
    </span>
  );
}
