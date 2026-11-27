import { render, screen, within } from '@testing-library/react';
import { GalleryGrid } from '../../../src/components/gallery/GalleryGrid';
import { item, photo } from '../../lib/catalog/builders';

const rosa = item({
  slug: 'lama-rosa',
  name: 'Lama Rosa',
  availability: 'unavailable',
  quantity: 0,
  priceGrosze: 15900,
  dimensionsCm: { height: 30 },
  photos: [photo({ file: 'lama-rosa-1.jpg', alt: 'Różowa lama na kocu' })],
});
const popiolek = item({
  slug: 'smok-popiolek',
  name: 'Smok Popiołek',
  availability: 'unavailable',
  quantity: 0,
});

describe('GalleryGrid', () => {
  it('shows one tile per item, in the given order', () => {
    render(<GalleryGrid items={[rosa, popiolek]} />);
    const names = screen
      .getAllByRole('listitem')
      .map((li) => li.querySelector('h2')?.textContent);
    expect(names).toEqual(['Lama Rosa', 'Smok Popiołek']);
  });

  it('makes each tile one link named after the item, to its detail page', () => {
    render(<GalleryGrid items={[rosa]} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0].getAttribute('href')).toBe('/toys/lama-rosa');
    expect(screen.getByRole('link', { name: 'Lama Rosa' })).toBeTruthy();
  });

  it('shows the cover photo and "W nowym domu", but no price or summary (OD-8)', () => {
    render(<GalleryGrid items={[rosa]} />);
    const tile = screen.getByRole('listitem');
    expect(within(tile).getByRole('img').getAttribute('alt')).toBe(
      'Różowa lama na kocu',
    );
    expect(within(tile).getByText('W nowym domu')).toBeTruthy();
    expect(tile.textContent).not.toMatch(/zł/);
    expect(tile.textContent).not.toMatch(/cm/);
  });

  it('asks for photos sized for a compact tile', () => {
    render(<GalleryGrid items={[rosa]} />);
    expect(screen.getByRole('img').getAttribute('sizes')).toBe(
      '(max-width: 1023px) 33vw, 12rem',
    );
  });

  it('loads the first row of photos at once and the rest lazily', () => {
    const many = Array.from({ length: 8 }, (_, i) =>
      item({ slug: `p-${i}`, name: `Praca ${i}`, availability: 'unavailable' }),
    );
    render(<GalleryGrid items={many} />);
    const loading = screen
      .getAllByRole('img')
      .map((img) => img.getAttribute('loading'));
    expect(loading).toEqual([
      'eager',
      'eager',
      'eager',
      'eager',
      'eager',
      'eager',
      'lazy',
      'lazy',
    ]);
  });

  it('says so when nothing has found a home yet', () => {
    render(<GalleryGrid items={[]} />);
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Galeria jest jeszcze pusta',
      }),
    ).toBeTruthy();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
