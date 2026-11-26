import { useId } from 'react';
import type { Post } from '../../../lib/catalog';
import { MaybeLink } from '../../MaybeLink';
import type { CanLink } from '../../MaybeLink';
import styles from './Detail.module.css';

interface RelatedPostsProps {
  readonly posts: readonly Post[];
  readonly canLink: CanLink;
}

/** "Powiązane wpisy"; renders nothing when no post refers to the page. */
export function RelatedPosts({ posts, canLink }: RelatedPostsProps) {
  const titleId = useId();
  if (posts.length === 0) return null;
  return (
    <section aria-labelledby={titleId} className={styles.section}>
      <h2 id={titleId} className={styles.sectionTitle}>
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
  );
}
