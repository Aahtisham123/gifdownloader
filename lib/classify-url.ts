import { discordPageHosts, platforms } from "@/config/platforms";
import { parsePublicUrl } from "@/lib/public-url";

export type ClassifiedLink = {
  ok: true;
  normalized: string;
  href: string;
  toolName: string;
  source: string;
  detail: string;
};

export type ClassifyResult =
  | ClassifiedLink
  | { ok: false; message: string };

const TOOLS = {
  universal: { href: "/gif-downloader", name: "Universal GIF downloader" },
  twitter: { href: "/twitter-gif-downloader", name: "Twitter Gif Downloader" },
  pinterest: { href: "/pinterest-gif-downloader", name: "Pinterest GIF downloader" },
  discord: { href: "/discord-gif-downloader", name: "Discord GIF downloader" },
} as const;

export function classifyUrl(raw: string): ClassifyResult {
  const parsed = parsePublicUrl(raw);
  if (!parsed.ok) return parsed;

  const hostname = parsed.url.hostname.toLowerCase().replace(/^www\./, "");
  const path = parsed.url.pathname;

  if (hostMatches(hostname, [...platforms.twitter.hosts])) {
    const id = path.match(/\/status(?:es)?\/(\d+)/)?.[1];
    if (!id) {
      return {
        ok: false,
        message:
          "That is an X link, but not a post. Open the post and copy its status link.",
      };
    }
    return {
      ok: true,
      normalized: parsed.normalized,
      href: TOOLS.twitter.href,
      toolName: TOOLS.twitter.name,
      source: "X post",
      detail: `Post ${id}. ${platforms.twitter.note}`,
    };
  }

  if (hostMatches(hostname, [...platforms.pinterest.hosts])) {
    const id = path.match(/\/pin\/(\d+)/)?.[1];
    const short = hostname === "pin.it" || hostname.endsWith(".pin.it");
    return {
      ok: true,
      normalized: parsed.normalized,
      href: TOOLS.pinterest.href,
      toolName: TOOLS.pinterest.name,
      source: short ? "Pinterest short link" : "Pinterest",
      detail: id
        ? `Pin ${id}. Look for originals, 736x, and 564x when the file is fetched.`
        : "Short pin.it links need a redirect before the pin id is known.",
    };
  }

  if (hostMatches(hostname, [...platforms.tenor.hosts])) {
    return {
      ok: true,
      normalized: parsed.normalized,
      href: TOOLS.discord.href,
      toolName: TOOLS.discord.name,
      source: "Tenor",
      detail:
        "Tenor is what Discord’s GIF picker uses. A GIF and an MP4 are often both available.",
    };
  }

  if (hostMatches(hostname, [...platforms.giphy.hosts])) {
    const id = path.split("/").filter(Boolean).at(-1);
    return {
      ok: true,
      normalized: parsed.normalized,
      href: TOOLS.discord.href,
      toolName: TOOLS.discord.name,
      source: "Giphy",
      detail: id
        ? `Giphy id “${id}” is the last part of the slug.`
        : "Open the Giphy GIF page so the id is in the link.",
    };
  }

  if (hostMatches(hostname, [...platforms.discord.hosts])) {
    return {
      ok: true,
      normalized: parsed.normalized,
      href: TOOLS.discord.href,
      toolName: TOOLS.discord.name,
      source: "Discord CDN",
      detail:
        "CDN links include a signature that expires. If this one fails later, copy a fresh link from Discord.",
    };
  }

  if (
    hostMatches(hostname, [...discordPageHosts]) &&
    !hostMatches(hostname, [...platforms.discord.hosts])
  ) {
    return {
      ok: false,
      message:
        "Discord server links are not public pages. Copy the GIF attachment link, or a Tenor or Giphy link.",
    };
  }

  const file = path.split("/").pop()?.toLowerCase() ?? "";
  if (file.endsWith(".gif")) {
    return {
      ok: true,
      normalized: parsed.normalized,
      href: TOOLS.universal.href,
      toolName: TOOLS.universal.name,
      source: "Direct GIF",
      detail: "This link already points at a .gif file.",
    };
  }

  return {
    ok: true,
    normalized: parsed.normalized,
    href: TOOLS.universal.href,
    toolName: TOOLS.universal.name,
    source: "Web page",
    detail:
      "Any public page can be checked here. Pages that draw images only with JavaScript may hide some files from the HTML.",
  };
}

function hostMatches(hostname: string, candidates: string[]): boolean {
  return candidates.some(
    (candidate) =>
      hostname === candidate || hostname.endsWith(`.${candidate}`),
  );
}
