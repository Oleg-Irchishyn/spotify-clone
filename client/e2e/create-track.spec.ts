import { test, expect } from '@playwright/test';

test.describe('Create track page', () => {
  test('renders all upload steps @smoke', async ({ page }) => {
    await page.goto('/tracks/create');

    await expect(page.getByText('Track info')).toBeVisible();
    await expect(page.getByText('Track Cover Upload')).toBeVisible();
    await expect(page.getByText('Track upload')).toBeVisible();
  });

  test('Back is disabled and Continue is enabled on the first step', async ({
    page,
  }) => {
    await page.goto('/tracks/create');

    await expect(
      page.getByRole('button', { name: 'Back', exact: true }),
    ).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Continue' })).toBeEnabled();
  });
});
