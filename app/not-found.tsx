import Link from "next/link";
import { PageFrame } from "@/components/layout/page-frame";

const links = [
  { href: "/gif-downloader", label: "Universal downloader" },
  { href: "/twitter-gif-downloader", label: "Twitter Gif Downloader" },
  { href: "/gif-maker", label: "GIF makers" },
  { href: "/text-gif-maker", label: "Text GIF" },
  { href: "/guides", label: "Guides" },
];

export default function NotFound() {
  return (
    <PageFrame>
      <div className="relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto w-full max-w-3xl px-5 py-20 sm:px-6">
        <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-cyan uppercase">404</p>
        <h1 className="mt-3 text-4xl font-semibold">This page is not here.</h1>
        <p className="mt-4 max-w-xl text-lg leading-8 text-muted">
          That address is not a tool, a guide, or a post. Pick a page that is.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="btn btn-ghost">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        </div>
      </div>
    </PageFrame>
  );
}
