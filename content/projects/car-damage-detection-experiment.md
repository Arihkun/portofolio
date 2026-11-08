---
title: Car Damage Detection Exploration
category: Experiments
status: Experiment
featured: false
---

# Car Damage Detection Exploration

## Overview

I explored YOLOv8 for detecting visible vehicle-body damage. The work available here focuses on converting COCO annotations for YOLO training and documenting the planned training and inference steps.

## Objective

The experiment asks whether bounding boxes can identify visible damage regions in vehicle images for later review. Estimating repair cost or damage severity is outside its scope.

## What I Built

- A COCO-to-YOLO annotation-conversion workflow.
- A proposed train/validation folder structure.
- Dataset configuration for a damage-detection class.
- Notebook material for data preparation.
- Documentation covering training, inference, and result visualization.

## Workflow

```text
COCO images and annotations
  -> annotation conversion
  -> YOLO dataset structure
  -> train/validation configuration
  -> YOLOv8 training
  -> image inference and bounding boxes
```

## Current Status

This remains an early learning experiment. The available files cover preparation and the intended workflow; they do not establish a finalized model, reproducible evaluation metrics, or deployment.

## Limitations

- Detection does not estimate repair cost, severity, or causality.
- Dataset licensing and image-publication rights must be verified.
- Performance depends heavily on viewpoint, lighting, damage type, and label consistency.
- No production-readiness claim should be made without a separate held-out evaluation.

## Technology Stack

Python, YOLOv8, Ultralytics, COCO annotations, Jupyter.

## Publication Note

Before publishing examples, verify dataset licensing and image rights. If those rights are unclear, use newly created or explicitly licensed demonstration images instead.
