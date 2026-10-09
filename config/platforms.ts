/**
 * Platform URL patterns, size limits, and export presets.
 * Update numbers here when a platform changes its rules.
 */

export const mediaPolicy = {
  /** Images and GIFs a visitor can open in a maker. */
  imageMaxBytes: 25 * 1024 * 1024,
  /** Video a visitor can open in a maker. */
  videoMaxBytes: 100 * 1024 * 1024,
  /** Largest file the download proxy will stream. */
  proxyMaxBytes: 50 * 1024 * 1024,
  htmlMaxBytes: 5 * 1024 * 1024,
  timeoutMs: 10_000,
  maxRedirects: 5,
  /** Show a warning in makers above this many frames. */
  frameWarning: 300,
  fpsMin: 5,
  fpsMax: 50,
  colorsMin: 2,
  colorsMax: 256,
  proxyContentTypes: [
    "image/gif",
    "image/webp",
    "image/png",
    "image/jpeg",
    "video/mp4",
    "video/webm",
  ],
} as const;

export const exportPresets = [
  { id: "square-512", label: "Square 512", width: 512, height: 512 },
  { id: "square-480", label: "Square 480", width: 480, height: 480 },
  { id: "discord-emoji", label: "Discord emoji", width: 128, height: 128 },
  { id: "twitch-emote", label: "Twitch emote", width: 112, height: 112 },
  { id: "story", label: "Story", width: 1080, height: 1920 },
  { id: "banner-728", label: "Banner 728×90", width: 728, height: 90 },
  { id: "banner-468", label: "Banner 468×60", width: 468, height: 60 },
] as const;

export const platforms = {
  twitter: {
    label: "X",
    /** Status links we accept. Matching is exact host or a subdomain. */
    hosts: [
      "twitter.com",
      "x.com",
      "mobile.twitter.com",
      "fxtwitter.com",
      "vxtwitter.com",
    ],
    note: "X stores GIFs as MP4 files with the animated_gif media type.",
  },
  pinterest: {
    label: "Pinterest",
    hosts: ["pinterest.com", "pin.it"],
    /** Path segments Pinterest uses for the same image at different widths. */
    resolutions: ["originals", "736x", "564x"],
  },
  discord: {
    label: "Discord",
    hosts: ["cdn.discordapp.com", "media.discordapp.net"],
    /** Display size Discord uses for custom emoji. */
    emoji: { width: 128, height: 128 },
    /**
     * Size target for a Discord-ready export.
     * Discord's upload cap can change; this is the default we optimize toward.
     */
    emojiMaxBytes: 256 * 1024,
  },
  tenor: {
    label: "Tenor",
    hosts: ["tenor.com"],
  },
  giphy: {
    label: "Giphy",
    hosts: ["giphy.com"],
  },
  twitch: {
    label: "Twitch",
    emote: { width: 112, height: 112 },
  },
} as const;

/** Hosts that look like Discord but are not a public GIF file. */
export const discordPageHosts = ["discord.com", "discordapp.com"] as const;
