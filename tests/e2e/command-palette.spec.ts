import { test, expect } from '@playwright/test';
import { openCommandPalette, seedApiKey } from './_helpers';

test.describe('Command palette (NavSearch)', () => {
  test.beforeEach(async ({ page }) => {
    await seedApiKey(page);
    await page.goto('/');
  });

  test('opens with ⌘K, filters as you type, and Enter navigates', async ({
    page,
  }) => {
    await openCommandPalette(page);

    const search = page.getByRole('textbox', { name: /search pages/i });
    await expect(search).toBeFocused();

    await search.fill('pricing');

    const results = page.getByRole('listbox');
    await expect(results).toBeVisible();
    await expect(
      results.getByRole('option', { name: /pricing calculator/i })
    ).toBeVisible();

    await page.keyboard.press('Enter');
    await page.waitForURL('**/pricing');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Pricing calculator' })
    ).toBeVisible();
  });

  test('Escape clears the query without leaving the page', async ({ page }) => {
    await openCommandPalette(page);
    const search = page.getByRole('textbox', { name: /search pages/i });
    await search.fill('models');
    await expect(search).toHaveValue('models');

    await page.keyboard.press('Escape');
    await expect(search).toHaveValue('');

    // Second Escape closes the palette (input loses focus)
    await page.keyboard.press('Escape');
    await expect(search).not.toBeFocused();
    await expect(page).toHaveURL(/\/$/);
  });
});
