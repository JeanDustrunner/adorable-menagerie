// Minimal JPEG segment reader for tests: lists the header segments (up to the
// start of the image scan) so tests can prove a photo carries no metadata and
// that its declared size matches the file.

export interface JpegSegment {
  readonly marker: number;
  /** Segment payload without the marker and the two length bytes. */
  readonly data: Buffer;
}

const STANDALONE = (marker: number) =>
  marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9);

export function readJpegSegments(file: Buffer): readonly JpegSegment[] {
  if (file.length < 4 || file[0] !== 0xff || file[1] !== 0xd8) {
    throw new Error('Not a JPEG file (missing SOI marker)');
  }
  const segments: JpegSegment[] = [];
  let offset = 2;
  while (offset + 1 < file.length) {
    if (file[offset] !== 0xff) {
      throw new Error(`Corrupt JPEG: expected a marker at byte ${offset}`);
    }
    let marker = file[offset + 1];
    offset += 2;
    while (marker === 0xff && offset < file.length) {
      marker = file[offset];
      offset += 1; // fill bytes before a marker
    }
    if (STANDALONE(marker)) continue;
    if (offset + 2 > file.length) {
      throw new Error('Corrupt JPEG: truncated segment length');
    }
    const length = file.readUInt16BE(offset);
    if (length < 2 || offset + length > file.length) {
      throw new Error(`Corrupt JPEG: bad segment length ${length}`);
    }
    segments.push({ marker, data: file.subarray(offset + 2, offset + length) });
    if (marker === 0xda) break; // start of scan: only image data follows
    offset += length;
  }
  return segments;
}

/** Pixel size from the frame header (SOF0 to SOF15, except DHT, JPG and DAC). */
export function readJpegSize(file: Buffer): { width: number; height: number } {
  const frame = readJpegSegments(file).find(
    (s) =>
      s.marker >= 0xc0 &&
      s.marker <= 0xcf &&
      ![0xc4, 0xc8, 0xcc].includes(s.marker),
  );
  if (frame === undefined) throw new Error('JPEG has no frame header');
  return {
    height: frame.data.readUInt16BE(1),
    width: frame.data.readUInt16BE(3),
  };
}
