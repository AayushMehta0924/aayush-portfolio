export const metadata = { title: "Contact — Aayush Mehta" };

export default function ContactPage() {
  return (
    <section className="px-6 py-24 max-w-3xl mx-auto">
      <p className="font-mono text-xs text-cyan tracking-widest mb-4">
        ~/contact
      </p>
      <h1 className="font-mono text-4xl md:text-6xl mb-6 text-fg">contact</h1>
      <p className="text-muted leading-relaxed">
        Terminal-style compose form (<code className="font-mono">compose --to aayush</code>) backed by Resend, with visible social links beneath. Coming in phase 3.
      </p>
    </section>
  );
}
