import Image from 'next/image';
import Link from 'next/link';
import type { Photo } from '../../lib/catalog';
import { photoSrc } from '../../lib/catalog/presentation';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  readonly href: string;
  readonly name: string;
  readonly cover: Photo;
  readonly price: string;
  /** Line under the name; left out when there is nothing to say. */
  readonly summary?: string;
  /** Short text next to the price, such as the availability label. */
  readonly note?: string;
  /** Load the photo at once: for cards in the first row, the likely LCP. */
  readonly eager?: boolean;
}

/**
 * Card for an item or a pattern. Only the name is a link, so its accessible name
 * is the product name (spec 8); a stretched pseudo-element makes the whole card
 * clickable.
 */
export function ProductCard({
  href,
  name,
  cover,
  price,
  summary,
  note,
  eager = false,
}: ProductCardProps) {
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
          <Link className={styles.link} href={href}>
            {name}
          </Link>
        </h2>
        {summary && <p className={styles.summary}>{summary}</p>}
        <p className={styles.meta}>
          <span className={styles.price}>{price}</span>
          {note && <span className={styles.label}>{note}</span>}
        </p>
      </div>
    </article>
  );
}
