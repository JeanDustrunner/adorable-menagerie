import type { ReactNode } from 'react';
import styles from './ProductGrid.module.css';

export type GridLayout = 'cards' | 'tiles';

/** Entries in the first desktop row, whose photos are loaded at once. */
const FIRST_ROW: Record<GridLayout, number> = { cards: 4, tiles: 6 };

interface ProductGridProps<T extends { readonly slug: string }> {
  readonly entries: readonly T[];
  readonly renderCard: (entry: T, eager: boolean) => ReactNode;
  /** Heading shown instead of the grid when there are no entries. */
  readonly emptyTitle: string;
  readonly emptyBody?: ReactNode;
  /** Four product cards per desktop row, or six compact gallery tiles. */
  readonly layout?: GridLayout;
}

/** Grid of product cards in the given order, or an empty state under a heading. */
export function ProductGrid<T extends { readonly slug: string }>({
  entries,
  renderCard,
  emptyTitle,
  emptyBody,
  layout = 'cards',
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
    <ul
      className={
        layout === 'tiles' ? `${styles.grid} ${styles.tiles}` : styles.grid
      }
    >
      {entries.map((entry, index) => (
        <li key={entry.slug}>{renderCard(entry, index < FIRST_ROW[layout])}</li>
      ))}
    </ul>
  );
}
