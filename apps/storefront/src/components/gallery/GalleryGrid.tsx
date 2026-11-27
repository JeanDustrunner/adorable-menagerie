import { availabilityLabel } from '../../lib/catalog';
import type { Item } from '../../lib/catalog';
import { ProductCard } from '../catalog/ProductCard';
import { ProductGrid } from '../catalog/ProductGrid';

interface GalleryGridProps {
  readonly items: readonly Item[];
}

/**
 * Previous work (spec 6.5): compact tiles with cover, name and "W nowym domu",
 * each linking to the item page. No price on tiles (OD-8).
 */
export function GalleryGrid({ items }: GalleryGridProps) {
  return (
    <ProductGrid
      entries={items}
      layout="tiles"
      renderCard={(item, eager) => (
        <ProductCard
          href={`/toys/${item.slug}`}
          name={item.name}
          cover={item.photos[0]}
          note={availabilityLabel(item)}
          eager={eager}
          compact
        />
      )}
      emptyTitle="Galeria jest jeszcze pusta"
      emptyBody={<p>Pierwsze prace pojawią się tu, gdy znajdą nowe domy.</p>}
    />
  );
}
