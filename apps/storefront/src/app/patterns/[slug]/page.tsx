import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PatternDetail } from '../../../components/catalog/PatternDetail';
import { catalog } from '../../../lib/catalog';
import { paragraphs } from '../../../lib/catalog/presentation';
import { isSectionReady } from '../../../lib/navigation';

// Same static generation as /toys/[slug] (verified against the Next.js 16.4.6
// bundled docs there): every public pattern is built, any other slug is a 404.
export const dynamicParams = false;

interface PatternPageProps {
  readonly params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const patterns = await catalog.listPatterns();
  return patterns.map((pattern) => ({ slug: pattern.slug }));
}

export async function generateMetadata({
  params,
}: PatternPageProps): Promise<Metadata> {
  const pattern = await catalog.getPublicPattern((await params).slug);
  if (pattern === undefined) return {};
  return {
    title: pattern.name,
    description: paragraphs(pattern.description)[0],
  };
}

export default async function PatternPage({ params }: PatternPageProps) {
  const { slug } = await params;
  const pattern = await catalog.getPublicPattern(slug);
  if (pattern === undefined) notFound();

  const [posts, madeItem] = await Promise.all([
    catalog.postsMentioning('pattern', slug),
    pattern.madeItemSlug === undefined
      ? Promise.resolve(undefined)
      : catalog.getPublicItem(pattern.madeItemSlug),
  ]);
  return (
    <PatternDetail
      pattern={pattern}
      posts={posts}
      madeItem={madeItem}
      canLink={isSectionReady}
    />
  );
}
