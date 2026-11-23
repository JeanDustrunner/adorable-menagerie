export interface NavItem {
  readonly label: string;
  readonly href: string;
  /**
   * True once the page behind `href` exists. Only ready items are shown, so the
   * deployed site never links to a 404. Each page task flips its own flag.
   */
  readonly ready: boolean;
}

/** Main navigation in the order the spec fixes: Polish labels, English paths. */
export const navItems: readonly NavItem[] = [
  { label: 'Przytulanki', href: '/toys', ready: false },
  { label: 'Wzory', href: '/patterns', ready: false },
  { label: 'Galeria prac', href: '/gallery', ready: false },
  { label: 'Blog', href: '/blog', ready: false },
  { label: 'O nas', href: '/about', ready: false },
  { label: 'Kontakt', href: '/contact', ready: false },
];

export function visibleNavItems(
  items: readonly NavItem[] = navItems,
): readonly NavItem[] {
  return items.filter((item) => item.ready);
}

function withoutTrailingSlash(path: string): string {
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
}

/** True when `pathname` is the section at `href` or a page below it. */
export function isActive(pathname: string, href: string): boolean {
  const current = withoutTrailingSlash(pathname);
  if (href === '/') return current === '/';
  return current === href || current.startsWith(`${href}/`);
}
