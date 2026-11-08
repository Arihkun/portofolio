---
title: QRIS Off-Hours and Periodicity Explorer
category: Experiments
status: Experiment
featured: false
---

# QRIS Off-Hours and Periodicity Explorer

## Overview

I built a Streamlit script to inspect transactions outside configured operating hours and flag merchants whose transactions occur at unusually regular intervals.

## Objective

I used the experiment to ask:

1. Which transactions occur during a configured off-hours window?
2. Which merchants show repeated off-hours transactions with unusually consistent timing?

The output is an investigative flag, not a fraud determination.

## What I Built

- CSV and Excel upload support.
- Configurable mapping for date, time, merchant, and amount fields.
- A configurable off-hours window that can cross midnight.
- Per-merchant transaction interval calculations.
- Filters based on minimum activity, median interval, and interval variability.
- Summary tables, visualizations, and downloadable flagged records.

## Workflow

```text
Uploaded transaction file
  -> column mapping and datetime parsing
  -> off-hours classification
  -> merchant-level interval calculation
  -> configurable periodicity rules
  -> flagged-merchant table and charts
```

## Current Status

The current work is an exploratory Streamlit script. I have not established a formal test suite, benchmark dataset, calibrated anomaly model, or production-use result for it.

## Limitations

- Regular intervals do not automatically indicate suspicious behavior.
- The rule thresholds are exploratory and require business validation.
- Merchant operating hours, timezone, seasonality, and transaction context are not fully modeled.
- Uploaded data may contain sensitive financial information and must be handled locally and securely.

## Technology Stack

Python, Streamlit, pandas, NumPy, Matplotlib, Altair, Excel/CSV.

## Publication Note

Public examples must use generated merchants and transactions. Real merchant identifiers, transaction times, amounts, source files, and investigation results remain private.

