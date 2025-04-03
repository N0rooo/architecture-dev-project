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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const authRoutes = ['/connexion', '/signup'];
  const protectedRoutes = ['/account', '/leaderboard'];
  const publicApiRoutes = ['/api/public'];
  const currentPath = request.nextUrl.pathname;
  const isAdminRoute = currentPath.startsWith('/admin');
  const isAuthRoute = authRoutes.includes(currentPath);
  const isProtectedRoute = protectedRoutes.includes(currentPath);
  // but not auth routes
  const isAuthApiRoute = currentPath.startsWith('/api/auth');
  const isApiRoute = currentPath.startsWith('/api') && !isAuthRoute && !isAuthApiRoute;
  const isPublicApiRoute = publicApiRoutes.includes(currentPath);

  if (!user) {
    if (isAuthRoute || isPublicApiRoute) {
      return supabaseResponse;
    }
    if (isApiRoute) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (isProtectedRoute || isAdminRoute) {
      return NextResponse.redirect(new URL('/connexion', request.url));
    }

    return supabaseResponse;
  }

  const { data: roleData } = await supabase
    .from('user_role')
    .select('*')
    .eq('user_id', user.id)
    .single();
  const isAdmin = roleData?.role === 'admin';

  if (isAdmin) {
    if (isAuthRoute) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Allow all other routes for admins
    return supabaseResponse;
  }

  if (isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isAdminRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return supabaseResponse;
}
