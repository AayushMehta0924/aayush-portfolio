import { ExperimentCard } from "@/components/playground/ExperimentCard";
import { HobbyCard } from "@/components/playground/HobbyCard";
import { EXPERIMENTS, HOBBIES } from "@/content/playground";

export const metadata = { title: "Playground — Aayush Mehta" };

export default function PlaygroundPage() {
  return (
    <section className="px-6 py-24 max-w-5xl mx-auto">
      <p className="font-mono text-xs text-cyan tracking-widest mb-3">
        ~/playground
      </p>
      <h1 className="font-mono text-4xl md:text-6xl mb-3 text-fg">
        playground
      </h1>
      <p className="text-muted leading-relaxed mb-16 max-w-2xl">
        Half work, half not. Top half is{" "}
        <span className="text-violet">experiments</span> — small things I
        build for fun. Bottom half is <span className="text-violet">hobbies</span>{" "}
        — the parts of me that have nothing to do with code.
      </p>

      <div className="mb-20">
        <h2 className="font-mono text-[11px] text-violet tracking-widest uppercase mb-6">
          // experiments
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {EXPERIMENTS.map((e) => (
            <ExperimentCard key={e.id} e={e} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-mono text-[11px] text-cyan tracking-widest uppercase mb-6">
          // hobbies
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {HOBBIES.map((h) => (
            <HobbyCard key={h.id} h={h} />
          ))}
        </div>
      </div>
    </section>
  );
}
