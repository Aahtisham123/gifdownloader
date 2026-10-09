export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function safeFilename(name: string, extension: string) {
  const base =
    name
      .trim()
      .replace(/[^a-zA-Z0-9-_]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "framepop";
  return `${base}.${extension}`;
}

export function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "").trim();
  const full =
    value.length === 3
      ? value
          .split("")
          .map((part) => part + part)
          .join("")
      : value;
  const parsed = Number.parseInt(full, 16);
  if (!Number.isFinite(parsed) || full.length !== 6) return [255, 255, 255];
  return [(parsed >> 16) & 255, (parsed >> 8) & 255, parsed & 255];
}

export function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((part) => Math.max(0, Math.min(255, Math.round(part))).toString(16).padStart(2, "0"))
    .join("")}`;
}
