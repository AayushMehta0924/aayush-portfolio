"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { playWoosh } from "@/lib/sounds";

export function RouteWarpFlash() {
  const pathname = usePathname();
  const firstRender = useRef(true);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const target = pathname === "/" ? "~" : "." + pathname;
    setFlash(`cd ${target}`);
    playWoosh().catch(() => {});
    const t = window.setTimeout(() => setFlash(null), 520);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return (
    <AnimatePresence>
      {flash && (
        <motion.div
          key={flash}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.18 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none font-mono text-[11px] text-cyan border border-line bg-elevated/90 px-2.5 py-1 rounded-sm backdrop-blur"
        >
          <span className="text-violet">$</span> {flash}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
