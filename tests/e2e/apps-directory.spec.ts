import { test, expect } from '@playwright/test';
import { seedApiKey } from './_helpers';

test.describe('Apps directory', () => {
  test.beforeEach(async ({ page }) => {
    await seedApiKey(page);
    await page.goto('/apps');
  });

  test('lists at least all the navbar pages', async ({ page }) => {
    await expect(
      page.getByRole('heading', { level: 1, name: 'Apps' })
    ).toBeVisible();

    // Each app shows up as a link card with the route as its href
    for (const href of [
      '/',
      '/history',
      '/observability',
      '/workbench',
      '/agents',
      '/playground',
      '/models',
      '/swarms',
      '/sdks',
      '/prompts',
      '/pricing',
      '/api-keys',
      '/settings',
    ]) {
      await expect(
        page.locator(`a[href="${href}"]`).first()
      ).toBeVisible();
    }
  });

  test('search filters the list', async ({ page }) => {
    // Scope to the page's SearchBar by placeholder so we don't collide
    // with the NavSearch palette input in the navbar.
    const search = page.getByPlaceholder(/search apps/i);
    // The Apps directory lives inside <main>. The primary <nav> also has
    // links to every page, so we scope card-count assertions to <main>.
    const main = page.getByRole('main');

    await search.fill('prompt');

    // Only the prompt generator card should remain inside <main>
    await expect(main.locator('a[href="/prompts"]')).toHaveCount(1);
    await expect(main.locator('a[href="/pricing"]')).toHaveCount(0);
    await expect(main.locator('a[href="/models"]')).toHaveCount(0);

    // Clearing the search restores the full list inside <main>
    await search.fill('');
    await expect(main.locator('a[href="/pricing"]')).toHaveCount(1);
  });

  test('clicking a card navigates to that app', async ({ page }) => {
    await page.locator('a[href="/swarms"]').first().click();
    await page.waitForURL('**/swarms');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Swarm types' })
    ).toBeVisible();
  });
});
