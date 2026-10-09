"use client";

import { useState } from "react";

export function ShareBar({ title, path }: { title: string; path: string }) {
  const [note, setNote] = useState("");

  async function copy() {
    const url = `${window.location.origin}${path}`;
    try {
      await navigator.clipboard.writeText(url);
      setNote("Link copied.");
    } catch {
      setNote("Copy the address from the browser bar.");
    }
  }

  async function share() {
    const url = `${window.location.origin}${path}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        return;
      }
    }
    await copy();
  }

  function postOnX() {
    const url = `${window.location.origin}${path}`;
    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    window.open(intent, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={share} className="btn btn-ghost min-h-9 px-3 text-sm">
        Share
      </button>
      <button type="button" onClick={copy} className="btn btn-ghost min-h-9 px-3 text-sm">
        Copy link
      </button>
      <button type="button" onClick={postOnX} className="btn btn-ghost min-h-9 px-3 text-sm">
        Post on X
      </button>
      <span className="text-sm text-muted" role="status">
        {note}
      </span>
    </div>
  );
}
