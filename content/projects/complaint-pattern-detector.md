---
title: Complaint Pattern Detector
category: Experiments
status: Experiment
featured: false
---

# Complaint Pattern Detector

## Overview

I built an n8n experiment that looks for repeated complaints from the same location. Rules control the routing, with an optional LLM step to help interpret a complaint.

## Objective

A single low-severity complaint may only need logging. Several similar complaints in a short period may need escalation. I used synthetic histories to test routing for those cases and for submissions with missing information.

## What I Built

- An importable n8n workflow.
- Synthetic complaint history and current-submission examples.
- Expected route outputs for repeatable demonstration.
- A prompt for optional Claude-compatible analysis through OpenRouter.
- An offline mock path that does not require an external API key.
- Routes for logging, missing information, maintenance assignment, pattern escalation, and manual review.

## Workflow

```text
Synthetic complaint
  -> required-field validation
  -> location and complaint normalization
  -> recent-pattern lookup
  -> optional AI interpretation
  -> validated route or manual fallback
```

## Current Status

The workflow and synthetic examples are available as a training experiment. They cover routing, repeated-pattern lookup, and fallback behavior. I have not deployed a complaint-management product or measured its operational performance.

## Limitations

- The examples are synthetic and do not measure real operational performance.
- Similarity normalization is intentionally limited.
- An LLM recommendation still requires validation and human ownership.

## Technology Stack

n8n, Python build scripts, CSV fixtures, Claude-compatible prompting through OpenRouter.

## Publication Note

Only synthetic complaint data should be published. No real employee, customer, building, or operational incident information is required for the demonstration.

