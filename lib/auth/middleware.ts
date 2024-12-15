import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, PUBLIC_PATHS, IGNORE_PATHS } from './constants';
import { verifyToken } from './token';

export async function handleAuth(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if it's the root path
  if (pathname === '/') {
    const token = request.cookies.get(AUTH_COOKIE_NAME);
    
    // If no token or invalid token, redirect to login
    if (!token) {
      return redirectToLogin(request);
    }

    const { isValid } = await verifyToken(token.value);
    if (!isValid) {
      return redirectToLogin(request);
    }
  }

  // Allow public paths
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return null;
  }

  // Ignore static files and assets
  if (IGNORE_PATHS.some(path => pathname.startsWith(path))) {
    return null;
  }

  // Check for auth token
  const token = request.cookies.get(AUTH_COOKIE_NAME);

  if (!token) {
    return redirectToLogin(request);
  }

  // Verify token
  const { isValid } = await verifyToken(token.value);
  
  if (!isValid) {
    return redirectToLogin(request);
  }

  return null;
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL('/login', request.url);
  // Only set 'from' parameter if not already on login page
  if (!request.nextUrl.pathname.startsWith('/login')) {
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
  }
  return NextResponse.redirect(loginUrl);
}