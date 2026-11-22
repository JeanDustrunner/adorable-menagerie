import type { Metadata } from 'next';
import { DM_Sans, Lora } from 'next/font/google';
import type { ReactNode } from 'react';
import './prototype.css';
import { ThemeShell } from './theme-shell';

// Self-hosted by next/font, so the CSP (`font-src 'self'`) stays untouched.
// latin-ext carries the Polish letters (ą ć ę ł ń ó ś ź ż).
const heading = Lora({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-heading',
  display: 'swap',
});

const body = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Adorable Menagerie (prototyp)',
  description:
    'Prototyp strony głównej. Projekt demonstracyjny, dane fikcyjne.',
  robots: { index: false, follow: false },
};

export default function PrototypeLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeShell className={`proto ${heading.variable} ${body.variable}`}>
      {children}
    </ThemeShell>
  );
}
