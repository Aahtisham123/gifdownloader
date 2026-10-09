import { load } from "cheerio";
import { discordPageHosts, mediaPolicy, platforms } from "@/config/platforms";
import { parsePublicUrl } from "@/lib/public-url";
import { FetchError, fetchPublic, readPrefix } from "@/lib/security/ssrf";

export type MediaType = "gif" | "mp4" | "webm" | "webp" | "image" | "stream";

export type FoundMedia = {
  type: MediaType;
  url: string;
  label: string;
  note?: string;
  width?: number;
  height?: number;
  sizeBytes?: number;
};

const PROBE_LIMIT = 8;
const ITEM_LIMIT = 24;

export async function extractMedia(raw: string) {
  const parsed = parsePublicUrl(raw);
  if (!parsed.ok) throw new FetchError(parsed.message);
  const url = parsed.url;
  const host = url.hostname.toLowerCase().replace(/^www\./, "");

  if (
    hostMatches(host, [...discordPageHosts]) &&
    !hostMatches(host, [...platforms.discord.hosts])
  ) {
    throw new FetchError(
      "Discord server links are not public files. Paste the attachment link, or a Tenor or Giphy link.",
    );
  }
  if (hostMatches(host, [...platforms.twitter.hosts])) return extractTwitter(url);
  if (hostMatches(host, [...platforms.pinterest.hosts])) return extractPinterest(url);
  if (hostMatches(host, [...platforms.tenor.hosts])) return extractTenor(url.toString());
  if (hostMatches(host, [...platforms.giphy.hosts])) return extractGiphy(url);
  if (hostMatches(host, [...platforms.discord.hosts])) {
    return {
      items: await settle([
        describe(url.toString(), kindFromPath(url.pathname), "Discord file. CDN links expire, so copy a fresh one if this fails."),
      ]),
    };
  }

  const hinted = kindFromPath(url.pathname);
  if (hinted === "stream") {
    return {
      items: [] as FoundMedia[],
      notice: "That link is a video stream, not a file you can save.",
    };
  }
  if (hinted) return { items: await settle([describe(url.toString(), hinted)]) };
  return extractHtml(url.toString());
}

async function extractTwitter(url: URL) {
  const id = url.pathname.match(/\/status(?:es)?\/(\d+)/)?.[1];
  if (!id) {
    throw new FetchError("That is an X link, but not a post. Open the post and copy its status link.");
  }
  const token = ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, "");
  let data: unknown;
  try {
    data = await readJson(
      `https://cdn.syndication.twimg.com/tweet-result?id=${encodeURIComponent(id)}&token=${encodeURIComponent(token)}`,
    );
  } catch {
    try {
      data = await readJson(`https://api.fxtwitter.com/status/${encodeURIComponent(id)}`);
    } catch {
      throw new FetchError("That post could not be read. It may be private, deleted, or unavailable.");
    }
  }
  const items = twitterItems(data);
  if (items.length === 0) {
    return {
      items: [] as FoundMedia[],
      notice: "That post did not include a GIF, video, or image.",
    };
  }
  return { items: await settle(items.map((item) => describe(item.url, item.type, item.note, item))) };
}

function twitterItems(data: unknown) {
  const found: FoundMedia[] = [];
  const root = record(data);
  const details = [
    ...array(root?.mediaDetails),
    ...array(record(root?.tweet)?.mediaDetails),
  ];
  for (const entry of details) {
    const media = record(entry);
    if (!media) continue;
    const info = record(media.video_info);
    const variants = array(info?.variants)
      .map(record)
      .filter((variant): variant is Record<string, unknown> => variant !== null)
      .filter((variant) => variant.content_type === "video/mp4" && typeof variant.url === "string")
      .sort((a, b) => number(b.bitrate) - number(a.bitrate));
    const best = variants[0];
    const size = record(media.original_info);
    if (best && typeof best.url === "string") {
      found.push({
        type: "mp4",
        url: best.url,
        label: "MP4",
        note: platforms.twitter.note,
        width: number(size?.width) || undefined,
        height: number(size?.height) || undefined,
      });
    }
    if (typeof media.media_url_https === "string") {
      found.push({
        type: kindFromPath(new URL(media.media_url_https).pathname) ?? "image",
        url: media.media_url_https,
        label: "Preview image",
        width: number(size?.width) || undefined,
        height: number(size?.height) || undefined,
      });
    }
  }

  const tweet = record(root?.tweet) ?? root;
  const media = record(tweet?.media);
  for (const entry of array(media?.all ?? media?.videos ?? media?.photos)) {
    const item = record(entry);
    if (!item) continue;
    const url = string(item.url) ?? string(item.thumbnail_url);
    if (!url) continue;
    const type = item.type === "gif" || item.type === "video" ? "mp4" : kindFromPath(safePath(url)) ?? "image";
    found.push({
      type,
      url,
      label: type === "mp4" ? "MP4" : "Image",
      note: type === "mp4" ? platforms.twitter.note : undefined,
      width: number(item.width) || undefined,
      height: number(item.height) || undefined,
    });
  }

  if (found.length === 0) {
    for (const url of walkUrls(data)) {
      if (!/twimg\.com|fxtwitter\.com|vxtwitter\.com/i.test(url)) continue;
      const type = kindFromPath(safePath(url));
      if (!type || type === "stream") continue;
      found.push({
        type,
        url,
        label: labelFor(type),
        note: type === "mp4" ? platforms.twitter.note : undefined,
      });
    }
  }
  return dedupe(found);
}

