import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { DownloadCvMenu } from "@/components/download-cv-menu";

export const metadata: Metadata = {
  title: "About",
  alternates: { canonical: "/about" },
  description: "Ari Hendrawan's background in Informatics, risk development, credit scoring, and personal app projects.",
};

const capabilities = [
  ["Risk analytics", "I prepare credit data, evaluate scoring models, and check risk segments and performance."],
  ["Data systems", "I build reporting workflows with checks for missing records, mapping differences, and changes between periods."],
  ["Applied AI", "My projects include document OCR and LLM workflows with input checks and human review."],
  ["Product work", "I build personal apps and contribute workflow reviews and UAT feedback on collaborative products."],
] as const;

export default function AboutPage() {
  return (
    <div className="page-shell">
      <section className="about-hero shell">
        <div className="about-copy" data-reveal="up">
          <span className="section-label">Background</span>
          <h1>About me</h1>
          <p className="about-lede">I&apos;m Ari, an Informatics graduate now working in risk development in Indonesia&apos;s multi-finance industry.</p>
          <p>My work usually starts with credit data and the questions behind it. I prepare datasets and compare scoring models, then work on the decision rules that put lending policies into practice. I also help with recurring reports and investigate issues with business and IT teams.</p>
          <p>That means spending time on details: where a field came from, what it means, and whether it was available when a prediction was made. I keep notes on those checks so the next person can follow the work, including anything that still needs an answer.</p>
          <div className="button-row">
            <Link className="button button-primary" href="/projects">See my work <ArrowRight /></Link>
            <DownloadCvMenu />
          </div>
        </div>
      </section>

      <section className="section section-ink">
        <div className="shell about-statement" data-reveal="up">
          <p>Building the model is one part of my work. I also prepare the data going into it and check the results coming out, then document what the team needs to run and review it.</p>
        </div>
      </section>

      <section className="section shell">
        <div className="section-heading" data-reveal="up">
          <div>
            <h2>What I work on</h2>
          </div>
          <p className="section-intro">Credit risk is my main area of work. Outside that, I build personal apps and explore OCR and automation through smaller projects and training.</p>
        </div>
        <div className="capability-list">
          {capabilities.map(([title, description]) => (
            <article data-reveal="up" key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section soft-section">
        <div className="shell education-grid">
          <div data-reveal="left">
            <h2>Education and training</h2>
          </div>
          <div className="timeline" data-reveal="up">
            <article>
              <span>2020 &ndash; 2024</span>
              <h3>Bachelor of Informatics</h3>
              <p>University of Technology Yogyakarta · GPA 3.32 / 4.00</p>
            </article>
            <article>
              <span>2022 &ndash; 2026</span>
              <h3>Professional development</h3>
              <p>Machine learning, data engineering, AI agents, automation, and advanced LLM training.</p>
            </article>
            <article>
              <span>2025 &ndash; Present</span>
              <h3>Risk Development Staff</h3>
              <p>Applied credit-risk analytics and decision systems in the multi-finance industry.</p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
