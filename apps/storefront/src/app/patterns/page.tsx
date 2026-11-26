import type { Metadata } from 'next';
import { PatternGrid } from '../../components/catalog/PatternGrid';
import { catalog } from '../../lib/catalog';
import styles from '../listing.module.css';

export const metadata: Metadata = {
  title: 'Wzory',
  description:
    'Wzory na szydełkowe i dziergane zwierzaki, od prostych po wymagające. Projekt demonstracyjny, nic tu nie jest na sprzedaż.',
};

export default async function PatternsPage() {
  const patterns = await catalog.listPatterns();
  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <h1 className={styles.title}>Wzory</h1>
        <p className={styles.lead}>
          Zrób własnego zwierzaka: opisy krok po kroku dla szydełka i drutów, od
          pierwszego oczka po gotową przytulankę.
        </p>
      </header>
      <PatternGrid patterns={patterns} />
    </div>
  );
}
