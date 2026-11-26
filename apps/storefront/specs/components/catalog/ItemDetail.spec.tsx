import { render, screen, within } from '@testing-library/react';
import { ItemDetail } from '../../../src/components/catalog/ItemDetail';
import { item, pattern, photo, post } from '../../lib/catalog/builders';

const always = () => true;
const never = () => false;

const available = item({
  slug: 'smok-szafir',
  name: 'Smok Szafir',
  description: 'Pierwszy akapit.\n\nDrugi akapit.',
  priceGrosze: 21900,
  quantity: 2,
  reproducible: true,
  tags: ['smoki', 'amigurumi'],
  materials: 'Bawełna 100%',
  photos: [
    photo({ file: 'smok-szafir-1.jpg', alt: 'Smok z przodu' }),
    photo({ file: 'smok-szafir-2.jpg', alt: 'Smok z boku' }),
    photo({ file: 'smok-szafir-3.jpg', alt: 'Smok z tyłu' }),
  ],
});

const sold = item({
  slug: 'lama-rosa',
  name: 'Lama Rosa',
  availability: 'unavailable',
  quantity: 0,
  priceGrosze: 15900,
  reproducible: false,
});

describe('ItemDetail', () => {
  it('has the item name as the only main heading', () => {
    render(<ItemDetail item={available} posts={[]} canLink={always} />);
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s.map((h) => h.textContent)).toEqual(['Smok Szafir']);
  });

  it('shows every photo, cover first', () => {
    render(<ItemDetail item={available} posts={[]} canLink={always} />);
    expect(
      screen.getAllByRole('img').map((i) => i.getAttribute('alt')),
    ).toEqual(['Smok z przodu', 'Smok z boku', 'Smok z tyłu']);
  });

  it('shows price, availability and each description paragraph', () => {
    render(<ItemDetail item={available} posts={[]} canLink={always} />);
    expect(screen.getByText('219 zł')).toBeTruthy();
    expect(screen.getByText('Dostępny')).toBeTruthy();
    expect(screen.getByText('Pierwszy akapit.')).toBeTruthy();
    expect(screen.getByText('Drugi akapit.')).toBeTruthy();
  });

  it('lists only existing details, and the reproducibility note and tags', () => {
    const { container } = render(
      <ItemDetail item={available} posts={[]} canLink={always} />,
    );
    const terms = [...container.querySelectorAll('dt')].map(
      (dt) => dt.textContent,
    );
    expect(terms).toEqual(['Materiały']);
    expect(screen.getByText('Projekt można powtórzyć')).toBeTruthy();
    expect(screen.getByText('smoki')).toBeTruthy();
  });

  it('leaves out the tag list when the item has no tags', () => {
    render(
      <ItemDetail
        item={{ ...available, tags: [] }}
        posts={[]}
        canLink={always}
      />,
    );
    expect(screen.queryByRole('list', { name: 'Tagi' })).toBeNull();
  });

  it('offers no buy, reserve or request control (R5)', () => {
    const { container } = render(
      <ItemDetail item={available} posts={[]} canLink={always} />,
    );
    expect(container.querySelector('button, form, input')).toBeNull();
  });

  it('puts an available item under "Przytulanki" in the breadcrumb', () => {
    render(<ItemDetail item={available} posts={[]} canLink={always} />);
    const crumbs = screen.getByRole('navigation', { name: 'Okruszki' });
    expect(
      within(crumbs)
        .getByRole('link', { name: 'Przytulanki' })
        .getAttribute('href'),
    ).toBe('/toys');
    expect(
      within(crumbs).getByText('Smok Szafir').getAttribute('aria-current'),
    ).toBe('page');
  });

  it('puts a sold item under "Galeria prac" and shows its last price only in the details (OD-8)', () => {
    const { container } = render(
      <ItemDetail item={sold} posts={[]} canLink={always} />,
    );
    const crumbs = screen.getByRole('navigation', { name: 'Okruszki' });
    expect(
      within(crumbs)
        .getByRole('link', { name: 'Galeria prac' })
        .getAttribute('href'),
    ).toBe('/gallery');
    expect(screen.getByText('W nowym domu')).toBeTruthy();
    expect(screen.getByText('Projekt jednorazowy')).toBeTruthy();
    const priceNodes = screen.getAllByText('159 zł');
    expect(priceNodes).toHaveLength(1);
    expect(priceNodes[0].tagName).toBe('DD');
    const terms = [...container.querySelectorAll('dt')].map(
      (dt) => dt.textContent,
    );
    expect(terms).toEqual(['Ostatnia cena']);
  });

  it('keeps breadcrumb text but drops the link while its section is not built', () => {
    render(<ItemDetail item={sold} posts={[]} canLink={never} />);
    const crumbs = screen.getByRole('navigation', { name: 'Okruszki' });
    expect(within(crumbs).queryAllByRole('link')).toHaveLength(0);
    expect(within(crumbs).getByText('Galeria prac')).toBeTruthy();
  });

  it('lists related posts and the pattern, linked when their sections exist', () => {
    render(
      <ItemDetail
        item={available}
        posts={[post({ slug: 'smoki', title: 'Smoki w menażerii' })]}
        pattern={pattern({ slug: 'wzor-smok', name: 'Wzór: Smok Szafir' })}
        canLink={always}
      />,
    );
    expect(
      screen.getByRole('heading', { level: 2, name: 'Powiązane wpisy' }),
    ).toBeTruthy();
    expect(
      screen
        .getByRole('link', { name: 'Smoki w menażerii' })
        .getAttribute('href'),
    ).toBe('/blog/smoki');
    expect(
      screen
        .getByRole('link', { name: 'Wzór: Smok Szafir' })
        .getAttribute('href'),
    ).toBe('/patterns/wzor-smok');
  });

  it('shows related titles as plain text before the blog and patterns exist', () => {
    render(
      <ItemDetail
        item={available}
        posts={[post({ slug: 'smoki', title: 'Smoki w menażerii' })]}
        pattern={pattern({ slug: 'wzor-smok', name: 'Wzór: Smok Szafir' })}
        canLink={never}
      />,
    );
    expect(screen.getByText('Smoki w menażerii')).toBeTruthy();
    expect(screen.getByText('Wzór: Smok Szafir')).toBeTruthy();
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });

  it('leaves out the related sections when there is nothing to show', () => {
    render(<ItemDetail item={available} posts={[]} canLink={always} />);
    expect(
      screen.queryByRole('heading', { name: 'Powiązane wpisy' }),
    ).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Wzór' })).toBeNull();
  });
});
