"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ABOUT } from "@/content/about";
import { Constellation } from "./Constellation";
import { playClick } from "@/lib/sounds";

type Key = "story" | "tech" | "values" | "currently" | "fun_facts";

const EXPANDABLE_KEYS: Key[] = ["story", "tech", "values", "currently", "fun_facts"];

export function JsonAbout() {
  const [open, setOpen] = useState<Set<Key>>(new Set());

  const toggle = (k: Key) => {
    playClick().catch(() => {});
    setOpen((curr) => {
      const next = new Set(curr);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  return (
    <div className="font-mono text-sm sm:text-[15px] leading-7 text-fg">
      <Brace open />

      {/* simple string keys */}
      <Line indent={1}>
        <KeyToken k="name" /> <Punct>:</Punct> <StrToken value={ABOUT.name} />
        <Punct>,</Punct>
      </Line>
      <Line indent={1}>
        <KeyToken k="role" /> <Punct>:</Punct> <StrToken value={ABOUT.role} />
        <Punct>,</Punct>
      </Line>
      <Line indent={1}>
        <KeyToken k="based_in" /> <Punct>:</Punct>{" "}
        <StrToken value={ABOUT.based_in} />
        <Punct>,</Punct>
      </Line>

      {/* expandable keys */}
      {EXPANDABLE_KEYS.map((k, i) => {
        const isOpen = open.has(k);
        const isLast = i === EXPANDABLE_KEYS.length - 1;
        return (
          <ExpandableRow
            key={k}
            label={k}
            open={isOpen}
            isLast={isLast}
            onToggle={() => toggle(k)}
          >
            {k === "tech" ? (
              <div className="my-3">
                <Constellation />
              </div>
            ) : (
              <ArrayValue items={ABOUT[k] as string[]} />
            )}
          </ExpandableRow>
        );
      })}

      <Brace />
    </div>
  );
}

function ExpandableRow({
  label,
  open,
  isLast,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  isLast: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <Line indent={1}>
        <button
          type="button"
          onClick={onToggle}
          className="text-left hover:text-violet transition-colors group cursor-pointer"
          aria-expanded={open}
        >
          <KeyToken k={label} /> <Punct>:</Punct>{" "}
          {!open && (
            <span className="text-muted group-hover:text-violet transition-colors">
              ▸ click to expand
            </span>
          )}
          {open && (
            <span className="text-cyan">
              {label === "tech" ? "[ constellation ]" : "["}
            </span>
          )}
        </button>
        {!open && <Punct>,</Punct>}
      </Line>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] as const }}
            className="overflow-hidden"
          >
            <div className="ml-[1ch]">{children}</div>
            {label !== "tech" && (
              <Line indent={1}>
                <span className="text-cyan">]</span>
                {!isLast && <Punct>,</Punct>}
              </Line>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ArrayValue({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1">
      {items.map((s, i) => (
        <li key={i} className="text-fg pl-[3ch]">
          <StrToken value={s} multiline />
          {i < items.length - 1 && <Punct>,</Punct>}
        </li>
      ))}
    </ul>
  );
}

function KeyToken({ k }: { k: string }) {
  return (
    <span className="text-violet">
      <Punct>&quot;</Punct>
      <span>{k}</span>
      <Punct>&quot;</Punct>
    </span>
  );
}

function StrToken({ value, multiline = false }: { value: string; multiline?: boolean }) {
  return (
    <span className={`text-cyan ${multiline ? "whitespace-pre-wrap" : ""}`}>
      <Punct>&quot;</Punct>
      <span className="text-fg">{value}</span>
      <Punct>&quot;</Punct>
    </span>
  );
}

function Punct({ children }: { children: React.ReactNode }) {
  return <span className="text-muted">{children}</span>;
}

function Line({ indent = 0, children }: { indent?: number; children: React.ReactNode }) {
  return (
    <div style={{ paddingLeft: `${indent * 2}ch` }}>
      {children}
    </div>
  );
}

function Brace({ open: opening }: { open?: boolean }) {
  return <div className="text-muted">{opening ? "{" : "}"}</div>;
}
