"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { playTypeBeep } from "@/lib/sounds";

const LINES = [
  "> initializing system...",
  "> loading identity...",
  "> mounting hobbies...",
  "> ./aayush_mehta.exe",
];

const SESSION_KEY = "boot-intro-played";
const TYPE_MS = 28;
const LINE_DELAY_MS = 160;

type Phase = "boot" | "resolved";

export function BootIntro() {
  const [phase, setPhase] = useState<Phase>("boot");
  const [typed, setTyped] = useState<string[]>([""]);
  const skippedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      setPhase("resolved");
      return;
    }

    let cancelled = false;
    const run = async () => {
      const out: string[] = [];
      for (let i = 0; i < LINES.length; i++) {
        const line = LINES[i];
        out.push("");
        for (let j = 0; j < line.length; j++) {
          if (cancelled || skippedRef.current) return;
          out[i] = line.slice(0, j + 1);
          setTyped([...out]);
          if (j % 2 === 0) playTypeBeep().catch(() => {});
          await sleep(TYPE_MS);
        }
        if (cancelled || skippedRef.current) return;
        await sleep(LINE_DELAY_MS);
      }
      if (cancelled || skippedRef.current) return;
      await sleep(360);
      if (cancelled) return;
      sessionStorage.setItem(SESSION_KEY, "1");
      setPhase("resolved");
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const skip = () => {
    if (skippedRef.current) return;
    skippedRef.current = true;
    sessionStorage.setItem(SESSION_KEY, "1");
    setPhase("resolved");
  };

  return (
    <section className="relative min-h-[88vh] flex items-center justify-center px-6 overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === "boot" ? (
          <motion.div
            key="boot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            className="font-mono text-sm sm:text-base text-fg max-w-2xl w-full"
          >
            {typed.map((line, i) => (
              <p key={i} className="leading-relaxed whitespace-pre">
                <span className="text-violet">{line.slice(0, 2)}</span>
                <span>{line.slice(2)}</span>
                {i === typed.length - 1 && <BlinkingCaret />}
              </p>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="resolved"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="text-center space-y-4"
          >
            <motion.h1
              initial={{ letterSpacing: "0.4em", opacity: 0 }}
              animate={{ letterSpacing: "-0.02em", opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans font-semibold text-5xl sm:text-7xl md:text-8xl text-fg"
            >
              AAYUSH MEHTA
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="font-mono text-xs sm:text-sm text-muted tracking-wider"
            >
              <span className="text-cyan">~</span> data + ai + cloud engineer
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "boot" && (
        <button
          type="button"
          onClick={skip}
          className="absolute top-24 right-6 font-mono text-[10px] text-muted hover:text-fg transition-colors"
          aria-label="Skip boot intro"
        >
          [skip ↵]
        </button>
      )}
    </section>
  );
}

function BlinkingCaret() {
  return (
    <motion.span
      aria-hidden
      className="inline-block w-[0.6ch] h-[1em] align-text-bottom bg-violet ml-0.5"
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 0.9, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
    />
  );
}

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}
