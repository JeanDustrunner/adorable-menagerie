import { render, screen } from '@testing-library/react';
import { NotFoundContent } from '../../../src/components/shell/NotFoundContent';
import type { NavItem } from '../../../src/lib/navigation';

const items: readonly NavItem[] = [
  { label: 'Przytulanki', href: '/toys', ready: true },
  { label: 'Blog', href: '/blog', ready: true },
];

describe('NotFoundContent', () => {
  it('explains in Polish that the page does not exist, under one main heading', () => {
    render(<NotFoundContent items={items} />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Nie znaleziono strony' }),
    ).toBeTruthy();
  });

  it('always offers the home page', () => {
    render(<NotFoundContent items={[]} />);
    const home = screen.getByRole('link', { name: 'Strona główna' });
    expect(home.getAttribute('href')).toBe('/');
  });

  it('also links to every section that exists', () => {
    render(<NotFoundContent items={items} />);
    expect(
      screen.getByRole('link', { name: 'Przytulanki' }).getAttribute('href'),
    ).toBe('/toys');
    expect(
      screen.getByRole('link', { name: 'Blog' }).getAttribute('href'),
    ).toBe('/blog');
  });
});
