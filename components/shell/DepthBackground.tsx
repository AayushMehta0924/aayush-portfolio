"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

type DepthMode =
  | "hero"
  | "about"
  | "tech"
  | "experience"
  | "projects"
  | "contact";

type Rgb = [number, number, number];

type ModeProfile = {
  primary: Rgb;
  secondary: Rgb;
  gravity: number;
  drift: number;
  lineAlpha: number;
};

type Particle = {
  x: number;
  y: number;
  z: number;
  size: number;
  phase: number;
  speed: number;
};

type ProjectSignal = {
  slug: string;
  title: string;
  tech: string[];
};

const BASE_PROFILES: Record<DepthMode, ModeProfile> = {
  hero: {
    primary: [168, 85, 247],
    secondary: [103, 232, 249],
    gravity: 1.1,
    drift: 0.7,
    lineAlpha: 0.06,
  },
  about: {
    primary: [103, 232, 249],
    secondary: [168, 85, 247],
    gravity: 0.72,
    drift: 0.45,
    lineAlpha: 0.045,
  },
  tech: {
    primary: [103, 232, 249],
    secondary: [74, 222, 128],
    gravity: -0.9,
    drift: 0.85,
    lineAlpha: 0.08,
  },
  experience: {
    primary: [168, 85, 247],
    secondary: [74, 222, 128],
    gravity: 0.55,
    drift: 0.35,
    lineAlpha: 0.04,
  },
  projects: {
    primary: [168, 85, 247],
    secondary: [103, 232, 249],
    gravity: 1.35,
    drift: 1.05,
    lineAlpha: 0.09,
  },
  contact: {
    primary: [74, 222, 128],
    secondary: [103, 232, 249],
    gravity: 0.35,
    drift: 0.25,
    lineAlpha: 0.055,
  },
};

const PROJECT_PROFILES: Record<string, Partial<ModeProfile>> = {
  "ask-aes": {
    primary: [103, 232, 249],
    secondary: [168, 85, 247],
    gravity: -1.25,
    lineAlpha: 0.12,
  },
  "sap-hana-bigquery-migration": {
    primary: [74, 222, 128],
    secondary: [103, 232, 249],
    gravity: 1.15,
    lineAlpha: 0.1,
  },
  "customer-360": {
    primary: [168, 85, 247],
    secondary: [103, 232, 249],
    gravity: -0.65,
    lineAlpha: 0.11,
  },
  desculpt: {
    primary: [237, 237, 237],
    secondary: [168, 85, 247],
    gravity: 0.9,
    lineAlpha: 0.08,
  },
  "churn-prediction": {
    primary: [74, 222, 128],
    secondary: [168, 85, 247],
    gravity: -0.8,
    lineAlpha: 0.1,
  },
};

const MODE_BY_ROUTE: Record<string, DepthMode> = {
  "/": "hero",
  "/about": "tech",
  "/experience": "experience",
  "/projects": "projects",
  "/playground": "about",
  "/contact": "contact",
};

function routeMode(pathname: string): DepthMode {
  if (pathname.startsWith("/projects")) return "projects";
  return MODE_BY_ROUTE[pathname] ?? "hero";
}

