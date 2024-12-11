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
    const controller = new AbortController();

    async function fetchProfile() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/line/profile/${userId}`, {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'max-age=3600'
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch profile');
        if (!mounted) return;
        
        const data = await response.json();
        setProfile(data);
        setError(null);
      } catch (err) {
        if (!mounted) return;
        if (err instanceof Error && err.name === 'AbortError') return;
        
        setError(err instanceof Error ? err : new Error('Unknown error'));
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