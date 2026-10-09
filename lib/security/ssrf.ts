import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { mediaPolicy } from "@/config/platforms";
import { parsePublicUrl } from "@/lib/public-url";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

export class FetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FetchError";
  }
}

export async function assertPublicHostname(hostname: string) {
  const host = hostname.includes(":") ? `[${hostname}]` : hostname;
  const syntactic = parsePublicUrl(`https://${host}/`);
  if (!syntactic.ok) throw new FetchError(syntactic.message);

  let records: { address: string }[];
  try {
    records = await lookup(hostname, { all: true, verbatim: true });
  } catch {
    throw new FetchError("That host could not be resolved.");
  }
  if (records.length === 0) throw new FetchError("That host could not be resolved.");
  for (const record of records) {
    if (isPrivateAddress(record.address)) {
      throw new FetchError("That address is local or private.");
    }
  }
}

export async function fetchPublic(start: string, maxBytes: number) {
  const opened = await requestPublic(start);
  const body = await readBody(opened.response, maxBytes, false);
  return {
    finalUrl: opened.finalUrl,
    contentType: contentType(opened.response),
    size: sizeFrom(opened.response.headers),
    body,
  };
}

export async function readPrefix(start: string) {
  const opened = await requestPublic(start, { Range: "bytes=0-63" });
  const body = await readBody(opened.response, 64, true);
  return {
    finalUrl: opened.finalUrl,
    contentType: contentType(opened.response),
    size: sizeFrom(opened.response.headers),
    body,
  };
}

export async function requestPublic(start: string, headers?: HeadersInit) {
  let current = start;
  let redirects = 0;
  const seen = new Set<string>();

  while (true) {
    if (seen.has(current)) throw new FetchError("That link redirected in a loop.");
    seen.add(current);
    const url = new URL(current);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new FetchError("Only http and https links can be fetched.");
    }
    if (url.username || url.password) {
      throw new FetchError("Links with a username or password are not accepted.");
    }
    await assertPublicHostname(url.hostname);

    let response: Response;
    try {
      response = await fetch(current, {
        method: "GET",
        redirect: "manual",
        headers: {
          "user-agent": USER_AGENT,
          accept: "*/*",
          ...Object.fromEntries(new Headers(headers)),
        },
        signal: AbortSignal.timeout(mediaPolicy.timeoutMs),
      });
    } catch {
      throw new FetchError("That page did not respond in time.");
    }

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      await response.body?.cancel();
      if (!location) throw new FetchError("The page redirected without a destination.");
      redirects += 1;
      if (redirects > mediaPolicy.maxRedirects) {
        throw new FetchError("That link redirected too many times.");
      }
      current = new URL(location, current).toString();
      continue;
    }

    if (response.status !== 200 && response.status !== 206) {
      await response.body?.cancel();
      if (response.status === 401 || response.status === 403) {
        throw new FetchError("That file is private or the link has expired.");
      }
      if (response.status === 404) throw new FetchError("That page was not found.");
      throw new FetchError("That page did not respond.");
    }

    return { response, finalUrl: current };
  }
}

async function readBody(response: Response, maxBytes: number, stopEarly: boolean) {
  const reader = response.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (total < maxBytes) {
    const { done, value } = await reader.read();
    if (done || !value) break;
    const room =
      total + value.byteLength <= maxBytes ? value : value.slice(0, Math.max(0, maxBytes - total));
    chunks.push(room);
    total += room.byteLength;
    if (stopEarly && total >= maxBytes) {
      await reader.cancel();
      break;
    }
  }
  if (!stopEarly && total >= maxBytes) {
    const extra = await reader.read();
    await reader.cancel();
    if (!extra.done) throw new FetchError("That file is larger than the limit.");
  }
  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

function contentType(response: Response) {
  return (response.headers.get("content-type") ?? "").split(";")[0]?.trim().toLowerCase() ?? "";
}

function sizeFrom(headers: Headers) {
  const range = headers.get("content-range");
  const total = range?.split("/")[1];
  if (total && total !== "*") {
    const parsed = Number(total);
    if (Number.isFinite(parsed)) return parsed;
  }
  const length = headers.get("content-length");
  if (!length) return undefined;
  const parsed = Number(length);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function isPrivateAddress(address: string) {
  const ip = address.toLowerCase();
  if (ip.startsWith("::ffff:")) {
    const mapped = ip.slice("::ffff:".length);
    return isIP(mapped) === 4 ? isPrivateV4(mapped) : true;
  }
  if (ip.includes(".")) return isIP(ip) !== 4 || isPrivateV4(ip);
  if (ip === "::1" || ip === "::") return true;
  const head = Number.parseInt(ip.split(":")[0] || "", 16);
  if (!Number.isFinite(head)) return true;
  if ((head & 0xfe00) === 0xfc00) return true;
  if ((head & 0xffc0) === 0xfe80) return true;
  if ((head & 0xff00) === 0xff00) return true;
  return false;
}

function isPrivateV4(hostname: string) {
  const parts = hostname.split(".").map((part) => Number(part));
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return true;
  }
  const [a, b] = parts;
  if (a === undefined || b === undefined) return true;
  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  if (a === 192 && b === 0) return true;
  if (a === 198 && (b === 18 || b === 19)) return true;
  if (a >= 224) return true;
  return false;
}
