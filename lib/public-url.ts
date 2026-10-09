/**
 * Syntactic checks for a public http(s) URL.
 * This does not resolve DNS. The download server must re-check the
 * address, including every redirect, before it fetches anything.
 */

const BLOCKED_HOSTS = new Set([
  "localhost",
  "localhost.localdomain",
  "0.0.0.0",
  "::1",
  "metadata.google.internal",
]);

export type PublicUrlResult =
  | { ok: true; url: URL; normalized: string }
  | { ok: false; message: string };

export function parsePublicUrl(raw: string): PublicUrlResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, message: "Paste a link first." };
  }
  if (trimmed.length > 2000) {
    return { ok: false, message: "That link is too long to check." };
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return {
      ok: false,
      message: "That is not a full link. Include the https:// part.",
    };
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { ok: false, message: "Only http and https links can be checked." };
  }
  if (url.username || url.password) {
    return {
      ok: false,
      message: "Links with a username or password are not accepted.",
    };
  }

  const hostname = url.hostname.toLowerCase().replace(/\.$/, "");
  if (!hostname || hostname.includes(" ")) {
    return { ok: false, message: "That link is missing a host name." };
  }
  if (isBlockedHost(hostname)) {
    return {
      ok: false,
      message:
        "That address is local or private. Gif Downloader only checks public links.",
    };
  }

  url.hash = "";
  const normalized = url.toString();
  return { ok: true, url, normalized };
}

function isBlockedHost(hostname: string): boolean {
  if (BLOCKED_HOSTS.has(hostname)) return true;
  if (hostname.endsWith(".localhost") || hostname.endsWith(".local")) {
    return true;
  }
  if (hostname.includes(":")) return isBlockedIpv6(hostname);
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) return isBlockedIpv4(hostname);
  return false;
}

function isBlockedIpv4(hostname: string): boolean {
  const parts = hostname.split(".").map((part) => Number(part));
  if (parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return true;
  }
  const [a, b] = parts;
  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  if (a === 198 && (b === 18 || b === 19)) return true;
  return false;
}

function isBlockedIpv6(hostname: string): boolean {
  const host = hostname.replace(/^\[|\]$/g, "");
  if (host === "::1" || host === "::") return true;
  const head = host.split(":")[0] ?? "";
  const value = Number.parseInt(head, 16);
  if (Number.isNaN(value)) return true;
  // fc00::/7 unique local, fe80::/10 link-local
  if ((value & 0xfe00) === 0xfc00) return true;
  if ((value & 0xffc0) === 0xfe80) return true;
  // IPv4-mapped addresses are rejected rather than reinterpreted here.
  if (host.startsWith("::ffff:")) return true;
  return false;
}
