'use client';

import dynamic from 'next/dynamic';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { STATIC_VENUES, type StaticVenue } from '@/lib/onboarding/venues-static';
import { cn } from '@/lib/cn';

const VenuesMap = dynamic(() => import('./VenuesMap').then((m) => m.VenuesMap), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[380px] rounded-[16px] border border-klano-border bg-klano-surface-2 flex items-center justify-center">
      <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3">
        Karte lädt …
      </span>
    </div>
  ),
});

export function VenuesView() {
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);

  const filtered = useMemo<StaticVenue[]>(() => {
    if (!query.trim()) return STATIC_VENUES;
    const q = query.toLowerCase();
    return STATIC_VENUES.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.city.toLowerCase().includes(q) ||
        v.country.toLowerCase().includes(q) ||
        v.region.toLowerCase().includes(q) ||
        v.genres.some((g) => g.toLowerCase().includes(q)),
    );
  }, [query]);

  function handleSelect(id: string) {
    setActiveId(id);
    const el = document.getElementById(`venue-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // Clear active after a moment so the highlight doesn't linger forever.
    window.setTimeout(() => setActiveId((curr) => (curr === id ? null : curr)), 2400);
  }

  return (
    <>
      {/* Map */}
      <div className="mb-8">
        <VenuesMap venues={filtered} onSelect={handleSelect} activeId={activeId} />
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 mt-3">
          {filtered.length} sichtbar · Klick auf einen Marker
        </p>
      </div>

      {/* Search row */}
      <div className="mb-6 flex items-center gap-3 max-w-[640px]">
        <Input
          placeholder="Venue, Stadt, Genre …"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button size="md" variant="secondary">
          Filter
        </Button>
      </div>

      {/* Grid */}
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((v) => (
          <li
            key={v.id}
            id={`venue-${v.id}`}
            onMouseEnter={() => setActiveId(v.id)}
            onMouseLeave={() => setActiveId((curr) => (curr === v.id ? null : curr))}
            className={cn(
              'bg-klano-surface border rounded-[16px] p-5 transition-all cursor-default',
              activeId === v.id
                ? 'border-klano-text shadow-[0_0_0_1px_var(--color-klano-text)]'
                : 'border-klano-border hover:border-klano-border-strong',
            )}
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

      {filtered.length === 0 && (
        <p className="text-[13px] text-klano-text-3 italic mt-12 text-center">
          Kein Treffer für „{query}".
        </p>
      )}

      <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3">
        Marker-Cluster · Karten-Filter · v0.4
      </p>
    </>
  );
}
