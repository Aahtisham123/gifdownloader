import Link from "next/link";
import type { Tool } from "@/config/tools";
import { ToolIcon } from "@/components/graphics/tool-icon";

const tags: Record<string, string[]> = {
  "gif-downloader": ["Any page", "ZIP", "MP4 to GIF"],
  "twitter-gif-downloader": ["Twitter", "MP4", "Convert"],
  "pinterest-gif-downloader": ["Pins", "Sizes"],
  "discord-gif-downloader": ["CDN", "Tenor", "Giphy"],
  "heart-locket-gif-maker": ["Two photos", "Gold", "Silver"],
  "gif-meme-maker": ["Top text", "Bottom text", "Center"],
  "my-beloved-gif-maker": ["Portrait", "Heart crop", "Caption"],
  "transparent-gif-maker": ["Color key", "Green screen", "Matte"],
  "gif-caption-maker": ["Bar", "Bubble", "Lower third"],
  "pet-gif-maker": ["128 emoji", "112 emote", "Hand color"],
  "text-gif-maker": ["14 effects", "Fonts"],
  "gif-maker": ["All makers"],
};

const blurbs: Record<string, string> = {
  "gif-downloader":
    "pastes a public page and lists the GIFs, animated images, and MP4 loops it can save, so you can download one file or a zip.",
  "twitter-gif-downloader":
    "saves the animation from a public Twitter or X post. Twitter stores that loop as MP4, and you can keep the video or convert it to a GIF.",
  "pinterest-gif-downloader":
    "saves a public Pinterest pin, including the original size when the pin page lists it, plus the smaller 736 and 564 copies.",
  "discord-gif-downloader":
    "saves a Discord attachment, a Tenor GIF, or a Giphy GIF from the link you paste, then can fit it to a 128-pixel emoji.",
  "heart-locket-gif-maker":
    "opens two photos inside a gold, silver, rose, or black heart, with optional engraving, for a heart locket GIF.",
  "gif-meme-maker":
    "puts top and bottom text on an image or GIF, with a center layout when the caption should sit on the picture.",
  "my-beloved-gif-maker":
    "frames one portrait in a circle, rounded square, or heart and writes a script caption under the my beloved GIF.",
  "transparent-gif-maker":
    "removes a flat background color, including white, black, or a green screen, and mattes the edge of a transparent GIF.",
  "gif-caption-maker":
    "adds a bar, bubble, overlay, or lower third to an existing GIF so the caption arrives on the frame you choose.",
  "pet-gif-maker":
    "pats a photo or avatar with an original hand and exports a pet GIF at Discord emoji or Twitch emote size.",
  "text-gif-maker":
    "animates a line with wave, neon, glitch, spin, and other motions, then exports a text GIF with no photo required.",
  "gif-maker":
    "collects every maker in one place so you can create a GIF from text, a meme, a caption, or a photo.",
};

export function ToolCard({ tool }: { tool: Tool; index?: number }) {
  const blurb = blurbs[tool.slug];
  return (
    <article className="group relative flex h-full min-w-0 flex-col rounded-3xl border border-line bg-card p-5 transition duration-300 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-[0_24px_60px_-32px_rgb(99_102_241_/_0.75)] sm:p-6">
      <div className="pointer-events-none absolute -top-10 -right-8 h-28 w-28 rounded-full bg-accent/10 blur-2xl transition group-hover:bg-violet/20" />
      <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-cyan">
        <ToolIcon name={tool.icon} className="h-5 w-5" />
      </span>
      <h3 className="relative mt-5 text-xl">
        <Link href={tool.href} className="transition hover:text-cyan">
          {tool.name}
        </Link>
      </h3>
      <p className="relative mt-3 flex-1 text-sm leading-6 text-muted">
        {tool.name} {blurb ?? tool.card}
      </p>
      <ul className="relative mt-5 flex flex-wrap gap-2">
        {(tags[tool.slug] ?? ["Browser"]).map((tag) => (
          <li key={tag} className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/75">
            {tag}
          </li>
        ))}
      </ul>
      <Link href={tool.href} className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold">
        Open
        <svg viewBox="0 0 16 16" className="h-4 w-4 transition group-hover:translate-x-1" fill="none" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </article>
  );
}

export function ToolGrid({ tools }: { tools: Tool[] }) {
  return (
    <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {tools.map((tool) => (
        <ToolCard key={tool.slug} tool={tool} />
      ))}
    </div>
  );
}