async function extractPinterest(url: URL) {
  const page = await extractHtml(url.toString());
  const expanded: FoundMedia[] = [];
  for (const item of page.items) {
    if (!/pinimg\.com/i.test(item.url)) {
      expanded.push(item);
      continue;
    }
    for (const size of platforms.pinterest.resolutions) {
      const variant = item.url.replace(/\/(?:originals|\d+x)\//, `/${size}/`);
      expanded.push({
        ...item,
        url: variant,
        label: `Pinterest ${size}`,
      });
    }
    if (!/\/(?:originals|\d+x)\//.test(item.url)) expanded.push(item);
  }
  const items = dedupe(expanded).slice(0, ITEM_LIMIT);
  const streams = items.filter((item) => item.type === "stream");
  return {
    items: items.filter((item) => item.type !== "stream"),
    notice:
      streams.length > 0
        ? "A video stream was found. Streams are not saved as MP4 files."
        : page.notice,
  };
}

async function extractTenor(pageUrl: string) {
  const html = await fetchPublic(pageUrl, mediaPolicy.htmlMaxBytes);
  const text = new TextDecoder().decode(html.body).replace(/\\\//g, "/");
  const urls = [...text.matchAll(/https?:\/\/(?:media|c)\.tenor\.com\/[^"'\s<>]+/g)].map((match) =>
    match[0].replace(/\\u0026/g, "&").replace(/["'),]+$/g, ""),
  );
  const items = await describeMany([...new Set(urls)].slice(0, 12));
  return {
    items,
    notice:
      items.length === 0
        ? "No Tenor file was found on that page. Open the GIF and copy the media link."
        : "Tenor usually offers both a GIF and an MP4.",
  };
}

async function extractGiphy(url: URL) {
  const id = giphyId(url);
  const seeds: string[] = [];
  if (id) {
    seeds.push(
      `https://media.giphy.com/media/${id}/giphy.gif`,
      `https://media.giphy.com/media/${id}/giphy.mp4`,
      `https://i.giphy.com/media/${id}/giphy.webp`,
    );
  }
  try {
    const html = await fetchPublic(url.toString(), mediaPolicy.htmlMaxBytes);
    const text = new TextDecoder().decode(html.body).replace(/\\\//g, "/");
    for (const match of text.matchAll(/https?:\/\/(?:media|i)\.giphy\.com\/[^"'\s<>]+/g)) {
      seeds.push(match[0]);
    }
  } catch {
    if (seeds.length === 0) throw new FetchError("That Giphy page could not be read.");
  }
  const items = await describeMany([...new Set(seeds)].slice(0, 8));
  return {
    items,
    notice: items.length === 0 ? "No Giphy file was found for that link." : undefined,
  };
}

async function extractHtml(pageUrl: string) {
  const fetched = await fetchPublic(pageUrl, mediaPolicy.htmlMaxBytes);
  const sniffed = sniff(fetched.body, fetched.contentType);
  if (sniffed && sniffed !== "html") {
    const item = await describe(fetched.finalUrl, sniffed);
    return { items: item ? [item] : [] };
  }
  const html = new TextDecoder().decode(fetched.body);
  const $ = load(html);
  const urls: string[] = [];
  const add = (value: string | undefined) => {
    const next = absolute(fetched.finalUrl, value);
    if (next) urls.push(next);
  };

  $("img").each((_, element) => {
    const node = $(element);
    add(node.attr("src"));
    add(node.attr("data-src"));
    add(node.attr("data-lazy-src"));
    add(node.attr("data-original"));
    for (const part of srcset(node.attr("srcset"))) add(part);
  });
  $("source, video").each((_, element) => {
    const node = $(element);
    add(node.attr("src"));
    for (const part of srcset(node.attr("srcset"))) add(part);
  });
  $("meta").each((_, element) => {
    const node = $(element);
    const key = `${node.attr("property") ?? ""} ${node.attr("name") ?? ""}`.toLowerCase();
    if (key.includes("og:image") || key.includes("og:video") || key.includes("twitter:image")) {
      add(node.attr("content"));
    }
  });
  $("a[href]").each((_, element) => add($(element).attr("href")));
  $("[style]").each((_, element) => {
    for (const match of ($(element).attr("style") ?? "").matchAll(/url\(([^)]+)\)/g)) {
      add(match[1]?.replace(/^['"]|['"]$/g, ""));
    }
  });
  $("script[type='application/ld+json']").each((_, element) => {
    try {
      for (const found of walkUrls(JSON.parse($(element).text()))) urls.push(found);
    } catch {
      /* Ignore broken JSON-LD. */
    }
  });

  const unique = [...new Set(urls)].slice(0, 40);
  const direct = unique.filter((item) => {
    const kind = kindFromPath(safePath(item));
    return kind && kind !== "gif" && kind !== "webp" && kind !== "stream";
  });
  const probes = unique.filter((item) => !direct.includes(item)).slice(0, PROBE_LIMIT);
  const probed = await describeMany(probes);
  const trusted: FoundMedia[] = [];
  for (const item of direct) {
    const type = kindFromPath(safePath(item));
    if (!type || type === "stream") continue;
    trusted.push({ type, url: item, label: labelFor(type) });
  }
  const items = dedupe([...probed, ...trusted]).slice(0, ITEM_LIMIT);

  return {
    items,
    notice:
      items.length === 0
        ? "No media was found in the public HTML. If the page draws images with JavaScript, open the file and paste that link."
        : undefined,
  };
}

async function describeMany(urls: string[]) {
  return settle(urls.map((url) => describe(url, kindFromPath(safePath(url)))));
}

async function describe(
  url: string,
  hinted: MediaType | null,
  note?: string,
  extra?: Partial<FoundMedia>,
): Promise<FoundMedia | null> {
  const parsed = parsePublicUrl(url);
  if (!parsed.ok) return null;
  try {
    const prefix = await readPrefix(parsed.normalized);
    const sniffed = sniff(prefix.body, prefix.contentType);
    if (sniffed === "html") return null;
    const type = sniffed ?? hinted;
    if (!type || type === "stream") {
      if (hinted === "stream") {
        return {
          type: "stream",
          url: parsed.normalized,
          label: "Video stream",
          note: "This is a stream, not a file.",
        };
      }
      return null;
    }
    if (hinted === "gif" && sniffed && sniffed !== "gif") return null;
    const animated = type === "webp" && isAnimatedWebp(prefix.body);
    return {
      type,
      url: prefix.finalUrl,
      label: extra?.label ?? labelFor(type),
      note: note ?? (animated ? "Animated WebP" : extra?.note),
      width: extra?.width,
      height: extra?.height,
      sizeBytes: prefix.size,
    };
  } catch (error) {
    if (error instanceof FetchError && /not found|private|expired/i.test(error.message)) return null;
    if (!hinted || hinted === "stream") return null;
    return {
      type: hinted,
      url: parsed.normalized,
      label: extra?.label ?? labelFor(hinted),
      note: note ?? "The file header was not checked.",
      width: extra?.width,
      height: extra?.height,
    };
  }
}

async function settle(tasks: Promise<FoundMedia | null>[]) {
  const result = await Promise.all(tasks);
  return dedupe(result.filter((item): item is FoundMedia => item !== null));
}

function sniff(data: Uint8Array, contentType: string): MediaType | "html" | null {
  const head = ascii(data, 16);
  if (head.startsWith("GIF87a") || head.startsWith("GIF89a")) return "gif";
  if (ascii(data, 4) === "RIFF" && ascii(data.slice(8), 4) === "WEBP") return "webp";
  if (data[0] === 0x89 && ascii(data.slice(1), 3) === "PNG") return "image";
  if (data[0] === 0xff && data[1] === 0xd8) return "image";
  if (ascii(data.slice(4), 4) === "ftyp") return "mp4";
  if (data[0] === 0x1a && data[1] === 0x45 && data[2] === 0xdf && data[3] === 0xa3) return "webm";
  if (head.trim().startsWith("<!") || head.trim().startsWith("<ht")) return "html";
  if (contentType.includes("gif")) return "gif";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("png") || contentType.includes("jpeg")) return "image";
  if (contentType.includes("mp4")) return "mp4";
  if (contentType.includes("webm")) return "webm";
  if (contentType.includes("html")) return "html";
  return null;
}

function isAnimatedWebp(data: Uint8Array) {
  return ascii(data.slice(12), 4) === "VP8X" && data.length > 20 && (data[20] & 0x02) !== 0;
}

function kindFromPath(pathname: string): MediaType | null {
  const path = pathname.toLowerCase();
  if (path.endsWith(".gif")) return "gif";
  if (path.endsWith(".mp4")) return "mp4";
  if (path.endsWith(".webm")) return "webm";
  if (path.endsWith(".webp")) return "webp";
  if (/\.(png|jpe?g)$/.test(path)) return "image";
  if (path.endsWith(".m3u8")) return "stream";
  return null;
}

function labelFor(type: MediaType) {
  if (type === "gif") return "GIF";
  if (type === "mp4") return "MP4";
  if (type === "webm") return "WebM";
  if (type === "webp") return "WebP";
  if (type === "stream") return "Stream";
  return "Image";
}

function giphyId(url: URL) {
  const media = url.pathname.match(/\/media\/([^/]+)/);
  if (media?.[1] && media[1] !== "media") return media[1];
  const last = url.pathname.split("/").filter(Boolean).at(-1);
  const id = last?.split("-").pop()?.replace(/\.(gif|mp4|webp)$/i, "");
  return id && /^[A-Za-z0-9]+$/.test(id) ? id : null;
}

function absolute(base: string, value: string | undefined) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.startsWith("data:") || trimmed.startsWith("blob:")) return null;
  try {
    const url = new URL(trimmed, base);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (url.toString().length > 2000) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function srcset(value: string | undefined) {
  if (!value) return [];
  return value
    .split(",")
    .map((part) => part.trim().split(/\s+/)[0])
    .filter((part): part is string => Boolean(part));
}

function dedupe(items: FoundMedia[]) {
  const seen = new Set<string>();
  const unique: FoundMedia[] = [];
  for (const item of items) {
    if (seen.has(item.url)) continue;
    seen.add(item.url);
    unique.push(item);
  }
  return unique;
}

function walkUrls(value: unknown, depth = 0, into = new Set<string>()): string[] {
  if (depth > 6 || value == null) return [...into];
  if (typeof value === "string") {
    if (/^https?:\/\//.test(value)) into.add(value);
    return [...into];
  }
  if (Array.isArray(value)) {
    for (const entry of value) walkUrls(entry, depth + 1, into);
    return [...into];
  }
  if (typeof value === "object") {
    for (const entry of Object.values(value)) walkUrls(entry, depth + 1, into);
  }
  return [...into];
}

async function readJson(url: string) {
  const fetched = await fetchPublic(url, mediaPolicy.htmlMaxBytes);
  return JSON.parse(new TextDecoder().decode(fetched.body)) as unknown;
}

function record(value: unknown) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function array(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function string(value: unknown) {
  return typeof value === "string" ? value : null;
}

function number(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function safePath(url: string) {
  try {
    return new URL(url).pathname;
  } catch {
    return "";
  }
}

function ascii(data: Uint8Array, length: number) {
  let text = "";
  for (let index = 0; index < length && index < data.length; index += 1) {
    text += String.fromCharCode(data[index] ?? 0);
  }
  return text;
}

export function mimeFor(data: Uint8Array, header: string) {
  const allowed = new Set<string>(mediaPolicy.proxyContentTypes);
  const normalized = header.split(";")[0]?.trim().toLowerCase() ?? "";
  const kind = sniff(data, normalized);
  if (kind === "html" || kind === "stream") return null;
  if (allowed.has(normalized)) return normalized;
  if (kind === "gif") return "image/gif";
  if (kind === "webp") return "image/webp";
  if (kind === "image") return data[0] === 0x89 ? "image/png" : "image/jpeg";
  if (kind === "mp4") return "video/mp4";
  if (kind === "webm") return "video/webm";
  return null;
}

function hostMatches(hostname: string, candidates: string[]) {
  return candidates.some(
    (candidate) => hostname === candidate || hostname.endsWith(`.${candidate}`),
  );
}
