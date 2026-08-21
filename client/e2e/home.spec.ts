import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('renders the welcome heading @smoke', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible();
    await expect(
      page.getByText('Best tracks are gathered here!'),
    ).toBeVisible();
  });

  test('shows the register/login prompt for a logged-out visitor', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.getByRole('button', { name: 'register' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible();
  });
});
