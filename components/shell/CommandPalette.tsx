"use client";

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ACTION_COMMANDS,
  ALL_COMMANDS,
  NAV_COMMANDS,
  SYSTEM_COMMANDS,
  type CommandDef,
} from "@/lib/commands";
import { useSoundMuted } from "@/lib/use-sound";
import { playClick, playWoosh } from "@/lib/sounds";

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [whoamiOpen, setWhoamiOpen] = useState(false);
  const [muted, setMuted] = useSoundMuted();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inField =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      const isBacktick = e.key === "`" && !inField;
      if (isCmdK || isBacktick) {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const run = useCallback(
    (id: string) => {
      playClick().catch(() => {});
      if (id.startsWith("go:")) {
        const href = id.slice(3);
        setOpen(false);
        router.push(href);
        return;
      }
      switch (id) {
        case "action:cat-resume": {
          const a = document.createElement("a");
          a.href = "/resume.pdf";
          a.download = "Aayush_Mehta_Resume.pdf";
          a.click();
          setOpen(false);
          break;
        }
        case "action:mute-toggle": {
          setMuted(!muted);
          break;
        }
        case "action:play": {
          playWoosh().catch(() => {});
          break;
        }
        case "action:whoami": {
          setWhoamiOpen(true);
          setOpen(false);
          break;
        }
        case "system:help": {
          // Just keeps the palette open with all groups visible.
          break;
        }
        case "system:clear":
        default: {
          setOpen(false);
          break;
        }
      }
    },
    [router, muted, setMuted],
  );

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[80] bg-bg/70 backdrop-blur-sm flex items-start justify-center pt-[14vh] px-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-xl bg-elevated border border-line rounded-md overflow-hidden shadow-2xl"
            >
              <Command label="Command palette" className="font-mono text-sm">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-line">
                  <span className="text-violet">$</span>
                  <Command.Input
                    autoFocus
                    placeholder="type a command…"
                    className="flex-1 bg-transparent outline-none placeholder:text-muted text-fg"
                  />
                  <span className="text-[10px] text-muted">esc</span>
                </div>
                <Command.List className="max-h-[50vh] overflow-y-auto py-1">
                  <Command.Empty className="px-4 py-6 text-muted text-xs">
                    no matches.
                  </Command.Empty>
                  <PaletteGroup heading="navigate" items={NAV_COMMANDS} onRun={run} />
                  <PaletteGroup
                    heading="actions"
                    items={ACTION_COMMANDS}
                    onRun={run}
                    muted={muted}
                  />
                  <PaletteGroup heading="system" items={SYSTEM_COMMANDS} onRun={run} />
                </Command.List>
                <div className="px-4 py-2 border-t border-line text-[10px] text-muted flex justify-between">
                  <span>
                    {ALL_COMMANDS.length} commands · ⌘K or <kbd>`</kbd>
                  </span>
                  <span>↵ run · ↑↓ move</span>
                </div>
              </Command>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <WhoamiToast open={whoamiOpen} onClose={() => setWhoamiOpen(false)} />
    </>
  );
}

function PaletteGroup({
  heading,
  items,
  onRun,
  muted,
}: {
  heading: string;
  items: CommandDef[];
  onRun: (id: string) => void;
  muted?: boolean;
}) {
  return (
    <Command.Group
      heading={heading}
      className="px-2 py-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pt-1 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted"
    >
      {items.map((item) => {
        const isMute = item.id === "action:mute-toggle";
        const label = isMute ? (muted ? "unmute" : "mute") : item.label;
        return (
          <Command.Item
            key={item.id}
            value={`${item.label} ${item.hint ?? ""} ${(item.keywords ?? []).join(" ")}`}
            onSelect={() => onRun(item.id)}
            className="flex items-center justify-between px-2 py-2 rounded-sm text-fg cursor-pointer data-[selected=true]:bg-violet/15 data-[selected=true]:text-violet"
          >
            <span>{label}</span>
            {item.hint && (
              <span className="text-[11px] text-muted">{item.hint}</span>
            )}
          </Command.Item>
        );
      })}
    </Command.Group>
  );
}

function WhoamiToast({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(onClose, 4500);
    return () => window.clearTimeout(t);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] font-mono text-[12px] text-fg bg-elevated border border-line rounded-sm px-4 py-3 max-w-md"
        >
          <p className="text-violet mb-1">$ whoami</p>
          <p className="text-muted">
            aayush mehta — data + ai + cloud engineer (gcp). builds enterprise
            data platforms, multi-agent chatbots, and the occasional weird
            interactive site.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
