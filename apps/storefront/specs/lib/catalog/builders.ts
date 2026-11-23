import type {
  Item,
  Pattern,
  Photo,
  Post,
} from '../../../src/lib/catalog/types';

// Small builders so each test states only the fields it cares about.

export function photo(overrides: Partial<Photo> = {}): Photo {
  return {
    file: 'konik-karmel-1.jpg',
    width: 1200,
    height: 1600,
    alt: 'Konik siedzi przed motkami włóczki',
    ...overrides,
  };
}

export function item(overrides: Partial<Item> = {}): Item {
  return {
    slug: 'test-item',
    name: 'Testowy konik',
    description: 'Opis testowy.',
    priceGrosze: 10000,
    visibility: 'public',
    availability: 'available',
    quantity: 2,
    reproducible: true,
    photos: [photo()],
    tags: [],
    addedOn: '2026-01-01',
    ...overrides,
  };
}

export function pattern(overrides: Partial<Pattern> = {}): Pattern {
  return {
    slug: 'test-pattern',
    name: 'Wzór: testowy',
    description: 'Opis wzoru.',
    priceGrosze: 2900,
    visibility: 'public',
    photos: [photo()],
    tags: [],
    addedOn: '2026-01-01',
    craft: 'szydelko',
    difficulty: 'poczatkujacy',
    ...overrides,
  };
}

export function post(overrides: Partial<Post> = {}): Post {
  return {
    slug: 'test-post',
    title: 'Wpis testowy',
    publishedOn: '2026-01-01',
    excerpt: 'Krótki opis wpisu.',
    tags: [],
    relatedItems: [],
    relatedPatterns: [],
    readingMinutes: 3,
    ...overrides,
  };
}
