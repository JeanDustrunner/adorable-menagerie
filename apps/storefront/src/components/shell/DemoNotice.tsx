import styles from './DemoNotice.module.css';

/** Shown on every page until go-live (ADR-0004, rule R5). */
export function DemoNotice() {
  return (
    <section className={styles.notice} aria-label="Informacja o demonstracji">
      <p>
        Strona demonstracyjna. Wszystkie produkty i dane są fikcyjne, niczego
        nie można tu kupić.
      </p>
    </section>
  );
}
