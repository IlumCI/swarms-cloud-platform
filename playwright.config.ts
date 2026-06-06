import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { defineConfig, devices } from '@playwright/test';

/**
 * Load `.env` so tests see the same `SWARMS_API_KEY` the Next.js dev
 * server gets. Without this, the cache and live-integration suites would
 * skip on every local run. Existing env vars win.
 */
function loadDotEnv(filename: string) {
  const path = join(process.cwd(), filename);
  if (!existsSync(path)) return;
  for (const rawLine of readFileSync(path, 'utf-8').split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq < 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadDotEnv('.env');

const PORT = Number(process.env.PORT ?? 3000);
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;

/**
 * Set PLAYWRIGHT_USE_BUILD=1 to run tests against `next start` (production
 * build) instead of `next dev`. CI should use the production build.
 */
const USE_BUILD = process.env.PLAYWRIGHT_USE_BUILD === '1';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  globalSetup: './tests/global-setup.ts',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 5_000,
    navigationTimeout: 15_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_NO_SERVER
    ? undefined
    : {
        command: USE_BUILD ? 'pnpm build && pnpm start' : 'pnpm dev',
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
        stdout: 'pipe',
        stderr: 'pipe',
      },
});
