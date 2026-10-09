import type { ReactNode } from "react";
import type { IconName } from "@/config/tools";

export function ToolIcon({
  name,
  className = "h-7 w-7",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none">
      {paths[name]}
    </svg>
  );
}

const stroke = {
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const paths: Record<IconName, ReactNode> = {
  download: (
    <>
      <path {...stroke} d="M16 5v13" />
      <path {...stroke} d="M11 14l5 5 5-5" />
      <path {...stroke} d="M7 22h18v4H7z" />
    </>
  ),
  chat: (
    <>
      <path
        {...stroke}
        d="M6 7h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H13l-5 5v-5H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"
      />
      <path {...stroke} d="M12 14l4-3 4 3" />
    </>
  ),
  pin: (
    <>
      <path {...stroke} d="M16 28s8-7.2 8-13a8 8 0 1 0-16 0c0 5.8 8 13 8 13z" />
      <circle cx="16" cy="15" r="2.4" fill="currentColor" />
    </>
  ),
  bubble: (
    <>
      <rect {...stroke} x="5" y="6" width="18" height="14" rx="4" />
      <path {...stroke} d="M11 20l-2 6 7-6" />
      <circle cx="12" cy="13" r="1.2" fill="currentColor" />
      <circle cx="17" cy="13" r="1.2" fill="currentColor" />
    </>
  ),
  frames: (
    <>
      <rect {...stroke} x="6" y="6" width="20" height="6" />
      <rect {...stroke} x="6" y="13" width="20" height="6" />
      <rect {...stroke} x="6" y="20" width="20" height="6" />
    </>
  ),
  heart: (
    <path
      {...stroke}
      d="M16 26s-8-5.2-8-11a4.5 4.5 0 0 1 8-2 4.5 4.5 0 0 1 8 2c0 5.8-8 11-8 11z"
    />
  ),
  meme: (
    <>
      <rect {...stroke} x="5" y="6" width="22" height="20" rx="2" />
      <path {...stroke} d="M9 12h14M9 20h14" />
    </>
  ),
  spark: (
    <path
      {...stroke}
      d="M16 4l1.8 7.2L25 13l-7.2 1.8L16 22l-1.8-7.2L7 13l7.2-1.8L16 4z"
    />
  ),
  checker: (
    <>
      <rect {...stroke} x="6" y="6" width="20" height="20" />
      <path d="M6 16h10V6M16 26V16h10" fill="currentColor" opacity="0.85" />
    </>
  ),
  caption: (
    <>
      <rect {...stroke} x="5" y="6" width="22" height="12" />
      <rect {...stroke} x="5" y="20" width="22" height="6" />
    </>
  ),
  hand: (
    <>
      <path {...stroke} d="M10 16V9m4 6V7m4 8V8m4 8v4" />
      <path {...stroke} d="M8 16h16v6a5 5 0 0 1-5 5h-6a5 5 0 0 1-5-5v-6z" />
    </>
  ),
  type: (
    <>
      <path {...stroke} d="M8 8h16M16 8v16" />
      <path {...stroke} d="M12 24h8" />
    </>
  ),
};
