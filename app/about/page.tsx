import { JsonAbout } from "@/components/about/JsonAbout";

export const metadata = { title: "About — Aayush Mehta" };

export default function AboutPage() {
  return (
    <section className="px-6 py-24 max-w-4xl mx-auto">
      <p className="font-mono text-xs text-cyan tracking-widest mb-3">
        ~/about
      </p>
      <h1 className="font-mono text-4xl md:text-6xl mb-3 text-fg">about</h1>
      <p className="text-muted leading-relaxed mb-10 max-w-2xl">
        Each key below is clickable. The{" "}
        <code className="text-violet">tech</code> key opens an interactive
        constellation of the stack — click any node to drill in.
      </p>
      <JsonAbout />
    </section>
  );
}
