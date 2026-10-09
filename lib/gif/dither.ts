export type DitherMode = "off" | "floyd" | "ordered";

const BAYER = [
  0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5,
];

export function dither(
  rgba: Uint8ClampedArray,
  width: number,
  height: number,
  mode: DitherMode,
  colors: number,
) {
  if (mode === "off") return;
  const levels = Math.max(2, Math.round(Math.sqrt(Math.max(2, colors))));
  const step = 255 / (levels - 1);
  if (mode === "ordered") {
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const i = (y * width + x) * 4;
        const threshold =
          ((BAYER[((y & 3) * 4 + (x & 3)) % 16] + 0.5) / 16 - 0.5) * step;
        rgba[i] = clamp(rgba[i] + threshold);
        rgba[i + 1] = clamp(rgba[i + 1] + threshold);
        rgba[i + 2] = clamp(rgba[i + 2] + threshold);
      }
    }
    return;
  }

  const px = new Float32Array(width * height * 3);
  for (let i = 0, p = 0; i < rgba.length; i += 4, p += 3) {
    px[p] = rgba[i];
    px[p + 1] = rgba[i + 1];
    px[p + 2] = rgba[i + 2];
  }
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const p = (y * width + x) * 3;
      for (let c = 0; c < 3; c += 1) {
        const old = px[p + c];
        const next = Math.round(old / step) * step;
        const error = old - next;
        px[p + c] = next;
        add(px, width, height, x + 1, y, c, (error * 7) / 16);
        add(px, width, height, x - 1, y + 1, c, (error * 3) / 16);
        add(px, width, height, x, y + 1, c, (error * 5) / 16);
        add(px, width, height, x + 1, y + 1, c, error / 16);
      }
    }
  }
  for (let i = 0, p = 0; i < rgba.length; i += 4, p += 3) {
    rgba[i] = clamp(px[p]);
    rgba[i + 1] = clamp(px[p + 1]);
    rgba[i + 2] = clamp(px[p + 2]);
  }
}

function add(
  px: Float32Array,
  width: number,
  height: number,
  x: number,
  y: number,
  channel: number,
  value: number,
) {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  px[(y * width + x) * 3 + channel] += value;
}

function clamp(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}
