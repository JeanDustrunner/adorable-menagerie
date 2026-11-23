import { validateCatalog } from '../../../src/lib/catalog/validate';
import type { Problem } from '../../../src/lib/catalog/validate';
import { item, pattern, photo, post } from './builders';

const empty = { items: [], patterns: [], posts: [] };

function rules(problems: readonly Problem[]): string[] {
  return problems.map((p) => p.rule);
}

describe('validateCatalog', () => {
  it('accepts a consistent catalog', () => {
    const problems = validateCatalog({
      items: [item({ slug: 'konik' })],
      patterns: [pattern({ slug: 'wzor-konik', madeItemSlug: 'konik' })],
      posts: [
        post({ relatedItems: ['konik'], relatedPatterns: ['wzor-konik'] }),
      ],
    });
    expect(problems).toEqual([]);
  });

  it('reports duplicate slugs within a type, but not across types', () => {
    const duplicate = validateCatalog({
      ...empty,
      items: [item({ slug: 'same' }), item({ slug: 'same' })],
    });
    const acrossTypes = validateCatalog({
      ...empty,
      items: [item({ slug: 'same' })],
      patterns: [pattern({ slug: 'same' })],
    });
    expect(rules(duplicate)).toContain('duplicate-slug');
    expect(acrossTypes).toEqual([]);
  });

  it.each(['Upper', 'with space', 'zażółć', '-lead', 'trail-', 'a--b', ''])(
    'rejects the slug "%s"',
    (slug) => {
      expect(
        rules(validateCatalog({ ...empty, items: [item({ slug })] })),
      ).toContain('invalid-slug');
    },
  );

  it.each([0, -100, 12.5, Number.NaN])(
    'rejects the price %s',
    (priceGrosze) => {
      expect(
        rules(validateCatalog({ ...empty, items: [item({ priceGrosze })] })),
      ).toContain('invalid-price');
    },
  );

  it('rejects an available item with no pieces', () => {
    expect(
      rules(
        validateCatalog({
          ...empty,
          items: [item({ availability: 'available', quantity: 0 })],
        }),
      ),
    ).toContain('stock-mismatch');
  });

  it('rejects an unavailable item that still has pieces', () => {
    expect(
      rules(
        validateCatalog({
          ...empty,
          items: [item({ availability: 'unavailable', quantity: 2 })],
        }),
      ),
    ).toContain('stock-mismatch');
  });

  it('rejects a fractional or negative quantity', () => {
    expect(
      rules(validateCatalog({ ...empty, items: [item({ quantity: 1.5 })] })),
    ).toContain('stock-mismatch');
  });

  it.each(['2026-13-01', '2026-02-30', '01.02.2026', 'yesterday', ''])(
    'rejects the date "%s"',
    (addedOn) => {
      expect(
        rules(validateCatalog({ ...empty, items: [item({ addedOn })] })),
      ).toContain('invalid-date');
    },
  );

  it('requires at least one photo and Polish-describing alt text', () => {
    const noPhotos = validateCatalog({
      ...empty,
      items: [item({ photos: [] as never })],
    });
    const blankAlt = validateCatalog({
      ...empty,
      items: [item({ photos: [photo({ alt: '   ' })] })],
    });
    expect(rules(noPhotos)).toContain('missing-photo');
    expect(rules(blankAlt)).toContain('missing-alt');
  });

  it.each([
    '../secret.jpg',
    'a/b.jpg',
    '..\\x.jpg',
    '/abs.jpg',
    '.jpg',
    'x.JPG',
    'x.svg',
    'x.jpg\n',
    'x',
  ])('rejects the photo file "%s"', (file) => {
    expect(
      rules(
        validateCatalog({
          ...empty,
          items: [item({ photos: [photo({ file })] })],
        }),
      ),
    ).toContain('invalid-photo-file');
  });

  it.each([0, -1, 1.5, Number.NaN])(
    'rejects a photo width or height of %s',
    (size) => {
      const wrongWidth = validateCatalog({
        ...empty,
        items: [item({ photos: [photo({ width: size })] })],
      });
      const wrongHeight = validateCatalog({
        ...empty,
        items: [item({ photos: [photo({ height: size })] })],
      });
      expect(rules(wrongWidth)).toContain('invalid-photo-size');
      expect(rules(wrongHeight)).toContain('invalid-photo-size');
    },
  );

  it('accepts real leap days and rejects fake ones', () => {
    const valid = validateCatalog({
      ...empty,
      items: [item({ addedOn: '2024-02-29' })],
    });
    const invalid = validateCatalog({
      ...empty,
      items: [item({ addedOn: '2026-02-29' })],
    });
    expect(valid).toEqual([]);
    expect(rules(invalid)).toContain('invalid-date');
  });

  it('checks the date of patterns and posts too', () => {
    const problems = validateCatalog({
      ...empty,
      patterns: [pattern({ addedOn: '2026-13-01' })],
      posts: [post({ publishedOn: 'yesterday' })],
    });
    expect(rules(problems).filter((r) => r === 'invalid-date')).toHaveLength(2);
  });

  it('reports a post that references a missing item or pattern', () => {
    const problems = validateCatalog({
      ...empty,
      posts: [post({ relatedItems: ['ghost'], relatedPatterns: ['ghost-2'] })],
    });
    expect(
      rules(problems).filter((r) => r === 'dangling-reference'),
    ).toHaveLength(2);
  });

  it('reports a post or pattern that references a hidden item', () => {
    const problems = validateCatalog({
      items: [item({ slug: 'secret', visibility: 'hidden' })],
      patterns: [pattern({ madeItemSlug: 'secret' })],
      posts: [post({ relatedItems: ['secret'] })],
    });
    expect(
      rules(problems).filter((r) => r === 'hidden-reference'),
    ).toHaveLength(2);
  });

  it('reports a post that references a hidden pattern', () => {
    const problems = validateCatalog({
      items: [],
      patterns: [pattern({ slug: 'secret', visibility: 'hidden' })],
      posts: [post({ relatedPatterns: ['secret'] })],
    });
    expect(rules(problems)).toContain('hidden-reference');
  });

  it('names the offending slug in every problem', () => {
    const problems = validateCatalog({
      ...empty,
      items: [item({ slug: 'bad-one', priceGrosze: -5 })],
    });
    expect(problems[0].subject).toBe('item bad-one');
  });
});
