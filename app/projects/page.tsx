import { HoverPreviewList } from "@/components/projects/HoverPreviewList";

export const metadata = { title: "Projects — Aayush Mehta" };

export default function ProjectsPage() {
  return (
    <section className="px-6 py-24 max-w-5xl mx-auto">
      <p className="font-mono text-xs text-cyan tracking-widest mb-3">
        ~/projects
      </p>
      <h1 className="font-mono text-4xl md:text-6xl mb-3 text-fg">projects</h1>
      <p className="text-muted leading-relaxed mb-12 max-w-2xl">
        Hover any title — a preview pins to the right. Click for the full
        case study.
      </p>
      <HoverPreviewList />
    </section>
  );
}
