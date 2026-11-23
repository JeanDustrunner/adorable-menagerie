import { siteLanguage, siteMetadata } from '../../src/lib/site';

describe('site metadata', () => {
  it('declares Polish as the page language', () => {
    expect(siteLanguage).toBe('pl');
  });

  it('names the studio and gives child pages a title template', () => {
    expect(siteMetadata.title).toEqual({
      default: 'Adorable Menagerie',
      template: '%s | Adorable Menagerie',
    });
  });

  it('describes the site in Polish as a demonstration', () => {
    expect(siteMetadata.description).toMatch(/demonstracyjn/i);
  });

  it('keeps search engines out until go-live (OD-5)', () => {
    expect(siteMetadata.robots).toEqual({ index: false, follow: false });
  });
});
