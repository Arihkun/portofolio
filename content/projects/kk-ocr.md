---
title: Indonesian Family Card OCR
category: AI, OCR & Automation
status: In Development
featured: false
---

# Indonesian Family Card OCR

## Overview

I am developing a pipeline to read Indonesian family cards and return structured JSON. The current work covers dataset preparation, document detection and normalization, layout labeling, member rows, and field auto-labeling.

## Context

A family card includes shared family information and a table with several people, along with signatures and QR areas. Inputs may be photos or PDFs. I separate page preparation from table and field processing to handle those differences.

## My Role

- Organized a staged training and labeling workflow.
- Preserved source documents while creating separate working datasets.
- Prepared full-document detection and normalization tools.
- Defined layout regions and member-row labeling strategy.
- Added scripts for training, review batches, normalization, and field auto-labeling.
- Defined an example structured-output schema.

## Approach

I start with document detection and a manually reviewed seed set for image normalization. I then use the normalized pages to label layout regions, member rows, and individual fields.

## Architecture

```text
Raw image or PDF
  -> source inventory and separation
  -> full-document detection
  -> crop, deskew, and orientation normalization
  -> layout and member-row detection
  -> field-level OCR
  -> validation and structured JSON
```

## Validation and Evidence

The repository contains Python modules, labeling tools, training commands, review workflows, and a target output schema. The end-to-end OCR API is not complete.

## Results

I have built tools for document preparation and the labeling stages needed for layout and field extraction. Field accuracy and table reconstruction still need separate evaluation.

## Limitations

- The end-to-end OCR API is not yet presented as complete.
- Dataset quality and label consistency remain critical dependencies.
- Field accuracy and table reconstruction require separate evaluation.

## Technology Stack

Python, YOLOv8, OpenCV, document preprocessing, structured JSON, Windows automation scripts.

## Code Repository

The demonstration pipeline, document-normalization utilities, and synthetic sample testing scripts are available on GitHub:  
[github.com/Arihkun/document-ocr-demo](https://github.com/Arihkun/document-ocr-demo)

## Privacy and Publication Note

Family cards contain sensitive personal and family information. Public material must not include real images, PDFs, names, family relationships, identity numbers, addresses, labels derived from real documents, or raw OCR output. Only fictional document samples may be shown.

