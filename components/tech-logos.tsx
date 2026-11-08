import type { SVGProps } from "react";

type LogoProps = SVGProps<SVGSVGElement>;

const logoDefaults = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "currentColor",
  "aria-hidden": true,
};

export function PythonLogo(props: LogoProps) {
  return (
    <svg {...logoDefaults} viewBox="0 0 24 24" {...props}>
      <path
        fill="#3776ab"
        d="M11.91 2c-5.18 0-4.86 2.25-4.86 2.25l.01 2.33h4.94v.7H5.06S2 6.92 2 12.14c0 5.21 2.68 5.05 2.68 5.05h1.6v-2.27s-.09-2.68 2.64-2.68h4.55s2.56.04 2.56-2.52V4.56S16.48 2 11.91 2Zm-2.68 1.48a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Z"
      />
      <path
        fill="#ffd343"
        d="M12.09 22c5.18 0 4.86-2.25 4.86-2.25l-.01-2.33h-4.94v-.7h6.94s3.06.36 3.06-4.86c0-5.21-2.68-5.05-2.68-5.05h-1.6v2.27s.09 2.68-2.64 2.68H10.5s-2.56-.04-2.56 2.52v7.16s-.45 2.56 4.15 2.56Zm2.68-1.48a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8Z"
      />
    </svg>
  );
}

export function FastAPILogo(props: LogoProps) {
  return (
    <svg {...logoDefaults} viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="10.5" fill="#059669" />
      <path
        fill="#ffffff"
        d="M11.15 5.2h2.65l-2.65 6.5h3.5L8.4 18.8l2.65-7.1H7.65l3.5-6.5Z"
      />
    </svg>
  );
}

export function GoRulesLogo(props: LogoProps) {
  return (
    <svg {...logoDefaults} viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="#10b981" />
      <path d="M6.5 8h11" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M6.5 12h7" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M6.5 16h8.5" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="17.2" cy="14" r="2.3" fill="#ffffff" />
    </svg>
  );
}

