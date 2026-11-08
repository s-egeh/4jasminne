'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from './use-reduced-motion';

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** Fraction of element height to translate across the full scroll pass. Max 0.08. */
  amount?: number;
}

/**
 * Section background parallax — the only parallax on the site besides the hero
 * Ken Burns. Capped at 8% translation; anything more reads as a template effect.
 */
export function Parallax({ children, className, amount = 0.08 }: ParallaxProps) {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const capped = Math.min(Math.abs(amount), 0.08);
    let frame = 0;
    let visible = false;

    const update = () => {
      frame = 0;
      const rect = outer.getBoundingClientRect();
      const viewport = window.innerHeight;
      // -1 when the element is just below the fold, +1 when it has just left the top.
      const progress = (viewport / 2 - (rect.top + rect.height / 2)) / (viewport / 2 + rect.height / 2);
      const offset = progress * capped * rect.height;
      inner.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      if (!visible || frame) return;
      frame = window.requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visible = entry.isIntersecting;
          if (visible) onScroll();
        });
      },
      { rootMargin: '10% 0px' },
    );

    observer.observe(outer);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [amount, reduced]);

  return (
    <div ref={outerRef} className={cn('overflow-hidden', className)}>
      <div ref={innerRef} className="h-[112%] w-full will-change-transform">
        {children}
      </div>
    </div>
  );
}
