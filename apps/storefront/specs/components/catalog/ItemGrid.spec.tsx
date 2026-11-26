import { render, screen } from '@testing-library/react';
import { ItemGrid } from '../../../src/components/catalog/ItemGrid';
import { item } from '../../lib/catalog/builders';

const always = () => true;
const never = () => false;

describe('ItemGrid', () => {
  it('lists one card per item, in the given order', () => {
    render(
      <ItemGrid
        items={[
          item({ slug: 'a', name: 'Pierwszy' }),
          item({ slug: 'b', name: 'Drugi' }),
        ]}
        canLink={always}
      />,
    );
    const names = screen
      .getAllByRole('listitem')
      .map((li) => li.querySelector('h2')?.textContent);
    expect(names).toEqual(['Pierwszy', 'Drugi']);
  });

  it('explains an empty catalog and points to the gallery and the patterns', () => {
    render(<ItemGrid items={[]} canLink={always} />);
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Wszystkie przytulanki są teraz w nowych domach',
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole('link', { name: 'Galeria prac' }).getAttribute('href'),
    ).toBe('/gallery');
    expect(
      screen.getByRole('link', { name: 'Wzory' }).getAttribute('href'),
    ).toBe('/patterns');
  });

  it('never links to sections that do not exist yet', () => {
    render(<ItemGrid items={[]} canLink={never} />);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
    expect(
      screen.getByText('Wszystkie przytulanki są teraz w nowych domach'),
    ).toBeTruthy();
  });
});
