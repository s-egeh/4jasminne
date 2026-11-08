'use client';

import { ArrowUp, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { trackEvent } from '@/components/layout/Analytics';
import { cn, whatsappHref } from '@/lib/utils';

/*
 * A single fixed stack, so nothing can overlap anything else.
 *
 * column-reverse puts WhatsApp at the bottom of the visual stack and
 * back-to-top above it, while keeping WhatsApp first in DOM order — it is the
 * more important of the two, and a keyboard user should reach it first.
 *
 * Both buttons are 48px, matching --fab-size. Anything that must stay clear of
 * this stack (the hero slider arrows, the corridor strip) reserves space from
 * the same variables rather than guessing.
 */

const BUTTON = 48;
const RING_RADIUS = 22;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function FloatingActions() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0);
      setVisible(window.scrollY > 600);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const toTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    /*
     * `smooth` here, deliberately: this is a journey the reader asked for, and
     * the travel is what tells them the page moved rather than reloaded.
     * `instant` under reduced motion, not `auto` — `auto` defers to
     * `scroll-behavior: smooth` on <html>, so it would animate anyway, which is
     * the exact thing the preference asks us not to do.
     */
    window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' });
  };

  return (
    <div
      className="no-print pointer-events-none fixed z-50 flex flex-col-reverse items-center gap-3"
      style={{
        right: 'var(--fab-inset)',
        // Clears the iOS home indicator. With viewport-fit=cover the inset is a
        // real number on notched devices and 0 everywhere else, so this is the
        // same 16/24px anywhere it does not apply.
        bottom: 'calc(var(--fab-inset) + env(safe-area-inset-bottom))',
      }}
    >
      <a
        href={whatsappHref()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onClick={() => trackEvent('whatsapp_click', { source: 'fab' })}
        className="group pointer-events-auto relative inline-flex items-center justify-center bg-whatsapp text-white transition-transform duration-fast ease-out-expo hover:scale-[1.06]"
        style={{ width: BUTTON, height: BUTTON }}
      >
        <MessageCircle aria-hidden="true" strokeWidth={1.5} className="h-6 w-6" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap border border-line-dark bg-ink-900 px-3 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-white opacity-0 transition-opacity duration-fast group-hover:opacity-100 lg:block"
        >
          Chat on WhatsApp
        </span>
      </a>

      <button
        type="button"
        onClick={toTop}
        aria-label="Back to top"
        className={cn(
          'pointer-events-auto relative inline-flex items-center justify-center border border-line-dark bg-ink-900 text-white transition-[opacity,transform,background-color] duration-base ease-out-expo hover:bg-ink-800',
          visible ? 'opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
        )}
        style={{ width: BUTTON, height: BUTTON }}
      >
        {/*
          The ring is a SCROLL PROGRESS indicator. It is an arc on purpose and
          only closes into a full circle at the bottom of the page — an
          incomplete ring part-way down a page is the feature, not a clipping
          bug.

          What was wrong: the svg carried width/height attributes of 48 while
          `inset-0` anchored it to the button's PADDING box, which is 46px
          because the 1px border is inside the border-box. Over-constrained, the
          browser kept the 48px width and dropped `right`, so the ring sat one
          pixel down and right of the arrow it circles and overhung the button
          on two sides. Dropping the attributes lets `h-full w-full` size the svg
          to the padding box, and the viewBox scales the circle to match — so the
          ring is concentric with the button at any size.
        */}
        <svg
          aria-hidden="true"
          viewBox="0 0 48 48"
          fill="none"
          className="absolute inset-0 h-full w-full"
        >
          <circle
            cx="24"
            cy="24"
            r={RING_RADIUS}
            stroke="var(--gold)"
            strokeWidth="1.5"
            strokeLinecap="butt"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress)}
            /* Fills clockwise from 12 o'clock. */
            transform="rotate(-90 24 24)"
            className="transition-[stroke-dashoffset] duration-fast ease-out-expo"
          />
        </svg>
        <ArrowUp aria-hidden="true" strokeWidth={1.5} className="relative h-[18px] w-[18px]" />
      </button>
    </div>
  );
}
