import { test, expect } from '@playwright/test';
import type { Locator } from '@playwright/test';

/** Number of grid tracks: the fixtures have too few items to wrap a row. */
function columnCount(list: Locator): Promise<number> {
  return list.evaluate(
    (el) => getComputedStyle(el).gridTemplateColumns.split(' ').length,
  );
}

test.describe('gallery /gallery', () => {
  test('is reached from the main navigation and has its own title', async ({
    page,
  }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Główna nawigacja' });
    await nav.getByRole('link', { name: 'Galeria prac' }).click();

    await expect(page).toHaveURL(/\/gallery$/);
    await expect(page).toHaveTitle('Galeria prac | Urocza Menażeria');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Galeria prac' }),
    ).toBeVisible();
    await expect(
      nav.getByRole('link', { name: 'Galeria prac' }),
    ).toHaveAttribute('aria-current', 'page');
  });

  test('lists only sold items, newest first, without prices (OD-8)', async ({
    page,
  }) => {
    await page.goto('/gallery');

    const tiles = page.getByRole('main').getByRole('listitem');
    await expect(tiles.getByRole('heading', { level: 2 })).toHaveText([
      'Lama Rosa',
      'Smok Popiołek',
    ]);
    for (const tile of await tiles.all()) {
      await expect(tile).toContainText('W nowym domu');
      await expect(tile).not.toContainText('zł');
    }
    await expect(page.getByRole('main')).not.toContainText('Konik Karmel');
  });

  test('every photo actually loads', async ({ page }) => {
    await page.goto('/gallery');
    for (const image of await page.getByRole('main').getByRole('img').all()) {
      await expect(image).toHaveJSProperty('complete', true);
      expect(
        await image.evaluate((el: HTMLImageElement) => el.naturalWidth),
      ).toBeGreaterThan(0);
    }
  });

  test('a tile opens the item page, whose breadcrumb leads back', async ({
    page,
  }) => {
    await page.goto('/gallery');
    await page.getByRole('link', { name: 'Lama Rosa' }).click();

    await expect(page).toHaveURL(/\/toys\/lama-rosa$/);
    await page
      .getByRole('navigation', { name: 'Okruszki' })
      .getByRole('link', { name: 'Galeria prac' })
      .click();
    await expect(page).toHaveURL(/\/gallery$/);
  });
});

test.describe('gallery on a phone', () => {
  test.use({ viewport: { width: 375, height: 800 } });

  test('shows the tiles in rows of three', async ({ page }) => {
    await page.goto('/gallery');
    const list = page.getByRole('main').getByRole('list');
    expect(await columnCount(list)).toBe(3);
  });
});

for (const viewport of [
  { width: 1366, height: 768 },
  { width: 1920, height: 1080 },
]) {
  test.describe(`gallery at ${viewport.width}x${viewport.height}`, () => {
    test.use({ viewport });

    test('shows six compact tiles per row within the site width', async ({
      page,
    }) => {
      await page.goto('/gallery');

      const contentMax = 72 * 16;
      const grid = page.getByRole('main').getByRole('list');
      expect(await columnCount(grid)).toBe(6);
      const list = await grid.boundingBox();
      const tile = await page
        .getByRole('main')
        .getByRole('listitem')
        .first()
        .boundingBox();
      expect(list?.width ?? 0).toBeLessThanOrEqual(contentMax);
      // Six columns with their gaps: one tile is under a sixth of the list.
      expect(tile?.width ?? 0).toBeLessThan((list?.width ?? 0) / 6);
      // The whole first row is visible without scrolling.
      expect((tile?.y ?? 0) + (tile?.height ?? 0)).toBeLessThanOrEqual(
        viewport.height,
      );
    });
  });
}
