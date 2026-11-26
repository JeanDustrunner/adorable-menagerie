import { availabilityLabel } from '../../lib/catalog';
import type { Item } from '../../lib/catalog';
import { itemSummary } from '../../lib/catalog/presentation';
import { formatPrice } from '../../lib/format/price';
import { ProductCard } from './ProductCard';

interface ItemCardProps {
  readonly item: Item;
  readonly eager?: boolean;
}

/** Catalog card for a physical item (spec 6.2). */
export function ItemCard({ item, eager = false }: ItemCardProps) {
  return (
    <ProductCard
      href={`/toys/${item.slug}`}
      name={item.name}
      cover={item.photos[0]}
      price={formatPrice(item.priceGrosze)}
      summary={itemSummary(item)}
      note={availabilityLabel(item)}
      eager={eager}
    />
  );
}
