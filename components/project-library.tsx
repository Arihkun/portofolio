import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { categories, type Project } from "@/lib/projects";

export function ProjectLibrary({ projects }: { projects: Project[] }) {
  return (
    <div className="project-library">
      <nav className="library-categories" aria-label="Project categories">
        {categories.map((category, index) => <a key={category} href={`#library-${index}`}>{category}</a>)}
      </nav>
      {categories.map((category, index) => (
        <section className="library-group" key={category} id={`library-${index}`}>
          <h3>{category}</h3>
          <div>{projects.filter((project) => project.category === category).map((project) => (
            <Link className="library-row" href={`/projects/${project.slug}`} key={project.slug}>
              <span>{project.title}</span><small>{project.status}</small><ArrowUpRight />
            </Link>
          ))}</div>
        </section>
      ))}
    </div>
  );
}
