"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { SKILL_TREE, type SkillNode } from "@/lib/constellation-data";
import { playClick } from "@/lib/sounds";

const VB_W = 1000;
const VB_H = 700;
const CENTER: readonly [number, number] = [VB_W / 2, VB_H / 2];

const ROOT_RADIUS = 230;
const CHILD_RADIUS = 150;
const GRAND_RADIUS = 100;

const ROOT_BUBBLE_R = 46;
const CHILD_BUBBLE_R = 32;
const GRAND_BUBBLE_R = 20;

// Pentagon angles, starting at top
const ROOT_ANGLES = [-90, -18, 54, 126, 198] as const;

const VIOLET = "#a855f7";
const CYAN = "#67e8f9";

type Level = 0 | 1 | 2;

type VisibleNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  level: Level;
  outwardAngle: number;
  parentX: number;
  parentY: number;
  hasChildren: boolean;
  expanded: boolean;
  driftSeed: number;
};

function polar(
  angle: number,
  distance: number,
  origin: readonly [number, number],
): [number, number] {
  const r = (angle * Math.PI) / 180;
  return [origin[0] + Math.cos(r) * distance, origin[1] + Math.sin(r) * distance];
}

function fanAngles(centerAngle: number, count: number, span: number): number[] {
  if (count === 1) return [centerAngle];
  const step = span / (count - 1);
  return Array.from({ length: count }, (_, i) => centerAngle - span / 2 + step * i);
}

// Stable pseudo-random per-id so drift looks ambient but doesn't reshuffle on
// every render.
function hash(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h % 1000) / 1000;
}

export function Constellation() {
  const svgRef = useRef<SVGSVGElement>(null);
  const cursorX = useMotionValue(-9999);
  const cursorY = useMotionValue(-9999);

  const [openRoot, setOpenRoot] = useState<string | null>(null);
  const [openChild, setOpenChild] = useState<string | null>(null);

  const visible = useMemo<VisibleNode[]>(() => {
    const out: VisibleNode[] = [];

    SKILL_TREE.forEach((root, i) => {
      const angle = ROOT_ANGLES[i];
      const [x, y] = polar(angle, ROOT_RADIUS, CENTER);
      out.push({
        id: root.id,
        label: root.label,
        x,
        y,
        level: 0,
        outwardAngle: angle,
        parentX: CENTER[0],
        parentY: CENTER[1],
        hasChildren: !!root.children?.length,
        expanded: openRoot === root.id,
        driftSeed: hash(root.id),
      });
    });

    if (openRoot) {
      const root = SKILL_TREE.find((r) => r.id === openRoot);
      const rb = out.find((n) => n.id === openRoot);
      if (root?.children && rb) {
        const angles = fanAngles(rb.outwardAngle, root.children.length, 110);
        root.children.forEach((c, i) => {
          const angle = angles[i];
          const [x, y] = polar(angle, CHILD_RADIUS, [rb.x, rb.y]);
          out.push({
            id: c.id,
            label: c.label,
            x,
            y,
            level: 1,
            outwardAngle: angle,
            parentX: rb.x,
            parentY: rb.y,
            hasChildren: !!c.children?.length,
            expanded: openChild === c.id,
            driftSeed: hash(c.id),
          });
        });
      }
    }

    if (openChild) {
      const root = SKILL_TREE.find((r) => r.id === openRoot);
      const child = root?.children?.find((c) => c.id === openChild);
      const cb = out.find((n) => n.id === openChild);
      if (child?.children && cb) {
        const angles = fanAngles(cb.outwardAngle, child.children.length, 95);
        child.children.forEach((g, i) => {
          const angle = angles[i];
          const [x, y] = polar(angle, GRAND_RADIUS, [cb.x, cb.y]);
          out.push({
            id: g.id,
            label: g.label,
            x,
            y,
            level: 2,
            outwardAngle: angle,
            parentX: cb.x,
            parentY: cb.y,
            hasChildren: false,
            expanded: false,
            driftSeed: hash(g.id),
          });
        });
      }
    }
    return out;
  }, [openRoot, openChild]);

  const onClick = (n: VisibleNode) => {
    playClick().catch(() => {});
    if (n.level === 0) {
      setOpenChild(null);
      setOpenRoot((curr) => (curr === n.id ? null : n.id));
    } else if (n.level === 1 && n.hasChildren) {
      setOpenChild((curr) => (curr === n.id ? null : n.id));
    }
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const local = pt.matrixTransform(ctm.inverse());
    cursorX.set(local.x);
    cursorY.set(local.y);
  };

  const handlePointerLeave = () => {
    cursorX.set(-9999);
    cursorY.set(-9999);
  };

  return (
    <div className="relative w-full">
      <p className="font-mono text-[11px] text-muted mb-3">
        click a bubble — children spring outward. click again to collapse.
      </p>
      <div className="rounded-md border border-line bg-[radial-gradient(ellipse_at_center,_#15101f_0%,_#0a0a0a_70%)] overflow-hidden">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-auto block touch-none"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <defs>
            <radialGradient id="hubFill" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#1f1430" />
              <stop offset="100%" stopColor="#0a0a0a" />
            </radialGradient>
            <radialGradient id="rootFill" cx="0.3" cy="0.25" r="0.95">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.5" />
              <stop offset="55%" stopColor="#1a0e2a" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0a0a0a" />
            </radialGradient>
            <radialGradient id="childFill" cx="0.3" cy="0.25" r="0.95">
              <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.45" />
              <stop offset="55%" stopColor="#0b1f24" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0a0a0a" />
            </radialGradient>
            <radialGradient id="grandFill" cx="0.3" cy="0.25" r="0.95">
              <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#0b1f24" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0a0a0a" />
            </radialGradient>
            <filter id="bubbleGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="10" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <Stars />

          {/* Center -> roots: always present */}
          {visible
            .filter((n) => n.level === 0)
            .map((n) => (
              <ConnLine
                key={`l0-${n.id}`}
                from={[CENTER[0], CENTER[1]]}
                to={[n.x, n.y]}
                color="#3a2f4a"
                opacity={0.6}
                animatedDash
              />
            ))}

          {/* Root -> child / child -> grandchild */}
          <AnimatePresence>
            {visible
              .filter((n) => n.level > 0)
              .map((n) => (
                <ConnLine
                  key={`l-${n.id}`}
                  from={[n.parentX, n.parentY]}
                  to={[n.x, n.y]}
                  color={n.level === 1 ? VIOLET : CYAN}
                  opacity={0.55}
                  enter
                />
              ))}
          </AnimatePresence>

          <CenterHub />

          <AnimatePresence>
            {visible.map((n) => (
              <Bubble
                key={n.id}
                node={n}
                cursorX={cursorX}
                cursorY={cursorY}
                onClick={() => onClick(n)}
              />
            ))}
          </AnimatePresence>
        </svg>
      </div>
    </div>
  );
}

