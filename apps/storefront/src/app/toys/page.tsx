import type { Metadata } from 'next';
import { ItemGrid } from '../../components/catalog/ItemGrid';
import { catalog } from '../../lib/catalog';
import { isSectionReady } from '../../lib/navigation';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Przytulanki',
  description:
    'Szydełkowe przytulanki, które czekają na nowy dom. Projekt demonstracyjny, nic tu nie jest na sprzedaż.',
};

export default async function ToysPage() {
  const items = await catalog.listCatalogItems();
  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <h1 className={styles.title}>Przytulanki</h1>
        <p className={styles.lead}>
          Gotowe zwierzaki z pracowni, każdy zrobiony ręcznie i czekający na
          swój nowy dom.
        </p>
      </header>
      <ItemGrid items={items} canLink={isSectionReady} />
    </div>
  );
}
