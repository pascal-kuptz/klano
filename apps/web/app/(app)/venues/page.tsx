import { Topbar } from '@/components/app/Topbar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { STATIC_VENUES } from '@/lib/onboarding/venues-static';

export const metadata = { title: 'Venues' };

export default function VenuesPage() {
  return (
    <>
      <Topbar
        title="Venues"
        subtitle={`${STATIC_VENUES.length} Treffer · DACH`}
        action={<Button size="sm" variant="secondary">Filter</Button>}
      />

      <main className="px-6 md:px-10 py-10 max-w-[1200px]">
        <div className="mb-6 max-w-[480px]">
          <Input placeholder="Venue, Stadt, Genre …" />
        </div>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STATIC_VENUES.map((v) => (
            <li
              key={v.id}
              className="bg-klano-surface border border-klano-border rounded-[16px] p-5 hover:border-klano-border-strong transition-colors"
            >
              <div className="flex items-baseline justify-between gap-2 mb-2">
                <h3 className="text-[16px] font-semibold text-klano-text tracking-tight">
                  {v.name}
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-klano-text-3">
                  {v.country}
                </span>
              </div>
              <p className="font-mono text-[11px] text-klano-text-3 mb-4">{v.city}</p>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded-full border border-klano-border text-[11px] text-klano-text-2 font-mono tabular-nums">
                  Cap {v.capacity}
                </span>
                {v.genres.slice(0, 2).map((g) => (
                  <span
                    key={g}
                    className="px-2 py-0.5 rounded-full border border-klano-border text-[11px] text-klano-text-2"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3">
          Suche · Filter · Karten-Ansicht · v0.4
        </p>
      </main>
    </>
  );
}
