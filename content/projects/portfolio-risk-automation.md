---
title: Portfolio Risk Automation
category: Featured Risk & ML
status: Professional Experience
featured: true
---

# Portfolio Risk Automation

## Overview

I build workflows for recurring portfolio-risk reports, using Python, Parquet, and DuckDB for data preparation and Excel/VBA for delivery. Prepared monthly data can be reused and reconciled without repeatedly reading the source workbooks.

## Context

Monthly spreadsheets can mix source records, reference mappings, calculations, and manual corrections. As reporting history grows, that makes it harder to explain a changed number or reproduce an earlier report.

## My Role

- Designed a staged workflow around preserved source workbooks and versioned outputs.
- Built transformations and monthly analytical feeds.
- Used Parquet and DuckDB to reduce repeated workbook processing.
- Connected processed feeds to Excel/VBA reporting workflows.
- Added reconciliation, mapping coverage, conflict flags, and contract-level traceability.
- Documented cases where definitions or source coverage were not yet comparable.

## Approach

I keep source workbooks unchanged and write mapped, typed data to separate files before building reporting tables. Reconciliation runs separately from the transformation steps. Ambiguous mappings stay flagged for review.

## Architecture

```text
Preserved monthly sources
  -> schema and identifier validation
  -> controlled reference mapping
  -> partitioned Parquet staging
  -> DuckDB analytical layer
  -> dimensional portfolio feeds
  -> Excel/VBA dashboards
  -> reconciliation and exception reports
```

## Validation and Evidence

The internal project includes dashboard feed documentation, reconciliation tests, mapping audits, exception outputs, and portable VBA modules. Public material will use generated contracts and simplified dimensions.

## Results

The reporting layer can reuse prepared data. Reconciliation and exception outputs help trace monthly differences to source periods, identifiers, mappings, and business definitions. I do not claim a processing-time reduction without a measured comparison.

## Limitations

- Business definitions must be aligned before numerical comparisons are treated as equivalent.
- Reference mappings can change over time and require dated provenance.
- Excel remains useful as a delivery interface but should not be the only source of transformation logic.

## Technology Stack

Python, Polars, pandas, Parquet, DuckDB, Jupyter, Excel, VBA.

## Publication Note

The public version will not contain employer workbooks, contracts, product mappings, branch references, internal dimensions, or reporting values. It will demonstrate the architecture with synthetic portfolio data.

