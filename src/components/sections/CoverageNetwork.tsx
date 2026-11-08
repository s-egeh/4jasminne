'use client';

import { useState } from 'react';
import { CORRIDORS, PLACES, corridorId } from '@/data/coverage';
import { CoverageMap } from './CoverageMap';

/**
 * The map and the corridor list, side by side at 1024 and above.
 *
 * They live in one component because they share a hover: pointing at a route in
 * the list brightens its line on the map and dims the others. The list is the
 * authoritative content — it carries origin, destination and what runs on each
 * corridor — and the map illustrates it. A reader who never sees the map, or
 * who uses a screen reader, loses nothing.
 *
 * The highlight is pointer-only and needs no touch equivalent: on a phone the
 * two stack, and the list already says everything the highlight would reveal.
 */
export function CoverageNetwork() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 items-center gap-x-8 gap-y-12 lg:grid-cols-12">
      <div className="lg:col-span-6">
        <CoverageMap activeCorridor={active} />
      </div>

      <div className="lg:col-span-6">
        <ul className="border-t border-line-dark">
          {CORRIDORS.map((corridor) => {
            const id = corridorId(corridor);
            const from = PLACES[corridor.from];
            const to = PLACES[corridor.to];
            const dimmed = active !== null && active !== id;

            return (
              <li
                key={id}
                onPointerEnter={(event) => {
                  if (event.pointerType === 'mouse') setActive(id);
                }}
                onPointerLeave={() => setActive(null)}
                className="border-b border-line-dark py-5 transition-opacity duration-fast"
                style={{ opacity: dimmed ? 0.55 : 1 }}
              >
                <p className="flex flex-wrap items-center gap-2 u-mono text-[11px] text-white">
                  <span>{from.label.toUpperCase()}</span>
                  <span aria-hidden="true" className="text-gold">
                    &rarr;
                  </span>
                  <span>{to.label.toUpperCase()}</span>
                  {to.crossBorder ? (
                    <span className="border border-line-dark px-2 py-0.5 text-[9px] text-slate-400">
                      CROSS-BORDER
                    </span>
                  ) : null}
                </p>
                <p className="mt-2 max-w-measure t-small text-slate-400">{corridor.note}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
