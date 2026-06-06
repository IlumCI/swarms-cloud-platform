'use client';

/**
 * Browser fetch wrapper for our own `/api/*` routes. Kept as a thin alias so
 * existing callsites stay compatible — the Swarms API key is now resolved
 * server-side from the authenticated Supabase session, not injected as a
 * header from the browser.
 */
export async function apiFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  return fetch(input, init);
}
