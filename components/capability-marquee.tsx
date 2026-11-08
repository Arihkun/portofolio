import type { CSSProperties } from "react";
import {
  PythonLogo,
  FastAPILogo,
  GoRulesLogo,
  ScikitLearnLogo,
  LightGBMLogo,
  DuckDBLogo,
  PostgreSQLLogo,
  SupabaseLogo,
  TypeScriptLogo,
  NextjsLogo,
  ReactLogo,
  OpenCVLogo,
  DockerLogo,
  GitLogo,
  SQLServerLogo,
  TailwindCSSLogo,
  ParquetLogo,
  LinuxLogo,
} from "@/components/tech-logos";
import "./capability-marquee.css";

const primaryStack = [
  { name: "Python", role: "Data & Systems", Logo: PythonLogo },
  { name: "GoRules", role: "Decision Engine", Logo: GoRulesLogo },
  { name: "FastAPI", role: "REST APIs", Logo: FastAPILogo },
  { name: "Scikit-Learn", role: "Credit ML", Logo: ScikitLearnLogo },
  { name: "DuckDB", role: "Fast Analytics", Logo: DuckDBLogo },
  { name: "PostgreSQL", role: "Database", Logo: PostgreSQLLogo },
  { name: "Docker", role: "Containers", Logo: DockerLogo },
  { name: "TypeScript", role: "Frontend & Fullstack", Logo: TypeScriptLogo },
];

const marqueeRow1 = [
  { name: "SQL Server", Logo: SQLServerLogo },
  { name: "Python", Logo: PythonLogo },
  { name: "GoRules Zen", Logo: GoRulesLogo },
  { name: "LightGBM", Logo: LightGBMLogo },
  { name: "Scikit-Learn", Logo: ScikitLearnLogo },
  { name: "DuckDB", Logo: DuckDBLogo },
  { name: "Parquet", Logo: ParquetLogo },
  { name: "FastAPI", Logo: FastAPILogo },
  { name: "Git", Logo: GitLogo },
];

const marqueeRow2 = [
  { name: "TypeScript", Logo: TypeScriptLogo },
  { name: "Next.js", Logo: NextjsLogo },
  { name: "React", Logo: ReactLogo },
  { name: "PostgreSQL", Logo: PostgreSQLLogo },
  { name: "Supabase", Logo: SupabaseLogo },
  { name: "Tailwind CSS", Logo: TailwindCSSLogo },
  { name: "Docker", Logo: DockerLogo },
  { name: "OpenCV", Logo: OpenCVLogo },
  { name: "Linux", Logo: LinuxLogo },
];

export function CapabilityMarquee() {
  return (
    <div className="tech-showcase-wrapper" aria-label="Technology Stack">
      {/* Top Part: Distinctive 8-Card Portrait Fandeck (Logo + Title + Role) */}
      <div
        className="tech-fandeck-stage"
        data-reveal="up"
        style={{ "--reveal-delay": "90ms" } as CSSProperties}
      >
        <div className="tech-fandeck" role="list" aria-label="Core technology stack">
          {primaryStack.map((item, idx) => {
            const Icon = item.Logo;
            return (
              <div
                className={`fandeck-card fandeck-card-${idx}`}
                key={item.name}
                role="listitem"
                tabIndex={0}
              >
                <div className="fandeck-icon-wrap">
                  <Icon width={48} height={48} />
                </div>
                <div className="fandeck-meta">
                  <span className="fandeck-title">{item.name}</span>
                  <span className="fandeck-role">{item.role}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Part: 2-Row Infinite Pill Marquee */}
      <div
        className="capability-marquee"
        data-reveal="up"
        style={{ "--reveal-delay": "170ms" } as CSSProperties}
      >
        <div className="marquee-track">
          <div className="marquee-content">
            {[...marqueeRow1, ...marqueeRow1, ...marqueeRow1].map((item, idx) => {
              const Icon = item.Logo;
              return (
                <span className="marquee-pill" key={`r1-${idx}`}>
                  <span className="pill-logo">
                    <Icon width={16} height={16} />
                  </span>
                  <span className="pill-text">{item.name}</span>
                </span>
              );
            })}
          </div>
        </div>

        <div className="marquee-track">
          <div className="marquee-content marquee-reverse">
            {[...marqueeRow2, ...marqueeRow2, ...marqueeRow2].map((item, idx) => {
              const Icon = item.Logo;
              return (
                <span className="marquee-pill" key={`r2-${idx}`}>
                  <span className="pill-logo">
                    <Icon width={16} height={16} />
                  </span>
                  <span className="pill-text">{item.name}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
