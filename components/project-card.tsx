import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { ProjectVisual } from "@/components/project-visual";
import type { Project } from "@/lib/projects";
import { projectPresentation } from "@/lib/presentation";

type ProjectCardProps = {
  project: Project;
  index?: number;
  variant?: "default" | "homepage";
};

export function ProjectCard({ project, index, variant = "default" }: ProjectCardProps) {
  const isHomepage = variant === "homepage";
  const card = (
    <article className={`project-card${isHomepage ? " project-card-home" : ""}`} data-reveal={isHomepage ? undefined : "up"}>
      <div className="project-card-top">
        {typeof index === "number" ? (
          <span className="project-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        ) : null}
        <span className={`status status-${project.status.toLowerCase().replaceAll(/[^a-z]+/g, "-")}`}>
          {project.status}
        </span>
      </div>
      {project.featured || ["credit-scoring-ml", "cde-gorules", "indonesian-document-ocr", "koii", "kasmate", "wedding-invitation"].includes(project.slug) ? <ProjectVisual slug={project.slug} /> : null}
      <div>
        <p className="card-category">{project.category}</p>
        <h3><Link href={`/projects/${project.slug}`}>{project.title}</Link></h3>
        <p>{projectPresentation[project.slug]?.summary ?? project.summary}</p>
      </div>
      <Link className="text-link" href={`/projects/${project.slug}`} aria-label={`Read ${project.title} case study`}>
        Read case study <ArrowRight />
      </Link>
    </article>
  );

  // Reveal the wrapper so the card's hover transition never inherits its delay.
  return isHomepage ? <div className="home-project" data-reveal="up">{card}</div> : card;
}
