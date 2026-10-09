import { connection } from "next/server";
import { mediaPolicy } from "@/config/platforms";
import { mimeFor } from "@/lib/extract/collect";
import { allow, clientIp } from "@/lib/security/rate-limit";
import { verifyProxyToken } from "@/lib/security/sign";
import { FetchError, requestPublic } from "@/lib/security/ssrf";

export async function GET(request: Request) {
  await connection();
  if (!allow(`proxy:${clientIp(request)}`, 80, 10 * 60 * 1000)) {
    return Response.json(
      { error: "Too many downloads. Wait a minute and try again." },
      { status: 429 },
    );
  }

  const token = new URL(request.url).searchParams.get("token") ?? "";
  const inline = new URL(request.url).searchParams.get("inline") === "1";
  let target = "";
  try {
    target = verifyProxyToken(token);
  } catch (error) {
    const message = error instanceof Error ? error.message : "That download link is not valid.";
    const status = message.includes("not configured") ? 500 : 400;
    return Response.json({ error: message }, { status });
  }

  try {
    const opened = await requestPublic(target);
    const length = Number(
      opened.response.headers.get("content-length") ??
        opened.response.headers.get("content-range")?.split("/")[1],
    );
    if (Number.isFinite(length) && length > mediaPolicy.proxyMaxBytes) {
      await opened.response.body?.cancel();
      throw new FetchError("That file is larger than 50 MB.");
    }
    const reader = opened.response.body?.getReader();
    if (!reader) throw new FetchError("That file was empty.");
    const first = await reader.read();
    const head = first.value ?? new Uint8Array();
    const header = opened.response.headers.get("content-type") ?? "";
    const mime = mimeFor(head, header);
    if (!mime) {
      await reader.cancel();
      throw new FetchError("That file type cannot be downloaded.");
    }

    let sent = head.byteLength;
    let usedFirst = false;
    const stream = new ReadableStream<Uint8Array>({
      async pull(controller) {
        if (!usedFirst) {
          usedFirst = true;
          if (head.byteLength > 0) controller.enqueue(head);
          if (first.done) controller.close();
          return;
        }
        const next = await reader.read();
        if (next.done || !next.value) {
          controller.close();
          return;
        }
        sent += next.value.byteLength;
        if (sent > mediaPolicy.proxyMaxBytes) {
          await reader.cancel();
          controller.error(new Error("too big"));
          return;
        }
        controller.enqueue(next.value);
      },
    });

    const filename = filenameFrom(opened.finalUrl, mime);
    return new Response(stream, {
      headers: {
        "content-type": mime,
        "content-disposition": `${inline ? "inline" : "attachment"}; filename="${filename}"`,
        "cache-control": "no-store",
        "x-content-type-options": "nosniff",
      },
    });
  } catch (error) {
    const message = error instanceof FetchError ? error.message : "That file could not be downloaded.";
    return Response.json({ error: message }, { status: 400 });
  }
}

function filenameFrom(url: string, mime: string) {
  let base = "download";
  try {
    base = decodeURIComponent(new URL(url).pathname.split("/").pop() || "download");
  } catch {
    base = "download";
  }
  base = base.replace(/[^a-zA-Z0-9._-]/g, "").slice(0, 80) || "download";
  if (base.includes(".")) return base;
  if (mime.includes("gif")) return `${base}.gif`;
  if (mime.includes("png")) return `${base}.png`;
  if (mime.includes("webp")) return `${base}.webp`;
  if (mime.includes("mp4")) return `${base}.mp4`;
  if (mime.includes("webm")) return `${base}.webm`;
  return `${base}.jpg`;
}
