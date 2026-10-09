import Link from "next/link";
import { downloaders, makerHub, makers } from "@/config/tools";
import { getArticles } from "@/config/articles";
import { site } from "@/config/site";
import { Logo } from "@/components/ui/logo";

const legal = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/dmca", label: "DMCA" },
];

export function Footer() {
  const guides = getArticles("guide").slice(0, 5);
  return (
    <footer className="mt-auto border-t border-line bg-bg-2">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Logo id="footer" />
          <p className="mt-4 max-w-xs text-sm leading-6 text-muted">{site.tagline}</p>
        </div>
        <LinkColumn title="Downloaders" links={downloaders.map((tool) => ({ href: tool.href, label: tool.navLabel }))} />
        <LinkColumn
          title="GIF makers"
          links={[makerHub, ...makers].map((tool) => ({ href: tool.href, label: tool.navLabel }))}
        />
        <div>
          <p className="text-sm font-semibold">Guides</p>
          <ul className="mt-4 space-y-2.5">
            {guides.map((guide) => (
              <li key={guide.slug}>
                <Link href={`/guides/${guide.slug}`} className="text-sm text-muted transition hover:text-fg">
                  {guide.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/guides" className="text-sm text-muted transition hover:text-fg">
                All guides
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-sm text-muted transition hover:text-fg">
                Blog
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-6 text-sm text-muted sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>
            © 2026 {site.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-fg">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-muted transition hover:text-fg">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
