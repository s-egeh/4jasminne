'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { TextLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/SectionHeader';
import { CLIENTS, type Client } from '@/data/clients';
import { isImageAvailable } from '@/lib/images';
import { useInView } from '@/lib/use-in-view';
import { cn } from '@/lib/utils';

/*
 * Each client is a TILE, not loose text. 200x88, paper on bone, hairline
 * bordered — the exact box a real logo will drop into, so the layout does not
 * shift when the client supplies the files.
 */
function ClientTile({ client }: { client: Client }) {
  const [failed, setFailed] = useState(false);
  // A logo not in the build-time image manifest shows the wordmark, with no request.
  const showWordmark = !isImageAvailable(client.logo) || failed;

  return (
    <span className="flex h-[88px] w-[200px] shrink-0 items-center justify-center border border-line bg-paper px-4">
      {showWordmark ? (
        <span
          className="overflow-hidden text-center font-mono text-[11px] font-medium uppercase leading-tight tracking-[0.1em] text-slate-600"
          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
        >
          {client.name}
        </span>
      ) : (
        <Image
          src={client.logo as string}
          alt={client.name}
          width={180}
          height={48}
          onError={() => setFailed(true)}
          className="max-h-12 w-auto object-contain"
        />
      )}
    </span>
  );
}

/**
 * The track repeats the set three times and animates by exactly one third, so
 * the loop is seamless at any viewport width — a two-copy track leaves a
 * visible gap on wide screens once the set is narrower than the viewport.
 */
function Row({ reverse = false, duration }: { reverse?: boolean; duration: string }) {
  const [paused, setPaused] = useState(false);
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="marquee-mask clip-x py-2"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={cn(
          'marquee-track flex w-max items-center gap-5 grayscale transition-[filter] duration-base hover:grayscale-0',
          reverse ? 'animate-marquee-thirds-reverse' : 'animate-marquee-thirds',
        )}
        style={{
          ['--marquee-duration' as string]: duration,
          // Off-screen is paused too: nobody can see it, and the frames are not free.
          animationPlayState: paused || !inView ? 'paused' : 'running',
        }}
      >
        {[0, 1, 2].map((copy) => (
          <span
            key={copy}
            aria-hidden={copy > 0 ? true : undefined}
            className="flex shrink-0 items-center gap-5"
          >
            {CLIENTS.map((client) => (
              <ClientTile key={`${copy}-${client.name}`} client={client} />
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ClientsMarquee() {
  // No named clients yet: the whole band is omitted, heading included.
  if (CLIENTS.length === 0) return null;

  return (
    <section aria-labelledby="clients-heading" className="clip-x section-y-tight bg-bone">
      <div className="container-site flex flex-col items-center text-center">
        <Reveal>
          <Eyebrow>Clients &amp; partners</Eyebrow>
        </Reveal>
        {/* A section heading, so it takes the section heading size. It was
            set at t-h4, which is why it read as a caption. The full
            sentence moved to the line below it. */}
        <Reveal delay={70}>
          <h2 id="clients-heading" className="mt-5 max-w-head t-h2 text-ink-900">
            Companies that depend on schedule.
          </h2>
        </Reveal>
        <Reveal delay={110}>
          <p className="mt-5 max-w-intro t-body-lg text-slate-600">
            Long-term partnerships with leading companies operating in Ghana.
          </p>
        </Reveal>
      </div>

      {/* Different speeds so the two rows never lock into a repeating pattern. */}
      <Reveal delay={120} className="mt-10 flex flex-col gap-4">
        <Row duration="40s" />
        <Row reverse duration="47s" />
      </Reveal>

      <div className="container-site mt-10 flex justify-center">
        <Reveal delay={160}>
          <TextLink href="/clients">More about our partners</TextLink>
        </Reveal>
      </div>
    </section>
  );
}
