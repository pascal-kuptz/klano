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

function isConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/**
 * Returns the current Supabase user, or null if Supabase is not yet configured
 * (local dev before `.env.local` is set up) or the user is signed out.
 */
export async function getUser() {
  if (!isConfigured()) return null;
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) return null;
    return data.user;
  } catch {
    return null;
  }
}
