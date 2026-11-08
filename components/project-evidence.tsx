import type { ProjectEvidence as ProjectEvidenceData } from "@/lib/evidence";

export function ProjectEvidence({ evidence }: { evidence: ProjectEvidenceData }) {
  const statusClass = evidence.status.toLowerCase().replaceAll(/[^a-z]+/g, "-");

  return (
    <section className="evidence-section" aria-labelledby="evidence-title">
      <div className="shell" data-reveal="up">
        <div className="evidence-heading">
          <div>
            <h2 id="evidence-title">Checks and current status</h2>
          </div>
          <span className={`evidence-status evidence-status-${statusClass}`}>{evidence.status}</span>
        </div>

        <div className="assessment-panel">
          <p>{evidence.assessmentType}</p>
          <h3>{evidence.verdict}</h3>
          <p>{evidence.rationale}</p>
        </div>

        <div className="evidence-grid">
          {evidence.items.map((item) => (
            <article key={item.label}>
              <p>{item.label}</p>
              <strong>{item.value}</strong>
              <span>{item.note}</span>
            </article>
          ))}
        </div>

        <p className="evidence-boundary"><strong>Limitations:</strong> {evidence.boundary}</p>
      </div>
    </section>
  );
}
