import {
  availabilityLabel,
  catalog,
  createCatalog,
} from '../../../src/lib/catalog';
import { item, pattern, post } from './builders';

describe('availabilityLabel', () => {
  it('says "Ostatnia sztuka" for an available item with one piece left', () => {
    expect(availabilityLabel(item({ quantity: 1 }))).toBe('Ostatnia sztuka');
  });

  it('says "Dostępny" for an available item with several pieces', () => {
    expect(availabilityLabel(item({ quantity: 3 }))).toBe('Dostępny');
  });

  it('says "W nowym domu" for an unavailable item', () => {
    expect(
      availabilityLabel(item({ availability: 'unavailable', quantity: 0 })),
    ).toBe('W nowym domu');
  });
});

describe('items', () => {
  const data = {
    items: [
      item({ slug: 'old-available', addedOn: '2026-01-01' }),
      item({ slug: 'new-available', addedOn: '2026-03-01', featured: true }),
      item({ slug: 'hidden', visibility: 'hidden', featured: true }),
      item({
        slug: 'sold-old',
        availability: 'unavailable',
        quantity: 0,
        addedOn: '2026-01-15',
      }),
      item({
        slug: 'sold-new',
        availability: 'unavailable',
        quantity: 0,
        addedOn: '2026-02-15',
        featured: true,
      }),
      item({
        slug: 'hidden-sold',
        visibility: 'hidden',
        availability: 'unavailable',
        quantity: 0,
      }),
    ],
    patterns: [],
    posts: [],
  };
  const subject = createCatalog(data);

  it('lists public and available items in the catalog, newest first', async () => {
    const slugs = (await subject.listCatalogItems()).map((i) => i.slug);
    expect(slugs).toEqual(['new-available', 'old-available']);
  });

  it('lists public and unavailable items in the gallery, newest first', async () => {
    const slugs = (await subject.listGalleryItems()).map((i) => i.slug);
    expect(slugs).toEqual(['sold-new', 'sold-old']);
  });

  it('never lists hidden items anywhere', async () => {
    const all = [
      ...(await subject.listCatalogItems()),
      ...(await subject.listGalleryItems()),
      ...(await subject.listFeaturedItems()),
    ];
    expect(all.some((i) => i.visibility === 'hidden')).toBe(false);
  });

  it('features only public, available, featured items', async () => {
    const slugs = (await subject.listFeaturedItems()).map((i) => i.slug);
    expect(slugs).toEqual(['new-available']);
  });

  it('finds an available or unavailable public item by slug', async () => {
    expect((await subject.getPublicItem('old-available'))?.slug).toBe(
      'old-available',
    );
    expect((await subject.getPublicItem('sold-old'))?.slug).toBe('sold-old');
  });

  it('does not find hidden or unknown items', async () => {
    expect(await subject.getPublicItem('hidden')).toBeUndefined();
    expect(await subject.getPublicItem('nope')).toBeUndefined();
  });
});

describe('patterns', () => {
  const subject = createCatalog({
    items: [],
    patterns: [
      pattern({ slug: 'older', addedOn: '2026-01-01' }),
      pattern({ slug: 'newer', addedOn: '2026-02-01' }),
      pattern({ slug: 'secret', visibility: 'hidden' }),
    ],
    posts: [],
  });

  it('lists public patterns newest first', async () => {
    const slugs = (await subject.listPatterns()).map((p) => p.slug);
    expect(slugs).toEqual(['newer', 'older']);
  });

  it('does not find a hidden pattern by slug', async () => {
    expect(await subject.getPublicPattern('secret')).toBeUndefined();
    expect((await subject.getPublicPattern('older'))?.slug).toBe('older');
  });
});

describe('posts', () => {
  const subject = createCatalog({
    items: [],
    patterns: [],
    posts: [
      post({
        slug: 'a',
        publishedOn: '2026-01-01',
        tags: ['konie', 'bawelna'],
        relatedItems: ['konik'],
      }),
      post({
        slug: 'b',
        publishedOn: '2026-02-01',
        tags: ['konie'],
        relatedPatterns: ['wzor-konik'],
      }),
      post({ slug: 'c', publishedOn: '2026-03-01', tags: ['smoki'] }),
      post({
        slug: 'd',
        publishedOn: '2026-04-01',
        tags: ['konie', 'bawelna'],
      }),
    ],
  });

  it('lists posts newest first', async () => {
    expect((await subject.listPosts()).map((p) => p.slug)).toEqual([
      'd',
      'c',
      'b',
      'a',
    ]);
  });

  it('finds a post by slug', async () => {
    expect((await subject.getPost('c'))?.slug).toBe('c');
    expect(await subject.getPost('zzz')).toBeUndefined();
  });

  it('finds posts that mention an item or a pattern', async () => {
    const forItem = await subject.postsMentioning('item', 'konik');
    const forPattern = await subject.postsMentioning('pattern', 'wzor-konik');
    expect(forItem.map((p) => p.slug)).toEqual(['a']);
    expect(forPattern.map((p) => p.slug)).toEqual(['b']);
  });

  it('finds related posts by shared tag, newest first, never the post itself', async () => {
    const related = await subject.relatedPostsByTags('a', 3);
    expect(related.map((p) => p.slug)).toEqual(['d', 'b']);
  });

  it('limits the number of related posts', async () => {
    expect(await subject.relatedPostsByTags('a', 1)).toHaveLength(1);
  });

  it('returns no related posts when no tag is shared', async () => {
    expect(await subject.relatedPostsByTags('c', 3)).toEqual([]);
  });

  it('returns no related posts for an unknown slug', async () => {
    expect(await subject.relatedPostsByTags('zzz', 3)).toEqual([]);
  });
});

