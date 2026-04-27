// Placeholder content. Aayush will replace these with his real story / values
// / fun facts in Phase 4.

export type AboutValue = string | string[];

export type AboutData = {
  name: string;
  role: string;
  based_in: string;
  story: string[];
  values: string[];
  currently: string[];
  fun_facts: string[];
};

export const ABOUT: AboutData = {
  name: "Aayush Mehta",
  role: "Data + AI + Cloud Engineer",
  based_in: "Dallas, TX",
  story: [
    "I'm an engineer who's spent the last 4+ years working at the seam between data and intelligent systems. Most of my work lives on Google Cloud — building enterprise data platforms, multi-agent chatbots, and the pipelines that keep them honest.",
    "Outside that, I play the piano (poorly but with feeling), follow football religiously, and occasionally publish small interactive things that have no business existing.",
    "This site is the latter.",
  ],
  values: [
    "Pipelines should be observable enough that nobody has to guess what broke.",
    "Good data work is mostly about making the right thing easy to do.",
    "Boring tech with a sharp purpose beats clever tech with vague intent.",
    "Anything worth shipping is worth instrumenting.",
  ],
  currently: [
    "Migrating SAP HANA workloads to BigQuery for a Bayer-adjacent team.",
    "Reading more about agentic patterns — less about the hype, more about the failure modes.",
    "Slowly learning new pieces on the piano.",
  ],
  fun_facts: [
    "Co-authored DeSculpt — a deep-learning paper classifying Navagraha temple-sculpture iconography. 91% accuracy on 9 deity classes.",
    "Once automated 6 manual jobs in a single sprint and felt deeply good about it.",
    "Have a soft spot for sites that take themselves a little too seriously.",
  ],
};
