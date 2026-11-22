// Content model for the public storefront (spec section 4). Pages read data only
// through the catalog module, so phase 2a can replace the fixtures with API calls.

export type Visibility = 'public' | 'hidden';
export type Availability = 'available' | 'unavailable';
export type Craft = 'szydelko' | 'druty';
export type Difficulty =
  'poczatkujacy' | 'sredniozaawansowany' | 'zaawansowany';

export interface Photo {
  /** File name inside public/photos, e.g. "konik-karmel-1.jpg". */
  readonly file: string;
  readonly width: number;
  readonly height: number;
  /** Polish text that describes what is visible. */
  readonly alt: string;
}

/** At least one photo; the first is the cover. */
export type Photos = readonly [Photo, ...Photo[]];

export interface Dimensions {
  readonly height: number;
  readonly width?: number;
  readonly depth?: number;
}

/** A physical item (D-02). Optional fields that are missing are simply not shown. */
export interface Item {
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  /** Integer number of grosze (14900 is 149 zł). */
  readonly priceGrosze: number;
  readonly visibility: Visibility;
  readonly availability: Availability;
  /**
   * Identical pieces on hand; 0 exactly when unavailable. The type does not tie this
   * to `availability`: `validateCatalog` is the guard, and must run on any data that
   * does not come from reviewed fixtures.
   */
  readonly quantity: number;
  readonly reproducible: boolean;
  readonly featured?: boolean;
  readonly photos: Photos;
  readonly tags: readonly string[];
  readonly dimensionsCm?: Dimensions;
  readonly materials?: string;
  readonly yarn?: string;
  readonly care?: string;
  readonly technique?: Craft;
  readonly makeTimeHours?: number;
  /** ISO date (YYYY-MM-DD); orders "newest" lists. */
  readonly addedOn: string;
}

/** A crochet or knitting pattern sold as a digital product (CAP-09). */
export interface Pattern {
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly priceGrosze: number;
  readonly visibility: Visibility;
  readonly photos: Photos;
  readonly tags: readonly string[];
  readonly addedOn: string;
  readonly craft: Craft;
  readonly difficulty: Difficulty;
  readonly yarnAndTools?: string;
  readonly finishedSize?: string;
  readonly format?: string;
  readonly pageCount?: number;
  readonly makeTimeHours?: number;
  /** Slug of the physical item made from this pattern. */
  readonly madeItemSlug?: string;
}

/** Post metadata (frontmatter). The Markdown body is added with the blog pipeline. */
export interface Post {
  readonly slug: string;
  readonly title: string;
  readonly publishedOn: string;
  readonly excerpt: string;
  readonly tags: readonly string[];
  readonly relatedItems: readonly string[];
  readonly relatedPatterns: readonly string[];
  readonly readingMinutes: number;
}

export interface CatalogData {
  readonly items: readonly Item[];
  readonly patterns: readonly Pattern[];
  readonly posts: readonly Post[];
}
