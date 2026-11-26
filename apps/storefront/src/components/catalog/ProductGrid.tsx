import type { ReactNode } from 'react';
import styles from './ProductGrid.module.css';

/** Cards in the first desktop row, whose photos are loaded at once. */
const EAGER_CARDS = 4;

interface ProductGridProps<T extends { readonly slug: string }> {
  readonly entries: readonly T[];
  readonly renderCard: (entry: T, eager: boolean) => ReactNode;
  /** Heading shown instead of the grid when there are no entries. */
  readonly emptyTitle: string;
  readonly emptyBody?: ReactNode;
}

/** Grid of product cards in the given order, or an empty state under a heading. */
export function ProductGrid<T extends { readonly slug: string }>({
  entries,
  renderCard,
  emptyTitle,
  emptyBody,
}: ProductGridProps<T>) {
  if (entries.length === 0) {
    return (
      <div className={styles.empty}>
        <h2 className={styles.emptyTitle}>{emptyTitle}</h2>
        {emptyBody}
      </div>
    );
  }

  return (
    <ul className={styles.grid}>
      {entries.map((entry, index) => (
        <li key={entry.slug}>{renderCard(entry, index < EAGER_CARDS)}</li>
      ))}
    </ul>
  );
}
