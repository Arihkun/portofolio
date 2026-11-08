---
title: Repeat Order Prediction
category: Featured Risk & ML
status: Professional Experience
featured: true
---

# Repeat Order Prediction

## Overview

I am developing a workflow to rank customers by repeat-order propensity. Each score must be traceable to the agreements and dated features used to produce it. Historical evaluation also needs to exclude information recorded after the prediction cutoff.

## Context

A customer may have several agreements, changing statuses, or incomplete identifiers. Campaign actions and data snapshots may also fall after the intended prediction date. I need to resolve those records consistently before comparing models.

## My Role

- Designed agreement-first joins with controlled customer-level fallback.
- Preserved join provenance, ambiguity flags, and agreement-detail audits.
- Defined representative-agreement selection for customer-level features.
- Separated operational ranking from leakage-safe historical evaluation.
- Compared baseline and tree-based models and reviewed feature influence.
- Retained debtor-level rankings together with the underlying agreement detail.

## Approach

For each historical target month, I use the latest eligible prior snapshot. I select one representative agreement for agreement-level features so fields from different contracts do not get mixed together. Campaign actions after the cutoff are excluded from the features.

## Architecture

```text
Dated agreement snapshots + campaign outcomes
  -> agreement-first identity resolution
  -> representative-agreement selection
  -> customer-month feature table
  -> temporal leakage audit
  -> train / validation / out-of-time evaluation
  -> propensity score and ranked output
  -> agreement-level explanation detail
```

## Validation and Evidence

The project contains dummy datasets and output examples, join-coverage reports, feature-coverage checks, temporal audit outputs, and separate operational and historical workflows. The future public demo will regenerate all inputs independently.

## Results

The current work provides a ranking design with agreement details, join paths, and dated features available for review. Model evaluation is still in development; this page does not claim a public predictive-performance result.

## Limitations

- An operational snapshot created after a campaign cutoff cannot be treated as historical model evidence.
- Customer-level fallback must reject ambiguous identities.
- Propensity ranking supports prioritization; it does not prove incremental campaign impact.

## Technology Stack

Python, pandas, Polars, scikit-learn, LightGBM, Parquet, Jupyter, Excel.

## Publication Note

The public version will use synthetic customers, agreements, features, and outcomes. It will not reproduce the employer's population rules, feature definitions, data sources, rankings, or model artifacts.
