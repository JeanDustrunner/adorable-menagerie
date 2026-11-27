import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

// Decor art (the owner's illustrations, rights confirmed 2026-11-27) ships only as
// small web exports with no metadata, like the photos (spec 5.1).
const decorDir = resolve(import.meta.dirname, '../../public/decor');
const files = readdirSync(decorDir);
const MAX_BYTES = 250_000;

function webpChunks(data: Buffer): string[] {
  expect(data.toString('latin1', 0, 4)).toBe('RIFF');
  expect(data.toString('latin1', 8, 12)).toBe('WEBP');
  const chunks: string[] = [];
  let offset = 12;
  while (offset + 8 <= data.length) {
    chunks.push(data.toString('latin1', offset, offset + 4));
    const size = data.readUInt32LE(offset + 4);
    offset += 8 + size + (size % 2);
  }
  return chunks;
}

describe('decor images', () => {
  it('has the logo and both side strips', () => {
    expect(files.sort()).toEqual([
      'houses-left.webp',
      'houses-right.webp',
      'logo.webp',
    ]);
  });

  it.each(files)(
    '%s is a small WebP with no EXIF, XMP or ICC chunk',
    (file) => {
      const data = readFileSync(resolve(decorDir, file));
      expect(data.length).toBeLessThanOrEqual(MAX_BYTES);
      const chunks = webpChunks(data);
      expect(chunks).not.toContain('EXIF');
      expect(chunks).not.toContain('XMP ');
      expect(chunks).not.toContain('ICCP');
    },
  );
});
