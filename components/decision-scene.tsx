"use client";

import { useEffect, useRef } from "react";

const stages = [
  ["Input", "Check the request", "Validate the required fields before evaluating rules."],
  ["Evaluate", "Apply the rules", "Run the versioned rules in their defined order."],
  ["Explain", "Return the result", "Include the decision, its reason, and the rule version."],
] as const;

export function DecisionScene() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const query = matchMedia("(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!query.matches) { delete element.dataset.active; return; }
      const box = element.getBoundingClientRect();
      const progress = Math.max(0, Math.min(0.999, (innerHeight * 0.85 - box.top) / (box.height + innerHeight * 0.4)));
      element.dataset.active = String(Math.floor(progress * 3));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    query.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      query.removeEventListener("change", schedule);
    };
  }, []);
  return (
    <div className="decision-scene" ref={root}>
      <p className="visual-label">An illustrative decision flow</p>
      <ol>{stages.map(([label, title, description]) => (
        <li key={label}><span>{label}</span><div><strong>{title}</strong><p>{description}</p></div></li>
      ))}</ol>
      <p className="visual-footnote">A system pattern, with no production rules or customer data.</p>
    </div>
  );
}
