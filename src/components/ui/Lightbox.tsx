'use client';

import YARL from 'yet-another-react-lightbox';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Video from 'yet-another-react-lightbox/plugins/video';
import { isImageAvailable } from '@/lib/images';
import { pad } from '@/lib/utils';

import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

export interface LightboxSlide {
  src: string;
  alt: string;
  caption?: string;
  /** Set when the client supplies footage rather than a still. */
  video?: string;
}

/**
 * Full-screen lightbox on an ink field, with a mono counter, captions, a
 * thumbnail strip on desktop and keyboard plus swipe navigation.
 */
export default function Lightbox({
  slides,
  index,
  onClose,
}: {
  slides: LightboxSlide[];
  index: number;
  onClose: () => void;
}) {
  /*
   * The lightbox loads the full-size file directly, so a slide whose photograph
   * has not been supplied would open as a broken image. Those are dropped here,
   * and the starting index follows the slide that was actually clicked.
   */
  const available = slides
    .map((slide, position) => ({ slide, position }))
    .filter(({ slide }) => Boolean(slide.video) || isImageAvailable(slide.src));
  if (available.length === 0) return null;
  const start = Math.max(
    0,
    available.findIndex(({ position }) => position === index),
  );

  return (
    <YARL
      open
      close={onClose}
      index={start}
      plugins={[Counter, Captions, Thumbnails, Video]}
      slides={available.map(({ slide }) =>
        slide.video
          ? {
              type: 'video' as const,
              sources: [{ src: slide.video, type: 'video/mp4' }],
              poster: slide.src,
              description: slide.caption ?? slide.alt,
            }
          : {
              src: slide.src,
              alt: slide.alt,
              description: slide.caption ?? slide.alt,
            },
      )}
      counter={{
        container: { style: { top: 'unset', bottom: 0, left: 0 } },
      }}
      video={{ muted: true, controls: true }}
      carousel={{ preload: 1, finite: false }}
      thumbnails={{ border: 0, borderRadius: 0, width: 96, height: 64, gap: 8 }}
      captions={{ descriptionTextAlign: 'center', showToggle: false }}
      styles={{
        container: { backgroundColor: 'rgb(var(--ink-900-rgb) / 0.96)' },
        thumbnailsContainer: { backgroundColor: 'rgb(var(--ink-900-rgb) / 0.96)' },
        thumbnail: { backgroundColor: 'var(--ink-800)', border: '1px solid var(--line-dark)' },
      }}
      labels={{ Previous: 'Previous image', Next: 'Next image', Close: 'Close gallery' }}
      render={{
        // Mono counter formatted as "07 / 24" to match the rest of the system.
        iconPrev: undefined,
        iconNext: undefined,
      }}
      on={{
        view: ({ index: current }) => {
          const node = document.querySelector('.yarl__counter');
          if (node) node.textContent = `${pad(current + 1)} / ${pad(slides.length)}`;
        },
      }}
    />
  );
}
