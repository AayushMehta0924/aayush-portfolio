"use client";

import { useEffect, useState } from "react";

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function KonamiListener() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let buffer: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      buffer.push(key);
      if (buffer.length > SEQUENCE.length) buffer.shift();
      if (
        buffer.length === SEQUENCE.length &&
        SEQUENCE.every((k, i) => buffer[i] === k)
      ) {
        setActive(true);
        buffer = [];
        window.setTimeout(() => setActive(false), 3000);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(168,85,247,0.07) 0, rgba(168,85,247,0.07) 1px, transparent 1px, transparent 3px)",
        }}
      />
      <div className="absolute top-24 left-1/2 -translate-x-1/2 px-4 py-2 border border-violet bg-bg font-mono text-xs text-violet">
        ACHIEVEMENT UNLOCKED — 1980s mode
      </div>
    </div>
  );
}
