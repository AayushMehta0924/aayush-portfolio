"use client";

// Tone.js is loaded lazily so the boot intro doesn't pay for it on first paint.
// AudioContext starts suspended in browsers — `ensureStarted` must run inside a
// user gesture before any tone fires.

type ToneModule = typeof import("tone");

let tonePromise: Promise<ToneModule> | null = null;
let synth: InstanceType<ToneModule["Synth"]> | null = null;
let started = false;

function isMuted() {
  if (typeof window === "undefined") return true;
  const v = localStorage.getItem("sound-muted");
  return v === null ? true : v === "true";
}

async function getTone(): Promise<ToneModule> {
  if (!tonePromise) tonePromise = import("tone");
  return tonePromise;
}

export async function ensureStarted() {
  if (started || typeof window === "undefined") return;
  const Tone = await getTone();
  if (Tone.getContext().state !== "running") {
    await Tone.start();
  }
  if (!synth) {
    synth = new Tone.Synth({
      oscillator: { type: "square" },
      envelope: { attack: 0.002, decay: 0.04, sustain: 0, release: 0.04 },
    }).toDestination();
    synth.volume.value = -22;
  }
  started = true;
}

export async function playTypeBeep() {
  if (isMuted()) return;
  await ensureStarted();
  if (!synth) return;
  const note = Math.random() > 0.5 ? "C5" : "E5";
  synth.triggerAttackRelease(note, 0.02);
}

export async function playClick() {
  if (isMuted()) return;
  await ensureStarted();
  if (!synth) return;
  synth.triggerAttackRelease("A4", 0.04);
}

export async function playWoosh() {
  if (isMuted()) return;
  await ensureStarted();
  if (!synth) return;
  synth.triggerAttackRelease("E5", 0.06);
}
