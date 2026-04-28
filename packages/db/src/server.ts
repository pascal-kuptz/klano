import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import type { Database } from './types.gen';

interface CookieAdapter {
  getAll: () => { name: string; value: string }[];
  setAll: (cookies: { name: string; value: string; options?: Record<string, unknown> }[]) => void;
}

/**
 * Supabase client for Next.js server components / server actions / route handlers.
 * Pass a cookie adapter (next/headers cookies()) so refresh tokens stay in sync.
 */
export function createServerClient(cookies: CookieAdapter) {
  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookies.getAll(),
        setAll: (next: { name: string; value: string; options?: Record<string, unknown> }[]) =>
          cookies.setAll(next),
      },
    },
  );
}
