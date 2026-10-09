export function FrameCounter({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-muted" role="status">
      <span className="film-label">Frame</span>
      <span className="frame-counter-digit font-mono text-sm text-fg" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
