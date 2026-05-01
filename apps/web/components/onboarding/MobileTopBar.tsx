'use client';

import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

/**
 * Slim top bar shown only on mobile/tablet (<1024px). Replaces the desktop
 * stage's top section so the user still has access to the logo and the
 * sign-in escape hatch when the left column is hidden.
 */
export function MobileTopBar() {
  return (
    <div className="bar">
      <Logo size={22} />
      <Link href={'/sign-in' as never} className="link">
        Schon ein Konto?
      </Link>

      <style jsx>{`
        .bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 56px;
          padding: 0 4px;
          margin-bottom: 24px;
        }
        @media (min-width: 1024px) {
          .bar { display: none; }
        }
        .link {
          font-size: 13px;
          font-weight: 500;
          color: var(--color-klano-text-2);
          text-decoration: none;
          padding: 8px 14px;
          border-radius: 9999px;
          transition: color 150ms, background 150ms;
        }
        .link:hover {
          color: var(--color-klano-text);
          background: var(--color-klano-surface-2);
        }
      `}</style>
    </div>
  );
}
