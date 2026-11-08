'use client';

import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useReducedMotion } from '@/components/motion/use-reduced-motion';
import { FleetCard } from '@/components/ui/Card';
import { FLEET, FLEET_FILTERS, type FleetCategory, type FleetUnit } from '@/data/fleet';
import { isImageAvailable } from '@/lib/images';
import { cn } from '@/lib/utils';

const Lightbox = dynamic(() => import('@/components/ui/Lightbox'), { ssr: false });

export function FleetFilterGrid() {
  const [filter, setFilter] = useState<FleetCategory | 'all'>('all');
  const [openUnit, setOpenUnit] = useState<FleetUnit | null>(null);
  const reduced = useReducedMotion();

  const visible = filter === 'all' ? FLEET : FLEET.filter((unit) => unit.category === filter);

  return (
    <>
      <div role="group" aria-label="Filter fleet by category" className="flex flex-wrap gap-2">
        {FLEET_FILTERS.map((option) => {
          const active = option.value === filter;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
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

      <motion.div layout={!reduced} className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((unit) => (
            <motion.div
              key={unit.slug}
              layout={!reduced}
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
              transition={{ duration: reduced ? 0.15 : 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <FleetCard
                name={unit.name}
                summary={unit.summary}
                image={unit.image}
                imageAlt={unit.imageAlt}
                specs={unit.specs}
                // Only offered once at least one photograph of the unit exists.
                onOpen={
                  unit.gallery.some((slide) => isImageAvailable(slide.src))
                    ? () => setOpenUnit(unit)
                    : undefined
                }
                className="h-full"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {visible.length === 0 ? (
        <p className="mt-12 u-mono text-[11px] text-slate-600">No units in this category.</p>
      ) : null}

      {openUnit ? (
        <Lightbox slides={openUnit.gallery} index={0} onClose={() => setOpenUnit(null)} />
      ) : null}
    </>
  );
}
