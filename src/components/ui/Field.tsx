'use client';

import { AlertCircle } from 'lucide-react';
import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const CONTROL =
  'w-full rounded-none border bg-paper px-4 text-[16px] text-ink-900 transition-colors duration-fast placeholder:text-slate-400 focus:border-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:opacity-60';

interface FieldShellProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

/** Label above, control, then error text. Labels are always real <label> elements. */
export function Field({ id, label, required, error, hint, children, className }: FieldShellProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label
        htmlFor={id}
        className="u-mono text-[11px] font-medium tracking-[0.12em] text-slate-600"
      >
        {label}
        {required ? (
          <span className="ml-1 text-gold-ink" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>

      {children}

      {hint && !error ? <p className="t-small text-slate-600">{hint}</p> : null}

      {error ? (
        <p id={`${id}-error`} role="alert" className="flex items-center gap-2 t-small text-danger">
          <AlertCircle aria-hidden="true" strokeWidth={1.5} className="h-4 w-4 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean };

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(CONTROL, 'h-[52px]', invalid ? 'border-danger' : 'border-line', className)}
      {...rest}
    />
  );
});

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean };

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid, rows = 5, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(CONTROL, 'resize-y py-4 leading-relaxed', invalid ? 'border-danger' : 'border-line', className)}
      {...rest}
    />
  );
});

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean };

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, invalid, children, ...rest },
  ref,
) {
  return (
    <select
      ref={ref}
      className={cn(
        CONTROL,
        'h-[52px] appearance-none bg-[length:14px] bg-[right_1rem_center] bg-no-repeat pr-10',
        invalid ? 'border-danger' : 'border-line',
        className,
      )}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%235A647A' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
      }}
      {...rest}
    >
      {children}
    </select>
  );
});

/** Honeypot. Visually hidden but not display:none, so bots still fill it in. */
export function Honeypot({ register }: { register?: Record<string, unknown> }) {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
      <label htmlFor="company_website">Company website</label>
      <input id="company_website" type="text" tabIndex={-1} autoComplete="off" {...register} />
    </div>
  );
}

export function Checkbox({
  id,
  label,
  error,
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { id: string; label: string; error?: string }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {/*
        The whole row is the <label>, not just the text beside the box. An 18px
        tick box is a 18px tap target on a phone; wrapping the row means the
        target is the full 44px line, which is what the guideline is asking for
        and what a thumb actually aims at.
      */}
      <label htmlFor={id} className="flex min-h-11 cursor-pointer items-start gap-3 lg:min-h-0">
        <input
          id={id}
          type="checkbox"
          className={cn(
            'mt-1 h-[18px] w-[18px] shrink-0 cursor-pointer appearance-none rounded-none border bg-paper transition-colors duration-fast checked:border-ink-900 checked:bg-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
            error ? 'border-danger' : 'border-line',
          )}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23FFFFFF' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6 9 17l-5-5'/%3E%3C/svg%3E\")",
            backgroundSize: '12px',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
          {...rest}
        />
        <span className="t-small text-slate-600">{label}</span>
      </label>

      {error ? (
        <p role="alert" className="flex items-center gap-2 t-small text-danger">
          <AlertCircle aria-hidden="true" strokeWidth={1.5} className="h-4 w-4 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
