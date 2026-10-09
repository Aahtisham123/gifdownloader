export function StudioPanel() {
  return (
    <div className="relative mx-auto h-[460px] w-full max-w-[560px] sm:h-[520px]" aria-hidden="true">
      <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/25 blur-3xl" />
      <div className="absolute inset-x-6 top-16 bottom-14 rounded-[1.7rem] border border-white/10 bg-[#0d1117]/80 p-4 shadow-[0_30px_80px_-40px_rgb(99_102_241_/_0.8)] backdrop-blur-xl sm:inset-x-10 sm:p-5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="ml-3 h-6 flex-1 rounded-full bg-white/5" />
        </div>
        <p className="mt-6 text-[0.68rem] font-semibold tracking-[0.18em] text-cyan uppercase">Frame loop</p>
        <p className="mt-2 font-display text-2xl text-white">Loop health</p>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            ["12", "fps"],
            ["128", "colors"],
            ["0", "uploads"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl border border-white/8 bg-white/5 px-3 py-3">
              <p className="font-display text-xl text-white">{value}</p>
              <p className="mt-1 text-[11px] text-muted">{label}</p>
            </div>
          ))}
        </div>
        <svg viewBox="0 0 320 110" className="mt-5 w-full">
          <path
            d="M8 82 C 40 80, 48 48, 78 50 S 120 86, 150 62 S 200 20, 230 34 S 280 70, 312 28"
            fill="none"
            stroke="url(#hero-line)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="hero-line" x1="0" y1="0" x2="320" y2="0">
              <stop stopColor="#6366F1" />
              <stop offset="1" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
        </svg>
        <div className="mt-2 flex items-end gap-2">
          {[36, 52, 44, 70, 62, 84, 76].map((height) => (
            <span
              key={height}
              className="flex-1 rounded-t-md bg-gradient-to-t from-accent/80 to-cyan/70"
              style={{ height }}
            />
          ))}
        </div>
      </div>
      <div className="float-slow absolute top-6 left-0 w-40 rounded-2xl border border-white/10 bg-[#111827]/90 p-3 shadow-xl backdrop-blur-md">
        <p className="text-[11px] text-muted">File size</p>
        <p className="mt-1 font-display text-lg text-white">In range</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <span className="block h-full w-[86%] rounded-full bg-cyan" />
        </div>
      </div>
      <div className="float-slower absolute top-8 right-0 w-44 rounded-2xl border border-white/10 bg-[#111827]/90 p-3 shadow-xl backdrop-blur-md">
        <p className="text-[11px] text-muted">Preview</p>
        <p className="mt-1 font-display text-lg text-white">On device</p>
        <p className="mt-1 text-[11px] text-cyan">Nothing uploaded</p>
      </div>
      <div className="float-slow float-delay absolute right-2 bottom-6 w-44 rounded-2xl border border-white/10 bg-[#111827]/90 p-3 shadow-xl backdrop-blur-md">
        <p className="text-[11px] text-muted">Export</p>
        <p className="mt-1 font-display text-lg text-white">GIF, MP4, PNG</p>
        <p className="mt-1 text-[11px] text-muted">No watermark</p>
      </div>
    </div>
  );
}
