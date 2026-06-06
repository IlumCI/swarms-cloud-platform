import { test, expect } from '@playwright/test';
import { seedApiKey } from './_helpers';

const NAV_TARGETS = [
  { href: '/apps', heading: 'Apps' },
  { href: '/agents', heading: /agents/i },
  { href: '/history', heading: 'Execution history' },
  { href: '/models', heading: 'Models' },
  { href: '/swarms', heading: 'Swarm types' },
  { href: '/sdks', heading: 'SDKs' },
  { href: '/pricing', heading: 'Pricing calculator' },
  { href: '/prompts', heading: 'Prompt generator' },
  { href: '/settings', heading: 'Settings' },
];

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await seedApiKey(page);
  });

  test('homepage renders brand and primary heading', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('link', { name: /swarms cloud/i }).first()
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 1, name: /dashboard/i })
    ).toBeVisible();
  });

  for (const { href, heading } of NAV_TARGETS) {
    test(`navbar link to ${href} loads its page`, async ({ page }) => {
      await page.goto('/');
      // Tab strip links live in the primary <nav>
      const nav = page.getByRole('navigation', { name: 'Primary' });
      await nav.getByRole('link', { name: new RegExp(`^${href.replace('/', '')}`, 'i') }).first().click();
      await page.waitForURL(`**${href}`);
      await expect(
        page.getByRole('heading', { level: 1, name: heading })
      ).toBeVisible();
    });
  }

  test('account icon in the navbar links to /settings', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('link', { name: /account settings/i })
      .click();
    await page.waitForURL('**/settings');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Settings' })
    ).toBeVisible();
  });
});
