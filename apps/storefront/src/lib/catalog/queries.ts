import type { CatalogData, Item, Pattern, Post } from './types';

/** Label shown next to an item's price (spec 4.1, derived, never stored). */
export function availabilityLabel(item: Item): string {
  if (item.availability === 'unavailable') return 'W nowym domu';
  return item.quantity === 1 ? 'Ostatnia sztuka' : 'Dostępny';
}

export type PostTarget = 'item' | 'pattern';

/**
 * Everything the storefront pages may ask of the content layer. The fixtures
 * implement it today; an API client can implement it in phase 2a without any
 * page changing. All methods are async for that reason.
 *
 * Lookups never return hidden items or patterns, and slugs that do not exist
 * are silently left out of batch results (the integrity rules keep references valid).
 */
export interface CatalogRepository {
  /** Public, available items, newest first. */
  listCatalogItems(): Promise<readonly Item[]>;
  /** Public, unavailable items ("previous work"), newest first. */
  listGalleryItems(): Promise<readonly Item[]>;
  /** Owner-curated, public and available, newest first. */
  listFeaturedItems(): Promise<readonly Item[]>;
  /** Any public item, available or not. */
  getPublicItem(slug: string): Promise<Item | undefined>;
  /** Public items in the order of `slugs`; hidden and unknown slugs are skipped. */
  getPublicItems(slugs: readonly string[]): Promise<readonly Item[]>;

  listPatterns(): Promise<readonly Pattern[]>;
  getPublicPattern(slug: string): Promise<Pattern | undefined>;
  /** Public patterns in the order of `slugs`; hidden and unknown slugs are skipped. */
  getPublicPatterns(slugs: readonly string[]): Promise<readonly Pattern[]>;

  listPosts(): Promise<readonly Post[]>;
  getPost(slug: string): Promise<Post | undefined>;
  /** Posts that explicitly reference an item or a pattern, newest first. */
  postsMentioning(kind: PostTarget, slug: string): Promise<readonly Post[]>;
  /**
   * Other posts that share at least one tag with the post `slug`, newest first.
   * `limit` should be a non-negative integer; anything else yields no posts.
   * An unknown `slug` yields no posts.
   */
  relatedPostsByTags(slug: string, limit: number): Promise<readonly Post[]>;
}

/**
 * Newest first by `dateOf`, ties broken by slug so the order is the same for
 * every caller and every data source. Returns a copy; the input is never changed.
 */
function newestFirst<T extends { readonly slug: string }>(
  entries: readonly T[],
  dateOf: (entry: T) => string,
): T[] {
  // Dates are validated ISO strings, so plain comparison is chronological.
  return [...entries].sort((a, b) => {
    const dateA = dateOf(a);
    const dateB = dateOf(b);
    if (dateA !== dateB) return dateA < dateB ? 1 : -1;
    if (a.slug === b.slug) return 0;
    return a.slug < b.slug ? -1 : 1;
  });
}

function pickInOrder<T extends { readonly slug: string }>(
  pool: readonly T[],
  slugs: readonly string[],
): T[] {
  const bySlug = new Map(pool.map((entry) => [entry.slug, entry]));
  return slugs.flatMap((slug) => {
    const found = bySlug.get(slug);
    return found === undefined ? [] : [found];
  });
}

/** Builds the repository over an in-memory data set (the demo fixtures, or test data). */
export function createCatalog(data: CatalogData): CatalogRepository {
  const publicItems = data.items.filter((i) => i.visibility === 'public');
  const publicPatterns = data.patterns.filter((p) => p.visibility === 'public');
  const byItemDate = (i: Item) => i.addedOn;
  const byPatternDate = (p: Pattern) => p.addedOn;
  const byPostDate = (p: Post) => p.publishedOn;

  return {
    async listCatalogItems() {
      return newestFirst(
        publicItems.filter((i) => i.availability === 'available'),
        byItemDate,
      );
    },

    async listGalleryItems() {
      return newestFirst(
        publicItems.filter((i) => i.availability === 'unavailable'),
        byItemDate,
      );
    },

    async listFeaturedItems() {
      return newestFirst(
        publicItems.filter(
          (i) => i.featured === true && i.availability === 'available',
        ),
        byItemDate,
      );
    },

    async getPublicItem(slug) {
      return publicItems.find((i) => i.slug === slug);
    },

    async getPublicItems(slugs) {
      return pickInOrder(publicItems, slugs);
    },

    async listPatterns() {
      return newestFirst(publicPatterns, byPatternDate);
    },

    async getPublicPattern(slug) {
      return publicPatterns.find((p) => p.slug === slug);
    },

    async getPublicPatterns(slugs) {
      return pickInOrder(publicPatterns, slugs);
    },

    async listPosts() {
      return newestFirst(data.posts, byPostDate);
    },

    async getPost(slug) {
      return data.posts.find((p) => p.slug === slug);
    },

    async postsMentioning(kind, slug) {
      return newestFirst(
        data.posts.filter((p) =>
          (kind === 'item' ? p.relatedItems : p.relatedPatterns).includes(slug),
        ),
        byPostDate,
      );
    },

    async relatedPostsByTags(slug, limit) {
      const current = data.posts.find((p) => p.slug === slug);
      if (current === undefined || !Number.isInteger(limit) || limit <= 0) {
        return [];
      }
      const tags = new Set(current.tags);
      return newestFirst(
        data.posts.filter(
          (p) => p.slug !== current.slug && p.tags.some((t) => tags.has(t)),
        ),
        byPostDate,
      ).slice(0, limit);
    },
  };
}

export type Catalog = CatalogRepository;
