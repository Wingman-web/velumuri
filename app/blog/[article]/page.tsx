import { BlogArticle } from '@/components/legacy-pages';

export default async function BlogPage({ params }: { params: Promise<{ article: string }> }) {
  const { article } = await params;
  return <BlogArticle article={article} />;
}
