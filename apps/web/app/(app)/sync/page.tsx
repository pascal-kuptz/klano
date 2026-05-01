import { Topbar } from '@/components/app/Topbar';

export const metadata = { title: 'Sync' };

const MEMBERS = ['Pascal', 'Léa', 'David', 'Marc'] as const;
const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'] as const;
type Status = 'free' | 'busy' | 'tentative';
const GRID: Status[][] = [
  ['busy', 'busy', 'tentative', 'free', 'free', 'busy', 'free'],
  ['free', 'busy', 'tentative', 'free', 'busy', 'busy', 'tentative'],
  ['tentative', 'free', 'free', 'free', 'free', 'busy', 'free'],
  ['busy', 'tentative', 'free', 'free', 'busy', 'free', 'free'],
];
const PROPOSAL_COL = 3;

export default function SyncPage() {
  return (
    <>
      <Topbar title="Sync" subtitle="KW 18 · 4 Mitglieder · 1 Vorschlag" />

      <main className="px-6 md:px-10 py-10 max-w-[900px]">
        <div className="bg-klano-surface border border-klano-border rounded-[20px] p-6 md:p-8">
          {/* Header row */}
          <div className="grid grid-cols-[88px_repeat(7,1fr)] gap-2 items-center mb-3">
            <span />
            {DAYS.map((d, i) => (
              <span
                key={d}
                className={`text-center font-mono text-[10px] uppercase tracking-[0.08em] py-2 rounded-md ${
                  i === PROPOSAL_COL
                    ? 'text-klano-text bg-klano-success/10'
                    : 'text-klano-text-3'
                }`}
              >
                {d}
              </span>
            ))}
          </div>

          {/* Member rows */}
          {MEMBERS.map((name, mi) => (
            <div
              key={name}
              className="grid grid-cols-[88px_repeat(7,1fr)] gap-2 items-center py-2"
            >
              <span className="font-mono text-[11px] text-klano-text">{name}</span>
              {GRID[mi]!.map((status, di) => (
                <span
                  key={di}
                  className={`h-9 rounded-md border ${
                    status === 'free'
                      ? 'bg-klano-success/10 border-klano-success/30'
                      : status === 'tentative'
                        ? 'bg-klano-warning/10 border-klano-warning/30'
                        : 'bg-klano-surface-2 border-klano-border'
                  } ${di === PROPOSAL_COL ? 'ring-1 ring-klano-success/40' : ''}`}
                />
              ))}
            </div>
          ))}

          <div className="mt-6 pt-4 border-t border-klano-border flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-klano-success" />
            <p className="text-[14px] text-klano-text">
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 mr-2">
                Klano:
              </span>
              Donnerstag 19:30 passt für alle.
            </p>
          </div>
        </div>

        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3">
          Eigene Verfügbarkeit eintragen · Vergangenheits-Statistik · Reminders · v0.4
        </p>
      </main>
    </>
  );
}