describe('batch lookups', () => {
  const subject = createCatalog({
    items: [
      item({ slug: 'one' }),
      item({ slug: 'two', availability: 'unavailable', quantity: 0 }),
      item({ slug: 'secret', visibility: 'hidden' }),
    ],
    patterns: [
      pattern({ slug: 'p-one' }),
      pattern({ slug: 'p-secret', visibility: 'hidden' }),
    ],
    posts: [],
  });

  it('returns public items in the order asked, skipping hidden and unknown slugs', async () => {
    const found = await subject.getPublicItems([
      'two',
      'secret',
      'nope',
      'one',
    ]);
    expect(found.map((i) => i.slug)).toEqual(['two', 'one']);
  });

  it('returns public patterns in the order asked, skipping hidden and unknown slugs', async () => {
    const found = await subject.getPublicPatterns([
      'p-secret',
      'p-one',
      'nope',
    ]);
    expect(found.map((p) => p.slug)).toEqual(['p-one']);
  });

  it('returns an empty list for an empty request', async () => {
    expect(await subject.getPublicItems([])).toEqual([]);
  });
});

describe('ordering and input safety', () => {
  it('orders items with the same date by slug so the result is deterministic', async () => {
    const subject = createCatalog({
      items: [
        item({ slug: 'zeta', addedOn: '2026-05-01' }),
        item({ slug: 'alfa', addedOn: '2026-05-01' }),
        item({ slug: 'mid', addedOn: '2026-05-01' }),
      ],
      patterns: [],
      posts: [],
    });
    expect((await subject.listCatalogItems()).map((i) => i.slug)).toEqual([
      'alfa',
      'mid',
      'zeta',
    ]);
  });

  it('orders posts and patterns with the same date by slug too', async () => {
    const subject = createCatalog({
      items: [],
      patterns: [
        pattern({ slug: 'b-pattern', addedOn: '2026-05-01' }),
        pattern({ slug: 'a-pattern', addedOn: '2026-05-01' }),
      ],
      posts: [
        post({ slug: 'b-post', publishedOn: '2026-05-01' }),
        post({ slug: 'a-post', publishedOn: '2026-05-01' }),
      ],
    });
    expect((await subject.listPatterns()).map((p) => p.slug)).toEqual([
      'a-pattern',
      'b-pattern',
    ]);
    expect((await subject.listPosts()).map((p) => p.slug)).toEqual([
      'a-post',
      'b-post',
    ]);
  });

  it('never reorders or changes the data it was given', async () => {
    const data = {
      items: Object.freeze([
        item({ slug: 'old', addedOn: '2026-01-01' }),
        item({ slug: 'new', addedOn: '2026-02-01', tags: ['x'] }),
      ]),
      patterns: Object.freeze([
        pattern({ slug: 'old-p', addedOn: '2026-01-01' }),
        pattern({ slug: 'new-p', addedOn: '2026-02-01' }),
      ]),
      posts: Object.freeze([
        post({ slug: 'old-post', publishedOn: '2026-01-01', tags: ['x'] }),
        post({ slug: 'new-post', publishedOn: '2026-02-01', tags: ['x'] }),
      ]),
    };
    const before = JSON.stringify(data);
    const subject = createCatalog(data);

    await subject.listCatalogItems();
    await subject.listGalleryItems();
    await subject.listFeaturedItems();
    await subject.listPatterns();
    await subject.listPosts();
    await subject.relatedPostsByTags('old-post', 5);
    await subject.postsMentioning('item', 'old');

    expect(JSON.stringify(data)).toBe(before);
  });
});

describe('the default catalog (fixtures)', () => {
  it('shows an available piece in the catalog and a sold one in the gallery', async () => {
    const catalogSlugs = (await catalog.listCatalogItems()).map((i) => i.slug);
    const gallerySlugs = (await catalog.listGalleryItems()).map((i) => i.slug);
    expect(catalogSlugs).toContain('konik-karmel');
    expect(gallerySlugs).toContain('lama-rosa');
  });
});
