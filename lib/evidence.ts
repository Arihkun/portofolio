export type EvidenceStatus =
  | "Verified Local"
  | "Training Evidence"
  | "In Development"
  | "Not Yet Evaluated";

export type EvidenceItem = {
  label: string;
  value: string;
  note: string;
};

export type ProjectEvidence = {
  status: EvidenceStatus;
  assessmentType: "Model assessment" | "System assessment" | "Workflow assessment";
  verdict: string;
  rationale: string;
  items: EvidenceItem[];
  boundary: string;
};

const evidenceBySlug: Record<string, ProjectEvidence> = {
  "credit-scoring-ml": {
    status: "Verified Local",
    assessmentType: "Model assessment",
    verdict: "Model reports and handoff documents are available locally.",
    rationale: "My internal work includes validation reports and scoring-input documentation. Employer model results remain private. The UCI benchmark on this page is a separate educational exercise.",
    items: [
      { label: "Validation design", value: "Documented", note: "Model reports and validation artifacts were inspected locally." },
      { label: "Integration readiness", value: "Documented", note: "Feature contracts, runtime validation, smoke tests, and handoff material exist." },
      { label: "Public performance", value: "Withheld", note: "No confidential production metric is used as a portfolio claim." },
    ],
    boundary: "The public benchmark does not establish the performance of the employer's model.",
  },
  "cde-gorules": {
    status: "Verified Local",
    assessmentType: "System assessment",
    verdict: "The local suite passed 39 tests during the portfolio audit.",
    rationale: "I check decision outputs, boundary cases, rule order, and API response formats. Deployment and business acceptance need separate checks.",
    items: [
      { label: "Local test suite", value: "39 passed", note: "Observed during the portfolio audit." },
      { label: "Validation scope", value: "Multi-layer", note: "Parity, boundary, API validation, and regression checks are documented." },
      { label: "Deployment proof", value: "Not asserted", note: "Local validation is kept separate from live acceptance." },
    ],
    boundary: "Passing locally does not prove visual-editor compatibility, deployed API behavior, or business UAT.",
  },
  "portfolio-risk-automation": {
    status: "Verified Local",
    assessmentType: "System assessment",
    verdict: "Reconciliation checks and exception reports are documented.",
    rationale: "The workflow keeps source history and records mapping coverage and unmatched records. These checks help explain differences between reports.",
    items: [
      { label: "Reconciliation", value: "Available", note: "The project contains reconciliation tests and exception outputs." },
      { label: "Traceability", value: "Contract level", note: "Periods, identifiers, mappings, and source definitions remain inspectable." },
      { label: "Public benchmark", value: "Not published", note: "No unverified processing-time reduction is claimed." },
    ],
    boundary: "Business definitions and dated mappings must be aligned before numerical comparisons are treated as equivalent.",
  },
  "repeat-order-prediction": {
    status: "In Development",
    assessmentType: "Model assessment",
    verdict: "Historical data and identity checks are documented; model evaluation is in development.",
    rationale: "The work separates operational rankings from historical evaluation. Public performance claims would need a dated holdout, baseline comparisons, and campaign-impact validation.",
    items: [
      { label: "Temporal controls", value: "Documented", note: "Operational ranking is separated from historical evaluation." },
      { label: "Join evidence", value: "Auditable", note: "Coverage, fallback path, and ambiguity outputs are retained." },
      { label: "Public model metric", value: "Not available", note: "No current operational snapshot is presented as historical evidence." },
    ],
    boundary: "A useful ranking does not by itself prove incremental campaign impact or production readiness.",
  },
  "ktp-ocr": {
    status: "Verified Local",
    assessmentType: "System assessment",
    verdict: "The service and browser demo are documented; field accuracy has not been published.",
    rationale: "The project includes API documentation, packaging, and tests. Measuring extraction accuracy needs reviewed ground truth, per-field checks, review rates, and latency measurements.",
    items: [
      { label: "Delivery evidence", value: "Available", note: "API documentation, browser demo, Docker, health checks, and launch scripts exist." },
      { label: "Reliability approach", value: "Review first", note: "Uncertain fields are exposed for human verification." },
      { label: "Public field accuracy", value: "Not evaluated", note: "No real identity data is used to manufacture a benchmark." },
    ],
    boundary: "OCR output must not be treated as trusted identity data without human or downstream verification.",
  },
  "kk-ocr": {
    status: "In Development",
    assessmentType: "Workflow assessment",
    verdict: "Document-preparation and labeling tools are available; the OCR API is unfinished.",
    rationale: "I have built normalization and labeling steps for layout extraction. Field accuracy and table reconstruction still need evaluation against reviewed ground truth.",
    items: [
      { label: "Pipeline foundation", value: "Documented", note: "Reusable modules, labeling tools, commands, and target schema exist." },
      { label: "End-to-end API", value: "In development", note: "The project is not represented as complete." },
      { label: "Public accuracy", value: "Not evaluated", note: "No family-document data is exposed for benchmarking." },
    ],
    boundary: "Only fully fictional documents may be used in a future public evaluation.",
  },
  "indonesian-document-ocr": {
    status: "Verified Local",
    assessmentType: "System assessment",
    verdict: "KTP has a service and browser demo. KK remains in development.",
    rationale: "The local projects include KTP delivery and review tools, plus the KK preparation pipeline. Neither has a published end-to-end field-accuracy benchmark here.",
    items: [
      { label: "KTP module", value: "Service ready", note: "API, browser demo, tests, health checks, and packaging are documented locally." },
      { label: "KK module", value: "In development", note: "Normalization, labeling, layout, and target-schema workflows are available." },
      { label: "Public field accuracy", value: "Not evaluated", note: "No sensitive identity data is exposed to manufacture a benchmark." },
    ],
    boundary: "Detection quality is not equivalent to field accuracy, and every extracted identity value still requires human or downstream verification.",
  },
  "stackoverflow-react-agent": {
    status: "Training Evidence",
    assessmentType: "System assessment",
    verdict: "Saved runs include queries, charts, and an audit trail.",
    rationale: "The model chooses from approved tools. Python controls the queries and cost checks, while exported results allow the generated explanation to be reviewed.",
    items: [
      { label: "Evidence package", value: "Available", note: "Notebook, CSV results, charts, screenshots, and audit trail are present." },
      { label: "Query safeguards", value: "Implemented", note: "Parameterized tools, dry-run estimates, and billing limits are documented." },
      { label: "Saved result period", value: "2020–2022", note: "Missing later years are not interpreted as zero activity." },
    ],
    boundary: "Stack Overflow activity is not a direct measure of technology adoption, and live execution depends on model and cloud quotas.",
  },
  "ai-credit-risk-triage-automation": {
    status: "Training Evidence",
    assessmentType: "System assessment",
    verdict: "The training package includes synthetic scenarios and expected routes.",
    rationale: "The workflow supports rule checks, optional LLM review, and a manual fallback. These examples do not measure real credit-decision accuracy or business impact.",
    items: [
      { label: "Scenario fixtures", value: "Available", note: "Synthetic cases and expected routing outputs are included." },
      { label: "Fallback", value: "Available", note: "An offline demonstration path avoids dependence on an external model key." },
      { label: "Production evidence", value: "Not asserted", note: "This remains a training project." },
    ],
    boundary: "The LLM assists interpretation and cannot replace authorized credit policy or accountable human review.",
  },
  kasmate: {
    status: "Verified Local",
    assessmentType: "System assessment",
    verdict: "Application tests, database checks, and build scripts are available.",
    rationale: "The repository documents workspace isolation, privacy controls, and migration checks. External integrations need separate acceptance tests in the target environment.",
    items: [
      { label: "Quality gates", value: "Documented", note: "TypeScript tests, database assertions, lint, type-check, and build scripts exist." },
      { label: "Data controls", value: "Designed", note: "Workspace isolation, RLS usage, backup, and privacy controls are documented." },
      { label: "Live integrations", value: "Environment dependent", note: "External-service behavior requires separate verification." },
    ],
    boundary: "Forecasts and AI-assisted insights are decision support, not financial advice.",
  },
  koii: {
    status: "Verified Local",
    assessmentType: "System assessment",
    verdict: "Application, calendar, media, and migration checks are documented.",
    rationale: "I use local checks for app behavior and failure handling. Live OAuth, Drive, Calendar, and push behavior need separate testing; the fixture video does not verify them.",
    items: [
      { label: "Local checks", value: "Multi-layer", note: "Application, worker, calendar, and migration checks are documented; visual browser acceptance is separate." },
      { label: "Failure controls", value: "Designed", note: "Retry, reconciliation, merge safeguards, and health reporting are present." },
      { label: "Production services", value: "Not verified here", note: "OAuth, Drive, Calendar, push, and permissions cannot be inferred from local tests or this illustrative preview." },
    ],
    boundary: "The app is intentionally scoped to two controlled accounts and is not assessed as a public multi-user platform.",
  },
  "wedding-invitation": {
    status: "Verified Local",
    assessmentType: "System assessment",
    verdict: "Local static export, Pages Functions integration, and D1 schema are verified.",
    rationale: "The test suite covers token hashing, RSVP idempotency, wishes deduplication, rate limits, and Turnstile integration. Layout is verified across 360px–1440px viewports without horizontal overflow.",
    items: [
      { label: "Automated test suite", value: "20 passed", note: "Vitest tests covering token security, RSVP idempotency, and D1 pagination." },
      { label: "Frontend & Accessibility", value: "Verified", note: "WCAG AAA contrast, keyboard traps, Lenis smooth scrolling, and reduced-motion." },
      { label: "Edge Functions & DB", value: "Local D1", note: "Cloudflare Pages Functions and atomic D1 SQLite migrations tested locally." },
    ],
    boundary: "Local integration tests use synthetic guest data; production publication requires owner credentials and real event content.",
  },
  spendid: {
    status: "In Development",
    assessmentType: "Workflow assessment",
    verdict: "My contribution is product input and review.",
    rationale: "I contributed ideas from KasMate and reviewed workflows. Rasmad Ibnu and the Naestra team primarily developed the implementation.",
    items: [
      { label: "Ari's contribution", value: "Product collaboration", note: "Direction and workflow input are stated explicitly." },
      { label: "Implementation", value: "Team-owned", note: "Rasmad Ibnu and the Naestra team are credited." },
      { label: "Production status", value: "Not asserted", note: "No private product evidence is published." },
    ],
    boundary: "Implementation credit belongs to the engineering contributors. Private architecture and customer configuration remain unpublished.",
  },
  "erp-product-uat": {
    status: "Verified Local",
    assessmentType: "Workflow assessment",
    verdict: "My work covered product review and UAT scenarios.",
    rationale: "I reviewed workflows, ran UAT scenarios, and reported issues. Rasmad Ibnu and the Naestra team developed the application code.",
    items: [
      { label: "Role", value: "Product / UAT", note: "Workflow review, testing, and acceptance activities are clearly attributed." },
      { label: "Implementation", value: "Team-owned", note: "Rasmad Ibnu and the Naestra team are credited." },
      { label: "Public UAT result", value: "Not published", note: "Private evidence requires team approval." },
    ],
    boundary: "No customer configuration, private screenshots, source code, or unsupported production claim is included.",
  },
  "complaint-pattern-detector": {
    status: "Not Yet Evaluated",
    assessmentType: "Workflow assessment",
    verdict: "Synthetic complaint scenarios are available; operational performance is untested.",
    rationale: "The workflow checks repeated patterns and routes complaints with a manual fallback. Evaluating escalation accuracy would require labeled complaint history and precision/recall measurements.",
    items: [
      { label: "Demo workflow", value: "Available", note: "Importable automation and synthetic expected routes exist." },
      { label: "Real-world benchmark", value: "Not available", note: "Synthetic cases do not measure operational performance." },
      { label: "Decision ownership", value: "Human required", note: "LLM recommendations remain advisory." },
    ],
    boundary: "The experiment is not a deployed complaint-management or incident-detection product.",
  },
  "qris-anomaly-experiment": {
    status: "Not Yet Evaluated",
    assessmentType: "Model assessment",
    verdict: "The Streamlit script flags off-hours activity and regular transaction intervals.",
    rationale: "I have not evaluated it as a fraud model. That would require labeled outcomes, a time-based holdout, false-positive analysis, and merchant context.",
    items: [
      { label: "Exploration", value: "Implemented", note: "Off-hours and periodicity views are available in Streamlit." },
      { label: "Calibrated model", value: "Not available", note: "Current thresholds remain exploratory." },
      { label: "Fraud conclusion", value: "Not claimed", note: "Regular timing alone is not evidence of fraud." },
    ],
    boundary: "Flags are investigative prompts and must not be represented as fraud determinations.",
  },
  "car-damage-detection-experiment": {
    status: "Not Yet Evaluated",
    assessmentType: "Model assessment",
    verdict: "Data-preparation files are available; a final model result is not established.",
    rationale: "The work covers annotation conversion and the planned training steps. Evaluating a detector would require a held-out dataset, mAP and recall measurements, error analysis, and verified image rights.",
    items: [
      { label: "Data preparation", value: "Available", note: "COCO-to-YOLO conversion and intended training workflow are documented." },
      { label: "Held-out evaluation", value: "Not available", note: "No finalized reproducible metrics were found." },
      { label: "Deployment", value: "Not applicable", note: "The work remains an experiment." },
    ],
    boundary: "Detection does not estimate repair cost, damage severity, or causality.",
  },
};

export function getProjectEvidence(slug: string): ProjectEvidence {
  const evidence = evidenceBySlug[slug];
  if (!evidence) throw new Error(`Missing evidence definition for ${slug}`);
  return evidence;
}
