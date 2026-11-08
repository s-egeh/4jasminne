'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Ink panel wipe on route change — 420ms out, 420ms in. Deliberately fast:
 * nobody should ever wait for decoration. Skipped under reduced motion.
 */
export function PageTransition() {
  const pathname = usePathname();
  const previous = useRef(pathname);
  const [state, setState] = useState<'idle' | 'in' | 'out'>('idle');

  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    setState('in');
    const outTimer = window.setTimeout(() => setState('out'), 420);
    const idleTimer = window.setTimeout(() => setState('idle'), 860);

    return () => {
      window.clearTimeout(outTimer);
      window.clearTimeout(idleTimer);
    };
  }, [pathname]);

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none fixed inset-0 z-transition bg-ink-900',
        state === 'idle' && 'invisible',
      )}
      style={{
        transform:
          state === 'in'
            ? 'translate3d(0, 0, 0)'
            : state === 'out'
              ? 'translate3d(100%, 0, 0)'
              : 'translate3d(-100%, 0, 0)',
        transition: state === 'idle' ? 'none' : 'transform 420ms cubic-bezier(0.65, 0, 0.35, 1)',
      }}
    />
  );
}
