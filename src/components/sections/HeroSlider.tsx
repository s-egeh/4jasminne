'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { Autoplay, EffectFade, A11y, Keyboard } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { useReducedMotion } from '@/components/motion/use-reduced-motion';
import { ButtonLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/SectionHeader';
import { Figure } from '@/components/ui/Media';
import { HERO_SLIDES } from '@/data/hero';
import { cn, pad } from '@/lib/utils';

import 'swiper/css';
import 'swiper/css/effect-fade';

const AUTOPLAY_MS = 6500;

export function HeroSlider() {
  const [active, setActive] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const swiperRef = useRef<SwiperClass | null>(null);
  const reduced = useReducedMotion();

  const onSlideChange = useCallback((swiper: SwiperClass) => {
    setActive(swiper.realIndex);
    setProgressKey((key) => key + 1);
  }, []);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="4Jasmine Dr services"
      className="clip-x relative isolate h-[100svh] max-h-[900px] min-h-[640px] w-full bg-ink-900"
    >
      <Swiper
        modules={[Autoplay, EffectFade, A11y, Keyboard]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={reduced ? 0 : 900}
        // `rewind` rather than `loop`: Swiper's loop mode clones slides into the
        // DOM, which would duplicate the page H1 and every CTA for screen
        // readers. Rewind gives the same wrap-around with no clones.
        rewind
        keyboard={{ enabled: true }}
        // Autoplay is off entirely under reduced motion; the arrows, the counter
        // and keyboard control all keep working.
        autoplay={
          reduced
            ? false
            : { delay: AUTOPLAY_MS, disableOnInteraction: false, pauseOnMouseEnter: true }
        }
        a11y={{ enabled: true, prevSlideMessage: 'Previous slide', nextSlideMessage: 'Next slide' }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={onSlideChange}
        className="h-full w-full"
      >
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === active;
          return (
            <SwiperSlide key={slide.id}>
              {/*
                Three explicit layers, so nothing paints over the copy:
                  z-0  the image, and the "image pending" placeholder caption
                  z-10 the scrim
                  z-20 the content block
                The placeholder caption previously sat above the copy because
                both were in the same stacking context with no order set.
              */}
              <div className="relative grid h-full w-full">
                <Figure
                  src={slide.image}
                  alt={slide.imageAlt}
                  priority={index === 0}
                  sizes="100vw"
                  /*
                   * No caption on the hero placeholder. It sat in the middle of
                   * the slide, directly under the H1 — and although the layering
                   * is correct and the headline paints over it, the caption
                   * still read through the negative space of the letterforms and
                   * looked like a rendering fault. What the photograph should
                   * show is recorded in the shot list in HANDOVER.md, which is
                   * where whoever is commissioning it will be looking.
                   */
                  fallback="plain"
                  className="absolute inset-0 z-0 h-full w-full"
                  imageClassName={cn(
                    'ken-burns h-full w-full',
                    // Ken Burns is off below 768px. A continuous transform on a
                    // full-screen image is the most expensive thing on the page
                    // to paint, and on a phone it buys almost nothing visually
                    // while costing battery on the slowest devices we serve.
                    isActive &&
                      !reduced &&
                      'md:animate-[site-ken-burns_6.5s_linear_forwards]',
                  )}
                />

                <span
                  aria-hidden="true"
                  className="hero-scrim pointer-events-none absolute inset-0 z-10"
                />

                {/*
                  Content is anchored to the BOTTOM of the section and clears the
                  header from --header-h, so the H1 can never run through the
                  logo lockup at any viewport height.
                */}
                <div
                  className="container-site relative z-20 grid h-full items-end"
                  style={{
                    paddingTop: 'calc(var(--header-h) + 48px)',
                    paddingBottom: 'clamp(132px, 16vh, 168px)',
                  }}
                >
                  <div
                    className="max-w-[720px]"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: reduced ? 'none' : isActive ? 'translateY(0)' : 'translateY(16px)',
                      transition: reduced
                        ? 'opacity 150ms linear'
                        : 'opacity 620ms cubic-bezier(0.16,1,0.3,1) 80ms, transform 620ms cubic-bezier(0.16,1,0.3,1) 80ms',
                    }}
                  >
                    {/* The eyebrow belongs here and nowhere else. */}
                    <Eyebrow onDark>{slide.eyebrow}</Eyebrow>

                    {index === 0 ? (
                      <h1 className="mt-5 t-display-xl text-white text-shadow-scrim">{slide.heading}</h1>
                    ) : (
                      <p
                        aria-hidden={!isActive}
                        className="mt-5 t-display-xl text-white text-shadow-scrim"
                      >
                        {slide.heading}
                      </p>
                    )}

                    <p className="mt-5 max-w-[58ch] t-body-lg text-white/85">{slide.standfirst}</p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <MagneticButton>
                        <ButtonLink
                          href={slide.primary.href}
                          size="lg"
                          withArrow
                          className="w-full sm:w-auto"
                          tabIndex={isActive ? 0 : -1}
                        >
                          {slide.primary.label}
                        </ButtonLink>
                      </MagneticButton>

                      <MagneticButton>
                        <ButtonLink
                          href={slide.secondary.href}
                          size="lg"
                          variant="secondary-dark"
                          className="w-full sm:w-auto"
                          tabIndex={isActive ? 0 : -1}
                        >
                          {slide.secondary.label}
                        </ButtonLink>
                      </MagneticButton>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/*
        One navigation system, not two. The vertical slide-title list was
        removed: it duplicated the counter's job, crowded the bottom-left of a
        four-slide hero, and was the element the eyebrow was being confused with.
      */}
      <div className="container-site pointer-events-none absolute inset-x-0 bottom-8 z-30">
        <div
          className="flex items-center justify-center gap-5 md:justify-end"
          /* Clears the fixed action stack so the arrows are never sat on. */
          style={{ paddingRight: 'calc(var(--fab-size) + var(--fab-inset) + 16px)' }}
        >
          <span className="pointer-events-auto t-mono text-white/70">
            {pad(active + 1)} <span className="text-gold">—</span> {pad(HERO_SLIDES.length)}
          </span>

          <div aria-hidden="true" className="hidden h-0.5 w-28 overflow-hidden bg-white/20 md:block">
            <span
              key={progressKey}
              className="block h-full w-full origin-left bg-gold"
              style={
                reduced
                  ? { transform: 'scaleX(1)' }
                  : { animation: `site-slide-progress ${AUTOPLAY_MS}ms linear forwards` }
              }
            />
          </div>

          <div className="pointer-events-auto flex gap-2">
            <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous slide"
              className="inline-flex h-11 w-11 items-center justify-center border border-white/25 text-white transition-colors duration-fast hover:border-white hover:bg-white/10"
            >
              <ArrowLeft aria-hidden="true" strokeWidth={1.5} className="h-[18px] w-[18px]" />
            </button>
            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next slide"
              className="inline-flex h-11 w-11 items-center justify-center border border-white/25 text-white transition-colors duration-fast hover:border-white hover:bg-white/10"
            >
              <ArrowRight aria-hidden="true" strokeWidth={1.5} className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Scroll cue, bottom-left so it cannot collide with the controls. */}
      <div
        aria-hidden="true"
        className="container-site pointer-events-none absolute inset-x-0 bottom-8 z-20 hidden md:block"
      >
        <div className="flex items-center gap-3">
          <span className="relative block h-10 w-px bg-white/25">
            <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 animate-scroll-dot rounded-full bg-gold" />
          </span>
          <span className="t-mono-sm text-white/70">Scroll</span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes site-slide-progress {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </section>
  );
}
