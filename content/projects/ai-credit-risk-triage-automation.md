---
title: AI Credit Risk Triage Automation
category: AI, OCR & Automation
status: Training Project
featured: false
---

# AI Credit Risk Triage Automation

## Overview

I built this n8n workflow as a final project for AI Agent and Automation coursework. It checks demonstration credit applications and routes them to a recommendation or manual review. An optional LLM step helps interpret a case when configured.

## Context

The training scenarios include incomplete applications, high-risk cases, and cases needing a closer review. I used rules to control routing and kept any LLM interpretation subject to validation and authorized human review.

## My Role

- Designed the training-project workflow and routing scenarios.
- Prepared demonstration application examples and expected outcomes.
- Added an LLM review prompt and optional OpenRouter integration.
- Added an offline mock path so the workflow can be demonstrated without an external model key.
- Produced supporting documentation, architecture material, and presentation slides.
- Kept final authority with an authorized human risk function.

## Approach

The workflow checks inputs and rule-based signals before requesting an optional AI review. It validates the returned route and sends the case to manual review if data is missing, the response is unmapped, or the model call fails.

## Architecture

```text
Synthetic application
  -> completeness and deterministic checks
  -> optional LLM-assisted review
  -> response validation
  -> recommendation route
  -> optional reporting destination
  -> human review or authorized decision
```

## Validation and Evidence

The training package contains an importable n8n workflow, demonstration cases, expected routing output, prompts, explanatory documentation, build scripts, and presentation material. It supports an offline demonstration path. The existing demo files require a separate privacy review before any repository publication.

## Results

The training package includes the workflow, synthetic scenarios, expected routes, and an offline mock path. These support a repeatable demonstration, not a claim about real credit-decision accuracy.

## Limitations

- This is a training project, not a deployed credit-decision system.
- Synthetic routing outcomes do not demonstrate production accuracy or business impact.
- LLM output must be validated and cannot replace authorized decision policy.

## Technology Stack

n8n, Python, Claude-compatible prompting through OpenRouter, Google Sheets integration pattern, synthetic CSV data.

## Publication Note

All public examples must remain synthetic. The project must not reuse employer applications, scoring outputs, decision policies, prompts containing confidential context, or operational endpoints.
