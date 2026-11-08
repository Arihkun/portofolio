---
title: Koii
category: Product Engineering
status: Personal Project
featured: false
---

# Koii

## Overview

I built Koii as a private app for two people to keep a wishlist, plan activities, and save notes and photo memories. It uses Google Calendar for calendar integration and Google Drive for media storage. There is no public registration.

## Context

An activity can have records in both the app and Google Calendar, while its photos live in Drive. If an update fails halfway through, those systems can disagree. I worked on duplicate prevention, edit ownership, and retries to handle those cases.

## My Role

- Defined the product experience for wishlist, agenda, and memories.
- Built the Next.js and Supabase application.
- Integrated Google Calendar and Google Drive workflows.
- Developed calendar reconciliation, merge safeguards, and edit-ownership rules.
- Added media archive/trash behavior, preview generation, push notifications, and service-health reporting.
- Improved loading behavior, background processing, mobile layouts, and failure recovery.

## Approach

I keep source mappings and ownership information for calendar activities, and run slower external work in background processors. Archive and trash flows allow media to be recovered. The app reports partial service failures so they can be investigated.

## Architecture

```text
Next.js application
  -> Supabase data and authorization
  -> Google Calendar synchronization
  -> Google Drive media storage
  -> background processors and health signals
  -> browser notifications and responsive UI
```

## Validation and Evidence

The project includes application, server, worker, calendar, and migration tests, plus browser layout checks and external-service acceptance checklists. The video on this page records the app locally with fictional activities and AI-generated sample photos. It shows the interface; it does not test live Calendar or Drive integration.

## Results

Koii brings plans, calendar activities, and media into a two-person app. I have also worked on mobile layouts, loading behavior, notifications, and recovery when external services fail.

## Limitations

- Local checks do not prove production OAuth, Calendar, Drive, push, or browser-permission behavior.
- Real-device and production-service acceptance must be performed after deployment.
- The product is intentionally designed for two controlled accounts, not public registration.

## Technology Stack

Next.js, React, TypeScript, Supabase, PostgreSQL, Google Calendar API, Google Drive API, Cloudflare Worker, Web Push, Vercel.

## Privacy and Publication Note

Public examples use fictional names and activities with demo media. Personal stories, calendars, photos, account identifiers, and connection details remain private.
