import { Suspense } from "react";
import Link from "next/link";
import { getArticleBySlug } from "@/config/articles";
import { getTool, makers, type Tool } from "@/config/tools";
import { site } from "@/config/site";
import { MakerFonts } from "@/components/makers/fonts";
import { MakerApp } from "@/components/makers/maker-app";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageFrame } from "@/components/layout/page-frame";
import { DownloaderApp } from "@/components/tools/downloader-app";
import { ToolGrid } from "@/components/tools/tool-card";
import { JsonLd } from "@/components/seo/json-ld";
import { toolSchema } from "@/lib/schema";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export function ToolScreen({
  tool,
  searchParams,
}: {
  tool: Tool;
  searchParams?: SearchParams;
}) {
  const parent =
    tool.kind === "downloader"
      ? { href: "/gif-downloader", label: "Downloaders" }
      : { href: "/gif-maker", label: "GIF makers" };
  const crumbs =
    tool.kind === "hub"
      ? [
          { href: "/", label: "Home" },
          { label: tool.name },
        ]
      : [
          { href: "/", label: "Home" },
          parent,
          { label: tool.name },
        ];

  return (
    <PageFrame>
      <JsonLd data={toolSchema(tool)} />
      <div>
        <article>
          <header className="relative overflow-hidden border-b border-line">
            <div className="bg-grid pointer-events-none absolute inset-0" />
            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
            <div className="relative mx-auto w-full max-w-7xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
          <Breadcrumbs items={crumbs} />
          <div className="mt-6 max-w-3xl">
            <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-cyan uppercase">
              {tool.kind === "downloader" ? "Downloader" : tool.kind === "hub" ? "Makers" : "GIF maker"}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{tool.name}</h1>
            <p className="mt-4 text-lg leading-8 text-muted">{tool.lede}</p>
            <GuideLink tool={tool} />
          </div>
            </div>
          </header>

          <div className="mx-auto mt-8 w-full max-w-7xl px-5 sm:px-6 lg:px-8">
            {tool.kind === "downloader" ? (
              <Suspense fallback={<DownloaderApp tool={tool} initialUrl="" />}>
                <QueriedChecker tool={tool} searchParams={searchParams} />
              </Suspense>
            ) : null}
            {tool.kind === "maker" ? (
              <MakerFonts>
                <MakerApp slug={tool.slug} />
              </MakerFonts>
            ) : null}
            {tool.kind === "hub" ? (
              <div className="mt-2">
                <ToolGrid tools={makers} />
              </div>
            ) : null}

          <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="prose-frame max-w-3xl">
              <h2>How to use it</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5">
                {tool.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              {tool.options.length > 0 ? (
                <>
                  <h2>What you can change</h2>
                  <ul className="mt-3 space-y-4">
                    {tool.options.map((option) => (
                      <li key={option.title}>
                        <p className="font-semibold">{option.title}</p>
                        <p className="text-muted">{option.body}</p>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              {tool.tips.length > 0 ? (
                <>
                  <h2>Smaller files, clearer pictures</h2>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
                    {tool.tips.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </>
              ) : null}
              {tool.issues.length > 0 ? (
                <>
                  <h2>When something goes wrong</h2>
                  <ul className="mt-3 space-y-4">
                    {tool.issues.map((issue) => (
                      <li key={issue.title}>
                        <p className="font-semibold">{issue.title}</p>
                        <p className="text-muted">{issue.body}</p>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              {tool.faqs.length > 0 ? (
                <>
                  <h2>Questions</h2>
                  <div className="mt-2">
                    {tool.faqs.map((faq) => (
                      <details key={faq.question} className="faq">
                        <summary>{faq.question}</summary>
                        <p className="pb-4 text-muted">{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </>
              ) : null}
              {tool.kind === "downloader" ? (
                <p className="mt-8 text-sm leading-6 text-muted">
                  {site.name} is not affiliated with X, Pinterest, Discord, Tenor, or Giphy. Only download content you own or have permission to use.
                </p>
              ) : null}
            </div>
            <aside className="space-y-8">
              <Related title="Related tools" items={tool.related.map((slug) => {
                const related = getTool(slug);
                return { href: related.href, label: related.name };
              })} />
              <Related
                title="Keep reading"
                items={tool.guides.slice(1).flatMap((slug) => {
                  const article = getArticleBySlug(slug);
                  if (!article) return [];
                  return [{
                    href: `/${article.kind === "guide" ? "guides" : "blog"}/${article.slug}`,
                    label: article.title,
                  }];
                })}
              />
            </aside>
          </div>
          </div>
        </article>
      </div>
    </PageFrame>
  );
}

async function QueriedChecker({
  tool,
  searchParams,
}: {
  tool: Tool;
  searchParams?: SearchParams;
}) {
  const params = searchParams ? await searchParams : {};
  const raw = params.url;
  const initialUrl = typeof raw === "string" ? raw : "";
  return <DownloaderApp key={initialUrl} tool={tool} initialUrl={initialUrl} />;
}

function GuideLink({ tool }: { tool: Tool }) {
  const guide = tool.guides.map((slug) => getArticleBySlug(slug)).find((article) => article);
  if (!guide) return null;
  return (
    <p className="mt-4 text-base leading-7 text-muted">
      <Link
        href={`/${guide.kind === "guide" ? "guides" : "blog"}/${guide.slug}`}
        className="font-semibold text-fg hover:text-cyan"
      >
        {guide.title}
      </Link>
    </p>
  );
}

function Related({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string }[];
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="film-label text-muted">{title}</p>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="font-semibold hover:underline">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
