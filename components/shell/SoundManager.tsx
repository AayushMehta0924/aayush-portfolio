"use client";

import { useEffect } from "react";

export function SoundManager() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("sound-muted") === null) {
      localStorage.setItem("sound-muted", "true");
    }
  }, []);

  return null;
}
