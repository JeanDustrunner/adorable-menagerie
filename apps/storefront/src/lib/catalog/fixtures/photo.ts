import type { Photo } from '../types';

/** Builds a Photo for the exported file `<slug>-<n>.jpg` in public/photos. */
export function photo(
  slug: string,
  n: number,
  width: number,
  height: number,
  alt: string,
): Photo {
  return { file: `${slug}-${n}.jpg`, width, height, alt };
}
