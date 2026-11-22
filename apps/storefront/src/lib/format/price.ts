const wholeZloty = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const withGrosze = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
});

/**
 * Formats an amount stored in grosze ("149 zł", "149,50 zł").
 * Money is never formatted by hand and never held as a float. Zero is allowed here
 * (a free pattern would show "0 zł"); the catalog validator still requires prices > 0.
 */
export function formatPrice(priceGrosze: number): string {
  if (!Number.isSafeInteger(priceGrosze) || priceGrosze < 0) {
    throw new RangeError(
      `Price must be a non-negative whole number of grosze, got ${priceGrosze}`,
    );
  }
  const zloty = priceGrosze / 100;
  return priceGrosze % 100 === 0
    ? wholeZloty.format(zloty)
    : withGrosze.format(zloty);
}
