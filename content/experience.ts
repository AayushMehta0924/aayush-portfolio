export type ExperienceType = "work" | "edu";

export type ExperienceEntry = {
  id: string;
  type: ExperienceType;
  start: string;
  end: string;
  org: string;
  location?: string;
  title: string;
  client?: string;
  summary: string;
  highlights: string[];
  tech: string[];
  notes?: string;
};

// Sorted by end-date desc (treating "Present" as max). Education dates are
// placeholders pending confirmation from Aayush.
export const EXPERIENCE: ExperienceEntry[] = [
  {
    id: "itdatabuild-de-bayer",
    type: "work",
    start: "Jan 2026",
    end: "Present",
    org: "ITDataBuild",
    location: "Flower Mound, TX",
    title: "Data Engineer",
    client: "Bayer",
    summary:
      "Migrating SAP HANA calculation views and on-prem datasets to GCP / BigQuery via fully automated, validated Python Airflow DAGs.",
    highlights: [
      "Engineered end-to-end migration pipelines porting all SAP HANA calculation views to BigQuery, automating extraction, transformation, and loading via Python Airflow DAGs.",
      "Implemented per-DAG validation — row counts, schema parity, null distributions, dtype consistency — guaranteeing migrated views match source results.",
      "Proposed an improved migration architecture that cut Cloud Composer runtime and BigQuery slot consumption.",
      "Automated 6 legacy manual Python jobs into scheduled Composer DAGs with retries, alerting, and SLA monitoring.",
      "Built modular DAG templates for inbound/outbound migration between SAP, GCS, and BigQuery, accelerating onboarding for new datasets.",
    ],
    tech: ["GCP", "BigQuery", "Cloud Composer", "Apache Airflow", "Python", "SAP HANA"],
  },
  {
    id: "itdatabuild-architect",
    type: "work",
    start: "Jan 2025",
    end: "Present",
    org: "ITDataBuild",
    location: "Flower Mound, TX",
    title: "Data Architect",
    summary:
      "Customer 360 modeling on GCP, plus a Vertex AI + Google ADK multi-agent chatbot delivering conversational analytics into Microsoft Teams.",
    highlights: [
      "Built a GCP-based Customer 360 model integrating SAP, ServiceNow, and Salesforce into one consolidated analytics layer.",
      "Built Ask-AES — a Vertex AI + Google ADK multi-agent chatbot over BigQuery with inline chart rendering and Teams integration.",
      "Implemented Top-N, 30/90-day trend, and account drill-down analytics flows with built-in defaults and validation.",
      "Computed and standardized 15+ Customer 360 KPIs queryable across finance, sales, and operations.",
      "Layered a natural-language Text-to-SQL chatbot over Customer 360 BigQuery tables for non-technical teams.",
      "Designed Looker dashboards including a 6-KPI engagement-trends dashboard for global clients.",
      "Built an ADK chatbot POC automating internal support workflows with live-agent integration into Teams and ServiceNow.",
    ],
    tech: ["GCP", "BigQuery", "Vertex AI", "Google ADK", "Looker", "Salesforce", "ServiceNow", "SAP"],
  },
  {
    id: "sabre",
    type: "work",
    start: "May 2025",
    end: "Dec 2025",
    org: "Sabre",
    location: "Dallas, TX",
    title: "Cloud Data / AI Engineer",
    summary:
      "Customer 360 + multi-agent chatbots + dbt-on-BigQuery transformations, plus a suite of modular Airflow DAGs for Salesforce-to-BigQuery batch processing.",
    highlights: [
      "Built a GCP-based Customer 360 model integrating SAP, ServiceNow, and Salesforce.",
      "Built Ask-AES, a Vertex AI + Google ADK multi-agent chatbot over BigQuery with chart rendering and Teams integration.",
      "Maintained and expanded modular Apache Airflow DAGs for incremental Salesforce-to-BigQuery batch transformation.",
      "Migrated Airflow SQL to dbt on BigQuery — added staged/intermediate/marts layers, freshness/tests, Slim CI on PRs, and Looker-tied docs/exposures.",
      "Developed reusable DAG templates for ad-hoc work like Salesforce account-table metadata mapping.",
      "Wrote Python scripts for schema validation, duplicate checks, and ETL transformation consistency.",
    ],
    tech: ["GCP", "BigQuery", "Apache Airflow", "dbt", "Vertex AI", "Google ADK", "Looker", "Python"],
  },
  {
    id: "asu-ms",
    type: "edu",
    start: "Aug 2023",
    end: "May 2025",
    org: "Arizona State University",
    location: "USA",
    title: "M.S. Computer Science",
    summary: "Graduate coursework spanning ML, distributed systems, and applied AI.",
    highlights: [
      "CGPA: 3.71 / 4.0",
      "Awarded the NAMU Scholarship.",
    ],
    tech: [],
    notes: "Dates are placeholders — please confirm.",
  },
  {
    id: "analytics-it",
    type: "work",
    start: "Sept 2022",
    end: "June 2023",
    org: "Analytics IT",
    title: "Cloud Data / AI Engineer",
    summary:
      "Automated ETL on GCP for a global retail client, built a lakehouse over HR / Salesforce / ServiceNow data, and shipped Vertex AI churn-prediction integrated into Salesforce CRM.",
    highlights: [
      "Designed and deployed automated ETL pipelines using Airflow + BigQuery for retail customer-segmentation work.",
      "Built a lakehouse integrating HR, Salesforce, and ServiceNow data; consolidated 18+ KPIs into interactive dashboards.",
      "Standardized dbt transformations on BigQuery — staged / intermediate / marts layers, partitioned campaign/event models, freshness + uniqueness/not-null/relationship tests.",
      "Built a Dialogflow NLP chatbot for a lead-enrichment platform, exposing campaign metrics via voice or text.",
      "Built a Vertex AI churn-prediction pipeline integrated into Salesforce CRM for personalized retention.",
      "Tuned BigQuery SQL to cut dashboard load times by 35% and reduce query costs.",
      "Designed schema-monitoring scripts that auto-notify analysts on upstream schema breaks.",
    ],
    tech: ["GCP", "BigQuery", "Apache Airflow", "dbt", "Vertex AI", "Dialogflow", "Looker", "Pub/Sub", "Cloud Functions"],
  },
  {
    id: "yif",
    type: "work",
    start: "Nov 2021",
    end: "Nov 2022",
    org: "Youth India Foundation",
    title: "Head of Finance",
    summary:
      "Owned budgeting, expense tracking, and revenue planning for state and national events while leading intern recruitment and ops alignment.",
    highlights: [
      "Managed budgeting and revenue planning for state + national events with full financial transparency.",
      "Used Excel-driven analysis to track event profitability and prepare weekly leadership reports.",
      "Coordinated intern recruitment, onboarding, and weekly all-hands ops alignment.",
      "Used data insights to optimize resource allocation and reduce overall event costs.",
    ],
    tech: ["Excel", "Operations", "Finance"],
  },
  {
    id: "nividata",
    type: "work",
    start: "May 2021",
    end: "June 2022",
    org: "Nividata Consultancy",
    title: "Data Engineer",
    summary:
      "Batch ETL on AWS for an e-commerce client — Airflow + Python pipelines, S3 staging, MySQL/Mongo ingestion, Redshift loading, Tableau dashboards.",
    highlights: [
      "Led batch ETL pipelines using Python + Airflow for product and sales data.",
      "Used AWS S3 as a centralized staging layer; built ingestion workflows for MySQL and MongoDB sources.",
      "Built a schema-validation layer with Python + Pandera before loading to Redshift.",
      "Built Tableau dashboards tracking sales performance, conversion rates, and product return ratios.",
      "Implemented Python-based anomaly detection on weekly sales trends to improve revenue monitoring.",
      "Migrated legacy Excel reporting to automated dashboards, cutting manual effort by 50%+.",
    ],
    tech: ["Python", "Apache Airflow", "AWS S3", "Redshift", "MySQL", "MongoDB", "Tableau", "Pandera"],
  },
  {
    id: "twowaits",
    type: "work",
    start: "Nov 2021",
    end: "Dec 2021",
    org: "TwoWaits",
    title: "Web Developer",
    summary:
      "Built a secure email-auth module in Node.js for a Flutter client, plus frontend polish on the Flutter app.",
    highlights: [
      "Developed a Node.js email-auth module integrated with the Flutter client for seamless onboarding.",
      "Improved Flutter UI responsiveness, input validation, and login/signup flow ergonomics.",
      "Documented API endpoints and auth workflows for future devs.",
      "Supported QA testing — repro, validation, regression checks.",
    ],
    tech: ["Node.js", "Flutter", "REST"],
  },
  {
    id: "srm",
    type: "edu",
    start: "Aug 2017",
    end: "May 2021",
    org: "S.R.M. University",
    location: "Chennai, India",
    title: "B.Tech, Computer Science Engineering",
    summary:
      "Undergraduate coursework with a CS-engineering core; published deep-learning research on temple-sculpture iconography classification.",
    highlights: [
      "CGPA: 9.38 / 10",
      "Co-authored DeSculpt — a 9-class CNN classifier (ResNet50 / VGG16 / MobileNet + transfer learning) for Navagraha sculpture iconography. 91% accuracy.",
    ],
    tech: ["Python", "PyTorch", "TensorFlow", "ResNet50", "VGG16", "MobileNet", "Transfer Learning"],
    notes: "Dates are placeholders — please confirm.",
  },
  {
    id: "bosky",
    type: "work",
    start: "May 2020",
    end: "Dec 2020",
    org: "Bosky Buildcon",
    title: "Data Analyst",
    summary:
      "Cost-efficiency analysis across 12 active construction projects; Python / SQL / Tableau dashboards for budget, vendor, and workforce tracking.",
    highlights: [
      "Cost-efficiency analysis across 12 projects identified a 15% overhead-savings opportunity via material reallocation.",
      "Built Matplotlib + Seaborn reports tracking burn rates, workforce allocation, and vendor performance.",
      "Automated daily site-data extraction with Python — cut manual reporting workload by 40%.",
      "Built Tableau dashboards for site supervisors monitoring budget utilization and forecasting material demand.",
    ],
    tech: ["Python", "SQL", "Tableau", "Matplotlib", "Seaborn", "Excel"],
  },
];
