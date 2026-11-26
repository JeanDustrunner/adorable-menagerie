import { MaybeLink } from '../../MaybeLink';
import type { CanLink } from '../../MaybeLink';
import styles from './Detail.module.css';

interface BreadcrumbProps {
  readonly section: { readonly label: string; readonly href: string };
  readonly current: string;
  readonly canLink: CanLink;
}

/** Section, then the current page; the section is a link only once it exists. */
export function Breadcrumb({ section, current, canLink }: BreadcrumbProps) {
  return (
    <nav aria-label="Okruszki" className={styles.breadcrumb}>
      <ol>
        <li>
          <MaybeLink href={section.href} canLink={canLink}>
            {section.label}
          </MaybeLink>
        </li>
        <li>
          <span aria-current="page">{current}</span>
        </li>
      </ol>
    </nav>
  );
}
