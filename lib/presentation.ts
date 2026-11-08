// Short editorial summaries and technical metadata; full facts stay in Markdown.
export const projectPresentation: Record<
  string,
  {
    title: string;
    summary: string;
    theme: string;
    techStack: string[];
  }
> = {
  "credit-scoring-ml": {
    title: "Credit Scoring ML & Risk Modeling",
    summary: "My credit-scoring work covers preparing data, comparing models, and getting the inputs ready for handoff. Here, I use a separate public-data benchmark to share the results openly.",
    theme: "scoring",
    techStack: ["Python", "LightGBM", "Scikit-Learn", "Risk Analytics", "ROC-AUC 0.777"],
  },
  "cde-gorules": {
    title: "CDE & GoRules Decision Engine",
    summary: "I turn lending policies into GoRules decision tables, then check that the rules run in the right order and return the expected results through the API.",
    theme: "decisions",
    techStack: ["GoRules Zen", "FastAPI", "Decision Tables", "Audit Engine", "Parity Tests"],
  },
  "indonesian-document-ocr": {
    title: "Indonesian Document OCR & Parsing",
    summary: "I built a service that reads KTP fields and flags anything uncertain for someone to review. I’m also working on a related pipeline for KK documents.",
    theme: "documents",
    techStack: ["PyTorch", "LayoutLM", "Field Extraction", "Human-in-the-Loop"],
  },
  koii: {
    title: "Koii: plans and memories for two",
    summary: "I built Koii as a private place for two people to keep a wishlist, plan activities, and save photos from time spent together.",
    theme: "koii",
    techStack: ["Next.js", "Supabase", "Google Calendar API", "Cloudflare Worker", "Web Push"],
  },
  kasmate: {
    title: "KasMate: everyday money management",
    summary: "KasMate brings everyday finances into one place, with transactions, wallets, bills, and monthly budgets. I also built receipt entry and reports to help review the numbers.",
    theme: "kasmate",
    techStack: ["React", "TypeScript", "Tailwind CSS", "Privacy Controls", "Local-First"],
  },
};

export const demoMedia: Record<string, { src: string; poster: string; caption: string }> = {
  koii: { src: "/media/koii-demo-v3.mp4", poster: "/media/koii-poster-v2.webp", caption: "A local demo of planning and photo memories. Activities are fictional; sample photos are AI-generated." },
  kasmate: { src: "/media/kasmate-demo-v3.mp4", poster: "/media/kasmate-poster-v2.webp", caption: "A local demo of the dashboard, transactions, and budgets. All amounts are fictional; no account or backend is connected." },
};
