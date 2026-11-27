import {
  siteLanguage,
  siteMetadata,
  siteName,
  siteTagline,
} from '../../src/lib/site';

describe('site metadata', () => {
  it('declares Polish as the page language', () => {
    expect(siteLanguage).toBe('pl');
  });

  it('uses the Polish brand name and the logo tagline (owner trial, 2026-11-27)', () => {
    expect(siteName).toBe('Urocza Menażeria');
    expect(siteTagline).toBe('friends made with love');
  });

  it('names the studio and gives child pages a title template', () => {
    expect(siteMetadata.title).toEqual({
      default: 'Urocza Menażeria',
      template: '%s | Urocza Menażeria',
    });
  });

  it('describes the site in Polish as a demonstration', () => {
    expect(siteMetadata.description).toMatch(/demonstracyjn/i);
  });

  it('keeps search engines out until go-live (OD-5)', () => {
    expect(siteMetadata.robots).toEqual({ index: false, follow: false });
  });
});
