export const metadata = { title: "Projects — Aayush Mehta" };

export default function ProjectsPage() {
  return (
    <section className="px-6 py-24 max-w-3xl mx-auto">
      <p className="font-mono text-xs text-cyan tracking-widest mb-4">
        ~/projects
      </p>
      <h1 className="font-mono text-4xl md:text-6xl mb-6 text-fg">projects</h1>
      <p className="text-muted leading-relaxed">
        Hover-preview list (titles left, image preview pinned right). Each
        project links to its case-study MDX. Coming in phase 3.
      </p>
    </section>
  );
}
