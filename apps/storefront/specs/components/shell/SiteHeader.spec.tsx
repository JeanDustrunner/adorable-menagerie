import { render, screen } from '@testing-library/react';
import { SiteHeader } from '../../../src/components/shell/SiteHeader';
import type { NavItem } from '../../../src/lib/navigation';

vi.mock('next/navigation', () => ({ usePathname: () => '/' }));

const items: readonly NavItem[] = [
  { label: 'Przytulanki', href: '/toys', ready: true },
];

describe('SiteHeader', () => {
  it('is the page banner and links the brand name to the home page', () => {
    render(<SiteHeader items={items} />);
    expect(screen.getByRole('banner')).toBeTruthy();
    const brand = screen.getByRole('link', { name: 'Adorable Menagerie' });
    expect(brand.getAttribute('href')).toBe('/');
  });

  it('contains the main navigation', () => {
    render(<SiteHeader items={items} />);
    expect(
      screen.getByRole('navigation', { name: 'Główna nawigacja' }),
    ).toBeTruthy();
  });

  it('shows only the brand when no section page exists yet', () => {
    render(<SiteHeader items={[]} />);
    expect(screen.queryByRole('navigation')).toBeNull();
    expect(
      screen.getByRole('link', { name: 'Adorable Menagerie' }),
    ).toBeTruthy();
  });
});
