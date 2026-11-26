import type { Pattern } from '../types';
import { photo } from './photo';

export const patterns: readonly Pattern[] = [
  {
    slug: 'wzor-smok-szafir',
    name: 'Wzór: Smok Szafir',
    description:
      'Szczegółowy opis krok po kroku wraz ze zdjęciami trudniejszych elementów: skrzydeł z drutem, łuski i szklanych oczu.',
    priceGrosze: 3900,
    visibility: 'public',
    photos: [
      photo(
        'smok-szafir',
        2,
        1330,
        1600,
        'Zbliżenie na głowę smoka Szafira, który powstaje według tego wzoru',
      ),
    ],
    tags: ['smoki', 'fantasy'],
    addedOn: '2026-11-08',
    craft: 'szydelko',
    difficulty: 'zaawansowany',
    yarnAndTools:
      'Bawełna 8/4, ok. 500 g; szydełko 2,5 mm; drut montażowy; szklane oczy 14 mm',
    finishedSize: 'ok. 38 cm wysokości',
    format: 'PDF',
    pageCount: 24,
    makeTimeHours: 30,
    madeItemSlug: 'smok-szafir',
  },
  {
    slug: 'wzor-konik-karmel',
    name: 'Wzór: Konik Karmel',
    description:
      'Wzór na konika z kremową grzywą. Dobry na drugą lub trzecią przytulankę, bo większość elementów to proste kształty.',
    priceGrosze: 2900,
    visibility: 'public',
    photos: [
      photo(
        'konik-karmel',
        2,
        1385,
        1600,
        'Konik Karmel obok motków włóczki, z których powstaje według tego wzoru',
      ),
    ],
    tags: ['konie', 'bawelna'],
    addedOn: '2026-10-15',
    craft: 'szydelko',
    difficulty: 'sredniozaawansowany',
    yarnAndTools: 'Bawełna 8/4 w czterech kolorach, ok. 250 g; szydełko 2,5 mm',
    finishedSize: 'ok. 32 cm wysokości',
    format: 'PDF',
    pageCount: 16,
    makeTimeHours: 18,
    madeItemSlug: 'konik-karmel',
  },
  {
    slug: 'wzor-lama-roberto',
    name: 'Wzór: Lama Roberto',
    description:
      'Wzór na lamę z pluszowej włóczki. Pluszowa włóczka bywa kapryśna, dlatego opis zawiera wskazówki, jak liczyć oczka.',
    priceGrosze: 2900,
    visibility: 'public',
    photos: [
      photo(
        'lama-roberto',
        2,
        1200,
        1274,
        'Lama Roberto obok motków włóczki i elementów uprzęży',
      ),
    ],
    tags: ['lamy', 'plusz'],
    addedOn: '2026-09-25',
    craft: 'szydelko',
    difficulty: 'sredniozaawansowany',
    yarnAndTools: 'Włóczka pluszowa ok. 200 g; szydełko 3,5 mm',
    finishedSize: 'ok. 35 cm wysokości',
    format: 'PDF',
    pageCount: 14,
    makeTimeHours: 14,
    madeItemSlug: 'lama-roberto',
  },
  {
    // Synthetic: gives the fixtures a beginner knitting pattern.
    slug: 'wzor-szalik-menazeria',
    name: 'Wzór: Szalik w kolorach menażerii',
    description:
      'Prosty szalik na drutach ściegiem francuskim. Najlepszy wzór na początek przygody z drutami.',
    priceGrosze: 1900,
    visibility: 'public',
    photos: [
      photo(
        'lama-rosa',
        2,
        1320,
        1457,
        'Motki włóczki w odcieniach różu i kremu, z których powstaje szalik',
      ),
    ],
    tags: ['bawelna', 'poczatkujacy'],
    addedOn: '2026-08-14',
    craft: 'druty',
    difficulty: 'poczatkujacy',
    yarnAndTools: 'Włóczka ok. 200 g; druty 4 mm',
    finishedSize: '20 × 160 cm',
    format: 'PDF',
    pageCount: 6,
    makeTimeHours: 8,
  },
  {
    // Synthetic and hidden: exists only so tests prove hidden patterns never leak.
    slug: 'wzor-sowa-szkic',
    name: 'Wzór: Sowa Ola (szkic)',
    description: 'Szkic wzoru w przygotowaniu, jeszcze niewidoczny w sklepie.',
    priceGrosze: 2500,
    visibility: 'hidden',
    photos: [
      photo(
        'konik-karmel',
        3,
        1377,
        1600,
        'Zdjęcie zastępcze szkicu wzoru, konik w pudełku',
      ),
    ],
    tags: [],
    addedOn: '2026-11-12',
    craft: 'szydelko',
    difficulty: 'poczatkujacy',
  },
];
