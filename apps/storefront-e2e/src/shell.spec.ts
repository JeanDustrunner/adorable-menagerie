import { test, expect } from '@playwright/test';

test.describe('site shell', () => {
  test('is Polish and kept out of search engines until go-live', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.locator('html')).toHaveAttribute('lang', 'pl');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      /noindex/,
    );
  });

  test('shows the demonstration notice', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByText(
        'Strona demonstracyjna. Wszystkie produkty i dane są fikcyjne',
      ),
    ).toBeVisible();
  });

  test('has one banner, one main and one content-info landmark', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.getByRole('banner')).toHaveCount(1);
    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.getByRole('contentinfo')).toHaveCount(1);
  });

  test('offers a skip link as the first tab stop that moves focus to the main content', async ({
    page,
  }) => {
    await page.goto('/');

    const skipLink = page.getByRole('link', { name: 'Przejdź do treści' });
    // Before focus it is parked above the viewport. toBeVisible() would pass even
    // there, so check the position.
    const parked = await skipLink.boundingBox();
    expect((parked?.y ?? 0) + (parked?.height ?? 0)).toBeLessThanOrEqual(0);

    await page.keyboard.press('Tab');
    await expect(skipLink).toBeFocused();
    const shown = await skipLink.boundingBox();
    expect(shown?.y).toBeGreaterThanOrEqual(0);

    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeFocused();
  });

  test('links the brand name back to the home page', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('link', { name: 'Adorable Menagerie' }),
    ).toHaveAttribute('href', '/');
  });

  test('shows a Polish 404 page for an unknown address', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');

    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Nie znaleziono strony' }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Strona główna' }),
    ).toBeVisible();
  });
});
