import { test, expect } from '@playwright/test';

test.describe('patterns /patterns', () => {
  test('is reached from the main navigation and has its own title', async ({
    page,
  }) => {
    await page.goto('/');
    await page
      .getByRole('navigation', { name: 'Główna nawigacja' })
      .getByRole('link', { name: 'Wzory' })
      .click();

    await expect(page).toHaveURL(/\/patterns$/);
    await expect(page).toHaveTitle('Wzory | Urocza Menażeria');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Wzory' }),
    ).toBeVisible();
  });

  test('lists the public patterns newest first, with craft and difficulty', async ({
    page,
  }) => {
    await page.goto('/patterns');

    const cards = page.getByRole('main').getByRole('listitem');
    await expect(cards.getByRole('heading', { level: 2 })).toHaveText([
      'Wzór: Smok Szafir',
      'Wzór: Konik Karmel',
      'Wzór: Lama Roberto',
      'Wzór: Szalik w kolorach menażerii',
    ]);
    await expect(cards.first()).toContainText('Szydełko, zaawansowany');
    await expect(cards.last()).toContainText('Druty, dla początkujących');
    await expect(page.getByRole('main')).not.toContainText('Sowa Ola');
  });

  test('has no download, buy control or form (spec 6.4, R5)', async ({
    page,
  }) => {
    await page.goto('/patterns');
    await expect(page.getByRole('main').locator('button, form')).toHaveCount(0);

    await page.goto('/patterns/wzor-smok-szafir');
    await expect(page.getByRole('main').locator('button, form')).toHaveCount(0);
  });
});

test.describe('pattern detail /patterns/[slug]', () => {
  test('shows the pattern details and links to the item made from it', async ({
    page,
  }) => {
    await page.goto('/patterns/wzor-smok-szafir');

    await expect(page).toHaveTitle('Wzór: Smok Szafir | Urocza Menażeria');
    const main = page.getByRole('main');
    await expect(main.locator('dt').first()).toHaveText('Technika');
    await expect(
      main.getByRole('navigation', { name: 'Okruszki' }).getByRole('link', {
        name: 'Wzory',
      }),
    ).toHaveAttribute('href', '/patterns');

    await main.getByRole('link', { name: 'Smok Szafir', exact: true }).click();
    await expect(page).toHaveURL(/\/toys\/smok-szafir$/);
  });

  test('is linked from the item made from it', async ({ page }) => {
    await page.goto('/toys/konik-karmel');

    await page
      .getByRole('main')
      .getByRole('link', { name: 'Wzór: Konik Karmel' })
      .click();
    await expect(page).toHaveURL(/\/patterns\/wzor-konik-karmel$/);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Wzór: Konik Karmel' }),
    ).toBeVisible();
  });

  test('every photo actually loads', async ({ page }) => {
    await page.goto('/patterns/wzor-konik-karmel');

    const images = page.getByRole('main').getByRole('img');
    for (const image of await images.all()) {
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth))
        .toBeGreaterThan(0);
    }
  });

  for (const slug of ['wzor-sowa-szkic', 'nie-ma-takiego-wzoru']) {
    test(`returns the Polish 404 for ${slug}`, async ({ page }) => {
      const response = await page.goto(`/patterns/${slug}`);

      expect(response?.status()).toBe(404);
      await expect(
        page.getByRole('heading', { level: 1, name: 'Nie znaleziono strony' }),
      ).toBeVisible();
    });
  }
});
