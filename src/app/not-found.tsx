import Link from 'next/link';
import { CorridorStrip } from '@/components/sections/CorridorStrip';

export default function NotFound() {
  return (
    <section className="flex min-h-[100svh] flex-col justify-between bg-ink-900 pt-32">
      <div className="container-site flex flex-1 flex-col justify-center py-20">
        <p className="font-display t-display-xl font-bold leading-none text-white">404</p>

        <p className="u-mono mt-8 text-[12px] text-gold">This route does not exist.</p>

        <p className="mt-4 max-w-measure t-body-lg text-slate-400">
          The page may have been moved or the address mistyped. The links below cover most of what is
          on this site.
        </p>

        <nav aria-label="Recovery links" className="mt-10">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {[
              { label: 'Home', href: '/' },
              { label: 'Services', href: '/services' },
              { label: 'Contact', href: '/contact' },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group inline-flex font-mono text-[13px] font-medium uppercase tracking-[0.1em] text-white transition-colors duration-fast hover:text-gold"
                >
                  <span className="relative">
                    {link.label}
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-[width] duration-base ease-out-expo group-hover:w-full" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <CorridorStrip />
    </section>
  );
}
