import { fixtures } from './fixtures';
import { createCatalog } from './queries';

export { availabilityLabel, createCatalog } from './queries';
export type { Catalog, CatalogRepository, PostTarget } from './queries';
export type {
  Availability,
  CatalogData,
  Craft,
  Difficulty,
  Dimensions,
  Item,
  Pattern,
  Photo,
  Photos,
  Post,
  Visibility,
} from './types';

/** The catalog pages use: queries over the demo fixtures. */
export const catalog = createCatalog(fixtures);
