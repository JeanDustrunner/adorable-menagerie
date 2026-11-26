import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ItemDetail } from '../../../components/catalog/ItemDetail';
import { catalog } from '../../../lib/catalog';
import { paragraphs } from '../../../lib/catalog/presentation';
import { isSectionReady } from '../../../lib/navigation';

// Every public item is built at build time; any other slug, hidden items included,
// is a 404 (spec 7). Verified against the Next.js 16.4.6 bundled docs
// (generate-static-params.md, route-segment-config/dynamicParams.md): `params` is a
// Promise, and dynamicParams = false turns slugs outside generateStaticParams into
// 404s. It is unavailable with Cache Components, which this app does not enable.
export const dynamicParams = false;

interface ItemPageProps {
  readonly params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const [available, sold] = await Promise.all([
    catalog.listCatalogItems(),
    catalog.listGalleryItems(),
  ]);
  return [...available, ...sold].map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: ItemPageProps): Promise<Metadata> {
  const item = await catalog.getPublicItem((await params).slug);
  if (item === undefined) return {};
  return {
    title: item.name,
    description: paragraphs(item.description)[0],
  };
}

export default async function ItemPage({ params }: ItemPageProps) {
  const { slug } = await params;
  const item = await catalog.getPublicItem(slug);
  if (item === undefined) notFound();

  const [posts, pattern] = await Promise.all([
    catalog.postsMentioning('item', slug),
    catalog.getPatternForItem(slug),
  ]);
  return (
    <ItemDetail
      item={item}
      posts={posts}
      pattern={pattern}
      canLink={isSectionReady}
    />
  );
}
