import type { ReactNode } from 'react';

/** Single 68ch column with mono H2s. Used by /privacy and /terms. */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <section className="bg-bone pb-section pt-40 md:pt-48">
      <div className="container-site">
        <div className="max-w-legal">
          <h1 className="t-display-l font-bold text-ink-900">{title}</h1>
          <p className="u-mono mt-5 text-[11px] text-slate-600">Last updated: {updated}</p>

          <div className="mt-12 flex flex-col gap-10 [&_a]:underline [&_a]:decoration-gold [&_a]:underline-offset-4 [&_a:hover]:text-gold-ink [&_h2]:font-mono [&_h2]:text-[12px] [&_h2]:font-medium [&_h2]:uppercase [&_h2]:tracking-[0.14em] [&_h2]:text-gold-ink [&_li]:text-slate-600 [&_p]:text-slate-600 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
