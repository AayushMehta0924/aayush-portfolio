"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { PROJECTS, type Project } from "@/content/projects";
import { playClick } from "@/lib/sounds";

export function HoverPreviewList({ limit }: { limit?: number }) {
  const items = limit ? PROJECTS.slice(0, limit) : PROJECTS;
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const preview = hoveredId ? items.find((p) => p.slug === hoveredId) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,_400px)] gap-12">
      <ol>
        {items.map((p, i) => (
          <li key={p.slug}>
            <Link
              href={`/projects/${p.slug}`}
              onMouseEnter={() => setHoveredId(p.slug)}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(p.slug)}
              onBlur={() => setHoveredId(null)}
              onClick={() => playClick().catch(() => {})}
              className="group flex items-baseline gap-4 py-5 border-b border-line transition-colors hover:bg-elevated/40 px-1 rounded-sm"
            >
              <span className="font-mono text-[11px] text-muted shrink-0 w-6">
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-sans text-2xl sm:text-3xl text-fg leading-tight group-hover:text-violet transition-colors">
                  {p.title}
                </h3>
                <p className="font-mono text-[11px] text-muted mt-1 truncate">
                  {p.role}
                </p>
              </div>
              <span className="font-mono text-[11px] text-muted shrink-0">
                {p.year}
              </span>
              <span className="font-mono text-[11px] text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                →
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <div className="hidden lg:block">
        <div className="sticky top-24">
          <AnimatePresence mode="wait">
            {preview ? (
              <PreviewPanel key={preview.slug} p={preview} />
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="aspect-[4/3] rounded-md border border-dashed border-line flex items-center justify-center font-mono text-[11px] text-muted/60"
              >
                hover a project →
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function PreviewPanel({ p }: { p: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -4 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
    >
      <div className="aspect-[4/3] rounded-md border border-line overflow-hidden relative bg-[radial-gradient(ellipse_at_top_left,_#1a0f2a_0%,_#0a0a0a_75%)]">
        {p.cover ? (
          <img
            src={p.cover}
            alt={p.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-muted/60 px-6 text-center">
            no preview yet — drop {`/public/projects/${p.slug}.jpg`}
          </div>
        )}
      </div>
      <p className="mt-4 text-sm text-muted leading-relaxed">{p.summary}</p>
      <ul className="flex flex-wrap gap-1.5 mt-3">
        {p.tech.slice(0, 7).map((t) => (
          <li
            key={t}
            className="font-mono text-[10px] text-muted border border-line px-2 py-0.5 rounded-sm"
          >
            {t}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
