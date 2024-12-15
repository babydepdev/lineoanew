import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { handleAuth } from '@/lib/auth/middleware';

export async function middleware(request: NextRequest) {
  // Handle CORS for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  }

  // Handle authentication
  const authResult = await handleAuth(request);
  if (authResult) {
    return authResult;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/webhooks/* (webhook endpoints)
     * 2. /_next/* (Next.js internals)
     * 3. /static/* (static files)
     * 4. /favicon.ico, /robots.txt (static files)
     */
    '/((?!api/webhooks/|_next/|static/|favicon.ico|robots.txt).*)',
  ],
};