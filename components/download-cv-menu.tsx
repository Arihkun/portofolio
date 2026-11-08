"use client";

import { useEffect, useRef, useState } from "react";
import "./download-cv-menu.css";

const CV_ITEMS = [
  {
    title: "English CV",
    subtitle: "Risk & data scientist CV in English (PDF)",
    href: "/documents/Ari-Hendrawan-CV-EN.pdf",
    icon: "globe",
  },
  {
    title: "Indonesian CV",
    subtitle: "CV dalam Bahasa Indonesia (PDF)",
    href: "/documents/Ari-Hendrawan-CV-ID.pdf",
    icon: "languages",
  },
  {
    title: "Project Portfolio",
    subtitle: "Project portfolio document (PDF)",
    href: "/documents/Ari-Hendrawan-Portfolio.pdf",
    icon: "file",
  },
] as const;

function MenuItemIcon({ type }: { type: (typeof CV_ITEMS)[number]["icon"] }) {
  if (type === "globe") {
    return (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    );
  }

  if (type === "languages") {
    return (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m5 8 6 6" />
        <path d="m4 14 6-6 2-3" />
        <path d="M2 5h12" />
        <path d="M7 2h1" />
        <path d="m22 22-5-10-5 10" />
        <path d="M14 18h6" />
      </svg>
    );
  }

  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

interface DownloadCvMenuProps {
  label?: string;
  align?: "left" | "right";
}

export function DownloadCvMenu({
  label = "Download CV",
  align = "left",
}: DownloadCvMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div
      className={`cv-dropdown-root ${align === "right" ? "cv-dropdown-right" : ""}`}
      ref={containerRef}
    >
      <button
        type="button"
        className={`button button-secondary cv-dropdown-trigger ${open ? "is-open" : ""}`}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{label}</span>
        <svg
          className={`cv-dropdown-chevron ${open ? "is-open" : ""}`}
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          className="cv-dropdown-menu"
          role="menu"
          aria-label="Download CV options"
        >
          {CV_ITEMS.map((item) => (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              className="cv-dropdown-item"
              onClick={() => setOpen(false)}
            >
              <span className="cv-dropdown-icon">
                <MenuItemIcon type={item.icon} />
              </span>
              <span className="cv-dropdown-text">
                <span className="cv-dropdown-title">{item.title}</span>
                <span className="cv-dropdown-subtitle">{item.subtitle}</span>
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
