import { readJpegSegments, readJpegSize } from './jpeg';

function segment(marker: number, payload: number[]): number[] {
  const length = payload.length + 2;
  return [0xff, marker, length >> 8, length & 0xff, ...payload];
}

function jpeg(...segments: number[][]): Buffer {
  const scan = segment(0xda, [0x00, 0x01, 0x02]);
  return Buffer.from([
    0xff,
    0xd8,
    ...segments.flat(),
    ...scan,
    0x12, // image data would follow here
    0xff,
    0xd9,
  ]);
}

const jfif = segment(0xe0, [0x4a, 0x46, 0x49, 0x46, 0x00]);
const exif = segment(0xe1, [0x45, 0x78, 0x69, 0x66, 0x00, 0x00]);
// precision 8, height 1600 (0x0640), width 1200 (0x04b0), one component
const frame = segment(0xc0, [8, 0x06, 0x40, 0x04, 0xb0, 1, 1, 0x11, 0]);

describe('readJpegSegments', () => {
  it('lists the header segments in order, up to the start of the scan', () => {
    const markers = readJpegSegments(jpeg(jfif, exif, frame)).map(
      (s) => s.marker,
    );
    expect(markers).toEqual([0xe0, 0xe1, 0xc0, 0xda]);
  });

  it('exposes the payload so tests can look inside a segment', () => {
    const exifSegment = readJpegSegments(jpeg(exif)).find(
      (s) => s.marker === 0xe1,
    );
    expect(exifSegment?.data.toString('latin1')).toContain('Exif');
  });

  it('rejects data that is not a JPEG', () => {
    expect(() => readJpegSegments(Buffer.from('not a jpeg'))).toThrow(
      /Not a JPEG/,
    );
  });

  it('rejects a segment that claims to be longer than the file', () => {
    const broken = Buffer.from([0xff, 0xd8, 0xff, 0xe1, 0xff, 0xff, 0x00]);
    expect(() => readJpegSegments(broken)).toThrow(/bad segment length/);
  });
});

describe('readJpegSize', () => {
  it('reads width and height from the frame header', () => {
    expect(readJpegSize(jpeg(jfif, frame))).toEqual({
      width: 1200,
      height: 1600,
    });
  });

  it('fails when there is no frame header', () => {
    expect(() => readJpegSize(jpeg(jfif))).toThrow(/no frame header/);
  });
});
