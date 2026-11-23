import { fireEvent, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SiteNav } from '../../../src/components/shell/SiteNav';
import type { NavItem } from '../../../src/lib/navigation';

const router = vi.hoisted(() => ({ pathname: '/' }));
vi.mock('next/navigation', () => ({ usePathname: () => router.pathname }));

const items: readonly NavItem[] = [
  { label: 'Przytulanki', href: '/toys', ready: true },
  { label: 'Wzory', href: '/patterns', ready: true },
  { label: 'Blog', href: '/blog', ready: true },
];

beforeEach(() => {
  router.pathname = '/';
});

describe('SiteNav', () => {
  it('renders no navigation landmark when there are no items', () => {
    render(<SiteNav items={[]} />);
    expect(screen.queryByRole('navigation')).toBeNull();
  });

  it('renders a labelled navigation with one link per item, in order', () => {
    render(<SiteNav items={items} />);
    const nav = screen.getByRole('navigation', { name: 'Główna nawigacja' });
    const links = Array.from(nav.querySelectorAll('a')).map((a) => [
      a.textContent,
      a.getAttribute('href'),
    ]);
    expect(links).toEqual([
      ['Przytulanki', '/toys'],
      ['Wzory', '/patterns'],
      ['Blog', '/blog'],
    ]);
  });

  it('marks only the current section with aria-current="page"', () => {
    router.pathname = '/patterns';
    render(<SiteNav items={items} />);
    expect(
      screen.getByRole('link', { name: 'Wzory' }).getAttribute('aria-current'),
    ).toBe('page');
    expect(
      screen
        .getByRole('link', { name: 'Przytulanki' })
        .getAttribute('aria-current'),
    ).toBeNull();
  });

  it('keeps a section current on its detail pages', () => {
    router.pathname = '/toys/konik-karmel';
    render(<SiteNav items={items} />);
    expect(
      screen
        .getByRole('link', { name: 'Przytulanki' })
        .getAttribute('aria-current'),
    ).toBe('page');
  });

  it('marks nothing current on the home page', () => {
    render(<SiteNav items={items} />);
    expect(document.querySelector('[aria-current]')).toBeNull();
  });
});

describe('SiteNav mobile menu', () => {
  it('starts collapsed and opens and closes with the Menu button', () => {
    render(<SiteNav items={items} />);
    const button = screen.getByRole('button', { name: 'Menu' });
    expect(button.getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('true');

    fireEvent.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('points the button at the list it controls', () => {
    render(<SiteNav items={items} />);
    const button = screen.getByRole('button', { name: 'Menu' });
    const listId = button.getAttribute('aria-controls');
    expect(listId).toBeTruthy();
    expect(document.getElementById(listId ?? '')?.tagName).toBe('UL');
  });

  it('closes on Escape and returns focus to the button', () => {
    render(<SiteNav items={items} />);
    const button = screen.getByRole('button', { name: 'Menu' });
    fireEvent.click(button);

    fireEvent.keyDown(screen.getByRole('navigation'), { key: 'Escape' });

    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(button);
  });

  it('closes after navigating to another page', () => {
    const { rerender } = render(<SiteNav items={items} />);
    const button = screen.getByRole('button', { name: 'Menu' });
    fireEvent.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('true');

    router.pathname = '/blog';
    rerender(<SiteNav items={items} />);

    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('stays closed when you come back to the page it was opened on', () => {
    router.pathname = '/toys';
    const { rerender } = render(<SiteNav items={items} />);
    const button = screen.getByRole('button', { name: 'Menu' });
    fireEvent.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('true');

    router.pathname = '/blog';
    rerender(<SiteNav items={items} />);
    router.pathname = '/toys';
    rerender(<SiteNav items={items} />);

    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes when you choose a link, even the one for the page you are on', () => {
    router.pathname = '/toys';
    render(<SiteNav items={items} />);
    const button = screen.getByRole('button', { name: 'Menu' });
    fireEvent.click(button);

    fireEvent.click(screen.getByRole('link', { name: 'Przytulanki' }));

    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('server-renders every link and marks itself not yet enhanced, so it works without JavaScript', () => {
    const html = renderToStaticMarkup(<SiteNav items={items} />);
    expect(html).toContain('href="/toys"');
    expect(html).toContain('href="/patterns"');
    expect(html).toContain('data-enhanced="false"');
  });
});
