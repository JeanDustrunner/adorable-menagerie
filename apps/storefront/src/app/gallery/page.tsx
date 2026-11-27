import type { Metadata } from 'next';
import { GalleryGrid } from '../../components/gallery/GalleryGrid';
import { catalog } from '../../lib/catalog';
import styles from '../listing.module.css';

export const metadata: Metadata = {
  title: 'Galeria prac',
  description:
    'Szydełkowe przytulanki, które już znalazły nowe domy. Projekt demonstracyjny, nic tu nie jest na sprzedaż.',
};

export default async function GalleryPage() {
  const items = await catalog.listGalleryItems();
  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <h1 className={styles.title}>Galeria prac</h1>
        <p className={styles.lead}>
          Prace, które znalazły właścicieli. Każdą można obejrzeć z bliska, a
          niektóre da się powtórzyć.
        </p>
      </header>
      <GalleryGrid items={items} />
    </div>
  );
}
