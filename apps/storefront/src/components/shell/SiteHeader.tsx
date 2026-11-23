import Link from 'next/link';
import { siteName } from '../../lib/site';
import { visibleNavItems } from '../../lib/navigation';
import type { NavItem } from '../../lib/navigation';
import { SiteNav } from './SiteNav';
import styles from './SiteHeader.module.css';

interface SiteHeaderProps {
  readonly items?: readonly NavItem[];
}

export function SiteHeader({ items = visibleNavItems() }: SiteHeaderProps) {
  return (
    <header className={styles.header}>
      <Link className={styles.brand} href="/">
        {siteName}
      </Link>
      <SiteNav items={items} />
    </header>
  );
}
