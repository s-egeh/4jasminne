'use client';

import { useState } from 'react';
import { FreeMode, Mousewheel } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Reveal } from '@/components/motion/Reveal';
import { TextLink } from '@/components/ui/Button';
import { FleetCard } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FLEET } from '@/data/fleet';
import { cn } from '@/lib/utils';

import 'swiper/css';
import 'swiper/css/free-mode';

export function FleetRail() {
  const [hovered, setHovered] = useState(false);

  return (
    <section aria-labelledby="fleet-rail-heading" className="clip-x section-y bg-bone">
      <div className="container-site">
        <SectionHeader
          headingId="fleet-rail-heading"
          eyebrow="Equipment"
          heading="The fleet behind the promise."
          cta={<TextLink href="/fleet">See the full fleet</TextLink>}
        />
      </div>

      {/*
        The rail used to force `!overflow-visible` on the Swiper so slides could
        bleed to the viewport edge. Swiper clips its own track for a reason —
        without it, the off-screen slides sat in the document and produced the
        horizontal scrollbar that was present on every page. The rail is clipped
        again; `slidesOffsetBefore/After` still aligns the first card to the
        container gutter.
      */}
      <Reveal className="clip-x relative mt-14">
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="cursor-grab active:cursor-grabbing"
        >
          <Swiper
            modules={[FreeMode, Mousewheel]}
            freeMode={{ enabled: true, momentum: true }}
            spaceBetween={24}
            slidesOffsetBefore={24}
            slidesOffsetAfter={24}
            breakpoints={{
              0: { slidesPerView: 1.15, slidesOffsetBefore: 24, slidesOffsetAfter: 24 },
              768: { slidesPerView: 2.2, slidesOffsetBefore: 40, slidesOffsetAfter: 40 },
              1280: { slidesPerView: 3.4, slidesOffsetBefore: 64, slidesOffsetAfter: 64 },
            }}
          >
            {FLEET.map((unit) => (
              <SwiperSlide key={unit.slug} className="h-auto">
                <FleetCard
                  name={unit.name}
                  summary={unit.summary}
                  image={unit.image}
                  imageAlt={unit.imageAlt}
                  specs={unit.specs}
                  className="h-full"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute -top-9 right-6 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400 transition-opacity duration-fast lg:right-16',
            hovered ? 'opacity-100' : 'opacity-0',
          )}
        >
          Drag
        </span>
      </Reveal>

      <div className="container-site mt-10">
        <p className="u-mono text-[11px] text-slate-600">
          Preventive maintenance and dispatch supervision on every unit.
        </p>
      </div>
    </section>
  );
}
