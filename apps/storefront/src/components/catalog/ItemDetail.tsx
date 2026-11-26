import Image from 'next/image';
import { availabilityLabel } from '../../lib/catalog';
import type { Item, Pattern, Post } from '../../lib/catalog';
import {
  itemDetails,
  paragraphs,
  photoSrc,
  reproducibilityNote,
} from '../../lib/catalog/presentation';
import { formatPrice } from '../../lib/format/price';
import { MaybeLink } from '../MaybeLink';
import type { CanLink } from '../MaybeLink';
import styles from './ItemDetail.module.css';

interface ItemDetailProps {
  readonly item: Item;
  /** Posts that reference this item, newest first. */
  readonly posts: readonly Post[];
  /** The pattern this item was made from, if one exists. */
  readonly pattern?: Pattern;
  readonly canLink: CanLink;
}

/**
 * Item detail (spec 6.3). Works for available and sold items. There is
 * deliberately no buy, reserve or request control (R5).
 */
export function ItemDetail({ item, posts, pattern, canLink }: ItemDetailProps) {
  const available = item.availability === 'available';
  return (
    <div className={styles.page}>
      <Breadcrumb item={item} canLink={canLink} />
      <article className={styles.layout}>
        <PhotoGallery item={item} />
        <div>
          <h1 className={styles.title}>{item.name}</h1>
          <p className={styles.status}>
            {available && (
              <span className={styles.price}>
                {formatPrice(item.priceGrosze)}
              </span>
            )}
            <span className={styles.label}>{availabilityLabel(item)}</span>
          </p>
          {paragraphs(item.description).map((text, index) => (
            // Static text that never reorders, so the index is a stable key.
            <p key={index}>{text}</p>
          ))}
          <Details item={item} />
          <Related posts={posts} pattern={pattern} canLink={canLink} />
        </div>
      </article>
    </div>
  );
}

function Breadcrumb({ item, canLink }: { item: Item; canLink: CanLink }) {
  const section =
    item.availability === 'available'
      ? { label: 'Przytulanki', href: '/toys' }
      : { label: 'Galeria prac', href: '/gallery' };
  return (
    <nav aria-label="Okruszki" className={styles.breadcrumb}>
      <ol>
        <li>
          <MaybeLink href={section.href} canLink={canLink}>
            {section.label}
          </MaybeLink>
        </li>
        <li>
          <span aria-current="page">{item.name}</span>
        </li>
      </ol>
    </nav>
  );
}

function PhotoGallery({ item }: { item: Item }) {
  const [cover, ...rest] = item.photos;
  return (
    <div className={styles.gallery}>
      <Image
        src={photoSrc(cover)}
        alt={cover.alt}
        width={cover.width}
        height={cover.height}
        sizes="(max-width: 767px) 100vw, 50vw"
        loading="eager"
        fetchPriority="high"
        className={styles.cover}
      />
      {rest.length > 0 && (
        <ul className={styles.thumbs}>
          {rest.map((photo) => (
            <li key={photo.file}>
              <Image
                src={photoSrc(photo)}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 767px) 33vw, 17vw"
                className={styles.thumb}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Details({ item }: { item: Item }) {
  const details = itemDetails(item);
  return (
    <section aria-labelledby="details-title" className={styles.section}>
      <h2 id="details-title" className={styles.sectionTitle}>
        Szczegóły
      </h2>
      {details.length > 0 && (
        <dl className={styles.details}>
          {details.map((d) => (
            <div key={d.term}>
              <dt>{d.term}</dt>
              <dd>{d.value}</dd>
            </div>
          ))}
        </dl>
      )}
      <p className={styles.note}>{reproducibilityNote(item)}</p>
      {item.tags.length > 0 && (
        <ul aria-label="Tagi" className={styles.tags}>
          {item.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

interface RelatedProps {
  readonly posts: readonly Post[];
  readonly pattern?: Pattern;
  readonly canLink: CanLink;
}

function Related({ posts, pattern, canLink }: RelatedProps) {
  return (
    <>
      {posts.length > 0 && (
        <section aria-labelledby="posts-title" className={styles.section}>
          <h2 id="posts-title" className={styles.sectionTitle}>
            Powiązane wpisy
          </h2>
          <ul className={styles.related}>
            {posts.map((post) => (
              <li key={post.slug}>
                <MaybeLink
                  className={styles.link}
                  href={`/blog/${post.slug}`}
                  canLink={canLink}
                >
                  {post.title}
                </MaybeLink>
              </li>
            ))}
          </ul>
        </section>
      )}
      {pattern && (
        <section aria-labelledby="pattern-title" className={styles.section}>
          <h2 id="pattern-title" className={styles.sectionTitle}>
            Wzór
          </h2>
          <p>
            <MaybeLink
              className={styles.link}
              href={`/patterns/${pattern.slug}`}
              canLink={canLink}
            >
              {pattern.name}
            </MaybeLink>
          </p>
        </section>
      )}
    </>
  );
}
