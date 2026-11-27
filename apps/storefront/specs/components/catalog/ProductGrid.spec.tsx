import { render, screen } from '@testing-library/react';
import { ProductGrid } from '../../../src/components/catalog/ProductGrid';

const entries = [{ slug: 'a' }, { slug: 'b' }];

describe('ProductGrid', () => {
  it.each(['cards', 'tiles'] as const)(
    'gives the %s list only real class names',
    (layout) => {
      render(
        <ProductGrid
          entries={entries}
          layout={layout}
          renderCard={(e) => e.slug}
          emptyTitle="Pusto"
        />,
      );
      expect(screen.getByRole('list').className).not.toMatch(/undefined/);
    },
  );
});
