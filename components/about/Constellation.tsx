"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { SKILL_TREE, type SkillNode } from "@/lib/constellation-data";
import { playClick } from "@/lib/sounds";

const VB_W = 1100;
const VB_H = 560;
const ROW_Y = [120, 300, 470] as const; // y-position per depth level

type Positioned = SkillNode & { x: number; y: number; depth: number; parentX?: number };

function spread(items: SkillNode[], y: number, depth: number, anchorX?: number, span = VB_W - 160) {
  const count = items.length;
  if (count === 0) return [] as Positioned[];
  const center = anchorX ?? VB_W / 2;
  const halfSpan = Math.min(span, Math.max(140 * (count - 1), 0)) / 2;
  const start = center - halfSpan;
  const step = count === 1 ? 0 : (halfSpan * 2) / (count - 1);
  return items.map((n, i) => ({
    ...n,
    x: count === 1 ? center : start + step * i,
    y,
    depth,
    parentX: anchorX,
  }));
}

export function Constellation() {
  const [activeRoot, setActiveRoot] = useState<string | null>(null);
  const [activeChild, setActiveChild] = useState<string | null>(null);

  const roots = useMemo(() => spread(SKILL_TREE, ROW_Y[0], 0), []);

  const root = activeRoot
    ? roots.find((r) => r.id === activeRoot) ?? null
    : null;
  const childList = root?.children ?? [];
  const children = useMemo(
    () => spread(childList, ROW_Y[1], 1, root?.x, 800),
    [childList, root?.x],
  );

  const child = activeChild ? children.find((c) => c.id === activeChild) ?? null : null;
  const grandList = child?.children ?? [];
  const grandchildren = useMemo(
    () => spread(grandList, ROW_Y[2], 2, child?.x, 700),
    [grandList, child?.x],
  );

  const handleRoot = (id: string) => {
    playClick().catch(() => {});
    setActiveChild(null);
    setActiveRoot((curr) => (curr === id ? null : id));
  };

  const handleChild = (id: string) => {
    playClick().catch(() => {});
    setActiveChild((curr) => (curr === id ? null : id));
  };

  return (
    <div className="relative w-full">
      <p className="font-mono text-[11px] text-muted mb-3">
        click a node — children expand. click again to collapse.
      </p>
      <div className="rounded-md border border-line bg-elevated/40 overflow-hidden">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="w-full h-auto block"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* lines */}
          {root && (
            <g>
              {children.map((c) => (
                <ConnLine
                  key={`r-${c.id}`}
                  from={[root.x, root.y]}
                  to={[c.x, c.y]}
                  color="#a855f7"
                />
              ))}
            </g>
          )}
          {child && (
            <g>
              {grandchildren.map((g) => (
                <ConnLine
                  key={`c-${g.id}`}
                  from={[child.x, child.y]}
                  to={[g.x, g.y]}
                  color="#67e8f9"
                />
              ))}
            </g>
          )}

          {/* roots */}
          {roots.map((n, i) => (
            <Node
              key={n.id}
              n={n}
              active={n.id === activeRoot}
              dimmed={!!activeRoot && n.id !== activeRoot}
              colorActive="#a855f7"
              radius={28}
              fontSize={13}
              floatPhase={i * 0.7}
              onClick={() => handleRoot(n.id)}
            />
          ))}

          {/* children */}
          <AnimatePresence>
            {root && (
              <g>
                {children.map((c, i) => (
                  <Node
                    key={c.id}
                    n={c}
                    active={c.id === activeChild}
                    dimmed={!!activeChild && c.id !== activeChild}
                    colorActive="#67e8f9"
                    radius={20}
                    fontSize={11}
                    floatPhase={0.4 + i * 0.5}
                    enter
                    delay={0.04 * i}
                    onClick={() => c.children?.length && handleChild(c.id)}
                    isLeaf={!c.children?.length}
                  />
                ))}
              </g>
            )}
          </AnimatePresence>

          {/* grandchildren */}
          <AnimatePresence>
            {child && (
              <g>
                {grandchildren.map((g, i) => (
                  <Node
                    key={g.id}
                    n={g}
                    active={false}
                    dimmed={false}
                    colorActive="#67e8f9"
                    radius={14}
                    fontSize={10}
                    floatPhase={0.2 + i * 0.4}
                    enter
                    delay={0.04 * i}
                    isLeaf
                  />
                ))}
              </g>
            )}
          </AnimatePresence>
        </svg>
      </div>
    </div>
  );
}

function ConnLine({
  from,
  to,
  color,
}: {
  from: [number, number];
  to: [number, number];
  color: string;
}) {
  return (
    <motion.line
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.55 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
      x1={from[0]}
      y1={from[1]}
      x2={to[0]}
      y2={to[1]}
      stroke={color}
      strokeWidth={1}
      strokeDasharray="3 4"
    />
  );
}

function Node({
  n,
  active,
  dimmed,
  colorActive,
  radius,
  fontSize,
  floatPhase,
  enter,
  delay = 0,
  onClick,
  isLeaf,
}: {
  n: Positioned;
  active: boolean;
  dimmed: boolean;
  colorActive: string;
  radius: number;
  fontSize: number;
  floatPhase: number;
  enter?: boolean;
  delay?: number;
  onClick?: () => void;
  isLeaf?: boolean;
}) {
  const stroke = active ? colorActive : dimmed ? "#3a3340" : "#444";
  const fill = active ? `${colorActive}33` : "#171717";
  const labelColor = dimmed ? "#5b545f" : active ? "#ededed" : "#bdb6c2";

  const enterAnim = enter
    ? {
        initial: { opacity: 0, scale: 0.5 },
        animate: { opacity: dimmed ? 0.45 : 1, scale: 1 },
        exit: { opacity: 0, scale: 0.5 },
        transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] as const, delay },
      }
    : {
        animate: { opacity: dimmed ? 0.4 : 1 },
        transition: { duration: 0.25 },
      };

  // Gentle Y oscillation as a "floating" feel — implemented via CSS keyframes
  // baked inline so there's no global stylesheet plumbing.
  const floatStyle: React.CSSProperties = {
    animation: `nodeFloat 6s ease-in-out ${floatPhase}s infinite`,
    transformBox: "fill-box",
    transformOrigin: "center",
  };

  return (
    <motion.g
      {...enterAnim}
      style={{ cursor: onClick && !isLeaf ? "pointer" : "default" }}
      onClick={onClick}
    >
      <style>{`@keyframes nodeFloat { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }`}</style>
      <g style={floatStyle}>
        <circle cx={n.x} cy={n.y} r={radius} fill={fill} stroke={stroke} strokeWidth={1.5} />
        {active && (
          <circle
            cx={n.x}
            cy={n.y}
            r={radius + 6}
            fill="none"
            stroke={colorActive}
            strokeWidth={1}
            opacity={0.4}
          />
        )}
        <text
          x={n.x}
          y={n.y + radius + 18}
          textAnchor="middle"
          fontFamily="var(--font-geist-mono), ui-monospace, monospace"
          fontSize={fontSize}
          fill={labelColor}
        >
          {n.label}
        </text>
      </g>
    </motion.g>
  );
}
