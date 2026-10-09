import { exportPresets, mediaPolicy, platforms } from "@/config/platforms";
import { formatBytes } from "@/lib/format";

export function PlatformLimits() {
  const rows = [
    ["Discord emoji", `${platforms.discord.emoji.width}×${platforms.discord.emoji.height}`, formatBytes(platforms.discord.emojiMaxBytes)],
    ["Twitch emote", `${platforms.twitch.emote.width}×${platforms.twitch.emote.height}`, "Set by Twitch for that emote slot"],
    ...exportPresets
      .filter((preset) => preset.id === "story" || preset.id.startsWith("banner"))
      .map((preset) => [preset.label, `${preset.width}×${preset.height}`, "No single file cap in Gif Downloader"]),
    ["Image or GIF opened in a maker", "Any", formatBytes(mediaPolicy.imageMaxBytes)],
    ["Video opened in a maker", "Any", formatBytes(mediaPolicy.videoMaxBytes)],
    ["File streamed by the downloader", "Any", formatBytes(mediaPolicy.proxyMaxBytes)],
  ];

  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        <caption className="film-label mb-3 text-left text-muted">
          Sizes and caps from the platform config
        </caption>
        <thead>
          <tr className="border-b border-line">
            <th className="py-2 pr-4 font-semibold">Use</th>
            <th className="py-2 pr-4 font-semibold">Pixels</th>
            <th className="py-2 font-semibold">File</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-b border-line">
              {row.map((cell, index) => (
                <td key={`${row[0]}-${index}`} className="py-2 pr-4 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
