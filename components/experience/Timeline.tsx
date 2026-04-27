"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { EXPERIENCE, type ExperienceEntry } from "@/content/experience";
import { playClick } from "@/lib/sounds";

export function Timeline() {
  return (
    <ol className="relative pl-8 space-y-10 before:content-[''] before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-line">
      {EXPERIENCE.map((entry) => (
        <Entry key={entry.id} entry={entry} />
      ))}
    </ol>
  );
}

function Entry({ entry }: { entry: ExperienceEntry }) {
  const [open, setOpen] = useState(false);
  const isWork = entry.type === "work";
  const accent = isWork ? "text-violet" : "text-cyan";
  const dotBorder = isWork ? "border-violet" : "border-cyan";
  const tag = isWork ? "[work]" : "[edu]";

  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] as const }}
      className="relative"
    >
      <span
        aria-hidden
        className={`absolute -left-[29px] top-1.5 w-3.5 h-3.5 rounded-full border-2 ${dotBorder} bg-bg`}
      />

      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
        <span className={`font-mono text-[10px] uppercase tracking-widest ${accent}`}>
          {tag}
        </span>
        <span className="font-mono text-[11px] text-muted">
          {entry.start} — {entry.end}
        </span>
      </div>

      <h3 className="font-sans text-lg sm:text-xl text-fg leading-tight">
        <span className="font-medium">{entry.title}</span>{" "}
        <span className="text-muted">·</span>{" "}
        <span className={accent}>{entry.org}</span>
        {entry.client && (
          <span className="text-muted text-sm font-normal">
            {" "}
            <span className="text-muted/70">/ client:</span> {entry.client}
          </span>
        )}
      </h3>
      {entry.location && (
        <p className="font-mono text-[11px] text-muted mt-0.5">
          {entry.location}
        </p>
      )}

      <p className="text-muted leading-relaxed mt-3 max-w-2xl">
        {entry.summary}
      </p>

      {entry.tech.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 mt-3">
          {entry.tech.map((t) => (
            <li
              key={t}
              className="font-mono text-[10px] text-muted border border-line px-2 py-0.5 rounded-sm"
            >
              {t}
            </li>
          ))}
        </ul>
      )}

      {entry.highlights.length > 0 && (
        <button
          type="button"
          onClick={() => {
            playClick().catch(() => {});
            setOpen((v) => !v);
          }}
          className={`mt-3 font-mono text-[11px] ${accent} hover:underline cursor-pointer`}
        >
          {open ? "▾ collapse" : "▸ expand"} · {entry.highlights.length} highlights
        </button>
      )}

      <AnimatePresence initial={false}>
        {open && entry.highlights.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] as const }}
            className="mt-3 space-y-2 max-w-2xl overflow-hidden"
          >
            {entry.highlights.map((h, i) => (
              <li
                key={i}
                className="flex gap-3 text-sm text-muted leading-relaxed"
              >
                <span className={`${accent} mt-1 shrink-0`}>›</span>
                <span>{h}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {entry.notes && (
        <p className="font-mono text-[10px] text-muted/60 mt-2 italic">
          {entry.notes}
        </p>
      )}
    </motion.li>
  );
}
