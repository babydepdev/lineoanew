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

    async function fetchProfile() {
      try {
        const response = await fetch(`/api/line/profile/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch profile');
        
        const data = await response.json();
        if (!mounted) return;
        
        setProfile(data);
        setError(null);
      } catch (err) {
        if (!mounted) return;
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
    };
  }, [userId]);

  return { profile, isLoading, error };
}