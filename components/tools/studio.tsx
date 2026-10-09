"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import JSZip from "jszip";
import { exportPresets, mediaPolicy } from "@/config/platforms";
import { formatBytes } from "@/lib/format";
import { encodeGif } from "@/lib/gif/encode";
import type { DitherMode } from "@/lib/gif/dither";
import { downloadBlob, safeFilename } from "@/lib/gif/download";
import { rawFramesToMp4 } from "@/lib/gif/ffmpeg";

export type DrawFn = (
  ctx: CanvasRenderingContext2D,
  frame: number,
  size: { width: number; height: number },
) => void;

type StudioApi = {
  setSize: (width: number, height: number) => void;
};

export function Studio({
  draw,
  frameCount,
  filename,
  defaultWidth = 480,
  defaultHeight = 480,
  defaultFps = 12,
  transparent = false,
  warnBytes,
  onPreviewClick,
  children,
}: {
  draw: DrawFn;
  frameCount: number;
  filename: string;
  defaultWidth?: number;
  defaultHeight?: number;
  defaultFps?: number;
  transparent?: boolean;
  warnBytes?: number;
  onPreviewClick?: (color: [number, number, number]) => void;
  children?: ReactNode | ((api: StudioApi) => ReactNode);
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef(draw);
  const [width, setWidth] = useState(() => even(defaultWidth));
  const [height, setHeight] = useState(() => even(defaultHeight));
  const [ratio, setRatio] = useState(defaultHeight / Math.max(1, defaultWidth));
  const [fps, setFps] = useState(defaultFps);
  const [colors, setColors] = useState(128);
  const [dither, setDither] = useState<DitherMode>("floyd");
  const [loop, setLoop] = useState<"forever" | "once" | "count">("forever");
  const [times, setTimes] = useState(3);
  const [name, setName] = useState(filename);
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [lock, setLock] = useState(true);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const count = Math.max(1, Math.min(mediaPolicy.frameWarning, frameCount));

  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    draw(ctx, Math.min(frame, count - 1), { width, height });
  }, [draw, frame, width, height, count]);

  useEffect(() => {
    if (!playing || count < 2) return;
    let frameId = 0;
    let last = performance.now();
    const tick = (now: number) => {
      if (now - last >= 1000 / fps) {
        last = now;
        setFrame((current) => (current + 1) % count);
      }
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [playing, fps, count]);

  function setSize(nextWidth: number, nextHeight: number) {
    const w = even(nextWidth);
    const h = even(nextHeight);
    setRatio(h / w);
    setWidth(w);
    setHeight(h);
  }

  function changeWidth(value: number) {
    const w = even(value);
    setWidth(w);
    if (lock) setHeight(even(w * ratio));
    else setRatio(height / w);
  }

  function changeHeight(value: number) {
    const h = even(value);
    setHeight(h);
    if (!lock) setRatio(h / width);
  }

  function paint(index: number) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("This browser could not draw the frame.");
    ctx.clearRect(0, 0, width, height);
    drawRef.current(ctx, index, { width, height });
    return { canvas, ctx };
  }

  async function saveGif() {
    setBusy(true);
    setStatus("Encoding GIF…");
    try {
      const repeat = loop === "forever" ? 0 : loop === "once" ? -1 : Math.max(1, times);
      const bytes = await encodeGif({
        width,
        height,
        frameCount: count,
        delayMs: Math.round(1000 / fps),
        colors,
        repeat,
        transparent,
        dither,
        getFrame: (index) => paint(index).ctx.getImageData(0, 0, width, height).data,
        onProgress: (ratioDone) => setStatus(`Encoding ${Math.round(ratioDone * count)} of ${count}`),
      });
      const blob = new Blob([new Uint8Array(bytes)], { type: "image/gif" });
      downloadBlob(blob, safeFilename(name, "gif"));
      const warning =
        warnBytes && blob.size > warnBytes
          ? ` Larger than the ${formatBytes(warnBytes)} target. Lower the size or color count.`
          : "";
      setStatus(`Saved ${formatBytes(blob.size)}.${warning}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "The GIF could not be saved.");
    } finally {
      setBusy(false);
    }
  }

  async function saveZip() {
    setBusy(true);
    setStatus("Packing PNG frames…");
    try {
      const zip = new JSZip();
      for (let index = 0; index < count; index += 1) {
        const blob = await new Promise<Blob>((resolve, reject) => {
          paint(index).canvas.toBlob((result) => {
            if (result) resolve(result);
            else reject(new Error("A PNG frame could not be created."));
          }, "image/png");
        });
        zip.file(`${safeFilename(name, "png").replace(/\.png$/, "")}-${String(index + 1).padStart(2, "0")}.png`, blob);
        setStatus(`Packing ${index + 1} of ${count}`);
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
      const blob = await zip.generateAsync({ type: "blob" });
      downloadBlob(blob, safeFilename(name, "zip"));
      setStatus(`Saved ${count} PNG frames.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "The frames could not be packed.");
    } finally {
      setBusy(false);
    }
  }

  async function saveMp4() {
    const rawBytes = width * height * 4 * count;
    if (rawBytes > 80 * 1024 * 1024) {
      setStatus("That MP4 is too large to build here. Lower the size or frame count, or save a GIF.");
      return;
    }
    setBusy(true);
    setStatus("Loading the video converter…");
    try {
      const raw = new Uint8Array(rawBytes);
      for (let index = 0; index < count; index += 1) {
        raw.set(paint(index).ctx.getImageData(0, 0, width, height).data, index * width * height * 4);
        setStatus(`Drawing ${index + 1} of ${count}`);
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
      const blob = await rawFramesToMp4(raw, { width, height, fps }, (ratioDone) => {
        setStatus(`Encoding video ${Math.round(ratioDone * 100)}%`);
      });
      downloadBlob(blob, safeFilename(name, "mp4"));
      setStatus(`Saved ${formatBytes(blob.size)}.`);
    } catch {
      setStatus("The video converter could not run. GIF and PNG export still work.");
    } finally {
      setBusy(false);
    }
  }

  const estimate = Math.max(
    1024,
    Math.round(width * height * count * (colors / 256) * 0.12),
  );
  const api = { setSize };

  return (
    <section className="overflow-hidden rounded-xl border border-line bg-card">
      <div className="grid lg:grid-cols-[18rem_minmax(0,1fr)]">
        <div className="space-y-4 border-b border-line p-4 lg:border-r lg:border-b-0">
          {typeof children === "function" ? children(api) : children}
          <Control label="Size">
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="Width" value={width} min={16} max={1920} onChange={changeWidth} />
              <NumberField label="Height" value={height} min={16} max={1920} onChange={changeHeight} />
            </div>
            <label className="mt-2 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={lock} onChange={(event) => setLock(event.target.checked)} />
              Lock aspect ratio
            </label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {exportPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className="btn btn-ghost min-h-8 px-2 text-xs"
                  onClick={() => setSize(preset.width, preset.height)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </Control>
          <Control label="Frame rate">
            <input
              className="w-full"
              type="range"
              min={mediaPolicy.fpsMin}
              max={mediaPolicy.fpsMax}
              value={fps}
              onChange={(event) => setFps(Number(event.target.value))}
            />
            <p className="text-xs text-muted">{fps} fps</p>
          </Control>
          <Control label="Colors">
            <input
              className="w-full"
              type="range"
              min={mediaPolicy.colorsMin}
              max={mediaPolicy.colorsMax}
              value={colors}
              onChange={(event) => setColors(Number(event.target.value))}
            />
            <p className="text-xs text-muted">{colors} colors</p>
          </Control>
          <Control label="Dither">
            <select className="field" value={dither} onChange={(event) => setDither(event.target.value as DitherMode)}>
              <option value="off">Off</option>
              <option value="floyd">Floyd–Steinberg</option>
              <option value="ordered">Ordered</option>
            </select>
          </Control>
          <Control label="Loop">
            <select className="field" value={loop} onChange={(event) => setLoop(event.target.value as typeof loop)}>
              <option value="forever">Forever</option>
              <option value="once">Once</option>
              <option value="count">A set number</option>
            </select>
            {loop === "count" ? (
              <input
                className="field mt-2"
                type="number"
                min={1}
                max={20}
                value={times}
                onChange={(event) => setTimes(Number(event.target.value))}
              />
            ) : null}
          </Control>
          <Control label="File name">
            <input className="field" value={name} onChange={(event) => setName(event.target.value)} />
          </Control>
        </div>
        <div className="p-4 sm:p-6">
          <div className={transparent ? "checkerboard rounded-lg p-4" : "rounded-lg bg-surface p-4"}>
            <canvas
              ref={canvasRef}
              role="img"
              aria-label="Animation preview"
              onClick={(event) => {
                if (!onPreviewClick || !canvasRef.current) return;
                const rect = canvasRef.current.getBoundingClientRect();
                const x = Math.min(width - 1, Math.max(0, Math.floor(((event.clientX - rect.left) / rect.width) * width)));
                const y = Math.min(height - 1, Math.max(0, Math.floor(((event.clientY - rect.top) / rect.height) * height)));
                const ctx = canvasRef.current.getContext("2d", { willReadFrequently: true });
                const pixel = ctx?.getImageData(x, y, 1, 1).data;
                if (!pixel || pixel[3] === 0) return;
                onPreviewClick([pixel[0], pixel[1], pixel[2]]);
              }}
              className={`mx-auto h-auto max-h-[32rem] max-w-full ${onPreviewClick ? "cursor-crosshair" : ""}`}
              style={{ width: "100%", maxWidth: width }}
            />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button type="button" className="btn btn-ghost" aria-pressed={playing} onClick={() => setPlaying((value) => !value)}>
              {playing ? "Pause" : "Play"}
            </button>
            <input
              className="min-w-0 flex-1"
              type="range"
              min={0}
              max={count - 1}
              value={Math.min(frame, count - 1)}
              onChange={(event) => {
                setPlaying(false);
                setFrame(Number(event.target.value));
              }}
              aria-label="Frame"
            />
            <span className="w-16 text-right text-sm tabular-nums text-muted">
              {Math.min(frame, count - 1) + 1}/{count}
            </span>
          </div>
        </div>
      </div>
      <footer className="flex flex-wrap items-center gap-2 border-t border-line p-4">
        <button type="button" className="btn" disabled={busy} onClick={() => void saveGif()}>
          Save GIF
        </button>
        <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => void saveZip()}>
          PNG frames
        </button>
        <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => void saveMp4()}>
          Save MP4
        </button>
        <p className="text-sm text-muted" role="status">
          {status || `About ${formatBytes(estimate)} before encoding. Files stay in this browser.`}
        </p>
      </footer>
    </section>
  );
}

export function FileField({
  label,
  accept,
  onFile,
}: {
  label: string;
  accept: string;
  onFile: (file: File) => void;
}) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function take(file: File | undefined) {
    if (!file) return;
    const video = file.type.startsWith("video/");
    const max = video ? mediaPolicy.videoMaxBytes : mediaPolicy.imageMaxBytes;
    if (file.size > max) {
      setMessage(`That file is over ${formatBytes(max)}.`);
      return;
    }
    setMessage("");
    setName(file.name);
    onFile(file);
  }

  return (
    <div
      className="rounded-lg border border-dashed border-line px-3 py-3"
      tabIndex={0}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        take(event.dataTransfer.files[0]);
      }}
      onPaste={(event) => {
        const file = [...event.clipboardData.files][0];
        if (!file) return;
        event.preventDefault();
        take(file);
      }}
    >
      <span className="text-sm font-medium">{label}</span>
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept={accept}
        onChange={(event) => take(event.target.files?.[0])}
      />
      <button type="button" className="btn btn-ghost mt-2 min-h-9 px-3 text-xs" onClick={() => inputRef.current?.click()}>
        Choose file
      </button>
      <p className="mt-1 text-xs text-muted">{name || "Drop, paste, or choose a file."}</p>
      {message ? (
        <p className="mt-1 text-xs text-[var(--danger)]" role="alert">
          {message}
        </p>
      ) : null}
    </div>
  );
}

export function Control({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="block space-y-1.5 text-sm">
      <span className="font-medium">{label}</span>
      {children}
    </div>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block text-xs text-muted">
      {label}
      <input
        className="field mt-1"
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function even(value: number) {
  const next = Math.max(16, Math.min(1920, Math.round(Number.isFinite(value) ? value : 16)));
  return next - (next % 2) || 16;
}
