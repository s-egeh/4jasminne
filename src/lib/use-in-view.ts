'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Reports whether an element is on screen, and keeps reporting — unlike the
 * once-only observer behind Reveal.
 *
 * Used to stop the marquees animating while they are scrolled out of view. A
 * CSS transform animation is cheap but not free: two of them running on a long
 * page cost main-thread time on every frame for something nobody can see, which
 * shows up directly in INP on a mid-range Android.
 *
 * Starts true so the content is never wrong before the observer's first
 * callback, and on the server.
 */
export function useInView<T extends HTMLElement>(rootMargin = '200px') {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}
