'use client';

import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';

const SESSION_KEY = '4jasmine:preloaded';

/**
 * Logo mark plus a gold wipe from the left, 700ms, once per session.
 * Total under 1.4s and skippable by any keypress or click — nobody should ever
 * wait on decoration.
 */
export function Preloader() {
  const [active, setActive] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const dismiss = useCallback(() => {
    setLeaving(true);
    window.setTimeout(() => {
      setActive(false);
      document.body.classList.remove('is-locked');
    }, 420);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || sessionStorage.getItem(SESSION_KEY)) return;

    sessionStorage.setItem(SESSION_KEY, '1');
    setActive(true);
    document.body.classList.add('is-locked');

    const timer = window.setTimeout(dismiss, 950);
    return () => window.clearTimeout(timer);
  }, [dismiss]);

  useEffect(() => {
    if (!active) return;

    const skip = () => dismiss();
    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);
    return () => {
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
    };
  }, [active, dismiss]);

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center bg-ink-900 transition-opacity duration-base ease-out-expo',
        leaving && 'pointer-events-none opacity-0',
      )}
    >
      <div className="relative overflow-hidden px-6 py-4">
        <Logo variant="mark" priority className="h-16 opacity-90" />
        <span
          className="absolute inset-0 origin-left bg-gold"
          style={{ animation: 'site-wipe 700ms cubic-bezier(0.65, 0, 0.35, 1) forwards' }}
        />
      </div>

      <style jsx global>{`
        @keyframes site-wipe {
          0% {
            transform: scaleX(0);
            transform-origin: left;
          }
          50% {
            transform: scaleX(1);
            transform-origin: left;
          }
          51% {
            transform: scaleX(1);
            transform-origin: right;
          }
          100% {
            transform: scaleX(0);
            transform-origin: right;
          }
        }
      `}</style>
    </div>
  );
}
