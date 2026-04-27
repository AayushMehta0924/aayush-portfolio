type Params = Promise<{ slug: string }>;

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  return (
    <section className="px-6 py-24 max-w-3xl mx-auto">
      <p className="font-mono text-xs text-cyan tracking-widest mb-4">
        ~/projects/{slug}
      </p>
      <h1 className="font-mono text-4xl md:text-6xl mb-6 text-fg">{slug}</h1>
      <p className="text-muted leading-relaxed">
        Case-study layout (hero media → meta strip → problem → approach →
        outcome → gallery → next). MDX-rendered. Coming in phase 3.
      </p>
    </section>
  );
}
