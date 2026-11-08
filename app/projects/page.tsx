import type { Metadata } from "next";
import { ProjectShowcase } from "@/components/project-showcase";
import { ProjectLibrary } from "@/components/project-library";
import { getAllProjects, getCoreProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Selected Work",
  alternates: { canonical: "/projects" },
  description: "Ari Hendrawan's credit-risk work, OCR projects, personal apps, and experiments, with notes on his contribution and project status.",
};
export default function ProjectsPage() {
  return (
    <div className="page-shell shell">
      <section className="page-hero">
        <h1>Projects and case studies</h1>
        <p>A selection of my work in credit risk, along with apps I&apos;ve built and ideas I&apos;m still exploring. Open a project to read about my part in it and how it&apos;s coming along.</p>
      </section>
      <section className="showcases" aria-label="Selected projects">
        {getCoreProjects().map((project) => <ProjectShowcase project={project} key={project.slug} />)}
      </section>
      <section className="section" id="other-work">
        <h2>All projects</h2>
        <p>There&apos;s more here, including smaller experiments and projects I worked on with others.</p>
        <ProjectLibrary projects={getAllProjects()} />
      </section>
    </div>
  );
}
