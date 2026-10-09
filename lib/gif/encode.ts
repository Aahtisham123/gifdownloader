import type { DitherMode } from "@/lib/gif/dither";
import { dither } from "@/lib/gif/dither";

export async function encodeGif(options: {
  width: number;
  height: number;
  frameCount: number;
  getFrame: (index: number) => Uint8ClampedArray;
  delayMs: number;
  colors: number;
  repeat: number;
  transparent: boolean;
  dither: DitherMode;
  onProgress?: (ratio: number) => void;
}): Promise<Uint8Array> {
  const { GIFEncoder, quantize, applyPalette } = await import("gifenc");
  const gif = GIFEncoder();
  const format = options.transparent ? "rgba4444" : "rgb565";
  const colors = Math.max(2, Math.min(256, Math.round(options.colors)));

  for (let i = 0; i < options.frameCount; i += 1) {
    const source = new Uint8ClampedArray(options.getFrame(i));
    dither(source, options.width, options.height, options.dither, colors);
    const sample = new Uint8Array(source);
    const palette = quantize(sample, colors, {
      format,
      oneBitAlpha: options.transparent ? 127 : false,
    });
    const indexed = applyPalette(new Uint8Array(source), palette, format);
    const transparentIndex = options.transparent
      ? palette.findIndex((color) => (color[3] ?? 255) === 0)
      : -1;
    gif.writeFrame(indexed, options.width, options.height, {
      palette,
      delay: options.delayMs,
      repeat: options.repeat,
      transparent: transparentIndex >= 0,
      transparentIndex: Math.max(0, transparentIndex),
      dispose: options.transparent ? 2 : 1,
    });
    options.onProgress?.((i + 1) / options.frameCount);
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  gif.finish();
  return gif.bytes();
}
