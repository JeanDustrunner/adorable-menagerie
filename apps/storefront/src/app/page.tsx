import { siteName } from '../lib/site';
import styles from './page.module.css';

// Placeholder until the real homepage (T1.7). The layout provides the main landmark.
export default function HomePage() {
  return (
    <div className={styles.placeholder}>
      <h1>{siteName}</h1>
      <p>
        Sklep jest w budowie: na razie nie ma tu nic do przeglądania ani do
        kupienia.
      </p>
      <p className={styles.note}>
        To projekt demonstracyjny. Wszystkie treści są fikcyjne.
      </p>
    </div>
  );
}
