import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME, PUBLIC_PATHS } from './lib/auth/constants';
import { verifyToken } from './lib/auth/token';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle CORS for API routes
  if (pathname.startsWith('/api/')) {
    // Skip auth check for webhook endpoints
    if (pathname.startsWith('/api/webhooks/')) {
      return NextResponse.next();
    }

    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  }

  // Allow public paths (like login)
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for auth token
  const token = request.cookies.get(AUTH_COOKIE_NAME);

  // If no token, redirect to login
  if (!token) {
    return redirectToLogin(request);
  }

  // Verify token
  const { isValid } = await verifyToken(token.value);
  if (!isValid) {
    return redirectToLogin(request);
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = '/login';
  // Save the original URL as a redirect parameter
  if (request.nextUrl.pathname !== '/login') {
    url.searchParams.set('from', request.nextUrl.pathname);
  }
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Match all paths except static files and assets
    '/((?!_next/|static/|favicon.ico|robots.txt|images/).*)',
  ],
};