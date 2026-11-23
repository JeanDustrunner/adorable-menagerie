import { render, screen } from '@testing-library/react';
import { DemoNotice } from '../../../src/components/shell/DemoNotice';

describe('DemoNotice', () => {
  it('is a labelled region so it is not stray content outside every landmark', () => {
    render(<DemoNotice />);
    expect(
      screen.getByRole('region', { name: 'Informacja o demonstracji' }),
    ).toBeTruthy();
  });

  it('states that the site is a demonstration and nothing can be bought', () => {
    render(<DemoNotice />);
    expect(
      screen.getByText(
        'Strona demonstracyjna. Wszystkie produkty i dane są fikcyjne, niczego nie można tu kupić.',
      ),
    ).toBeTruthy();
  });
});
