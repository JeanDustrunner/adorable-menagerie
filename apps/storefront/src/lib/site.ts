import type { Metadata } from 'next';

/**
 * Visible brand name of the Polish site. Trial of the localized name agreed with
 * the owner on 2026-11-27; the project and any English version stay "Adorable
 * Menagerie". Reverting the trial is a change to this line.
 */
export const siteName = 'Urocza Menażeria';
/** The logo's tagline; English on purpose, so it is marked lang="en". */
export const siteTagline = 'friends made with love';
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