export function ScikitLearnLogo(props: LogoProps) {
  return (
    <svg {...logoDefaults} viewBox="0 0 24 24" {...props}>
      <circle cx="8" cy="8.5" r="5" fill="#f7931e" />
      <circle cx="16" cy="15.5" r="5" fill="#3499cd" />
      <path d="M6.5 16.5C9 10 15 8 17.5 7.5" stroke="#09090b" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function LightGBMLogo(props: LogoProps) {
  return (
    <svg {...logoDefaults} viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 3L3.5 18.5h17L12 3Z" fill="#f1f5f9" stroke="#0f172a" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 3L3.5 18.5h8.5V3Z" fill="#38bdf8" fillOpacity="0.85" />
      <path d="M12 3l8.5 15.5H12V3Z" fill="#10b981" fillOpacity="0.85" />
      <path d="M12 9.5L7 18.5h10L12 9.5Z" fill="#facc15" />
      <path d="M12 3L3.5 18.5h17L12 3Z" stroke="#0f172a" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export function DuckDBLogo(props: LogoProps) {
  return (
    <svg {...logoDefaults} viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="10.5" fill="#fff000" stroke="#09090b" strokeWidth="1" />
      <circle cx="9.2" cy="10.5" r="2.2" fill="#09090b" />
      <path d="M13.2 10.5h4.2a1.6 1.6 0 0 1 0 3.2h-4.2v-3.2Z" fill="#09090b" />
    </svg>
  );
}

export function PostgreSQLLogo(props: LogoProps) {
  return (
    <svg {...logoDefaults} viewBox="0 0 24 24" fill="none" {...props}>
      {/* Detailed PostgreSQL Elephant Emblem */}
      <path
        d="M17.2 4.2c-1.8-.9-4.1-.8-5.6.2-1.6-1-3.9-1.1-5.6-.2C3.8 5.3 2.8 7.8 3.2 10.5c.4 2.7 2 4.8 3.9 5.3l.4 2.8c.2 1.1 1.2 1.9 2.3 1.9.9 0 1.7-.5 2.1-1.3l.4-.8.4.8c.4.8 1.2 1.3 2.1 1.3 1.1 0 2.1-.8 2.3-1.9l.4-2.8c1.9-.5 3.5-2.6 3.9-5.3.4-2.7-.6-5.2-2.2-6.3Z"
        fill="#336791"
        stroke="#0f172a"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 5.5c-2.2.8-3.3 3.2-2.8 5.6.4 2 1.8 3.5 3.3 3.8M15.5 5.5c2.2.8 3.3 3.2 2.8 5.6-.4 2-1.8 3.5-3.3 3.8"
        stroke="#ffffff"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M12 6v11.5c0 1.4.9 2.5 2 2.5s1.8-.8 1.8-1.9"
        stroke="#ffffff"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="9.6" cy="9.5" r="1.1" fill="#ffffff" />
      <circle cx="14.4" cy="9.5" r="1.1" fill="#ffffff" />
    </svg>
  );
}

export function SupabaseLogo(props: LogoProps) {
  return (
    <svg {...logoDefaults} viewBox="0 0 24 24" {...props}>
      <path
        fill="#10b981"
        d="m13.2 22.8 8-10.5a1 1 0 0 0-.8-1.7h-6.8V1.8a1 1 0 0 0-1.7-.7L3.9 11.6a1 1 0 0 0 .8 1.7h6.8v8.8a1 1 0 0 0 1.7.7Z"
      />
    </svg>
  );
}

export function TypeScriptLogo(props: LogoProps) {
  return (
    <svg {...logoDefaults} viewBox="0 0 24 24" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#3178c6" />
      <path
        fill="#ffffff"
        d="M11.2 11.4H7.5V9.8h6v1.6h-2.3v6.8H9.4v-6.8h1.8Zm3.6 5.3c.6.4 1.2.6 1.9.6.7 0 1.2-.3 1.2-.7 0-.4-.3-.6-1-.9l-.8-.3c-1.2-.5-2-1.2-2-2.3 0-1.5 1.1-2.5 3-2.5.9 0 1.7.2 2.3.6l-.5 1.5c-.5-.3-1.1-.5-1.8-.5-.7 0-1.1.3-1.1.7 0 .4.3.6 1 .9l.8.3c1.3.5 2 1.2 2 2.4 0 1.6-1.2 2.5-3.1 2.5-1 0-2-.3-2.7-.7l.8-1.6Z"
      />
    </svg>
  );
}

export function NextjsLogo(props: LogoProps) {
  return (
    <svg {...logoDefaults} viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="10.8" fill="#09090b" />
      <path
        fill="#ffffff"
        d="M17.8 18.2 9.6 7.2H7.6v9.6h1.8V9.8l7 9.4c.5-.3 1-.6 1.4-1ZM14.6 7.2h1.8v6l-1.8-2.4V7.2Z"
      />
    </svg>
  );
}

export function ReactLogo(props: LogoProps) {
  return (
    <svg {...logoDefaults} viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.6" {...props}>
      <ellipse cx="12" cy="12" rx="4.2" ry="10.2" />
      <ellipse cx="12" cy="12" rx="4.2" ry="10.2" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="4.2" ry="10.2" transform="rotate(120 12 12)" />
      <circle cx="12" cy="12" r="2.2" fill="#38bdf8" stroke="none" />
    </svg>
  );
}

export function OpenCVLogo(props: LogoProps) {
  return (
    <svg {...logoDefaults} viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="6.8" r="3.8" stroke="#ef4444" strokeWidth="2.4" />
      <circle cx="7" cy="15.8" r="3.8" stroke="#10b981" strokeWidth="2.4" />
      <circle cx="17" cy="15.8" r="3.8" stroke="#3b82f6" strokeWidth="2.4" />
    </svg>
  );
}

export function DockerLogo(props: LogoProps) {
  return (
    <svg {...logoDefaults} viewBox="0 0 24 24" fill="none" {...props}>
      {/* Container blocks */}
      <rect x="6" y="8.5" width="2.4" height="2.2" rx="0.3" fill="#0284c7" stroke="#0f172a" strokeWidth="0.6" />
      <rect x="8.8" y="8.5" width="2.4" height="2.2" rx="0.3" fill="#38bdf8" stroke="#0f172a" strokeWidth="0.6" />
      <rect x="11.6" y="8.5" width="2.4" height="2.2" rx="0.3" fill="#0284c7" stroke="#0f172a" strokeWidth="0.6" />
      <rect x="8.8" y="6" width="2.4" height="2.2" rx="0.3" fill="#0284c7" stroke="#0f172a" strokeWidth="0.6" />
      <rect x="11.6" y="6" width="2.4" height="2.2" rx="0.3" fill="#38bdf8" stroke="#0f172a" strokeWidth="0.6" />
      {/* Whale body */}
      <path
        d="M21.5 11.8c-.6-.4-1.8-.5-2.7-.2-.2-1.1-.9-2-1.9-2.4-.4 1-.5 2.2-.1 3.1-.6.3-1.4.4-2.3.4H3.2c-.3 1.5.1 3.5 1.3 4.8 1.4 1.5 3.6 2.2 6.4 2.2 4.6 0 8-2.3 9.2-6 .8.1 1.7-.1 2.2-.8-.2-.5-.5-.9-.8-1.1Z"
        fill="#0ea5e9"
        stroke="#0f172a"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      <circle cx="6.5" cy="15" r="0.8" fill="#ffffff" />
    </svg>
  );
}

export function GitLogo(props: LogoProps) {
  return (
    <svg {...logoDefaults} viewBox="0 0 24 24" {...props}>
      <path
        fill="#f97316"
        d="m21.7 10.7-8.4-8.4c-.8-.8-2.1-.8-2.9 0L8.6 4.1l3.6 3.6c.9-.3 1.9-.1 2.5.6.7.7.9 1.7.5 2.6l3.5 3.5c.9-.4 1.9-.3 2.6.5.9.9.9 2.5 0 3.4s-2.5.9-3.4 0c-.8-.8-.9-2-.4-2.9l-3.3-3.3v4.6c.3.2.6.5.7.9.6 1.4 0 3.1-1.4 3.7-1.4.6-3.1 0-3.7-1.4-.6-1.4 0-3.1 1.4-3.7.4-.2.9-.2 1.3-.1v-4.7c-.4.1-.9.1-1.3-.1-.9-.4-1.4-1.3-1.5-2.2L2.3 10.7c-.8.8-.8 2.1 0 2.9l8.4 8.4c.8.8 2.1.8 2.9 0l8.1-8.1c.8-.8.8-2.1 0-2.9v-.3Z"
      />
    </svg>
  );
}

export function SQLServerLogo(props: LogoProps) {
  return (
    <svg {...logoDefaults} viewBox="0 0 24 24" fill="none" {...props}>
      <ellipse cx="12" cy="6" rx="7.5" ry="3" fill="#ef4444" />
      <path d="M4.5 6v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6" stroke="#dc2626" strokeWidth="1.8" />
      <path d="M4.5 12v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6" stroke="#991b1b" strokeWidth="1.8" />
      <ellipse cx="12" cy="12" rx="7.5" ry="3" stroke="#ef4444" strokeWidth="1.5" />
    </svg>
  );
}

export function TailwindCSSLogo(props: LogoProps) {
  return (
    <svg {...logoDefaults} viewBox="0 0 24 24" {...props}>
      <path
        fill="#06b6d4"
        d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.09 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C15.61 7.15 14.5 6 12 6ZM7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35C8.39 16.85 9.5 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C10.61 13.15 9.5 12 7 12Z"
      />
    </svg>
  );
}

export function ParquetLogo(props: LogoProps) {
  return (
    <svg {...logoDefaults} viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="4" width="5" height="16" rx="1.5" fill="#0ea5e9" />
      <rect x="9.5" y="7" width="5" height="13" rx="1.5" fill="#38bdf8" />
      <rect x="16" y="4" width="5" height="10" rx="1.5" fill="#0284c7" />
    </svg>
  );
}

export function LinuxLogo(props: LogoProps) {
  return (
    <svg {...logoDefaults} viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 3c-3 0-4.5 2.5-4.5 6 0 2-.8 4-1.5 6-.5 1.5.5 4 2.5 4h7c2 0 3-2.5 2.5-4-.7-2-1.5-4-1.5-6 0-3.5-1.5-6-4.5-6Z" fill="#18181b" />
      <ellipse cx="12" cy="13.5" rx="3.2" ry="4.5" fill="#ffffff" />
      <circle cx="10.7" cy="7.2" r="0.9" fill="#ffffff" />
      <circle cx="13.3" cy="7.2" r="0.9" fill="#ffffff" />
      <path d="M10.5 8.8h3L12 10.5l-1.5-1.7Z" fill="#facc15" />
      <ellipse cx="9" cy="19" rx="2" ry="1.1" fill="#facc15" />
      <ellipse cx="15" cy="19" rx="2" ry="1.1" fill="#facc15" />
    </svg>
  );
}
