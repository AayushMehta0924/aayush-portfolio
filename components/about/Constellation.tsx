"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { SKILL_TREE } from "@/lib/constellation-data";
import { playClick } from "@/lib/sounds";

const VB_W = 1000;
const VB_H = 700;
const CENTER: readonly [number, number] = [VB_W / 2, VB_H / 2];
const VB_PAD = 8;

// Uniform base bubble size — scale alone differentiates focus / siblings.
const BASE_R = 32;
const SCALE_ACTIVE = 1.2;
const SCALE_DIM = 0.82;
const SCALE_REST = 1;

// Default radii. Active root pulls outward, dimmed siblings compress inward.
const ROOT_R_ACTIVE = 180;
const ROOT_R_REST = 155;
const ROOT_R_DIM = 130;

const CHILD_R_ACTIVE = 105;
const CHILD_R_REST = 95;
const CHILD_R_DIM = 80;

const GRAND_R = 65;

// Pentagon, top first
const ROOT_ANGLES = [-90, -18, 54, 126, 198] as const;
const SIBLING_PUSH_DEG = 8;

const VIOLET = "#a855f7";
const CYAN = "#67e8f9";

const POS_SPRING = { type: "spring" as const, damping: 22, stiffness: 200, mass: 0.6 };
const SCALE_SPRING = { type: "spring" as const, damping: 18, stiffness: 240 };

type Level = 0 | 1 | 2;

type LaidOut = {
  id: string;
  label: string;
  level: Level;
  x: number;
  y: number;
  scale: number;
  parentX: number;
  parentY: number;
  hasChildren: boolean;
  expanded: boolean;
  outwardAngle: number;
  driftSeed: number;
};

function polar(angle: number, distance: number, origin: readonly [number, number]): [number, number] {
  const r = (angle * Math.PI) / 180;
  return [origin[0] + Math.cos(r) * distance, origin[1] + Math.sin(r) * distance];
}

function fanAngles(centerAngle: number, count: number, span: number): number[] {
  if (count === 1) return [centerAngle];
  const step = span / (count - 1);
  return Array.from({ length: count }, (_, i) => centerAngle - span / 2 + step * i);
}

function wrap180(deg: number): number {
  return ((((deg + 180) % 360) + 360) % 360) - 180;
}

function hash(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h % 1000) / 1000;
}

// Compress everything toward center if any node would clip the viewBox.
function autoFit(nodes: LaidOut[]): LaidOut[] {
  const cx = CENTER[0];
  const cy = CENTER[1];
  const halfX = VB_W / 2 - VB_PAD;
  const halfY = VB_H / 2 - VB_PAD;
  const maxR = BASE_R * SCALE_ACTIVE;
  let ratio = 1;
  for (const n of nodes) {
    const dx = Math.abs(n.x - cx) + maxR;
    const dy = Math.abs(n.y - cy) + maxR;
    const r = Math.max(dx / halfX, dy / halfY);
    if (r > ratio) ratio = r;
  }
  if (ratio <= 1) return nodes;
  return nodes.map((n) => ({
    ...n,
    x: cx + (n.x - cx) / ratio,
    y: cy + (n.y - cy) / ratio,
    parentX: cx + (n.parentX - cx) / ratio,
    parentY: cy + (n.parentY - cy) / ratio,
  }));
}

