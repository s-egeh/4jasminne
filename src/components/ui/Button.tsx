'use client';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Loader2 } from 'lucide-react';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary-dark' | 'secondary-light' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

const SIZES: Record<ButtonSize, string> = {
  lg: 'h-[52px] px-7 text-[13px]',
  md: 'h-[44px] px-[22px] text-[13px]',
  sm: 'h-9 px-4 text-[12px]',
};

/**
 * Buttons are square-edged, mono, uppercase. Hover fills wipe up from the bottom
 * via a pseudo-element so the label never moves. No scale, no bounce, no pills.
 */
const BASE =
  'group/btn relative inline-flex items-center justify-center gap-[10px] overflow-hidden rounded-none font-mono font-medium uppercase tracking-[0.1em] leading-none transition-[color,background-color,border-color,opacity] duration-fast ease-out-expo disabled:cursor-not-allowed';

/*
 * Primary is gold with an ink label (5.77:1). Its hover fills ink from the
 * bottom with a white label (14.1:1) — the darker gold step would put the ink
 * label at 3.86:1, under AA. The gold border stays visible through the hover,
 * so the button keeps its edge on the ink hero and CTA band, where an ink fill
 * would otherwise vanish into the background.
 */
const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'border border-gold bg-gold text-ink-900 before:absolute before:inset-x-0 before:bottom-0 before:h-full before:origin-bottom before:scale-y-0 before:bg-ink-900 before:transition-transform before:duration-fast before:ease-out-expo hover:text-white hover:before:scale-y-100 active:translate-y-px disabled:border-slate-400 disabled:bg-slate-400 disabled:text-ink-900 disabled:opacity-60 disabled:before:hidden',
  'secondary-dark':
    'border border-white/40 bg-transparent text-white hover:border-white hover:bg-white/[0.08] active:bg-white/[0.14] disabled:opacity-40',
  'secondary-light':
    'border border-ink-900 bg-transparent text-ink-900 before:absolute before:inset-x-0 before:bottom-0 before:h-full before:origin-bottom before:scale-y-0 before:bg-ink-900 before:transition-transform before:duration-fast before:ease-out-expo hover:text-white hover:before:scale-y-100 active:bg-ink-800 disabled:opacity-40',
  ghost:
    'h-auto gap-2 px-0 text-ink-900 underline decoration-gold decoration-1 underline-offset-[6px] hover:text-gold-ink hover:decoration-gold-ink',
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Adds a lucide arrow that translates 4px on hover. */
  withArrow?: boolean;
  arrow?: 'right' | 'up-right';
  loading?: boolean;
  loadingLabel?: string;
  className?: string;
  children: ReactNode;
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonLinkProps = CommonProps & {
  href: string;
  external?: boolean;
  'aria-label'?: string;
  download?: boolean | string;
  onClick?: () => void;
  tabIndex?: number;
  id?: string;
};

function content({
  children,
  withArrow,
  arrow,
  loading,
  loadingLabel,
}: Pick<CommonProps, 'children' | 'withArrow' | 'arrow' | 'loading' | 'loadingLabel'>) {
  if (loading) {
    return (
      <span className="relative z-10 inline-flex items-center gap-[10px]">
        <Loader2 aria-hidden="true" className="h-[14px] w-[14px] animate-spin" strokeWidth={1.5} />
        {loadingLabel ?? 'Sending'}
      </span>
    );
  }

  const Icon = arrow === 'up-right' ? ArrowUpRight : ArrowRight;

  return (
    <span className="relative z-10 inline-flex items-center gap-[10px]">
      {children}
      {withArrow ? (
        <Icon
          aria-hidden="true"
          strokeWidth={1.5}
          className="h-4 w-4 transition-transform duration-fast ease-out-expo group-hover/btn:translate-x-1"
        />
      ) : null}
    </span>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    withArrow = false,
    arrow = 'right',
    loading = false,
    loadingLabel,
    className,
    children,
    disabled,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(BASE, variant !== 'ghost' && SIZES[size], VARIANTS[variant], className)}
      {...rest}
    >
      {content({ children, withArrow, arrow, loading, loadingLabel })}
    </button>
  );
});

export function ButtonLink({
  href,
  external = false,
  variant = 'primary',
  size = 'md',
  withArrow = false,
  arrow = 'right',
  className,
  children,
  download,
  onClick,
  ...rest
}: ButtonLinkProps) {
  const classes = cn(BASE, variant !== 'ghost' && SIZES[size], VARIANTS[variant], className);
  const inner = content({ children, withArrow, arrow });

  if (external || href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')) {
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        download={download}
        {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} onClick={onClick} {...rest}>
      {inner}
    </Link>
  );
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
  onDark?: boolean;
  className?: string;
}

/** 44x44 hairline square. Slider arrows, gallery controls, back-to-top. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, children, onDark = false, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      className={cn(
        'inline-flex h-11 w-11 items-center justify-center rounded-none border transition-colors duration-fast ease-out-expo disabled:opacity-35',
        onDark
          ? 'border-white/25 text-white hover:border-white hover:bg-white/10'
          : 'border-line text-ink-900 hover:border-ink-900 hover:bg-ink-900 hover:text-white',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
});

/** Ghost text link with the gold underline that extends on hover. */
export function TextLink({
  href,
  children,
  className,
  external = false,
  arrow = true,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
  arrow?: boolean;
}) {
  const inner = (
    <>
      <span className="relative">
        {children}
        <span className="absolute -bottom-[6px] left-0 h-px w-0 bg-current transition-[width] duration-base ease-out-expo group-hover/link:w-full" />
        <span className="absolute -bottom-[6px] left-0 h-px w-6 bg-gold transition-opacity duration-fast group-hover/link:opacity-0" />
      </span>
      {arrow ? (
        <ArrowRight
          aria-hidden="true"
          strokeWidth={1.5}
          className="h-4 w-4 transition-transform duration-fast ease-out-expo group-hover/link:translate-x-1"
        />
      ) : null}
    </>
  );

  const classes = cn(
    // min-h-11 below lg: a TextLink is a call to action at the end of a block,
    // not a word inside a sentence, so it has to be thumb-sized. Above lg the
    // underline sits tight to the type, which is where it belongs on a pointer
    // device.
    'group/link inline-flex min-h-11 items-center gap-[10px] font-mono text-[13px] font-medium uppercase tracking-[0.1em] transition-colors duration-fast hover:text-gold-ink lg:min-h-0',
    className,
  );

  if (external || href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')) {
    return (
      <a
        href={href}
        className={classes}
        {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}
