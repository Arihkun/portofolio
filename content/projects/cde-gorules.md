---
title: CDE and GoRules Transformation
category: Featured Risk & ML
status: Professional Experience
featured: true
---

# CDE and GoRules Transformation

## Overview

I translate lending policies into GoRules decision models and check that their API outputs match the expected format. My work covers rule order, versioning, and regression tests. This page explains that work without publishing the employer's lending policy.

## Context

Credit decisions can depend on eligibility, customer risk, product conditions, operational restrictions, and exceptions. When several rules apply, their order can change the result. I check that order along with the reasons and response fields returned to the calling system.

## My Role

- Translated business matrices and rule requirements into structured decision flows.
- Separated reusable decision stages from input normalization and response formatting.
- Defined standalone and combined execution paths for related decision models.
- Preserved output contracts while improving rule readability and maintainability.
- Built and reviewed parity, boundary, API-validation, and regression checks.
- Produced technical specifications and reading guides for handoff.

## Approach

I separate input normalization and reference mappings from the decision tables, restrictions, and optional overlays. The response layer then collects the reasons and returns the agreed public fields, leaving internal working fields out of the API response.

## Architecture

```text
Validated request
  -> normalization
  -> reference mapping
  -> base decision table
  -> restriction and exception evaluation
  -> optional risk overlays
  -> reason-code aggregation
  -> public response mapping
  -> versioned API response
```

## Validation and Evidence

During the portfolio audit, the local suite passed 39 tests. The project documentation also records parity checks across reachable decision combinations. Those checks establish what was tested locally; deployment and business acceptance need separate verification.

## Results

The resulting models have version identifiers, defined validation errors, and structured reasons. Regression tests check those outputs when rules change. Public examples use a fictional domain with unrelated rules.

## Limitations

- Local parity does not replace deployment and business acceptance testing.
- Decision tables still require governance, change approval, and version control.
- Visual editor compatibility must be checked separately from runtime evaluation.

## Technology Stack

GoRules ZEN Engine, JSON Decision Model, Python, FastAPI, Pydantic, pytest, Excel-based rule analysis.

## Code Repository

The conceptual decision engine architecture, GoRules Zen decision table specification, and FastAPI service are available on GitHub:  
[github.com/Arihkun/cde-gorules-engine](https://github.com/Arihkun/cde-gorules-engine)

## Publication Note

The linked repository is a separate conceptual example. Production decision graphs, matrices, payloads, mappings, thresholds, endpoints, and model JSON remain private. Public examples require a fictional schema and independently designed rules.

