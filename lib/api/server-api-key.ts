import { createClient } from '@/lib/supabase/server';

/**
 * Resolve the Swarms API key for the current request. Resolution order:
 *   1. The first non-deleted key in `swarms_cloud_api_keys` owned by the
 *      currently authenticated Supabase user.
 *   2. `process.env.SWARMS_API_KEY` (dev / system fallback).
 *
 * The key is never sourced from a request header — that would let a signed-in
 * user impersonate another user's key by spoofing `x-api-key`.
 */
export async function resolveApiKey(): Promise<string | null> {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from('swarms_cloud_api_keys')
          .select('key')
          .eq('user_id', user.id)
          .eq('is_deleted', false)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data?.key) return data.key;
      }
    } catch {
      // Fall through to env fallback.
    }
  }

  return process.env.SWARMS_API_KEY ?? null;
}
