import { projectSources } from "./generated/project-sources";

export const categories = [
  "Featured Risk & ML",
  "AI, OCR & Automation",
  "Product Engineering",
  "Experiments",
] as const;

export type ProjectCategory = (typeof categories)[number];

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory;
  status: string;
  featured: boolean;
  summary: string;
  content: string;
};

const projectOrder = [
  "credit-scoring-ml",
  "cde-gorules",
  "indonesian-document-ocr",
  "koii",
  "kasmate",
  "portfolio-risk-automation",
  "repeat-order-prediction",
  "ktp-ocr",
  "kk-ocr",
  "stackoverflow-react-agent",
  "ai-credit-risk-triage-automation",
  "spendid",
  "erp-product-uat",
  "complaint-pattern-detector",
  "qris-anomaly-experiment",
  "car-damage-detection-experiment",
] as const;

const coreProjectSlugs = [
  "credit-scoring-ml",
  "cde-gorules",
  "indonesian-document-ocr",
  "koii",
  "kasmate",
] as const;

function parseFrontmatter(source: string) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);

  if (!match) {
    throw new Error("Project content is missing front matter.");
  }

  const data = Object.fromEntries(
    match[1]
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const separator = line.indexOf(":");
        return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
      }),
  );

  return {
    data,
    content: source.slice(match[0].length).trim(),
  };
}

function extractOverview(content: string) {
  const overview = content.match(/## Overview\r?\n\r?\n([\s\S]*?)(?:\r?\n\r?\n|$)/);
  return overview?.[1].replace(/\r?\n/g, " ").trim() ?? "Explore this project case study.";
}

export function getProject(slug: string): Project | null {
  const source = Object.hasOwn(projectSources, slug) ? projectSources[slug] : undefined;
  if (source === undefined) {
    return null;
  }

  const { data, content } = parseFrontmatter(source);

  if (!categories.includes(data.category as ProjectCategory)) {
    throw new Error(`Unknown project category in ${slug}.md`);
  }

  return {
    slug,
    title: data.title,
    category: data.category as ProjectCategory,
    status: data.status,
    featured: data.featured === "true",
    summary: extractOverview(content),
    content,
  };
}

export function getAllProjects(): Project[] {
  return projectOrder.map((slug) => {
    const project = getProject(slug);
    if (!project) {
      throw new Error(`Missing project content: ${slug}.md`);
    }
    return project;
  });
}

export function getProjectsByCategory(category: ProjectCategory) {
  return getAllProjects().filter((project) => project.category === category);
}

export function getFeaturedProjects() {
  return coreProjectSlugs.map((slug) => {
    const project = getProject(slug);
    if (!project) throw new Error(`Missing core project content: ${slug}.md`);
    return project;
  });
}

export function getCoreProjects() {
  return getFeaturedProjects();
}

export function getOtherProjects() {
  const coreSlugs = new Set<string>(coreProjectSlugs);
  return getAllProjects().filter((project) => !coreSlugs.has(project.slug));
}
