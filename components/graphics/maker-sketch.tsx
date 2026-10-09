import type { SketchName } from "@/config/tools";

export function MakerSketch({
  name,
  id,
  large = false,
}: {
  name: SketchName;
  id: string;
  large?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-line bg-surface ${large ? "h-52" : "h-24"}`}
      aria-hidden="true"
    >
      {name === "heart" ? <Heart id={id} /> : null}
      {name === "meme" ? <Meme /> : null}
      {name === "beloved" ? <Beloved /> : null}
      {name === "transparent" ? <Transparent /> : null}
      {name === "caption" ? <Caption /> : null}
      {name === "pet" ? <Pet /> : null}
      {name === "text" ? <TextWave /> : null}
    </div>
  );
}

function Heart({ id }: { id: string }) {
  const clip = `${id}-heart`;
  return (
    <svg viewBox="0 0 120 100" className="h-full w-full">
      <defs>
        <clipPath id={clip}>
          <path d="M60 90C18 62 8 40 24 24 36 12 52 18 60 32 68 18 84 12 96 24 112 40 102 62 60 90Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <rect width="60" height="100" fill="#BE123C" />
        <rect x="60" width="60" height="100" fill="#FF8FB3" />
        <rect className="sketch-shine" x="0" y="0" width="28" height="100" fill="#fff" opacity="0.28" />
      </g>
      <path
        d="M60 90C18 62 8 40 24 24 36 12 52 18 60 32 68 18 84 12 96 24 112 40 102 62 60 90Z"
        fill="none"
        stroke="#0E0B1A"
        strokeWidth="3"
      />
    </svg>
  );
}

function Meme() {
  return (
    <div className="flex h-full flex-col items-center justify-between px-3 py-2 text-center">
      <p className="text-[10px] font-black tracking-wide text-ink sm:text-xs">TOP TEXT</p>
      <div className="h-8 w-16 rounded-md bg-violet/80" />
      <p className="text-[10px] font-black tracking-wide text-ink sm:text-xs">BOTTOM TEXT</p>
    </div>
  );
}

function Beloved() {
  return (
    <div className="relative flex h-full items-center justify-center">
      <span className="sketch-float absolute left-3 top-3 text-pink">♥</span>
      <span className="sketch-float absolute right-4 bottom-3 text-violet" style={{ animationDelay: "0.4s" }}>
        ✦
      </span>
      <p className="font-display text-lg text-pink italic">my beloved</p>
    </div>
  );
}

function Transparent() {
  return (
    <div className="checkerboard flex h-full items-center justify-center">
      <span className="text-3xl text-violet">✦</span>
    </div>
  );
}

function Caption() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 bg-violet/25" />
      <div className="bg-cream px-2 py-1.5 text-center text-[11px] font-semibold text-ink">
        caption on a bar
      </div>
    </div>
  );
}

function Pet() {
  return (
    <div className="relative flex h-full items-end justify-center pb-3">
      <svg viewBox="0 0 40 28" className="sketch-hand absolute top-1 h-8 w-10 text-fg">
        <path
          d="M8 16c0-6 3-8 4-8s2 3 2 6M18 14c0-7 2-9 3-9s2 3 2 8M26 15c0-6 2-8 3-8s2 3 2 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M6 16h28v6a6 6 0 0 1-6 6H12a6 6 0 0 1-6-6z" fill="currentColor" />
      </svg>
      <div className="sketch-squish h-10 w-10 rounded-full bg-pink" />
    </div>
  );
}

function TextWave() {
  const letters = ["H", "I", "Y", "A"];
  return (
    <div className="sketch-wave flex h-full items-center justify-center gap-1 font-display text-2xl font-bold text-ink">
      {letters.map((letter, index) => (
        <span key={letter} style={{ animationDelay: `${index * 0.12}s` }}>
          {letter}
        </span>
      ))}
    </div>
  );
}
