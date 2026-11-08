import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "@/components/icons";
import { MarkdownContent, getContents } from "@/components/markdown-content";
import { ProjectCard } from "@/components/project-card";
import { ProjectEvidence } from "@/components/project-evidence";
import { ProjectVisual } from "@/components/project-visual";
import { getProjectEvidence } from "@/lib/evidence";
import { getAllProjects, getCoreProjects, getProject } from "@/lib/projects";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: project.title,
    alternates: { canonical: `/projects/${project.slug}` },
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  const related = getCoreProjects()
    .filter((candidate) => candidate.category === project.category && candidate.slug !== project.slug)
    .slice(0, 3);
  const evidence = getProjectEvidence(project.slug);
  const contents = getContents(project.content);

  return (
    <article className="case-study">
      <header className="case-hero">
        <div className="shell case-hero-inner" data-reveal="up">
          <Link className="back-link" href="/projects">← Selected work</Link>
          <div className="case-meta">
            <span>{project.category}</span>
            <span className="meta-divider" />
            <span>{project.status}</span>
          </div>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
        </div>
      </header>

      {["credit-scoring-ml", "cde-gorules", "indonesian-document-ocr", "koii", "kasmate"].includes(project.slug) ? <div className="shell case-visual"><ProjectVisual slug={project.slug} large /></div> : null}

      <div className="shell case-layout">
        <aside className="case-aside" data-reveal="left">
          <p>Case study</p>
          <dl>
            <div><dt>Area</dt><dd>{project.category}</dd></div>
            <div><dt>Status</dt><dd>{project.status}</dd></div>
            <div><dt>Source</dt><dd>Private / local evidence</dd></div>
          </dl>
          <nav className="case-toc" aria-label="On this page">
            {contents.map((item) => <a href={`#${item.id}`} key={item.id}>{item.title}</a>)}
          </nav>
          <p className="case-note">Professional project descriptions omit employer and customer data. Public examples use separate demo data.</p>
        </aside>
        <div data-reveal="up">
          <MarkdownContent source={project.content} />
        </div>
      </div>

      <ProjectEvidence evidence={evidence} />

      {related.length > 0 ? (
        <section className="related section">
          <div className="shell">
            <div className="section-heading compact-heading">
              <div>
                <h2>Related projects</h2>
              </div>
              <Link className="text-link" href="/projects">Selected work <ArrowRight /></Link>
            </div>
            <div className="project-grid">
              {related.map((item) => <ProjectCard project={item} key={item.slug} />)}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
