import {
  isActive,
  isSectionReady,
  navItems,
  visibleNavItems,
} from '../../src/lib/navigation';
import type { NavItem } from '../../src/lib/navigation';

describe('navItems', () => {
  it('lists the sections in the order the spec fixes, with Polish labels and English paths', () => {
    expect(navItems.map((i) => [i.label, i.href])).toEqual([
      ['Przytulanki', '/toys'],
      ['Wzory', '/patterns'],
      ['Galeria prac', '/gallery'],
      ['Blog', '/blog'],
      ['O nas', '/about'],
      ['Kontakt', '/contact'],
    ]);
  });

  it('uses unique paths that start with a slash', () => {
    const hrefs = navItems.map((i) => i.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    expect(hrefs.every((h) => h.startsWith('/'))).toBe(true);
  });
});

describe('visibleNavItems', () => {
  const items: readonly NavItem[] = [
    { label: 'A', href: '/a', ready: true },
    { label: 'B', href: '/b', ready: false },
    { label: 'C', href: '/c', ready: true },
  ];

  it('keeps only items whose page exists, in order', () => {
    expect(visibleNavItems(items).map((i) => i.label)).toEqual(['A', 'C']);
  });

  it('returns nothing when no page is ready', () => {
    expect(visibleNavItems(items.map((i) => ({ ...i, ready: false })))).toEqual(
      [],
    );
  });
});

describe('isActive', () => {
  it('matches the exact path', () => {
    expect(isActive('/toys', '/toys')).toBe(true);
  });

  it('matches nested paths below the item', () => {
    expect(isActive('/toys/konik-karmel', '/toys')).toBe(true);
  });

  it('does not match a path that only shares a prefix', () => {
    expect(isActive('/toysters', '/toys')).toBe(false);
    expect(isActive('/blog-archive', '/blog')).toBe(false);
  });

  it('ignores a trailing slash on the current path', () => {
    expect(isActive('/toys/', '/toys')).toBe(true);
  });

  it('does not match unrelated paths', () => {
    expect(isActive('/patterns', '/toys')).toBe(false);
  });

  it('treats the home path as active only on the home page', () => {
    expect(isActive('/', '/')).toBe(true);
    expect(isActive('/toys', '/')).toBe(false);
  });
});

describe('isSectionReady', () => {
  const items: readonly NavItem[] = [
    { label: 'Przytulanki', href: '/toys', ready: true },
    { label: 'Blog', href: '/blog', ready: false },
  ];

  it('is true for a ready section and every page below it', () => {
    expect(isSectionReady('/toys', items)).toBe(true);
    expect(isSectionReady('/toys/konik-karmel', items)).toBe(true);
  });

  it('is false for a section whose pages do not exist yet', () => {
    expect(isSectionReady('/blog/smoki', items)).toBe(false);
  });

  it('is false for a path outside every section', () => {
    expect(isSectionReady('/toysy', items)).toBe(false);
  });

  it('opens the catalog section for real (T1.3)', () => {
    expect(isSectionReady('/toys/konik-karmel')).toBe(true);
  });

  it('opens the patterns section for real (T1.4)', () => {
    expect(isSectionReady('/patterns/wzor-smok-szafir')).toBe(true);
  });
});
