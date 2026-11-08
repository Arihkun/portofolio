---
title: KasMate
category: Product Engineering
status: Personal Project
featured: false
---

# KasMate

## Overview

I built KasMate to manage everyday finances: recording transactions, tracking wallet balances, and planning budgets and bills. It also includes goals, assets, receipt extraction, forecasting, and AI-assisted insights.

## Context

KasMate connects transaction records to salary timing, installments, debts, and transfers between wallets. Those tasks share the same app, with desktop and mobile layouts.

## My Role

- Defined the product direction and finance workflows.
- Built the React and TypeScript application architecture.
- Designed Supabase data access, authentication, workspace isolation, and Row Level Security usage.
- Implemented transaction, wallet, budget, bill, goal, and asset workflows.
- Added receipt extraction, forecasting, anomaly detection, backup, privacy controls, and account-management features.
- Added database migrations, tests, CI-oriented verification, and deployment documentation.

## Approach

I organize funds by wallet and separate account data into workspaces. Database rules and validation check who can access each record. Larger routes load on demand, and users can hide amounts on screen.

## Architecture

```text
React/Vite client
  -> typed services and Redux state
  -> Supabase Auth and PostgreSQL
  -> Row Level Security and workspace boundaries
  -> finance modules and reporting
  -> server-side AI/OCR functions where secrets are required
```

## Validation and Evidence

The repository includes a README, project history, TypeScript tests, database assertions, migration checks, and build and deployment checks. The video uses the app's dashboard, transaction, and budget components with fictional amounts in a local fixture. No live account or backend is connected.

## Results

I expanded KasMate from transaction tracking to budgets, bills, goals, and assets, then added receipt and AI-assisted workflows. Tests and migration checks cover parts of the application; live integrations still need their own acceptance checks.

## Limitations

- Live integrations and database migrations require environment-specific validation.
- Financial forecasts are decision support, not financial advice.
- Receipt and AI features depend on external service availability and quotas.

## Technology Stack

React 19, TypeScript, Vite, Tailwind CSS, Redux Toolkit, Supabase PostgreSQL/Auth/RLS, Recharts, TensorFlow.js, Gemini, Radix UI, Zod.

## Code Repository

- Source Code: [github.com/Arihkun/KasMate](https://github.com/Arihkun/KasMate)

## Privacy and Publication Note

Public screenshots and recordings use invented transactions, balances, receipts, and financial goals. Environment files and real financial data remain private.
