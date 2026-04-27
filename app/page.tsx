import { BootIntro } from "@/components/hero/BootIntro";
import { HeroPhoto } from "@/components/hero/HeroPhoto";

export default function Home() {
  return (
    <>
      <BootIntro />
      <HeroPhoto />
      <section className="px-6 py-24 max-w-3xl mx-auto">
        <p className="font-mono text-xs text-muted tracking-widest mb-3">
          // home — long-scroll narrative
        </p>
        <p className="text-muted leading-relaxed">
          Tech constellation glimpse · experience strip · featured projects ·
          contact CTA — coming next pass.
        </p>
      </section>
    </>
  );
}
