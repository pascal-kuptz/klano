import Link from 'next/link';
import { Topbar } from '@/components/app/Topbar';

const TABS = [
  { href: '/settings/band', label: 'Band' },
  { href: '/settings/profile', label: 'Profil' },
  { href: '/settings/billing', label: 'Billing' },
] as const;

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Topbar title="Settings" subtitle="Band · Profil · Subscription" />
      <main className="px-6 md:px-10 py-10 max-w-[900px]">
        <nav className="flex items-center gap-1 border-b border-klano-border mb-10">
          {TABS.map((t) => (
            <Link
              key={t.href}
              href={t.href as never}
              className="px-4 h-10 inline-flex items-center text-[13px] text-klano-text-2 hover:text-klano-text border-b border-transparent hover:border-klano-text transition-colors -mb-px"
            >
              {t.label}
            </Link>
          ))}
        </nav>
        {children}
      </main>
    </>
  );
}
