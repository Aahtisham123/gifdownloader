"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { platforms } from "@/config/platforms";
import { drawCover, traceHeart, traceRoundRect, wrapLines } from "@/lib/gif/canvas";
import { hexToRgb, rgbToHex } from "@/lib/gif/download";
import { framesFromFile } from "@/lib/gif/media";
import { Control, FileField, Studio, type DrawFn } from "@/components/tools/studio";

const ACCEPT = "image/gif,image/png,image/jpeg,image/webp,video/mp4,video/webm";

type Fonts = {
  sans: string;
  anton: string;
  script: string;
  vibes: string;
  pixel: string;
};

const TEXT_EFFECTS = [
  "typewriter",
  "wave",
  "bounce",
  "glitch",
  "neon",
  "rainbow",
  "zoom",
  "shake",
  "fade",
  "extrude",
  "marquee",
  "sparkle",
  "spin",
  "slide",
] as const;

export function MakerApp({ slug }: { slug: string }) {
  const { ref, fonts } = useMakerFonts();
  return (
    <div ref={ref}>
      {slug === "text-gif-maker" ? <TextMaker fonts={fonts} /> : null}
      {slug === "gif-meme-maker" ? <MemeMaker fonts={fonts} /> : null}
      {slug === "gif-caption-maker" ? <CaptionMaker fonts={fonts} /> : null}
      {slug === "my-beloved-gif-maker" ? <BelovedMaker fonts={fonts} /> : null}
      {slug === "pet-gif-maker" ? <PetMaker /> : null}
      {slug === "heart-locket-gif-maker" ? <LocketMaker fonts={fonts} /> : null}
      {slug === "transparent-gif-maker" ? <TransparentMaker /> : null}
    </div>
  );
}

function TextMaker({ fonts }: { fonts: Fonts }) {
  const history = useUndo({
    text: "Hello",
    effect: "wave" as (typeof TEXT_EFFECTS)[number],
    color: "#1c1917",
    background: "#f4f3ef",
    transparent: false,
    font: "sans" as "sans" | "anton" | "script" | "pixel",
    fontSize: 72,
    frames: 24,
  });
  const settings = history.value;
  const draw = useCallback<DrawFn>(
    (ctx, frame, size) => {
      if (!settings.transparent) {
        ctx.fillStyle = settings.background;
        ctx.fillRect(0, 0, size.width, size.height);
      }
      const progress = frame / Math.max(1, settings.frames - 1);
      const family =
        settings.font === "anton"
          ? fonts.anton
          : settings.font === "script"
            ? fonts.script
            : settings.font === "pixel"
              ? fonts.pixel
              : fonts.sans;
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `600 ${settings.fontSize}px ${family}`;
      ctx.fillStyle = settings.effect === "rainbow" ? `hsl(${(frame * 18) % 360} 65% 42%)` : settings.color;
      let text = settings.text || "Hello";
      if (settings.effect === "typewriter") {
        text = text.slice(0, Math.max(1, Math.ceil((text.length * (frame + 1)) / settings.frames)));
      }
      let x = size.width / 2;
      let y = size.height / 2;
      if (settings.effect === "wave") y += Math.sin(progress * Math.PI * 2) * 28;
      if (settings.effect === "bounce") y -= Math.abs(Math.sin(progress * Math.PI * 2)) * 48;
      if (settings.effect === "shake") {
        x += Math.sin(frame * 1.7) * 8;
        y += Math.cos(frame * 1.3) * 6;
      }
      if (settings.effect === "zoom") {
        const scale = 0.65 + progress * 0.7;
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        x = 0;
        y = 0;
      }
      if (settings.effect === "fade") ctx.globalAlpha = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(progress * Math.PI * 2));
      if (settings.effect === "marquee") {
        ctx.textAlign = "left";
        const measured = ctx.measureText(text).width;
        x = size.width - progress * (size.width + measured);
      }
      if (settings.effect === "spin") {
        ctx.translate(size.width / 2, size.height / 2);
        ctx.rotate(progress * Math.PI * 2);
        x = 0;
        y = 0;
      }
      if (settings.effect === "slide") {
        ctx.textAlign = "left";
        const measured = ctx.measureText(text).width;
        x = progress * (size.width + measured) - measured;
      }
      if (settings.effect === "neon") {
        ctx.shadowColor = settings.color;
        ctx.shadowBlur = 22;
      }
      if (settings.effect === "glitch") {
        ctx.fillStyle = "#c2410c";
        ctx.fillText(text, x + (frame % 2 ? 4 : -4), y);
        ctx.fillStyle = "#1d4ed8";
        ctx.fillText(text, x + (frame % 2 ? -4 : 4), y);
        ctx.fillStyle = settings.color;
      }
      if (settings.effect === "extrude") {
        for (let layer = 8; layer >= 1; layer -= 1) {
          ctx.fillStyle = settings.color;
          ctx.globalAlpha = 0.15;
          ctx.fillText(text, x + layer * 2, y + layer * 2);
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = settings.color;
      }
      ctx.fillText(text, x, y);
      if (settings.effect === "sparkle") {
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#ffffff";
        for (let index = 0; index < 10; index += 1) {
          const sx = ((Math.sin(frame * 0.35 + index) * 0.5 + 0.5) * size.width);
          const sy = ((Math.cos(frame * 0.28 + index * 1.7) * 0.5 + 0.5) * size.height);
          ctx.fillRect(sx, sy, 3, 3);
        }
      }
      ctx.restore();
    },
    [fonts, settings],
  );

  return (
    <Studio draw={draw} frameCount={settings.frames} filename="text" transparent={settings.transparent}>
      <HistoryBar id="text" value={settings} history={history} />
      <Control label="Text">
        <textarea className="field min-h-20" value={settings.text} onChange={(event) => history.set({ ...settings, text: event.target.value })} />
      </Control>
      <Control label="Effect">
        <select
          className="field capitalize"
          value={settings.effect}
          onChange={(event) => history.set({ ...settings, effect: event.target.value as typeof settings.effect })}
        >
          {TEXT_EFFECTS.map((effect) => (
            <option key={effect} value={effect}>
              {effect}
            </option>
          ))}
        </select>
      </Control>
      <Control label="Font">
        <select
          className="field"
          value={settings.font}
          onChange={(event) => history.set({ ...settings, font: event.target.value as typeof settings.font })}
        >
          <option value="sans">Sans</option>
          <option value="anton">Poster</option>
          <option value="script">Script</option>
          <option value="pixel">Pixel</option>
        </select>
      </Control>
      <Control label="Type size">
        <input className="w-full" type="range" min={24} max={160} value={settings.fontSize} onChange={(event) => history.set({ ...settings, fontSize: Number(event.target.value) })} />
      </Control>
      <Control label="Frames">
        <input className="w-full" type="range" min={8} max={48} value={settings.frames} onChange={(event) => history.set({ ...settings, frames: Number(event.target.value) })} />
      </Control>
      <ColorRow label="Text color" value={settings.color} onChange={(color) => history.set({ ...settings, color })} />
      <ColorRow label="Background" value={settings.background} onChange={(background) => history.set({ ...settings, background })} />
      <Check
        label="Transparent background"
        checked={settings.transparent}
        onChange={(transparent) => history.set({ ...settings, transparent })}
      />
    </Studio>
  );
}

