export const metadata = { title: "Playground — Aayush Mehta" };

export default function PlaygroundPage() {
  return (
    <section className="px-6 py-24 max-w-3xl mx-auto">
      <p className="font-mono text-xs text-cyan tracking-widest mb-4">
        ~/playground
      </p>
      <h1 className="font-mono text-4xl md:text-6xl mb-6 text-fg">
        playground
      </h1>
      <p className="text-muted leading-relaxed">
        Two zones: <span className="text-violet">experiments</span> (top — demo
        cards) and <span className="text-violet">hobbies</span> (bottom —
        piano, football, etc.). Coming in phase 3.
      </p>
    </section>
  );
}
