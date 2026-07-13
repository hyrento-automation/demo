import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'en'
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Admin login redirect logic (MVP Mode)
  if (pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // 2. Run next-intl middleware for root and locale routes
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
