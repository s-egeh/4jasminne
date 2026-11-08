'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from './use-reduced-motion';

/**
 * A 1px vertical gold line whose stroke-dashoffset is tied to scroll progress
 * through its container. This is the lead animation for the strategic-pillars
 * section — nothing else in that section moves.
 *
 * Under reduced motion the line is simply drawn in full from the start.
 */
export function ScrollDrawLine({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setProgress(1);
      return;
    }

    const node = ref.current;
    if (!node) return;

    let frame = 0;
    let visible = false;

    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight;
      // 0 when the top of the list reaches the lower third of the viewport,
      // 1 when the bottom of the list passes the same point.
      const anchor = viewport * 0.66;
      const travelled = anchor - rect.top;
      setProgress(Math.max(0, Math.min(1, travelled / Math.max(rect.height, 1))));
    };

    const onScroll = () => {
      if (!visible || frame) return;
      frame = window.requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visible = entry.isIntersecting;
          if (visible) update();
        });
      },
      { rootMargin: '20% 0px' },
    );

    observer.observe(node);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduced]);

  return (
    <div ref={ref} aria-hidden="true" className={cn('pointer-events-none', className)}>
      <svg
        viewBox="0 0 1 100"
        preserveAspectRatio="none"
        fill="none"
        className="h-full w-px overflow-visible"
      >
        <line
          x1="0.5"
          y1="0"
          x2="0.5"
          y2="100"
          stroke="var(--gold)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          strokeDasharray="100"
          strokeDashoffset={100 * (1 - progress)}
        />
      </svg>
    </div>
  );
}
