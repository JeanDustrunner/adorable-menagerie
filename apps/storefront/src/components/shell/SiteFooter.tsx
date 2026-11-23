import Link from 'next/link';
import { siteName } from '../../lib/site';
import { visibleNavItems } from '../../lib/navigation';
import type { NavItem } from '../../lib/navigation';
import styles from './SiteFooter.module.css';

interface SiteFooterProps {
  readonly items?: readonly NavItem[];
}

export function SiteFooter({ items = visibleNavItems() }: SiteFooterProps) {
  return (
    <footer className={styles.footer}>
      <div>
        <p className={styles.brand}>{siteName}</p>
        <p>
          Projekt demonstracyjny. Wszystkie produkty, ceny i dane są fikcyjne.
        </p>
      </div>
      {items.length > 0 && (
        <nav aria-label="Stopka">
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item.href}>
                <Link className={styles.link} href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </footer>
  );
}
