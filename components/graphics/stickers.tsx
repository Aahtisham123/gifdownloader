import type { CSSProperties } from "react";

export function HeroStickers() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <Star className="sticker left-[6%] top-[18%] hidden h-10 w-10 text-lime sm:block" style={{ ["--dx" as string]: "16px", ["--dy" as string]: "10px" }} />
      <Heart className="sticker right-[8%] top-[22%] h-9 w-9 text-pink" style={{ ["--dx" as string]: "-18px", ["--dy" as string]: "12px", animationDelay: "0.6s" }} />
      <Frame className="sticker bottom-[18%] left-[12%] hidden h-12 w-12 text-violet md:block" style={{ ["--dx" as string]: "10px", ["--dy" as string]: "-14px", animationDelay: "1s" }} />
      <Spark className="sticker right-[14%] bottom-[20%] h-8 w-8 text-violet" style={{ ["--dx" as string]: "-12px", ["--dy" as string]: "-8px", animationDelay: "0.3s" }} />
    </div>
  );
}

function Star({ className, style }: StickerProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={style}>
      <path fill="currentColor" d="M16 2l2.4 8.2L27 13l-8.6 2.2L16 24l-2.4-8.8L5 13l8.6-2.8L16 2z" />
    </svg>
  );
}

function Heart({ className, style }: StickerProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={style}>
      <path
        fill="currentColor"
        d="M16 28s-9-6-9-13a5 5 0 0 1 9-2 5 5 0 0 1 9 2c0 7-9 13-9 13z"
      />
    </svg>
  );
}

function Frame({ className, style }: StickerProps) {
  return (
    <svg viewBox="0 0 40 32" className={className} style={style}>
      <rect x="2" y="4" width="36" height="24" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="8" cy="10" r="1.4" fill="currentColor" />
      <circle cx="8" cy="16" r="1.4" fill="currentColor" />
      <circle cx="8" cy="22" r="1.4" fill="currentColor" />
      <circle cx="32" cy="10" r="1.4" fill="currentColor" />
      <circle cx="32" cy="16" r="1.4" fill="currentColor" />
      <circle cx="32" cy="22" r="1.4" fill="currentColor" />
    </svg>
  );
}

function Spark({ className, style }: StickerProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={style}>
      <path fill="currentColor" d="M16 0l2 10 10 2-10 2-2 10-2-10L4 12l10-2L16 0z" />
    </svg>
  );
}

type StickerProps = {
  className?: string;
  style?: CSSProperties;
};
