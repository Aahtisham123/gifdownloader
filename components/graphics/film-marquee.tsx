import { makers, downloaders } from "@/config/tools";

const items = [...downloaders, ...makers].map((tool, index) => ({
  label: tool.navLabel,
  frame: String(index + 1).padStart(2, "0"),
}));

export function FilmMarquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        <Row />
        <Row copy />
      </div>
    </div>
  );
}

function Row({ copy = false }: { copy?: boolean }) {
  return (
    <div className={copy ? "marquee-copy flex" : "flex"}>
      {items.map((item) => (
        <span
          key={`${copy ? "b" : "a"}-${item.frame}`}
          className="film-label flex items-center gap-3 px-4 py-3 text-muted"
        >
          <span className="text-fg">{item.frame}</span>
          {item.label}
          <span aria-hidden="true" className="text-pink">
            ▣
          </span>
        </span>
      ))}
    </div>
  );
}
