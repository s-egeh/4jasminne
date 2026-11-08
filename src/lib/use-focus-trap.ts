'use client';

import { useEffect, type RefObject } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, details, [tabindex]:not([tabindex="-1"])';

/**
 * Traps Tab inside a container while it is open, moves focus in on open and
 * returns it to the trigger on close. Used by the mobile drawer, the bio modal
 * and the lightbox wrapper.
 */
export function useFocusTrap(ref: RefObject<HTMLElement>, active: boolean, onClose?: () => void) {
  useEffect(() => {
    if (!active) return;

    const container = ref.current;
    if (!container) return;

    const previous = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (node) => node.offsetParent !== null || node === document.activeElement,
      );

    const first = focusables()[0];
    (first ?? container).focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose?.();
        return;
      }

      if (event.key !== 'Tab') return;

      const nodes = focusables();
      if (nodes.length === 0) {
        event.preventDefault();
        return;
      }

      const firstNode = nodes[0];
      const lastNode = nodes[nodes.length - 1];

      if (event.shiftKey && document.activeElement === firstNode) {
        event.preventDefault();
        lastNode.focus();
      } else if (!event.shiftKey && document.activeElement === lastNode) {
        event.preventDefault();
        firstNode.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previous?.focus({ preventScroll: true });
    };
  }, [active, onClose, ref]);
}

/**
 * Locks body scroll while an overlay is open, without losing the reader's place.
 *
 * `overflow: hidden` alone is not enough on iOS Safari: the page keeps its
 * scroll offset but the rubber-band gesture still moves the document behind the
 * overlay, and closing it can leave the reader somewhere they never scrolled to.
 * Pinning the body at `top: -scrollY` freezes it exactly where it was, and the
 * offset is restored on release.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const { body } = document;
    const y = window.scrollY;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };

    body.classList.add('is-locked');
    body.style.position = 'fixed';
    body.style.top = `${-y}px`;
    body.style.width = '100%';

    return () => {
      body.classList.remove('is-locked');
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      /*
       * `instant`, not `auto`. This site sets `scroll-behavior: smooth` on
       * <html>, and `auto` means "defer to the CSS" — so the restore animated
       * back to the reader's position instead of putting them there, which
       * looks exactly like the page scrolling itself after they closed a menu.
       * `instant` is the only value that overrides the stylesheet.
       */
      window.scrollTo({ top: y, behavior: 'instant' });
    };
  }, [active]);
}
