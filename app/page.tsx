import Link from "next/link";
import { ABOUT } from "@/content/about";
import { EXPERIENCE } from "@/content/experience";
import { PROJECTS } from "@/content/projects";
import { BootIntro } from "@/components/hero/BootIntro";
import { HeroPhoto } from "@/components/hero/HeroPhoto";
import { HomeCinematicBackdrop } from "@/components/home/HomeCinematicBackdrop";
import { HoverPreviewList } from "@/components/projects/HoverPreviewList";
import { SKILL_TREE } from "@/lib/constellation-data";

const FACETS = [
  {
    verb: "build",
    label: "systems",
    body: "I like making the invisible machinery feel understandable: clean flows, honest defaults, and tools that do not make people fight them.",
    mode: "schema",
  },
  {
    verb: "play",
    label: "piano + football",
    body: "Rhythm shows up everywhere for me: in a half-learned song, a well-timed pass, or a page transition that lands exactly when it should.",
    mode: "rhythm",
  },
  {
    verb: "notice",
    label: "light + motion",
    body: "I am drawn to small details: reflections, under-lit photos, clean interfaces, and the tiny moment before something clicks.",
    mode: "lens",
  },
  {
    verb: "make",
    label: "craft + experiments",
    body: "The playful stuff matters too. Little prototypes, odd UI ideas, paper-cut thinking, and the habit of turning curiosity into a thing.",
    mode: "craft",
  },
];

const PORTALS = [
  {
    href: "/about",
    title: "about",
    caption: "story, values, constellation",
    mode: "portrait room",
  },
  {
    href: "/experience",
    title: "experience",
    caption: "where the technical receipts live",
    mode: "elevator shaft",
  },
  {
    href: "/projects",
    title: "projects",
    caption: "case studies and systems",
    mode: "depth stack",
  },
  {
    href: "/playground",
    title: "playground",
    caption: "experiments, piano, football, craft",
    mode: "studio table",
  },
];

