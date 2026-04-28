import { Sidebar } from '@/components/app/Sidebar';
import { getUser } from '@/lib/supabase/server';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  const initials = user?.email
    ? user.email
        .split('@')[0]!
        .split(/[._-]/)
        .filter(Boolean)
        .slice(0, 2)
        .map((s) => s[0]!.toUpperCase())
        .join('') || user.email[0]!.toUpperCase()
    : '—';

  return (
    <div className="min-h-screen flex bg-klano-canvas">
      <Sidebar
        user={
          user
            ? {
                name: (user.user_metadata?.full_name as string | undefined) ?? user.email!.split('@')[0]!,
                role: 'Owner',
                initials,
              }
            : undefined
        }
      />
      <div className="flex-1 min-w-0 flex flex-col">{children}</div>
    </div>
  );
}
