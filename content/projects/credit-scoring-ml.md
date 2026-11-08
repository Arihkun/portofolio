---
title: Credit Scoring ML
category: Featured Risk & ML
status: Professional Experience
featured: true
---

# Credit Scoring ML

## Overview

I develop and evaluate credit-risk models for consumer finance. My work includes preparing historical data, checking features, comparing models, and documenting scoring inputs for technical handoff. Employer data, proprietary variables, and lending thresholds remain private.

## Context

Before comparing models, I need a clear observation window and definition of default. I also need to check that each feature was available at the prediction date and that downstream systems can supply the required inputs.

## My Role

- Prepared and validated historical credit-performance data.
- Investigated candidate features and missing-data behavior.
- Compared tree-based and linear classification approaches.
- Evaluated discrimination, stability, classification trade-offs, and generalization gaps.
- Defined input contracts and supported API and IT handoff activities.
- Documented limitations and unresolved dependencies instead of treating model metrics as the only acceptance criterion.

## Approach

I separate data preparation, feature engineering, model comparison, and holdout evaluation from score transformation and runtime checks. I check whether dated feature snapshots and outcomes can support time-based evaluation. A random split is useful for exploration but does not replace an out-of-time test.

## Architecture

```text
Historical observations
  -> eligibility and outcome definition
  -> feature availability checks
  -> training / validation / out-of-time split
  -> model comparison and tuning
  -> calibration and risk segmentation
  -> versioned model bundle
  -> payload validation and scoring API
  -> monitoring and review
```

## Validation and Evidence

The internal workflow contains model reports, feature contracts, runtime validation, smoke tests, and handoff documentation. The public benchmark shown above is a separate, independently trained educational exercise on the [UCI Default of Credit Card Clients dataset](https://archive.ics.uci.edu/dataset/350/default+of+credit+card+clients). It is not an employer dataset, model, or result.

For that benchmark, I excluded ID and the demographic fields (sex, education, marriage, age), using credit limit, historical repayment status, bill amounts, and payment amounts only. A stratified 80/20 random split with seed 42 produced 24,000 training rows and 6,000 untouched holdout rows (1,327 defaults). I compared a prevalence baseline, standardized logistic regression, and histogram gradient boosting with fixed settings, without test-set tuning.

| Public-data model | Holdout ROC-AUC | PR-AUC | Brier score | Defaults captured in highest-risk 10% |
| --- | ---: | ---: | ---: | ---: |
| Prevalence baseline | 0.500 | 0.221 | 0.172 | Not meaningful for tied scores |
| Logistic regression | 0.706 | 0.492 | 0.147 | 30.8% |
| Histogram gradient boosting | 0.777 | 0.552 | 0.135 | 31.5% |

The top-decile calculation ranks exactly 600 holdout records. Reproduce the numbers with `python scripts/credit_default_benchmark.py` after installing pandas, NumPy, requests, scikit-learn, and xlrd. The script downloads the public workbook into memory and does not publish the data or a trained model.

## Results

My professional work includes the data and integration checks needed to hand a model over to another team. In the separate public benchmark, histogram gradient boosting improved ranking and probability error over the simple baselines on this random holdout. That result does **not** establish production suitability, temporal stability, fairness, or performance on Indonesian consumer-finance applicants. I do not publish confidential production metrics.

## Limitations

- Model performance can drift as applicant populations and operating policies change.
- Feature availability at prediction time must be proven, not assumed.
- Model results still need policy, fairness, governance, and monitoring review.

## Technology Stack

Python, pandas, NumPy, scikit-learn, XGBoost, LightGBM, Optuna, Jupyter, FastAPI, Excel, Parquet.

## Code Repository

The standalone benchmark training pipeline, evaluation script, and trained model artifact are available on GitHub:  
[github.com/Arihkun/credit-risk-analytics-lab](https://github.com/Arihkun/credit-risk-analytics-lab)

## Publication Note

This page describes my professional responsibilities at a high level. The linked benchmark is an independent public-data exercise. Public decision-system examples must use new code and fictional entities, without employer data, model artifacts, variables, thresholds, or score bands.