function buildLayout(openRoot: string | null, openChild: string | null): LaidOut[] {
  const out: LaidOut[] = [];
  const openRootIdx = openRoot ? SKILL_TREE.findIndex((r) => r.id === openRoot) : -1;
  const openRootAngle = openRootIdx >= 0 ? ROOT_ANGLES[openRootIdx] : null;

  // Roots
  SKILL_TREE.forEach((root, i) => {
    let angle: number = ROOT_ANGLES[i];
    let radius: number;
    let scale: number;
    if (i === openRootIdx) {
      radius = ROOT_R_ACTIVE;
      scale = SCALE_ACTIVE;
    } else if (openRootAngle !== null) {
      // Sibling — rotate slightly away from active root
      const delta = wrap180(angle - openRootAngle);
      const sign = Math.sign(delta) || 1;
      angle = angle + sign * SIBLING_PUSH_DEG;
      radius = ROOT_R_DIM;
      scale = SCALE_DIM;
    } else {
      radius = ROOT_R_REST;
      scale = SCALE_REST;
    }
    const [x, y] = polar(angle, radius, CENTER);
    out.push({
      id: root.id,
      label: root.label,
      level: 0,
      x,
      y,
      scale,
      parentX: CENTER[0],
      parentY: CENTER[1],
      hasChildren: !!root.children?.length,
      expanded: i === openRootIdx,
      outwardAngle: angle,
      driftSeed: hash(root.id),
    });
  });

  // Children of open root
  if (openRootIdx >= 0) {
    const root = SKILL_TREE[openRootIdx];
    const rb = out[openRootIdx];
    if (root.children?.length) {
      const childIdx = openChild
        ? root.children.findIndex((c) => c.id === openChild)
        : -1;
      const angles = fanAngles(rb.outwardAngle, root.children.length, 110);
      root.children.forEach((c, i) => {
        const isActive = i === childIdx;
        const isDim = childIdx >= 0 && !isActive;
        let angle = angles[i];
        if (isDim && childIdx >= 0) {
          // Push sibling children away from active child
          const activeAngle = angles[childIdx];
          const delta = wrap180(angle - activeAngle);
          const sign = Math.sign(delta) || 1;
          angle = angle + sign * 5;
        }
        const radius = isActive ? CHILD_R_ACTIVE : isDim ? CHILD_R_DIM : CHILD_R_REST;
        const [x, y] = polar(angle, radius, [rb.x, rb.y]);
        out.push({
          id: c.id,
          label: c.label,
          level: 1,
          x,
          y,
          scale: isActive ? SCALE_ACTIVE : isDim ? SCALE_DIM : SCALE_REST,
          parentX: rb.x,
          parentY: rb.y,
          hasChildren: !!c.children?.length,
          expanded: isActive,
          outwardAngle: angle,
          driftSeed: hash(c.id),
        });
      });
    }
  }

  // Grandchildren of open child
  if (openRootIdx >= 0 && openChild) {
    const root = SKILL_TREE[openRootIdx];
    const child = root.children?.find((c) => c.id === openChild);
    const cb = out.find((n) => n.id === openChild);
    if (child?.children?.length && cb) {
      const angles = fanAngles(cb.outwardAngle, child.children.length, 90);
      child.children.forEach((g, i) => {
        const angle = angles[i];
        const [x, y] = polar(angle, GRAND_R, [cb.x, cb.y]);
        out.push({
          id: g.id,
          label: g.label,
          level: 2,
          x,
          y,
          scale: SCALE_REST,
          parentX: cb.x,
          parentY: cb.y,
          hasChildren: false,
          expanded: false,
          outwardAngle: angle,
          driftSeed: hash(g.id),
        });
      });
    }
  }

  return autoFit(out);
}

