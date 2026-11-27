import { render, screen } from '@testing-library/react';
import HomePage from '../src/app/page';

describe('HomePage placeholder', () => {
  it('renders the studio name as the main heading', () => {
    render(<HomePage />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Urocza Menażeria' }),
    ).toBeTruthy();
  });

  it('says in Polish that the shop is being built and that this is a demonstration', () => {
    render(<HomePage />);

    expect(screen.getByText(/Sklep jest w budowie/)).toBeTruthy();
    expect(screen.getByText(/projekt demonstracyjny/i)).toBeTruthy();
  });

  it('leaves the main landmark to the layout', () => {
    render(<HomePage />);

    expect(screen.queryByRole('main')).toBeNull();
  });
});
