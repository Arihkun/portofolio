import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { ProjectShowcase } from "@/components/project-showcase";
import { CapabilityMarquee } from "@/components/capability-marquee";
import { ExperienceSection } from "@/components/experience-section";
import { GithubActivity } from "@/components/github-activity";
import { DownloadCvMenu } from "@/components/download-cv-menu";
import { TextAnimate, HeroGridPattern } from "@/components/text-animate";
import { getCoreProjects } from "@/lib/projects";
import "./homepage.css";

export default function Home() {
  const projects = getCoreProjects();
  return (
    <div className="homepage">
      <section className="home-hero shell">
        <HeroGridPattern />
        <div className="hero-grid">
          <div className="hero-main">
            <TextAnimate
              as="p"
              className="hero-eyebrow"
              text="Ari Hendrawan · Jakarta, ID"
              delay={0.05}
              stagger={0.04}
            />
            <TextAnimate
              as="h1"
              text="I build credit risk models, decision rules, and software for lending."
              delay={0.14}
              stagger={0.046}
            />
            <p
              className="hero-bio blur-fade-in"
              style={{ "--fade-delay": "0.34s" } as CSSProperties}
            >
              A Risk &amp; Data Scientist based in Jakarta. My day-to-day work focuses on scorecard modeling and decision rules in Indonesia&apos;s multi-finance industry. Outside work, I build and ship web applications.
            </p>
            <div
              className="button-row blur-fade-in"
              style={{ "--fade-delay": "0.44s" } as CSSProperties}
            >
              <a className="button button-primary" href="#selected-work">
                View projects <ArrowRight />
              </a>
              <DownloadCvMenu />
            </div>
          </div>

          <aside
            className="hero-practice-card blur-fade-in"
            style={{ "--fade-delay": "0.24s" } as CSSProperties}
            aria-label="Professional practice overview"
          >
            <div className="practice-card-header">
              <span className="practice-tag">Practice Overview</span>
              <span className="practice-location">Multi-Finance Risk</span>
            </div>
            <div className="practice-rows">
              <div className="practice-row">
                <span className="practice-label">Focus</span>
                <span className="practice-val">Credit Risk Scoring &amp; Decision Systems</span>
              </div>
              <div className="practice-row">
                <span className="practice-label">Role</span>
                <span className="practice-val">Risk Development Staff</span>
              </div>
              <div className="practice-row">
                <span className="practice-label">Core Tech</span>
                <span className="practice-val">Python, LightGBM, GoRules Zen, DuckDB, SQL Server</span>
              </div>
              <div className="practice-row">
                <span className="practice-label">Shipped Apps</span>
                <span className="practice-val">Koii (Couple Space) &amp; KasMate (Finance Tracker)</span>
              </div>
            </div>
            <div className="practice-card-footer">
              <span className="practice-status-indicator" aria-hidden="true" />
              <span>Available for credit scoring, decision rules, &amp; data roles</span>
            </div>
          </aside>
        </div>
      </section>

      <section className="shell work-section" id="selected-work">
        <div
          className="work-heading"
          data-reveal="up"
          style={{ "--reveal-delay": "380ms" } as CSSProperties}
        >
          <div>
            <span className="section-label">Portfolio</span>
            <TextAnimate
              as="h2"
              text="Selected projects"
              inView
              delay={0.4}
              stagger={0.06}
            />
          </div>
          <Link className="text-link" href="/projects">
            All 16 projects
          </Link>
        </div>
        <div className="showcases">
          {projects.map((project, idx) => (
            <ProjectShowcase key={project.slug} project={project} scene index={idx} />
          ))}
        </div>
      </section>

      <section className="tech-stack-section" id="tech-stack">
        <div className="shell tech-stack-header" data-reveal="up">
          <h2>Technology Stack</h2>
          <p>
            The stack I use to build credit risk models, decision rules, and ship production systems.
          </p>
        </div>
        <CapabilityMarquee />
      </section>

      <section className="shell home-profile" id="about" data-reveal="up">
        <div className="profile-heading">
          <span className="section-label">Background</span>
          <h2>A little about me<br />and my work.</h2>
        </div>
        <div className="profile-copy">
          <p>
            I’m Ari Hendrawan, an Informatics graduate working in risk development in Indonesia’s multi-finance industry.
          </p>
          <p>
            A lot of my work starts with questions about the data: how a feature was built, why model results differ, or why a decision came out a certain way. I work through those questions with business and IT teams.
          </p>
          <Link className="text-link" href="/about">
            Read more about my background
          </Link>
        </div>
      </section>

      <ExperienceSection />

      <GithubActivity />

      <section className="shell home-contact" id="contact" data-reveal="up">
        <div className="contact-card">
          <span className="section-label">Contact</span>
          <h2>Get in touch.</h2>
          <p>
            Have a role or project in mind? I&apos;d be happy to hear about it. You can also reach out if you&apos;re curious about something I&apos;ve built.
          </p>
          <div className="contact-actions">
            <a className="button button-primary" href="mailto:arihendra2802@gmail.com">
              Email: arihendra2802@gmail.com <ArrowUpRight />
            </a>
            <a className="button button-secondary" href="https://linkedin.com/in/arihendra2802" target="_blank" rel="noreferrer">
              Connect on LinkedIn <ArrowUpRight />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
