export type ProjectLink = { label: string; href: string };

export type Project = {
  slug: string;
  title: string;
  year: string;
  role: string;
  summary: string;
  problem: string;
  approach: string[];
  outcome: string;
  tech: string[];
  cover?: string;
  links?: ProjectLink[];
};

// Curated from Aayush's resume. Replace cover images by dropping files into
// /public and pointing `cover` at them.
export const PROJECTS: Project[] = [
  {
    slug: "ask-aes",
    title: "Ask-AES",
    year: "2025",
    role: "Cloud Data / AI Engineer",
    summary:
      "A Vertex AI + Google ADK multi-agent chatbot over BigQuery. Inline chart rendering, Microsoft Teams integration, conversational analytics for the whole org.",
    problem:
      "Business teams needed analytics over the Customer 360 layer in plain English — ideally inside Teams, with charts inline. Ad-hoc SQL routed through the data team didn't scale; routine questions were eating engineering time.",
    approach: [
      "Designed a multi-agent architecture in Google ADK — separate agents for query planning, SQL generation, validation, and chart rendering.",
      "Wired Vertex AI as the LLM backbone with prompts grounded in the Customer 360 schema and KPI catalog.",
      "Built a Teams adapter that rendered PNG chart cards inline next to the agent's reply.",
      "Implemented common analytics flows (Top-N by region/account, 30/90-day trends, account drill-downs) with defaults and validation so the agent doesn't have to invent the right SQL every time.",
    ],
    outcome:
      "Routine questions get resolved in chat across finance, sales, and operations. Ad-hoc SQL load on the data team dropped sharply for the most common 15+ KPIs.",
    tech: ["Vertex AI", "Google ADK", "BigQuery", "Python", "Microsoft Teams", "GCP"],
  },
  {
    slug: "sap-hana-bigquery-migration",
    title: "SAP HANA → BigQuery migration",
    year: "2026",
    role: "Data Engineer · Bayer",
    summary:
      "End-to-end Airflow-driven migration porting all SAP HANA calculation views to BigQuery — fully automated, with per-DAG validation guaranteeing parity.",
    problem:
      "A large surface area of SAP HANA calculation views needed to land on BigQuery without diverging from source semantics — observably, reproducibly, and cheaply.",
    approach: [
      "Authored Python-based Airflow DAGs that automate extract → transform → load of view logic and dependencies end-to-end.",
      "Implemented per-DAG validation: row counts, schema parity, null distributions, dtype consistency — every migrated view is signed off by its own checks.",
      "Re-architected the migration framework to remove redundant compute, cutting Composer runtime + BigQuery slot usage.",
      "Designed reusable DAG templates so subsequent migrations onboard new datasets in days instead of weeks.",
    ],
    outcome:
      "Migrated calculation views match SAP HANA outputs by construction. Framework cuts cost and accelerates new dataset onboarding for the rest of the migration program.",
    tech: ["GCP", "BigQuery", "Cloud Composer", "Apache Airflow", "Python", "SAP HANA"],
  },
  {
    slug: "customer-360",
    title: "Customer 360 on GCP",
    year: "2025",
    role: "Data Architect",
    summary:
      "GCP-based Customer 360 model integrating SAP, Salesforce, ServiceNow, and Workday into a single analytics layer — and the source of truth for everything that came after.",
    problem:
      "Enterprise data lived siloed across SAP, Salesforce, and ServiceNow. Finance, sales, and ops each maintained their own joins; KPI definitions drifted between teams.",
    approach: [
      "Built end-to-end ETL pipelines into a consolidated BigQuery layer, with KPI logic owned in dbt.",
      "Computed and standardized 15+ KPIs queryable from a single source of truth across finance, sales, and operations.",
      "Layered a natural-language Text-to-SQL chatbot over the Customer 360 tables for non-technical teams.",
      "Designed Looker dashboards including a 6-KPI engagement-trends view for global clients.",
    ],
    outcome:
      "One source of truth for cross-platform enterprise data. Downstream tools (Ask-AES, dashboards, Salesforce CRM workflows) all read the same KPI definitions instead of re-deriving them.",
    tech: ["GCP", "BigQuery", "Apache Airflow", "dbt", "Looker", "Salesforce", "ServiceNow", "SAP"],
  },
  {
    slug: "desculpt",
    title: "DeSculpt — Navagraha sculpture iconography",
    year: "2021",
    role: "Co-author · research",
    summary:
      "A deep-learning framework classifying nine classes of Navagraha temple sculptures. 91% accuracy with transfer-learned CNNs on a tiny augmented dataset.",
    problem:
      "Cultural heritage digitization needed automated iconography classification, but available datasets for Navagraha sculptures were extremely small — far below typical deep-learning sample sizes.",
    approach: [
      "Compiled and aggressively augmented a custom dataset to address scarcity.",
      "Applied transfer learning across pre-trained CNNs (ResNet50, VGG16, MobileNet) and benchmarked them head-to-head.",
      "Experimented with hybrid CNN-feature + SVM classifier pipelines for comparative evaluation.",
      "Documented the dataset methodology, preprocessing pipeline, architecture comparisons, and metrics in the published paper.",
    ],
    outcome:
      "91% classification accuracy across nine deity classes — published as evidence for ML applicability in cultural heritage digitization.",
    tech: ["Python", "PyTorch", "TensorFlow", "ResNet50", "VGG16", "MobileNet"],
    links: [{ label: "GitHub", href: "https://github.com/AayushMehta0924/NICE" }],
  },
  {
    slug: "churn-prediction",
    title: "Vertex AI churn prediction",
    year: "2023",
    role: "Cloud Data / AI Engineer",
    summary:
      "An end-to-end Vertex AI pipeline scoring customer churn risk and feeding the predictions back into Salesforce CRM for personalized retention.",
    problem:
      "Retention workflows ran on flat heuristics. The team wanted model-driven scoring living inside the CRM views the reps already used.",
    approach: [
      "Trained a churn classifier on consolidated customer features.",
      "Built the Vertex AI pipeline (data prep → train → serve) with reproducible runs and versioned artifacts.",
      "Wrote the integration layer piping predictions into Salesforce custom fields.",
      "Tied predictions to retention workflows so reps got actionable next-step prompts at the moment of call.",
    ],
    outcome:
      "Personalized retention prompts replacing flat heuristics. Predictions live in CRM views the team already used — no extra dashboards, no extra context-switching.",
    tech: ["Vertex AI", "BigQuery", "Python", "Salesforce CRM", "GCP"],
  },
];
