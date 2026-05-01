import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Topbar } from '@/components/app/Topbar';
import { Button, ButtonLink } from '@/components/ui/Button';
import { BOOKINGS, type Status } from '@/lib/booking-mocks';

interface Props {
  params: Promise<{ id: string }>;
}

const STATUS_LABEL: Record<Status, string> = {
  drafted: 'Drafted',
  sent: 'Sent',
  opened: 'Opened',
  replied: 'Replied',
  booked: 'Booked',
};

const STATUS_TONE: Record<Status, string> = {
  drafted: 'bg-klano-surface-2 text-klano-text-2 border-klano-border',
  sent: 'bg-klano-surface-2 text-klano-text-2 border-klano-border',
  opened: 'bg-klano-info/10 text-klano-info border-klano-info/30',
  replied: 'bg-klano-success/10 text-klano-success border-klano-success/30',
  booked: 'bg-klano-text text-klano-action-fg border-klano-text',
};

function formatDateTime(iso: string, locale = 'de-CH') {
  return new Date(iso).toLocaleString(locale, {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function BookingDetailPage({ params }: Props) {
  const { id } = await params;
  const booking = BOOKINGS[id];
  if (!booking) notFound();

  return (
    <>
      <Topbar
        title={booking.venue.name}
        subtitle={`${booking.venue.city} · Cap ${booking.venue.capacity} · Match ${booking.match}%`}
        action={
          <Link
            href={'/bookings' as never}
            className="text-[13px] text-klano-text-2 hover:text-klano-text transition-colors"
          >
            ← Alle Bookings
          </Link>
        }
      />

      <main className="px-6 md:px-10 py-10 max-w-[1200px] w-full">
        <div className="grid gap-6 lg:grid-cols-[5fr_7fr]">
          {/* LEFT — Venue + meta */}
          <aside className="flex flex-col gap-4">
            {/* Status pill */}
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center justify-center h-6 px-3 rounded-full border font-mono text-[10px] uppercase tracking-[0.06em] ${STATUS_TONE[booking.status]}`}
              >
                {STATUS_LABEL[booking.status]}
              </span>
              <span className="font-mono text-[11px] text-klano-text-3">
                erstellt {formatDateTime(booking.createdAt)}
              </span>
            </div>

            {/* Venue card */}
            <article className="bg-klano-surface border border-klano-border rounded-[16px] p-6">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 mb-4">
                Venue
              </h3>
              <h2
                className="text-klano-text leading-[1.05] mb-1"
                style={{
                  fontFamily: 'Instrument Serif, Georgia, serif',
                  fontWeight: 400,
                  fontSize: '28px',
                  letterSpacing: '-0.015em',
                }}
              >
                {booking.venue.name}
              </h2>
              <p className="font-mono text-[11px] text-klano-text-3 mb-5">
                {booking.venue.city} · {booking.venue.country}
              </p>

              <dl className="grid grid-cols-2 gap-y-3 text-[13px]">
                <dt className="text-klano-text-3 font-mono text-[10px] uppercase tracking-[0.06em]">
                  Cap
                </dt>
                <dd className="text-klano-text">{booking.venue.capacity}</dd>
                <dt className="text-klano-text-3 font-mono text-[10px] uppercase tracking-[0.06em]">
                  Genres
                </dt>
                <dd className="text-klano-text">{booking.venue.genres.slice(0, 3).join(', ')}</dd>
                <dt className="text-klano-text-3 font-mono text-[10px] uppercase tracking-[0.06em]">
                  Region
                </dt>
                <dd className="text-klano-text">{booking.venue.region}</dd>
                <dt className="text-klano-text-3 font-mono text-[10px] uppercase tracking-[0.06em]">
                  Match
                </dt>
                <dd className="text-klano-text font-medium tabular-nums">{booking.match}%</dd>
                {booking.desiredDate && (
                  <>
                    <dt className="text-klano-text-3 font-mono text-[10px] uppercase tracking-[0.06em]">
                      Wunsch-Datum
                    </dt>
                    <dd className="text-klano-text">
                      {new Date(booking.desiredDate).toLocaleDateString('de-CH', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </dd>
                  </>
                )}
                {booking.agreedFee && (
                  <>
                    <dt className="text-klano-text-3 font-mono text-[10px] uppercase tracking-[0.06em]">
                      Gage
                    </dt>
                    <dd className="text-klano-text font-medium">{booking.agreedFee} CHF</dd>
                  </>
                )}
              </dl>
            </article>

            {/* Actions */}
            <article className="bg-klano-surface border border-klano-border rounded-[16px] p-6">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 mb-4">
                Aktionen
              </h3>
              <div className="flex flex-col gap-2">
                {booking.status === 'replied' && (
                  <Button size="sm" className="!w-full !justify-start">
                    Als gebucht markieren
                  </Button>
                )}
                <ButtonLink
                  href="/bookings/new"
                  variant="secondary"
                  size="sm"
                  className="!w-full !justify-start"
                >
                  Antwort entwerfen
                </ButtonLink>
                <Button variant="secondary" size="sm" className="!w-full !justify-start">
                  Jetzt nachhaken
                </Button>
                <Button variant="ghost" size="sm" className="!w-full !justify-start !text-klano-text-2">
                  Archivieren
                </Button>
              </div>
              <p className="mt-4 font-mono text-[11px] text-klano-text-3">
                Status-Override · v0.4 wired
              </p>
            </article>
          </aside>

          {/* RIGHT — Email thread */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3">
                Mail-Verlauf
              </h3>
              <span className="font-mono text-[11px] text-klano-text-3 tabular-nums">
                {booking.thread.length} {booking.thread.length === 1 ? 'Nachricht' : 'Nachrichten'}
              </span>
            </div>

            {booking.thread.length === 0 ? (
              <div className="bg-klano-surface border border-dashed border-klano-border rounded-[16px] p-12 text-center">
                <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3">
                  Klano draftet gerade…
                </p>
              </div>
            ) : (
              <ol className="flex flex-col gap-4">
                {booking.thread.map((msg, i) => (
                  <li key={i}>
                    <article
                      className={`rounded-[14px] border overflow-hidden ${
                        msg.direction === 'inbound'
                          ? 'bg-klano-surface border-klano-success/30'
                          : 'bg-klano-surface border-klano-border'
                      }`}
                    >
                      <header className="flex items-center justify-between gap-3 px-5 py-3 border-b border-klano-border">
                        <span className="inline-flex items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              msg.direction === 'inbound'
                                ? 'bg-klano-success'
                                : 'bg-klano-text-3'
                            }`}
                          />
                          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-klano-text-3">
                            {msg.direction === 'inbound' ? 'Eingang' : 'Ausgang'}
                          </span>
                        </span>
                        <span className="font-mono text-[11px] text-klano-text-3 tabular-nums">
                          {formatDateTime(msg.sentAt)}
                        </span>
                      </header>
                      <div className="px-5 py-4 border-b border-klano-border">
                        <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-klano-text-3">
                          Von
                        </p>
                        <p className="text-[13px] text-klano-text mt-1">{msg.from}</p>
                        <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-klano-text-3 mt-3">
                          An
                        </p>
                        <p className="text-[13px] text-klano-text mt-1 truncate">{msg.to}</p>
                        <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-klano-text-3 mt-3">
                          Betreff
                        </p>
                        <p className="text-[14px] font-medium text-klano-text mt-1">
                          {msg.subject}
                        </p>
                      </div>
                      <pre className="px-5 py-4 whitespace-pre-wrap font-sans text-[13px] leading-[1.6] text-klano-text">
                        {msg.body}
                      </pre>

                      {msg.classification && (
                        <div className="px-5 py-4 bg-klano-surface-2 border-t border-klano-border">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-klano-success" />
                            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-klano-success">
                              Klano hat erkannt
                            </span>
                          </div>
                          <p className="text-[13px] text-klano-text mb-3">
                            {msg.classification.summary}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            <Tag tone="success">{msg.classification.intent}</Tag>
                            {msg.classification.extractedDate && (
                              <Tag>
                                Datum:{' '}
                                {new Date(msg.classification.extractedDate).toLocaleDateString(
                                  'de-CH',
                                  { day: '2-digit', month: 'short' },
                                )}
                              </Tag>
                            )}
                            {msg.classification.extractedFee && (
                              <Tag>Gage: {msg.classification.extractedFee} CHF</Tag>
                            )}
                            <Tag tone="muted">→ {msg.classification.suggestedAction}</Tag>
                          </div>
                        </div>
                      )}
                    </article>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

function Tag({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'success' | 'muted' }) {
  const cls =
    tone === 'success'
      ? 'bg-klano-success/10 border-klano-success/30 text-klano-success'
      : tone === 'muted'
        ? 'bg-klano-surface border-klano-border text-klano-text-3'
        : 'bg-klano-surface border-klano-border text-klano-text-2';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full border font-mono text-[10px] uppercase tracking-[0.06em] ${cls}`}
    >
      {children}
    </span>
  );
}
