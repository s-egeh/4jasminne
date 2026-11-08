'use client';

import { useEffect } from 'react';
import { Button, ButtonLink } from '@/components/ui/Button';
import { COMPANY, PRIMARY_PHONE } from '@/data/company';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[page error]', error);
  }, [error]);

  return (
    <section className="flex min-h-[70svh] items-center bg-ink-900 pt-32">
      <div className="container-site py-20">
        <p className="u-mono text-[12px] text-gold">Something went wrong</p>

        <h1 className="mt-6 max-w-[18ch] t-display-l font-bold text-white">
          This page could not be loaded.
        </h1>

        <p className="mt-5 max-w-measure t-body-lg text-slate-400">
          Try again, or reach the operations team directly on {PRIMARY_PHONE.display} or{' '}
          {COMPANY.email}.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={reset}>
            Try again
          </Button>
          <ButtonLink href="/" size="lg" variant="secondary-dark">
            Back to home
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
