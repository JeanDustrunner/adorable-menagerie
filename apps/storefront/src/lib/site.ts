import type { Metadata } from 'next';

export const siteName = 'Adorable Menagerie';
export const siteLanguage = 'pl';

/**
 * Site-wide metadata. The title template applies to child pages' titles. Search
 * engines are kept out until go-live (spec OD-5). Child pages must not set `robots`
 * themselves: Next replaces the whole object instead of merging it.
 */
export const siteMetadata: Metadata = {
  title: { default: siteName, template: `%s | ${siteName}` },
  description:
    'Szydełkowe i dziergane zwierzaki oraz wzory do samodzielnego wykonania. Projekt demonstracyjny, wszystkie dane są fikcyjne.',
  robots: { index: false, follow: false },
};
