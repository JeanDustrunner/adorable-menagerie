import type { Item } from '../../lib/catalog';
import { MaybeLink } from '../MaybeLink';
import type { CanLink } from '../MaybeLink';
import { ItemCard } from './ItemCard';
import styles from './ItemGrid.module.css';
import { ProductGrid } from './ProductGrid';

interface ItemGridProps {
  readonly items: readonly Item[];
  readonly canLink: CanLink;
}

/** Grid of item cards in the given order, or the empty state of spec 6.2. */
export function ItemGrid({ items, canLink }: ItemGridProps) {
  return (
    <ProductGrid
      entries={items}
      renderCard={(item, eager) => <ItemCard item={item} eager={eager} />}
      emptyTitle="Wszystkie przytulanki są teraz w nowych domach"
      emptyBody={
        <>
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
        </>
      }
    />
  );
}
