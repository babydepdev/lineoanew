import { Suspense } from 'react';
import { LoginContainer } from './components/LoginContainer';

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContainer />
    </Suspense>
  );
}

function LoginFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-1/2 mx-auto" />
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded w-1/4" />
              <div className="h-10 bg-slate-200 rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded w-1/4" />
              <div className="h-10 bg-slate-200 rounded" />
            </div>
            <div className="h-10 bg-slate-200 rounded w-1/3 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}