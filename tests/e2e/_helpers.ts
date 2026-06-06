import { type Page } from '@playwright/test';

/**
 * Legacy helper from when the app cached a Swarms API key in browser storage.
 * The key is now resolved server-side from the authenticated Supabase user's
 * `swarms_cloud_api_keys` row, so seeding localStorage no longer authenticates
 * a Playwright session. Kept as a no-op for call-site compatibility; tests
 * that need authenticated routes must sign in through `/login` instead.
 */
export async function seedApiKey(_page: Page, _key = 'test-key-not-real') {
  // intentionally empty
}

/**
 * Remove any persisted Zustand state so the app boots fresh.
 */
export async function clearAppStorage(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.clear();
  });
}

/**
 * Fire ⌘K (Mac) or Ctrl+K (everything else) to open the NavSearch palette.
 */
export async function openCommandPalette(page: Page) {
  const isMac = process.platform === 'darwin';
  await page.keyboard.press(isMac ? 'Meta+k' : 'Control+k');
}
