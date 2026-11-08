'use client';

import { Play, Plus } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Figure } from '@/components/ui/Media';
import { GALLERY, GALLERY_FILTERS, GALLERY_PAGE_SIZE, type GalleryFilter } from '@/data/gallery';
import { isImageAvailable } from '@/lib/images';
import { cn } from '@/lib/utils';

const Lightbox = dynamic(() => import('@/components/ui/Lightbox'), { ssr: false });

export function GalleryGrid() {
  const params = useSearchParams();
  const initial = (params.get('filter') as GalleryFilter | null) ?? 'all';

  const [filter, setFilter] = useState<GalleryFilter | 'all'>(
    GALLERY_FILTERS.some((option) => option.value === initial) ? initial : 'all',
  );
  const [shown, setShown] = useState(GALLERY_PAGE_SIZE);
  const [openAt, setOpenAt] = useState<number | null>(null);

  const filtered = useMemo(
    () => (filter === 'all' ? GALLERY : GALLERY.filter((item) => item.category === filter)),
    [filter],
  );

  const visible = filtered.slice(0, shown);

  const changeFilter = (value: GalleryFilter | 'all') => {
    setFilter(value);
    setShown(GALLERY_PAGE_SIZE);
  };

  return (
    <>
      <div role="group" aria-label="Filter gallery" className="flex flex-wrap gap-2">
        {GALLERY_FILTERS.map((option) => {
          const active = option.value === filter;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => changeFilter(option.value)}
              aria-pressed={active}
              className={cn(
                'inline-flex min-h-11 items-center border px-4 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] transition-colors duration-fast',
                active
                  ? 'border-ink-900 bg-ink-900 text-white'
                  : 'border-line text-slate-600 hover:border-ink-900 hover:text-ink-900',
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="masonry mt-12">
        {visible.map((item, index) =>
          // A slot whose photograph has not been supplied is a placeholder,
          // not a button: there is nothing behind it to open.
          !item.video && !isImageAvailable(item.src) ? (
            <div key={item.src} className="relative block w-full overflow-hidden">
              <Figure
                src={item.src}
                alt={item.alt}
                className={cn('w-full', item.ratio === 'portrait' ? 'aspect-portrait' : 'aspect-card')}
              />
            </div>
          ) : (
          <button
            key={item.src}
            type="button"
            onClick={() => setOpenAt(index)}
            aria-label={`Open image: ${item.alt}`}
            className="group relative block w-full overflow-hidden"
          >
            <Figure
              src={item.src}
              alt={item.alt}
              className={cn('w-full', item.ratio === 'portrait' ? 'aspect-portrait' : 'aspect-card')}
              imageClassName="h-full w-full transition-transform duration-base ease-out-expo group-hover:scale-[1.04]"
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            />

            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink-900/0 transition-colors duration-fast group-hover:bg-ink-900/45"
            >
              {item.video ? (
                <Play strokeWidth={1.5} className="h-8 w-8 text-white opacity-90" />
              ) : (
                <Plus
                  strokeWidth={1.5}
                  className="h-7 w-7 text-white opacity-0 transition-opacity duration-fast group-hover:opacity-100"
                />
              )}
            </span>

            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink-900/85 to-transparent p-4 text-left font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-white opacity-0 transition-[opacity,transform] duration-fast group-hover:translate-y-0 group-hover:opacity-100"
            >
              {item.caption}
            </span>
          </button>
          ),
        )}
      </div>

      {/* Load more, not infinite scroll — the footer has to stay reachable. */}
      {shown < filtered.length ? (
        <div className="mt-12 flex justify-center">
          <Button
            variant="secondary-light"
            size="lg"
            onClick={() => setShown((value) => value + GALLERY_PAGE_SIZE)}
          >
            Load more
          </Button>
        </div>
      ) : null}

      {openAt !== null ? (
        <Lightbox
          slides={visible.map((item) => ({
            src: item.src,
            alt: item.alt,
            caption: item.caption,
            video: item.video,
          }))}
          index={openAt}
          onClose={() => setOpenAt(null)}
        />
      ) : null}
    </>
  );
}