function MemeMaker({ fonts }: { fonts: Fonts }) {
  const history = useUndo({
    top: "TOP TEXT",
    bottom: "BOTTOM TEXT",
    color: "#ffffff",
    stroke: "#111111",
    background: "#d6d3d1",
    fontSize: 48,
    layout: "classic" as "classic" | "center",
  });
  const media = useMedia();
  const settings = history.value;
  const draw = useCallback<DrawFn>(
    (ctx, frame, size) => {
      const source = media.frames[frame % Math.max(1, media.frames.length)];
      if (source) drawCover(ctx, source, 0, 0, size.width, size.height);
      else {
        ctx.fillStyle = settings.background;
        ctx.fillRect(0, 0, size.width, size.height);
      }
      ctx.save();
      ctx.font = `700 ${settings.fontSize}px ${fonts.anton}`;
      ctx.textAlign = "center";
      ctx.lineWidth = Math.max(2, settings.fontSize / 10);
      ctx.strokeStyle = settings.stroke;
      ctx.fillStyle = settings.color;
      ctx.lineJoin = "round";
      const top = wrapLines(ctx, settings.top, size.width - 32);
      const bottom = wrapLines(ctx, settings.bottom, size.width - 32);
      const lineHeight = settings.fontSize * 1.05;
      if (settings.layout === "center") {
        const lines = [...top, ...bottom];
        const start = size.height / 2 - ((lines.length - 1) * lineHeight) / 2;
        paintLines(ctx, lines, size.width / 2, start, lineHeight);
      } else {
        paintLines(ctx, top, size.width / 2, settings.fontSize + 8, lineHeight);
        const bottomStart = size.height - 16 - bottom.length * lineHeight;
        paintLines(ctx, bottom, size.width / 2, bottomStart, lineHeight);
      }
      ctx.restore();
    },
    [fonts.anton, media.frames, settings],
  );

  return (
    <Studio draw={draw} frameCount={Math.max(1, media.frames.length)} filename="meme">
      <HistoryBar id="meme" value={settings} history={history} />
      <FileField label="Image, GIF, or video" accept={ACCEPT} onFile={media.open} />
      {media.error ? <Alert message={media.error} /> : null}
      <Control label="Top text">
        <input className="field" value={settings.top} onChange={(event) => history.set({ ...settings, top: event.target.value })} />
      </Control>
      <Control label="Bottom text">
        <input className="field" value={settings.bottom} onChange={(event) => history.set({ ...settings, bottom: event.target.value })} />
      </Control>
      <Control label="Layout">
        <select className="field" value={settings.layout} onChange={(event) => history.set({ ...settings, layout: event.target.value as typeof settings.layout })}>
          <option value="classic">Top and bottom</option>
          <option value="center">Center</option>
        </select>
      </Control>
      <Control label="Type size">
        <input className="w-full" type="range" min={18} max={96} value={settings.fontSize} onChange={(event) => history.set({ ...settings, fontSize: Number(event.target.value) })} />
      </Control>
      <ColorRow label="Fill" value={settings.color} onChange={(color) => history.set({ ...settings, color })} />
      <ColorRow label="Outline" value={settings.stroke} onChange={(stroke) => history.set({ ...settings, stroke })} />
      <ColorRow label="Blank background" value={settings.background} onChange={(background) => history.set({ ...settings, background })} />
    </Studio>
  );
}

