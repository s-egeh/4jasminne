'use client';

import { useState } from 'react';
import { COMPANY } from '@/data/company';
import { useInView } from '@/lib/use-in-view';
import { cn } from '@/lib/utils';

/**
 * Signature element 1 — the corridor strip. A 44px ink band carrying a slow
 * marquee of route codes in mono type, gold slashes between them. Pauses on
 * hover; static under reduced motion (handled in globals.css).
 *
 * Routes come from data/company.ts, so the client's developer changes them in
 * one place.
 */
export function CorridorStrip({ className }: { className?: string }) {
  const [paused, setPaused] = useState(false);
  const { ref, inView } = useInView<HTMLDivElement>();
  const routes = COMPANY.routes;

  // Three copies so the loop is seamless at any width, shifted by exactly a
  // third. Two copies left a visible gap on wide screens.
  const run = (copy: number) => (
    <span
      key={copy}
      aria-hidden={copy > 0 ? true : undefined}
      className="flex shrink-0 items-center"
    >
      {routes.map((route) => (
        <span key={`${copy}-${route}`} className="flex items-center">
          <span className="u-mono whitespace-nowrap px-6 text-[11px] text-white/70">{route}</span>
          <span aria-hidden="true" className="select-none font-mono text-[12px] text-gold">
            /
          </span>
        </span>
      ))}
    </span>
  );

  return (
    <div
      ref={ref}
      // 36px on a phone, 44 from tablet up: this is a texture band, and at full
      // height it took a disproportionate share of a 360px-wide first screen.
      className={cn('clip-x relative h-9 w-full border-y border-line-dark bg-ink-900 md:h-11', className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/*
        The right padding reserves the fixed action stack's footprint, so a route
        code is never sat on by the WhatsApp button. The mask then fades both
        edges, so no code is ever sliced mid-word.
      */}
      <div
        className="marquee-mask absolute inset-0 flex items-center"
        style={{ paddingRight: 'calc(var(--fab-size) + var(--fab-inset) * 2)' }}
      >
        <div
          className="marquee-track flex w-max animate-marquee-thirds items-center"
          style={{
            // 12s per route keeps it slow enough to read while walking past.
            ['--marquee-duration' as string]: `${routes.length * 12}s`,
            // Off-screen is paused too: nobody can see it, and the frames are not free.
            animationPlayState: paused || !inView ? 'paused' : 'running',
          }}
        >
          {[0, 1, 2].map(run)}
        </div>
      </div>
    </div>
  );
}
