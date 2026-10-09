type MascotProps = {
  size?: number;
  pose?: "idle" | "lost";
  className?: string;
  title?: string;
};

export function Mascot({
  size = 88,
  pose = "idle",
  className,
  title = "Flick, the Framepop mascot, a creature made of film frames",
}: MascotProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 96"
      className={className}
      role="img"
      aria-label={title}
      shapeRendering="crispEdges"
    >
      <g className={pose === "lost" ? "origin-center -rotate-6" : undefined}>
        <rect x="34" y="2" width="12" height="10" rx="1" fill="#7C3AED" />
        <circle cx="37" cy="6" r="1.3" fill="#FFF8EE" />
        <circle cx="43" cy="6" r="1.3" fill="#FFF8EE" />
        <rect x="12" y="14" width="56" height="22" rx="2" fill="#7C3AED" />
        <circle cx="18" cy="20" r="2" fill="#FFF8EE" />
        <circle cx="18" cy="30" r="2" fill="#FFF8EE" />
        <circle cx="62" cy="20" r="2" fill="#FFF8EE" />
        <circle cx="62" cy="30" r="2" fill="#FFF8EE" />
        <rect x="28" y="20" width="8" height="8" fill="#FFF8EE" />
        <rect x="44" y="20" width="8" height="8" fill="#FFF8EE" />
        <rect className="mascot-pupil" x="30" y="22" width="4" height="5" fill="var(--fg)" />
        <rect className="mascot-pupil" x="46" y="22" width="4" height="5" fill="var(--fg)" />
        <rect x="12" y="38" width="56" height="18" fill="#6D28D9" />
        <circle cx="18" cy="43" r="2" fill="#FFF8EE" />
        <circle cx="18" cy="51" r="2" fill="#FFF8EE" />
        <circle cx="62" cy="43" r="2" fill="#FFF8EE" />
        <circle cx="62" cy="51" r="2" fill="#FFF8EE" />
        {pose === "lost" ? (
          <text x="40" y="52" textAnchor="middle" fontSize="12" fontFamily="ui-monospace, monospace" fill="#C6FF3D">
            ?
          </text>
        ) : (
          <path d="M30 48h20" stroke="#FFF8EE" strokeWidth="2" />
        )}
        <rect x="12" y="58" width="56" height="16" fill="#7C3AED" />
        <circle cx="18" cy="63" r="2" fill="#FFF8EE" />
        <circle cx="18" cy="70" r="2" fill="#FFF8EE" />
        <circle cx="62" cy="63" r="2" fill="#FFF8EE" />
        <circle cx="62" cy="70" r="2" fill="#FFF8EE" />
        <rect x="36" y="62" width="8" height="8" fill="#C6FF3D" />
        <rect x="22" y="78" width="12" height="8" fill="var(--fg)" />
        <rect x="46" y="78" width="12" height="8" fill="var(--fg)" />
      </g>
    </svg>
  );
}
