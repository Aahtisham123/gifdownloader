"use client";

import { useState } from "react";
import Link from "next/link";
import { homeFaqs } from "@/config/home-faq";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-28 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-3xl px-5 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-cyan uppercase">Questions</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
            Frequently asked questions
          </h2>
        </div>
        <div className="mt-10 divide-y divide-white/8 overflow-hidden rounded-3xl border border-line bg-card">
          {homeFaqs.map((faq, index) => {
            const expanded = open === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;
            return (
              <div key={faq.question}>
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left font-sans text-base font-semibold sm:px-6"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => setOpen(expanded ? null : index)}
                  >
                    {faq.question}
                    <span className="text-cyan" aria-hidden="true">
                      {expanded ? "–" : "+"}
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-7 text-muted sm:px-6">
                      {faq.answer}
                      {faq.question === "Why is a GIF from Twitter actually a video?" ? (
                        <>
                          {" "}
                          <Link href="/guides/how-to-download-gifs-from-x" className="font-semibold text-fg hover:text-cyan">
                            How to download GIFs from X
                          </Link>
                          .
                        </>
                      ) : null}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
