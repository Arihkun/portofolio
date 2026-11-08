---
title: Indonesian ID Card OCR
category: AI, OCR & Automation
status: Personal Project
featured: false
---

# Indonesian ID Card OCR

## Overview

I built an API and browser demo that extract fields from Indonesian identity cards. The pipeline detects and straightens the card, locates fields, and runs OCR. It flags uncertain values so they can be checked before use.

## Context

Photos of identity cards can be rotated, blurred, poorly lit, or tightly cropped. An incorrect character can change an identity field, so the output needs review flags and downstream checks.

## My Role

- Developed and packaged the OCR runtime workflow.
- Added orientation and card-normalization logic.
- Integrated field detection with adaptive OCR processing.
- Designed structured API responses and review-oriented statuses.
- Added a local web interface, Windows setup scripts, Docker packaging, and integration documentation.
- Added unit tests for preprocessing, normalization, and adaptive field OCR behavior.

## Approach

I process the card image before reading individual fields. Runtime modes allow a faster pass or additional OCR attempts. Low-confidence and inconsistent values remain marked for review.

## Architecture

```text
Uploaded image
  -> file and image validation
  -> card detection and orientation correction
  -> field detection
  -> adaptive PaddleOCR passes
  -> controlled normalization
  -> field confidence and review flags
  -> structured JSON response
```

## Validation and Evidence

The repository includes focused unit tests, API integration documentation, Docker configuration, Windows launch scripts, health checks, and distinct runtime modes. Training metrics and end-to-end OCR accuracy are treated as different measurements.

## Results

The project includes a packaged OCR service, browser demo, and defined API response. It returns review flags alongside extracted values. I have not published an end-to-end field-accuracy benchmark.

## Limitations

- Model detection performance does not equal end-to-end field accuracy.
- Real-world accuracy requires a legally usable, anonymized test set with human-reviewed ground truth.
- OCR output must not be used as trusted identity data without downstream verification.

## Technology Stack

Python, FastAPI, YOLO, PaddleOCR, OpenCV, Docker, Docker Compose, unittest.

## Code Repository

The demonstration service, container configuration, and synthetic document testing pipeline are available on GitHub:  
[github.com/Arihkun/document-ocr-demo](https://github.com/Arihkun/document-ocr-demo)

## Privacy and Publication Note

No real KTP image, NIK, name, address, OCR response, debug crop, or training dataset should be included in a public repository. Portfolio examples must use fully fictional documents and identities.

