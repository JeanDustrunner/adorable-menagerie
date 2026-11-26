import { formatPrice } from '../format/price';
import type {
  Craft,
  Difficulty,
  Dimensions,
  Item,
  Pattern,
  Photo,
} from './types';

// How catalog data is worded on the pages (spec 4.1 and 6.3). Pure functions, so
// the wording is tested once and every page says the same thing.

/** Public URL of an exported photo in public/photos. */
export function photoSrc(photo: Photo): string {
  return `/photos/${photo.file}`;
}

const techniqueAdverb: Readonly<Record<Craft, string>> = {
  szydelko: 'Na szydełku',
  druty: 'Na drutach',
};

const craftName: Readonly<Record<Craft, string>> = {
  szydelko: 'szydełko',
  druty: 'druty',
};

const difficultyName: Readonly<Record<Difficulty, string>> = {
  poczatkujacy: 'dla początkujących',
  sredniozaawansowany: 'średnio zaawansowany',
  zaawansowany: 'zaawansowany',
};

function capitalise(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function makeTime(hours: number | undefined): string | undefined {
  return hours === undefined ? undefined : `ok. ${hours} godz.`;
}

function present(parts: readonly (string | undefined)[]): string[] {
  return parts.filter((part): part is string => part !== undefined);
}

/** Card line "type and height if known" (spec 6.2); undefined when neither is. */
export function itemSummary(item: Item): string | undefined {
  const parts = present([
    item.technique && techniqueAdverb[item.technique],
    item.dimensionsCm && `${item.dimensionsCm.height} cm`,
  ]);
  return parts.length === 0 ? undefined : parts.join(', ');
}

export interface Detail {
  readonly term: string;
  readonly value: string;
}

function formatDimensions({ height, width, depth }: Dimensions): string {
  return present([
    `wysokość ${height} cm`,
    width === undefined ? undefined : `szerokość ${width} cm`,
    depth === undefined ? undefined : `głębokość ${depth} cm`,
  ]).join(', ');
}

function detail(term: string, value: string | undefined): Detail | undefined {
  return value === undefined ? undefined : { term, value };
}

/**
 * The attribute list of the detail page, in a fixed order. Missing optional
 * fields are left out, never shown with an empty value (Q-03). A sold item's
 * price appears only here, as its last price (OD-8).
 */
export function itemDetails(item: Item): readonly Detail[] {
  const candidates = [
    detail('Wymiary', item.dimensionsCm && formatDimensions(item.dimensionsCm)),
    detail('Materiały', item.materials),
    detail('Włóczka', item.yarn),
    detail('Technika', item.technique && craftName[item.technique]),
    detail('Czas wykonania', makeTime(item.makeTimeHours)),
    detail('Pielęgnacja', item.care),
    detail(
      'Ostatnia cena',
      item.availability === 'unavailable'
        ? formatPrice(item.priceGrosze)
        : undefined,
    ),
  ];
  return candidates.filter((d): d is Detail => d !== undefined);
}

/** Card line for patterns: craft and difficulty instead of size (spec 6.4). */
export function patternSummary(pattern: Pattern): string {
  return `${capitalise(craftName[pattern.craft])}, ${difficultyName[pattern.difficulty]}`;
}

/** The attribute list of a pattern page; required fields first, then what exists. */
export function patternDetails(pattern: Pattern): readonly Detail[] {
  const candidates = [
    detail('Technika', craftName[pattern.craft]),
    detail('Poziom trudności', difficultyName[pattern.difficulty]),
    detail('Włóczka i narzędzia', pattern.yarnAndTools),
    detail('Gotowy rozmiar', pattern.finishedSize),
    detail('Format', pattern.format),
    detail('Liczba stron', pattern.pageCount?.toString()),
    detail('Czas wykonania', makeTime(pattern.makeTimeHours)),
  ];
  return candidates.filter((d): d is Detail => d !== undefined);
}

/** Information only (R3); nothing on the page acts on it. */
export function reproducibilityNote(item: Item): string {
  return item.reproducible ? 'Projekt można powtórzyć' : 'Projekt jednorazowy';
}

/** Splits plain-text descriptions into paragraphs on blank lines. */
export function paragraphs(text: string): readonly string[] {
  return text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}
