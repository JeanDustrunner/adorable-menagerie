import { test, expect } from '@playwright/test';

test('home page shows the studio name', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Adorable Menagerie');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Adorable Menagerie' }),
  ).toBeVisible();
});
