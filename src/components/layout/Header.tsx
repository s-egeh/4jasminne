'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { COMPANY } from '@/data/company';
import { NAV } from '@/data/nav';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import { MegaMenu } from './MegaMenu';
import { MobileDrawer } from './MobileDrawer';
import { TopBar } from './TopBar';

/*
 * Hover intent.
 *
 * OPEN_DELAY stops a panel flashing open as the pointer sweeps across the nav
 * on its way somewhere else. CLOSE_DELAY is the grace period: without it, any
 * pointer that clips the edge of a nav item mid-travel closes the menu
 * instantly, which is the failure this pass exists to fix. Neither leave
 * handler is allowed to close the menu synchronously.
 *
 * CLOSE_DELAY_APPROACHING extends the grace when the pointer is descending
 * towards the open panel — the "safe triangle". It is what makes a diagonal
 * move to the far corner of the panel survive a pass over a neighbouring
 * trigger.
 */
const OPEN_DELAY = 120;
const CLOSE_DELAY = 280;
const CLOSE_DELAY_APPROACHING = 500;

/** Scrolling this far with a panel open closes it. */
const SCROLL_CLOSE_PX = 40;

const menuId = (href: string) => `mega-${href.replace(/\W/g, '')}`;

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [coarsePointer, setCoarsePointer] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  /*
   * One timer. Whatever is pending — an open or a close — is cancelled by the
   * next intent, which is the whole point: the two can never race.
   */
  const timer = useRef<number>();
  /** Read inside the timer callback, so switching panels does not need a re-render first. */
  const openRef = useRef<string | null>(null);
  const pointer = useRef({ y: 0, dy: 0 });
  /** Set when a panel is opened from the keyboard, so focus follows it in. */
  const focusIntent = useRef<string | null>(null);
  /** True between an Enter/Space keydown and the click the browser derives from it. */
  const keyActivated = useRef(false);

  /*
   * There is no light header variant. The header is transparent over the
   * homepage hero and solid ink everywhere else — inner page heroes are dark
   * photography too, so a light state would never have anywhere legible to sit.
   * That is what made the white wordmark vanish over the bone sections.
   */
  const isHome = pathname === '/';
  const solid = scrolled || !isHome || openMenu !== null;

  openRef.current = openMenu;

  /*
   * Exactly one nav item carries the active underline. Longest match wins, so
   * /services/freight-haulage lights Services and nothing else, and a child route
   * such as /team lights About through its dropdown without also lighting a
   * second item.
   */
  const activeHref = (() => {
    let best: { href: string; score: number } | null = null;
    for (const item of NAV) {
      const candidates = [item.href, ...(item.children?.map((child) => child.href) ?? [])];
      for (const href of candidates) {
        const match = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
        if (match && (!best || href.length > best.score)) best = { href: item.href, score: href.length };
      }
    }
    return best?.href ?? null;
  })();

  useEffect(() => {
    const query = window.matchMedia('(pointer: coarse)');
    const sync = () => setCoarsePointer(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  const closeNow = useCallback(() => {
    window.clearTimeout(timer.current);
    setOpenMenu(null);
  }, []);

  const requestOpen = useCallback((key: string) => {
    window.clearTimeout(timer.current);
    // A panel is already open: switch to the neighbour immediately, with no
    // intermediate closed state to flicker through.
    if (openRef.current) {
      setOpenMenu(key);
      return;
    }
    timer.current = window.setTimeout(() => setOpenMenu(key), OPEN_DELAY);
  }, []);

  const requestClose = useCallback(() => {
    window.clearTimeout(timer.current);
    const descending = pointer.current.dy > 0;
    timer.current = window.setTimeout(
      () => setOpenMenu(null),
      descending ? CLOSE_DELAY_APPROACHING : CLOSE_DELAY,
    );
  }, []);

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    let openedAt: number | null = null;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - last;
      setScrolled(y > 80);
      /*
       * A jump this large is never a scroll gesture — it is the drawer
       * releasing its lock and restoring the position, or an in-page anchor.
       * Treating it as "scrolling down" hid the header the moment the drawer
       * closed, leaving the reader with no navigation at all.
       */
      setHidden(y > 400 && delta > 0 && delta < 200);

      if (openRef.current !== null) {
        if (openedAt === null) openedAt = y;
        else if (Math.abs(y - openedAt) > SCROLL_CLOSE_PX) closeNow();
      } else {
        openedAt = null;
      }

      last = y;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, [closeNow]);

  // Publish the live header height so the hero and sticky elements can clear it
  // without hardcoding a number.
  useEffect(() => {
    const root = document.documentElement;
    const value = scrolled
      ? getComputedStyle(root).getPropertyValue('--header-h-scrolled')
      : getComputedStyle(root).getPropertyValue('--header-h-top');
    root.style.setProperty('--header-h', value.trim());
  }, [scrolled]);

  useEffect(() => {
    closeNow();
    setDrawerOpen(false);
  }, [closeNow, pathname]);

  // Direction of travel, for the safe triangle. Cheap: two numbers, no state.
  useEffect(() => {
    if (!openMenu) return;
    const onMove = (event: PointerEvent) => {
      pointer.current = { y: event.clientY, dy: event.clientY - pointer.current.y };
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [openMenu]);

  useEffect(() => {
    if (!openMenu) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      closeNow();
      document.getElementById(`trigger-${openMenu.replace(/\W/g, '')}`)?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) closeNow();
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [closeNow, openMenu]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  /** Keyboard opens move focus into the panel; pointer opens leave it alone. */
  const focusPanel = (href: string) => {
    focusIntent.current = href;
  };

  useEffect(() => {
    if (!openMenu || focusIntent.current !== openMenu) return;
    focusIntent.current = null;
    // One frame after the commit, so the panel is certain to have been styled
    // visible before focus() runs — focus() on a visibility:hidden element is a
    // silent no-op. See .mega-panel in globals.css for why that was not free.
    const frame = window.requestAnimationFrame(() => {
      document
        .getElementById(menuId(openMenu))
        ?.querySelector<HTMLElement>('a[href], button:not([disabled])')
        ?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [openMenu]);

  return (
    <>
      {/*
        Scrim behind an open panel. pointer-events: none by design — it dims the
        page without swallowing the click that lands on it, and the document
        pointerdown listener above is what actually closes the menu. A scrim
        that ate the first click would make every link on the page need two.
      */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none fixed inset-0 z-[55] hidden bg-ink-900/40 transition-opacity duration-200 ease-out-expo lg:block',
          openMenu ? 'opacity-100' : 'opacity-0',
        )}
      />

      <header
        ref={headerRef}
        /*
          No `clip-x` here. `overflow-x: clip` on this element left the mega-menu
          painted but outside Chromium's hit-testing entirely, so the pointer
          "left" the header the moment it crossed the header's own bottom edge
          and no panel link was clickable. Page-level horizontal overflow is
          already caught by `overflow-x: clip` on <body>.
        */
        className={cn(
          'fixed inset-x-0 top-0 z-header transition-[transform,background-color,border-color] duration-base ease-out-expo',
          solid
            ? 'header-solid border-b border-line-dark'
            : 'border-b border-transparent bg-transparent',
          hidden && !openMenu && !drawerOpen ? '-translate-y-full' : 'translate-y-0',
        )}
        onBlur={(event) => {
          // Tabbing out of the last link in a panel leaves the header entirely.
          if (!openRef.current) return;
          if (!headerRef.current?.contains(event.relatedTarget as Node | null)) closeNow();
        }}
      >
        {/*
          The utility bar lives inside the fixed header and collapses to zero
          height past 80px, rather than sitting in normal document flow. Visually
          identical to "it scrolls away", but it avoids the position switch from
          absolute to fixed, which snaps the header upward the moment the user
          starts scrolling.
        */}
        <div
          className={cn(
            'overflow-hidden transition-[max-height,opacity] duration-base ease-out-expo',
            scrolled || !isHome ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100',
          )}
        >
          <TopBar />
        </div>

        <div
          className={cn(
            'container-site flex items-center justify-between gap-6 transition-[height] duration-base ease-out-expo',
            scrolled ? 'h-16 lg:h-[72px]' : 'h-16 lg:h-24',
          )}
        >
          {/* min-w-11: below 400px the wordmark is hidden and the lockup is a
              40px mark, which is under the tap-target floor on its own. */}
          <Link
            href="/"
            aria-label={`${COMPANY.name} — home`}
            className="inline-flex min-w-11 shrink-0 items-center"
          >
            <Logo priority size={scrolled ? 'sm' : 'md'} />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {NAV.map((item) => {
                const active = activeHref === item.href;
                const children = item.children ?? [];
                const expanded = openMenu === item.href;

                /*
                 * Underline treatments are deliberately different. Active is a
                 * solid 2px gold rule and belongs to exactly one item; hover and
                 * open get a 1px white rule at 40%. They used to share the gold
                 * rule, which is why two items appeared current at once.
                 */
                const rule = (
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute -bottom-1 left-0 transition-[width,opacity] duration-base ease-out-expo',
                      active
                        ? 'h-0.5 w-full bg-gold opacity-100'
                        : cn(
                            'h-px bg-white opacity-40 group-hover:w-full',
                            expanded ? 'w-full' : 'w-0',
                          ),
                    )}
                  />
                );

                const labelClass = cn(
                  'group relative inline-flex items-center gap-1.5 py-2 font-mono text-[13px] font-medium uppercase leading-none tracking-[0.1em] transition-colors duration-fast',
                  // Nav contrast: 0.82 white on ink is 12.4:1, well clear of AA.
                  // Never grey on grey.
                  active || expanded ? 'text-white' : 'text-white/[0.82] hover:text-white',
                );

                if (!children.length) {
                  return (
                    <li key={item.href} onPointerEnter={() => (coarsePointer ? undefined : closeNow())}>
                      <Link
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className={labelClass}
                      >
                        {item.label}
                        {rule}
                      </Link>
                    </li>
                  );
                }

                return (
                  /*
                   * `static`, not `relative`: the panel is a DOM child of this
                   * li — which is what keeps the hover alive across the gap —
                   * but its `top-full` must resolve against the fixed header so
                   * it can span the viewport.
                   */
                  <li
                    key={item.href}
                    className="static"
                    onPointerEnter={() => (coarsePointer ? undefined : requestOpen(item.href))}
                    onPointerLeave={() => (coarsePointer ? undefined : requestClose())}
                  >
                    <button
                      type="button"
                      id={`trigger-${item.href.replace(/\W/g, '')}`}
                      aria-expanded={expanded}
                      aria-controls={menuId(item.href)}
                      aria-current={active ? 'page' : undefined}
                      /*
                       * A disclosure button, not a link. A trigger that both
                       * navigates and opens has to decide what a single tap
                       * means, and gets it wrong for somebody; the section's own
                       * page is the first card inside the panel instead.
                       */
                      // A pointer press marks the activation as pointer-driven;
                      // the click handler below reads it to decide whether to
                      // move focus. Chromium fires the Enter-generated click
                      // with detail 1, so detail is not a usable signal here.
                      onPointerDown={() => {
                        keyActivated.current = false;
                      }}
                      onClick={() => {
                        if (expanded) {
                          closeNow();
                          return;
                        }
                        setOpenMenu(item.href);
                        // Focus follows a keyboard open into the panel. A mouse
                        // user who clicked the trigger has not asked for their
                        // focus to move, so it stays put.
                        if (keyActivated.current) focusPanel(item.href);
                        keyActivated.current = false;
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          // Left to the button's native click. Calling
                          // preventDefault here does not suppress that click in
                          // Chromium, so handling the key as well opened the
                          // panel and then immediately closed it again.
                          keyActivated.current = true;
                          return;
                        }
                        if (event.key !== 'ArrowDown') return;
                        event.preventDefault();
                        setOpenMenu(item.href);
                        focusPanel(item.href);
                      }}
                      className={labelClass}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          'text-[9px] leading-none transition-transform duration-base ease-out-expo',
                          expanded && 'rotate-180',
                        )}
                      >
                        &#9662;
                      </span>
                      {rule}
                    </button>

                    <MegaMenu
                      id={menuId(item.href)}
                      label={item.label}
                      items={children}
                      feature={item.feature}
                      open={expanded}
                      onNavigate={closeNow}
                    />
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <ButtonLink href="/quote" size="md" className="hidden lg:inline-flex">
              Request a quote
            </ButtonLink>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation"
              aria-expanded={drawerOpen}
              className="flex h-11 w-11 flex-col items-center justify-center gap-[6px] lg:hidden"
            >
              <span
                aria-hidden="true"
                className={cn(
                  'h-px w-5 bg-white transition-transform duration-base ease-out-expo',
                  drawerOpen && 'translate-y-[3.5px] rotate-45',
                )}
              />
              <span
                aria-hidden="true"
                className={cn(
                  'h-px w-5 bg-white transition-transform duration-base ease-out-expo',
                  drawerOpen && '-translate-y-[3.5px] -rotate-45',
                )}
              />
            </button>
          </div>
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} pathname={pathname} />
    </>
  );
}
