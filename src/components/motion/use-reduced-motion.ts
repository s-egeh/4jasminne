'use client';

import { useEffect, useState } from 'react';

/**
 * Single source of truth for reduced-motion across the site. Every motion
 * primitive reads this — CSS handles the rest in globals.css. Returns false on
 * the server so the first paint never assumes motion is unwanted, then corrects
 * on mount before any animation has a chance to run.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/** True on touch devices, where magnetic buttons and Lenis are disabled. */
export function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(pointer: coarse)');
    setCoarse(query.matches);

    const onChange = (event: MediaQueryListEvent) => setCoarse(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return coarse;
}
