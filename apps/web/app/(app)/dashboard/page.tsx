import { Topbar } from '@/components/app/Topbar';
import { InviteCard, type PendingMember } from '@/components/app/InviteCard';
import { Button, ButtonLink } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { getUser } from '@/lib/supabase/server';

// TODO v0.4: read from `bands.pending_members` for the active band.
// Static placeholder until that wiring lands.
const PENDING_MEMBERS: PendingMember[] = [
  { name: 'Léa', instrument: 'Vocals' },
  { name: 'David', instrument: 'Drums' },
  { name: 'Marc', instrument: 'Bass' },
];

export const metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const user = await getUser();
  const firstName =
    (user?.user_metadata?.full_name as string | undefined)?.split(' ')[0] ??
    user?.email?.split('@')[0] ??
    'Gast';

  return (
    <>
      <Topbar
        title={`Hi ${firstName}`}
        subtitle="Halbnacht · Frühling 2026"
        action={
          <ButtonLink href="/bookings/new" size="sm">
            + Neue Outreach
          </ButtonLink>
        }
      />

      <main className="px-6 md:px-10 py-10 max-w-[1280px] w-full">
        {/* Stats row */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {[
            { num: '6', label: 'aktive Outreaches', meta: '+2 diese Woche' },
            { num: '1', label: 'neue Antwort', meta: 'Helsinki — vor 2h' },
            { num: '3', label: 'Gigs gebucht', meta: 'Q2 2026' },
            { num: '94%', label: 'Match-Rate', meta: 'top quartil' },
          ].map((s) => (
            <article
              key={s.label}
              className="bg-klano-surface border border-klano-border rounded-[16px] p-5"
            >
              <div
                className="text-klano-text leading-none mb-2"
                style={{
                  fontFamily: 'Instrument Serif, Georgia, serif',
                  fontWeight: 400,
                  fontSize: 'clamp(2rem, 3vw, 2.5rem)',
                }}
              >
                {s.num}
              </div>
              <p className="text-[13px] text-klano-text-2">{s.label}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-klano-text-3 mt-1">
                {s.meta}
              </p>
            </article>
          ))}
        </section>

        {/* Activity + Quick actions */}
        <section className="grid gap-5 lg:grid-cols-[7fr_5fr]">
          {/* Activity log */}
          <div className="bg-klano-surface border border-klano-border rounded-[16px]">
            <div className="px-6 py-5 border-b border-klano-border flex items-center justify-between">
              <SectionLabel num="01" label="Activity" />
              <button
                type="button"
                className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 hover:text-klano-text transition-colors"
              >
                Alles ansehen
              </button>
            </div>
            <ul className="divide-y divide-klano-border">
              {[
                { time: '06:14', verb: 'gefunden', body: '3 Venues — Bogen F · Mascotte · Sender' },
                { time: '06:21', verb: 'geschrieben', body: 'Outreach an Bogen F (94% Match)' },
                { time: '08:03', verb: 'erkannt', body: 'Reply von Helsinki: positiv, 17. Mai' },
                { time: '09:47', verb: 'erinnert', body: 'Léa & David: Probe morgen 19:30' },
                { time: '11:42', verb: 'nachgehakt', body: 'Sender (7 Tage ohne Antwort)' },
              ].map((row) => (
                <li
                  key={row.time + row.body}
                  className="px-6 py-4 grid grid-cols-[60px_8px_1fr] gap-3 items-baseline"
                >
                  <span className="font-mono text-[12px] text-klano-text-3">{row.time}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-klano-border-strong self-center" />
                  <div className="flex flex-wrap gap-2 items-baseline">
                    <span
                      className="text-klano-text"
                      style={{
                        fontFamily: 'Instrument Serif, Georgia, serif',
                        fontStyle: 'italic',
                        fontWeight: 400,
                        fontSize: '15px',
                      }}
                    >
                      {row.verb}
                    </span>
                    <span className="text-[13px] text-klano-text-2">{row.body}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right column: invite card + beta */}
          <div className="flex flex-col gap-5">
            <InviteCard members={PENDING_MEMBERS} />

            <div className="bg-klano-text text-klano-action-fg rounded-[16px] p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/50 mb-3">
                Beta · 50 Plätze
              </p>
              <p
                className="text-white leading-[1.15] mb-4"
                style={{
                  fontFamily: 'Instrument Serif, Georgia, serif',
                  fontWeight: 400,
                  fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
                  letterSpacing: '-0.02em',
                }}
              >
                Du bist Teil der Closed Beta.
              </p>
              <p className="text-white/70 text-[13px] leading-[1.5] mb-5">
                Wöchentliche Calls, direkter Einfluss aufs Produkt. Nach Beta: 6 Monate Pro gratis.
              </p>
              <Button variant="secondary" size="sm" className="!bg-white !text-klano-text !border-white">
                Beta-Doku ansehen
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
