"use client";

import { Print } from "@/components/icons";

export function PrintButton() {
  return (
    <button className="button button-primary print-button" type="button" onClick={() => window.print()}>
      <Print /> Print / Save as PDF
    </button>
  );
}
