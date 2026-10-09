import { createHmac, timingSafeEqual } from "node:crypto";

const DEV_SECRET = "framepop-dev-proxy-secret";

function secret() {
  const value = process.env.PROXY_SIGNING_SECRET;
  if (value && value.length >= 16) return value;
  if (process.env.NODE_ENV === "development") return DEV_SECRET;
  throw new Error("Downloads are not configured on this server.");
}

export function signProxyUrl(url: string, ttlMs = 10 * 60 * 1000) {
  const payload = Buffer.from(
    JSON.stringify({ url, exp: Date.now() + ttlMs }),
    "utf8",
  ).toString("base64url");
  const mac = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${mac}`;
}

export function verifyProxyToken(token: string) {
  const [payload, mac] = token.split(".");
  if (!payload || !mac || token.split(".").length !== 2) {
    throw new Error("That download link is not valid.");
  }
  const expected = createHmac("sha256", secret()).update(payload).digest("base64url");
  const left = Buffer.from(mac);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    throw new Error("That download link is not valid.");
  }
  let data: { url?: unknown; exp?: unknown };
  try {
    data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      url?: unknown;
      exp?: unknown;
    };
  } catch {
    throw new Error("That download link is not valid.");
  }
  if (typeof data.url !== "string" || typeof data.exp !== "number" || data.exp < Date.now()) {
    throw new Error("That download link expired. Search again.");
  }
  return data.url;
}
