"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function HeroPhoto() {
  return (
    <section
      data-depth-mode="hero"
      data-home-room="hero"
      className="px-6 py-20 sm:py-28 max-w-5xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,_360px)_1fr] gap-10 md:gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
          className="relative aspect-square rounded-lg overflow-hidden border border-line"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet/10 via-transparent to-cyan/10 pointer-events-none z-10" />
          <Image
            src="/aayush-hero.jpg"
            alt="Aayush Mehta"
            fill
            priority
            sizes="(min-width: 768px) 360px, 100vw"
            className="object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const, delay: 0.15 }}
          className="space-y-5"
        >
          <p className="font-mono text-xs text-cyan tracking-widest">
            ./about_briefly.md
          </p>
          <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl text-fg leading-tight">
            I build <span className="text-violet">data + AI systems</span> that
            stay honest under load.
          </h2>
          <p className="text-muted leading-relaxed max-w-xl">
            Four-plus years deep in GCP — BigQuery, Airflow, Vertex AI, and a
            growing pile of multi-agent chatbots that try not to hallucinate
            inside enterprise data. I write code that other engineers can pick
            up and trust.
          </p>
          <p className="text-muted leading-relaxed max-w-xl">
            Outside that, I play piano (badly), follow football (loyally), and
            occasionally publish small interactive things that have no business
            existing — like this site.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
