import { render, screen } from '@testing-library/react';
import { PatternCard } from '../../../src/components/catalog/PatternCard';
import { pattern, photo } from '../../lib/catalog/builders';

const smok = pattern({
  slug: 'wzor-smok-szafir',
  name: 'Wzór: Smok Szafir',
  priceGrosze: 3900,
  craft: 'szydelko',
  difficulty: 'zaawansowany',
  format: 'PDF',
  photos: [photo({ file: 'smok-szafir-1.jpg', alt: 'Gotowy smok' })],
});

describe('PatternCard', () => {
  it('is one link named after the pattern, leading to its detail page', () => {
    render(<PatternCard pattern={smok} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0].getAttribute('href')).toBe('/patterns/wzor-smok-szafir');
    expect(
      screen.getByRole('link', { name: 'Wzór: Smok Szafir' }),
    ).toBeTruthy();
  });

  it('shows the cover photo, craft and difficulty, price and format', () => {
    render(<PatternCard pattern={smok} />);
    expect(screen.getByRole('img').getAttribute('alt')).toBe('Gotowy smok');
    expect(screen.getByText('Szydełko, zaawansowany')).toBeTruthy();
    expect(screen.getByText('39 zł')).toBeTruthy();
    expect(screen.getByText('Format: PDF')).toBeTruthy();
  });

  it('shows only the price next to it when the format is unknown', () => {
    const { container } = render(
      <PatternCard pattern={{ ...smok, format: undefined }} />,
    );
    expect(screen.queryByText(/PDF/)).toBeNull();
    expect(screen.getByText('39 zł').parentElement?.children).toHaveLength(1);
    expect(container.textContent).not.toContain('undefined');
  });

  it('says nothing about stock: patterns have no availability', () => {
    render(<PatternCard pattern={smok} />);
    expect(
      screen.queryByText(/Dostępny|Ostatnia sztuka|W nowym domu/),
    ).toBeNull();
  });
});
