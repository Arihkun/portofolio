import "./experience-section.css";

export function ExperienceSection() {
  return (
    <section className="shell experience-section" id="experience">
      <div className="experience-header" data-reveal="up">
        <div>
          <span className="section-label">Experience</span>
          <h2>My work in risk development</h2>
        </div>
      </div>

      <div className="experience-cards">
        <article className="experience-card" data-reveal="up">
          <div className="exp-meta">
            <span className="exp-period">September 2025 &ndash; Present</span>
            <span className="exp-badge">CURRENT ROLE</span>
          </div>
          <div className="exp-body">
            <div className="exp-title-row">
              <h3>Risk Development Staff</h3>
              <span className="exp-company">Indonesian Multi-Finance Company</span>
            </div>
            <p className="exp-summary">
              I work on credit scoring, decision rules, and recurring portfolio analysis in Indonesia&apos;s multi-finance industry. I also work with business and IT teams to investigate data and application issues.
            </p>
            <ul className="exp-points">
              <li>
                <strong>Credit scoring:</strong> Prepared historical credit data, checked candidate features, and evaluated how models performed on different samples.
              </li>
              <li>
                <strong>Decision rules:</strong> Built and tested GoRules/Zen tables, including rule order, API response formats, and regression cases.
              </li>
              <li>
                <strong>Portfolio analysis:</strong> Built data preparation and reporting workflows for portfolio risk and repeat-order analysis using Python, DuckDB, Parquet, and SQL Server.
              </li>
            </ul>
            <div className="exp-tech-stack">
              <span>GoRules Zen</span>
              <span>Python</span>
              <span>LightGBM</span>
              <span>DuckDB</span>
              <span>Parquet</span>
              <span>SQL Server</span>
              <span>Credit Risk Analytics</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
