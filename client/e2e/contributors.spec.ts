import { test, expect } from '@playwright/test';

test.describe('Contributors page', () => {
  test('renders the Contributors heading @smoke', async ({ page }) => {
    await page.goto('/contributors');

    await expect(
      page.getByRole('heading', { name: 'Contributors' }),
    ).toBeVisible();
  });
});
