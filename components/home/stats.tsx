"use client";

import { useEffect, useRef, useState } from "react";
import { downloaders, makers } from "@/config/tools";

function useCount(target: number, active: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const frame = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(frame);
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 1200);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target]);

  return value;
}

const stats = [
  { value: downloaders.length, suffix: "", label: "Downloaders" },
  { value: makers.length, suffix: "", label: "GIF makers" },
  { value: 256, suffix: "", label: "Color limit" },
  { value: 0, suffix: "", label: "Uploads required" },
  { value: null, display: "On device", label: "Encoding" },
];

export function Stats() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setActive(true);
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative z-10 pb-6" aria-label="Gif Downloader at a glance">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-3 px-5 sm:px-6 md:grid-cols-3 xl:grid-cols-5 lg:px-8">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-line bg-card/90 px-5 py-7 sm:px-6">
            {stat.value === null ? (
              <p className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">{stat.display}</p>
            ) : (
              <p className="text-4xl font-semibold tracking-tight">
                <Count value={stat.value} active={active} />
                {stat.suffix}
              </p>
            )}
            <p className="mt-2 text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Count({ value, active }: { value: number; active: boolean }) {
  return useCount(value, active);
}
