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
    const brand = screen.getByRole('link', { name: 'Urocza Menażeria' });
    expect(brand.getAttribute('href')).toBe('/');
  });

  it('shows the logo as decoration: the visible name labels the link', () => {
    render(<SiteHeader items={items} />);
    const banner = screen.getByRole('banner');
    // alt="" keeps the logo out of the accessibility tree: no img role.
    expect(screen.queryAllByRole('img')).toHaveLength(0);
    const logo = banner.querySelector('img');
    expect(logo?.getAttribute('src')).toContain('logo.webp');
    expect(logo?.getAttribute('alt')).toBe('');
    expect(
      screen.getByRole('link', { name: 'Urocza Menażeria' }).textContent,
    ).toBe('Urocza Menażeria');
  });

  it('shows the tagline next to the name', () => {
    render(<SiteHeader items={items} />);
    expect(screen.getByText('friends made with love')).toBeTruthy();
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
    expect(screen.getByRole('link', { name: 'Urocza Menażeria' })).toBeTruthy();
  });
});
