"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-start gap-5 px-4 py-20 sm:px-6">
      <p className="text-sm font-medium text-muted">Something went wrong</p>
      <h1 className="text-4xl font-semibold">This page did not finish loading.</h1>
      <p className="max-w-xl text-lg leading-8 text-muted">
        Try it again. If it keeps failing, include the reference below with your note.
      </p>
      {error.digest ? <p className="text-sm text-muted">Reference {error.digest}</p> : null}
      <button type="button" onClick={reset} className="btn">
        Try again
      </button>
    </div>
  );
}
