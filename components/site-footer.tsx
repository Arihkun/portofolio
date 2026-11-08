import { Github, Linkedin, Mail } from "@/components/icons";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <p className="footer-name">Ari Hendrawan</p>
          <p className="footer-copy">Credit-risk work, personal apps, and experiments.</p>
        </div>
        <div className="footer-links" aria-label="Contact links">
          <a href={`mailto:${siteConfig.email}`}><Mail /> Email</a>
          <a href={siteConfig.linkedin} target="_blank" rel="noreferrer"><Linkedin /> LinkedIn</a>
          <a href={siteConfig.github} target="_blank" rel="noreferrer"><Github /> GitHub</a>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} Ari Hendrawan</span>
        <span>Based in Jakarta, Indonesia.</span>
      </div>
    </footer>
  );
}
