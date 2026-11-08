import { Facebook, Instagram, Linkedin, MapPin, Twitter, Youtube, type LucideIcon } from 'lucide-react';
import { COMPANY, PRIMARY_PHONE } from '@/data/company';

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  facebook: Facebook,
  linkedin: Linkedin,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
};

const headOffice = COMPANY.addresses[0];

/**
 * Desktop-only utility bar. It scrolls away naturally — the sticky header does
 * not include it.
 */
export function TopBar() {
  const socials = COMPANY.socials as ReadonlyArray<{ label: string; href: string; icon: string }>;

  return (
    <div className="hidden h-10 w-full border-b border-line-dark bg-ink-800 lg:block">
      <div className="container-site flex h-full items-center justify-between">
        <p className="u-mono flex items-center gap-2 text-[11px] text-slate-400">
          <MapPin aria-hidden="true" strokeWidth={1.5} className="h-[14px] w-[14px] text-gold" />
          {headOffice.lines[0]}, {headOffice.region}
        </p>

        <div className="flex items-center gap-5">
          <a
            href={`tel:${PRIMARY_PHONE.tel}`}
            className="u-mono text-[11px] text-slate-400 transition-colors duration-fast hover:text-white"
          >
            {PRIMARY_PHONE.display}
          </a>

          <span aria-hidden="true" className="h-3 w-px bg-line-dark" />

          <a
            href={`mailto:${COMPANY.email}`}
            className="u-mono text-[11px] normal-case tracking-[0.06em] text-slate-400 transition-colors duration-fast hover:text-white"
          >
            {COMPANY.email}
          </a>

          {/* Social icons render only for links that actually exist. */}
          {socials.length > 0 ? (
            <>
              <span aria-hidden="true" className="h-3 w-px bg-line-dark" />
              <ul className="flex items-center gap-3">
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
                        className="block text-slate-400 transition-colors duration-fast hover:text-gold"
                      >
                        <Icon aria-hidden="true" strokeWidth={1.5} className="h-4 w-4" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
