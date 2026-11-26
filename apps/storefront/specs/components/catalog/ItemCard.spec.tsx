import { render, screen } from '@testing-library/react';
import { ItemCard } from '../../../src/components/catalog/ItemCard';
import { item, photo } from '../../lib/catalog/builders';

const konik = item({
  slug: 'konik-karmel',
  name: 'Konik Karmel',
  priceGrosze: 18900,
  quantity: 3,
  technique: 'szydelko',
  dimensionsCm: { height: 32 },
  photos: [
    photo({ file: 'konik-karmel-1.jpg', alt: 'Konik przed motkami' }),
    photo({ file: 'konik-karmel-2.jpg', alt: 'Konik w pudełku' }),
  ],
});

describe('ItemCard', () => {
  it('is one link named after the item, leading to its detail page', () => {
    render(<ItemCard item={konik} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0].getAttribute('href')).toBe('/toys/konik-karmel');
    expect(screen.getByRole('link', { name: 'Konik Karmel' })).toBeTruthy();
  });

  it('shows the cover photo with its alt text', () => {
    render(<ItemCard item={konik} />);
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(1);
    expect(images[0].getAttribute('alt')).toBe('Konik przed motkami');
  });

  it('shows summary, price and availability as text', () => {
    render(<ItemCard item={konik} />);
    expect(screen.getByText('Na szydełku, 32 cm')).toBeTruthy();
    expect(screen.getByText('189 zł')).toBeTruthy();
    expect(screen.getByText('Dostępny')).toBeTruthy();
  });

  it('marks the last piece', () => {
    render(<ItemCard item={{ ...konik, quantity: 1 }} />);
    expect(screen.getByText('Ostatnia sztuka')).toBeTruthy();
  });

  it('leaves out the summary line when there is nothing to say', () => {
    render(<ItemCard item={item({ name: 'Bez szczegółów' })} />);
    expect(screen.queryByText(/cm$|^Na /)).toBeNull();
    expect(screen.getByText('Dostępny')).toBeTruthy();
  });
});

describe('ItemCard photo loading', () => {
  it('loads lazily by default and at once for first-row cards', () => {
    const { unmount } = render(<ItemCard item={konik} />);
    expect(screen.getByRole('img').getAttribute('loading')).toBe('lazy');
    unmount();
    render(<ItemCard item={konik} eager />);
    expect(screen.getByRole('img').getAttribute('loading')).toBe('eager');
  });
});
