import { availabilityLabel } from '../../lib/catalog';
import type { Item, Pattern, Post } from '../../lib/catalog';
import {
  itemDetails,
  reproducibilityNote,
} from '../../lib/catalog/presentation';
import { formatPrice } from '../../lib/format/price';
import type { CanLink } from '../MaybeLink';
import { Breadcrumb } from './detail/Breadcrumb';
import { Description } from './detail/Description';
import styles from './detail/Detail.module.css';
import { DetailsSection } from './detail/DetailsSection';
import { LinkSection } from './detail/LinkSection';
import { PhotoGallery } from './detail/PhotoGallery';
import { RelatedPosts } from './detail/RelatedPosts';

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
  const section = available
    ? { label: 'Przytulanki', href: '/toys' }
    : { label: 'Galeria prac', href: '/gallery' };
  return (
    <div className={styles.page}>
      <Breadcrumb section={section} current={item.name} canLink={canLink} />
      <article className={styles.layout}>
        <PhotoGallery photos={item.photos} />
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
          <Description text={item.description} />
          <DetailsSection
            details={itemDetails(item)}
            tags={item.tags}
            note={reproducibilityNote(item)}
          />
          <RelatedPosts posts={posts} canLink={canLink} />
          {pattern && (
            <LinkSection
              title="Wzór"
              href={`/patterns/${pattern.slug}`}
              label={pattern.name}
              canLink={canLink}
            />
          )}
        </div>
      </article>
    </div>
  );
}
