import { z } from "zod";
import { extractMedia } from "@/lib/extract/collect";
import type { FoundMedia } from "@/lib/extract/collect";
import { allow, clientIp } from "@/lib/security/rate-limit";
import { signProxyUrl } from "@/lib/security/sign";
import { FetchError } from "@/lib/security/ssrf";

const bodySchema = z.object({
  url: z
    .string()
    .min(1)
    .max(2000)
    .transform((value) => value.trim()),
});

export async function POST(request: Request) {
  if (!allow(`extract:${clientIp(request)}`, 30, 10 * 60 * 1000)) {
    return Response.json(
      { error: "Too many requests. Wait a minute and try again." },
      { status: 429 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json({ error: "Send a link to check." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success || !parsed.data.url) {
    return Response.json({ error: "That link is not valid." }, { status: 400 });
  }

  try {
    const result = await extractMedia(parsed.data.url);
    const items = [];
    let unsigned = 0;
    for (const item of result.items) {
      const pub = publicItem(item);
      if (item.type === "stream" || !item.url) {
        items.push(pub);
        continue;
      }
      try {
        const token = signProxyUrl(item.url);
        items.push({
          ...pub,
          downloadUrl: `/api/proxy?token=${encodeURIComponent(token)}`,
        });
      } catch {
        unsigned += 1;
      }
    }
    if (unsigned > 0 && items.length === 0) {
      return Response.json(
        { error: "Downloads are not configured on this server." },
        { status: 500 },
      );
    }
    return Response.json({ items, notice: result.notice });
  } catch (error) {
    const message = error instanceof FetchError ? error.message : "That page could not be read.";
    return Response.json({ error: message }, { status: 400 });
  }
}

function publicItem(item: FoundMedia) {
  return {
    id: hash(item.url),
    type: item.type,
    label: item.label,
    note: item.note,
    width: item.width,
    height: item.height,
    sizeBytes: item.sizeBytes,
    filename: filenameFrom(item.url, item.type),
  };
}

function filenameFrom(url: string, type: string) {
  let base = "media";
  try {
    base = decodeURIComponent(new URL(url).pathname.split("/").pop() || "media");
  } catch {
    base = "media";
  }
  base = base.replace(/[^a-zA-Z0-9._-]/g, "").slice(0, 80) || "media";
  if (base.includes(".")) return base;
  const extension =
    type === "gif"
      ? "gif"
      : type === "mp4"
        ? "mp4"
        : type === "webm"
          ? "webm"
          : type === "webp"
            ? "webp"
            : "jpg";
  return `${base}.${extension}`;
}

function hash(value: string) {
  let sum = 0;
  for (let index = 0; index < value.length; index += 1) {
    sum = Math.imul(sum, 31) + value.charCodeAt(index);
  }
  return (sum >>> 0).toString(36);
}