function CaptionMaker({ fonts }: { fonts: Fonts }) {
  const history = useUndo({
    text: "A caption",
    style: "bottom" as "bottom" | "top" | "overlay" | "bubble" | "lower",
    color: "#1c1917",
    background: "#ffffff",
    fontSize: 28,
    start: 0,
  });
  const media = useMedia();
  const settings = history.value;
  const count = Math.max(1, media.frames.length);
  const draw = useCallback<DrawFn>(
    (ctx, frame, size) => {
      const source = media.frames[Math.min(frame, media.frames.length - 1)];
      if (source) drawCover(ctx, source, 0, 0, size.width, size.height);
      else {
        ctx.fillStyle = "#e7e5e4";
        ctx.fillRect(0, 0, size.width, size.height);
      }
      if (frame < settings.start) return;
      ctx.save();
      ctx.font = `600 ${settings.fontSize}px ${fonts.sans}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const lines = wrapLines(ctx, settings.text || " ", size.width - 48);
      const barHeight = lines.length * 34 + 24;
      if (settings.style === "bottom" || settings.style === "top") {
        const y = settings.style === "top" ? 0 : size.height - barHeight;
        ctx.fillStyle = settings.background;
        ctx.fillRect(0, y, size.width, barHeight);
        ctx.fillStyle = settings.color;
        lines.forEach((line, index) => ctx.fillText(line, size.width / 2, y + 28 + index * 34));
      } else if (settings.style === "bubble") {
        const y = size.height - barHeight - 28;
        ctx.fillStyle = settings.background;
        traceRoundRect(ctx, 24, y, size.width - 48, barHeight, 16);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(size.width / 2 - 10, y + barHeight);
        ctx.lineTo(size.width / 2, y + barHeight + 16);
        ctx.lineTo(size.width / 2 + 10, y + barHeight);
        ctx.fill();
        ctx.fillStyle = settings.color;
        lines.forEach((line, index) => ctx.fillText(line, size.width / 2, y + 22 + index * 34));
      } else if (settings.style === "lower") {
        const y = size.height - barHeight;
        ctx.fillStyle = settings.background;
        ctx.fillRect(0, y, size.width, barHeight);
        ctx.fillStyle = "#06b6d4";
        ctx.fillRect(0, y, size.width, 4);
        ctx.fillStyle = settings.color;
        lines.forEach((line, index) => ctx.fillText(line, size.width / 2, y + 28 + index * 34));
      } else {
        ctx.fillStyle = settings.color;
        ctx.shadowColor = "rgba(0,0,0,0.65)";
        ctx.shadowBlur = 8;
        lines.forEach((line, index) => ctx.fillText(line, size.width / 2, size.height / 2 + index * 34));
      }
      ctx.restore();
    },
    [fonts.sans, media.frames, settings],
  );

  return (
    <Studio draw={draw} frameCount={count} filename="caption">
      <HistoryBar id="caption" value={settings} history={history} />
      <FileField label="Image, GIF, or video" accept={ACCEPT} onFile={media.open} />
      {media.error ? <Alert message={media.error} /> : null}
      <Control label="Caption">
        <textarea className="field min-h-20" value={settings.text} onChange={(event) => history.set({ ...settings, text: event.target.value })} />
      </Control>
      <Control label="Style">
        <select className="field" value={settings.style} onChange={(event) => history.set({ ...settings, style: event.target.value as typeof settings.style })}>
          <option value="bottom">Bar below</option>
          <option value="top">Bar above</option>
          <option value="overlay">Overlay</option>
          <option value="bubble">Bubble</option>
          <option value="lower">Lower third</option>
        </select>
      </Control>
      <Control label="Type size">
        <input className="w-full" type="range" min={16} max={56} value={settings.fontSize} onChange={(event) => history.set({ ...settings, fontSize: Number(event.target.value) })} />
      </Control>
      <Control label="Appears at frame">
        <input className="w-full" type="range" min={0} max={count - 1} value={Math.min(settings.start, count - 1)} onChange={(event) => history.set({ ...settings, start: Number(event.target.value) })} />
      </Control>
      <ColorRow label="Text" value={settings.color} onChange={(color) => history.set({ ...settings, color })} />
      <ColorRow label="Bar" value={settings.background} onChange={(background) => history.set({ ...settings, background })} />
    </Studio>
  );
}

function BelovedMaker({ fonts }: { fonts: Fonts }) {
  const history = useUndo({
    text: "my beloved",
    effect: "float" as "float" | "pulse" | "sway" | "still",
    color: "#1c1917",
    background: "#f4f3ef",
    shape: "circle" as "circle" | "rounded" | "heart",
    frame: "line" as "none" | "line",
  });
  const media = useMedia();
  const settings = history.value;
  const draw = useCallback<DrawFn>(
    (ctx, frame, size) => {
      const progress = frame / 23;
      ctx.fillStyle = settings.background;
      ctx.fillRect(0, 0, size.width, size.height);
      const source = media.frames[frame % Math.max(1, media.frames.length)];
      ctx.save();
      const float = settings.effect === "float" ? Math.sin(progress * Math.PI * 2) * 12 : 0;
      const sway = settings.effect === "sway" ? Math.sin(progress * Math.PI * 2) * 0.06 : 0;
      const pulse = settings.effect === "pulse" ? 1 + Math.sin(progress * Math.PI * 2) * 0.04 : 1;
      ctx.translate(size.width / 2, size.height / 2 - 20 + float);
      ctx.rotate(sway);
      ctx.scale(pulse, pulse);
      const box = Math.min(size.width, size.height) * 0.62;
      ctx.beginPath();
      if (settings.shape === "circle") ctx.arc(0, 0, box / 2, 0, Math.PI * 2);
      else if (settings.shape === "heart") traceHeart(ctx, 0, 8, box * 0.48);
      else traceRoundRect(ctx, -box / 2, -box / 2, box, box, 28);
      ctx.closePath();
      ctx.clip();
      if (source) drawCover(ctx, source, -box / 2, -box / 2, box, box);
      else {
        ctx.fillStyle = "#d6d3d1";
        ctx.fillRect(-box / 2, -box / 2, box, box);
      }
      ctx.restore();
      if (settings.frame === "line") {
        ctx.save();
        ctx.translate(size.width / 2, size.height / 2 - 20 + float);
        ctx.rotate(sway);
        ctx.scale(pulse, pulse);
        ctx.beginPath();
        if (settings.shape === "circle") ctx.arc(0, 0, box / 2, 0, Math.PI * 2);
        else if (settings.shape === "heart") traceHeart(ctx, 0, 8, box * 0.48);
        else traceRoundRect(ctx, -box / 2, -box / 2, box, box, 28);
        ctx.strokeStyle = settings.color;
        ctx.lineWidth = 6;
        ctx.stroke();
        ctx.restore();
      }
      ctx.fillStyle = settings.color;
      ctx.font = `400 36px ${fonts.script}`;
      ctx.textAlign = "center";
      ctx.fillText(settings.text || "my beloved", size.width / 2, size.height - 36);
    },
    [fonts.script, media.frames, settings],
  );

  return (
    <Studio draw={draw} frameCount={24} filename="my-beloved">
      <HistoryBar id="beloved" value={settings} history={history} />
      <FileField label="Photo" accept={ACCEPT} onFile={media.open} />
      {media.error ? <Alert message={media.error} /> : null}
      <Control label="Caption">
        <input className="field" value={settings.text} onChange={(event) => history.set({ ...settings, text: event.target.value })} />
      </Control>
      <Control label="Motion">
        <select className="field" value={settings.effect} onChange={(event) => history.set({ ...settings, effect: event.target.value as typeof settings.effect })}>
          <option value="float">Float</option>
          <option value="pulse">Pulse</option>
          <option value="sway">Sway</option>
          <option value="still">Still</option>
        </select>
      </Control>
      <Control label="Crop">
        <select className="field" value={settings.shape} onChange={(event) => history.set({ ...settings, shape: event.target.value as typeof settings.shape })}>
          <option value="circle">Circle</option>
          <option value="rounded">Rounded</option>
          <option value="heart">Heart</option>
        </select>
      </Control>
      <Control label="Frame">
        <select className="field" value={settings.frame} onChange={(event) => history.set({ ...settings, frame: event.target.value as typeof settings.frame })}>
          <option value="line">Outline</option>
          <option value="none">None</option>
        </select>
      </Control>
      <ColorRow label="Text" value={settings.color} onChange={(color) => history.set({ ...settings, color })} />
      <ColorRow label="Background" value={settings.background} onChange={(background) => history.set({ ...settings, background })} />
    </Studio>
  );
}

function PetMaker() {
  const history = useUndo({
    shape: "circle" as "circle" | "rounded" | "none",
    background: "#f4f3ef",
    hand: "#f0d2b4",
    transparent: true,
    frames: 12,
  });
  const media = useMedia();
  const settings = history.value;
  const draw = useCallback<DrawFn>(
    (ctx, frame, size) => {
      if (!settings.transparent) {
        ctx.fillStyle = settings.background;
        ctx.fillRect(0, 0, size.width, size.height);
      }
      const press = Math.sin((frame / settings.frames) * Math.PI);
      const source = media.frames[frame % Math.max(1, media.frames.length)];
      const box = Math.min(size.width, size.height) * 0.62;
      ctx.save();
      ctx.translate(size.width / 2, size.height * 0.62);
      ctx.scale(1 + press * 0.1, 1 - press * 0.22);
      ctx.beginPath();
      if (settings.shape === "circle") ctx.arc(0, -box / 2, box / 2, 0, Math.PI * 2);
      else if (settings.shape === "rounded") traceRoundRect(ctx, -box / 2, -box, box, box, box * 0.2);
      else ctx.rect(-box / 2, -box, box, box);
      ctx.closePath();
      if (settings.shape !== "none") ctx.clip();
      if (source) drawCover(ctx, source, -box / 2, -box, box, box);
      else {
        ctx.fillStyle = "#a8a29e";
        ctx.fillRect(-box / 2, -box, box, box);
      }
      ctx.restore();
      drawHand(ctx, size.width / 2, size.height * 0.18 + press * size.height * 0.16, Math.min(size.width, size.height) / 280, settings.hand);
    },
    [media.frames, settings],
  );

  return (
    <Studio
      draw={draw}
      frameCount={settings.frames}
      filename="pet"
      defaultWidth={128}
      defaultHeight={128}
      transparent={settings.transparent}
      warnBytes={platforms.discord.emojiMaxBytes}
    >
      {(api) => (
        <>
          <HistoryBar id="pet" value={settings} history={history} />
          <FileField label="Pet photo or GIF" accept={ACCEPT} onFile={media.open} />
          {media.error ? <Alert message={media.error} /> : null}
          <div className="flex gap-2">
            <button type="button" className="btn btn-ghost" onClick={() => api.setSize(platforms.discord.emoji.width, platforms.discord.emoji.height)}>
              128 emoji
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => api.setSize(platforms.twitch.emote.width, platforms.twitch.emote.height)}>
              112 emote
            </button>
          </div>
          <Control label="Crop">
            <select className="field" value={settings.shape} onChange={(event) => history.set({ ...settings, shape: event.target.value as typeof settings.shape })}>
              <option value="circle">Circle</option>
              <option value="rounded">Rounded</option>
              <option value="none">None</option>
            </select>
          </Control>
          <Control label="Hand">
            <div className="flex flex-wrap gap-2">
              {[
                ["#f0d2b4", "Light"],
                ["#e0ac7a", "Medium"],
                ["#8d5524", "Deep"],
                ["#f5f5f4", "Glove"],
              ].map(([color, label]) => (
                <button
                  key={color}
                  type="button"
                  className="btn btn-ghost min-h-9 px-3 text-xs"
                  aria-pressed={settings.hand === color}
                  onClick={() => history.set({ ...settings, hand: color })}
                >
                  {label}
                </button>
              ))}
            </div>
          </Control>
          <Control label="Frames">
            <input className="w-full" type="range" min={8} max={24} value={settings.frames} onChange={(event) => history.set({ ...settings, frames: Number(event.target.value) })} />
          </Control>
          <Check label="Transparent background" checked={settings.transparent} onChange={(transparent) => history.set({ ...settings, transparent })} />
          <ColorRow label="Background" value={settings.background} onChange={(background) => history.set({ ...settings, background })} />
        </>
      )}
    </Studio>
  );
}

function LocketMaker({ fonts }: { fonts: Fonts }) {
  const history = useUndo({
    engraving: "",
    metal: "#d4af37",
    style: "classic" as "classic" | "rounded" | "vintage",
    chain: true,
    background: "#1c1917",
    frames: 24,
  });
  const left = useMedia();
  const right = useMedia();
  const settings = history.value;
  const draw = useCallback<DrawFn>(
    (ctx, frame, size) => {
      ctx.fillStyle = settings.background;
      ctx.fillRect(0, 0, size.width, size.height);
      const open = Math.max(0, (frame / Math.max(1, settings.frames - 1) - 0.2) / 0.8);
      const gap = open * Math.min(size.width, size.height) * 0.16;
      const heart = Math.min(size.width, size.height) * (settings.style === "rounded" ? 0.38 : 0.34);
      const cy = size.height * 0.46;
      drawHalf(ctx, left.frames[0], size, -1, gap, cy, heart);
      drawHalf(ctx, right.frames[0], size, 1, gap, cy, heart);
      ctx.save();
      ctx.lineWidth = Math.max(6, heart * 0.08);
      ctx.strokeStyle = settings.metal;
      traceHeart(ctx, size.width / 2 - gap, cy, heart);
      ctx.stroke();
      traceHeart(ctx, size.width / 2 + gap, cy, heart);
      ctx.stroke();
      if (settings.style === "vintage") {
        ctx.lineWidth = Math.max(2, heart * 0.03);
        ctx.strokeStyle = settings.background;
        traceHeart(ctx, size.width / 2 - gap, cy, heart * 0.82);
        ctx.stroke();
        traceHeart(ctx, size.width / 2 + gap, cy, heart * 0.82);
        ctx.stroke();
      }
      ctx.restore();
      if (settings.chain) {
        ctx.fillStyle = settings.metal;
        for (let link = 0; link < 7; link += 1) {
          const t = link / 6;
          ctx.beginPath();
          ctx.arc(size.width * (0.32 + t * 0.36), cy + heart * 0.95 + Math.sin(t * Math.PI) * 16, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (settings.engraving) {
        ctx.fillStyle = "#f5f5f4";
        ctx.font = `400 22px ${fonts.vibes}`;
        ctx.textAlign = "center";
        ctx.fillText(settings.engraving, size.width / 2, size.height - 28);
      }
    },
    [fonts.vibes, left.frames, right.frames, settings],
  );

  return (
    <Studio draw={draw} frameCount={settings.frames} filename="heart-locket" defaultWidth={512} defaultHeight={512}>
      <HistoryBar id="locket" value={settings} history={history} />
      <FileField label="Left photo" accept={ACCEPT} onFile={left.open} />
      <FileField label="Right photo" accept={ACCEPT} onFile={right.open} />
      {left.error || right.error ? <Alert message={left.error || right.error} /> : null}
      <Control label="Engraving">
        <input className="field" value={settings.engraving} onChange={(event) => history.set({ ...settings, engraving: event.target.value })} />
      </Control>
      <Control label="Metal">
        <div className="flex flex-wrap gap-2">
          {[
            ["#d4af37", "Gold"],
            ["#d6d3d1", "Silver"],
            ["#b76e79", "Rose"],
            ["#27272a", "Black"],
          ].map(([color, label]) => (
            <button
              key={color}
              type="button"
              className="btn btn-ghost min-h-9 px-3 text-xs"
              aria-pressed={settings.metal === color}
              onClick={() => history.set({ ...settings, metal: color })}
            >
              {label}
            </button>
          ))}
        </div>
      </Control>
      <Control label="Heart">
        <select className="field" value={settings.style} onChange={(event) => history.set({ ...settings, style: event.target.value as typeof settings.style })}>
          <option value="classic">Classic</option>
          <option value="rounded">Rounded</option>
          <option value="vintage">Vintage</option>
        </select>
      </Control>
      <Check label="Chain" checked={settings.chain} onChange={(chain) => history.set({ ...settings, chain })} />
      <ColorRow label="Metal" value={settings.metal} onChange={(metal) => history.set({ ...settings, metal })} />
      <ColorRow label="Background" value={settings.background} onChange={(background) => history.set({ ...settings, background })} />
      <Control label="Frames">
        <input className="w-full" type="range" min={12} max={36} value={settings.frames} onChange={(event) => history.set({ ...settings, frames: Number(event.target.value) })} />
      </Control>
    </Studio>
  );
}

function TransparentMaker() {
  const history = useUndo({
    color: "#ffffff",
    tolerance: 40,
    threshold: 24,
    matte: true,
    matteColor: "#000000",
  });
  const media = useMedia();
  const settings = history.value;
  const draw = useCallback<DrawFn>(
    (ctx, frame, size) => {
      const source = media.frames[frame % Math.max(1, media.frames.length)];
      if (!source) {
        ctx.fillStyle = "#e7e5e4";
        ctx.fillRect(0, 0, size.width, size.height);
        ctx.fillStyle = "#44403c";
        ctx.font = "600 20px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Add an image", size.width / 2, size.height / 2);
        return;
      }
      drawCover(ctx, source, 0, 0, size.width, size.height);
      const pixels = ctx.getImageData(0, 0, size.width, size.height);
      applyColorKey(
        pixels.data,
        hexToRgb(settings.color),
        settings.tolerance,
        settings.threshold,
        settings.matte ? hexToRgb(settings.matteColor) : null,
      );
      ctx.putImageData(pixels, 0, 0);
    },
    [media.frames, settings],
  );

  return (
    <Studio
      draw={draw}
      frameCount={Math.max(1, media.frames.length)}
      filename="transparent"
      transparent
      onPreviewClick={(color) => history.set({ ...history.value, color: rgbToHex(color[0], color[1], color[2]) })}
    >
      <HistoryBar id="transparent" value={settings} history={history} />
      <FileField
        label="Image or GIF"
        accept={ACCEPT}
          onFile={(file) => {
          void media.open(file).then((frames) => {
            const first = frames[0];
            if (!first) return;
            const ctx = first.getContext("2d");
            if (!ctx) return;
            const spots = [
              [0, 0],
              [first.width - 1, 0],
              [0, first.height - 1],
              [first.width - 1, first.height - 1],
            ];
            let r = 0;
            let g = 0;
            let b = 0;
            for (const [x, y] of spots) {
              const pixel = ctx.getImageData(x, y, 1, 1).data;
              r += pixel[0];
              g += pixel[1];
              b += pixel[2];
            }
            const color = rgbToHex(r / 4, g / 4, b / 4);
            history.set((current) => ({ ...current, color }));
          });
        }}
      />
      {media.error ? <Alert message={media.error} /> : null}
      <p className="text-xs leading-5 text-muted">Click a color in the preview to use it as the key.</p>
      <Control label="Key presets">
        <div className="flex flex-wrap gap-2">
          {[
            ["#ffffff", "White"],
            ["#00ff00", "Green screen"],
            ["#000000", "Black"],
          ].map(([color, label]) => (
            <button
              key={color}
              type="button"
              className="btn btn-ghost min-h-9 px-3 text-xs"
              onClick={() => history.set({ ...settings, color })}
            >
              {label}
            </button>
          ))}
        </div>
      </Control>
      <ColorRow label="Key color" value={settings.color} onChange={(color) => history.set({ ...settings, color })} />
      <Control label="Tolerance">
        <input className="w-full" type="range" min={0} max={180} value={settings.tolerance} onChange={(event) => history.set({ ...settings, tolerance: Number(event.target.value) })} />
      </Control>
      <Control label="Alpha threshold">
        <input className="w-full" type="range" min={0} max={255} value={settings.threshold} onChange={(event) => history.set({ ...settings, threshold: Number(event.target.value) })} />
      </Control>
      <Check label="Matte the fringe" checked={settings.matte} onChange={(matte) => history.set({ ...settings, matte })} />
      <ColorRow label="Matte color" value={settings.matteColor} onChange={(matteColor) => history.set({ ...settings, matteColor })} />
    </Studio>
  );
}

function drawHalf(
  ctx: CanvasRenderingContext2D,
  source: HTMLCanvasElement | undefined,
  size: { width: number; height: number },
  side: -1 | 1,
  gap: number,
  cy: number,
  heart: number,
) {
  const cx = size.width / 2 + side * gap;
  ctx.save();
  traceHeart(ctx, cx, cy, heart);
  ctx.clip();
  ctx.beginPath();
  if (side < 0) ctx.rect(0, 0, size.width / 2, size.height);
  else ctx.rect(size.width / 2, 0, size.width / 2, size.height);
  ctx.clip();
  if (source) drawCover(ctx, source, cx - heart, cy - heart * 0.15, heart * 2, heart * 1.5);
  else {
    ctx.fillStyle = side < 0 ? "#a8a29e" : "#78716c";
    ctx.fillRect(0, 0, size.width, size.height);
  }
  ctx.restore();
}

function drawHand(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, color = "#f0d2b4") {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = color;
  ctx.strokeStyle = "#292524";
  ctx.lineWidth = 3;
  for (let finger = 0; finger < 4; finger += 1) {
    traceRoundRect(ctx, -46 + finger * 24, -20, 18, 58, 9);
    ctx.fill();
    ctx.stroke();
  }
  traceRoundRect(ctx, -52, 24, 104, 58, 24);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function paintLines(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  x: number,
  y: number,
  lineHeight: number,
) {
  lines.forEach((line, index) => {
    const lineY = y + index * lineHeight;
    ctx.strokeText(line, x, lineY);
    ctx.fillText(line, x, lineY);
  });
}

function applyColorKey(
  data: Uint8ClampedArray,
  key: [number, number, number],
  tolerance: number,
  threshold: number,
  matte: [number, number, number] | null,
) {
  for (let index = 0; index < data.length; index += 4) {
    const distance = Math.hypot(
      data[index] - key[0],
      data[index + 1] - key[1],
      data[index + 2] - key[2],
    );
    if (distance > tolerance) continue;
    const edge = tolerance === 0 ? 0 : distance / tolerance;
    const alpha = edge < 0.65 ? 0 : Math.round(255 * ((edge - 0.65) / 0.35));
    if (alpha <= threshold) {
      data[index + 3] = 0;
      continue;
    }
    data[index + 3] = Math.min(data[index + 3], alpha);
    if (matte && data[index + 3] < 255) {
      data[index] = matte[0];
      data[index + 1] = matte[1];
      data[index + 2] = matte[2];
    }
  }
}

function useMedia() {
  const [frames, setFrames] = useState<HTMLCanvasElement[]>([]);
  const [error, setError] = useState("");
  const open = useCallback(async (file: File) => {
    try {
      const next = await framesFromFile(file);
      setFrames(next);
      setError("");
      return next;
    } catch (caught) {
      setFrames([]);
      setError(caught instanceof Error ? caught.message : "That file could not be opened.");
      return [];
    }
  }, []);
  return { frames, error, open };
}

function useMakerFonts() {
  const ref = useRef<HTMLDivElement>(null);
  const [fonts, setFonts] = useState<Fonts>({
    sans: "sans-serif",
    anton: "Arial Black, sans-serif",
    script: "Georgia, serif",
    vibes: "Georgia, serif",
    pixel: "monospace",
  });
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const style = getComputedStyle(node);
    const read = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback;
    setFonts({
      sans: getComputedStyle(document.body).fontFamily || "sans-serif",
      anton: read("--font-anton", "Arial Black, sans-serif"),
      script: read("--font-pacifico", "Georgia, serif"),
      vibes: read("--font-vibes", "Georgia, serif"),
      pixel: read("--font-pixel", "monospace"),
    });
  }, []);
  return { ref, fonts };
}

function useUndo<T>(initial: T) {
  const initialRef = useRef(initial);
  const past = useRef<T[]>([]);
  const future = useRef<T[]>([]);
  const [value, setValue] = useState(initial);
  const set = useCallback((next: T | ((current: T) => T)) => {
    setValue((current) => {
      const resolved = typeof next === "function" ? (next as (current: T) => T)(current) : next;
      past.current = [...past.current.slice(-29), current];
      future.current = [];
      return resolved;
    });
  }, []);
  const undo = useCallback(() => {
    setValue((current) => {
      const previous = past.current.at(-1);
      if (previous === undefined) return current;
      past.current = past.current.slice(0, -1);
      future.current = [...future.current, current];
      return previous;
    });
  }, []);
  const redo = useCallback(() => {
    setValue((current) => {
      const next = future.current.at(-1);
      if (next === undefined) return current;
      future.current = future.current.slice(0, -1);
      past.current = [...past.current, current];
      return next;
    });
  }, []);
  const reset = useCallback(() => {
    past.current = [];
    future.current = [];
    setValue(initialRef.current);
  }, []);
  return { value, set, undo, redo, reset };
}

function HistoryBar<T extends object>({
  id,
  value,
  history,
}: {
  id: string;
  value: T;
  history: { undo: () => void; redo: () => void; reset: () => void; set: (value: T) => void };
}) {
  const names = usePresetNames(id);

  function save() {
    const name = window.prompt("Preset name");
    if (!name?.trim()) return;
    const all = readAll();
    all[id] = { ...all[id], [name.trim()]: value as object };
    localStorage.setItem(PRESETS, JSON.stringify(all));
    notifyPresets();
  }

  function load(name: string) {
    const stored = readPresets(id)[name];
    if (stored && typeof stored === "object") history.set({ ...value, ...(stored as Partial<T>) });
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      <button type="button" className="btn btn-ghost min-h-8 px-2 text-xs" onClick={history.undo}>
        Undo
      </button>
      <button type="button" className="btn btn-ghost min-h-8 px-2 text-xs" onClick={history.redo}>
        Redo
      </button>
      <button type="button" className="btn btn-ghost min-h-8 px-2 text-xs" onClick={history.reset}>
        Reset
      </button>
      <button type="button" className="btn btn-ghost min-h-8 px-2 text-xs" onClick={save}>
        Save preset
      </button>
      {names.length > 0 ? (
        <select className="field min-h-8 w-auto py-1 text-xs" defaultValue="" onChange={(event) => load(event.target.value)}>
          <option value="" disabled>
            Presets
          </option>
          {names.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      ) : null}
    </div>
  );
}

const PRESETS = "framepop-presets";
let presetVersion = 0;
const presetListeners = new Set<() => void>();

function notifyPresets() {
  presetVersion += 1;
  presetListeners.forEach((listener) => listener());
}

function usePresetNames(id: string) {
  const snapshot = useSyncExternalStore(
    (listener) => {
      presetListeners.add(listener);
      return () => presetListeners.delete(listener);
    },
    () => `${presetVersion}:${Object.keys(readPresets(id)).join("\0")}`,
    () => "",
  );
  const names = snapshot.split(":").slice(1).join(":");
  return names ? names.split("\0") : [];
}

function readAll() {
  try {
    const parsed = JSON.parse(localStorage.getItem(PRESETS) || "{}") as Record<string, Record<string, object>>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function readPresets(id: string) {
  return readAll()[id] ?? {};
}

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 text-sm">
      <span className="font-medium">{label}</span>
      <input type="color" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}

function Alert({ message }: { message: string }) {
  return (
    <p className="text-sm text-[var(--danger)]" role="alert">
      {message}
    </p>
  );
}
