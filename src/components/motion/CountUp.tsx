'use client';

import { useEffect, useRef, useState } from 'react';
import ReactCountUp from 'react-countup';
import { cn } from '@/lib/utils';
import { useReducedMotion } from './use-reduced-motion';

interface CountUpProps {
  end: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  decimals?: number;
}

/** Counts once on entry, 1.6s, ease-out. Under reduced motion the final value is printed. */
export function CountUp({ end, suffix = '', prefix = '', className, decimals = 0 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [start, setStart] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStart(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (reduced) {
    return (
      <span ref={ref} className={cn(className)}>
        {prefix}
        {end.toFixed(decimals)}
        {suffix}
      </span>
    );
  }

  return (
    <span ref={ref} className={cn(className)}>
      {start ? (
        <ReactCountUp
          end={end}
          duration={1.6}
          decimals={decimals}
          prefix={prefix}
          suffix={suffix}
          useEasing
        />
      ) : (
        <>
          {prefix}
          {(0).toFixed(decimals)}
          {suffix}
        </>
      )}
    </span>
  );
}
