"use client";

import { useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { LoginForm } from './LoginForm';

export function LoginContainer() {
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('from') || '/';

  const handleLoginSuccess = useCallback(() => {
    console.log('Login successful, redirecting to:', redirectPath);
  }, [redirectPath]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <LoginForm 
          onLoginSuccess={handleLoginSuccess}
          redirectPath={redirectPath}
        />
      </div>
    </div>
  );
}