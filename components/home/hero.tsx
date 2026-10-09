"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { StudioPanel } from "@/components/graphics/studio-panel";
import { downloaders } from "@/config/tools";
import { classifyUrl } from "@/lib/classify-url";

const trust = ["Download", "Make", "Resize", "Export"];

export function Hero() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = classifyUrl(value);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setError("");
    router.push(`${result.href}?url=${encodeURIComponent(result.normalized)}`);
  }

  return (
    <section className="relative overflow-hidden pt-16 sm:pt-20">
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
      <div className="pointer-events-none absolute top-24 right-0 h-80 w-80 rounded-full bg-cyan/15 blur-3xl" />
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-5 pb-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-24">
        <div>
          <nav className="mb-4 flex gap-2 overflow-x-auto lg:hidden" aria-label="Downloaders">
            {downloaders.map((tool) => (
              <Link
                key={tool.slug}
                href={tool.href}
                className="shrink-0 rounded-full border border-line bg-white/5 px-3 py-1.5 text-xs font-medium text-fg"
              >
                {tool.name}
              </Link>
            ))}
          </nav>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
            GIF tools that stay in the browser
          </p>
          <h1 className="mt-6 text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Gif Downloader - Download Free Gifs - Make Gifs and <span className="text-gradient">Export</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg">
            Gif Downloader reads a public page, lists the GIFs and videos it can save, and lets you download them. You can also{" "}
            <Link href="/gif-maker" className="font-semibold text-fg hover:text-cyan">
              create a GIF
            </Link>{" "}
            with text, a caption, or photos, then export the file to your smartphone or computer. The makers run in the browser, so the pictures you add are not uploaded, and the file has no watermark.
          </p>
          <form onSubmit={onSubmit} className="mt-8 max-w-xl">
            <label htmlFor="hero-url" className="sr-only">
              Public link
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id="hero-url"
                name="url"
                type="url"
                inputMode="url"
                autoComplete="off"
                placeholder="Paste a public page or GIF link"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                className="field min-h-12"
              />
              <button type="submit" className="btn min-h-12">
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
                  <circle cx="7" cy="7" r="4.25" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M10.2 10.2 13 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                Find media
              </button>
            </div>
          </form>
          {error ? (
            <p role="alert" className="mt-3 text-sm text-[var(--danger)]">
              {error}
            </p>
          ) : null}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link href="/gif-maker" className="btn">
              Start a GIF
            </Link>
            <Link href="/guides" className="btn btn-ghost">
              Explore guides
            </Link>
          </div>
          <p className="mt-6 text-sm tracking-wide text-muted">
            {trust.map((item, index) => (
              <span key={item}>
                {index > 0 ? <span aria-hidden="true"> • </span> : null}
                {item}
              </span>
            ))}
          </p>
        </div>
        <StudioPanel />
      </div>
    </section>
  );
}
