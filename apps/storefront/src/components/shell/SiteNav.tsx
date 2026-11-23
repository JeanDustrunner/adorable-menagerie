'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState, useSyncExternalStore } from 'react';
import type { KeyboardEvent } from 'react';
import { isActive } from '../../lib/navigation';
import type { NavItem } from '../../lib/navigation';
import styles from './SiteNav.module.css';

const LIST_ID = 'site-nav-list';

const subscribeNever = () => () => undefined;

/** False while rendering on the server and during hydration, true afterwards. */
function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
}

interface SiteNavProps {
  readonly items: readonly NavItem[];
}

/**
 * Main navigation. Without JavaScript every link is simply visible. Once the page is
 * hydrated, small screens collapse the links behind a Menu button. This is the one
 * client component the shell needs, because the layout (and so the menu) persists
 * across client-side navigations and must close itself.
 */
export function SiteNav({ items }: SiteNavProps) {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const [open, setOpen] = useState(false);
  // The menu lives in the layout, so it survives navigation. Close it whenever the
  // page changes by adjusting state during render (React's documented pattern for
  // state that depends on a changing value), not in an effect.
  const [seenPath, setSeenPath] = useState(pathname);
  if (seenPath !== pathname) {
    setSeenPath(pathname);
    setOpen(false);
  }
  const buttonRef = useRef<HTMLButtonElement>(null);

  if (items.length === 0) return null;

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape' && open) {
      setOpen(false);
      buttonRef.current?.focus();
    }
  }

  return (
    <nav
      className={styles.nav}
      aria-label="Główna nawigacja"
      data-enhanced={hydrated}
      data-open={open}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={buttonRef}
        type="button"
        className={styles.menuButton}
        aria-expanded={open}
        aria-controls={LIST_ID}
        onClick={() => setOpen(!open)}
      >
        Menu
      </button>
      <ul id={LIST_ID} className={styles.list}>
        {items.map((item) => (
          <li key={item.href}>
            <Link
              className={styles.link}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
