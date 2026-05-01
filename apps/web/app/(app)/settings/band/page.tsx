import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const metadata = { title: 'Band Settings' };

export default function BandSettingsPage() {
  return (
    <div className="flex flex-col gap-12">
      <FieldGroup label="Bandname">
        <Input defaultValue="Halbnacht" />
      </FieldGroup>

      <FieldGroup label="Genre">
        <div className="flex flex-wrap gap-2">
          {['Indie', 'Rock', 'Singer-Songwriter'].map((g) => (
            <span
              key={g}
              className="h-9 px-4 inline-flex items-center rounded-full bg-klano-text text-klano-action-fg text-sm"
            >
              {g}
            </span>
          ))}
          <button
            type="button"
            className="h-9 px-4 inline-flex items-center rounded-full border border-dashed border-klano-border text-sm text-klano-text-2 hover:text-klano-text"
          >
            + Genre
          </button>
        </div>
      </FieldGroup>

      <FieldGroup label="Region">
        <p className="text-[14px] text-klano-text">CH · Zürich · Winterthur</p>
      </FieldGroup>

      <FieldGroup label="Anspruch">
        <div className="flex gap-2">
          {(['hobby', 'semi_pro', 'pro'] as const).map((a) => (
            <span
              key={a}
              className={`h-9 px-4 inline-flex items-center rounded-full text-sm border ${
                a === 'semi_pro'
                  ? 'bg-klano-text text-klano-action-fg border-klano-text'
                  : 'bg-klano-surface text-klano-text-2 border-klano-border'
              }`}
            >
              {a.replace('_', '-')}
            </span>
          ))}
        </div>
      </FieldGroup>

      <FieldGroup label="Bandkollegen">
        <ul className="flex flex-col gap-2">
          {[
            { name: 'Pascal', role: 'leader', instrument: 'Vocals · Guitar' },
            { name: 'Léa', role: 'member', instrument: 'Vocals' },
            { name: 'David', role: 'member', instrument: 'Drums' },
          ].map((m) => (
            <li
              key={m.name}
              className="flex items-center gap-3 py-2 px-3 rounded-[10px] bg-klano-surface border border-klano-border"
            >
              <span className="w-7 h-7 rounded-full bg-klano-text text-klano-action-fg inline-flex items-center justify-center text-[11px] font-semibold">
                {m.name[0]}
              </span>
              <div className="flex-1 min-w-0">
                <span className="block text-[13px] font-medium text-klano-text">{m.name}</span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.06em] text-klano-text-3">
                  {m.role} · {m.instrument}
                </span>
              </div>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="mt-3 inline-flex items-center gap-2 text-[13px] text-klano-text-2 hover:text-klano-text"
        >
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full border border-klano-border">+</span>
          Mitglied einladen
        </button>
      </FieldGroup>

      <div className="flex items-center gap-3 pt-4 border-t border-klano-border">
        <Button>Speichern</Button>
        <Button variant="ghost">Abbrechen</Button>
      </div>
    </div>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 mb-3">
        {label}
      </h3>
      {children}
    </section>
  );
}
