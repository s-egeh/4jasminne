'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from './use-reduced-motion';

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Milliseconds. Kept under stagger x 6 by the callers. */
  delay?: number;
  /** 24px is the system default; never above 32px. */
  distance?: number;
  direction?: 'up' | 'left' | 'right';
}

/**
 * Scroll reveal — IntersectionObserver, threshold 0.15, once only.
 * Never re-animates on scroll back up; under reduced motion it is a 150ms fade.
 */
export function Reveal({
  children,
  className,
  as: Tag = 'div',
  delay = 0,
  distance = 24,
  direction = 'up',
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
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

  const hidden =
    direction === 'up'
      ? `translate3d(0, ${distance}px, 0)`
      : direction === 'left'
        ? `translate3d(-${distance}px, 0, 0)`
        : `translate3d(${distance}px, 0, 0)`;

  return (
    <Tag
      ref={ref as never}
      className={cn('will-change-[opacity,transform]', className)}
      style={{
        opacity: shown ? 1 : 0,
        transform: reduced ? 'none' : shown ? 'translate3d(0, 0, 0)' : hidden,
        transition: reduced
          ? 'opacity 150ms linear'
          : `opacity 420ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 420ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}
