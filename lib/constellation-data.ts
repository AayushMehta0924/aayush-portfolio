export type SkillNode = {
  id: string;
  label: string;
  children?: SkillNode[];
};

// Three-level skill graph. Roots ("Languages", "Cloud", ...) are the only
// nodes always visible — clicking a node toggles its children. Sourced from
// Aayush's resume; not exhaustive.
export const SKILL_TREE: SkillNode[] = [
  {
    id: "languages",
    label: "Languages",
    children: [
      { id: "python", label: "Python" },
      { id: "sql", label: "SQL" },
      { id: "shell", label: "Shell" },
      { id: "cpp", label: "C / C++" },
      { id: "js", label: "JavaScript" },
    ],
  },
  {
    id: "cloud",
    label: "Cloud",
    children: [
      {
        id: "gcp",
        label: "GCP",
        children: [
          { id: "bigquery", label: "BigQuery" },
          { id: "composer", label: "Cloud Composer" },
          { id: "vertex", label: "Vertex AI" },
          { id: "cf", label: "Cloud Functions" },
          { id: "gcs", label: "Cloud Storage" },
          { id: "dataproc", label: "Dataproc" },
          { id: "pubsub", label: "Pub/Sub" },
          { id: "cloudsql", label: "CloudSQL" },
          { id: "dialogflow", label: "Dialogflow" },
          { id: "adk", label: "ADK" },
        ],
      },
      {
        id: "aws",
        label: "AWS",
        children: [
          { id: "s3", label: "S3" },
          { id: "redshift-cloud", label: "Redshift" },
        ],
      },
    ],
  },
  {
    id: "data",
    label: "Data & Pipelines",
    children: [
      { id: "airflow", label: "Apache Airflow" },
      { id: "kafka", label: "Apache Kafka" },
      { id: "dbt", label: "dbt" },
      { id: "pyspark", label: "PySpark" },
      { id: "etl", label: "ETL / ELT" },
      { id: "docker", label: "Docker" },
    ],
  },
  {
    id: "ml",
    label: "AI / ML",
    children: [
      {
        id: "frameworks",
        label: "Frameworks",
        children: [
          { id: "pytorch", label: "PyTorch" },
          { id: "tensorflow", label: "TensorFlow" },
          { id: "keras", label: "Keras" },
          { id: "sklearn", label: "Scikit-learn" },
        ],
      },
      {
        id: "data-libs",
        label: "Data libs",
        children: [
          { id: "pandas", label: "Pandas" },
          { id: "numpy", label: "NumPy" },
          { id: "matplotlib", label: "Matplotlib" },
        ],
      },
      {
        id: "google-ai",
        label: "Google AI",
        children: [
          { id: "vertex-ai", label: "Vertex AI" },
          { id: "google-adk", label: "Agent Dev Kit" },
          { id: "dialogflow-ai", label: "Dialogflow" },
        ],
      },
    ],
  },
  {
    id: "storage",
    label: "Storage & Viz",
    children: [
      {
        id: "databases",
        label: "Databases",
        children: [
          { id: "db-bq", label: "BigQuery" },
          { id: "postgres", label: "PostgreSQL" },
          { id: "mysql", label: "MySQL" },
          { id: "mssql", label: "SQL Server" },
          { id: "oracle", label: "Oracle" },
          { id: "mongo", label: "MongoDB" },
          { id: "neo4j", label: "Neo4j" },
          { id: "redshift", label: "Redshift" },
        ],
      },
      {
        id: "bi",
        label: "BI / Viz",
        children: [
          { id: "looker", label: "Looker" },
          { id: "tableau", label: "Tableau" },
          { id: "powerbi", label: "Power BI" },
          { id: "seaborn", label: "Seaborn" },
        ],
      },
    ],
  },
];
