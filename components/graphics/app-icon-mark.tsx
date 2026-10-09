export function AppIconMark({ size }: { size: number }) {
  const radius = Math.round(size * 0.28);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 55%, #06B6D4 100%)",
        borderRadius: radius,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <path
          d="M18 16h8M16 18v8M38 16h8M48 18v8M18 48h8M16 38v8M38 48h8M48 38v8"
          stroke="white"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <path
          d="M32 24v16"
          stroke="white"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <path
          d="M24 34.5 32 43.5 40 34.5"
          stroke="white"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
