import { AVAILABLE_IMAGES } from '@/data/image-manifest';

/**
 * Whether a photograph exists, decided at build time.
 *
 * Paths under /images/ are checked against the generated manifest (see
 * scripts/build-image-manifest.mjs). Anything else — the brand files, a remote
 * URL — is assumed present, because those ship with the code rather than being
 * supplied later.
 */
export function isImageAvailable(src: string | null | undefined): src is string {
  if (!src) return false;
  if (!src.startsWith('/images/')) return true;
  return AVAILABLE_IMAGES.has(src);
}
