---
title: Stack Overflow ReAct Analytics Agent
category: AI, OCR & Automation
status: Training Project
featured: false
---

# Stack Overflow ReAct Analytics Agent

## Overview

I built a ReAct-style agent to answer questions about the public Stack Overflow dataset in BigQuery. Gemini selects from approved analytical tools and explains their results. Python functions construct the queries and calculate the answers.

## Context

I limit what the model can query and how much a query can cost. The agent uses a small set of parameterized tools rather than executing arbitrary model-generated SQL.

## My Role

- Designed four analytical tools for tag popularity, trends, comparison, and response quality.
- Implemented input validation and parameterized BigQuery queries.
- Added dry-run cost estimation and maximum-bytes-billed controls.
- Added query caching, model fallback, and structured audit logs.
- Produced charts, result exports, a report, and evidence screenshots.
- Documented analytical limitations instead of interpreting question volume as technology adoption.

## Approach

Each tool checks its parameters and target dataset, estimates query cost with a dry run, and applies a billing limit before execution. It returns structured results for the model to explain.

## Architecture

```text
User question
  -> Gemini tool selection
  -> validated analytics function
  -> BigQuery dry run and cost guard
  -> parameterized public-data query
  -> structured observation and audit event
  -> evidence-based response
```

## Validation and Evidence

The package includes the notebook, exported CSV results, charts, screenshots, an audit trail, and written documentation. Although the configured filter extends through 2025, the saved analytical results contain observations for 2020–2022 only. Missing later years are not interpreted as zero activity.

## Results

The saved runs compare tag volumes and response characteristics using several tools. The notebook retains the queries, results, and audit events so those answers can be reviewed.

## Limitations

- Stack Overflow activity is not a direct measure of industry adoption.
- Saved results cover 2020–2022, not the entire configured period.
- Model availability and cloud-query quotas can affect live execution.

## Technology Stack

Python, Gemini API, Google BigQuery, google-genai, pandas, Matplotlib, Jupyter/Colab.

## Code Repository

The ReAct agent workflow, BigQuery exploration scripts, and analytical notebooks are available on GitHub:  
[github.com/Arihkun/stackoverflow-react-agent](https://github.com/Arihkun/stackoverflow-react-agent)

## Publication Note

The project uses a public dataset. API keys and Google Cloud credentials are never embedded in the notebook or repository.

