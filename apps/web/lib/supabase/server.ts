import { cookies } from 'next/headers';
import { createServerClient as create } from '@klano/db/server';

export async function createServerClient() {
  const store = await cookies();
  return create({
    getAll: () => store.getAll().map(({ name, value }) => ({ name, value })),
    setAll: (next) => {
      try {
        for (const { name, value, options } of next) {
          store.set(name, value, options);
        }
      } catch {
        // Called from a Server Component → Next.js prevents writes.
        // Refresh-token rotation is handled by middleware.ts in this case.
      }
    },
  });
}

export async function getUser() {
  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}
