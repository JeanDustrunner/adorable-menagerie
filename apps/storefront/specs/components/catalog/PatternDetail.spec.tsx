import { render, screen, within } from '@testing-library/react';
import { PatternDetail } from '../../../src/components/catalog/PatternDetail';
import { item, pattern, photo, post } from '../../lib/catalog/builders';

const always = () => true;
const never = () => false;

const smok = pattern({
  slug: 'wzor-smok-szafir',
  name: 'Wzór: Smok Szafir',
  description: 'Pierwszy akapit.\n\nDrugi akapit.',
  priceGrosze: 3900,
  craft: 'szydelko',
  difficulty: 'zaawansowany',
  format: 'PDF',
  tags: ['smoki'],
  photos: [
    photo({ file: 'smok-szafir-1.jpg', alt: 'Gotowy smok' }),
    photo({ file: 'smok-szafir-2.jpg', alt: 'Głowa smoka' }),
  ],
});

describe('PatternDetail', () => {
  it('has the pattern name as the only main heading', () => {
    render(<PatternDetail pattern={smok} posts={[]} canLink={always} />);
    expect(
      screen.getAllByRole('heading', { level: 1 }).map((h) => h.textContent),
    ).toEqual(['Wzór: Smok Szafir']);
  });

  it('shows every photo, the price, the difficulty and the description', () => {
    render(<PatternDetail pattern={smok} posts={[]} canLink={always} />);
    expect(
      screen.getAllByRole('img').map((i) => i.getAttribute('alt')),
    ).toEqual(['Gotowy smok', 'Głowa smoka']);
    expect(screen.getByText('39 zł')).toBeTruthy();
    expect(screen.getByText('Pierwszy akapit.')).toBeTruthy();
    expect(screen.getByText('Drugi akapit.')).toBeTruthy();
  });

  it('lists the pattern details and tags, and no reproducibility note', () => {
    const { container } = render(
      <PatternDetail pattern={smok} posts={[]} canLink={always} />,
    );
    expect(
      [...container.querySelectorAll('dt')].map((dt) => dt.textContent),
    ).toEqual(['Technika', 'Poziom trudności', 'Format']);
    expect(
      within(screen.getByRole('list', { name: 'Tagi' })).getByText('smoki'),
    ).toBeTruthy();
    expect(screen.queryByText(/Projekt/)).toBeNull();
  });

  it('offers no download or buy control (spec 6.4, R5)', () => {
    const { container } = render(
      <PatternDetail pattern={smok} posts={[]} canLink={always} />,
    );
    expect(container.querySelector('button, form, input')).toBeNull();
  });

  it('puts the pattern under "Wzory" in the breadcrumb', () => {
    render(<PatternDetail pattern={smok} posts={[]} canLink={always} />);
    const crumbs = screen.getByRole('navigation', { name: 'Okruszki' });
    expect(
      within(crumbs).getByRole('link', { name: 'Wzory' }).getAttribute('href'),
    ).toBe('/patterns');
    expect(
      within(crumbs)
        .getByText('Wzór: Smok Szafir')
        .getAttribute('aria-current'),
    ).toBe('page');
  });

  it('links to the item made from it and to related posts', () => {
    render(
      <PatternDetail
        pattern={smok}
        madeItem={item({ slug: 'smok-szafir', name: 'Smok Szafir' })}
        posts={[post({ slug: 'smoki', title: 'Smoki w menażerii' })]}
        canLink={always}
      />,
    );
    expect(
      screen.getByRole('heading', { level: 2, name: 'Gotowa przytulanka' }),
    ).toBeTruthy();
    expect(
      screen.getByRole('link', { name: 'Smok Szafir' }).getAttribute('href'),
    ).toBe('/toys/smok-szafir');
    expect(
      screen
        .getByRole('link', { name: 'Smoki w menażerii' })
        .getAttribute('href'),
    ).toBe('/blog/smoki');
  });

  it('shows related posts as plain text before the blog exists', () => {
    render(
      <PatternDetail
        pattern={smok}
        posts={[post({ slug: 'smoki', title: 'Smoki w menażerii' })]}
        canLink={never}
      />,
    );
    expect(screen.getByText('Smoki w menażerii')).toBeTruthy();
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });

  it('leaves out the made-item and posts sections when there is nothing to show', () => {
    render(<PatternDetail pattern={smok} posts={[]} canLink={always} />);
    expect(
      screen.queryByRole('heading', { name: 'Gotowa przytulanka' }),
    ).toBeNull();
    expect(
      screen.queryByRole('heading', { name: 'Powiązane wpisy' }),
    ).toBeNull();
  });

  it('shows only the required details and no tag list for a bare pattern', () => {
    const { container } = render(
      <PatternDetail
        pattern={pattern({ name: 'Wzór: goły' })}
        posts={[]}
        canLink={always}
      />,
    );
    expect(
      [...container.querySelectorAll('dt')].map((dt) => dt.textContent),
    ).toEqual(['Technika', 'Poziom trudności']);
    expect(screen.queryByRole('list', { name: 'Tagi' })).toBeNull();
  });

  it('links to a made item that is already sold: its page still exists', () => {
    render(
      <PatternDetail
        pattern={smok}
        madeItem={item({
          slug: 'lama-rosa',
          name: 'Lama Rosa',
          availability: 'unavailable',
          quantity: 0,
        })}
        posts={[]}
        canLink={always}
      />,
    );
    expect(
      screen.getByRole('link', { name: 'Lama Rosa' }).getAttribute('href'),
    ).toBe('/toys/lama-rosa');
  });

  it('shows the made item as plain text when its section cannot be linked', () => {
    render(
      <PatternDetail
        pattern={smok}
        madeItem={item({ slug: 'smok-szafir', name: 'Smok Szafir' })}
        posts={[]}
        canLink={never}
      />,
    );
    expect(screen.getByText('Smok Szafir')).toBeTruthy();
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });
});
