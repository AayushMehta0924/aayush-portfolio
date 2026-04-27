"use client";

import { useEffect } from "react";
import { ensureStarted } from "@/lib/sounds";

export function SoundManager() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("sound-muted") === null) {
      localStorage.setItem("sound-muted", "true");
    }

    // Tone.js needs to start inside a user gesture. Resume the audio context
    // on the first interaction; this is a no-op if the user keeps it muted.
    const onGesture = () => {
      ensureStarted().catch(() => {});
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
    };
    window.addEventListener("pointerdown", onGesture, { once: true });
    window.addEventListener("keydown", onGesture, { once: true });
    return () => {
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
    };
  }, []);

  return null;
}
