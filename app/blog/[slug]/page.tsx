import type { Metadata } from "next";
import { getArticle, getArticles } from "@/config/articles";
import { ArticleScreen } from "@/components/pages/article-screen";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getArticles("blog").map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle("blog", slug);
  if (!article) return { title: "Blog" };
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/blog/${article.slug}` },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <ArticleScreen kind="blog" slug={slug} />;
}
