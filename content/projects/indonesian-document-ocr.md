---
title: Indonesian Document OCR
category: AI, OCR & Automation
status: Personal Project
featured: true
---

# Indonesian Document OCR

## Overview

I work on two related OCR modules: extracting fields from Indonesian identity cards (KTP) and processing the layout of family cards (KK). The KTP module has an API and browser demo. The KK pipeline is still in development. Both keep uncertain values available for review.

## Problem

Document photos vary in lighting, angle, orientation, and clarity. A KTP contains fields for one person; a KK also has family information and rows for multiple members. I use different layout and extraction stages for those structures.

## My Role

- Designed the staged document detection, normalization, and extraction workflows.
- Developed the KTP OCR runtime, structured API response, browser demo, and review flags.
- Prepared the KK dataset, normalization utilities, layout regions, member-row strategy, and target JSON schema.
- Added local packaging, tests, review workflows, and implementation documentation.
- Defined publication boundaries for sensitive identity data.

## Approach

### KTP module

The KTP module detects and straightens the card before reading individual fields. It can retry OCR and normalize text, then return structured output with flags for uncertain or inconsistent values.

### KK module

For KK, I separate document detection from layout and member-row extraction. A reviewed seed set supports image normalization before field labeling. This is still a development pipeline, not a completed production API.

## Architecture

```text
Image or PDF
  -> file and image validation
  -> document detection
  -> crop, deskew, and orientation normalization
  -> document-specific layout processing
     -> KTP: field detection and adaptive OCR
     -> KK: layout regions, member rows, and field OCR
  -> controlled normalization
  -> confidence and review flags
  -> structured JSON
```

## Evaluation

The local projects include processing modules, tests, API documentation, health checks, launch scripts, and labeling tools. These show how the pipeline is built and run. They do not establish field accuracy, which needs a separate test set with legally usable ground truth and per-field checks.

## Result

The KTP work includes a packaged service and browser demo. For KK, I have built document-preparation and labeling tools for the next extraction stages. The two modules share processing steps but remain at different stages of completion.

## Limitations

- End-to-end field accuracy has not been published.
- The KK module is still an in-development extraction pipeline.
- OCR output must not be treated as trusted identity data without human or downstream verification.
- Field accuracy, table reconstruction, review rate, and latency require separate evaluation.

## Technology Stack

Python, FastAPI, YOLO, PaddleOCR, OpenCV, Docker, structured JSON, unittest, and document-labeling utilities.

## Code Repository

The standalone document OCR API, preprocessing modules, and synthetic demonstration pipeline are available on GitHub:  
[github.com/Arihkun/document-ocr-demo](https://github.com/Arihkun/document-ocr-demo)

## Privacy and Publication Note

No real KTP or KK image, identity number, name, address, family relationship, OCR response, debug crop, or training dataset is included publicly. Any future demonstration must use fully fictional documents and identities.
