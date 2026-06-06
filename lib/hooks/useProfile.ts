'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  username: string | null;
  tier: string | null;
}

interface UseProfileResult {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProfile(): UseProfileResult {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) {
        setProfile(null);
        return;
      }

      const { data: row, error: rowError } = await supabase
        .from('users')
        .select('id, email, full_name, avatar_url, username, tier')
        .eq('id', user.id)
        .maybeSingle();

      if (rowError && rowError.code !== 'PGRST116') throw rowError;

      setProfile({
        id: user.id,
        email: row?.email ?? user.email ?? null,
        full_name: row?.full_name ?? null,
        avatar_url: row?.avatar_url ?? null,
        username: row?.username ?? null,
        tier: row?.tier ?? null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile.');
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, isLoading, error, refetch: fetchProfile };
}

export function getInitials(profile: Pick<UserProfile, 'full_name' | 'username' | 'email'> | null): string {
  if (!profile) return '?';
  const source =
    profile.full_name?.trim() ||
    profile.username?.trim() ||
    profile.email?.trim() ||
    '';
  if (!source) return '?';
  const parts = source.split(/[\s._-]+/).filter(Boolean);
  if (parts.length === 0) return source.slice(0, 1).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
