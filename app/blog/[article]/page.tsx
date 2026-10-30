import { BlogArticle, ARTICLE_IDS } from '@/components/legacy-pages';

export const dynamicParams = false;
export function generateStaticParams() {
  return ARTICLE_IDS.map((article) => ({ article }));
}

export default async function BlogPage({ params }: { params: Promise<{ article: string }> }) {
  const { article } = await params;
  return <BlogArticle article={article} />;
}
