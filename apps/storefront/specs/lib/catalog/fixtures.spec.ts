import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { fixtures } from '../../../src/lib/catalog/fixtures';
import { validateCatalog } from '../../../src/lib/catalog/validate';
import { readJpegSegments, readJpegSize } from './jpeg';

const photosDir = resolve(import.meta.dirname, '../../../public/photos');

const allPhotoFiles = [...fixtures.items, ...fixtures.patterns].flatMap(
  (entry) => entry.photos.map((p) => p.file),
);

const unique = (files: readonly string[]) => [...new Set(files)];

describe('the demo fixtures', () => {
  it('pass every integrity rule', () => {
    expect(validateCatalog(fixtures)).toEqual([]);
  });

  it('cover every state the pages need to show', () => {
    const { items, patterns, posts } = fixtures;
    const has = (predicate: (i: (typeof items)[number]) => boolean) =>
      items.some(predicate);

    expect(has((i) => i.availability === 'available' && i.quantity > 1)).toBe(
      true,
    );
    expect(has((i) => i.availability === 'available' && i.quantity === 1)).toBe(
      true,
    );
    expect(has((i) => i.availability === 'unavailable' && i.reproducible)).toBe(
      true,
    );
    expect(
      has((i) => i.availability === 'unavailable' && !i.reproducible),
    ).toBe(true);
    expect(has((i) => i.visibility === 'hidden')).toBe(true);
    expect(has((i) => i.featured === true)).toBe(true);
    expect(has((i) => i.dimensionsCm === undefined)).toBe(true);

    expect(patterns.some((p) => p.visibility === 'hidden')).toBe(true);
    expect(new Set(patterns.map((p) => p.craft))).toEqual(
      new Set(['szydelko', 'druty']),
    );
    expect(new Set(patterns.map((p) => p.difficulty))).toEqual(
      new Set(['poczatkujacy', 'sredniozaawansowany', 'zaawansowany']),
    );

    expect(posts.length).toBeGreaterThanOrEqual(5);
    expect(
      posts.some(
        (p) => p.relatedItems.length === 0 && p.relatedPatterns.length === 0,
      ),
    ).toBe(true);
  });

  it('use only photo files that exist in public/photos', () => {
    const missing = allPhotoFiles.filter(
      (file) => !existsSync(resolve(photosDir, file)),
    );
    expect(missing).toEqual([]);
  });

  it('keep every photo small enough for the web (under 600 KB)', () => {
    const tooBig = allPhotoFiles.filter(
      (file) => statSync(resolve(photosDir, file)).size > 600 * 1024,
    );
    expect(tooBig).toEqual([]);
  });

  it('commit no photo with embedded metadata (the repository is public)', () => {
    // Allowed header segments: JFIF (APP0) and colour profile (APP2). Anything
    // else could carry location, device or author data: EXIF and XMP live in
    // APP1, IPTC in APP13, free text in COM.
    const allowed = new Set([0xe0, 0xe2]);
    const withMetadata = unique(allPhotoFiles).filter((file) =>
      readJpegSegments(readFileSync(resolve(photosDir, file))).some(
        (segment) =>
          (segment.marker >= 0xe0 &&
            segment.marker <= 0xef &&
            !allowed.has(segment.marker)) ||
          segment.marker === 0xfe,
      ),
    );
    expect(withMetadata).toEqual([]);
  });

  it('declare the real pixel size of every photo', () => {
    const wrong: string[] = [];
    for (const entry of [...fixtures.items, ...fixtures.patterns]) {
      for (const photo of entry.photos) {
        const actual = readJpegSize(
          readFileSync(resolve(photosDir, photo.file)),
        );
        if (actual.width !== photo.width || actual.height !== photo.height) {
          wrong.push(
            `${photo.file}: declared ${photo.width}x${photo.height}, actual ${actual.width}x${actual.height}`,
          );
        }
      }
    }
    expect(wrong).toEqual([]);
  });
});
