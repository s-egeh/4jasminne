import { NextResponse } from 'next/server';
import { COMPANY } from '@/data/company';
import { MIN_FILL_MS, submissionSchema, type SubmissionValues } from '@/lib/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Shared handler for the enquiry, contact and quote forms.
 *
 * Everything is validated again here with the same zod schemas the client uses —
 * client-side validation is a convenience, not a control.
 */

// In-memory rate limit. Adequate for a single Vercel region; if the site is ever
// scaled across regions this needs to move to a shared store (Upstash/KV).
const HITS = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 8;

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (HITS.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  HITS.set(ip, recent);

  // Keep the map from growing without bound on a long-lived instance.
  if (HITS.size > 5000) HITS.clear();

  return recent.length > MAX_PER_WINDOW;
}

const LABELS: Record<string, string> = {
  kind: 'Form',
  name: 'Full name',
  company: 'Company',
  email: 'Email',
  phone: 'Phone',
  service: 'Service',
  enquiryType: 'Enquiry type',
  message: 'Message',
  cargo: 'Goods',
  quantity: 'Estimated weight or volume',
  requirements: 'Special requirements',
  pickup: 'Collection point',
  delivery: 'Delivery point',
  startDate: 'Preferred start date',
  frequency: 'Frequency',
  contactMethod: 'Preferred contact method',
  consent: 'Consent given',
};

const SUBJECTS: Record<SubmissionValues['kind'], string> = {
  enquiry: 'Website enquiry',
  contact: 'Website contact form',
  quote: 'Quote request',
};

function formatEmail(values: SubmissionValues) {
  const lines = Object.entries(values)
    .filter(([key, value]) => !['company_website', 'startedAt', 'kind'].includes(key) && value !== '')
    .map(([key, value]) => `${LABELS[key] ?? key}: ${String(value)}`);

  return [
    `${SUBJECTS[values.kind]} — ${COMPANY.name}`,
    '',
    ...lines,
    '',
    `Received: ${new Date().toISOString()}`,
  ].join('\n');
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed.' }, { status: 400 });
  }

  const values = parsed.data;

  // Honeypot: a real person never fills a field they cannot see.
  if (values.company_website) {
    // Answer 200 so a bot has nothing to tune against.
    return NextResponse.json({ ok: true });
  }

  // Timing check: a genuine submission takes longer than two seconds to type.
  if (Date.now() - values.startedAt < MIN_FILL_MS) {
    return NextResponse.json({ ok: true });
  }

  /*
   * Resend. CONTACT_TO_EMAIL is where enquiries are delivered and falls back to
   * the address published on the site. CONTACT_FROM_EMAIL must be on a domain
   * verified in the Resend account; a bare address is given the display name
   * "4Jasmine Dr website" so enquiries are recognisable in the inbox.
   */
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || COMPANY.email;
  const fromAddress = process.env.CONTACT_FROM_EMAIL;
  const from =
    fromAddress && !fromAddress.includes('<') ? `${COMPANY.name} website <${fromAddress}>` : fromAddress;

  if (!apiKey || !from) {
    // Without mail credentials there is nothing to deliver to. Fail loudly here
    // rather than silently swallowing a real customer enquiry.
    console.error('[contact] RESEND_API_KEY or CONTACT_FROM_EMAIL is not configured.');
    return NextResponse.json({ error: 'Mail delivery is not configured.' }, { status: 500 });
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);

    const result = await resend.emails.send({
      from,
      to,
      replyTo: 'email' in values ? values.email : undefined,
      subject: `${SUBJECTS[values.kind]} — ${values.name}`,
      text: formatEmail(values),
    });

    if (result.error) {
      console.error('[contact] Resend rejected the message:', result.error);
      return NextResponse.json({ error: 'Message not sent.' }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[contact] Unexpected failure:', error);
    return NextResponse.json({ error: 'Message not sent.' }, { status: 500 });
  }
}
