import styles from './SkipLink.module.css';

/** First focusable element on every page; lets keyboard users bypass the header. */
export function SkipLink() {
  return (
    <a className={styles.skipLink} href="#main">
      Przejdź do treści
    </a>
  );
}
