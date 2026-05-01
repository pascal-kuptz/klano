import Link from 'next/link';
import { Topbar } from '@/components/app/Topbar';
import { ButtonLink } from '@/components/ui/Button';
import { BOOKING_LIST, type Status } from '@/lib/booking-mocks';

export const metadata = { title: 'Bookings' };

const COLUMNS: { id: Status; label: string }[] = [
  { id: 'drafted', label: 'Drafted' },
  { id: 'sent', label: 'Sent' },
  { id: 'opened', label: 'Opened' },
  { id: 'replied', label: 'Replied' },
  { id: 'booked', label: 'Booked' },
];

export default function BookingsPage() {
  const repliedCount = BOOKING_LIST.filter((b) => b.status === 'replied').length;
  return (
    <>
      <Topbar
        title="Bookings"
        subtitle={`${BOOKING_LIST.length} aktiv${repliedCount ? ` · ${repliedCount} neue Antwort${repliedCount === 1 ? '' : 'en'}` : ''}`}
        action={<ButtonLink href="/bookings/new" size="sm">+ Neue Outreach</ButtonLink>}
      />

      <main className="px-6 md:px-10 py-10">
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {COLUMNS.map((col) => {
            const items = BOOKING_LIST.filter((c) => c.status === col.id);
            return (
              <section
                key={col.id}
                className="bg-klano-surface border border-klano-border rounded-[16px] p-4 min-h-[280px] flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3">
                    {col.label}
                  </span>
                  <span className="font-mono text-[11px] text-klano-text-3 tabular-nums">
                    {items.length}
                  </span>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  {items.map((c) => (
                    <Link
                      key={c.id}
                      href={`/bookings/${c.id}` as never}
                      className={`block rounded-[10px] border p-3 transition-colors no-underline ${
                        c.status === 'replied'
                          ? 'bg-klano-success/5 border-klano-success/30 hover:border-klano-success/50'
                          : 'bg-klano-canvas border-klano-border hover:border-klano-border-strong'
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <span className="font-semibold text-[13px] text-klano-text">{c.venue.name}</span>
                        <span className="font-mono text-[10px] text-klano-text-2 tabular-nums">{c.match}%</span>
                      </div>
                      <p className="font-mono text-[10px] text-klano-text-3 mb-2">{c.venue.city}</p>
                      <p className="font-mono text-[10px] text-klano-text-3 pt-2 border-t border-dashed border-klano-border">
                        {c.meta}
                      </p>
                    </Link>
                  ))}
                  {items.length === 0 && (
                    <p className="text-[12px] text-klano-text-3 italic mt-4 text-center">leer</p>
                  )}
                </div>
              </section>
            );
          })}
        </div>

        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3">
          Drag & drop · Manuelle Status-Override · v0.4
        </p>
      </main>
    </>
  );
}
