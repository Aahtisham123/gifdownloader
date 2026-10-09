"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { site } from "@/config/site";

type Errors = {
  name?: string;
  email?: string;
  message?: string;
};

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const honeypot = String(form.get("company_website") ?? "");
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    const next: Errors = {};
    if (name.length < 2) next.name = "Add your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Add a real email address.";
    if (message.length < 20) next.message = "Write at least a sentence so we know what you need.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (honeypot) {
      setSent(true);
      return;
    }

    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const href = `mailto:${site.email}?subject=${encodeURIComponent(`Gif Downloader note from ${name}`)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    setSent(true);
  }

  if (sent) {
    return (
      <p role="status" className="rounded-3xl border border-line bg-card p-5 leading-7">
        If your email app opened, send the draft. If nothing opened, write to {site.email} and include the same note.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="panel relative space-y-4 p-5">
      <div className="absolute -left-[9999px] h-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="company_website">Company website</label>
        <input id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>
      <Field id="name" label="Name" error={errors.name}>
        <input
          id="name"
          name="name"
          required
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          className="field"
        />
      </Field>
      <Field id="email" label="Email" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="field"
        />
      </Field>
      <Field id="message" label="Message" error={errors.message}>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="field"
        />
      </Field>
      <button type="submit" className="btn">
        Send
      </button>
      <p className="text-sm text-muted">
        This opens your email app with the message filled in. Gif Downloader does not store the form on a server.
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <div className="mt-1">{children}</div>
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-sm text-pink" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
