import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'en'
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';

  // 1. Strict isolation for admin.hyrento.com: ZERO public website pages allowed
  if (host.startsWith('admin.')) {
    if (
      pathname === '/' ||
      pathname === '' ||
      pathname === '/en' ||
      pathname === '/fr' ||
      /^\/(en|fr)(\/|$)/.test(pathname)
    ) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    if (pathname === '/fleet') {
      return NextResponse.redirect(new URL('/admin/fleet', request.url));
    }
    if (pathname === '/booking' || pathname === '/bookings') {
      return NextResponse.redirect(new URL('/admin/bookings', request.url));
    }
    if (pathname === '/calendar') {
      return NextResponse.redirect(new URL('/admin/calendar', request.url));
    }
    if (pathname === '/customers') {
      return NextResponse.redirect(new URL('/admin/customers', request.url));
    }
    if (pathname === '/settings') {
      return NextResponse.redirect(new URL('/admin/settings', request.url));
    }
    if (pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    // Block any other public website routes on admin domain and redirect to /admin
    if (!pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // 2. Admin login redirect logic (MVP Mode) on non-admin domains
  if (pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // 3. Run next-intl middleware for root and locale routes on public client domains
  if (pathname === '/' || /^\/(en|fr)(\/|$)/.test(pathname)) {
    return intlMiddleware(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - assets, favicon, icon, etc.
     */
    '/((?!api|_next/static|_next/image|assets|favicon.ico|icon|robots.txt|sitemap.xml).*)',
  ]
};
