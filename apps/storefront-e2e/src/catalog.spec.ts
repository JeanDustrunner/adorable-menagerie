import { test, expect } from '@playwright/test';

test.describe('catalog /toys', () => {
  test('is reached from the main navigation and has its own title', async ({
    page,
  }) => {
    await page.goto('/');
    await page
      .getByRole('navigation', { name: 'Główna nawigacja' })
      .getByRole('link', { name: 'Przytulanki' })
      .click();

    await expect(page).toHaveURL(/\/toys$/);
    await expect(page).toHaveTitle('Przytulanki | Adorable Menagerie');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Przytulanki' }),
    ).toBeVisible();
    await expect(
      page
        .getByRole('navigation', { name: 'Główna nawigacja' })
        .getByRole('link', { name: 'Przytulanki' }),
    ).toHaveAttribute('aria-current', 'page');
  });

  test('lists only available items, newest first, with price and availability', async ({
    page,
  }) => {
    await page.goto('/toys');

    const cards = page.getByRole('main').getByRole('listitem');
    await expect(cards).toHaveCount(3);
    await expect(cards.getByRole('heading', { level: 2 })).toHaveText([
      'Smok Szafir',
      'Konik Karmel',
      'Lama Roberto',
    ]);
    await expect(cards.filter({ hasText: 'Lama Roberto' })).toContainText(
      'Ostatnia sztuka',
    );
    await expect(page.getByRole('main')).not.toContainText('Lama Rosa');
  });

  test('has no buy control or form anywhere (R5)', async ({ page }) => {
    await page.goto('/toys');
    await expect(page.getByRole('main').locator('button, form')).toHaveCount(0);

    await page.goto('/toys/konik-karmel');
    await expect(page.getByRole('main').locator('button, form')).toHaveCount(0);
  });

  test('a card is reached by tabbing from the top and opened with Enter', async ({
    page,
  }) => {
    await page.goto('/toys');

    // Tab from the top (skip link, brand, navigation) until the first card has
    // focus. Each retry presses Tab once more; it fails if the card is unreachable.
    const card = page.getByRole('link', { name: 'Smok Szafir' });
    await expect(async () => {
      await page.keyboard.press('Tab');
      await expect(card).toBeFocused({ timeout: 100 });
    }).toPass({ timeout: 5000 });

    // The ring is drawn on the stretched ::after; the card clips its overflow,
    // so the ring must be inset to stay visible (WCAG 2.4.7).
    const ring = await card.evaluate((el) => {
      const style = getComputedStyle(el, '::after');
      return { style: style.outlineStyle, offset: style.outlineOffset };
    });
    expect(ring.style).toBe('solid');
    expect(parseFloat(ring.offset)).toBeLessThanOrEqual(0);

    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/toys\/smok-szafir$/);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Smok Szafir' }),
    ).toBeVisible();
  });
});

test.describe('item detail /toys/[slug]', () => {
  test('shows an available item with photos, price, details and its title', async ({
    page,
  }) => {
    await page.goto('/toys/smok-szafir');

    await expect(page).toHaveTitle('Smok Szafir | Adorable Menagerie');
    const main = page.getByRole('main');
    await expect(main.getByRole('img')).toHaveCount(4);
    await expect(main).toContainText('Dostępny');
    await expect(main.locator('dt').first()).toHaveText('Wymiary');
    await expect(
      main.getByRole('navigation', { name: 'Okruszki' }).getByRole('link', {
        name: 'Przytulanki',
      }),
    ).toHaveAttribute('href', '/toys');
  });

  test('every photo actually loads', async ({ page }) => {
    await page.goto('/toys/smok-szafir');

    const images = page.getByRole('main').getByRole('img');
    for (const image of await images.all()) {
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth))
        .toBeGreaterThan(0);
    }
  });

  test('shows a sold item as "W nowym domu" with its last price only in the details', async ({
    page,
  }) => {
    await page.goto('/toys/lama-rosa');

    const main = page.getByRole('main');
    await expect(
      main.getByRole('heading', { level: 1, name: 'Lama Rosa' }),
    ).toBeVisible();
    await expect(main).toContainText('W nowym domu');
    await expect(main.locator('dt', { hasText: 'Ostatnia cena' })).toHaveCount(
      1,
    );
  });

  for (const slug of ['prototyp-sowa', 'nie-ma-takiej-przytulanki']) {
    test(`returns the Polish 404 for ${slug}`, async ({ page }) => {
      const response = await page.goto(`/toys/${slug}`);

      expect(response?.status()).toBe(404);
      await expect(
        page.getByRole('heading', { level: 1, name: 'Nie znaleziono strony' }),
      ).toBeVisible();
    });
  }
});

test.describe('catalog on a phone', () => {
  test.use({ viewport: { width: 375, height: 800 } });

  test('shows the catalog in two columns', async ({ page }) => {
    await page.goto('/toys');

    const cards = page.getByRole('main').getByRole('listitem');
    const first = await cards.nth(0).boundingBox();
    const second = await cards.nth(1).boundingBox();
    expect(first?.y).toBe(second?.y);
    expect((second?.x ?? 0) > (first?.x ?? 0)).toBe(true);
  });
});
