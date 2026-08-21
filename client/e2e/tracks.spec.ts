import { test, expect } from '@playwright/test';

test.describe('Tracklist page', () => {
  test('renders the Tracklist heading @smoke', async ({ page }) => {
    await page.goto('/tracks');

    await expect(
      page.getByRole('heading', { name: 'Tracklist' }),
    ).toBeVisible();
  });

  test('hides the Upload button for a logged-out visitor', async ({ page }) => {
    await page.goto('/tracks');

    await expect(page.getByRole('button', { name: 'Upload' })).toHaveCount(0);
  });
});
