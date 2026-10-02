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

  // 1. If visiting admin.hyrento.com at root, rewrite or redirect to /admin
  if (host.startsWith('admin.')) {
    if (pathname === '/' || pathname === '') {
      return NextResponse.rewrite(new URL('/admin', request.url));
    }
    if (pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // 2. Admin login redirect logic (MVP Mode)
  if (pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // 3. Run next-intl middleware for root and locale routes
  if (pathname === '/' || /^\/(en|fr)(\/|$)/.test(pathname)) {
    return intlMiddleware(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match root and locale-prefixed paths
    '/', 
    '/(fr|en)/:path*',
    // Match admin paths for redirection
    '/admin/:path*'
  ]
};
