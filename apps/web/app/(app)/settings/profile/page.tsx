import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getUser } from '@/lib/supabase/server';

export const metadata = { title: 'Profile Settings' };

export default async function ProfileSettingsPage() {
  const user = await getUser();
  const email = user?.email ?? '—';
  const fullName = (user?.user_metadata?.full_name as string | undefined) ?? '';

  return (
    <div className="flex flex-col gap-12">
      <FieldGroup label="E-Mail">
        <p className="text-[14px] text-klano-text">{email}</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-klano-text-3 mt-2">
          Login via Magic-Link · Änderung im Support
        </p>
      </FieldGroup>

      <FieldGroup label="Name">
        <Input defaultValue={fullName} placeholder="Vorname Nachname" />
      </FieldGroup>

      <FieldGroup label="Instrument">
        <Input placeholder="z.B. Vocals · Guitar" />
      </FieldGroup>

      <FieldGroup label="Sprache">
        <div className="flex gap-2">
          {(['de', 'en'] as const).map((l) => (
            <span
              key={l}
              className={`h-9 px-4 inline-flex items-center rounded-full text-sm border tabular-nums ${
                l === 'de'
                  ? 'bg-klano-text text-klano-action-fg border-klano-text'
                  : 'bg-klano-surface text-klano-text-2 border-klano-border'
              }`}
            >
              {l.toUpperCase()}
            </span>
          ))}
        </div>
      </FieldGroup>

      <div className="flex items-center justify-between pt-4 border-t border-klano-border">
        <div className="flex items-center gap-3">
          <Button>Speichern</Button>
          <Button variant="ghost">Abbrechen</Button>
        </div>
        <form action="/auth/sign-out" method="post">
          <Button variant="ghost" type="submit" className="!text-klano-danger">
            Abmelden
          </Button>
        </form>
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
