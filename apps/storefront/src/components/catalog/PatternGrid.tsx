import type { Pattern } from '../../lib/catalog';
import { PatternCard } from './PatternCard';
import { ProductGrid } from './ProductGrid';

interface PatternGridProps {
  readonly patterns: readonly Pattern[];
}

/** Grid of pattern cards in the given order (spec 6.4). */
export function PatternGrid({ patterns }: PatternGridProps) {
  return (
    <ProductGrid
      entries={patterns}
      renderCard={(pattern, eager) => (
        <PatternCard pattern={pattern} eager={eager} />
      )}
      emptyTitle="Wzory są jeszcze w przygotowaniu"
      emptyBody={<p>Zajrzyj tu wkrótce.</p>}
    />
  );
}
