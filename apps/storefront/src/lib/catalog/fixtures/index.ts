import type { CatalogData } from '../types';
import { items } from './items';
import { patterns } from './patterns';
import { posts } from './posts';

/** The demo data set the storefront reads until a backend exists (phase 2a). */
export const fixtures: CatalogData = { items, patterns, posts };
