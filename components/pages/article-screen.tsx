import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle, getArticleBySlug, readingMinutes, type Article } from "@/config/articles";
import { getTool } from "@/config/tools";
import { formatUpdated } from "@/lib/format";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageFrame } from "@/components/layout/page-frame";
import { PlatformLimits } from "@/components/content/platform-limits";
import { ReadingProgress } from "@/components/content/reading-progress";
import { RichText } from "@/components/content/rich-text";
import { ShareBar } from "@/components/content/share-bar";
import { JsonLd } from "@/components/seo/json-ld";
import { articleSchema } from "@/lib/schema";

export function ArticleScreen({
  kind,
  slug,
}: {
  kind: Article["kind"];
  slug: string;
}) {
  const article = getArticle(kind, slug);
  if (!article) notFound();
  const tool = getTool(article.toolSlug);
  const minutes = readingMinutes(article);
  const base = kind === "guide" ? "/guides" : "/blog";

  return (
    <PageFrame>
      <ReadingProgress />
      <JsonLd data={articleSchema(article, `${base}/${article.slug}`)} />
      <article id="article">
        <header className="relative overflow-hidden border-b border-line">
          <div className="bg-grid pointer-events-none absolute inset-0" />
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative mx-auto w-full max-w-7xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: base, label: kind === "guide" ? "Guides" : "Blog" },
            { label: article.title },
          ]}
        />
        <div className="mt-6 max-w-3xl">
          <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-cyan uppercase">
            {kind === "guide" ? "Guide" : "Blog"}
          </p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{article.title}</h1>
          <p className="mt-4 text-lg leading-8 text-muted">{article.description}</p>
          <p className="mt-4 text-sm text-muted">
            {minutes} min read · Updated {formatUpdated(article.updated)} · {tool.name}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link href={tool.href} className="btn">
              Use this tool
            </Link>
            <ShareBar title={article.title} path={`${base}/${article.slug}`} />
          </div>
        </div>
          </div>
        </header>
        <div className="mx-auto mt-10 grid w-full max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:px-8">
          <nav aria-label="On this page" className="panel h-fit p-4 lg:sticky lg:top-24">
            <p className="film-label text-muted">On this page</p>
            <ol className="mt-3 space-y-2 text-sm">
              {article.sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="hover:underline">
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="prose-frame max-w-3xl">
            {article.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph, index) => (
                  <p key={`${section.id}-${index}`}>
                    <RichText text={paragraph} />
                  </p>
                ))}
              </section>
            ))}
            {article.slug === "best-gif-sizes-and-limits" ? <PlatformLimits /> : null}
            <Link href={tool.href} className="btn mt-10 no-underline">
              Open {tool.name}
            </Link>
            <h2>Related</h2>
            <ul className="mt-3 space-y-2">
              {article.related.map((relatedSlug) => {
                const related = getArticleBySlug(relatedSlug);
                if (!related) return null;
                const href = `/${related.kind === "guide" ? "guides" : "blog"}/${related.slug}`;
                return (
                  <li key={related.slug}>
                    <Link href={href}>{related.title}</Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </article>
    </PageFrame>
  );
}
