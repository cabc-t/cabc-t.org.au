import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { languages, defaultLanguage } from "@/lib/i18n";

export async function middleware(request: NextRequest) {
  let { pathname } = request.nextUrl;
  const supportedLocales = Object.keys(languages);

  // 1. Check if the current pathname already has a supported locale
  const pathnameHasLocale = supportedLocales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    // Redirect to default locale if missing
    request.nextUrl.pathname = `/${defaultLanguage}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  // 2. Capture the current locale safely (since we know it exists now)
  const currentLocale = request.nextUrl.pathname.split('/')[1];

  // 3. Initialize Supabase and handle session cookies
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set({ name, value, ...options })
          )
        },
      },
    }
  )

  // Fetch the user to verify authentication status
  const { data: { user } } = await supabase.auth.getUser()

  // 4. Secure Routes using the Locale-Aware Path
  const isProtectedRoute = request.nextUrl.pathname.startsWith(`/${currentLocale}/bulk-post-announcements`);
  const isLoginPage      = request.nextUrl.pathname.startsWith(`/${currentLocale}/login`);

  // Redirect unauthenticated users to the localized login page
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL(`/${currentLocale}/login`, request.url))
  }

  // Redirect authenticated users away from the login page
  if (isLoginPage && user) {
    return NextResponse.redirect(new URL(`/${currentLocale}/bulk-post-announcements`, request.url))
  }

  return response
}

export const config = {
  // Exclude Next.js internals and static assets
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
