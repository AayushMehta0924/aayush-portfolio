"use client";

import { motion } from "framer-motion";
import type { Hobby } from "@/content/playground";

export function HobbyCard({ h }: { h: Hobby }) {
  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="rounded-md border border-line bg-elevated/40 overflow-hidden hover:border-cyan/50 transition-colors"
    >
      <div className="aspect-[4/3] bg-[radial-gradient(ellipse_at_top_left,_#0d1f24_0%,_#0a0a0a_70%)] relative">
        {h.photo ? (
          <img src={h.photo} alt={h.title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-muted/60 px-4 text-center">
            drop /public/hobbies/{h.id}.jpg
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-sans text-xl text-fg mb-2 leading-tight">
          {h.title}
        </h3>
        <p className="text-sm text-muted leading-relaxed mb-3">{h.body}</p>
        <p className="font-mono text-[11px] text-cyan">› {h.curated}</p>
      </div>
    </motion.article>
  );
}
