"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(pointer: fine)");
    const apply = () => {
      const fine = mq.matches;
      setEnabled(fine);
      document.body.classList.toggle("has-custom-cursor", fine);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let tx = -100,
      ty = -100,
      x = -100,
      y = -100;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const tick = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${x - 12}px, ${y - 12}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div
      ref={ringRef}
      aria-hidden
      className="fixed top-0 left-0 w-6 h-6 pointer-events-none z-[9999] rounded-full border border-violet mix-blend-difference"
      style={{ transform: "translate3d(-100px, -100px, 0)" }}
    />
  );
}
