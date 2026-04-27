import { Timeline } from "@/components/experience/Timeline";

export const metadata = { title: "Experience — Aayush Mehta" };

export default function ExperiencePage() {
  return (
    <section className="px-6 py-24 max-w-3xl mx-auto">
      <p className="font-mono text-xs text-cyan tracking-widest mb-3">
        ~/experience
      </p>
      <h1 className="font-mono text-4xl md:text-6xl mb-3 text-fg">
        experience
      </h1>
      <p className="text-muted leading-relaxed mb-12 max-w-2xl">
        A single chronological feed of work and study. Click any entry to see
        the longer story. <span className="text-violet">[work]</span> entries
        carry a violet anchor, <span className="text-cyan">[edu]</span> a cyan
        one.
      </p>
      <Timeline />
    </section>
  );
}
