import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECTS } from "@/content/projects";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const p = PROJECTS.find((x) => x.slug === slug);
  if (!p) return { title: "Project not found" };
  return { title: `${p.title} — Aayush Mehta` };
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const p = PROJECTS.find((x) => x.slug === slug);
  if (!p) notFound();

  const idx = PROJECTS.findIndex((x) => x.slug === slug);
  const next = PROJECTS[(idx + 1) % PROJECTS.length];

  return (
    <article className="px-6 py-24 max-w-3xl mx-auto">
      <Link
        href="/projects"
        className="font-mono text-[11px] text-muted hover:text-violet transition-colors"
      >
        ← all projects
      </Link>

      <p className="font-mono text-xs text-cyan tracking-widest mt-8 mb-3">
        ~/projects/{p.slug}
      </p>
      <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl text-fg leading-tight mb-4">
        {p.title}
      </h1>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-mono text-muted mb-8">
        <span>
          <span className="text-muted/60">year</span> · {p.year}
        </span>
        <span>
          <span className="text-muted/60">role</span> · {p.role}
        </span>
      </div>

      <p className="text-lg text-fg leading-relaxed mb-10">{p.summary}</p>

      <div className="aspect-[16/9] rounded-md border border-line overflow-hidden relative bg-[radial-gradient(ellipse_at_top_left,_#1a0f2a_0%,_#0a0a0a_75%)] mb-12">
        {p.cover ? (
          <img src={p.cover} alt={p.title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-muted/60">
            cover placeholder · drop /public/projects/{p.slug}.jpg
          </div>
        )}
      </div>

      <Section heading="problem">
        <p className="text-muted leading-relaxed">{p.problem}</p>
      </Section>

      <Section heading="approach">
        <ol className="space-y-3">
          {p.approach.map((step, i) => (
            <li key={i} className="flex gap-3 text-muted leading-relaxed">
              <span className="font-mono text-[11px] text-violet pt-1 shrink-0 w-6">
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section heading="outcome">
        <p className="text-muted leading-relaxed">{p.outcome}</p>
      </Section>

      <Section heading="stack">
        <ul className="flex flex-wrap gap-1.5">
          {p.tech.map((t) => (
            <li
              key={t}
              className="font-mono text-[11px] text-muted border border-line px-2 py-1 rounded-sm"
            >
              {t}
            </li>
          ))}
        </ul>
      </Section>

      {p.links && p.links.length > 0 && (
        <Section heading="links">
          <ul className="space-y-1">
            {p.links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-sm text-violet hover:text-cyan transition-colors"
                >
                  → {l.label}
                </a>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <div className="mt-20 pt-8 border-t border-line flex items-center justify-between">
        <Link
          href="/projects"
          className="font-mono text-[11px] text-muted hover:text-violet transition-colors"
        >
          ← all projects
        </Link>
        <Link
          href={`/projects/${next.slug}`}
          className="font-mono text-sm text-violet hover:text-cyan transition-colors"
        >
          next: {next.title} →
        </Link>
      </div>
    </article>
  );
}

function Section({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="font-mono text-[11px] text-violet tracking-widest uppercase mb-4">
        // {heading}
      </h2>
      {children}
    </section>
  );
}
