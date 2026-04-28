'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Logo } from '@/components/ui/Logo';
import { cn } from '@/lib/cn';

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

const NAV: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Bookings',
    href: '/bookings',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-6l-2 3h-4l-2-3H2" />
        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" />
      </svg>
    ),
  },
  {
    label: 'Venues',
    href: '/venues',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
  },
  {
    label: 'Sync',
    href: '/sync',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-[260px] flex-shrink-0 flex-col border-r border-klano-border bg-klano-surface">
      <div className="px-6 py-6 border-b border-klano-border">
        <Logo size={22} />
      </div>

      {/* Band switcher placeholder */}
      <div className="px-3 py-3 border-b border-klano-border">
        <button
          type="button"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-left hover:bg-klano-surface-2 transition-colors"
        >
          <span className="w-7 h-7 rounded-full bg-klano-text text-klano-action-fg inline-flex items-center justify-center text-[11px] font-semibold">
            HN
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-[13px] font-semibold text-klano-text truncate">Halbnacht</span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.06em] text-klano-text-3">
              Indie · ZRH
            </span>
          </span>
          <svg className="text-klano-text-3 flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="m7 9 5-5 5 5M7 15l5 5 5-5" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href as never}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[14px] transition-colors',
                active
                  ? 'bg-klano-surface-2 text-klano-text font-medium'
                  : 'text-klano-text-2 hover:text-klano-text hover:bg-klano-surface-2/60',
              )}
            >
              <span className="inline-flex items-center justify-center w-4 h-4 [&>svg]:w-4 [&>svg]:h-4">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-klano-border">
        <div className="px-3 py-2 flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-klano-surface-2 border border-klano-border inline-flex items-center justify-center text-[10px] font-semibold text-klano-text-2">
            P
          </span>
          <div className="flex-1 min-w-0">
            <span className="block text-[12px] font-medium text-klano-text truncate">Pascal</span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.06em] text-klano-text-3">
              Owner
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
