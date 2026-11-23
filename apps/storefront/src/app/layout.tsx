import type { Metadata } from 'next';
import { DM_Sans, Lora } from 'next/font/google';
import type { ReactNode } from 'react';
import { DemoNotice } from '../components/shell/DemoNotice';
import { SiteFooter } from '../components/shell/SiteFooter';
import { SiteHeader } from '../components/shell/SiteHeader';
import { SkipLink } from '../components/shell/SkipLink';
import { siteLanguage, siteMetadata } from '../lib/site';
import './global.css';

// Self-hosted by next/font, so the CSP (`font-src 'self'`) stays unchanged.
// latin-ext carries the Polish letters.
const headingFont = Lora({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-heading',
  display: 'swap',
});

const bodyFont = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = siteMetadata;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang={siteLanguage}
      data-theme="pracownia"
      className={`${headingFont.variable} ${bodyFont.variable}`}
    >
      <body>
        <SkipLink />
        <DemoNotice />
        <SiteHeader />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
