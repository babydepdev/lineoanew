"use client";

import { useState, useEffect } from 'react';
import { LineUserProfile } from '../types/line';

export function useLineProfile(userId: string | null) {
  const [profile, setProfile] = useState<LineUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    let mounted = true;
    setIsLoading(true);

    const controller = new AbortController();

    async function fetchProfile() {
      try {
        const response = await fetch(`/api/line/profile/${userId}`, {
          signal: controller.signal
        });
        
        if (!response.ok) throw new Error('Failed to fetch profile');
        if (!mounted) return;
        
        const data = await response.json();
        setProfile(data);
        setError(null);
      } catch (error: unknown) {
        if (!mounted) return;
        
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        
        setError(error instanceof Error ? error : new Error('Unknown error'));
        setProfile(null);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [userId]);

  return { profile, isLoading, error };
}