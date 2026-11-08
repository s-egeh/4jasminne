'use client';

import Link from 'next/link';
import {
  ChevronDown,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Phone,
  Twitter,
  X,
  Youtube,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { trackEvent } from '@/components/layout/Analytics';
import { ButtonLink } from '@/components/ui/Button';
import { COMPANY } from '@/data/company';
import { NAV } from '@/data/nav';
import { useFocusTrap, useScrollLock } from '@/lib/use-focus-trap';
import { cn, whatsappHref } from '@/lib/utils';
import { Logo } from './Logo';

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  facebook: Facebook,
  linkedin: Linkedin,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
};

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  pathname: string;
}

/** Full-height ink drawer sliding in from the right. Focus trapped, body locked. */
export function MobileDrawer({ open, onClose, pathname }: MobileDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  // Only one dropdown open at a time — the drawer now carries two.
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const swipe = useRef({ x: 0, active: false });

  useFocusTrap(panelRef, open, onClose);
  useScrollLock(open);

  useEffect(() => {
    if (!open) setExpandedKey(null);
  }, [open]);

  const socials = COMPANY.socials as ReadonlyArray<{ label: string; href: string; icon: string }>;

  return (
    <div
      className={cn('fixed inset-0 z-drawer lg:hidden', open ? 'visible' : 'invisible')}
      aria-hidden={!open}
    >
      <div
        role="presentation"
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-ink-900/70 transition-opacity duration-base ease-out-expo',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        tabIndex={-1}
        onPointerDown={(event) => {
          swipe.current = { x: event.clientX, active: event.pointerType !== 'mouse' };
        }}
        onPointerUp={(event) => {
          // Swipe right to dismiss. 60px of travel, so a horizontal drag inside
          // the drawer's own scroll does not fire it.
          if (swipe.current.active && event.clientX - swipe.current.x > 60) onClose();
          swipe.current = { x: 0, active: false };
        }}
        className={cn(
          // h-dvh, not h-full: on iOS the parent's 100% resolves against the
          // large viewport, so the last rows sat under the browser chrome.
          // overscroll-contain stops a flick at the end of the drawer's scroll
          // from chaining into the page behind it.
          'absolute right-0 top-0 flex h-dvh w-[92%] max-w-[420px] flex-col overflow-y-auto overscroll-contain bg-ink-900 transition-transform duration-base ease-in-out-quint',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        style={{
          paddingBottom: 'env(safe-area-inset-bottom)',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div className="flex items-center justify-between border-b border-line-dark px-6 py-5">
          <Link href="/" onClick={onClose} aria-label={`${COMPANY.name} — home`}>
            <Logo size="sm" />
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="inline-flex h-11 w-11 items-center justify-center border border-line-dark text-white transition-colors duration-fast hover:border-white hover:bg-white/10"
          >
            <X aria-hidden="true" strokeWidth={1.5} className="h-5 w-5" />
          </button>
        </div>

        {/*
          Contact first, not last. On a phone this is the conversion path — a
          visitor who opened the drawer to find a number should not have to
          scroll past nine navigation rows to reach one. 48px rows, comfortably
          over the 44px tap-target floor.
        */}
        <div className="border-b border-line-dark px-6 py-4">
          <ul className="flex flex-col">
            {COMPANY.phones.map((phone) => (
              <li key={phone.tel}>
                <a
                  href={`tel:${phone.tel}`}
                  onClick={() => trackEvent('phone_click', { source: 'drawer' })}
                  className="flex h-12 items-center gap-3 text-white transition-colors duration-fast hover:text-gold"
                >
                  <Phone aria-hidden="true" strokeWidth={1.5} className="h-4 w-4 shrink-0 text-gold" />
                  <span className="u-mono text-[13px]">{phone.display}</span>
                </a>
              </li>
            ))}

            <li>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('whatsapp_click', { source: 'drawer' })}
                className="flex h-12 items-center gap-3 text-white transition-colors duration-fast hover:text-gold"
              >
                <MessageCircle aria-hidden="true" strokeWidth={1.5} className="h-4 w-4 shrink-0 text-gold" />
                <span className="u-mono text-[13px]">WhatsApp</span>
              </a>
            </li>

            <li>
              <a
                href={`mailto:${COMPANY.email}`}
                className="flex h-12 items-center gap-3 text-white transition-colors duration-fast hover:text-gold"
              >
                <Mail aria-hidden="true" strokeWidth={1.5} className="h-4 w-4 shrink-0 text-gold" />
                <span className="u-mono truncate text-[13px] normal-case tracking-[0.06em]">
                  {COMPANY.email}
                </span>
              </a>
            </li>
          </ul>
        </div>

        <nav aria-label="Mobile" className="flex-1 px-6 py-6">
          <ul className="flex flex-col">
            {NAV.map((item, index) => {
              const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

              if (item.children) {
                const expanded = expandedKey === item.href;
                const panelId = `drawer-${item.href.replace(/\W/g, '')}`;

                return (
                  <li
                    key={item.href}
                    className="border-b border-line-dark"
                    style={{
                      opacity: open ? 1 : 0,
                      transform: open ? 'translateY(0)' : 'translateY(10px)',
                      transition: `opacity 320ms cubic-bezier(0.16,1,0.3,1) ${index * 50}ms, transform 320ms cubic-bezier(0.16,1,0.3,1) ${index * 50}ms`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          'flex-1 py-4 font-display text-[20px] font-semibold transition-colors duration-fast',
                          active ? 'text-gold' : 'text-white hover:text-gold',
                        )}
                      >
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setExpandedKey(expanded ? null : item.href)}
                        aria-expanded={expanded}
                        aria-controls={panelId}
                        aria-label={`${expanded ? 'Collapse' : 'Expand'} ${item.label}`}
                        className="p-3 text-white"
                      >
                        <ChevronDown
                          aria-hidden="true"
                          strokeWidth={1.5}
                          className={cn(
                            'h-5 w-5 transition-transform duration-base ease-out-expo',
                            expanded && 'rotate-180',
                          )}
                        />
                      </button>
                    </div>

                    <ul id={panelId} hidden={!expanded} className="pb-4 pl-4">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={onClose}
                            className="block border-l border-line-dark py-3 pl-4 t-small text-slate-400 transition-colors duration-fast hover:text-white"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }

              return (
                <li
                  key={item.href}
                  className="border-b border-line-dark"
                  style={{
                    opacity: open ? 1 : 0,
                    transform: open ? 'translateY(0)' : 'translateY(10px)',
                    transition: `opacity 320ms cubic-bezier(0.16,1,0.3,1) ${index * 50}ms, transform 320ms cubic-bezier(0.16,1,0.3,1) ${index * 50}ms`,
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'block py-4 font-display text-[20px] font-semibold transition-colors duration-fast',
                      active ? 'text-gold' : 'text-white hover:text-gold',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <ButtonLink href="/quote" onClick={onClose} className="mt-8 w-full" size="lg" withArrow>
            Request a quote
          </ButtonLink>
        </nav>

        {/* No accounts yet, so the whole band is omitted rather than shipped empty. */}
        {socials.length > 0 ? (
          <div className="border-t border-line-dark px-6 py-4">
            <ul className="flex items-center gap-2">
              {socials.map((social) => {
                const Icon = SOCIAL_ICONS[social.icon];
                if (!Icon) return null;
                return (
                  <li key={social.href}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${COMPANY.name} on ${social.label}`}
                      className="inline-flex h-11 w-11 items-center justify-center text-slate-400 transition-colors duration-fast hover:text-gold"
                    >
                      <Icon aria-hidden="true" strokeWidth={1.5} className="h-5 w-5" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
