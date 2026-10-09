import { decompressFrames, parseGIF } from "gifuct-js";
import { mediaPolicy } from "@/config/platforms";

export async function framesFromFile(
  file: File,
  options?: { fps?: number; maxFrames?: number },
): Promise<HTMLCanvasElement[]> {
  const video = file.type.startsWith("video/");
  const limit = video ? mediaPolicy.videoMaxBytes : mediaPolicy.imageMaxBytes;
  if (file.size > limit) {
    throw new Error(`That file is larger than the ${video ? "video" : "image"} limit.`);
  }
  if (file.type === "image/gif" || file.name.toLowerCase().endsWith(".gif")) {
    return decodeGif(file);
  }
  if (video) {
    return sampleVideo(file, {
      fps: options?.fps ?? 10,
      maxFrames: options?.maxFrames ?? 48,
    });
  }
  const image = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth || 1;
  canvas.height = image.naturalHeight || 1;
  canvas.getContext("2d")?.drawImage(image, 0, 0);
  return [canvas];
}

async function loadImage(file: Blob) {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.decoding = "async";
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("That image could not be opened."));
      image.src = url;
    });
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function decodeGif(file: Blob) {
  const gif = parseGIF(await file.arrayBuffer());
  const frames = decompressFrames(gif, true);
  const width = gif.lsd.width || 1;
  const height = gif.lsd.height || 1;
  const composite = document.createElement("canvas");
  composite.width = width;
  composite.height = height;
  const ctx = composite.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("This browser could not draw the GIF.");
  let previous = ctx.getImageData(0, 0, width, height);
  const output: HTMLCanvasElement[] = [];

  for (const frame of frames) {
    if (frame.disposalType === 2) {
      ctx.clearRect(frame.dims.left, frame.dims.top, frame.dims.width, frame.dims.height);
    }
    const patch = document.createElement("canvas");
    patch.width = frame.dims.width || 1;
    patch.height = frame.dims.height || 1;
    patch
      .getContext("2d")
      ?.putImageData(new ImageData(new Uint8ClampedArray(frame.patch), patch.width, patch.height), 0, 0);
    ctx.drawImage(patch, frame.dims.left, frame.dims.top);
    const snap = document.createElement("canvas");
    snap.width = width;
    snap.height = height;
    snap.getContext("2d")?.drawImage(composite, 0, 0);
    output.push(snap);
    if (frame.disposalType === 3) ctx.putImageData(previous, 0, 0);
    else previous = ctx.getImageData(0, 0, width, height);
    if (output.length >= mediaPolicy.frameWarning) break;
  }

  if (output.length === 0) throw new Error("That GIF has no frames.");
  return output;
}

async function sampleVideo(
  file: Blob,
  options: { fps: number; maxFrames: number },
) {
  const url = URL.createObjectURL(file);
  try {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = url;
    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error("That video could not be opened."));
    });
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    const count = Math.min(
      options.maxFrames,
      Math.max(1, Math.floor(duration * options.fps) || 1),
    );
    const frames: HTMLCanvasElement[] = [];
    for (let index = 0; index < count; index += 1) {
      const time = Math.min(Math.max(0, duration - 0.05), index / options.fps);
      await seek(video, time);
      const snap = document.createElement("canvas");
      snap.width = video.videoWidth || 1;
      snap.height = video.videoHeight || 1;
      snap.getContext("2d")?.drawImage(video, 0, 0);
      frames.push(snap);
    }
    return frames;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function seek(video: HTMLVideoElement, time: number) {
  return new Promise<void>((resolve) => {
    if (Math.abs(video.currentTime - time) < 0.001) {
      resolve();
      return;
    }
    const done = () => {
      video.removeEventListener("seeked", done);
      resolve();
    };
    video.addEventListener("seeked", done);
    video.currentTime = time;
  });
}
