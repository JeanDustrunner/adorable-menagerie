import { useId } from 'react';
import { MaybeLink } from '../../MaybeLink';
import type { CanLink } from '../../MaybeLink';
import styles from './Detail.module.css';

interface LinkSectionProps {
  readonly title: string;
  readonly href: string;
  readonly label: string;
  readonly canLink: CanLink;
}

/** A titled section with one cross-link, e.g. from an item to its pattern. */
export function LinkSection({ title, href, label, canLink }: LinkSectionProps) {
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className={styles.section}>
      <h2 id={titleId} className={styles.sectionTitle}>
        {title}
      </h2>
      <p>
        <MaybeLink className={styles.link} href={href} canLink={canLink}>
          {label}
        </MaybeLink>
      </p>
    </section>
  );
}