export default function Home() {
  const latestExperience = EXPERIENCE.slice(0, 2);
  const featuredProjects = PROJECTS.slice(0, 3);

  return (
    <>
      <BootIntro />
      <HomeCinematicBackdrop />
      <div className="relative z-10">
      <HeroPhoto />
      <section
        data-depth-mode="about"
        data-home-room="identity"
        className="px-6 py-20 max-w-5xl mx-auto"
      >
        <SectionKicker>// identity stage</SectionKicker>
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,_1fr)_240px] gap-10 md:gap-16 items-start">
          <div>
            <h2 className="font-sans text-3xl sm:text-4xl text-fg leading-tight mb-5">
              More than a stack. Still technical enough to have a pulse.
            </h2>
            <div className="space-y-4 text-muted leading-relaxed max-w-2xl">
              <p>
                I build serious systems for work, but the site should feel like
                the fuller person behind them: piano, football, craft, motion,
                experiments, taste, and the occasional over-engineered little
                interaction.
              </p>
              <p>
                The technical details still matter. They just get their proper
                rooms: experience and projects. Home is the entry point into the
                whole thing.
              </p>
            </div>
            <TextLink href="/about" className="mt-6">
              open about.json
            </TextLink>
          </div>

          <dl className="grid grid-cols-2 md:grid-cols-1 gap-5 font-mono border border-line bg-elevated/20 rounded-md p-5">
            <Metric label="based in" value={ABOUT.based_in} />
            <Metric label="mode" value="build / play / notice / make" />
            <Metric label="signal" value="person first, systems close behind" />
          </dl>
        </div>
      </section>

      <section
        data-depth-mode="hero"
        data-home-room="play"
        className="px-6 py-20 border-y border-line/60"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">
            <div>
              <SectionKicker>// more than one thing</SectionKicker>
              <h2 className="font-sans text-3xl sm:text-5xl text-fg leading-tight max-w-3xl">
                The homepage should move like a memory, not a resume.
              </h2>
            </div>
            <TextLink href="/playground">enter playground</TextLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FACETS.map((facet, i) => (
              <article
                key={facet.verb}
                className="group min-h-64 rounded-md border border-line bg-elevated/25 p-6 overflow-hidden relative hover:border-cyan/50 transition-colors"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="font-mono text-[10px] text-muted tracking-widest uppercase mb-8">
                  {(i + 1).toString().padStart(2, "0")} / {facet.mode}
                </p>
                <h3 className="font-sans text-5xl sm:text-6xl text-fg leading-none mb-3 group-hover:text-violet transition-colors">
                  {facet.verb}
                </h3>
                <p className="font-mono text-xs text-cyan tracking-widest uppercase mb-4">
                  {facet.label}
                </p>
                <p className="text-sm text-muted leading-relaxed max-w-md">
                  {facet.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        data-depth-mode="tech"
        data-home-room="systems"
        className="px-6 py-20 border-y border-line/60"
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 lg:gap-16 items-start">
            <div>
              <SectionKicker>// systems thread</SectionKicker>
              <h2 className="font-sans text-3xl sm:text-4xl text-fg leading-tight mb-4">
                A little technical gravity, not the whole personality.
              </h2>
              <p className="text-muted leading-relaxed">
                The constellation still belongs here as a glimpse: a quiet map
                of tools and patterns, with the full graph saved for the about
                page.
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

      <section
        data-depth-mode="experience"
        data-home-room="work"
        className="px-6 py-20 max-w-5xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,_1fr)_300px] gap-10 mb-10">
          <div>
            <SectionKicker>// work elevator</SectionKicker>
            <h2 className="font-sans text-3xl sm:text-4xl text-fg leading-tight mb-4">
              When it is time for receipts, the scroll gets sharper.
            </h2>
            <p className="text-muted leading-relaxed max-w-2xl">
              This is the professional thread: current roles, technical scope,
              and the kind of systems I can be trusted with.
            </p>
          </div>
          <div className="lg:text-right">
            <TextLink href="/experience">view full timeline</TextLink>
          </div>
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

      <section
        data-depth-mode="projects"
        data-home-room="projects"
        className="px-6 py-20 border-y border-line/60"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">
            <div>
              <SectionKicker>// selected work</SectionKicker>
              <h2 className="font-sans text-3xl sm:text-4xl text-fg leading-tight">
                Project portals with their own visual weather.
              </h2>
            </div>
            <TextLink href="/projects">view all projects</TextLink>
          </div>
          <HoverPreviewList limit={featuredProjects.length} />
        </div>
      </section>

      <section
        data-depth-mode="about"
        data-home-room="portals"
        className="px-6 py-20 max-w-5xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">
          <div>
            <SectionKicker>// route portals</SectionKicker>
            <h2 className="font-sans text-3xl sm:text-5xl text-fg leading-tight max-w-3xl">
              Choose a room. Each one should feel like it belongs to the same
              person.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PORTALS.map((portal) => (
            <Link
              key={portal.href}
              href={portal.href}
              className="group min-h-56 rounded-md border border-line bg-elevated/25 p-5 flex flex-col justify-between hover:border-violet/60 transition-colors"
            >
              <div>
                <p className="font-mono text-[10px] text-muted tracking-widest uppercase mb-4">
                  {portal.mode}
                </p>
                <h3 className="font-sans text-3xl text-fg group-hover:text-violet transition-colors">
                  {portal.title}
                </h3>
              </div>
              <p className="font-mono text-[11px] text-cyan leading-relaxed">
                {portal.caption} -&gt;
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section
        data-depth-mode="contact"
        data-home-room="contact"
        className="px-6 py-24 max-w-5xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:items-end">
          <div>
            <SectionKicker>// contact</SectionKicker>
            <h2 className="font-sans text-4xl sm:text-5xl md:text-6xl text-fg leading-tight mb-5">
              Collapse the room back into a prompt.
            </h2>
            <p className="text-muted leading-relaxed max-w-2xl">
              Work idea, side quest, music recommendation, football argument,
              or the fuzzy middle where curiosity becomes a thing.
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
      </div>
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