export function Constellation() {
  const svgRef = useRef<SVGSVGElement>(null);
  const cursorX = useMotionValue(-9999);
  const cursorY = useMotionValue(-9999);

  const [openRoot, setOpenRoot] = useState<string | null>(null);
  const [openChild, setOpenChild] = useState<string | null>(null);

  const layout = useMemo(
    () => buildLayout(openRoot, openChild),
    [openRoot, openChild],
  );
  const layoutById = useMemo(() => {
    const m = new Map<string, LaidOut>();
    for (const n of layout) m.set(n.id, n);
    return m;
  }, [layout]);

  const onClick = (n: LaidOut) => {
    playClick().catch(() => {});
    if (n.level === 0) {
      setOpenChild(null);
      setOpenRoot((curr) => (curr === n.id ? null : n.id));
    } else if (n.level === 1 && n.hasChildren) {
      setOpenChild((curr) => (curr === n.id ? null : n.id));
    }
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const p = pt.matrixTransform(ctm.inverse());
    cursorX.set(p.x);
    cursorY.set(p.y);
  };

  const onPointerLeave = () => {
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
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
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
            <filter id="bubbleGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="9" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <Stars />

          {/* Lines: center → roots */}
          {layout
            .filter((n) => n.level === 0)
            .map((n) => (
              <DynLine
                key={`l-${n.id}`}
                from={[CENTER[0], CENTER[1]]}
                to={[n.x, n.y]}
                color="#3a2f4a"
                opacity={0.5}
              />
            ))}

          {/* Lines: parent → children, parent → grandchildren */}
          <AnimatePresence>
            {layout
              .filter((n) => n.level > 0)
              .map((n) => (
                <DynLine
                  key={`l-${n.id}`}
                  from={[n.parentX, n.parentY]}
                  to={[n.x, n.y]}
                  color={n.level === 1 ? VIOLET : CYAN}
                  opacity={0.6}
                  enter
                />
              ))}
          </AnimatePresence>

          <CenterHub />

          <AnimatePresence>
            {layout.map((n) => (
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

/* ─── center hub ─────────────────────────────────── */

function CenterHub() {
  return (
    <g>
      <motion.circle
        cx={CENTER[0]}
        cy={CENTER[1]}
        r={48}
        fill="none"
        stroke={VIOLET}
        strokeWidth={0.5}
        opacity={0.25}
        animate={{ r: [48, 56, 48], opacity: [0.25, 0.1, 0.25] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <circle cx={CENTER[0]} cy={CENTER[1]} r={32} fill="url(#hubFill)" stroke={VIOLET} strokeOpacity={0.6} strokeWidth={1} />
      <text
        x={CENTER[0]}
        y={CENTER[1]}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        fontSize={18}
        fill={VIOLET}
        pointerEvents="none"
      >
        ~
      </text>
    </g>
  );
}

/* ─── animated line that springs to current endpoints ────── */

function DynLine({
  from,
  to,
  color,
  opacity = 0.5,
  enter = false,
}: {
  from: [number, number];
  to: [number, number];
  color: string;
  opacity?: number;
  enter?: boolean;
}) {
  if (enter) {
    return (
      <motion.line
        initial={{ opacity: 0, x1: from[0], y1: from[1], x2: from[0], y2: from[1] }}
        animate={{ opacity, x1: from[0], y1: from[1], x2: to[0], y2: to[1] }}
        exit={{ opacity: 0 }}
        transition={{
          opacity: { duration: 0.25 },
          x1: POS_SPRING,
          y1: POS_SPRING,
          x2: POS_SPRING,
          y2: POS_SPRING,
        }}
        stroke={color}
        strokeWidth={1}
        strokeDasharray="3 6"
      />
    );
  }
  return (
    <motion.line
      initial={false}
      animate={{ x1: from[0], y1: from[1], x2: to[0], y2: to[1] }}
      transition={{ x1: POS_SPRING, y1: POS_SPRING, x2: POS_SPRING, y2: POS_SPRING }}
      stroke={color}
      strokeWidth={1}
      strokeDasharray="3 6"
      opacity={opacity}
    />
  );
}

/* ─── bubble with magnetic pull, drift, scale ────── */

function Bubble({
  node,
  cursorX,
  cursorY,
  onClick,
}: {
  node: LaidOut;
  cursorX: ReturnType<typeof useMotionValue<number>>;
  cursorY: ReturnType<typeof useMotionValue<number>>;
  onClick: () => void;
}) {
  const isRoot = node.level === 0;
  const isChild = node.level === 1;
  const accent = isRoot ? VIOLET : CYAN;
  const fill = isRoot ? "url(#rootFill)" : "url(#childFill)";
  const fontSize = isRoot ? 13 : isChild ? 12 : 11;
  const labelOffset = BASE_R + 14;

  const captureR = isRoot ? 90 : 72;
  const maxPull = isRoot ? 11 : 8;

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

  const seed = node.driftSeed;
  const dx = 3 + seed * 3;
  const dy = 3 + (1 - seed) * 3;
  const dur = 7 + seed * 5;

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0, x: node.x, y: node.y }}
      animate={{ opacity: 1, x: node.x, y: node.y }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{
        opacity: { duration: 0.3 },
        x: POS_SPRING,
        y: POS_SPRING,
      }}
    >
      <motion.g
        animate={{ x: [0, dx, -dx * 0.6, 0], y: [0, -dy, dy * 0.5, 0] }}
        transition={{
          x: { duration: dur, repeat: Infinity, ease: "easeInOut" },
          y: { duration: dur * 0.85, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <motion.g
          animate={{ scale: node.scale }}
          transition={{ scale: SCALE_SPRING }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <motion.g
            whileHover={{ scale: 1.08 }}
            style={{
              x: magX,
              y: magY,
              cursor: node.hasChildren ? "pointer" : "default",
              transformBox: "fill-box",
              transformOrigin: "center",
            }}
            onClick={onClick}
          >
            <motion.circle
              r={BASE_R + 16}
              fill="none"
              stroke={accent}
              strokeWidth={1}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{
                opacity: node.expanded ? 0.5 : 0,
                scale: node.expanded ? 1 : 0.85,
              }}
              whileHover={{ opacity: 0.5, scale: 1 }}
              transition={{ duration: 0.25 }}
            />
            <circle
              r={BASE_R}
              fill={fill}
              stroke={accent}
              strokeOpacity={node.expanded ? 0.9 : 0.5}
              strokeWidth={1.5}
              filter="url(#bubbleGlow)"
            />
            <circle
              r={BASE_R - 2}
              fill="none"
              stroke="#ffffff"
              strokeOpacity={0.07}
              strokeWidth={1}
            />
            <text
              y={isRoot ? 0 : 0}
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
      </motion.g>
    </motion.g>
  );
}

/* ─── ambient star field ─────────────────────────── */

const STAR_POSITIONS: { x: number; y: number; r: number; phase: number }[] = (() => {
  const arr: { x: number; y: number; r: number; phase: number }[] = [];
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
