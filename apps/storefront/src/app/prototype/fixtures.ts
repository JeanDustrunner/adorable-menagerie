// Demo data for the homepage prototype. Piece names, prices and stock are invented
// placeholders; the photos are of the owner's real work (metadata stripped).

/** Kept for the placeholder illustrations in animals.tsx (blog tiles, empty states). */
export type AnimalName =
  | 'bear'
  | 'fox'
  | 'rabbit'
  | 'owl'
  | 'cat'
  | 'elephant'
  | 'frog'
  | 'hedgehog'
  | 'penguin'
  | 'octopus';

export interface Photo {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
}

export interface Piece {
  readonly id: string;
  readonly kind: 'item' | 'pattern';
  readonly name: string;
  readonly summary: string;
  readonly pricePln: number;
  readonly note: string;
  readonly tint: 1 | 2 | 3;
  readonly photos: readonly [Photo, ...Photo[]];
}

function photo(
  slug: string,
  n: number,
  width: number,
  height: number,
  alt: string,
): Photo {
  return { src: `/photos/${slug}-${n}.jpg`, width, height, alt };
}

const karmel = {
  id: 'konik-karmel',
  kind: 'item',
  name: 'Konik Karmel',
  summary: 'Przytulanka, 32 cm',
  pricePln: 189,
  note: 'Dostępny',
  tint: 1,
  photos: [
    photo(
      'konik-karmel',
      1,
      1200,
      1600,
      'Brązowy szydełkowy konik z kremową grzywą i jasnoniebieską uzdą siedzi przed motkami włóczki',
    ),
    photo(
      'konik-karmel',
      2,
      1385,
      1600,
      'Konik Karmel obok motków włóczki w kolorach bieli, kremu, błękitu i brązu',
    ),
    photo(
      'konik-karmel',
      3,
      1377,
      1600,
      'Konik w prezentowym pudełku obok motków włóczki',
    ),
    photo(
      'konik-karmel',
      4,
      1362,
      1600,
      'Konik Karmel obok czerwonych drewnianych koników dekoracyjnych',
    ),
  ],
} as const satisfies Piece;

const roberto = {
  id: 'lama-roberto',
  kind: 'item',
  name: 'Lama Roberto',
  summary: 'Przytulanka, 35 cm',
  pricePln: 169,
  note: 'Ostatnia sztuka',
  tint: 3,
  photos: [
    photo(
      'lama-roberto',
      1,
      1200,
      1600,
      'Szara pluszowa lama Roberto z czerwoną uprzężą stoi obok doniczki z rośliną',
    ),
    photo(
      'lama-roberto',
      2,
      1200,
      1274,
      'Lama Roberto leży obok motków włóczki i elementów uprzęży',
    ),
    photo(
      'lama-roberto',
      3,
      1200,
      1600,
      'Lama Roberto obok włóczki i kolorowych szydełek',
    ),
    photo(
      'lama-roberto',
      4,
      1200,
      1600,
      'Portret lamy Roberto z jasnym pyskiem i szarą grzywką',
    ),
  ],
} as const satisfies Piece;

const szafir = {
  id: 'smok-szafir',
  kind: 'item',
  name: 'Smok Szafir',
  summary: 'Przytulanka, 38 cm',
  pricePln: 329,
  note: 'Dostępny',
  tint: 2,
  photos: [
    photo(
      'smok-szafir',
      1,
      1200,
      1600,
      'Niebiesko-złoty smok Szafir z rozpostartymi skrzydłami siedzi na kostkach do gry',
    ),
    photo(
      'smok-szafir',
      2,
      1330,
      1600,
      'Zbliżenie na głowę smoka Szafira z błękitną łuską i złotymi skrzydłami',
    ),
    photo(
      'smok-szafir',
      3,
      1523,
      1600,
      'Smok Szafir z kostkami do gry, widok z góry',
    ),
    photo(
      'smok-szafir',
      4,
      1597,
      1600,
      'Smok Szafir w niebieskiej czarodziejskiej czapce',
    ),
  ],
} as const satisfies Piece;

const szafirPattern = {
  id: 'wzor-smok-szafir',
  kind: 'pattern',
  name: 'Wzór: Smok Szafir',
  summary: 'Wzór PDF, szydełko, ok. 30 godz.',
  pricePln: 39,
  note: 'Dla zaawansowanych',
  tint: 2,
  photos: [
    photo(
      'smok-szafir',
      2,
      1330,
      1600,
      'Zbliżenie na głowę smoka Szafira, który powstaje według tego wzoru',
    ),
  ],
} as const satisfies Piece;

const rosa = {
  id: 'lama-rosa',
  kind: 'item',
  name: 'Lama Rosa',
  summary: 'Przytulanka, 28 cm',
  pricePln: 159,
  note: 'W nowym domu',
  tint: 2,
  photos: [
    photo(
      'lama-rosa',
      1,
      1200,
      1600,
      'Kremowo-różowa lama Rosa z chwostami przy kołnierzu stoi obok sukulenta',
    ),
    photo(
      'lama-rosa',
      2,
      1320,
      1457,
      'Lama Rosa obok motków włóczki w odcieniach różu i kremu',
    ),
    photo(
      'lama-rosa',
      3,
      1200,
      1600,
      'Zbliżenie na pyszczek lamy Rosy z białą grzywką',
    ),
  ],
} as const satisfies Piece;

const popiolek = {
  id: 'smok-popiolek',
  kind: 'item',
  name: 'Smok Popiołek',
  summary: 'Przytulanka, 45 cm',
  pricePln: 349,
  note: 'W nowym domu',
  tint: 3,
  photos: [
    photo(
      'smok-popiolek',
      1,
      1200,
      1600,
      'Szary smok Popiołek z rozpostartymi skrzydłami stoi na drewnianej podłodze',
    ),
    photo(
      'smok-popiolek',
      2,
      1200,
      1600,
      'Zbliżenie na pyszczek smoka Popiołka z jasnymi rogami',
    ),
    photo(
      'smok-popiolek',
      3,
      1200,
      1600,
      'Smok Popiołek na aksamitnej poduszce z perłami',
    ),
  ],
} as const satisfies Piece;

/** Catalog: public and available items, plus one pattern card to show both types. */
export const products: readonly Piece[] = [
  karmel,
  roberto,
  szafir,
  szafirPattern,
];

/** Previous work: public and unavailable items. */
export const pastWork: readonly Piece[] = [rosa, popiolek];

/** Hero cast, in display order (small, large, small). */
export const cast: readonly Piece[] = [roberto, szafir, karmel];

export const featuredStoryPiece: Piece = karmel;

export const navLinks: readonly {
  readonly label: string;
  readonly href: string;
}[] = [
  { label: 'Przytulanki', href: '#katalog' },
  { label: 'Wzory', href: '#katalog' },
  { label: 'Galeria prac', href: '#galeria' },
  { label: 'Blog', href: '#blog' },
  { label: 'Kontakt', href: '#kontakt' },
];

const plnFormat = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
  maximumFractionDigits: 0,
});

export function formatPrice(pricePln: number): string {
  return plnFormat.format(pricePln);
}
