"use client";

import { useState, useEffect, useRef, useMemo, type CSSProperties } from "react";
import fallbackSnapshot from "@/data/contributions-snapshot.json";
import type { ContributionData, CalendarDay } from "@/app/api/github-contributions/route";
import "./github-activity.css";

interface TooltipState {
  text: string;
  x: number;
  y: number;
  arrowOffset: number;
}

export function GithubActivity() {
  const [data, setData] = useState<ContributionData>(fallbackSnapshot as ContributionData);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/github-contributions")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((json: ContributionData) => {
        if (isMounted && json && json.weeks && json.weeks.length > 0) {
          setData(json);
        }
      })
      .catch((err) => {
        console.warn("Could not load fresh contributions from API, using fallback:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-scroll horizontal container to the most recent months (right side) on mobile/tablet
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollToLatest = () => {
      if (el.scrollWidth > el.clientWidth) {
        el.scrollLeft = el.scrollWidth;
      }
    };
    scrollToLatest();
    window.addEventListener("resize", scrollToLatest, { passive: true });
    return () => window.removeEventListener("resize", scrollToLatest);
  }, [data]);

  // Filter out partial leading month labels that collide with the following month (e.g., Oct at week 0 vs Nov at week 1)
  const visibleMonths = useMemo(() => {
    return data.months.filter((m, idx, arr) => {
      const next = arr[idx + 1];
      if (next && next.weekIndex - m.weekIndex < 3) {
        return false;
      }
      return true;
    });
  }, [data.months]);

  const handleCellHover = (
    e: React.MouseEvent<HTMLSpanElement> | React.FocusEvent<HTMLSpanElement>,
    day: CalendarDay | null
  ) => {
    if (!day || !containerRef.current) {
      setTooltip(null);
      return;
    }
    const cellRect = e.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    const rawX = cellRect.left - containerRect.left + cellRect.width / 2;
    const minX = 110;
    const maxX = Math.max(minX, containerRect.width - 110);
    const clampedX = Math.min(Math.max(rawX, minX), maxX);

    setTooltip({
      text: day.tooltip,
      x: clampedX,
      y: cellRect.top - containerRect.top - 8,
      arrowOffset: rawX - clampedX,
    });
  };

  const handleCellLeave = () => {
    setTooltip(null);
  };

  return (
    <section className="shell github-section" id="github-activity">
      {/* Clean Header Outside Card (rasmadibnu.com style) */}
      <div className="github-header" data-reveal="up">
        <h2>GitHub Activity</h2>
        <div className="github-subheader">
          <p className="github-total-text">
            {data.total.toLocaleString()} contributions in the last year.
          </p>
          <a
            className="github-view-link"
            href="https://github.com/Arihkun"
            target="_blank"
            rel="noreferrer"
          >
            View GitHub <span className="github-arrow" aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>

      {/* Single Rounded Heatmap Card */}
      <div
        className="activity-heatmap-card"
        ref={containerRef}
        data-reveal="up"
        style={{ "--reveal-delay": "110ms" } as CSSProperties}
      >
        <div
          className="heatmap-scroll-container"
          ref={scrollContainerRef}
          onScroll={handleCellLeave}
        >
          <div className="heatmap-grid-canvas">
            {/* Month Labels Header */}
            <div className="heatmap-months-row">
              <div className="heatmap-days-spacer" />
              <div className="heatmap-months-track">
                {visibleMonths.map((m, i) => (
                  <span
                    key={`${m.name}-${i}`}
                    className="heatmap-month-label"
                    style={{ gridColumnStart: m.weekIndex + 1 }}
                  >
                    {m.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Heatmap Body: Day Labels + Grid Columns */}
            <div className="heatmap-body-row">
              <div className="heatmap-days-column" aria-hidden="true">
                <span className="heatmap-day-label" />
                <span className="heatmap-day-label">Mon</span>
                <span className="heatmap-day-label" />
                <span className="heatmap-day-label">Wed</span>
                <span className="heatmap-day-label" />
                <span className="heatmap-day-label">Fri</span>
                <span className="heatmap-day-label" />
              </div>

              <div className="heatmap-weeks-track">
                {data.weeks.map((week, colIdx) => (
                  <div key={colIdx} className="heatmap-col">
                    {week.map((day, rowIdx) => {
                      if (!day) {
                        return (
                          <span
                            key={`empty-${rowIdx}`}
                            className="heatmap-cell empty"
                            aria-hidden="true"
                          />
                        );
                      }
                      return (
                        <span
                          key={day.date}
                          tabIndex={0}
                          role="gridcell"
                          aria-label={day.tooltip}
                          className={`heatmap-cell level-${day.level}`}
                          onMouseEnter={(e) => handleCellHover(e, day)}
                          onMouseLeave={handleCellLeave}
                          onFocus={(e) => handleCellHover(e, day)}
                          onBlur={handleCellLeave}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Tooltip placed outside scroll container so it never triggers scrollbars */}
        {tooltip && (
          <div
            className="heatmap-floating-tooltip"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
            }}
            role="tooltip"
          >
            {tooltip.text}
            <span
              className="tooltip-arrow"
              style={{ left: `calc(50% + ${tooltip.arrowOffset}px)` }}
            />
          </div>
        )}

        <div className="heatmap-footer">
          <a
            className="heatmap-learn-link"
            href="https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/why-are-my-contributions-not-showing-up-on-my-profile"
            target="_blank"
            rel="noreferrer"
          >
            Learn how GitHub counts contributions
          </a>
          <div className="heatmap-legend">
            <span>Less</span>
            <span className="heatmap-cell level-0" />
            <span className="heatmap-cell level-1" />
            <span className="heatmap-cell level-2" />
            <span className="heatmap-cell level-3" />
            <span className="heatmap-cell level-4" />
            <span>More</span>
          </div>
        </div>
      </div>
    </section>
  );
}
