"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

export function ReadingProgress() {
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const article = document.getElementById("article");
    if (!article) return;

    function onScroll() {
      if (!article) return;
      const start = article.offsetTop;
      const height = article.offsetHeight - window.innerHeight;
      const next = height <= 0 ? 0 : Math.min(1, Math.max(0, (window.scrollY - start) / height));
      setProgress(next);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="reading-progress"
      aria-hidden="true"
      style={{
        transform: `scaleX(${progress})`,
        transition: reduce ? "none" : "transform 80ms linear",
      }}
    />
  );
}
