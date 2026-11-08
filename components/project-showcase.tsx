import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { ProjectVisual } from "@/components/project-visual";
import { DecisionScene } from "@/components/decision-scene";
import { TextAnimate } from "@/components/text-animate";
import { projectPresentation } from "@/lib/presentation";
import type { Project } from "@/lib/projects";

export function ProjectShowcase({
  project,
  scene = false,
  index = 0,
}: {
  project: Project;
  scene?: boolean;
  index?: number;
}) {
  const presentation = projectPresentation[project.slug];
  if (!presentation) return null;

  const initialDelay = scene && index === 0 ? "480ms" : undefined;

  return (
    <article
      className={`showcase showcase-${presentation.theme}`}
      data-reveal="up"
      style={
        initialDelay
          ? ({ "--reveal-delay": initialDelay } as CSSProperties)
          : undefined
      }
    >
      <div className="showcase-art">
        {scene && project.slug === "cde-gorules" ? (
          <DecisionScene />
        ) : (
          <ProjectVisual slug={project.slug} large />
        )}
      </div>
      <div className="showcase-copy">
        <div className="showcase-header">
          <span className="project-category-tag">{project.category}</span>
          <p className="project-name">{project.title}</p>
        </div>
        <h3>
          <Link href={`/projects/${project.slug}`}>
            <TextAnimate
              as="span"
              text={presentation.title}
              inView
              delay={index === 0 ? 0.52 : 0.08}
              stagger={0.04}
            />
          </Link>
        </h3>
        <p>{presentation.summary}</p>
        {presentation.techStack && (
          <div className="tech-pills" aria-label="Technologies used">
            {presentation.techStack.map((tech) => (
              <span key={tech} className="tech-pill">
                {tech}
              </span>
            ))}
          </div>
        )}
        <Link className="text-link" href={`/projects/${project.slug}`}>
          Read{" "}
          {project.slug === "koii"
            ? "about Koii"
            : project.slug === "kasmate"
              ? "about KasMate"
              : "the case study"}
          <ArrowUpRight />
        </Link>
      </div>
    </article>
  );
}
