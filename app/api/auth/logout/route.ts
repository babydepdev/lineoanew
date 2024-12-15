import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME, COOKIE_OPTIONS } from '@/lib/auth/constants';

export async function POST() {
  // Clear the auth cookie by setting it to expire immediately
  cookies().set(AUTH_COOKIE_NAME, '', {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  });
  
  return NextResponse.json({ success: true });
}