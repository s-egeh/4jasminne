import type { Config } from 'tailwindcss';

/**
 * 4Jasmine Dr design system. Colour values live in src/styles/globals.css and
 * are taken from the client's logo.
 * The default Tailwind palette is switched off entirely: `colors` is replaced,
 * not extended, so no default blue/indigo can leak into the build.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      inherit: 'inherit',
      /*
       * Built from channel variables, not from `var(--ink-900)` directly, so
       * that opacity modifiers actually compile. See the note beside
       * --ink-900-rgb in globals.css: with a hex-holding var, Tailwind emits
       * no rule at all for `bg-ink-900/70` and the element ends up fully
       * transparent — which is how every scrim on the site was shipping.
       */
      ink: {
        900: 'rgb(var(--ink-900-rgb) / <alpha-value>)',
        800: 'rgb(var(--ink-800-rgb) / <alpha-value>)',
        700: 'rgb(var(--ink-700-rgb) / <alpha-value>)',
        500: 'rgb(var(--ink-500-rgb) / <alpha-value>)',
      },
      /*
       * No crimson: the 4Jasmine Dr logo has no red in it. Emphasis is gold,
       * solid fills are ink. `danger` is not a brand colour — it exists only
       * for form validation (see --danger in globals.css).
       */
      gold: {
        DEFAULT: 'var(--gold)',
        dark: 'var(--gold-d)',
        // Text-only step. See the note beside --gold-ink in globals.css.
        ink: 'var(--gold-ink)',
      },
      bone: 'var(--bone)',
      paper: 'var(--paper)',
      slate: {
        600: 'var(--slate-600)',
        400: 'var(--slate-400)',
      },
      danger: 'var(--danger)',
      line: 'var(--line)',
      'line-dark': 'var(--line-dark)',
      whatsapp: '#128C7E',
      white: '#FFFFFF',
      black: '#000000',
    },
    borderRadius: {
      none: '0',
      badge: '2px',
      DEFAULT: '4px',
      card: '4px',
      full: '9999px',
    },
    boxShadow: {
      none: 'none',
      // The single elevation token permitted by the design system (5.3).
      elevate: '0 24px 60px -32px rgba(14, 44, 78, 0.35)',
      // The mega-menu is the one surface that overhangs the page rather than
      // sitting in it, so it gets a deeper, darker cast than `elevate`.
      mega: '0 32px 64px -32px rgba(0, 0, 0, 0.6)',
    },
    fontFamily: {
      display: ['var(--font-archivo)', 'system-ui', 'sans-serif'],
      body: ['var(--font-inter-tight)', 'system-ui', 'sans-serif'],
      mono: ['var(--font-plex-mono)', 'ui-monospace', 'monospace'],
    },
    extend: {
      /*
       * NOTE: the type scale deliberately does NOT live here.
       *
       * It used to, as `text-h2`, `text-body-lg` and so on. Those names are
       * unparseable as font sizes by tailwind-merge, which therefore treated
       * them as text COLOURS — so `cn('text-h2', 'text-ink-900')` resolved them
       * as a conflict and silently dropped the size. Every section heading on
       * the site fell back to body type. The scale is now `.t-*` component
       * classes in globals.css, outside the `text-` namespace entirely.
       */
      maxWidth: {
        container: '1320px',
        measure: '72ch',
        intro: '62ch',
        legal: '68ch',
        /* Heading caps — keeps every H2 to two lines at desktop (A6). */
        'head-tight': '16ch',
        head: '22ch',
        'head-wide': '26ch',
      },
      spacing: {
        section: 'clamp(72px, 9vw, 140px)',
        gutter: 'var(--gutter)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-quint': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      transitionDuration: {
        fast: '180ms',
        base: '420ms',
        slow: '900ms',
      },
      aspectRatio: {
        card: '16 / 10',
        portrait: '4 / 5',
      },
      zIndex: {
        header: '60',
        drawer: '70',
        overlay: '80',
        transition: '90',
      },
      keyframes: {
        // Two-copy track: shift by half.
        marquee: {
          from: { transform: 'translate3d(0, 0, 0)' },
          to: { transform: 'translate3d(-50%, 0, 0)' },
        },
        'marquee-reverse': {
          from: { transform: 'translate3d(-50%, 0, 0)' },
          to: { transform: 'translate3d(0, 0, 0)' },
        },
        // Three-copy track: shift by a third. Used where the item set is
        // narrower than a wide viewport, so two copies would leave a gap.
        'marquee-thirds': {
          from: { transform: 'translate3d(0, 0, 0)' },
          to: { transform: 'translate3d(-33.3333%, 0, 0)' },
        },
        'marquee-thirds-reverse': {
          from: { transform: 'translate3d(-33.3333%, 0, 0)' },
          to: { transform: 'translate3d(0, 0, 0)' },
        },
        'scroll-dot': {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '20%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { transform: 'translateY(40px)', opacity: '0' },
        },
        'pulse-hairline': {
          '0%, 100%': { opacity: '0.06' },
          '50%': { opacity: '0.14' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        marquee: 'marquee var(--marquee-duration, 40s) linear infinite',
        'marquee-reverse': 'marquee-reverse var(--marquee-duration, 40s) linear infinite',
        'marquee-thirds': 'marquee-thirds var(--marquee-duration, 40s) linear infinite',
        'marquee-thirds-reverse':
          'marquee-thirds-reverse var(--marquee-duration, 40s) linear infinite',
        'scroll-dot': 'scroll-dot 2s cubic-bezier(0.65, 0, 0.35, 1) infinite',
        'pulse-hairline': 'pulse-hairline 1.6s ease-in-out infinite',
        spin: 'spin 0.7s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
