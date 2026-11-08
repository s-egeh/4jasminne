'use client';

import { MapPin } from 'lucide-react';
import { useState } from 'react';
import { COMPANY } from '@/data/company';
import { cn } from '@/lib/utils';

/**
 * Click-to-load map. The facade is a static ink panel; the Google iframe (and
 * its cookies, and its ~700KB of JavaScript) only loads if the user asks for it.
 * That is worth roughly a second of LCP on a Ghanaian mobile connection.
 */
export function MapEmbed({ className, height = 380 }: { className?: string; height?: number }) {
  const [loaded, setLoaded] = useState(false);
  const address = COMPANY.addresses[0];

  return (
    <div className={cn('relative border border-line-dark bg-ink-900', className)} style={{ height }}>
      {loaded ? (
        <iframe
          title={`Map showing the ${COMPANY.name} head office in the ${address.lines[0]}, ${address.locality}`}
          src={COMPANY.mapEmbedUrl}
          width="100%"
          height="100%"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full grayscale-0"
          style={{ border: 0 }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="group grain flex h-full w-full flex-col items-center justify-center gap-4 p-6 text-center transition-colors duration-fast hover:bg-ink-800"
        >
          <MapPin aria-hidden="true" strokeWidth={1.5} className="relative z-10 h-8 w-8 text-gold" />
          <span className="relative z-10 u-mono text-[11px] text-white/80">
            {address.lines[0]}, {address.region}
          </span>
          <span className="relative z-10 u-mono text-[10px] text-slate-400 underline decoration-gold underline-offset-4">
            Load interactive map
          </span>
        </button>
      )}
    </div>
  );
}
