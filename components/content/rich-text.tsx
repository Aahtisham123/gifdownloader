import Link from "next/link";

export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, index) => {
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (!match) return <span key={index}>{part}</span>;
        const label = match[1] ?? part;
        const href = match[2] ?? "/";
        if (!href.startsWith("/") || href.startsWith("//")) {
          return <span key={index}>{label}</span>;
        }
        return (
          <Link key={index} href={href}>
            {label}
          </Link>
        );
      })}
    </>
  );
}
