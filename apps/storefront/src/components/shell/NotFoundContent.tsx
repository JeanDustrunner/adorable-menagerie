import Link from 'next/link';
import type { NavItem } from '../../lib/navigation';
import styles from './NotFoundContent.module.css';

interface NotFoundContentProps {
  readonly items: readonly NavItem[];
}

export function NotFoundContent({ items }: NotFoundContentProps) {
  return (
    <div className={styles.page}>
      <h1>Nie znaleziono strony</h1>
      <p>Ta strona nie istnieje albo została przeniesiona.</p>
      <ul className={styles.links}>
        <li>
          <Link className={styles.link} href="/">
            Strona główna
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.href}>
            <Link className={styles.link} href={item.href}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
