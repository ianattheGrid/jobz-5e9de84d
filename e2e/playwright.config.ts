import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for Jobz regression suite.
 *
 * Override the target URL with E2E_BASE_URL, e.g.
 *   E2E_BASE_URL=https://jobz.lovable.app npx playwright test -c e2e/playwright.config.ts
 */
const baseURL =
  process.env.E2E_BASE_URL ??
  process.env.PLAYWRIGHT_BASE_URL ??
  "http://localhost:8080";

export default defineConfig({
  testDir: ".",
  testMatch: /.*\.spec\.ts$/,
  timeout: 90_000,
  expect: { timeout: 15_000 },
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL,
    headless: true,
    viewport: { width: 1440, height: 900 },
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});
