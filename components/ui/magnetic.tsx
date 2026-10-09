"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

export function Magnetic({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);

  function onMove(event: PointerEvent<HTMLSpanElement>) {
    if (reduce || event.pointerType !== "mouse" || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    const x = event.clientX - (box.left + box.width / 2);
    const y = event.clientY - (box.top + box.height / 2);
    ref.current.style.transform = `translate(${(x * 0.2).toFixed(1)}px, ${(y * 0.28).toFixed(1)}px)`;
  }

  function onLeave() {
    if (ref.current) ref.current.style.transform = "";
  }

  return (
    <span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`inline-flex transition-transform duration-150 ${className}`}
    >
      {children}
    </span>
  );
}
