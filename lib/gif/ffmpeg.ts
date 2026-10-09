const WORKER = `
import { FFmpeg } from "https://unpkg.com/@ffmpeg/ffmpeg@0.12.15/dist/esm/index.js";
import { toBlobURL } from "https://unpkg.com/@ffmpeg/util@0.12.2/dist/esm/index.js";

let loading;
function load() {
  if (!loading) {
    loading = (async () => {
      const ffmpeg = new FFmpeg();
      const base = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";
      await ffmpeg.load({
        coreURL: await toBlobURL(base + "/ffmpeg-core.js", "text/javascript"),
        wasmURL: await toBlobURL(base + "/ffmpeg-core.wasm", "application/wasm"),
      });
      ffmpeg.on("progress", ({ progress }) => {
        self.postMessage({ type: "progress", ratio: progress || 0 });
      });
      return ffmpeg;
    })();
  }
  return loading;
}

self.onmessage = async (event) => {
  try {
    const ffmpeg = await load();
    const job = event.data;
    if (job.kind === "mp4-gif") {
      const width = Math.max(16, job.width - (job.width % 2));
      await ffmpeg.writeFile("input.mp4", new Uint8Array(job.file));
      const args = ["-ss", String(Math.max(0, job.start))];
      if (job.end > job.start) args.push("-to", String(job.end));
      args.push(
        "-i",
        "input.mp4",
        "-vf",
        "fps=" + job.fps + ",scale=" + width + ":-2:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse",
        "-loop",
        "0",
        "out.gif",
      );
      await ffmpeg.exec(args);
      const data = await ffmpeg.readFile("out.gif");
      await ffmpeg.deleteFile("input.mp4").catch(() => undefined);
      await ffmpeg.deleteFile("out.gif").catch(() => undefined);
      const bytes = data instanceof Uint8Array ? new Uint8Array(data) : new TextEncoder().encode(data);
      self.postMessage({ type: "done", bytes, mime: "image/gif" }, [bytes.buffer]);
      return;
    }
    await ffmpeg.writeFile("in.raw", new Uint8Array(job.frames));
    await ffmpeg.exec([
      "-f", "rawvideo", "-pix_fmt", "rgba", "-s", job.width + "x" + job.height,
      "-r", String(job.fps), "-i", "in.raw", "-c:v", "libx264", "-pix_fmt", "yuv420p",
      "-movflags", "+faststart", "out.mp4",
    ]);
    const data = await ffmpeg.readFile("out.mp4");
    await ffmpeg.deleteFile("in.raw").catch(() => undefined);
    await ffmpeg.deleteFile("out.mp4").catch(() => undefined);
    const bytes = data instanceof Uint8Array ? new Uint8Array(data) : new TextEncoder().encode(data);
    self.postMessage({ type: "done", bytes, mime: "video/mp4" }, [bytes.buffer]);
  } catch {
    self.postMessage({ type: "error" });
  }
};
`;

let workerUrl: string | null = null;

function converterUrl() {
  if (!workerUrl) {
    workerUrl = URL.createObjectURL(new Blob([WORKER], { type: "text/javascript" }));
  }
  return workerUrl;
}

function runConverter(
  payload: Record<string, unknown>,
  transfer: ArrayBuffer[],
  onProgress?: (ratio: number) => void,
) {
  return new Promise<Blob>((resolve, reject) => {
    const worker = new Worker(converterUrl(), { type: "module" });
    worker.onmessage = (event: MessageEvent<{ type: string; ratio?: number; bytes?: Uint8Array; mime?: string }>) => {
      if (event.data.type === "progress") onProgress?.(event.data.ratio ?? 0);
      if (event.data.type === "done" && event.data.bytes && event.data.mime) {
        const bytes = new Uint8Array(event.data.bytes);
        resolve(new Blob([bytes], { type: event.data.mime }));
        worker.terminate();
      }
      if (event.data.type === "error") {
        reject(new Error("The video converter could not run."));
        worker.terminate();
      }
    };
    worker.onerror = () => {
      reject(new Error("The video converter could not run."));
      worker.terminate();
    };
    worker.postMessage(payload, transfer);
  });
}

export function mp4BlobToGif(
  file: Blob,
  options: { fps: number; width: number; start: number; end: number },
  onProgress?: (ratio: number) => void,
) {
  return file.arrayBuffer().then((buffer) =>
    runConverter(
      {
        kind: "mp4-gif",
        file: buffer,
        fps: options.fps,
        width: options.width,
        start: options.start,
        end: options.end,
      },
      [buffer],
      onProgress,
    ),
  );
}

export function rawFramesToMp4(
  frames: Uint8Array,
  options: { width: number; height: number; fps: number },
  onProgress?: (ratio: number) => void,
) {
  const copy = new Uint8Array(frames);
  return runConverter(
    {
      kind: "raw-mp4",
      frames: copy.buffer,
      width: options.width,
      height: options.height,
      fps: options.fps,
    },
    [copy.buffer],
    onProgress,
  );
}
