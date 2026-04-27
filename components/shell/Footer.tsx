export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line px-6 py-8 mt-16">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-3 justify-between items-start md:items-center font-mono text-[11px] text-muted">
        <p>
          © {year} aayush mehta · built with{" "}
          <span className="text-violet">next.js</span> · deployed on{" "}
          <span className="text-violet">vercel</span>
        </p>
        <div className="flex gap-4">
          <a
            href="mailto:aayushmehta0924@gmail.com"
            className="hover:text-fg transition-colors"
          >
            email
          </a>
          <a
            href="https://github.com/AayushMehta0924"
            target="_blank"
            rel="noreferrer"
            className="hover:text-fg transition-colors"
          >
            github
          </a>
          <a
            href="https://www.linkedin.com/in/aayushmehta24"
            target="_blank"
            rel="noreferrer"
            className="hover:text-fg transition-colors"
          >
            linkedin
          </a>
        </div>
      </div>
    </footer>
  );
}
