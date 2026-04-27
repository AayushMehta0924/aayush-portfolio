"use client";

import { useEffect, useRef, useState } from "react";

type HomeRoom =
  | "hero"
  | "identity"
  | "play"
  | "systems"
  | "work"
  | "projects"
  | "portals"
  | "contact";

const GLASS_PLANES = [
  { id: "build", label: "build", sublabel: "systems" },
  { id: "play", label: "play", sublabel: "rhythm" },
  { id: "notice", label: "notice", sublabel: "light" },
  { id: "make", label: "make", sublabel: "craft" },
];

const MEDIA_STRIPS = [
  "piano / rhythm / late night keys",
  "football / field geometry / movement",
  "craft / paper / handmade texture",
  "systems / interfaces / useful tools",
];

export function HomeCinematicBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [room, setRoom] = useState<HomeRoom>("hero");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let targetX = window.innerWidth * 0.5;
    let targetY = window.innerHeight * 0.48;
    let x = targetX;
    let y = targetY;

    const setVars = () => {
      const width = Math.max(window.innerWidth, 1);
      const height = Math.max(window.innerHeight, 1);
      const nx = x / width - 0.5;
      const ny = y / height - 0.5;

      root.style.setProperty("--home-cursor-x", `${x}px`);
      root.style.setProperty("--home-cursor-y", `${y}px`);
      root.style.setProperty("--home-tilt-x", `${nx * 10}deg`);
      root.style.setProperty("--home-tilt-y", `${ny * -8}deg`);
      root.style.setProperty("--home-parallax-x", `${nx * 34}px`);
      root.style.setProperty("--home-parallax-y", `${ny * 28}px`);
    };

    const tick = () => {
      const ease = reduced.matches ? 1 : 0.12;
      x += (targetX - x) * ease;
      y += (targetY - y) * ease;
      setVars();
      raf = requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      targetX = event.clientX;
      targetY = event.clientY;
    };

    const onScroll = () => {
      root.style.setProperty("--home-scroll", `${window.scrollY}px`);
      root.style.setProperty("--home-scroll-slow", `${window.scrollY * -0.04}px`);
      root.style.setProperty("--home-scroll-fast", `${window.scrollY * -0.12}px`);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    const scores = new Map<Element, number>();
    const rooms = new Map<Element, HomeRoom>();

    const attach = () => {
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-home-room]"),
      );

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            scores.set(entry.target, entry.intersectionRatio);
          }

          let nextRoom: HomeRoom | null = null;
          let bestScore = 0;
          for (const [element, score] of scores) {
            const candidate = rooms.get(element);
            if (candidate && score > bestScore) {
              bestScore = score;
              nextRoom = candidate;
            }
          }

          if (nextRoom && bestScore > 0.12) setRoom(nextRoom);
        },
        { threshold: [0, 0.12, 0.25, 0.45, 0.65, 0.85] },
      );

      for (const section of sections) {
        const room = section.dataset.homeRoom as HomeRoom | undefined;
        if (!room) continue;
        rooms.set(section, room);
        scores.set(section, 0);
        observer.observe(section);
      }
    };

    const timeout = window.setTimeout(attach, 80);
    return () => {
      window.clearTimeout(timeout);
      observer?.disconnect();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      data-room={room}
      aria-hidden
      className="home-cinema"
      style={
        {
          "--home-cursor-x": "50vw",
          "--home-cursor-y": "48vh",
          "--home-tilt-x": "0deg",
          "--home-tilt-y": "0deg",
          "--home-parallax-x": "0px",
          "--home-parallax-y": "0px",
          "--home-scroll": "0px",
          "--home-scroll-slow": "0px",
          "--home-scroll-fast": "0px",
        } as React.CSSProperties
      }
    >
      <div className="home-cinema__grain" />
      <div className="home-cinema__scanner" />

      <div className="home-cinema__stage">
        {GLASS_PLANES.map((plane, index) => (
          <div
            key={plane.id}
            className={`home-cinema__plane home-cinema__plane--${index + 1}`}
          >
            <span>{plane.label}</span>
            <small>{plane.sublabel}</small>
          </div>
        ))}
      </div>

      <svg className="home-cinema__motifs" viewBox="0 0 1200 800" preserveAspectRatio="none">
        <g className="home-cinema__motif home-cinema__motif--lens">
          <circle cx="465" cy="315" r="92" />
          <circle cx="465" cy="315" r="148" />
          <path d="M270 520 C380 430 540 430 650 520" />
        </g>

        <g className="home-cinema__motif home-cinema__motif--play">
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M80 ${220 + i * 24} C300 ${178 + i * 14} 520 ${
                265 + i * 10
              } 760 ${220 + i * 24} S1060 ${205 + i * 22} 1180 ${
                220 + i * 24
              }`}
            />
          ))}
          <circle cx="930" cy="505" r="118" />
          <path d="M930 387 L930 623 M775 505 L1085 505" />
        </g>

        <g className="home-cinema__motif home-cinema__motif--craft">
          <path d="M130 190 L390 118 L472 358 L210 430 Z" />
          <path d="M770 120 L1040 230 L930 515 L690 400 Z" />
          <path d="M160 610 L405 510 L505 692 L250 742 Z" />
        </g>

        <g className="home-cinema__motif home-cinema__motif--systems">
          <path d="M230 190 H970 M230 300 H970 M230 410 H970 M230 520 H970" />
          <path d="M320 130 V590 M520 130 V590 M720 130 V590 M920 130 V590" />
          <circle cx="520" cy="300" r="64" />
          <circle cx="720" cy="410" r="82" />
          <path d="M520 300 L720 410 L920 300" />
        </g>

        <g className="home-cinema__motif home-cinema__motif--work">
          <path d="M515 60 L660 60 L715 740 L455 740 Z" />
          <path d="M585 80 V720 M485 250 H690 M470 430 H705 M455 610 H720" />
        </g>

        <g className="home-cinema__motif home-cinema__motif--projects">
          <rect x="215" y="180" width="290" height="180" rx="10" />
          <rect x="455" y="260" width="290" height="180" rx="10" />
          <rect x="695" y="340" width="290" height="180" rx="10" />
          <path d="M505 270 L455 300 M745 350 L695 380" />
        </g>

        <g className="home-cinema__motif home-cinema__motif--contact">
          <circle cx="880" cy="430" r="58" />
          <circle cx="880" cy="430" r="128" />
          <circle cx="880" cy="430" r="205" />
          <path d="M880 430 L1080 330" />
          <path d="M180 540 H560 M180 590 H470 M180 640 H610" />
        </g>
      </svg>

      <div className="home-cinema__strips">
        {MEDIA_STRIPS.map((strip, index) => (
          <div
            key={strip}
            className={`home-cinema__strip home-cinema__strip--${index + 1}`}
          >
            {strip}
          </div>
        ))}
      </div>

      <div className="home-cinema__vignette" />
    </div>
  );
}
