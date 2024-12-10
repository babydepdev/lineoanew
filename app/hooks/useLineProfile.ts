"use client";

import { useState, useEffect } from 'react';
import { LineUserProfile } from '../types/line';
import { getLineUserProfile } from '@/lib/services/lineProfileService';

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
        if (!userId) return; // Additional type guard
        const fetchedProfile = await getLineUserProfile(userId);
        
        if (!mounted) return;
        setProfile(fetchedProfile);
        setError(null);
      } catch (error: unknown) {
        if (!mounted) return;
        setError(error instanceof Error ? error : new Error('Unknown error'));
        setProfile(null);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void fetchProfile();

    return () => {
      mounted = false;
    };
  }, [userId]);

  return { profile, isLoading, error };
}