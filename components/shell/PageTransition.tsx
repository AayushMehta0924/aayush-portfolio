"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

const variants = {
  initial: { opacity: 0, scaleY: 0.001, filter: "blur(8px)" },
  enter: {
    opacity: 1,
    scaleY: 1,
    filter: "blur(0px)",
    transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    scaleY: 0.001,
    filter: "blur(6px)",
    transition: { duration: 0.22, ease: [0.7, 0, 0.84, 0] as const },
  },
};

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="enter"
        exit="exit"
        style={{ transformOrigin: "center center", willChange: "transform, opacity" }}
        className="min-h-[80vh]"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
