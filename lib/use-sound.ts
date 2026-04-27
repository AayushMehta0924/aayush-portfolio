"use client";

import { useEffect, useState } from "react";

const KEY = "sound-muted";
const EVENT = "sound-muted-change";

export function useSoundMuted(): [boolean, (value: boolean) => void] {
  const [muted, setMutedState] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    setMutedState(stored === null ? true : stored === "true");

    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<boolean>).detail;
      setMutedState(detail);
    };
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
  }, []);

  const setMuted = (value: boolean) => {
    localStorage.setItem(KEY, String(value));
    setMutedState(value);
    window.dispatchEvent(new CustomEvent<boolean>(EVENT, { detail: value }));
  };

  return [muted, setMuted];
}
