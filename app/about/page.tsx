export const metadata = { title: "About — Aayush Mehta" };

export default function AboutPage() {
  return (
    <section className="px-6 py-24 max-w-3xl mx-auto">
      <p className="font-mono text-xs text-cyan tracking-widest mb-4">
        ~/about
      </p>
      <h1 className="font-mono text-4xl md:text-6xl mb-6 text-fg">about</h1>
      <p className="text-muted leading-relaxed">
        JSON-styled about with expandable keys lives here. Constellation graph
        for skills will live under the <code className="font-mono text-violet">tech</code>{" "}
        key. Coming in phase 3.
      </p>
    </section>
  );
}
