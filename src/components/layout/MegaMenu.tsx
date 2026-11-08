'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { Figure } from '@/components/ui/Media';
import type { NavChild, NavItem } from '@/data/nav';
import { cn } from '@/lib/utils';

interface MegaMenuProps {
  open: boolean;
  onNavigate: () => void;
  /** Shared with the trigger's aria-controls. */
  id: string;
  label: string;
  items: NavChild[];
  feature?: NavItem['feature'];
}

/**
 * Desktop mega-menu panel.
 *
 * Positioning: the panel is a child of its own <li>, but the li is `static`, so
 * `top-full` resolves against the fixed <header> and the panel spans the
 * viewport while its content aligns to the site container. Being a DOM child of
 * the li is what makes the hover work — a pointer travelling from the trigger
 * into the panel never leaves the element that owns the hover state, so no
 * pointerleave fires at all.
 *
 * The header must NOT carry `overflow-x: clip`. It used to, and although the
 * panel still painted, Chromium excluded it from hit testing entirely: every
 * pointer event below the header's own box fell through to the page beneath.
 * That is what closed the menu the instant the pointer moved towards it, and it
 * meant no link in here was ever clickable.
 */
export function MegaMenu({ open, onNavigate, id, label, items, feature }: MegaMenuProps) {
  return (
    <div
      id={id}
      role="group"
      aria-label={`${label} menu`}
      aria-hidden={!open}
      className={cn(
        // .mega-panel owns visibility and the transition — see the note beside
        // it in globals.css. Hidden as well as transparent, because an
        // opacity-0 panel is still in the accessibility tree and still measured
        // by contrast checkers against whatever is behind it.
        'mega-panel absolute inset-x-0 top-full hidden border-t border-line-dark bg-ink-900 shadow-mega lg:block',
        open
          ? 'mega-panel-open pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-2 opacity-0',
      )}
    >
      {/*
        Hover bridge. The panel already sits flush against the header, but the
        header changes height as the page scrolls; if that happens while the
        pointer is in transit a gap opens for one frame. This strip belongs to
        the panel and covers the last 16px of the header, so the crossing is
        never over dead space. Inert while the panel is closed, because the
        panel itself is pointer-events: none.
      */}
      <span aria-hidden="true" className="absolute inset-x-0 -top-4 block h-4" />

      <div className="container-site grid max-h-[62vh] grid-cols-12 gap-x-6 gap-y-10 py-12">
        <ul
          className={cn(
            'grid grid-cols-2 gap-x-8 gap-y-10 xl:grid-cols-3',
            feature ? 'col-span-8' : 'col-span-12',
          )}
        >
          {items.map((item) => (
            <li key={item.href}>
              {/*
                auto / 1fr / auto with a floor on the row: the description cell
                absorbs the slack, so every VIEW link in a row lands on the same
                baseline whether its description runs to one line or two.
              */}
              <Link
                href={item.href}
                onClick={onNavigate}
                tabIndex={open ? 0 : -1}
                className="group grid min-h-[104px] grid-rows-[auto_1fr_auto] content-start"
              >
                <span className="font-display text-[15px] font-semibold leading-snug text-white transition-colors duration-fast group-hover:text-gold">
                  {item.label}
                </span>
                <span className="mt-1.5 line-clamp-2 t-small leading-relaxed text-slate-400">
                  {item.description}
                </span>
                <span className="mt-3 inline-flex items-center gap-2 self-end font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-white/70 transition-colors duration-fast group-hover:text-gold">
                  View
                  <ArrowRight
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="h-[14px] w-[14px] transition-transform duration-fast ease-out-expo group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {feature ? (
          // The divider is drawn as an inset pseudo-rule rather than a border,
          // so it stops 24px short of the panel padding at both ends instead of
          // running into it.
          <div className="relative col-span-4 flex flex-col pl-8 before:absolute before:inset-y-6 before:left-0 before:w-px before:bg-line-dark">
            <Figure
              src={feature.image}
              alt={feature.imageAlt}
              className="aspect-card max-h-[220px] w-full"
              imageClassName="h-full w-full"
              sizes="320px"
              decorative
            />
            <p className="mt-5 t-small text-slate-400">{feature.line}</p>
            <ButtonLink
              href={feature.cta.href}
              size="sm"
              className="mt-5 self-start"
              onClick={onNavigate}
              withArrow
              tabIndex={open ? 0 : -1}
            >
              {feature.cta.label}
            </ButtonLink>
          </div>
        ) : null}
      </div>
    </div>
  );
}
