import Link from "next/link";
import { site } from "@/config/site";

export function Logo({ id = "mark" }: { id?: string }) {
  const gradientId = `${id}-mark`;

  return (
    <Link href="/" className="inline-flex min-w-0 items-center gap-2.5 rounded-lg" aria-label={`${site.name} home`}>
      <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="4" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6366F1" />
            <stop offset="0.55" stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill={`url(#${gradientId})`} />
        <path d="M8 11.2h16" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M10.5 16h11" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
        <path d="M13 20.8h6" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
      </svg>
      <span className="truncate font-display text-[1.05rem] font-semibold tracking-tight text-fg sm:text-[1.15rem]">{site.name}</span>
    </Link>
  );
}
