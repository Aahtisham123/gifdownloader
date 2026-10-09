import Link from "next/link";
import { getArticles, readingMinutes, type Article } from "@/config/articles";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageFrame } from "@/components/layout/page-frame";

export function ContentHub({ kind }: { kind: Article["kind"] }) {
  const items = getArticles(kind);
  const title = kind === "guide" ? "Guides" : "Blog";
  const lede =
    kind === "guide"
      ? "Practical notes on saving GIFs, cutting file size, and making loops that survive a chat window."
      : "Short pieces on where the GIF came from, why platforms turn it into video, and what to make with one.";

  return (
    <PageFrame>
      <div className="relative overflow-hidden border-b border-line">
        <div className="bg-grid pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative mx-auto w-full max-w-7xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: title }]} />
        <header className="mt-6 max-w-3xl">
          <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-cyan uppercase">
            {kind === "guide" ? "Learn the tools" : "Notes"}
          </p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{title}</h1>
          <p className="mt-4 text-lg leading-8 text-muted">{lede}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href={kind === "guide" ? "/gif-downloader" : "/gif-maker"} className="btn">
              {kind === "guide" ? "Open a downloader" : "Make a GIF"}
            </Link>
            <Link href={kind === "guide" ? "/blog" : "/guides"} className="btn btn-ghost">
              {kind === "guide" ? "Visit the blog" : "Visit the guides"}
            </Link>
          </div>
        </header>
        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {items.map((item, index) => (
            <li key={item.slug}>
              <article className="panel flex h-full flex-col p-5">
                <div className="flex items-start justify-between">
                  <span className="icon-badge text-sm font-semibold">{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-xs text-muted">{readingMinutes(item)} min</span>
                </div>
                <h2 className="mt-5 text-xl font-semibold">{item.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted">{item.description}</p>
                <Link href={`/${kind === "guide" ? "guides" : "blog"}/${item.slug}`} className="link-more mt-5">
                  Read →
                </Link>
              </article>
            </li>
          ))}
        </ul>
        </div>
      </div>
    </PageFrame>
  );
}
