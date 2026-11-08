import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { COMPANY } from '@/data/company';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Two-digit index used throughout the manifest-style numbering. */
export function pad(n: number) {
  return String(n).padStart(2, '0');
}

/**
 * Canonical origin. Must match the default in next-sitemap.config.js, and
 * SITE_URL / NEXT_PUBLIC_SITE_URL must be set to the same value on the host —
 * see README, "Canonical URL". It must name the host that actually serves the
 * site: if the apex redirects to www (or the reverse), every canonical, sitemap
 * entry and share-card URL points at a redirect.
 */
export const DEFAULT_SITE_URL = 'https://4jasminedrive.com';

export function absoluteUrl(path = '/') {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || DEFAULT_SITE_URL).replace(
    /\/$/,
    '',
  );
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** WhatsApp link with an optional prefilled message. Number and default text come from COMPANY. */
export function whatsappHref(prefill?: string) {
  const text = prefill ?? COMPANY.whatsappPrefill;
  return `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function mailtoHref(email: string, subject?: string, body?: string) {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  const query = params.toString();
  return `mailto:${email}${query ? `?${query.replace(/\+/g, '%20')}` : ''}`;
}

export function currentYear() {
  return new Date().getFullYear();
}
