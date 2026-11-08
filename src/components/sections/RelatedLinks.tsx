import Link from 'next/link';
import { Reveal } from '@/components/motion/Reveal';

interface RelatedLinksProps {
  /** Reads as a sentence, so it has to say why these three are here. */
  lead: string;
  links: { label: string; href: string }[];
  onDark?: boolean;
}

/**
 * A short line of cross-links closing a page.
 *
 * Six routes were reachable only through the header and footer, which means a
 * reader following the thread of a page had nowhere to go except back to the
 * navigation — and a crawler following body links never reached them at all.
 *
 * Deliberately a sentence with links in it rather than a "related pages" widget:
 * the lead is written for the page it sits on, so it earns its place instead of
 * reading as boilerplate.
 */
export function RelatedLinks({ lead, links, onDark = false }: RelatedLinksProps) {
  return (
    <Reveal>
      <p className={onDark ? 'max-w-measure t-small text-slate-400' : 'max-w-measure t-small text-slate-600'}>
        {lead}{' '}
        {links.map((link, index) => (
          <span key={link.href}>
            <Link
              href={link.href}
              className={
                onDark
                  ? 'underline decoration-gold underline-offset-4 transition-colors duration-fast hover:text-gold'
                  : 'underline decoration-gold underline-offset-4 transition-colors duration-fast hover:text-gold-ink'
              }
            >
              {link.label}
            </Link>
            {index < links.length - 2 ? ', ' : null}
            {index === links.length - 2 ? ' and ' : null}
            {index === links.length - 1 ? '.' : null}
          </span>
        ))}
      </p>
    </Reveal>
  );
}
