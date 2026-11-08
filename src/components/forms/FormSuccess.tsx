import { CheckCircle2 } from 'lucide-react';
import type { ReactNode } from 'react';

/**
 * Confirmation panel replacing the form on success. Never a browser alert,
 * never a toast on its own — the user needs to see that the thing they spent
 * two minutes filling in actually arrived.
 */
export function FormSuccess({
  heading,
  body,
  children,
}: {
  heading: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <div role="status" className="flex flex-col items-start gap-5 border border-line-dark bg-ink-900 p-8 sm:p-10">
      <CheckCircle2 aria-hidden="true" strokeWidth={1.5} className="h-10 w-10 text-gold" />
      <h3 className="t-h3 font-bold text-white">{heading}</h3>
      <p className="max-w-measure text-slate-400">{body}</p>
      {children}
    </div>
  );
}
