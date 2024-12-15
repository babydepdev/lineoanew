"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginFormProps } from '../types';

export function LoginForm({ onLoginSuccess, redirectPath }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        onLoginSuccess();
        router.push(redirectPath);
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred during login');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-slate-900">Login</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-slate-700 text-sm font-medium mb-2" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-slate-700 text-sm font-medium mb-2" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
      </div>
      
      <div className="flex items-center justify-center">
        <button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
        >
          Sign In
        </button>
      </div>
    </form>
  );
}