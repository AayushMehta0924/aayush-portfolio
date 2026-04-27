import Link from "next/link";
import { ABOUT } from "@/content/about";
import { EXPERIENCE } from "@/content/experience";
import { PROJECTS } from "@/content/projects";
import { BootIntro } from "@/components/hero/BootIntro";
import { HeroPhoto } from "@/components/hero/HeroPhoto";
import { HoverPreviewList } from "@/components/projects/HoverPreviewList";
import { SKILL_TREE } from "@/lib/constellation-data";

export default function Home() {
  const latestExperience = EXPERIENCE.slice(0, 2);
  const featuredProjects = PROJECTS.slice(0, 3);

  return (
    <>
      <BootIntro />
      <HeroPhoto />
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <SectionKicker>// about signal</SectionKicker>
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,_1fr)_220px] gap-10 md:gap-16 items-start">
          <div>
            <h2 className="font-sans text-3xl sm:text-4xl text-fg leading-tight mb-5">
              Enterprise data platforms, agentic interfaces, and a site with a
              pulse.
            </h2>
            <div className="space-y-4 text-muted leading-relaxed max-w-2xl">
              {ABOUT.story.slice(0, 2).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <TextLink href="/about" className="mt-6">
              open about.json
            </TextLink>
          </div>

          <dl className="grid grid-cols-2 md:grid-cols-1 gap-5 font-mono">
            <Metric label="based in" value={ABOUT.based_in} />
            <Metric label="focus" value="data + AI + cloud" />
            <Metric label="stack" value="GCP first" />
          </dl>
        </div>
      </section>

      <section className="px-6 py-20 border-y border-line/60">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 lg:gap-16 items-start">
            <div>
              <SectionKicker>// tech glimpse</SectionKicker>
              <h2 className="font-sans text-3xl sm:text-4xl text-fg leading-tight mb-4">
                The constellation is bigger on the inside.
              </h2>
              <p className="text-muted leading-relaxed">
                The full graph lives inside the about page. Here are the root
                systems it expands from.
              </p>
              <TextLink href="/about#tech" className="mt-6">
                inspect skill graph
              </TextLink>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {SKILL_TREE.map((node) => (
                <li
                  key={node.id}
                  className="min-h-36 rounded-md border border-line bg-elevated/30 p-5"
                >
                  <p className="font-mono text-[10px] text-cyan tracking-widest uppercase mb-3">
                    {node.children?.length ?? 0} branches
                  </p>
                  <h3 className="font-sans text-xl text-fg mb-3">
                    {node.label}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {(node.children ?? [])
                      .slice(0, 4)
                      .map((child) => child.label)
                      .join(" / ")}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">
          <div>
            <SectionKicker>// latest experience</SectionKicker>
            <h2 className="font-sans text-3xl sm:text-4xl text-fg leading-tight">
              Current work, compressed.
            </h2>
          </div>
          <TextLink href="/experience">view full timeline</TextLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {latestExperience.map((entry) => (
            <article
              key={entry.id}
              className="rounded-md border border-line bg-elevated/30 p-6"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3">
                <span className="font-mono text-[10px] text-violet uppercase tracking-widest">
                  [{entry.type}]
                </span>
                <span className="font-mono text-[11px] text-muted">
                  {entry.start} - {entry.end}
                </span>
              </div>
              <h3 className="font-sans text-2xl text-fg leading-tight mb-3">
                {entry.title} <span className="text-muted">at</span>{" "}
                <span className="text-violet">{entry.org}</span>
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {entry.summary}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 border-y border-line/60">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">
            <div>
              <SectionKicker>// featured projects</SectionKicker>
              <h2 className="font-sans text-3xl sm:text-4xl text-fg leading-tight">
                Five case studies, three on deck.
              </h2>
            </div>
            <TextLink href="/projects">view all projects</TextLink>
          </div>
          <HoverPreviewList limit={featuredProjects.length} />
        </div>
      </section>

      <section className="px-6 py-24 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:items-end">
          <div>
            <SectionKicker>// contact</SectionKicker>
            <h2 className="font-sans text-4xl sm:text-5xl md:text-6xl text-fg leading-tight mb-5">
              Let&apos;s build the useful version.
            </h2>
            <p className="text-muted leading-relaxed max-w-2xl">
              Data platforms, GCP migrations, analytics agents, or the fuzzy
              middle where requirements become systems.
            </p>
          </div>
          <Link
            href="/contact"
            className="font-mono text-sm text-bg bg-violet px-5 py-3 rounded-sm hover:bg-cyan transition-colors justify-self-start md:justify-self-end"
          >
            compose --to aayush
          </Link>
        </div>
      </section>
    </>
  );
}

function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs text-cyan tracking-widest mb-3">
      {children}
    </p>
  );
}

function TextLink({
  href,
  className = "",
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex font-mono text-sm text-violet hover:text-cyan transition-colors ${className}`}
    >
      {children} -&gt;
    </Link>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] text-muted uppercase tracking-widest mb-1">
        {label}
      </dt>
      <dd className="text-sm text-fg">{value}</dd>
    </div>
  );
}
