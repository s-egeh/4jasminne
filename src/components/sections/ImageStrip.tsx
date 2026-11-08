'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { Figure } from '@/components/ui/Media';
import { isImageAvailable } from '@/lib/images';

// The lightbox is ~40KB and most visitors never open it.
const Lightbox = dynamic(() => import('@/components/ui/Lightbox'), { ssr: false });

export interface StripImage {
  src: string;
  alt: string;
  caption?: string;
}

/** Three-image row that opens in the lightbox. Used on service detail pages. */
export function ImageStrip({ images }: { images: StripImage[] }) {
  const [openAt, setOpenAt] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {images.map((image, index) =>
          // Until the photograph is supplied the tile is a placeholder, not a
          // button: there is nothing behind it to open.
          !isImageAvailable(image.src) ? (
            <Reveal key={image.src} delay={index * 70}>
              <Figure src={image.src} alt={image.alt} className="aspect-card w-full" />
            </Reveal>
          ) : (
          <Reveal key={image.src} delay={index * 70}>
            <button
              type="button"
              onClick={() => setOpenAt(index)}
              className="group relative block w-full overflow-hidden"
              aria-label={`Open image: ${image.alt}`}
            >
              <Figure
                src={image.src}
                alt={image.alt}
                className="aspect-card w-full"
                imageClassName="h-full w-full transition-transform duration-base ease-out-expo group-hover:scale-[1.04]"
                sizes="(min-width: 640px) 33vw, 100vw"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink-900/0 transition-colors duration-fast group-hover:bg-ink-900/45"
              >
                <Plus
                  strokeWidth={1.5}
                  className="h-7 w-7 text-white opacity-0 transition-opacity duration-fast group-hover:opacity-100"
                />
              </span>
            </button>
          </Reveal>
          ),
        )}
      </div>

      {openAt !== null ? (
        <Lightbox slides={images} index={openAt} onClose={() => setOpenAt(null)} />
      ) : null}
    </>
  );
}
