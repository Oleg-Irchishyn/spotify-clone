/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';

const PORT = process.env.PORT ?? '3000';
const chromeChannel = process.env.CI ? {} : { channel: 'chrome' };

export default defineConfig({
  testDir: './e2e',
  timeout: process.env.CI ? 60000 : 30000,
  expect: { timeout: process.env.CI ? 30000 : 10000 },
  workers: undefined,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [
        ['junit', { outputFile: 'e2e-results/junit.xml' }],
        ['html', { outputFolder: 'e2e-results/html-report', open: 'never' }],
        ['list'],
      ]
    : [['html', { open: 'on-failure' }], ['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: process.env.CI ? 'on-first-retry' : 'off',
    screenshot: process.env.CI ? 'only-on-failure' : 'off',
  },
  projects: [
    {
      name: 'smoke',
      grep: /@smoke/,
      use: {
        ...devices['Desktop Chrome'],
        ...chromeChannel,
      },
    },
    {
      name: 'full',
      use: {
        ...devices['Desktop Chrome'],
        ...chromeChannel,
      },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
