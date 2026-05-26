import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { languages, defaultLanguage } from "@/lib/i18n";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const supportedLocales = Object.keys(languages);

  // Check if the current pathname already has a supported locale
  const pathnameHasLocale = supportedLocales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    // If no valid locale is found, redirect to the default locale
    // e.g., incoming request is /pastors -> redirects to /en/pastors
    request.nextUrl.pathname = `/${defaultLanguage}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }
  
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
            response.cookies.set( { name, value, ...options })
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect the admin route
  if (request.nextUrl.pathname.startsWith('/bulk-post-announcements') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
