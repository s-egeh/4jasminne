import { Archivo, IBM_Plex_Mono, Inter_Tight } from 'next/font/google';

/** Display face. Weights limited to the two the design system uses. */
export const archivo = Archivo({
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
  variable: '--font-archivo',
  adjustFontFallback: true,
});

/** Body face. */
export const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-inter-tight',
  adjustFontFallback: true,
});

/** Utility face — the freight-manifest voice that carries the whole identity. */
export const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['500'],
  display: 'swap',
  variable: '--font-plex-mono',
  adjustFontFallback: true,
});

export const fontVariables = `${archivo.variable} ${interTight.variable} ${plexMono.variable}`;
