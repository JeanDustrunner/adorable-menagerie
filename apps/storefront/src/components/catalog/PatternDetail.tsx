import type { Item, Pattern, Post } from '../../lib/catalog';
import { patternDetails } from '../../lib/catalog/presentation';
import { formatPrice } from '../../lib/format/price';
import type { CanLink } from '../MaybeLink';
import { Breadcrumb } from './detail/Breadcrumb';
import { Description } from './detail/Description';
import styles from './detail/Detail.module.css';
import { DetailsSection } from './detail/DetailsSection';
import { LinkSection } from './detail/LinkSection';
import { PhotoGallery } from './detail/PhotoGallery';
import { RelatedPosts } from './detail/RelatedPosts';

interface PatternDetailProps {
  readonly pattern: Pattern;
  /** Posts that reference this pattern, newest first. */
  readonly posts: readonly Post[];
  /** The public item made from this pattern, if any. */
  readonly madeItem?: Item;
  readonly canLink: CanLink;
}

/** Pattern detail (spec 6.4). No download or buy control (R5). */
export function PatternDetail({
  pattern,
  posts,
  madeItem,
  canLink,
}: PatternDetailProps) {
  return (
    <div className={styles.page}>
      <Breadcrumb
        section={{ label: 'Wzory', href: '/patterns' }}
        current={pattern.name}
        canLink={canLink}
      />
      <article className={styles.layout}>
        <PhotoGallery photos={pattern.photos} />
        <div>
          <h1 className={styles.title}>{pattern.name}</h1>
          <p className={`${styles.status} ${styles.price}`}>
            {formatPrice(pattern.priceGrosze)}
          </p>
          <Description text={pattern.description} />
          <DetailsSection
            details={patternDetails(pattern)}
            tags={pattern.tags}
          />
          <RelatedPosts posts={posts} canLink={canLink} />
          {madeItem && (
            <LinkSection
              title="Gotowa przytulanka"
              href={`/toys/${madeItem.slug}`}
              label={madeItem.name}
              canLink={canLink}
            />
          )}
        </div>
      </article>
    </div>
  );
}
