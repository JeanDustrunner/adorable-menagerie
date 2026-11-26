import type { Item } from '../../lib/catalog';
import { MaybeLink } from '../MaybeLink';
import type { CanLink } from '../MaybeLink';
import { ItemCard } from './ItemCard';
import styles from './ItemGrid.module.css';

/** Cards in the first desktop row, whose photos are loaded at once. */
const EAGER_CARDS = 4;

interface ItemGridProps {
  readonly items: readonly Item[];
  readonly canLink: CanLink;
}

/** Grid of item cards in the given order, or the empty state of spec 6.2. */
export function ItemGrid({ items, canLink }: ItemGridProps) {
  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <h2 className={styles.emptyTitle}>
          Wszystkie przytulanki są teraz w nowych domach
        </h2>
        <p>Zobacz, co już powstało, albo zrób własną według wzoru:</p>
        <ul className={styles.links}>
          <li>
            <MaybeLink
              className={styles.link}
              href="/gallery"
              canLink={canLink}
            >
              Galeria prac
            </MaybeLink>
          </li>
          <li>
            <MaybeLink
              className={styles.link}
              href="/patterns"
              canLink={canLink}
            >
              Wzory
            </MaybeLink>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <ul className={styles.grid}>
      {items.map((item, index) => (
        <li key={item.slug}>
          <ItemCard item={item} eager={index < EAGER_CARDS} />
        </li>
      ))}
    </ul>
  );
}
