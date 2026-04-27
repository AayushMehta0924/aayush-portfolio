"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { playClick, playWoosh } from "@/lib/sounds";

type Status = "idle" | "sending" | "sent" | "error";

export function TerminalCompose() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setName("");
    setEmail("");
    setMessage("");
    setStatus("idle");
    setError(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("name, email, and message are all required.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    setError(null);
    playClick().catch(() => {});
    try {
      // Stub: real Resend wiring happens later. For now, simulate latency.
      await new Promise((r) => setTimeout(r, 700));
      setStatus("sent");
      playWoosh().catch(() => {});
    } catch {
      setStatus("error");
      setError("send failed — try again, or just email me.");
    }
  };

  return (
    <div className="rounded-md border border-line bg-elevated/40 overflow-hidden">
      <div className="px-4 py-2 border-b border-line bg-bg/60 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-violet/60" />
        <span className="w-2 h-2 rounded-full bg-cyan/60" />
        <span className="w-2 h-2 rounded-full bg-gleam/60" />
        <span className="font-mono text-[11px] text-muted ml-2">
          aayush@portfolio:~$ compose --to aayush
        </span>
      </div>

      <form onSubmit={submit} className="p-5 font-mono text-sm space-y-3">
        <Field
          label="from"
          value={name}
          onChange={setName}
          placeholder="your name"
          disabled={status === "sending" || status === "sent"}
        />
        <Field
          label="reply"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          type="email"
          disabled={status === "sending" || status === "sent"}
        />
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-violet">›</span>
            <span className="text-muted">message:</span>
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="say something"
            rows={6}
            disabled={status === "sending" || status === "sent"}
            className="w-full mt-2 bg-bg/60 border border-line rounded-sm px-3 py-2 text-fg outline-none focus:border-violet/60 transition-colors placeholder:text-muted/50 disabled:opacity-60 resize-y"
          />
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button
            type="submit"
            disabled={status === "sending" || status === "sent"}
            className="font-mono text-xs px-4 py-2 border border-violet text-violet hover:bg-violet hover:text-bg rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {status === "sending"
              ? "» sending..."
              : status === "sent"
                ? "» sent ✓"
                : "» send"}
          </button>
          {status === "sent" && (
            <button
              type="button"
              onClick={reset}
              className="font-mono text-[11px] text-muted hover:text-fg transition-colors cursor-pointer"
            >
              compose another
            </button>
          )}
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-cyan text-xs"
            >
              <span className="text-violet">!</span> {error}
            </motion.p>
          )}
          {status === "sent" && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-gleam text-xs"
            >
              <span className="text-violet">✓</span> message queued. i'll get
              back to you at {email || "your email"}.
            </motion.p>
          )}
        </AnimatePresence>

        <p className="font-mono text-[10px] text-muted/60 pt-2 border-t border-line/50 mt-4">
          // form is currently a stub — wire real delivery via Resend in phase 5.
        </p>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-violet shrink-0">›</span>
      <span className="text-muted shrink-0 w-12">{label}:</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 bg-transparent text-fg outline-none placeholder:text-muted/50 disabled:opacity-60 border-b border-line focus:border-violet/60 transition-colors py-1"
      />
    </div>
  );
}
