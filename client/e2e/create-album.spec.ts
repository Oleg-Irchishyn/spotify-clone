import { test, expect } from '@playwright/test';

test.describe('Create album page', () => {
  test('renders all upload steps @smoke', async ({ page }) => {
    await page.goto('/albums/create');

    await expect(page.getByText('Album info')).toBeVisible();
    await expect(page.getByText('Album Cover Upload')).toBeVisible();
  });

  test('Back is disabled and Continue is enabled on the first step', async ({
    page,
  }) => {
    await page.goto('/albums/create');

    await expect(
      page.getByRole('button', { name: 'Back', exact: true }),
    ).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Continue' })).toBeEnabled();
  });
});
