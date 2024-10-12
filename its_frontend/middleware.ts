import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { startsWith } from 'lodash-es';

export function middleware(req: NextRequest) {
  // Get the token from cookies
  const token = req.cookies.get('token');

  if (!startsWith(req.nextUrl.pathname, '/_next') && !startsWith(req.nextUrl.pathname, '/favicon.ico') && !startsWith(req.nextUrl.pathname, '/api')) {
    // If no token is found and the user is not on the login page, redirect to /login
    if (!token && req.nextUrl.pathname !== '/login' && req.nextUrl.pathname !== '/register') {
      console.info('redirect to login');
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Apply the middleware to all pages except /login
export const config = {
  matcher: ['/:path*'], // This applies to all routes
};
