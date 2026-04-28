import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@klano/db/types';

const PUBLIC_PATHS = ['/sign-in', '/auth/callback', '/auth/sign-out', '/onboarding'];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Supabase not configured yet (local dev pre-setup) → skip auth checks.
  // Onboarding is public; dashboard pages handle missing user gracefully.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anon) return response;

  const supabase = createServerClient<Database>(supabaseUrl, anon, {
      cookies: {
        getAll: () =>
          request.cookies.getAll().map(({ name, value }) => ({ name, value })),
        setAll: (
          next: { name: string; value: string; options?: Record<string, unknown> }[],
        ) => {
          for (const { name, value } of next) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of next) {
            response.cookies.set(name, value, options as never);
          }
        },
      },
    },
  );

  // Refresh the session token if needed.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  // Signed-out users hitting protected routes → /sign-in
  if (!user && !isPublic && pathname !== '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/sign-in';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // Signed-in users hitting /sign-in → /dashboard
  if (user && pathname === '/sign-in') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files + Next internals.
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
