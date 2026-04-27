import { BootIntro } from "@/components/hero/BootIntro";

export default function Home() {
  return (
    <>
      <BootIntro />
      <section className="px-6 py-24 max-w-3xl mx-auto">
        <p className="font-mono text-xs text-muted tracking-widest mb-3">
          // home — long-scroll narrative
        </p>
        <p className="text-muted leading-relaxed">
          Photo · about teaser · tech constellation glimpse · experience
          strip · featured projects · contact CTA — coming in phase 3.
        </p>
      </section>
    </>
  );
}
