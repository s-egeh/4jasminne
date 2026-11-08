'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';

/**
 * Lenis smooth scroll, lerp 0.09.
 *
 * NOTE: `@studio-freight/lenis` was renamed by its
 * authors to `lenis` and the old name is deprecated. Same library, current name.
 *
 * Disabled entirely on coarse pointers (native momentum scrolling on phones is
 * better than anything we can synthesise) and under reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (coarse || reduced) return;

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      smoothWheel: true,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = window.requestAnimationFrame(raf);
    };
    frame = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
