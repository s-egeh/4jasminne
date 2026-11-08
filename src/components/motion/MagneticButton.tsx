'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useCoarsePointer, useReducedMotion } from './use-reduced-motion';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  /** Maximum displacement in px. Capped at 6 by the design system. */
  strength?: number;
}

/**
 * Applied to the two hero CTAs only. Off on touch and under reduced motion.
 * Wraps its child rather than replacing it, so the button keeps its own focus,
 * hover and disabled behaviour.
 */
export function MagneticButton({ children, className, strength = 6 }: MagneticButtonProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();

  useEffect(() => {
    if (reduced || coarse) return;

    const node = ref.current;
    if (!node) return;

    const capped = Math.min(strength, 6);

    const onMove = (event: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      node.style.transform = `translate3d(${(x * capped).toFixed(2)}px, ${(y * capped).toFixed(2)}px, 0)`;
    };

    const onLeave = () => {
      node.style.transform = 'translate3d(0, 0, 0)';
    };

    node.addEventListener('mousemove', onMove);
    node.addEventListener('mouseleave', onLeave);
    return () => {
      node.removeEventListener('mousemove', onMove);
      node.removeEventListener('mouseleave', onLeave);
      node.style.transform = '';
    };
  }, [coarse, reduced, strength]);

  return (
    <span
      ref={ref}
      className={cn('inline-block transition-transform duration-fast ease-out-expo', className)}
    >
      {children}
    </span>
  );
}
