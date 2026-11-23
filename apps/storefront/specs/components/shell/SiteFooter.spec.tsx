import { render, screen } from '@testing-library/react';
import { SiteFooter } from '../../../src/components/shell/SiteFooter';
import type { NavItem } from '../../../src/lib/navigation';

const items: readonly NavItem[] = [
  { label: 'Blog', href: '/blog', ready: true },
  { label: 'Kontakt', href: '/contact', ready: true },
];

describe('SiteFooter', () => {
  it('is the content-info landmark with the brand and the demonstration statement', () => {
    render(<SiteFooter items={items} />);
    expect(screen.getByRole('contentinfo')).toBeTruthy();
    expect(screen.getByText('Adorable Menagerie')).toBeTruthy();
    expect(
      screen.getByText(
        'Projekt demonstracyjny. Wszystkie produkty, ceny i dane są fikcyjne.',
      ),
    ).toBeTruthy();
  });

  it('repeats the section links in a labelled navigation', () => {
    render(<SiteFooter items={items} />);
    const nav = screen.getByRole('navigation', { name: 'Stopka' });
    expect(
      Array.from(nav.querySelectorAll('a')).map((a) => a.getAttribute('href')),
    ).toEqual(['/blog', '/contact']);
  });

  it('shows no navigation when no section page exists yet', () => {
    render(<SiteFooter items={[]} />);
    expect(screen.queryByRole('navigation')).toBeNull();
  });
});
