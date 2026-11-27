import Image from 'next/image';
import Link from 'next/link';
import { siteName, siteTagline } from '../../lib/site';
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
      <div className={styles.brandBlock}>
        {/* Decorative: the name labels the link, which covers the whole block. */}
        <Image
          className={styles.logo}
          src="/decor/logo.webp"
          alt=""
          width={128}
          height={134}
          loading="eager"
        />
        <Link className={styles.brand} href="/">
          {siteName}
        </Link>
        <p className={styles.tagline} lang="en">
          {siteTagline}
        </p>
      </div>
      <SiteNav items={items} />
    </header>
  );
}
