import type { ReactNode } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageFrame } from "@/components/layout/page-frame";
import { formatUpdated } from "@/lib/format";
import { site } from "@/config/site";

export function LegalScreen({
  title,
  lede,
  children,
}: {
  title: string;
  lede: string;
  children: ReactNode;
}) {
  return (
    <PageFrame>
      <article>
        <header className="relative overflow-hidden border-b border-line">
          <div className="bg-grid pointer-events-none absolute inset-0" />
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative mx-auto w-full max-w-7xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: title }]} />
        <div className="mt-6 max-w-3xl">
          <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-cyan uppercase">Gif Downloader</p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{title}</h1>
          <p className="mt-4 text-lg leading-8 text-muted">{lede}</p>
          <p className="mt-3 text-sm text-muted">Updated {formatUpdated(site.updated)}</p>
          <Link href="/contact" className="btn mt-6">
            Contact
          </Link>
        </div>
          </div>
        </header>
        <div className="prose-frame mx-auto mt-10 w-full max-w-3xl px-5 sm:px-6 lg:px-8">{children}</div>
      </article>
    </PageFrame>
  );
}
