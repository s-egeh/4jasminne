'use client';

import {
  createElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ElementType,
} from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from './use-reduced-motion';

interface TextMaskProps {
  text: string;
  className?: string;
  as?: ElementType;
  delay?: number;
  /** Set false to animate on mount rather than on scroll (hero H1s). */
  onScroll?: boolean;
  id?: string;
}

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Line-mask reveal. Lines are measured from the real rendered text and rise out
 * of a clipped container.
 *
 * Deliberately split by LINE, not by character — per-character stagger on every
 * heading is the loudest tell that a page was generated rather than designed.
 * Reserved for H1s and section H2s only.
 *
 * The server renders plain text, so the heading is complete for crawlers and for
 * users without JavaScript; measurement happens before first paint after
 * hydration, so there is no flash.
 */
export function TextMask({
  text,
  className,
  as: Tag = 'span',
  delay = 0,
  onScroll = true,
  id,
}: TextMaskProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [lines, setLines] = useState<string[] | null>(null);
  const [shown, setShown] = useState(false);
  const reduced = useReducedMotion();

  const measure = useCallback(() => {
    const node = containerRef.current;
    if (!node) return;

    // Lay the words out as inline-blocks and group them by vertical offset.
    const probe = document.createElement('span');
    probe.style.cssText = 'visibility:hidden;position:absolute;display:block;';
    probe.style.width = `${node.clientWidth}px`;

    const computed = window.getComputedStyle(node);
    probe.style.font = computed.font;
    probe.style.fontSize = computed.fontSize;
    probe.style.fontFamily = computed.fontFamily;
    probe.style.fontWeight = computed.fontWeight;
    probe.style.lineHeight = computed.lineHeight;
    probe.style.letterSpacing = computed.letterSpacing;
    probe.style.textTransform = computed.textTransform;

    const words = text.split(' ');
    probe.innerHTML = words.map((word) => `<span style="display:inline-block">${word}</span>`).join(' ');
    node.appendChild(probe);

    const spans = Array.from(probe.querySelectorAll('span'));
    const grouped: string[] = [];
    let currentTop: number | null = null;

    spans.forEach((span, index) => {
      const top = (span as HTMLElement).offsetTop;
      if (currentTop === null || top !== currentTop) {
        currentTop = top;
        grouped.push(words[index]);
      } else {
        grouped[grouped.length - 1] += ` ${words[index]}`;
      }
    });

    node.removeChild(probe);
    setLines(grouped.length > 0 ? grouped : [text]);
  }, [text]);

  useIsomorphicLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    let frame = 0;
    const onResize = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(measure);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
    };
  }, [measure]);

  useEffect(() => {
    if (!onScroll) {
      setShown(true);
      return;
    }

    const node = containerRef.current;
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
  }, [onScroll]);

  // Pre-measurement (and no-JS) render: the real text, unstyled by the mask.
  if (!lines) {
    return createElement(Tag, { ref: containerRef, className, id }, text);
  }

  return createElement(
    Tag,
    { ref: containerRef, className: cn('block', className), id },
    lines.map((line, index) => (
      <span key={`${line}-${index}`} className="block overflow-hidden">
        <span
          className="block"
          style={{
            transform: reduced ? 'none' : shown ? 'translate3d(0, 0, 0)' : 'translate3d(0, 105%, 0)',
            opacity: reduced ? (shown ? 1 : 0) : 1,
            transition: reduced
              ? 'opacity 150ms linear'
              : `transform 900ms cubic-bezier(0.16, 1, 0.3, 1) ${delay + index * 70}ms`,
          }}
        >
          {line}
        </span>
      </span>
    )),
  );
}
