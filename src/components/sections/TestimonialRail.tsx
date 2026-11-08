'use client';

import { Navigation, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { TESTIMONIALS } from '@/data/clients';

import 'swiper/css';
import 'swiper/css/navigation';

/**
 * Testimonial rail.
 *
 * The component is built and wired but renders nothing while TESTIMONIALS is
 * empty — which it is, and will stay, until the client supplies real quotes with
 * named people, their companies and written permission to publish. Testimonials
 * are never invented here.
 */
export function TestimonialRail() {
  if (TESTIMONIALS.length === 0) return null;

  return (
    <Swiper
      modules={[Navigation, A11y]}
      navigation
      spaceBetween={24}
      breakpoints={{ 0: { slidesPerView: 1 }, 768: { slidesPerView: 2 } }}
    >
      {TESTIMONIALS.map((testimonial) => (
        <SwiperSlide key={`${testimonial.name}-${testimonial.company}`} className="h-auto">
          <figure className="flex h-full flex-col gap-6 border border-line bg-paper p-8">
            <blockquote className="t-body-lg text-ink-900">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-auto border-t border-line pt-5">
              <span className="block font-display text-[16px] font-semibold text-ink-900">
                {testimonial.name}
              </span>
              <span className="u-mono mt-1.5 block text-[11px] text-gold-ink">
                {testimonial.role}, {testimonial.company}
              </span>
            </figcaption>
          </figure>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
