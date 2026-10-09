/**
 * Site identity. The build spec left these as placeholders;
 * change them here and the rest of the UI follows.
 */
const url = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://gifdownloaderapp.com").replace(
  /\/$/,
  "",
);

export const site = {
  name: "Gif Downloader",
  domain: "gifdownloaderapp.com",
  url,
  email: "hello@framepop.app",
  title: "Gif Downloader App - Free Online Tool to Download Gifs From URL",
  description:
    "Gif Downloader App is a Free Online Tool, Where you can download, Create, and Export Gifs.",
  tagline: "Download free GIFs, make GIFs, and export.",
  updated: "2026-10-09",
} as const;
