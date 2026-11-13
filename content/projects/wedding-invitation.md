---
title: Wedding Invitation Platform
category: Product Engineering
status: Personal Project
featured: false
---

# Wedding Invitation Platform

## Overview

I built a private, modern digital wedding invitation platform featuring quiet romantic botanical styling, tokenized guest access, and real-time interactive RSVP management. Built with Next.js 16 static export and Cloudflare Pages Functions backed by Cloudflare D1 (serverless SQLite), the platform delivers instant static delivery with secure, serverless guest workflows.

## Context

Many digital wedding invitations rely on monolithic server hosting, generic low-contrast templates, or client-side storage that leaks guest lists, personal phone numbers, and private messages. This project establishes an enterprise-grade standard for event invitations: static-first edge performance, cryptographic guest token validation, zero personal data in client bundles, and accessible typography with verified contrast.

## My Role

- Architected the frontend user experience and component design system using Next.js 16, React 19, and Tailwind CSS v4.
- Designed the editorial botanical theme with high-contrast palette (`Forest #1C2E24`, `Ivory #FDFBF7`, `Gold #C5A059`) adhering strictly to WCAG AAA readability standards.
- Built split sticky-portrait desktop composition paired with full-width responsive mobile layouts.
- Integrated Cloudflare Pages Functions and Cloudflare D1 for serverless, atomic guest RSVP updates and rate-limited public wishes.
- Implemented SHA-256 token hashing and Cloudflare Turnstile anti-bot gates for form submissions.
- Engineered smooth scrolling with Lenis, interactive dialogs, keyboard navigation, and motion accessibility (`prefers-reduced-motion`).

## Approach

The system enforces strict architectural separation:
1. **Static Presentation Layer**: The core invitation—hero couple section, couple profiles, love story timeline, event details, and photo gallery—builds to a purely static export served globally from Cloudflare edge locations with near-zero latency.
2. **Tokenized Guest Authentication**: Unique invitation URLs provide a guest token hash. The server validates the token against D1, retrieving guest names and maximum permitted party size without exposing raw guest tables or contact records.
3. **Atomic RSVP & Public Wishes**: Guests submit attendance confirmation and personal wishes through Pages Functions. Rate limiting and atomic SQL transactions guarantee duplicate submission prevention and tamper resistance.
4. **Epistemic Honesty**: Where real-world venue pins, bank accounts, or licensed music are pending, the UI presents clean, structured fallback states rather than displaying fake placeholders.

## Architecture

```text
Next.js 16 Static Export
  -> Static HTML/CSS/Images on Cloudflare Pages Edge
  -> Lenis Smooth Scroll & Responsive Editorial Layout
  -> URL Token Hash Validation
  -> Cloudflare Pages Functions (/api/rsvp, /api/wishes)
  -> Cloudflare D1 (Private Serverless SQLite DB)
  -> Rate Limiting & Cloudflare Turnstile Anti-Bot Check
```

## Validation and Evidence

The project includes unit and integration test suites in Vitest covering token hashing, guest count bounds, idempotency of RSVP updates, wishes deduplication, and timezone offset handling. Cross-device manual and automated browser testing verified zero horizontal overflow across mobile (360px–430px) and desktop (768px–1440px) viewports, complete focus trap restoration in image lightboxes, and offline resilience.

## Results

The invitation achieves optimal Lighthouse performance scores (100 SEO, 100 Best Practices) with minimal bundle weight. The tokenized guest workflow guarantees that only designated invitees can RSVP or post wishes, while public viewers receive an elegant static reading experience.

## Limitations

- RSVP and wishes submission require an authorized invitation token.
- Video and live audio playback respect user gesture constraints and device audio policies.
- Production publication gates on client-provided finalized event details and custom domain DNS.

## Technology Stack

Next.js 16, React 19, TypeScript, Tailwind CSS v4, Motion, Lenis, Cloudflare Pages, Cloudflare Pages Functions, Cloudflare D1, Cloudflare Turnstile, Vitest.

## Code Repository

The complete invitation frontend, database migrations, and Cloudflare Pages Functions architecture are available on GitHub:  
[github.com/Arihkun/wedding-inv](https://github.com/Arihkun/wedding-inv)

## Privacy and Publication Note

Sample photos and event dates in public demonstrations use synthetic placeholders. Guest identity lists and production configuration variables remain strictly private.
