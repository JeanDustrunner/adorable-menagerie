import type { Pattern } from '../../lib/catalog';
import { patternSummary } from '../../lib/catalog/presentation';
import { formatPrice } from '../../lib/format/price';
import { ProductCard } from './ProductCard';

interface PatternCardProps {
  readonly pattern: Pattern;
  readonly eager?: boolean;
}

/** Card for a pattern: craft and difficulty instead of size, no stock (spec 6.4). */
export function PatternCard({ pattern, eager = false }: PatternCardProps) {
  return (
    <ProductCard
      href={`/patterns/${pattern.slug}`}
      name={pattern.name}
      cover={pattern.photos[0]}
      price={formatPrice(pattern.priceGrosze)}
      summary={patternSummary(pattern)}
      note={pattern.format && `Format: ${pattern.format}`}
      eager={eager}
    />
  );
}
