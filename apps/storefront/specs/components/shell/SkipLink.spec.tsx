import { render, screen } from '@testing-library/react';
import { SkipLink } from '../../../src/components/shell/SkipLink';

describe('SkipLink', () => {
  it('links to the main content so keyboard users can bypass the header', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link', { name: 'Przejdź do treści' });
    expect(link.getAttribute('href')).toBe('#main');
  });
});
