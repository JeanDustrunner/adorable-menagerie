import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './global.css';

export const metadata: Metadata = {
  title: 'Adorable Menagerie',
  description:
    'A fictional handmade crochet and knitting studio. Demonstration project.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
