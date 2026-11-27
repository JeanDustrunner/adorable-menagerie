import { test, expect } from '@playwright/test';

test('home page shows the studio name', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Urocza Menażeria');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Urocza Menażeria' }),
  ).toBeVisible();
});
