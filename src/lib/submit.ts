import { COMPANY, PRIMARY_PHONE } from '@/data/company';
import type { SubmissionValues } from './validation';

export const FAILURE_MESSAGE = `Message not sent. Call ${PRIMARY_PHONE.display} or email ${COMPANY.email}.`;

/**
 * One submit path for all three forms.
 *
 * Posts to the internal API route by default. When the site is statically
 * exported for cPanel there is no API route, so NEXT_PUBLIC_FORM_ENDPOINT
 * (Web3Forms / Formspree) takes over. Either way the user gets a working
 * alternative in the failure message rather than a dead end.
 */
export async function submitForm(values: SubmissionValues): Promise<{ ok: true } | { ok: false; error: string }> {
  const external = process.env.NEXT_PUBLIC_FORM_ENDPOINT;
  const endpoint = external || '/api/contact';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      return { ok: false, error: FAILURE_MESSAGE };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: FAILURE_MESSAGE };
  }
}
