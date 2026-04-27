"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSoundMuted } from "@/lib/use-sound";
import { playClick } from "@/lib/sounds";

const links = [
  { href: "/", label: "home" },
  { href: "/about", label: "about" },
  { href: "/experience", label: "experience" },
  { href: "/projects", label: "projects" },
  { href: "/playground", label: "playground" },
  { href: "/contact", label: "contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Nav() {
  const pathname = usePathname();
  const [muted, setMuted] = useSoundMuted();

  const onLinkClick = () => {
    playClick().catch(() => {});
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-40 backdrop-blur-md bg-bg/70 border-b border-line">
      <div className="flex items-center justify-between px-6 py-3">
        <Link
          href="/"
          onClick={onLinkClick}
          className="font-mono text-sm text-fg hover:text-violet transition-colors"
        >
          aayush mehta
        </Link>

        <ul className="hidden md:flex gap-6 font-mono text-xs">
          {links.map(({ href, label }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onLinkClick}
                  className={`transition-colors ${
                    active
                      ? "text-violet"
                      : "text-muted hover:text-fg"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={muted ? "Unmute UI sounds" : "Mute UI sounds"}
            onClick={() => {
              const next = !muted;
              setMuted(next);
              if (!next) playClick().catch(() => {});
            }}
            className="font-mono text-[10px] text-muted hover:text-fg transition-colors"
          >
            {muted ? "[muted]" : "[sound]"}
          </button>
          <a
            href="/resume.pdf"
            download
            onClick={onLinkClick}
            className="font-mono text-xs px-3 py-1.5 border border-violet text-violet hover:bg-violet hover:text-bg rounded-sm transition-colors"
          >
            Resume.pdf
          </a>
        </div>
      </div>
    </nav>
  );
}
