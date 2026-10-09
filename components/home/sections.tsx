import Link from "next/link";
import { getArticles, readingMinutes } from "@/config/articles";
import { downloaders, makerHub, makers } from "@/config/tools";
import { Faq } from "@/components/home/faq";
import { Stats } from "@/components/home/stats";
import { ToolGrid } from "@/components/tools/tool-card";
import { Reveal } from "@/components/ui/reveal";

const reasons = [
  ["Private by default", "Makers draw and encode on your device. Photos you add are not uploaded."],
  ["Complete tools", "Download, caption, resize, and export without sending the file to another site."],
  ["Clear limits", "Sizes for Discord, Twitch, and chat are built into the makers."],
  ["Fast loops", "Twelve to fifteen frames a second is enough. Higher rates mostly add weight."],
  ["No account", "Open a tool and export. There is nothing to sign up for."],
  ["No watermark", "The file you save is the file you made."],
];

const steps = [
  ["01", "Paste", "Add a public link, or drop an image, GIF, or short video into a maker."],
  ["02", "Detect", "The downloader reads the page and lists the files it can actually save."],
  ["03", "Preview", "Scrub the frames and check the picture before you commit."],
  ["04", "Adjust", "Change size, colors, text, timing, and dither until it fits."],
  ["05", "Export", "Save a GIF, an MP4, or a zip of PNG frames."],
  ["06", "Keep it", "The file stays with you. Gif Downloader does not host it."],
];

const formats = ["GIF89a", "MP4", "WebM", "PNG", "ZIP", "Discord", "Tenor", "Giphy", "Pinterest", "X"];

