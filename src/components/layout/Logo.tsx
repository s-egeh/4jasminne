import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  /**
   * `dark` = horizontal lockup for placing ON a dark surface (header, drawer):
   *          the mark beside the white "4Jasmine Dr" wordmark.
   * `full-dark` = the full stacked lockup with a white wordmark, for the ink
   *          footer and anywhere else there is room for the descriptor.
   * `light` = the full stacked lockup in its original navy, for light surfaces
   *          (documents, print). The site has no light header.
   * `mark` = the truck-and-leaf mark alone, for dark surfaces (preloader).
   */
  variant?: 'dark' | 'full-dark' | 'light' | 'mark';
  size?: 'sm' | 'md';
  className?: string;
  priority?: boolean;
}

/*
 * Every file below is generated from the client's artwork by
 * scripts/build-logo-variants.mjs — see that script for how and why.
 *
 * Two adjustments are made for dark surfaces, and only there:
 *
 * 1. The WORDMARK is navy (#0E2C4E) — the same colour as the header and footer
 *    it sits on, so it is redrawn in white with its edges intact.
 * 2. The MARK's grey leaf and route line (#686C6F) measure 2.66:1 against the
 *    navy surface and turn muddy, so the dark-surface mark lifts that one grey
 *    to #9AA0A4 (5.33:1). The gold truck is left exactly as drawn.
 *
 * On light surfaces the original colours are used unchanged.
 *
 * Intrinsic sizes: mark 257x257, wordmark 682x88, full lockup 698x439.
 */
const MARK_DARK = '/brand/4jasmine-logo-mark-dark.png';
const WORDMARK_WHITE = '/brand/4jasmine-wordmark-white.png';
const FULL = '/brand/4jasmine-logo-full.png';
const FULL_WHITE = '/brand/4jasmine-logo-full-white.png';

const WORDMARK_RATIO = 88 / 682;
const FULL_RATIO = 439 / 698;

/** Display sizes: mark height and wordmark width, in CSS pixels. */
const SIZES = {
  sm: { mark: 32, wordmark: 112 },
  md: { mark: 40, wordmark: 140 },
};

export function Logo({ variant = 'dark', size = 'md', className, priority = false }: LogoProps) {
  const { mark, wordmark } = SIZES[size];

  // The preloader sits on ink, so the mark alone uses the dark-surface version.
  if (variant === 'mark') {
    return (
      <Image
        src={MARK_DARK}
        alt=""
        width={mark * 2}
        height={mark * 2}
        priority={priority}
        className={cn('h-auto w-auto', className)}
      />
    );
  }

  /*
   * The stacked lockups are sized by the caller's height class (h-24 and so on)
   * with w-auto; the width and height given here are the display size at
   * md, so next/image builds its srcset around that rather than the 698px
   * source.
   */
  if (variant === 'light' || variant === 'full-dark') {
    const height = 112;
    return (
      <Image
        src={variant === 'light' ? FULL : FULL_WHITE}
        alt=""
        width={Math.round(height / FULL_RATIO)}
        height={height}
        priority={priority}
        className={cn('w-auto', className)}
      />
    );
  }

  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <Image
        src={MARK_DARK}
        alt=""
        width={mark}
        height={mark}
        priority={priority}
        className="h-auto shrink-0"
        style={{ width: mark }}
      />
      {/*
        The wordmark drops below 400px. At 360 the lockup, the quote button and
        the menu button compete for a 312px row, and the first thing to give is
        the gap between the logo and the menu button. The mark alone is
        unambiguous — it is the same artwork the favicon uses.

        The "LOGISTICS & DISTRIBUTION" descriptor is not part of this lockup: at
        header width it would be under six pixels tall. The footer's stacked
        lockup carries it.
      */}
      <Image
        src={WORDMARK_WHITE}
        alt=""
        width={wordmark}
        height={Math.round(wordmark * WORDMARK_RATIO)}
        priority={priority}
        className="hidden h-auto shrink-0 min-[400px]:block"
        style={{ width: wordmark }}
      />
    </span>
  );
}
