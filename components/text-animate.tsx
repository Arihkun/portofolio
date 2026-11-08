import type { CSSProperties, ElementType } from "react";

interface TextAnimateProps {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  inView?: boolean;
}

export function TextAnimate({
  text,
  as: Component = "p",
  className = "",
  delay = 0.08,
  stagger = 0.048,
  inView = false,
}: TextAnimateProps) {
  const words = text.trim().split(/\s+/);
  const wordClass = inView ? "text-animate-word-inview" : "text-animate-word";

  return (
    <Component
      className={`text-animate-root ${className}`.trim()}
      aria-label={text}
      data-reveal={inView ? "text" : undefined}
    >
      <span className="sr-only">{text}</span>
      {words.map((word, idx) => (
        <span
          key={`${word}-${idx}`}
          aria-hidden="true"
          className={wordClass}
          style={
            {
              "--word-delay": `${(delay + idx * stagger).toFixed(3)}s`,
            } as CSSProperties
          }
        >
          {word}
          {idx < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </Component>
  );
}

const PULSING_SQUARES = [
  { x: 14, y: 1, delay: "0.2s", duration: "4.6s" },
  { x: 18, y: 2, delay: "1.1s", duration: "5.2s" },
  { x: 21, y: 1, delay: "2.4s", duration: "4.8s" },
  { x: 16, y: 4, delay: "0.7s", duration: "5.5s" },
  { x: 23, y: 3, delay: "1.8s", duration: "4.4s" },
  { x: 19, y: 5, delay: "3.1s", duration: "5.0s" },
  { x: 12, y: 3, delay: "1.5s", duration: "4.9s" },
  { x: 25, y: 2, delay: "0.4s", duration: "5.3s" },
  { x: 22, y: 6, delay: "2.7s", duration: "4.7s" },
  { x: 15, y: 7, delay: "1.9s", duration: "5.1s" },
  { x: 20, y: 8, delay: "0.9s", duration: "4.5s" },
  { x: 24, y: 5, delay: "2.2s", duration: "5.4s" },
] as const;

export function HeroGridPattern() {
  return (
    <div className="hero-grid-pattern-wrap" aria-hidden="true">
      <svg className="hero-grid-pattern-svg" width="100%" height="100%">
        <defs>
          <pattern
            id="hero-arch-grid"
            width="42"
            height="42"
            patternUnits="userSpaceOnUse"
            x="-1"
            y="-1"
          >
            <path
              d="M.5 42V.5H42"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-arch-grid)" />
        <svg x="-1" y="-1" className="hero-grid-squares">
          {PULSING_SQUARES.map((sq, i) => (
            <rect
              key={i}
              width="41"
              height="41"
              x={sq.x * 42 + 1}
              y={sq.y * 42 + 1}
              fill="currentColor"
              strokeWidth="0"
              className="hero-grid-pulse-cell"
              style={
                {
                  "--pulse-delay": sq.delay,
                  "--pulse-duration": sq.duration,
                } as CSSProperties
              }
            />
          ))}
        </svg>
      </svg>
    </div>
  );
}
