import { LegacyPage, LEGACY_SLUGS } from '@/components/legacy-pages';

export const dynamicParams = false;
export function generateStaticParams() {
  return LEGACY_SLUGS.map((slug) => ({ slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LegacyPage slug={slug} />;
}
