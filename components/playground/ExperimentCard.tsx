"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Experiment } from "@/content/playground";
import { playClick } from "@/lib/sounds";

const STATUS_COLOR: Record<Experiment["status"], string> = {
  shipped: "text-gleam",
  "in-progress": "text-cyan",
  idea: "text-muted",
};

export function ExperimentCard({ e }: { e: Experiment }) {
  const inner = (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="h-full p-5 rounded-md border border-line bg-elevated/40 hover:border-violet/50 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`font-mono text-[10px] uppercase tracking-widest ${STATUS_COLOR[e.status]}`}>
          [{e.status}]
        </span>
        {e.href && (
          <span className="font-mono text-[10px] text-muted">↗</span>
        )}
      </div>
      <h3 className="font-sans text-xl text-fg mb-2 leading-tight">{e.title}</h3>
      <p className="text-sm text-muted leading-relaxed">{e.blurb}</p>
    </motion.div>
  );

  if (e.href) {
    return (
      <Link
        href={e.href}
        onClick={() => playClick().catch(() => {})}
        className="block h-full"
      >
        {inner}
      </Link>
    );
  }
  return inner;
}
