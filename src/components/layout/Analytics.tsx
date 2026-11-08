'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';

const STORAGE_KEY = '4jasmine:consent';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Fires a GA4 event if analytics are enabled and consented to. */
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, params ?? {});
}

/**
 * Google Analytics 4 plus the consent notice. Both are inert unless
 * NEXT_PUBLIC_GA_ID is set — no analytics, no cookie bar, nothing to consent to.
 */
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const [consent, setConsent] = useState<'unknown' | 'granted' | 'denied'>('unknown');

  useEffect(() => {
    if (!gaId) return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'granted' || stored === 'denied') setConsent(stored);
  }, [gaId]);

  if (!gaId) return null;

  const decide = (value: 'granted' | 'denied') => {
    window.localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);
  };

  return (
    <>
      {consent === 'granted' ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', { anonymize_ip: true });`}
          </Script>
        </>
      ) : null}

      {consent === 'unknown' ? (
        <div
          role="region"
          aria-label="Cookie notice"
          className="no-print fixed inset-x-0 bottom-0 z-overlay border-t border-line-dark bg-ink-900"
        >
          <div className="container-site flex flex-col items-start gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[68ch] t-small text-slate-400">
              We use analytics cookies to understand how this site is used. Nothing is shared with
              advertisers.{' '}
              <a
                href="/privacy"
                className="text-white underline decoration-gold underline-offset-4 hover:text-gold"
              >
                Privacy Policy
              </a>
            </p>
            <div className="flex shrink-0 gap-3">
              <Button size="sm" onClick={() => decide('granted')}>
                Accept
              </Button>
              <Button size="sm" variant="secondary-dark" onClick={() => decide('denied')}>
                Decline
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
