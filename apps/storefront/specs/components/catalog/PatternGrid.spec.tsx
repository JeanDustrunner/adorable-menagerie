import { render, screen } from '@testing-library/react';
import { PatternGrid } from '../../../src/components/catalog/PatternGrid';
import { pattern } from '../../lib/catalog/builders';

describe('PatternGrid', () => {
  it('lists one card per pattern, in the given order', () => {
    render(
      <PatternGrid
        patterns={[
          pattern({ slug: 'a', name: 'Wzór A' }),
          pattern({ slug: 'b', name: 'Wzór B' }),
        ]}
      />,
    );
    const names = screen
      .getAllByRole('listitem')
      .map((li) => li.querySelector('h2')?.textContent);
    expect(names).toEqual(['Wzór A', 'Wzór B']);
  });

  it('loads the first row of photos at once and the rest lazily', () => {
    const many = Array.from({ length: 5 }, (_, n) =>
      pattern({ slug: `p${n}`, name: `Wzór ${n}` }),
    );
    render(<PatternGrid patterns={many} />);
    expect(
      screen.getAllByRole('img').map((img) => img.getAttribute('loading')),
    ).toEqual(['eager', 'eager', 'eager', 'eager', 'lazy']);
  });

  it('says so under a heading when there are no patterns', () => {
    render(<PatternGrid patterns={[]} />);
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Wzory są jeszcze w przygotowaniu',
      }),
    ).toBeTruthy();
    expect(screen.queryByRole('list')).toBeNull();
  });
});
