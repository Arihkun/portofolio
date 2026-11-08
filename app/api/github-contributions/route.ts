import { NextResponse } from "next/server";
import fallbackSnapshot from "@/data/contributions-snapshot.json";

export const dynamic = "force-dynamic";

export interface CalendarDay {
  id?: string;
  date: string;
  level: number;
  tooltip: string;
}

export interface ContributionData {
  total: number;
  weeks: (CalendarDay | null)[][];
  months: { name: string; weekIndex: number }[];
  updatedAt: string;
}

export async function GET() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch("https://github.com/users/Arihkun/contributions", {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)",
      },
      next: { revalidate: 3600 },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`GitHub responded with ${res.status}`);
    }

    const html = await res.text();

    const countMatch = html.match(/([0-9,]+)\s+contributions/i);
    const total = countMatch ? parseInt(countMatch[1].replace(/,/g, ""), 10) : fallbackSnapshot.total;

    const tooltips: Record<string, string> = {};
    const tipRegex = /<tool-tip[^>]*for="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g;
    let tMatch: RegExpExecArray | null;
    while ((tMatch = tipRegex.exec(html)) !== null) {
      tooltips[tMatch[1]] = tMatch[2].trim();
    }

    const tdRegex = /<td[^>]+class="ContributionCalendar-day"[^>]*><\/td>/g;
    let tdMatch: RegExpExecArray | null;
    const days: CalendarDay[] = [];
    while ((tdMatch = tdRegex.exec(html)) !== null) {
      const tdTag = tdMatch[0];
      const id = (tdTag.match(/id="([^"]+)"/) || [])[1];
      const date = (tdTag.match(/data-date="([0-9-]+)"/) || [])[1];
      const levelStr = (tdTag.match(/data-level="([0-9])"/) || [])[1];
      const level = levelStr ? parseInt(levelStr, 10) : 0;
      const tooltip = (id && tooltips[id])
        ? tooltips[id]
        : `${level > 0 ? `${level} contributions` : "No contributions"} on ${date}`;
      if (date) {
        days.push({ id, date, level, tooltip });
      }
    }

    if (days.length === 0) {
      return NextResponse.json(fallbackSnapshot as ContributionData);
    }

    days.sort((a, b) => a.date.localeCompare(b.date));

    const weeks: (CalendarDay | null)[][] = [];
    let currentWeek: (CalendarDay | null)[] = [];
    const firstDOW = new Date(days[0].date).getDay();
    for (let i = 0; i < firstDOW; i++) {
      currentWeek.push(null);
    }
    for (const d of days) {
      currentWeek.push(d);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push(null);
      weeks.push(currentWeek);
    }

    const months: { name: string; weekIndex: number }[] = [];
    let lastMonth = "";
    weeks.forEach((week, weekIdx) => {
      const firstDay = week.find((d) => d !== null);
      if (firstDay) {
        const d = new Date(firstDay.date);
        const monthName = d.toLocaleString("en-US", { month: "short" });
        if (monthName !== lastMonth) {
          months.push({ name: monthName, weekIndex: weekIdx });
          lastMonth = monthName;
        }
      }
    });

    const result: ContributionData = {
      total,
      weeks,
      months,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.warn("Failed to fetch fresh GitHub contributions, returning fallback snapshot:", error);
    return NextResponse.json(fallbackSnapshot as ContributionData);
  }
}
