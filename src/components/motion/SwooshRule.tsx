'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from './use-reduced-motion';

interface SwooshRuleProps {
  className?: string;
}

/*
 * Signature element 2 — the swoosh rule.
 *
 * Redrawn: the first version drew two separate paths that met at an angle, and
 * with square linecaps and independent dash animations they read as a stray
 * stub plus a disconnected scratch rather than one device.
 *
 * This is one continuous 72px path — flat, a shallow 8px kick, flat again —
 * drawn twice: gold over the first 28px, the deeper --gold-d over the
 * remainder, both with round caps and joins so the segments touch with no seam.
 * They animate as a single gesture: the gold leads, the darker gold follows it
 * out of the bend. The 4Jasmine Dr palette has no second accent, so the two
 * steps are both gold; --gold-d holds at least 3.4:1 on bone and on ink.
 */

// Path length, measured off the geometry below. Used for the dash animation so
// no getTotalLength() read is needed at runtime.
const PATH_LENGTH = 74;
const GOLD_END = 28;

const PATH = 'M1 15 H18 L30 5 H71';

export function SwooshRule({ className }: SwooshRuleProps) {
  const ref = useRef<SVGSVGElement | null>(null);
  const [shown, setShown] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const drawn = reduced || shown;

  return (
    <svg
      ref={ref}
      viewBox="0 0 72 20"
      width="72"
      height="20"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn('block', className)}
    >
      {/* The darker gold runs the whole path and is overdrawn by the gold lead,
          so the two steps share a single joint rather than meeting at a gap. */}
      <path
        d={PATH}
        stroke="var(--gold-d)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: PATH_LENGTH,
          strokeDashoffset: drawn ? 0 : PATH_LENGTH,
          transition: reduced ? 'none' : 'stroke-dashoffset 700ms cubic-bezier(0.16, 1, 0.3, 1) 120ms',
        }}
      />
      <path
        d={PATH}
        stroke="var(--gold)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          // Draw only the first 28px of the shared path.
          strokeDasharray: `${GOLD_END} ${PATH_LENGTH}`,
          strokeDashoffset: drawn ? 0 : GOLD_END,
          transition: reduced ? 'none' : 'stroke-dashoffset 420ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />
    </svg>
  );
}
