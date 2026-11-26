import {
  itemDetails,
  itemSummary,
  paragraphs,
  patternDetails,
  patternSummary,
  photoSrc,
  reproducibilityNote,
} from '../../../src/lib/catalog/presentation';
import { formatPrice } from '../../../src/lib/format/price';
import { item, pattern, photo } from './builders';

describe('photoSrc', () => {
  it('points at the exported copy in public/photos', () => {
    expect(photoSrc(photo({ file: 'lama-rosa-2.jpg' }))).toBe(
      '/photos/lama-rosa-2.jpg',
    );
  });
});

describe('itemSummary', () => {
  it('names the technique and the height when both are known', () => {
    expect(
      itemSummary(
        item({ technique: 'szydelko', dimensionsCm: { height: 32 } }),
      ),
    ).toBe('Na szydełku, 32 cm');
  });

  it('works with only one of them', () => {
    expect(itemSummary(item({ technique: 'druty' }))).toBe('Na drutach');
    expect(itemSummary(item({ dimensionsCm: { height: 28 } }))).toBe('28 cm');
  });

  it('is undefined when neither is known, so no empty line is shown', () => {
    expect(itemSummary(item())).toBeUndefined();
  });
});

describe('itemDetails', () => {
  it('lists only the optional fields that exist (Q-03)', () => {
    const details = itemDetails(item({ materials: 'Bawełna 100%' }));
    expect(details).toEqual([{ term: 'Materiały', value: 'Bawełna 100%' }]);
  });

  it('is empty for an available item without optional fields', () => {
    expect(itemDetails(item())).toEqual([]);
  });

  it('lists every field in a fixed order with Polish labels', () => {
    const details = itemDetails(
      item({
        dimensionsCm: { height: 38, width: 55, depth: 20 },
        materials: 'Bawełna',
        yarn: 'Bawełna 8/4',
        technique: 'szydelko',
        makeTimeHours: 18,
        care: 'Pranie ręczne',
      }),
    );
    expect(details).toEqual([
      {
        term: 'Wymiary',
        value: 'wysokość 38 cm, szerokość 55 cm, głębokość 20 cm',
      },
      { term: 'Materiały', value: 'Bawełna' },
      { term: 'Włóczka', value: 'Bawełna 8/4' },
      { term: 'Technika', value: 'szydełko' },
      { term: 'Czas wykonania', value: 'ok. 18 godz.' },
      { term: 'Pielęgnacja', value: 'Pranie ręczne' },
    ]);
  });

  it('shows the last price of a sold item only here, labelled as such (OD-8)', () => {
    const details = itemDetails(
      item({ availability: 'unavailable', quantity: 0, priceGrosze: 15900 }),
    );
    expect(details).toEqual([
      { term: 'Ostatnia cena', value: formatPrice(15900) },
    ]);
  });

  it('does not repeat the price of an available item', () => {
    expect(
      itemDetails(item({ priceGrosze: 15900 })).map((d) => d.term),
    ).not.toContain('Ostatnia cena');
  });
});

describe('reproducibilityNote', () => {
  it('says whether the piece can be made again', () => {
    expect(reproducibilityNote(item({ reproducible: true }))).toBe(
      'Projekt można powtórzyć',
    );
    expect(reproducibilityNote(item({ reproducible: false }))).toBe(
      'Projekt jednorazowy',
    );
  });
});

describe('paragraphs', () => {
  it('splits plain text on blank lines and drops empty pieces', () => {
    expect(paragraphs('Pierwszy.\n\n  Drugi.  \n\n\n')).toEqual([
      'Pierwszy.',
      'Drugi.',
    ]);
  });
});

describe('patternSummary', () => {
  it('names the craft and the difficulty (spec 6.4)', () => {
    expect(
      patternSummary(
        pattern({ craft: 'szydelko', difficulty: 'poczatkujacy' }),
      ),
    ).toBe('Szydełko, dla początkujących');
    expect(
      patternSummary(
        pattern({ craft: 'druty', difficulty: 'sredniozaawansowany' }),
      ),
    ).toBe('Druty, średnio zaawansowany');
    expect(
      patternSummary(pattern({ craft: 'druty', difficulty: 'zaawansowany' })),
    ).toBe('Druty, zaawansowany');
  });
});

describe('patternDetails', () => {
  it('always lists craft and difficulty, which are required', () => {
    expect(
      patternDetails(pattern({ craft: 'druty', difficulty: 'zaawansowany' })),
    ).toEqual([
      { term: 'Technika', value: 'druty' },
      { term: 'Poziom trudności', value: 'zaawansowany' },
    ]);
  });

  it('adds the optional fields that exist, in a fixed order', () => {
    expect(
      patternDetails(
        pattern({
          craft: 'szydelko',
          difficulty: 'poczatkujacy',
          yarnAndTools: 'Bawełna 8/4; szydełko 2,5 mm',
          finishedSize: 'ok. 32 cm wysokości',
          format: 'PDF',
          pageCount: 16,
          makeTimeHours: 18,
        }),
      ),
    ).toEqual([
      { term: 'Technika', value: 'szydełko' },
      { term: 'Poziom trudności', value: 'dla początkujących' },
      { term: 'Włóczka i narzędzia', value: 'Bawełna 8/4; szydełko 2,5 mm' },
      { term: 'Gotowy rozmiar', value: 'ok. 32 cm wysokości' },
      { term: 'Format', value: 'PDF' },
      { term: 'Liczba stron', value: '16' },
      { term: 'Czas wykonania', value: 'ok. 18 godz.' },
    ]);
  });
});
