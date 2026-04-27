export type CommandGroup = "navigate" | "actions" | "system";

export type CommandDef = {
  id: string;
  group: CommandGroup;
  label: string;
  hint?: string;
  keywords?: string[];
};

export const NAV_COMMANDS: CommandDef[] = [
  { id: "go:/", group: "navigate", label: "go home", hint: "/", keywords: ["home", "index"] },
  { id: "go:/about", group: "navigate", label: "go about", hint: "/about", keywords: ["bio", "me"] },
  { id: "go:/experience", group: "navigate", label: "go experience", hint: "/experience", keywords: ["work", "education", "resume"] },
  { id: "go:/projects", group: "navigate", label: "go projects", hint: "/projects", keywords: ["work", "case study"] },
  { id: "go:/playground", group: "navigate", label: "go playground", hint: "/playground", keywords: ["hobbies", "experiments", "fun"] },
  { id: "go:/contact", group: "navigate", label: "go contact", hint: "/contact", keywords: ["email", "reach"] },
];

export const ACTION_COMMANDS: CommandDef[] = [
  { id: "action:cat-resume", group: "actions", label: "cat resume.pdf", hint: "download resume", keywords: ["resume", "cv", "download"] },
  { id: "action:mute-toggle", group: "actions", label: "mute / unmute", hint: "toggle UI sounds", keywords: ["sound", "audio", "silent"] },
  { id: "action:play", group: "actions", label: "play", hint: "play a tone", keywords: ["tone", "sound test"] },
  { id: "action:whoami", group: "actions", label: "whoami", hint: "print short bio", keywords: ["who", "bio"] },
];

export const SYSTEM_COMMANDS: CommandDef[] = [
  { id: "system:help", group: "system", label: "help", hint: "list commands", keywords: ["?"] },
  { id: "system:clear", group: "system", label: "clear", hint: "close palette", keywords: ["close", "exit"] },
];

export const ALL_COMMANDS: CommandDef[] = [
  ...NAV_COMMANDS,
  ...ACTION_COMMANDS,
  ...SYSTEM_COMMANDS,
];
