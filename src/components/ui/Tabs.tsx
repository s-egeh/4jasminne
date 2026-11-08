'use client';

import { useId, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  panel: ReactNode;
}

/**
 * WAI-ARIA tabs with arrow-key navigation. The active indicator is a gold
 * underline that slides between items rather than snapping.
 */
export function Tabs({ items, className }: { items: TabItem[]; className?: string }) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = items.length - 1;
    let next: number | null = null;

    if (event.key === 'ArrowRight') next = active === last ? 0 : active + 1;
    if (event.key === 'ArrowLeft') next = active === 0 ? last : active - 1;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = last;

    if (next !== null) {
      event.preventDefault();
      setActive(next);
      tabsRef.current[next]?.focus();
    }
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label="Nature of business"
        onKeyDown={onKeyDown}
        className="relative flex flex-wrap gap-x-8 gap-y-3 border-b border-line"
      >
        {items.map((item, index) => {
          const selected = index === active;
          return (
            <button
              key={item.id}
              ref={(node) => {
                tabsRef.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              className={cn(
                'relative -mb-px flex min-h-11 items-center pb-4 font-mono text-[12px] font-medium uppercase tracking-[0.12em] transition-colors duration-fast',
                selected ? 'text-ink-900' : 'text-slate-600 hover:text-ink-900',
              )}
            >
              {item.label}
              <span
                aria-hidden="true"
                className={cn(
                  'absolute bottom-0 left-0 h-0.5 bg-gold transition-[width] duration-base ease-out-expo',
                  selected ? 'w-full' : 'w-0',
                )}
              />
            </button>
          );
        })}
      </div>

      {items.map((item, index) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${baseId}-panel-${item.id}`}
          aria-labelledby={`${baseId}-tab-${item.id}`}
          hidden={index !== active}
          tabIndex={0}
          className="pt-10 focus-visible:outline-offset-8"
        >
          {item.panel}
        </div>
      ))}
    </div>
  );
}
