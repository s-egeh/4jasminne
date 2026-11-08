import Link from 'next/link';
import { Figure } from '@/components/ui/Media';
import { Reveal } from '@/components/motion/Reveal';
import { TextMask } from '@/components/motion/TextMask';
import { breadcrumbSchema } from '@/lib/schema';
import { cn } from '@/lib/utils';

export interface Crumb {
  label: string;
  href: string;
}

interface PageHeroProps {
  heading: string;
  standfirst: string;
  image: string;
  imageAlt: string;
  crumbs: Crumb[];
  /** Contact uses a shorter 300px hero; quote uses 280px. */
  height?: 'default' | 'short' | 'shortest';
}

const HEIGHTS = {
  default: 'h-[280px] md:h-[380px]',
  short: 'h-[260px] md:h-[300px]',
  shortest: 'h-[240px] md:h-[280px]',
};

export function PageHero({
  heading,
  standfirst,
  image,
  imageAlt,
  crumbs,
  height = 'default',
}: PageHeroProps) {
  const trail = [{ label: 'Home', href: '/' }, ...crumbs];

  return (
    <section className={cn('relative isolate w-full overflow-hidden bg-ink-900', HEIGHTS[height])}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(trail)) }}
      />

      <Figure
        src={image}
        alt={imageAlt}
        priority
        // Same reasoning as the homepage hero: this is a backdrop behind an H1,
        // not a figure, so the placeholder carries no caption.
        fallback="plain"
        className="absolute inset-0 h-full w-full"
        imageClassName="h-full w-full animate-none [animation:site-hero-settle_1.2s_cubic-bezier(0.16,1,0.3,1)_forwards]"
        sizes="100vw"
      />

      <span aria-hidden="true" className="hero-scrim pointer-events-none absolute inset-0" />
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gold" />

      <div className="container-site relative flex h-full flex-col justify-end pb-10 pt-24">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {trail.map((crumb, index) => {
              const isLast = index === trail.length - 1;
              return (
                <li key={crumb.href} className="flex items-center gap-2">
                  {isLast ? (
                    <span aria-current="page" className="u-mono text-[11px] text-gold">
                      {crumb.label}
                    </span>
                  ) : (
                    <>
                      <Link
                        href={crumb.href}
                        className="u-mono inline-flex min-h-11 items-center text-[11px] text-white/70 transition-colors duration-fast hover:text-white lg:min-h-0"
                      >
                        {crumb.label}
                      </Link>
                      <span aria-hidden="true" className="u-mono text-[11px] text-white/35">
                        /
                      </span>
                    </>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <TextMask
          as="h1"
          text={heading}
          onScroll={false}
          delay={120}
          className="mt-5 max-w-[18ch] t-display-l font-bold text-white"
        />

        <Reveal delay={280}>
          <p className="mt-4 max-w-[62ch] t-body-lg text-white/85">{standfirst}</p>
        </Reveal>
      </div>
    </section>
  );
}
