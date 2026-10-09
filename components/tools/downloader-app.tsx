"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import JSZip from "jszip";
import type { Tool } from "@/config/tools";
import { formatBytes } from "@/lib/format";
import { classifyUrl } from "@/lib/classify-url";
import { downloadBlob, safeFilename } from "@/lib/gif/download";
import { mp4BlobToGif } from "@/lib/gif/ffmpeg";

type Item = {
  id: string;
  type: "gif" | "mp4" | "webm" | "webp" | "image" | "stream";
  label: string;
  note?: string;
  width?: number;
  height?: number;
  sizeBytes?: number;
  filename: string;
  downloadUrl?: string;
};

export function DownloaderApp({ tool, initialUrl }: { tool: Tool; initialUrl: string }) {
  const [draft, setDraft] = useState(initialUrl);
  const [items, setItems] = useState<Item[]>([]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter] = useState("all");
  const [minKb, setMinKb] = useState(0);
  const [hint, setHint] = useState("");
  const [status, setStatus] = useState("");
  const [convertId, setConvertId] = useState("");
  const [fps, setFps] = useState(12);
  const [width, setWidth] = useState(480);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);

  const search = useCallback(async (value: string, signal?: AbortSignal) => {
    const classified = classifyUrl(value);
    if (!classified.ok) {
      setHint("");
      setError(classified.message);
      setItems([]);
      return;
    }
    setHint(
      classified.href === tool.href
        ? classified.detail
        : `${classified.detail} This link also has a dedicated page.`,
    );
    setError("");
    setLoading(true);
    setStatus("");
    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: classified.normalized }),
        signal,
      });
      const data = (await response.json()) as { items?: Item[]; notice?: string; error?: string };
      if (!response.ok) throw new Error(data.error || "That page could not be read.");
      const next = data.items ?? [];
      setItems(next);
      setNotice(data.notice ?? "");
      setSelected(next.filter((item) => item.downloadUrl).map((item) => item.id));
    } catch (caught) {
      if (signal?.aborted) return;
      setItems([]);
      setError(caught instanceof Error ? caught.message : "That page could not be read.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [tool.href]);

  useEffect(() => {
    if (!initialUrl) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void search(initialUrl, controller.signal);
    }, 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [initialUrl, search]);

  const visible = useMemo(
    () =>
      items.filter((item) => {
        if (filter === "gif" && item.type !== "gif" && item.type !== "webp") return false;
        if (filter === "video" && item.type !== "mp4" && item.type !== "webm") return false;
        if (filter === "image" && item.type !== "image") return false;
        if (filter === "animated" && !["gif", "mp4", "webm", "webp"].includes(item.type)) return false;
        if (minKb > 0 && item.sizeBytes && item.sizeBytes < minKb * 1024) return false;
        return true;
      }),
    [filter, items, minKb],
  );

  async function saveOne(item: Item) {
    if (!item.downloadUrl) return;
    setStatus("Downloading…");
    try {
      const blob = await fetchBlob(item.downloadUrl);
      downloadBlob(blob, item.filename);
      setStatus(`Saved ${item.filename}.`);
    } catch (caught) {
      setStatus(caught instanceof Error ? caught.message : "That file could not be saved.");
    }
  }

  async function saveZip() {
    const chosen = visible.filter((item) => selected.includes(item.id) && item.downloadUrl);
    if (chosen.length === 0) {
      setStatus("Select at least one file.");
      return;
    }
    setStatus("Packing a zip…");
    try {
      const zip = new JSZip();
      for (const item of chosen) {
        const blob = await fetchBlob(item.downloadUrl ?? "");
        zip.file(item.filename, blob);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      downloadBlob(blob, "framepop-media.zip");
      setStatus(`Saved ${chosen.length} files.`);
    } catch (caught) {
      setStatus(caught instanceof Error ? caught.message : "The zip could not be saved.");
    }
  }

  async function convert(item: Item) {
    if (!item.downloadUrl) return;
    setStatus("Loading the video converter…");
    try {
      const source = await fetchBlob(item.downloadUrl);
      const gif = await mp4BlobToGif(
        source,
        { fps, width, start, end },
        (ratio) => setStatus(`Converting ${Math.round(ratio * 100)}%`),
      );
      downloadBlob(gif, safeFilename(item.filename.replace(/\.[^.]+$/, ""), "gif"));
      setStatus(`Saved ${formatBytes(gif.size)}.`);
    } catch {
      setStatus("The video converter could not run. You can still download the MP4.");
    }
  }

  const classified = draft.trim() ? classifyUrl(draft) : null;

  return (
    <div className="space-y-4">
      <form
        className="rounded-xl border border-line bg-card p-4"
        onSubmit={(event) => {
          event.preventDefault();
          void search(draft);
        }}
      >
        <label htmlFor="media-url" className="text-sm font-medium">
          Public link
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            id="media-url"
            className="field"
            type="url"
            inputMode="url"
            placeholder="https://"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Looking…" : "Find media"}
          </button>
        </div>
        <p className="mt-2 text-sm text-muted">
          Only download files you own or have permission to use.
        </p>
      </form>

      {error ? (
        <p className="text-sm text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}
      {hint ? <p className="text-sm text-muted">{hint}</p> : null}
      {classified?.ok && classified.href !== tool.href ? (
        <p className="text-sm">
          <Link className="font-medium underline" href={`${classified.href}?url=${encodeURIComponent(classified.normalized)}`}>
            Open {classified.toolName}
          </Link>
        </p>
      ) : null}
      {notice ? <p className="text-sm text-muted">{notice}</p> : null}

      {items.length > 0 ? (
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-sm">
            Show
            <select className="field mt-1" value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="all">Everything</option>
              <option value="animated">Animated</option>
              <option value="gif">GIFs and WebP</option>
              <option value="video">Video</option>
              <option value="image">Images</option>
            </select>
          </label>
          <label className="text-sm">
            Minimum KB
            <input
              className="field mt-1 w-28"
              type="number"
              min={0}
              value={minKb}
              onChange={(event) => setMinKb(Number(event.target.value))}
            />
          </label>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setSelected(visible.filter((item) => item.downloadUrl).map((item) => item.id))}
          >
            Select visible
          </button>
          <button type="button" className="btn" onClick={() => void saveZip()}>
            Download zip
          </button>
        </div>
      ) : null}

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => (
          <li key={item.id} className="overflow-hidden rounded-xl border border-line bg-card">
            <div className="checkerboard flex aspect-video items-center justify-center">
              {item.downloadUrl && (item.type === "mp4" || item.type === "webm") ? (
                <video className="h-full w-full object-contain" src={`${item.downloadUrl}&inline=1`} muted loop playsInline controls />
              ) : item.downloadUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="h-full w-full object-contain" src={`${item.downloadUrl}&inline=1`} alt="" />
              ) : (
                <p className="px-4 text-center text-sm text-muted">{item.note}</p>
              )}
            </div>
            <div className="space-y-2 p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-muted">
                    {item.type.toUpperCase()}
                    {item.width && item.height ? ` · ${item.width}×${item.height}` : ""}
                    {item.sizeBytes ? ` · ${formatBytes(item.sizeBytes)}` : ""}
                  </p>
                </div>
                {item.downloadUrl ? (
                  <input
                    type="checkbox"
                    checked={selected.includes(item.id)}
                    aria-label={`Select ${item.filename}`}
                    onChange={(event) => {
                      setSelected((current) =>
                        event.target.checked ? [...current, item.id] : current.filter((id) => id !== item.id),
                      );
                    }}
                  />
                ) : null}
              </div>
              {item.note ? <p className="text-xs leading-5 text-muted">{item.note}</p> : null}
              {item.downloadUrl ? (
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="btn" onClick={() => void saveOne(item)}>
                    Download
                  </button>
                  {item.type === "mp4" || item.type === "webm" ? (
                    <button type="button" className="btn btn-ghost" onClick={() => setConvertId(item.id)}>
                      Convert to GIF
                    </button>
                  ) : null}
                </div>
              ) : null}
              {convertId === item.id ? (
                <div className="space-y-2 rounded-lg bg-surface p-3">
                  <label className="block text-xs">
                    Frames per second
                    <input className="field mt-1" type="number" min={5} max={30} value={fps} onChange={(event) => setFps(Number(event.target.value))} />
                  </label>
                  <label className="block text-xs">
                    Width
                    <input className="field mt-1" type="number" min={64} max={1080} value={width} onChange={(event) => setWidth(Number(event.target.value))} />
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block text-xs">
                      Start
                      <input className="field mt-1" type="number" min={0} step="0.1" value={start} onChange={(event) => setStart(Number(event.target.value))} />
                    </label>
                    <label className="block text-xs">
                      End
                      <input className="field mt-1" type="number" min={0} step="0.1" value={end} onChange={(event) => setEnd(Number(event.target.value))} />
                    </label>
                  </div>
                  <button type="button" className="btn" onClick={() => void convert(item)}>
                    Convert
                  </button>
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
      {status ? (
        <p className="text-sm text-muted" role="status">
          {status}
        </p>
      ) : null}
    </div>
  );
}

async function fetchBlob(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error || "That file could not be saved.");
  }
  return response.blob();
}
