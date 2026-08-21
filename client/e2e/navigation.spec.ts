import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('navigates to the Tracklist page @smoke', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('open drawer').click();
    await page.getByRole('button', { name: 'Tracklist' }).click();

    await expect(page).toHaveURL(/\/tracks$/);
    await expect(
      page.getByRole('heading', { name: 'Tracklist' }),
    ).toBeVisible();
  });

  test('navigates to the Album lists page', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('open drawer').click();
    await page.getByRole('button', { name: 'Album lists' }).click();

    await expect(page).toHaveURL(/\/albums$/);
    await expect(
      page.getByRole('heading', { name: 'Album lists' }),
    ).toBeVisible();
  });

  test('does not show the Contributors link to a logged-out visitor', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByLabel('open drawer').click();

    await expect(
      page.getByRole('button', { name: 'Contributors' }),
    ).toHaveCount(0);
  });
});
