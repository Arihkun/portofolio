"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    if (!isHome) return;

    const sectionIds = [...navItems.map((item) => item.sectionId), "contact"];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) {
          setActiveSection(visible.target.id);
        }
      },
      {
        rootMargin: "-15% 0px -45% 0px",
        threshold: 0.1,
      }
    );

    elements.forEach((el) => observer.observe(el));

    const onScroll = () => {
      if (window.scrollY < 200) {
        setActiveSection("");
      } else if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100
      ) {
        setActiveSection("contact");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [isHome]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    if (isHome) {
      const target = document.getElementById(sectionId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
        setActiveSection(sectionId);
        window.history.pushState(null, "", `#${sectionId}`);
      }
    }
  };

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHome) {
      const contactEl = document.getElementById("contact");
      if (contactEl) {
        e.preventDefault();
        contactEl.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", "#contact");
      }
    }
  };

  return (
    <header className="site-header">
      <nav className="header-pill" aria-label="Primary navigation">
        {navItems.map((item) => {
          const isActive = isHome
            ? activeSection === item.sectionId
            : pathname.startsWith(item.href.replace("/#", "/"));
          return (
            <Link
              href={item.href}
              key={item.label}
              onClick={(e) => handleNavClick(e, item.sectionId)}
              className={`nav-link-item ${isActive ? "is-active" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <span>{item.label}</span>
              {isActive && <span className="nav-indicator-dot" aria-hidden="true" />}
            </Link>
          );
        })}
        <a
          className={`nav-contact ${activeSection === "contact" ? "is-active" : ""}`}
          href={isHome ? "#contact" : "/#contact"}
          onClick={handleContactClick}
        >
          Let&apos;s talk
        </a>
      </nav>
    </header>
  );
}
