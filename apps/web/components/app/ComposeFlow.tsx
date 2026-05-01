'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { STATIC_VENUES, type StaticVenue } from '@/lib/onboarding/venues-static';
import { cn } from '@/lib/cn';

type Phase = 'pick' | 'drafting' | 'ready' | 'sending' | 'sent' | 'error';

const SAMPLE_BAND = {
  name: 'Halbnacht',
  genres: ['Indie', 'Singer-Songwriter'],
  region: 'Zürich',
  ambition: 'semi_pro' as const,
};

/** Splits a Claude/template response of `Subject\n\nBody` into parts. */
function splitDraft(text: string): { subject: string; body: string } {
  const trimmed = text.replace(/^[\s\n]+/, '');
  const idx = trimmed.indexOf('\n\n');
  if (idx === -1) return { subject: trimmed, body: '' };
  return { subject: trimmed.slice(0, idx).trim(), body: trimmed.slice(idx + 2).trimStart() };
}

export function ComposeFlow() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('pick');
  const [query, setQuery] = useState('');
  const [venue, setVenue] = useState<StaticVenue | null>(null);

  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [streamedSubject, setStreamedSubject] = useState('');
  const [streamedBody, setStreamedBody] = useState('');

  const matches = useMemo(() => {
    if (!query.trim()) return STATIC_VENUES.slice(0, 6);
    const q = query.toLowerCase();
    return STATIC_VENUES.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.city.toLowerCase().includes(q) ||
        v.genres.some((g) => g.toLowerCase().includes(q)),
    ).slice(0, 6);
  }, [query]);

  function pickVenue(v: StaticVenue) {
    setVenue(v);
    setQuery(v.name);
    setPhase('drafting');
  }

  // Stream the draft from /api/agent/draft on entering 'drafting' phase.
  const abortRef = useRef<AbortController | null>(null);
  const [source, setSource] = useState<string>('');
  useEffect(() => {
    if (phase !== 'drafting' || !venue) return;
    const ac = new AbortController();
    abortRef.current = ac;
    setStreamedSubject('');
    setStreamedBody('');

    (async () => {
      try {
        const res = await fetch('/api/agent/draft', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          signal: ac.signal,
          body: JSON.stringify({
            band: {
              name: SAMPLE_BAND.name,
              genres: SAMPLE_BAND.genres,
              region: SAMPLE_BAND.region,
              ambition: SAMPLE_BAND.ambition,
            },
            venue: {
              name: venue.name,
              city: venue.city,
              capacity: venue.capacity,
              genres: venue.genres,
              primaryLanguage: 'de',
            },
            intent: 'first_contact',
          }),
        });
        if (!res.ok || !res.body) throw new Error(`http ${res.status}`);
        setSource(res.headers.get('X-Klano-Source') ?? 'unknown');

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = '';
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          const { subject: s, body: b } = splitDraft(acc);
          setStreamedSubject(s);
          setStreamedBody(b);
        }
        const final = splitDraft(acc);
        setSubject(final.subject);
        setBody(final.body);
        setPhase('ready');
      } catch (e) {
        if ((e as { name?: string }).name === 'AbortError') return;
        console.error('compose stream failed', e);
        setPhase('error');
      }
    })();

    return () => ac.abort();
  }, [phase, venue]);

  async function send() {
    if (!venue) return;
    setPhase('sending');
    try {
      const res = await fetch('/api/bookings/send', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          // TODO v0.7+: read bandId from active band context. For now we
          // rely on the API resolving 'first owned band of caller', so we
          // pass the placeholder static-id and let server pick if available.
          bandId: 'self',
          venueId: venue.id,
          to: `bookings@${venue.name.toLowerCase().replace(/\s+/g, '')}.ch`,
          subject,
          body,
        }),
      });
      if (!res.ok && res.status !== 502) throw new Error(`http ${res.status}`);
      // 502 = mail-send returned an error but booking row was created.
      // Treat both as "sent enough to move to /bookings".
      setPhase('sent');
      setTimeout(() => router.push('/bookings' as never), 1200);
    } catch (e) {
      console.error('send failed', e);
      setPhase('error');
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr]">
      {/* LEFT — Venue */}
      <aside className="space-y-6">
        <SectionLabel num="01" label="Venue" />

        <div>
          <Input
            placeholder="Venue suchen…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (phase !== 'pick') setPhase('pick');
            }}
            autoFocus
          />
          {phase === 'pick' && (
            <ul className="mt-2 flex flex-col gap-1">
              {matches.map((v) => (
                <li key={v.id}>
                  <button
                    type="button"
                    onClick={() => pickVenue(v)}
                    className="w-full text-left px-4 py-3 rounded-[10px] border border-transparent hover:bg-klano-surface hover:border-klano-border transition-colors"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[14px] font-medium text-klano-text">{v.name}</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-klano-text-3">
                        {v.country}
                      </span>
                    </div>
                    <p className="font-mono text-[11px] text-klano-text-3 mt-0.5">
                      {v.city} · Cap {v.capacity} · {v.genres.slice(0, 2).join('/')}
                    </p>
                  </button>
                </li>
              ))}
              {matches.length === 0 && (
                <li className="px-4 py-3 text-[13px] text-klano-text-3 italic">
                  Kein Treffer.
                </li>
              )}
            </ul>
          )}
        </div>

        {venue && phase !== 'pick' && (
          <div className="bg-klano-surface border border-klano-border rounded-[14px] p-5">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-[16px] font-semibold text-klano-text tracking-tight">
                {venue.name}
              </h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-klano-text-3">
                {venue.country}
              </span>
            </div>
            <p className="font-mono text-[11px] text-klano-text-3 mt-1">{venue.city}</p>
            <dl className="mt-4 grid grid-cols-2 gap-y-2 gap-x-4 text-[13px]">
              <dt className="text-klano-text-3 font-mono text-[11px] uppercase tracking-[0.06em]">Cap</dt>
              <dd className="text-klano-text">{venue.capacity}</dd>
              <dt className="text-klano-text-3 font-mono text-[11px] uppercase tracking-[0.06em]">Genres</dt>
              <dd className="text-klano-text">{venue.genres.slice(0, 3).join(', ')}</dd>
              <dt className="text-klano-text-3 font-mono text-[11px] uppercase tracking-[0.06em]">Region</dt>
              <dd className="text-klano-text">{venue.region}</dd>
            </dl>
          </div>
        )}
      </aside>

      {/* RIGHT — Draft */}
      <section>
        <SectionLabel num="02" label="Mail" />

        {phase === 'pick' && (
          <div className="mt-6 bg-klano-surface border border-dashed border-klano-border rounded-[16px] p-12 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3">
              Wähl ein Venue links — Klano draftet die Mail.
            </p>
          </div>
        )}

        {phase === 'error' && venue && (
          <div className="mt-6 bg-klano-surface border border-klano-danger/30 rounded-[16px] p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-danger mb-2">
              Draft fehlgeschlagen
            </p>
            <p className="text-[13px] text-klano-text-2 mb-4">
              Klano konnte gerade keine Mail draften. Versuch's nochmal — sonst nutzen wir die Vorlage.
            </p>
            <Button size="sm" onClick={() => setPhase('drafting')}>
              Erneut versuchen
            </Button>
          </div>
        )}
        {(phase === 'drafting' || phase === 'ready' || phase === 'sending' || phase === 'sent') &&
          venue && (
            <div className="mt-6 bg-klano-surface border border-klano-border rounded-[16px] overflow-hidden">
              {/* Mail header */}
              <div className="px-5 py-4 border-b border-klano-border flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={cn(
                      'w-1.5 h-1.5 rounded-full',
                      phase === 'drafting'
                        ? 'bg-klano-success animate-pulse'
                        : phase === 'sent'
                          ? 'bg-klano-success'
                          : 'bg-klano-border-strong',
                    )}
                  />
                  <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3">
                    {phase === 'drafting' && 'Klano draftet …'}
                    {phase === 'ready' && 'Bereit zum Senden'}
                    {phase === 'sending' && 'Sende …'}
                    {phase === 'sent' && 'Gesendet'}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-klano-text-3 truncate">
                  {source === 'anthropic' ? 'Claude' : source === 'fallback' || source === 'fallback-after-error' ? 'Vorlage' : 'An'}: bookings@{venue.name.toLowerCase().replace(/\s+/g, '')}.ch
                </span>
              </div>

              {/* Subject */}
              <div className="px-5 py-3 border-b border-klano-border">
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-klano-text-3 mr-3">
                  Betreff
                </span>
                {phase === 'drafting' ? (
                  <span className="text-[14px] text-klano-text">
                    {streamedSubject}
                    <span className="caret" />
                  </span>
                ) : (
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={phase !== 'ready'}
                    className="bg-transparent text-[14px] text-klano-text outline-none w-[80%]"
                  />
                )}
              </div>

              {/* Body */}
              <div className="p-5">
                {phase === 'drafting' ? (
                  <pre className="whitespace-pre-wrap font-sans text-[14px] leading-[1.6] text-klano-text">
                    {streamedBody}
                    <span className="caret" />
                  </pre>
                ) : (
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    disabled={phase !== 'ready'}
                    rows={14}
                    className="w-full bg-transparent text-[14px] leading-[1.6] text-klano-text outline-none resize-none disabled:cursor-default"
                  />
                )}
              </div>

              {/* Actions */}
              <div className="px-5 py-4 border-t border-klano-border flex items-center justify-between gap-3">
                <p className="font-mono text-[11px] text-klano-text-3">
                  {phase === 'drafting' && 'Du kannst gleich editieren.'}
                  {phase === 'ready' && 'Editiert? Dann ab damit.'}
                  {phase === 'sending' && 'Resend Outbox …'}
                  {phase === 'sent' && '↳ Booking wurde angelegt.'}
                </p>
                <div className="flex items-center gap-2">
                  {phase === 'ready' && (
                    <Button variant="ghost" size="sm" onClick={() => setPhase('drafting')}>
                      Neu draften
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={send}
                    disabled={phase !== 'ready'}
                  >
                    {phase === 'sending' ? '…' : phase === 'sent' ? '✓ Gesendet' : 'Senden'}
                  </Button>
                </div>
              </div>
            </div>
          )}

        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3">
          Streaming-Draft via Claude · Resend-Outbox · Tracking · v0.5
        </p>
      </section>

      <style jsx>{`
        .caret {
          display: inline-block;
          width: 7px;
          height: 1.05em;
          margin-left: 1px;
          vertical-align: -2px;
          background: var(--color-klano-text);
          animation: blink 0.9s step-end infinite;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .caret { animation: none; }
        }
      `}</style>
    </div>
  );
}
