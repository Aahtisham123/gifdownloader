export function sourceSize(source: CanvasImageSource) {
  if (source instanceof HTMLImageElement) {
    return { width: source.naturalWidth, height: source.naturalHeight };
  }
  if (source instanceof HTMLVideoElement) {
    return { width: source.videoWidth, height: source.videoHeight };
  }
  if (source instanceof HTMLCanvasElement || source instanceof ImageBitmap) {
    return { width: source.width, height: source.height };
  }
  if (typeof OffscreenCanvas !== "undefined" && source instanceof OffscreenCanvas) {
    return { width: source.width, height: source.height };
  }
  return { width: 0, height: 0 };
}

export function drawCover(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const { width, height } = sourceSize(source);
  if (!width || !height || w <= 0 || h <= 0) return;
  const scale = Math.max(w / width, h / height);
  const dw = width * scale;
  const dh = height * scale;
  ctx.drawImage(source, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

export function traceRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export function traceHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
) {
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.28);
  ctx.bezierCurveTo(
    x,
    y - size * 0.18,
    x - size * 0.62,
    y - size * 0.18,
    x - size * 0.62,
    y + size * 0.16,
  );
  ctx.bezierCurveTo(
    x - size * 0.62,
    y + size * 0.48,
    x,
    y + size * 0.68,
    x,
    y + size * 0.96,
  );
  ctx.bezierCurveTo(
    x,
    y + size * 0.68,
    x + size * 0.62,
    y + size * 0.48,
    x + size * 0.62,
    y + size * 0.16,
  );
  ctx.bezierCurveTo(
    x + size * 0.62,
    y - size * 0.18,
    x,
    y - size * 0.18,
    x,
    y + size * 0.28,
  );
  ctx.closePath();
}

export function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines: string[] = [];
  let line = words[0] ?? "";
  for (const word of words.slice(1)) {
    const next = `${line} ${word}`;
    if (ctx.measureText(next).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  lines.push(line);
  return lines;
}
