import type { CatalogData, Item, Pattern, Photo, Post } from './types';

export type ProblemRule =
  | 'duplicate-slug'
  | 'invalid-slug'
  | 'invalid-price'
  | 'stock-mismatch'
  | 'invalid-date'
  | 'missing-photo'
  | 'missing-alt'
  | 'invalid-photo-file'
  | 'invalid-photo-size'
  | 'dangling-reference'
  | 'hidden-reference';

export interface Problem {
  readonly rule: ProblemRule;
  /** What the problem is about, e.g. "item konik-karmel". */
  readonly subject: string;
  readonly message: string;
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// A bare file name: no folders, so a photo can never point outside public/photos.
const PHOTO_FILE = /^[a-z0-9][a-z0-9-]*\.(?:jpe?g|webp|avif)$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

type Known = ReadonlyMap<string, { readonly visibility: string }>;

function isRealIsoDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

function problem(rule: ProblemRule, subject: string, message: string): Problem {
  return { rule, subject, message };
}

function checkSlugs(
  kind: string,
  slugs: readonly string[],
  out: Problem[],
): void {
  const seen = new Set<string>();
  for (const slug of slugs) {
    const subject = `${kind} ${slug}`;
    if (!SLUG.test(slug)) {
      out.push(
        problem(
          'invalid-slug',
          subject,
          'Slug must be lowercase ASCII words joined by single hyphens',
        ),
      );
    }
    if (seen.has(slug)) {
      out.push(
        problem(
          'duplicate-slug',
          subject,
          `Slug is used more than once among ${kind}s`,
        ),
      );
    }
    seen.add(slug);
  }
}

function checkPrice(subject: string, price: number, out: Problem[]): void {
  if (!Number.isSafeInteger(price) || price <= 0) {
    out.push(
      problem(
        'invalid-price',
        subject,
        'Price must be a positive whole number of grosze',
      ),
    );
  }
}

function checkDate(subject: string, date: string, out: Problem[]): void {
  if (!isRealIsoDate(date)) {
    out.push(
      problem(
        'invalid-date',
        subject,
        `"${date}" is not a real date in YYYY-MM-DD form`,
      ),
    );
  }
}

function checkPhoto(subject: string, photo: Photo, out: Problem[]): void {
  if (!PHOTO_FILE.test(photo.file)) {
    out.push(
      problem(
        'invalid-photo-file',
        subject,
        `"${photo.file}" must be a bare file name in public/photos`,
      ),
    );
  }
  if (
    !Number.isSafeInteger(photo.width) ||
    photo.width <= 0 ||
    !Number.isSafeInteger(photo.height) ||
    photo.height <= 0
  ) {
    out.push(
      problem(
        'invalid-photo-size',
        subject,
        `Photo ${photo.file} needs a positive whole width and height`,
      ),
    );
  }
  if (photo.alt.trim() === '') {
    out.push(
      problem('missing-alt', subject, `Photo ${photo.file} needs alt text`),
    );
  }
}

function checkPhotos(
  subject: string,
  photos: readonly Photo[],
  out: Problem[],
): void {
  if (photos.length === 0) {
    out.push(
      problem('missing-photo', subject, 'At least one photo is required'),
    );
  }
  for (const photo of photos) checkPhoto(subject, photo, out);
}

function checkReference(
  subject: string,
  kind: 'item' | 'pattern',
  slug: string,
  known: Known,
  out: Problem[],
): void {
  const target = known.get(slug);
  if (target === undefined) {
    out.push(
      problem(
        'dangling-reference',
        subject,
        `References ${kind} "${slug}", which does not exist`,
      ),
    );
  } else if (target.visibility !== 'public') {
    out.push(
      problem(
        'hidden-reference',
        subject,
        `References ${kind} "${slug}", which is hidden`,
      ),
    );
  }
}

function checkItem(item: Item, out: Problem[]): void {
  const subject = `item ${item.slug}`;
  checkPrice(subject, item.priceGrosze, out);
  checkDate(subject, item.addedOn, out);
  checkPhotos(subject, item.photos, out);
  const quantityOk = Number.isSafeInteger(item.quantity) && item.quantity >= 0;
  const stockOk =
    quantityOk &&
    (item.availability === 'available'
      ? item.quantity >= 1
      : item.quantity === 0);
  if (!stockOk) {
    out.push(
      problem(
        'stock-mismatch',
        subject,
        `Quantity ${item.quantity} does not fit availability "${item.availability}"`,
      ),
    );
  }
}

function checkPattern(pattern: Pattern, items: Known, out: Problem[]): void {
  const subject = `pattern ${pattern.slug}`;
  checkPrice(subject, pattern.priceGrosze, out);
  checkDate(subject, pattern.addedOn, out);
  checkPhotos(subject, pattern.photos, out);
  if (pattern.madeItemSlug !== undefined) {
    checkReference(subject, 'item', pattern.madeItemSlug, items, out);
  }
}

function checkPost(
  post: Post,
  items: Known,
  patterns: Known,
  out: Problem[],
): void {
  const subject = `post ${post.slug}`;
  checkDate(subject, post.publishedOn, out);
  for (const slug of post.relatedItems) {
    checkReference(subject, 'item', slug, items, out);
  }
  for (const slug of post.relatedPatterns) {
    checkReference(subject, 'pattern', slug, patterns, out);
  }
}

/**
 * Checks the integrity rules of the content model (spec 4.4). Returns every
 * problem found; an empty list means the data is consistent.
 */
export function validateCatalog(data: CatalogData): readonly Problem[] {
  const out: Problem[] = [];
  const items: Known = new Map(data.items.map((i) => [i.slug, i]));
  const patterns: Known = new Map(data.patterns.map((p) => [p.slug, p]));

  checkSlugs(
    'item',
    data.items.map((i) => i.slug),
    out,
  );
  checkSlugs(
    'pattern',
    data.patterns.map((p) => p.slug),
    out,
  );
  checkSlugs(
    'post',
    data.posts.map((p) => p.slug),
    out,
  );

  for (const item of data.items) checkItem(item, out);
  for (const pattern of data.patterns) checkPattern(pattern, items, out);
  for (const post of data.posts) checkPost(post, items, patterns, out);

  return out;
}
