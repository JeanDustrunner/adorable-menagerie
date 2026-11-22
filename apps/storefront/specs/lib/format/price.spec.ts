import { formatPrice } from '../../../src/lib/format/price';

// Intl uses non-breaking spaces; compare with plain spaces to keep tests readable.
const plain = (text: string) =>
  text.replace(new RegExp('[\\u00a0\\u202f]', 'g'), ' ');

describe('formatPrice', () => {
  it('formats whole zloty amounts without decimals', () => {
    expect(plain(formatPrice(18900))).toBe('189 zł');
  });

  it('keeps two decimals when there are grosze', () => {
    expect(plain(formatPrice(14950))).toBe('149,50 zł');
  });

  it('separates thousands with a space', () => {
    expect(plain(formatPrice(1234500))).toBe('12 345 zł');
  });

  it('does not group four-digit amounts (a pl-PL convention worth pinning)', () => {
    expect(plain(formatPrice(100000))).toBe('1000 zł');
  });

  it('rejects amounts beyond the safe integer range', () => {
    expect(() => formatPrice(Number.MAX_SAFE_INTEGER + 2)).toThrow(RangeError);
  });

  it('formats zero', () => {
    expect(plain(formatPrice(0))).toBe('0 zł');
  });

  it('rejects amounts that are not whole grosze', () => {
    expect(() => formatPrice(10.5)).toThrow(RangeError);
  });

  it('rejects negative amounts', () => {
    expect(() => formatPrice(-1)).toThrow(RangeError);
  });
});
