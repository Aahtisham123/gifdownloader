"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { downloaders, makerHub, makers } from "@/config/tools";
import { ToolIcon } from "@/components/graphics/tool-icon";
import { Logo } from "@/components/ui/logo";

const links = [
  { href: "/guides", label: "Guides" },
  { href: "/blog", label: "Blog" },
] as const;

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const [seenPath, setSeenPath] = useState(pathname);
  if (pathname !== seenPath) {
    setSeenPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`border-b transition duration-300 ${
          scrolled || menuOpen
            ? "border-line bg-bg/75 shadow-[0_10px_40px_-24px_rgb(0_0_0_/_0.8)] backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
      <div className="mx-auto flex h-[4.25rem] w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
        <Logo id="header" />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          <Dropdown label="Downloaders" pathname={pathname} items={downloaders.map(toItem)} />
          <Dropdown
            label="GIF makers"
            pathname={pathname}
            items={[toItem(makerHub), ...makers.map(toItem)]}
          />
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname.startsWith(link.href) ? "page" : undefined}
              className="rounded-full px-3 py-2 text-sm text-muted transition hover:text-fg aria-[current=page]:text-fg"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/gif-downloader" className="btn ml-2 min-h-10 px-4">
            Find a GIF
          </Link>
        </nav>
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-card"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <MenuGlyph open={menuOpen} />
          </button>
        </div>
      </div>
      </div>
      <MobileMenu open={menuOpen} onClose={closeMenu} pathname={pathname} />
    </header>
  );
}

export function HeaderShell() {
  return <div className="fixed inset-x-0 top-0 z-50 h-[4.25rem] border-b border-transparent" />;
}

function toItem(tool: { href: string; navLabel: string; icon: Parameters<typeof ToolIcon>[0]["name"] }) {
  return { href: tool.href, label: tool.navLabel, icon: tool.icon };
}

function Dropdown({
  label,
  items,
  pathname,
}: {
  label: string;
  pathname: string;
  items: { href: string; label: string; icon: Parameters<typeof ToolIcon>[0]["name"] }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const active = items.some((item) => pathname === item.href);

  useEffect(() => {
    if (!open) return;
    function onPointer(event: PointerEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="rounded-full px-3 py-2 text-sm text-muted transition hover:text-fg aria-[current=page]:text-fg"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-current={active ? "page" : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        {label}
      </button>
      {open ? (
        <div className="absolute left-0 top-full z-50 pt-2">
          <ul
            id={menuId}
            role="menu"
            className="w-60 rounded-2xl border border-line bg-card p-2 shadow-[0_24px_60px_-32px_rgb(0_0_0_/_0.8)]"
          >
            {items.map((item) => (
              <li key={item.href} role="none">
                <Link
                  href={item.href}
                  role="menuitem"
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-surface aria-[current=page]:bg-surface"
                  onClick={() => setOpen(false)}
                >
                  <ToolIcon name={item.icon} className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function MobileMenu({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="max-h-[calc(100dvh-4.25rem)] overflow-y-auto border-b border-line bg-bg lg:hidden"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <p id={titleId} className="text-base font-semibold">
            Menu
          </p>
          <button type="button" className="rounded-full border border-line px-3 py-1 text-sm" onClick={onClose}>
            Close
          </button>
        </div>
        <MenuGroup title="Downloaders" pathname={pathname} items={downloaders.map(toItem)} onNavigate={onClose} />
        <MenuGroup
          title="GIF makers"
          pathname={pathname}
          items={[toItem(makerHub), ...makers.map(toItem)]}
          onNavigate={onClose}
        />
        <div className="flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-2 py-2 font-semibold hover:bg-surface"
              aria-current={pathname.startsWith(link.href) ? "page" : undefined}
              onClick={onClose}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MenuGroup({
  title,
  items,
  pathname,
  onNavigate,
}: {
  title: string;
  pathname: string;
  items: { href: string; label: string; icon: Parameters<typeof ToolIcon>[0]["name"] }[];
  onNavigate: () => void;
}) {
  return (
    <div>
      <p className="film-label mb-2 text-muted">{title}</p>
      <ul className="flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex items-center gap-2 rounded-xl px-2 py-2 font-semibold hover:bg-surface"
              aria-current={pathname === item.href ? "page" : undefined}
              onClick={onNavigate}
            >
              <ToolIcon name={item.icon} className="h-5 w-5" />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MenuGlyph({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none">
      {open ? (
        <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      )}
    </svg>
  );
}
