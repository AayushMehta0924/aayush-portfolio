import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="font-mono text-sm text-muted max-w-lg">
        <p>
          <span className="text-violet">$</span> cd ./{" "}
          <span className="text-fg">[unknown]</span>
        </p>
        <p className="mt-1">
          <span className="text-cyan">cd:</span> no such file or directory
        </p>
        <p className="mt-6 text-muted">
          The page you tried to reach does not exist on this site.
        </p>
        <p className="mt-4">
          <Link href="/" className="text-violet hover:text-cyan transition">
            ← cd ~/
          </Link>
        </p>
      </div>
    </section>
  );
}
