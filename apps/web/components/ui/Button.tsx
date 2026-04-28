import Link from 'next/link';
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const variantClass: Record<Variant, string> = {
  primary: 'bg-klano-action text-klano-action-fg hover:bg-klano-action-hover',
  secondary:
    'bg-transparent text-klano-text border border-klano-border hover:bg-klano-surface-2 hover:border-klano-border-strong',
  ghost: 'bg-transparent text-klano-text hover:bg-klano-surface-2',
};

const sizeClass: Record<Size, string> = {
  sm: 'h-9 px-4 text-[13px] gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-6 text-[15px] gap-2',
};

const baseClass =
  'inline-flex items-center justify-center rounded-full font-medium tracking-tight no-underline ' +
  'transition-colors duration-150 cursor-pointer ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klano-text focus-visible:ring-offset-2 focus-visible:ring-offset-klano-canvas ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(baseClass, variantClass[variant], sizeClass[size], className)}
      {...rest}
    >
      {children}
    </button>
  );
});

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href as never}
      className={cn(baseClass, variantClass[variant], sizeClass[size], className)}
    >
      {children}
    </Link>
  );
}
