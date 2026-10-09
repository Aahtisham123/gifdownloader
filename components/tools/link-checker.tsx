"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { classifyUrl, type ClassifyResult } from "@/lib/classify-url";
import type { Tool } from "@/config/tools";
import { Mascot } from "@/components/graphics/mascot";

export function LinkCheckerForm({ tool, initialUrl }: { tool: Tool; initialUrl: string }) {
  const [draft, setDraft] = useState(initialUrl);
  const [checked, setChecked] = useState(initialUrl);
  const result: ClassifyResult | null = checked ? classifyUrl(checked) : null;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setChecked(draft.trim());
  }

  const matches = result?.ok === true && result.href === tool.href;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <form onSubmit={onSubmit} className="rounded-3xl border border-line bg-card p-4 sm:p-5">
        <label htmlFor="media-url" className="film-label text-muted">
          Page or file link
        </label>
        <input
          id="media-url"
          name="url"
          type="url"
          inputMode="url"
          autoComplete="off"
          placeholder="https://"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-line bg-bg px-4 py-3 text-base outline-none"
        />
        <button
          type="submit"
          className="mt-3 inline-flex min-h-11 items-center justify-center rounded-full px-5 font-bold"
          style={{ background: tool.accent, color: tool.onAccent }}
        >
          Check this link
        </button>
        <p className="mt-3 text-sm leading-6 text-muted">
          This check identifies the link. It does not download the file yet.
        </p>
      </form>
      <div className="flex min-h-48 flex-col justify-between gap-4 rounded-3xl border border-line bg-surface p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Mascot size={64} pose={result && !result.ok ? "lost" : "idle"} />
          <div>
            <p className="film-label text-muted">Frame check</p>
            <ResultMessage tool={tool} result={result} matches={matches} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultMessage({
  tool,
  result,
  matches,
}: {
  tool: Tool;
  result: ClassifyResult | null;
  matches: boolean;
}) {
  if (!result) {
    return (
      <p className="mt-2 text-sm leading-6">
        Paste a public link to see whether it belongs on {tool.name}.
      </p>
    );
  }
  if (!result.ok) {
    return (
      <p className="mt-2 text-sm leading-6" role="alert">
        {result.message}
      </p>
    );
  }
  if (!matches) {
    return (
      <div className="mt-2 space-y-2 text-sm leading-6">
        <p>
          This looks like a {result.source}. It belongs on the {result.toolName}.
        </p>
        <p>{result.detail}</p>
        <Link
          href={`${result.href}?url=${encodeURIComponent(result.normalized)}`}
          className="inline-flex font-semibold text-violet underline"
        >
          Open {result.toolName}
        </Link>
      </div>
    );
  }
  return (
    <div className="mt-2 space-y-2 text-sm leading-6" role="status">
      <p className="font-semibold">This link matches {tool.name}.</p>
      <p>
        {result.source}. {result.detail}
      </p>
    </div>
  );
}
