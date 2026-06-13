import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// MVP MODE: Admin panel is open to everyone — no login required
export function middleware(request: NextRequest) {
  // If someone lands on /admin/login, redirect them straight to /admin
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
