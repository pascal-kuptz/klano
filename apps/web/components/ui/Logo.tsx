import Link from 'next/link';
import { cn } from '@/lib/cn';

export function Logo({
  href = '/',
  size = 22,
  className,
}: {
  href?: string;
  size?: number;
  className?: string;
}) {
  return (
    <Link
      href={href as never}
      aria-label="Klano"
      className={cn(
        'inline-flex items-center font-display tracking-[-0.025em] text-klano-text no-underline leading-none',
        className,
      )}
      style={{ fontSize: `${size}px`, fontFamily: 'Instrument Serif, Georgia, serif', fontWeight: 400 }}
    >
      klano
    </Link>
  );
}
