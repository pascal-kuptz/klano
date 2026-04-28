import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          'h-12 w-full px-4 bg-klano-surface border border-klano-border rounded-[10px]',
          'text-klano-text placeholder:text-klano-text-3 text-base',
          'outline-none transition-colors',
          'focus:border-klano-text',
          className,
        )}
        {...rest}
      />
    );
  },
);
