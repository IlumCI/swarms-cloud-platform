import { type Page } from '@playwright/test';

/**
 * Drop a fake API key into localStorage and dismiss the API-key gate so
 * navigation tests don't have to fight a modal on every page.
 */
export async function seedApiKey(page: Page, key = 'test-key-not-real') {
  await page.addInitScript((apiKey) => {
    try {
      const existing = window.localStorage.getItem('ui-store');
      const parsed = existing ? JSON.parse(existing) : { state: {}, version: 3 };
      parsed.state = { ...(parsed.state ?? {}), swarmsApiKey: apiKey };
      parsed.version = parsed.version ?? 3;
      window.localStorage.setItem('ui-store', JSON.stringify(parsed));
    } catch {
      // If anything goes sideways, write a minimal valid store
      window.localStorage.setItem(
        'ui-store',
        JSON.stringify({
          state: {
            viewMode: 'grid',
            sidebarOpen: false,
            theme: 'system',
            swarmsApiKey: apiKey,
          },
          version: 3,
        })
      );
    }
  }, key);
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
