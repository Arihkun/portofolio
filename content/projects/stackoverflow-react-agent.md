---
title: Stack Overflow ReAct Analytics Agent
category: AI, OCR & Automation
status: Training Project
featured: false
---

# Stack Overflow ReAct Analytics Agent

## Overview

I designed and built an enterprise-grade, controlled ReAct analytics agent that translates natural-language data questions into deterministic analytical actions over the public Stack Overflow dataset in Google BigQuery. Powered by the Gemini API (`gemini-2.5-flash` with candidate fallback chaining), the agent decomposes user queries and explains observations, while dedicated Python functions strictly manage query construction, parameterization, cost ceilings, and data aggregation.

## Context

Permitting Large Language Models to generate and execute unrestricted, arbitrary SQL directly against analytical warehouses introduces substantial security vulnerabilities (such as prompt injection and unintentional schema mutation), high error rates from schema hallucinations, and severe financial risk from uncapped data scanning. 

This project explores a governed agentic architecture: expose a minimal catalog of parameterized, read-only analytical tools and keep warehouse execution under deterministic application control.

## My Role

- Architected the controlled ReAct agent loop using `google-genai` and Gemini function calling.
- Implemented four specialized analytical tools:
  - `get_top_tags`: Retrieves high-volume technology tags across specified time windows with bounded limits.
  - `get_tag_trend`: Analyzes yearly question volume trajectories for individual technology tags.
  - `compare_tags`: Compares multi-tag adoption curves across years using parameterized array unnesting.
  - `get_answer_rate`: Evaluates community engagement metrics (answered rate, accepted answer rate, average scores, and view counts).
- Engineered a pre-flight execution pipeline with `dry_run=True` to compute estimated bytes and enforce a strict 10 GiB maximum-bytes-billed safety ceiling (`MAX_BYTES_BILLED`).
- Implemented in-memory query caching (`QUERY_CACHE`) to avoid redundant warehouse scans during model fallback retries.
- Built automated ground-truth SQL cross-validation ensuring tool aggregation results match manual database queries with 100% precision.
- Authored comprehensive documentation, audit trail logging, and reproducible visualization workflows in Seaborn and Matplotlib.

## Approach

The system decouples reasoning from computation:
1. **Tool Invocation**: The user submits an analytical inquiry. Gemini evaluates the query and triggers one or more approved tools with validated parameters.
2. **Pre-flight & Security Gate**: Before hitting BigQuery, inputs undergo strict regex sanitization (`re.fullmatch(r"[a-z0-9.+#-]+", tag)`) and temporal boundary checks (2020–2025). The SQL query runner verifies read-only `SELECT` statements and runs a dry-run billing check.
3. **Structured Observation**: The query results are transformed into a compact observation payload (JSON records capped at 50 rows) and returned to the model context.
4. **Factual Synthesis & Epistemic Modesty**: The model synthesizes the findings into structured sections (*Temuan*, *Interpretasi*, and *Keterbatasan*), acknowledging that Stack Overflow discussion activity reflects developer troubleshooting patterns rather than commercial technology adoption.

## Architecture

```text
User Question
  -> Gemini ReAct Agent (Intent & Tool Selection)
  -> Parameter Validation & Regex Tag Sanitization
  -> BigQuery Dry Run & 10 GiB Cost Guard
  -> Parameterized Public Dataset Query (bigquery-public-data.stackoverflow)
  -> Structured JSON Observation & Event Audit Log
  -> Evidence-Grounded Response & Analytical Limitations
```

## Validation and Evidence

The project includes an interactive Jupyter notebook with executed outputs, exported CSV datasets, Matplotlib/Seaborn trend charts, screenshot evidence, and a structured `audit_trail.json` file. 

Although the configured query boundary spans 2020 through 2025, active records in the public dataset snapshot conclude in 2022. The agent is explicitly prompted to disclose this data boundary rather than falsely reporting zero activity for later years.

## Results

The agent reliably executes multi-step analytics workflows (e.g., discovering the top 5 tags, charting their year-over-year trajectory, and evaluating response quality) within a single conversational turn. Python, JavaScript, Java, and C# were evaluated; while Python recorded the largest total volume, established typed ecosystems (C# and Java) demonstrated higher accepted-answer and response-completion rates.

## Limitations

- Stack Overflow question frequency indicates troubleshooting volume, not total enterprise market share.
- Public dataset observations reflect activity through 2022.
- Production usage depends on cloud API quotas and BigQuery query slots.

## Technology Stack

Python, Google Gemini API (`google-genai`), Google BigQuery, pandas, Matplotlib, Seaborn, Jupyter/Colab.

## Code Repository & Interactive Demo

- Source Code & Report: [github.com/Arihkun/stackoverflow-react-agent](https://github.com/Arihkun/stackoverflow-react-agent)
- Interactive Notebook: [Open in Google Colab](https://colab.research.google.com/drive/1cqoW4A2ZaIjj_SJSc7OD04zMLxX2hsWr?usp=sharing)

## Publication Note

All queries execute against Google BigQuery's public Stack Overflow dataset. API keys and Google Cloud credentials are never stored in the repository.
