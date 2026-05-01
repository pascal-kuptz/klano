import { Topbar } from '@/components/app/Topbar';
import { ButtonLink } from '@/components/ui/Button';

export const metadata = { title: 'Bookings' };

type Status = 'drafted' | 'sent' | 'opened' | 'replied' | 'booked';

interface Card {
  venue: string;
  city: string;
  match: string;
  meta: string;
  status: Status;
}

const COLUMNS: { id: Status; label: string }[] = [
  { id: 'drafted', label: 'Drafted' },
  { id: 'sent', label: 'Sent' },
  { id: 'opened', label: 'Opened' },
  { id: 'replied', label: 'Replied' },
  { id: 'booked', label: 'Booked' },
];

const CARDS: Card[] = [
  { venue: 'Kammgarn', city: 'Schaffhausen', match: '76%', meta: 'Klano schreibt …', status: 'drafted' },
  { venue: 'Mascotte', city: 'Zürich', match: '89%', meta: 'Sent · vor 2 Tagen', status: 'sent' },
  { venue: 'Sender', city: 'Winterthur', match: '87%', meta: 'Sent · vor 7 Tagen', status: 'sent' },
  { venue: 'Bogen F', city: 'Zürich', match: '94%', meta: 'Geöffnet · gestern 18:42', status: 'opened' },
  { venue: 'Helsinki', city: 'Zürich', match: '81%', meta: '17. Mai · 800 CHF', status: 'replied' },
];

export default function BookingsPage() {
  return (
    <>
      <Topbar
        title="Bookings"
        subtitle="6 aktiv · 1 neue Antwort"
        action={<ButtonLink href="/bookings/new" size="sm">+ Neue Outreach</ButtonLink>}
      />

      <main className="px-6 md:px-10 py-10">
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {COLUMNS.map((col) => {
            const items = CARDS.filter((c) => c.status === col.id);
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
                    <article
                      key={c.venue}
                      className={`rounded-[10px] border p-3 transition-colors ${
                        c.status === 'replied'
                          ? 'bg-klano-success/5 border-klano-success/30'
                          : 'bg-klano-canvas border-klano-border hover:border-klano-border-strong'
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <span className="font-semibold text-[13px] text-klano-text">{c.venue}</span>
                        <span className="font-mono text-[10px] text-klano-text-2 tabular-nums">{c.match}</span>
                      </div>
                      <p className="font-mono text-[10px] text-klano-text-3 mb-2">{c.city}</p>
                      <p className="font-mono text-[10px] text-klano-text-3 pt-2 border-t border-dashed border-klano-border">
                        {c.meta}
                      </p>
                    </article>
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
          Drag & drop · Detail-View · Manuelle Status-Override · v0.4
        </p>
      </main>
    </>
  );
}