/* ─── center hub ──────────────────────────────────────── */

function CenterHub() {
  return (
    <g>
      <motion.circle
        cx={CENTER[0]}
        cy={CENTER[1]}
        r={56}
        fill="none"
        stroke={VIOLET}
        strokeWidth={0.5}
        opacity={0.25}
        animate={{ r: [56, 64, 56], opacity: [0.25, 0.1, 0.25] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <circle cx={CENTER[0]} cy={CENTER[1]} r={36} fill="url(#hubFill)" stroke={VIOLET} strokeOpacity={0.6} strokeWidth={1} />
      <text
        x={CENTER[0]}
        y={CENTER[1]}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        fontSize={20}
        fill={VIOLET}
        pointerEvents="none"
      >
        ~
      </text>
    </g>
  );
}

/* ─── connection lines ────────────────────────────────── */

function ConnLine({
  from,
  to,
  color,
  opacity = 0.5,
  enter = false,
  animatedDash = false,
}: {
  from: [number, number];
  to: [number, number];
  color: string;
  opacity?: number;
  enter?: boolean;
  animatedDash?: boolean;
}) {
  const lineProps = {
    x1: from[0],
    y1: from[1],
    x2: to[0],
    y2: to[1],
    stroke: color,
    strokeWidth: 1,
    strokeDasharray: "3 6",
  };

  if (enter) {
    return (
      <motion.line
        {...lineProps}
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity, pathLength: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] as const }}
      />
    );
  }

  if (animatedDash) {
    return (
      <motion.line
        {...lineProps}
        opacity={opacity}
        animate={{ strokeDashoffset: [0, -18] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
    );
  }

  return <line {...lineProps} opacity={opacity} />;
}

/* ─── bubble (root / child / grandchild) ──────────────── */

function Bubble({
  node,
  cursorX,
  cursorY,
  onClick,
}: {
  node: VisibleNode;
  cursorX: ReturnType<typeof useMotionValue<number>>;
  cursorY: ReturnType<typeof useMotionValue<number>>;
  onClick: () => void;
}) {
  const isRoot = node.level === 0;
  const isChild = node.level === 1;
  const isGrand = node.level === 2;

  const r = isRoot ? ROOT_BUBBLE_R : isChild ? CHILD_BUBBLE_R : GRAND_BUBBLE_R;
  const fill = isRoot ? "url(#rootFill)" : isChild ? "url(#childFill)" : "url(#grandFill)";
  const accent = isRoot ? VIOLET : CYAN;
  const fontSize = isRoot ? 14 : isChild ? 12 : 11;

  // Magnetic pull toward cursor when within capture radius.
  const captureR = isRoot ? 110 : isChild ? 80 : 60;
  const maxPull = isRoot ? 14 : isChild ? 10 : 7;

  const targetX = useTransform([cursorX, cursorY] as const, (latest) => {
    const cx = latest[0] as number;
    const cy = latest[1] as number;
    const dx = cx - node.x;
    const dy = cy - node.y;
    const dist = Math.hypot(dx, dy);
    if (dist > captureR || dist === 0) return 0;
    const pull = 1 - dist / captureR;
    return (dx / dist) * pull * maxPull;
  });
  const targetY = useTransform([cursorX, cursorY] as const, (latest) => {
    const cx = latest[0] as number;
    const cy = latest[1] as number;
    const dx = cx - node.x;
    const dy = cy - node.y;
    const dist = Math.hypot(dx, dy);
    if (dist > captureR || dist === 0) return 0;
    const pull = 1 - dist / captureR;
    return (dy / dist) * pull * maxPull;
  });
  const magX = useSpring(targetX, { damping: 22, stiffness: 220, mass: 0.6 });
  const magY = useSpring(targetY, { damping: 22, stiffness: 220, mass: 0.6 });

  // Per-bubble ambient drift loop. Stable seed so it doesn't reshuffle.
  const seed = node.driftSeed;
  const dx = 4 + seed * 4;
  const dy = 4 + (1 - seed) * 4;
  const dur = 7 + seed * 5;

  return (
    <g transform={`translate(${node.x} ${node.y})`}>
      <motion.g
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          x: [0, dx, -dx * 0.6, 0],
          y: [0, -dy, dy * 0.5, 0],
        }}
        exit={{ scale: 0.3, opacity: 0 }}
        transition={{
          scale: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
          opacity: { duration: 0.45 },
          x: { duration: dur, repeat: Infinity, ease: "easeInOut" },
          y: { duration: dur * 0.85, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <motion.g
          initial="rest"
          whileHover="hover"
          animate={node.expanded ? "active" : "rest"}
          variants={{ rest: { scale: 1 }, hover: { scale: 1.08 }, active: { scale: 1.04 } }}
          transition={{ scale: { type: "spring", damping: 18, stiffness: 260 } }}
          style={{
            x: magX,
            y: magY,
            cursor: node.hasChildren ? "pointer" : "default",
            transformBox: "fill-box",
            transformOrigin: "center",
          }}
          onClick={onClick}
        >
          {/* outer halo, fades in on hover or when active */}
          <motion.circle
            r={r + 18}
            fill="none"
            stroke={accent}
            strokeWidth={1}
            variants={{
              rest: { opacity: 0, scale: 0.85 },
              hover: { opacity: 0.45, scale: 1 },
              active: { opacity: 0.55, scale: 1 },
            }}
            transition={{ duration: 0.25 }}
          />
          {/* core bubble */}
          <circle
            r={r}
            fill={fill}
            stroke={accent}
            strokeOpacity={node.expanded ? 0.9 : 0.45}
            strokeWidth={1.5}
            filter="url(#bubbleGlow)"
          />
          {/* highlight rim */}
          <circle
            r={r - 2}
            fill="none"
            stroke="#ffffff"
            strokeOpacity={0.08}
            strokeWidth={1}
          />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-geist-mono), ui-monospace, monospace"
            fontSize={fontSize}
            fill="#ededed"
            fontWeight={isRoot ? 500 : 400}
            pointerEvents="none"
          >
            {node.label}
          </text>
        </motion.g>
      </motion.g>
    </g>
  );
}

/* ─── ambient stars ───────────────────────────────────── */

const STAR_POSITIONS: { x: number; y: number; r: number; phase: number }[] = (() => {
  const arr = [] as { x: number; y: number; r: number; phase: number }[];
  // Deterministic — Mulberry32-like
  let s = 12345;
  const rand = () => {
    s = (s * 1664525 + 1013904223) | 0;
    return ((s >>> 0) % 10000) / 10000;
  };
  for (let i = 0; i < 50; i++) {
    arr.push({
      x: rand() * VB_W,
      y: rand() * VB_H,
      r: 0.6 + rand() * 1.2,
      phase: rand() * 4,
    });
  }
  return arr;
})();

function Stars() {
  return (
    <g pointerEvents="none">
      {STAR_POSITIONS.map((s, i) => (
        <motion.circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill="#a78bfa"
          animate={{ opacity: [0.15, 0.5, 0.15] }}
          transition={{
            duration: 4 + s.phase,
            repeat: Infinity,
            ease: "easeInOut",
            delay: s.phase,
          }}
        />
      ))}
    </g>
  );
}
