'use client';

import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { trackEvent } from '@/components/layout/Analytics';
import { ButtonLink } from '@/components/ui/Button';
import { ACTIVE_ADDRESSES, COMPANY } from '@/data/company';
import { cn, whatsappHref } from '@/lib/utils';

/** The contact details block, reused on the homepage and the contact page. */
export function ContactBlock({
  className,
  showHours = true,
  onDark = false,
}: {
  className?: string;
  showHours?: boolean;
  onDark?: boolean;
}) {
  const muted = onDark ? 'text-slate-400' : 'text-slate-600';
  const strong = onDark ? 'text-white' : 'text-ink-900';
  const border = onDark ? 'border-line-dark' : 'border-line';

  return (
    <div className={cn('flex flex-col gap-8', className)}>
      {ACTIVE_ADDRESSES.map((address) => (
        <div key={address.label} className="flex gap-4">
          <MapPin aria-hidden="true" strokeWidth={1.5} className="mt-1 h-5 w-5 shrink-0 text-gold" />
          <div>
            <h3 className={cn('u-eyebrow', muted)}>{address.label}</h3>
            <address className={cn('mt-2 not-italic', strong)}>
              {address.lines.join(', ')}
              <br />
              {address.region}, {address.country}
            </address>
            <a
              href={COMPANY.mapDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="u-mono mt-3 inline-flex min-h-11 items-center text-[11px] text-gold-ink underline decoration-gold underline-offset-4 transition-colors duration-fast hover:text-gold-ink lg:mt-3 lg:min-h-0"
            >
              Get directions
            </a>
          </div>
        </div>
      ))}

      <div className="flex gap-4">
        <Phone aria-hidden="true" strokeWidth={1.5} className="mt-1 h-5 w-5 shrink-0 text-gold" />
        <div className="w-full">
          <h3 className={cn('u-eyebrow', muted)}>Call us</h3>
          <ul className={cn('mt-2 border-t', border)}>
            {COMPANY.phones.map((phone) => (
              <li key={phone.tel} className={cn('border-b', border)}>
                <a
                  href={`tel:${phone.tel}`}
                  onClick={() => trackEvent('phone_click', { number: phone.tel })}
                  className={cn(
                    'flex items-center justify-between gap-4 py-3 transition-colors duration-fast hover:text-gold-ink',
                    strong,
                  )}
                >
                  <span className="u-mono text-[10px] text-gold-ink">{phone.label}</span>
                  <span className="u-mono text-[12px]">{phone.display}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex gap-4">
        <Mail aria-hidden="true" strokeWidth={1.5} className="mt-1 h-5 w-5 shrink-0 text-gold" />
        <div>
          <h3 className={cn('u-eyebrow', muted)}>Email us</h3>
          <a
            href={`mailto:${COMPANY.email}`}
            className={cn('mt-2 flex min-h-11 items-center transition-colors duration-fast hover:text-gold-ink lg:min-h-0', strong)}
          >
            {COMPANY.email}
          </a>
          <p className={cn('mt-2 t-small', muted)}>Enquiries are read by the operations team.</p>
        </div>
      </div>

      <ButtonLink
        href={whatsappHref()}
        external
        variant={onDark ? 'secondary-dark' : 'secondary-light'}
        size="lg"
        className="self-start"
        onClick={() => trackEvent('whatsapp_click', { source: 'contact_block' })}
      >
        <MessageCircle aria-hidden="true" strokeWidth={1.5} className="h-4 w-4" />
        Chat on WhatsApp
      </ButtonLink>

      {showHours ? (
        <div>
          <h3 className={cn('u-eyebrow', muted)}>Business hours</h3>
          <dl className={cn('mt-3 border-t', border)}>
            {COMPANY.hours.map((entry) => (
              <div key={entry.days} className={cn('flex justify-between gap-4 border-b py-3', border)}>
                <dt className={cn('t-small', muted)}>{entry.days}</dt>
                <dd className={cn('u-mono text-[11px]', strong)}>{entry.hours}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
    </div>
  );
}
