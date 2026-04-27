import { TerminalCompose } from "@/components/contact/TerminalCompose";

export const metadata = { title: "Contact — Aayush Mehta" };

const SOCIAL = [
  { label: "email", href: "mailto:aayushmehta0924@gmail.com", display: "aayushmehta0924@gmail.com" },
  { label: "github", href: "https://github.com/AayushMehta0924", display: "github.com/AayushMehta0924" },
  { label: "linkedin", href: "https://www.linkedin.com/in/aayushmehta24", display: "linkedin.com/in/aayushmehta24" },
];

export default function ContactPage() {
  return (
    <section className="px-6 py-24 max-w-2xl mx-auto">
      <p className="font-mono text-xs text-cyan tracking-widest mb-3">
        ~/contact
      </p>
      <h1 className="font-mono text-4xl md:text-6xl mb-3 text-fg">contact</h1>
      <p className="text-muted leading-relaxed mb-10">
        Compose below or grab a direct link. Either is fine.
      </p>

      <TerminalCompose />

      <div className="mt-12 space-y-2">
        <p className="font-mono text-[11px] text-violet tracking-widest uppercase mb-3">
          // direct
        </p>
        {SOCIAL.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target={s.href.startsWith("http") ? "_blank" : undefined}
            rel={s.href.startsWith("http") ? "noreferrer" : undefined}
            className="flex items-baseline justify-between py-2 border-b border-line/50 group transition-colors hover:border-violet/50"
          >
            <span className="font-mono text-xs text-muted w-20 group-hover:text-violet transition-colors">
              {s.label}
            </span>
            <span className="font-mono text-sm text-fg group-hover:text-cyan transition-colors">
              {s.display}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
