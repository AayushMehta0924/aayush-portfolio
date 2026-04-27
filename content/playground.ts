export type ExperimentStatus = "shipped" | "in-progress" | "idea";

export type Experiment = {
  id: string;
  title: string;
  blurb: string;
  status: ExperimentStatus;
  href?: string;
};

export type Hobby = {
  id: string;
  title: string;
  body: string;
  curated: string;
  photo?: string;
};

export const EXPERIMENTS: Experiment[] = [
  {
    id: "this-site",
    title: "this site, recursively",
    blurb:
      "You are inside the experiment. Boot intro, terminal warps, command palette, magnetic skill constellation — the whole thing.",
    status: "shipped",
    href: "/",
  },
  {
    id: "tone-clicks",
    title: "tone.js UI clicks",
    blurb:
      "Soft synth tones for nav clicks and route warps via Tone.js. Lazily initialized in a user gesture; muted by default.",
    status: "shipped",
  },
  {
    id: "cmdk-cli",
    title: "cmdk command palette",
    blurb:
      "Press ⌘K anywhere on this site. Routes, mute, resume download, all from the keyboard.",
    status: "shipped",
  },
  {
    id: "more-soon",
    title: "more soon",
    blurb:
      "I keep a list of small experiments — half-built ML toys, generative bits, tiny CLI tools. They'll land here as they ship.",
    status: "idea",
  },
];

export const HOBBIES: Hobby[] = [
  {
    id: "piano",
    title: "piano",
    body:
      "Picked it up casually; never had formal lessons. I play by ear — slowly, but stubbornly.",
    curated: "Currently learning: Dhoom theme, slowly.",
  },
  {
    id: "football",
    title: "football",
    body:
      "Watch more than I play, but when I play I run hard. Defender with delusions of being a midfielder.",
    curated: "Following: Premier League, loyal to one club.",
  },
  {
    id: "reading",
    title: "reading",
    body:
      "Mostly engineering essays, the occasional novel, and any well-written failure post-mortem I can find.",
    curated: "Currently revisiting: anything by Dan Luu.",
  },
  {
    id: "photography",
    title: "photography",
    body:
      "Phone camera at night, mostly. I like under-lit moody shots more than well-composed ones.",
    curated: "Send me a hobby photo to drop in here.",
  },
];
