export const metadata = { title: "Experience — Aayush Mehta" };

export default function ExperiencePage() {
  return (
    <section className="px-6 py-24 max-w-3xl mx-auto">
      <p className="font-mono text-xs text-cyan tracking-widest mb-4">
        ~/experience
      </p>
      <h1 className="font-mono text-4xl md:text-6xl mb-6 text-fg">
        experience
      </h1>
      <p className="text-muted leading-relaxed">
        Single timeline blending{" "}
        <span className="font-mono text-violet">[work]</span> and{" "}
        <span className="font-mono text-cyan">[edu]</span> entries. Sourced
        from <code className="font-mono">Aayush_Resume_latest.docx</code>.
        Coming in phase 3.
      </p>
    </section>
  );
}