function mix(a: Rgb, b: Rgb, t: number): Rgb {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

function rgba(rgb: Rgb, alpha: number) {
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

function createRand(seed: number) {
  let x = seed;
  return () => {
    x ^= x << 13;
    x ^= x >> 17;
    x ^= x << 5;
    return ((x >>> 0) % 10000) / 10000;
  };
}

function buildParticles(width: number, height: number, reduced: boolean) {
  const count = reduced
    ? Math.min(72, Math.max(36, Math.floor((width * height) / 28000)))
    : Math.min(190, Math.max(86, Math.floor((width * height) / 10500)));
  const rand = createRand(width * 31 + height * 17 + 924);

  return Array.from({ length: count }, () => ({
    x: rand(),
    y: rand(),
    z: 0.25 + rand() * 1.8,
    size: 0.55 + rand() * 1.8,
    phase: rand() * Math.PI * 2,
    speed: 0.35 + rand() * 1.15,
  }));
}

function getProfile(mode: DepthMode, project: ProjectSignal | null) {
  const base = BASE_PROFILES[mode];
  const projectProfile = project ? PROJECT_PROFILES[project.slug] : undefined;
  return { ...base, ...projectProfile };
}

export function DepthBackground() {
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const modeRef = useRef<DepthMode>(routeMode(pathname));
  const projectRef = useRef<ProjectSignal | null>(null);
  const pointerRef = useRef({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    active: false,
  });
  const reducedRef = useRef(false);

  useEffect(() => {
    modeRef.current = routeMode(pathname);
    projectRef.current = null;
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      reducedRef.current = mq.matches;
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let scrollY = window.scrollY;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particlesRef.current = buildParticles(width, height, reducedRef.current);
    };

    const updatePointerVars = (x: number, y: number) => {
      root.style.setProperty("--depth-x", `${x}px`);
      root.style.setProperty("--depth-y", `${y}px`);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointerRef.current.tx = event.clientX;
      pointerRef.current.ty = event.clientY;
      pointerRef.current.active = true;
      updatePointerVars(event.clientX, event.clientY);
    };

    const onPointerLeave = () => {
      pointerRef.current.active = false;
    };

    const onScroll = () => {
      scrollY = window.scrollY;
      root.style.setProperty("--depth-scroll", `${scrollY}px`);
      root.style.setProperty("--depth-grid-x", `${scrollY * -0.018}px`);
      root.style.setProperty("--depth-grid-y", `${scrollY * -0.03}px`);
    };

    const onProjectHover = (event: Event) => {
      const detail = (event as CustomEvent<ProjectSignal | null>).detail;
      projectRef.current = detail;
    };

    const draw = (now: number) => {
      const pointer = pointerRef.current;
      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;

      const mode = modeRef.current;
      const project = projectRef.current;
      const profile = getProfile(mode, project);
      const time = now / 1000;
      const depthX = pointer.active ? pointer.x / Math.max(width, 1) - 0.5 : 0;
      const depthY = pointer.active ? pointer.y / Math.max(height, 1) - 0.5 : 0;

      ctx.clearRect(0, 0, width, height);

      for (const particle of particlesRef.current) {
        const depth = particle.z;
        const sway = reducedRef.current
          ? 0
          : Math.sin(time * particle.speed * profile.drift + particle.phase);
        const scrollOffset = reducedRef.current
          ? 0
          : (scrollY * (0.012 + depth * 0.018)) % height;

        let x =
          particle.x * width +
          depthX * depth * 52 +
          sway * depth * 5;
        let y =
          ((particle.y * height + scrollOffset) % (height + 80)) - 40 +
          depthY * depth * 26 +
          Math.cos(time * particle.speed * 0.7 + particle.phase) * depth * 3;

        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = project ? 230 : 180;

        if (pointer.active && dist > 0 && dist < radius) {
          const force = Math.pow(1 - dist / radius, 2) * profile.gravity;
          x += (dx / dist) * force * 58;
          y += (dy / dist) * force * 58;
        }

        const hue = mix(profile.primary, profile.secondary, particle.z / 2.1);
        const pointAlpha = 0.1 + particle.z * 0.05 + (project ? 0.03 : 0);
        const size = particle.size * (0.75 + particle.z * 0.55);

        ctx.beginPath();
        ctx.fillStyle = rgba(hue, pointAlpha);
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        if (pointer.active && dist < radius * 0.82) {
          ctx.beginPath();
          ctx.strokeStyle = rgba(hue, profile.lineAlpha * (1 - dist / radius));
          ctx.lineWidth = 0.7;
          ctx.moveTo(x, y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }

      if (pointer.active) {
        const ring = project ? profile.secondary : profile.primary;
        ctx.beginPath();
        ctx.strokeStyle = rgba(ring, project ? 0.16 : 0.08);
        ctx.lineWidth = 1;
        ctx.arc(pointer.x, pointer.y, project ? 96 : 72, 0, Math.PI * 2);
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    updatePointerVars(width / 2, height / 2);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("portfolio:project-hover", onProjectHover);
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("portfolio:project-hover", onProjectHover);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const modes = new Map<Element, DepthMode>();
    const scores = new Map<Element, number>();
    let observer: IntersectionObserver | null = null;
    let timeout = 0;

    const attach = () => {
      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>("[data-depth-mode]"),
      );
      if (nodes.length === 0) return;

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            scores.set(entry.target, entry.intersectionRatio);
          }

          let winner: { mode: DepthMode; score: number } | null = null;
          for (const [element, score] of scores) {
            const mode = modes.get(element);
            if (!mode) continue;
            if (!winner || score > winner.score) winner = { mode, score };
          }

          if (winner && winner.score > 0.16) {
            modeRef.current = winner.mode;
          }
        },
        { threshold: [0, 0.16, 0.33, 0.55, 0.75] },
      );

      for (const node of nodes) {
        const mode = node.dataset.depthMode as DepthMode | undefined;
        if (!mode || !(mode in BASE_PROFILES)) continue;
        modes.set(node, mode);
        scores.set(node, 0);
        observer.observe(node);
      }
    };

    timeout = window.setTimeout(attach, 120);
    return () => {
      window.clearTimeout(timeout);
      observer?.disconnect();
    };
  }, [pathname]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      style={
        {
          "--depth-x": "50vw",
          "--depth-y": "45vh",
          "--depth-scroll": "0px",
          "--depth-grid-x": "0px",
          "--depth-grid-y": "0px",
        } as React.CSSProperties
      }
    >
      <canvas ref={canvasRef} className="absolute inset-0 opacity-80" />
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(360px circle at var(--depth-x) var(--depth-y), rgba(103,232,249,0.075), transparent 68%), radial-gradient(520px circle at calc(var(--depth-x) + 12vw) calc(var(--depth-y) + 8vh), rgba(168,85,247,0.055), transparent 72%)",
        }}
      />
      <div
        className="absolute inset-[-8%] opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(103,232,249,0.32) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.24) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          transform:
            "translate3d(var(--depth-grid-x), var(--depth-grid-y), 0) rotateX(58deg) scale(1.45)",
          transformOrigin: "center top",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(10,10,10,0.42)_58%,_rgba(10,10,10,0.9)_100%)]" />
    </div>
  );
}
