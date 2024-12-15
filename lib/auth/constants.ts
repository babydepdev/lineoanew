export const AUTH_COOKIE_NAME = 'auth-token';

export const PUBLIC_PATHS = [
  '/login',
  '/api/auth/login',
  '/api/auth/logout'
];

// Update cookie options
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24, // 24 hours
  path: '/',
} as const;