function ReasonIcon({ index }: { index: number }) {
  const paths = [
    "M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5 8a5 5 0 0 1 10 0",
    "M4 7h12M4 12h12M4 17h8",
    "M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm6 2 3 3",
    "M6 4v2M14 4v2M4 8h12M6 18h8a2 2 0 0 0 2-2V8H4v8a2 2 0 0 0 2 2Z",
    "M5 6h10a2 2 0 0 1 2 2v6l-3-2-3 2-3-2-3 2V8a2 2 0 0 1 2-2Z",
    "M10 6v4l3 2M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z",
  ];
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d={paths[index]} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HomeSections() {
  const guides = getArticles("guide").slice(0, 3);
  const loop = [...formats, ...formats];

  return (
    <>
      <Stats />

      <section id="tools" className="scroll-mt-28 border-y border-line bg-bg-2 py-20 sm:py-28">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-3xl">
                <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-cyan uppercase">01 / Tools</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
                  Gif Downloader tools
                </h2>
                <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
                  Use Gif Downloader to save a free GIF from a public page, or open a maker and export a new loop to your phone or computer.
                </p>
              </div>
              <Link href={makerHub.href} className="shrink-0 text-sm font-semibold text-cyan hover:text-white">
                View all makers
              </Link>
            </div>
          </Reveal>
          <div className="mt-12">
            <ToolGrid tools={[...downloaders, ...makers]} />
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28" id="why">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-cyan uppercase">02 / Features</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
              Features of Gif Download Free Online Tool
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
              Platform sizes are listed in the{" "}
              <Link href="/guides/best-gif-sizes-and-limits" className="font-semibold text-fg hover:text-cyan">
                GIF size guide
              </Link>
              .
            </p>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {reasons.map(([title, body], index) => (
              <Reveal key={title} delay={index * 0.04}>
                <article className="h-full rounded-3xl border border-line bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-white/15">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-cyan">
                      <ReasonIcon index={index} />
                    </span>
                    <span className="text-sm text-white/35">0{index + 1}</span>
                  </div>
                  <h3 className="mt-5 text-xl">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="border-y border-line bg-bg-2 py-20 sm:py-28">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-cyan uppercase">03 / Method</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
              How Gif Downloader Works
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted sm:text-lg">
              Paste a public link, or use the{" "}
              <Link href="/twitter-gif-downloader" className="font-semibold text-fg hover:text-cyan">
                Twitter Gif Downloader
              </Link>
              , the{" "}
              <Link href="/pinterest-gif-downloader" className="font-semibold text-fg hover:text-cyan">
                Pinterest GIF Downloader
              </Link>
              , or the{" "}
              <Link href="/discord-gif-downloader" className="font-semibold text-fg hover:text-cyan">
                Discord GIF Downloader
              </Link>{" "}
              when the link comes from that site.
            </p>
          </Reveal>
          <ol className="relative mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-6">
            <div className="pointer-events-none absolute top-5 right-0 left-0 hidden h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent xl:block" />
            {steps.map(([step, title, body], index) => (
              <li key={step} className="relative h-full">
                <Reveal delay={index * 0.05} className="h-full">
                  <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-accent/40 bg-bg text-sm">
                    {step}
                  </div>
                  <h3 className="mt-4 text-lg">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-line bg-bg py-16 sm:py-20" aria-label="Formats Gif Downloader works with">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-cyan uppercase">Formats</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">What you can bring in</h2>
        </div>
        <div className="relative mt-10 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bg to-transparent sm:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bg to-transparent sm:w-24" />
          <div className="marquee-track flex w-max gap-3 px-3">
            {loop.map((name, index) => (
              <span
                key={`${name}-${index}`}
                className="inline-flex items-center rounded-full border border-line bg-card px-5 py-3 text-sm font-medium text-white/85"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-bg-2 py-20 sm:py-28">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-cyan uppercase">04 / Guides</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
                Read before you export
              </h2>
              <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
                Practical notes on saving GIFs, cutting file size, and making loops that survive a chat window.
              </p>
            </div>
            <Link href="/guides" className="text-sm font-semibold text-cyan hover:text-white">
              All guides
            </Link>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {guides.map((guide) => (
              <article key={guide.slug} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-card">
                <div className="overflow-hidden">
                  <div className="transition duration-500 group-hover:scale-[1.03]">
                    <GuideArt label={guide.title} />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[11px] font-semibold tracking-[0.16em] text-cyan uppercase">Guide</p>
                  <h3 className="mt-2 text-xl leading-snug">
                    <Link href={`/guides/${guide.slug}`} className="transition hover:text-cyan">
                      {guide.title}
                    </Link>
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-muted">{guide.description}</p>
                  <p className="mt-4 text-xs text-muted">{readingMinutes(guide)} min read</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Faq />

      <section className="py-20 sm:py-28">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d1117] px-6 py-14 text-center sm:px-12 sm:py-20">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-accent/30 blur-3xl" />
            <div className="pointer-events-none absolute right-0 bottom-0 h-48 w-48 rounded-full bg-cyan/20 blur-3xl" />
            <div className="relative mx-auto max-w-3xl">
              <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">Download a free GIF, or make one</h2>
              <p className="mt-5 text-base leading-7 text-muted sm:text-lg">
                Paste a public link into Gif Downloader, or open a maker and export the file to your phone or computer.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/gif-downloader"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-bg transition hover:-translate-y-0.5"
                >
                  Open the downloader
                </Link>
                <Link href="/text-gif-maker" className="btn btn-ghost">
                  Make a text GIF
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function GuideArt({ label }: { label: string }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-[#0b1220]" role="img" aria-label={label}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, #6366f155, transparent 42%), radial-gradient(circle at 80% 70%, #06b6d440, transparent 46%), #0b1220",
        }}
      />
      <svg viewBox="0 0 640 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <g fill="none" stroke="rgb(255 255 255 / 0.18)" strokeWidth="1.2">
          <rect x="48" y="56" width="360" height="220" rx="18" />
          <path d="M48 98h360" />
          <rect x="72" y="128" width="150" height="12" rx="6" fill="rgb(255 255 255 / 0.55)" stroke="none" />
          <rect x="72" y="154" width="240" height="8" rx="4" fill="rgb(255 255 255 / 0.2)" stroke="none" />
          <rect x="72" y="214" width="92" height="28" rx="8" fill="#6366F1" stroke="none" />
          <rect x="204" y="274" width="70" height="72" rx="8" fill="#6366F1" opacity="0.55" />
          <rect x="288" y="286" width="70" height="60" rx="8" fill="#06B6D4" opacity="0.4" />
          <rect x="372" y="258" width="70" height="88" rx="8" fill="rgb(255 255 255 / 0.1)" />
        </g>
      </svg>
    </div>
  );
}
