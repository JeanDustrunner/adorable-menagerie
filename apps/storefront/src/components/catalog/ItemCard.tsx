import Image from 'next/image';
import Link from 'next/link';
import { availabilityLabel } from '../../lib/catalog';
import type { Item } from '../../lib/catalog';
import { itemSummary, photoSrc } from '../../lib/catalog/presentation';
import { formatPrice } from '../../lib/format/price';
import styles from './ItemCard.module.css';

interface ItemCardProps {
  readonly item: Item;
  /** Load the photo at once: for cards in the first row, the likely LCP. */
  readonly eager?: boolean;
}

/**
 * Catalog card. Only the name is a link, so its accessible name is the item name
 * (spec 8); a stretched pseudo-element makes the whole card clickable.
 */
export function ItemCard({ item, eager = false }: ItemCardProps) {
  const cover = item.photos[0];
  const summary = itemSummary(item);
  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <Image
          src={photoSrc(cover)}
          alt={cover.alt}
          fill
          loading={eager ? 'eager' : 'lazy'}
          sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
          className={styles.photo}
        />
      </div>
      <div className={styles.body}>
        <h2 className={styles.name}>
          <Link className={styles.link} href={`/toys/${item.slug}`}>
            {item.name}
          </Link>
        </h2>
        {summary && <p className={styles.summary}>{summary}</p>}
        <p className={styles.meta}>
          <span className={styles.price}>{formatPrice(item.priceGrosze)}</span>
          <span className={styles.label}>{availabilityLabel(item)}</span>
        </p>
      </div>
    </article>
  );
}
