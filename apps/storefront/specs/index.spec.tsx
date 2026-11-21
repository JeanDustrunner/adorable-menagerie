import { render, screen } from '@testing-library/react';
import HomePage from '../src/app/page';

describe('HomePage', () => {
  it('renders the studio name as the main heading', () => {
    render(<HomePage />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Adorable Menagerie' }),
    ).toBeTruthy();
  });
});
