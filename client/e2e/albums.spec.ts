import { test, expect } from '@playwright/test';

test.describe('Album lists page', () => {
  test('renders the Album lists heading @smoke', async ({ page }) => {
    await page.goto('/albums');

    await expect(
      page.getByRole('heading', { name: 'Album lists' }),
    ).toBeVisible();
  });

  test('hides the Upload button for a logged-out visitor', async ({ page }) => {
    await page.goto('/albums');

    await expect(page.getByRole('button', { name: 'Upload' })).toHaveCount(0);
  });
});
