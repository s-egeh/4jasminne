import Link from 'next/link';
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Twitter,
  Youtube,
  type LucideIcon,
} from 'lucide-react';
import { CorridorStrip } from '@/components/sections/CorridorStrip';
import { ACTIVE_ADDRESSES, COMPANY } from '@/data/company';
import { FOOTER_COMPANY_LINKS, FOOTER_SERVICE_LINKS } from '@/data/nav';
import { currentYear, whatsappHref } from '@/lib/utils';
import { Logo } from './Logo';

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  facebook: Facebook,
  linkedin: Linkedin,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
};

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      /*
       * min-h-11 on the link itself, not padding on the row: the footer columns
       * are a list of links a thumb has to hit, and at their natural line height
       * they were 24px tall with 12px between them. The rule is 44 with 8 clear.
       */
      className="group flex min-h-11 w-full items-center t-small text-slate-400 transition-colors duration-fast hover:text-white lg:inline-flex lg:min-h-0 lg:w-auto"
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold transition-[width] duration-base ease-out-expo group-hover:w-full" />
      </span>
    </Link>
  );
}

export function Footer() {
  const socials = COMPANY.socials as ReadonlyArray<{ label: string; href: string; icon: string }>;

  return (
    <footer className="bg-ink-900">
      <div className="container-site grid grid-cols-1 gap-x-8 gap-y-12 py-16 md:grid-cols-2 md:py-20 lg:grid-cols-4">
        <div className="flex flex-col gap-6">
          <Link href="/" aria-label={`${COMPANY.name} — home`} className="inline-block">
            <Logo variant="full-dark" className="h-24" />
          </Link>

          <p className="max-w-[34ch] t-small text-slate-400">{COMPANY.tagline}</p>

          {socials.length > 0 ? (
            <ul className="flex items-center gap-4">
              {socials.map((social) => {
                const Icon = SOCIAL_ICONS[social.icon];
                if (!Icon) return null;
                return (
                  <li key={social.href}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${COMPANY.name} on ${social.label}`}
                      className="inline-flex h-10 w-10 items-center justify-center border border-line-dark text-slate-400 transition-colors duration-fast hover:border-gold hover:text-gold"
                    >
                      <Icon aria-hidden="true" strokeWidth={1.5} className="h-[18px] w-[18px]" />
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>

        <nav aria-labelledby="footer-company">
          <h2 id="footer-company" className="u-eyebrow text-gold">
            Company
          </h2>
          <ul className="mt-4 flex flex-col lg:mt-6 lg:gap-3">
            {FOOTER_COMPANY_LINKS.map((link) => (
              <li key={link.href}>
                <FooterLink href={link.href}>{link.label}</FooterLink>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-services">
          <h2 id="footer-services" className="u-eyebrow text-gold">
            Services
          </h2>
          <ul className="mt-4 flex flex-col lg:mt-6 lg:gap-3">
            {FOOTER_SERVICE_LINKS.map((link) => (
              <li key={link.href}>
                <FooterLink href={link.href}>{link.label}</FooterLink>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 id="footer-contact" className="u-eyebrow text-gold">
            Get in touch
          </h2>

          <ul aria-labelledby="footer-contact" className="mt-6 flex flex-col gap-4">
            {ACTIVE_ADDRESSES.map((address) => (
              <li key={address.label} className="flex gap-3 t-small text-slate-400">
                <MapPin aria-hidden="true" strokeWidth={1.5} className="mt-1 h-4 w-4 shrink-0 text-gold" />
                <address className="not-italic">
                  {address.lines.join(', ')}
                  <br />
                  {address.region}, {address.country}
                </address>
              </li>
            ))}

            {COMPANY.phones.map((phone) => (
              <li key={phone.tel}>
                <a
                  href={`tel:${phone.tel}`}
                  className="flex min-h-11 items-center gap-3 t-small text-slate-400 transition-colors duration-fast hover:text-white lg:min-h-0"
                >
                  <Phone aria-hidden="true" strokeWidth={1.5} className="h-4 w-4 shrink-0 text-gold" />
                  <span className="u-mono text-[12px]">{phone.display}</span>
                </a>
              </li>
            ))}

            <li>
              <a
                href={`mailto:${COMPANY.email}`}
                className="flex min-h-11 items-center gap-3 t-small text-slate-400 transition-colors duration-fast hover:text-white lg:min-h-0"
              >
                <Mail aria-hidden="true" strokeWidth={1.5} className="h-4 w-4 shrink-0 text-gold" />
                {COMPANY.email}
              </a>
            </li>

            <li>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center gap-3 t-small text-slate-400 transition-colors duration-fast hover:text-white lg:min-h-0"
              >
                <MessageCircle aria-hidden="true" strokeWidth={1.5} className="h-4 w-4 shrink-0 text-gold" />
                Chat on WhatsApp
              </a>
            </li>
          </ul>

          <h3 className="u-eyebrow mt-8 text-slate-400">Business hours</h3>
          <dl className="mt-3 flex flex-col gap-1.5">
            {COMPANY.hours.map((entry) => (
              <div key={entry.days} className="flex justify-between gap-4">
                <dt className="t-small text-slate-400">{entry.days}</dt>
                <dd className="u-mono text-[11px] text-white/80">{entry.hours}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <CorridorStrip />

      {/*
        The bottom bar is the last thing on every page, so it is where the
        reader comes to rest — and it is exactly where the fixed action stack
        floats. The privacy and terms links were sitting underneath the WhatsApp
        button at 360, 768 and 820px.

        Reserving the stack's *column* rather than its height: the stack is two
        48px buttons tall, so clearing it vertically would leave 148px of dead
        space under every page. Taking its width out of the bar instead costs
        nothing visible, and both numbers come from the variables the stack is
        positioned from, so the two cannot drift apart.

        The safe-area inset is added as well, for the iOS home indicator.
      */}
      <div
        className="container-site flex flex-col items-center gap-3 py-6 text-center md:flex-row md:justify-between md:text-left"
        style={{
          paddingRight: 'calc(var(--gutter) + var(--fab-size) + var(--fab-inset))',
          paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
        }}
      >
        <p className="u-mono text-[11px] normal-case tracking-[0.08em] text-slate-400">
          &copy; {currentYear()} {COMPANY.name}. All rights reserved.
        </p>

        <nav aria-label="Legal" className="flex items-center gap-4">
          <Link
            href="/privacy"
            className="inline-flex min-h-11 items-center u-mono text-[11px] text-slate-400 transition-colors duration-fast hover:text-white lg:min-h-0"
          >
            Privacy Policy
          </Link>
          <span aria-hidden="true" className="text-slate-600">
            &middot;
          </span>
          <Link
            href="/terms"
            className="inline-flex min-h-11 items-center u-mono text-[11px] text-slate-400 transition-colors duration-fast hover:text-white lg:min-h-0"
          >
            Terms of Use
          </Link>
        </nav>
      </div>
    </footer>
  );
}
