import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const authRoutes = ['/login', '/signup'];
  const protectedRoutes = ['/account', '/'];
  const protectedApiRoutes = ['/api/cashprize'];

  const isProtectedRoute = protectedRoutes.includes(request.nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(request.nextUrl.pathname);

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const isProtectedApiRoute = protectedApiRoutes.includes(request.nextUrl.pathname);

  if (isProtectedApiRoute && !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return supabaseResponse;
}
