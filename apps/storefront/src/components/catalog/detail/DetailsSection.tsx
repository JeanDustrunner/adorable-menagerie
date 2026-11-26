import { useId } from 'react';
import type { Detail } from '../../../lib/catalog/presentation';
import styles from './Detail.module.css';

interface DetailsSectionProps {
  readonly details: readonly Detail[];
  readonly tags: readonly string[];
  /** Extra line under the list, such as the reproducibility note. */
  readonly note?: string;
}

/** "Szczegóły": attribute list without empty labels (Q-03), note and tags. */
export function DetailsSection({ details, tags, note }: DetailsSectionProps) {
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className={styles.section}>
      <h2 id={titleId} className={styles.sectionTitle}>
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
      {note && <p className={styles.note}>{note}</p>}
      {tags.length > 0 && (
        <ul aria-label="Tagi" className={styles.tags}>
          {tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
