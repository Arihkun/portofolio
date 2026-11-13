---
title: Wedding Invitation Platform
category: Product Engineering
status: Personal Project
featured: false
---

# Wedding Invitation Platform

## Overview

I built a private digital wedding invitation web application featuring botanical styling, tokenized guest invitations, and real-time RSVP management. It combines a Next.js 16 static export on Cloudflare Pages with serverless Pages Functions backed by Cloudflare D1 (serverless SQLite).

## Context

Many online invitations rely on heavy templates or insecure client storage that exposes entire guest lists and phone numbers. I wanted a lightweight, secure invitation that loads instantly from the edge, validates guest invitations server-side via token hashes, and protects RSVP and guest wishes from spam.

## My Role

- Built the full-stack web application using Next.js 16, React 19, and Tailwind CSS v4.
- Implemented responsive mobile and desktop layouts with smooth scrolling (Lenis) and enter animations (Motion).
- Developed interactive components including the opening gate envelope, live countdown timer, couple profiles, and photo gallery.
- Integrated Cloudflare Pages Functions and Cloudflare D1 for atomic RSVP submissions and guest wishes.
- Implemented URL-based guest token verification so invitees see their own names and permitted guest count securely.
- Configured Cloudflare Turnstile anti-bot verification to prevent spam on public submission endpoints.
- Tested form validation, edge API error handling, and cross-browser responsiveness.

## Approach

The application separates static content from private guest workflows:
1. **Static Presentation**: Core invitation sections—hero couple view, event schedule, story timeline, and photo gallery—are pre-rendered as static HTML and served globally via Cloudflare Pages edge network.
2. **Tokenized Guest Access**: Each invited guest receives a personalized link with a unique token. Pages Functions validate the token against Cloudflare D1, returning the guest's name and allocated party seats without exposing the underlying guest database.
3. **Atomic RSVP & Wishes**: When guests submit their attendance or leave a message, the serverless API updates D1 atomically with idempotency and rate limiting.
4. **Form Protection**: Submissions are guarded by Cloudflare Turnstile, ensuring automated bots cannot spam guest wishes or alter RSVPs.

## Architecture

```text
Next.js 16 Static Export
  -> Static HTML/CSS/Images on Cloudflare Pages Edge
  -> Lenis Smooth Scroll & Responsive Mobile Layout
  -> URL Invitation Token Validation
  -> Cloudflare Pages Functions (/api/rsvp, /api/wishes)
  -> Cloudflare D1 (Private Serverless SQLite DB)
  -> Cloudflare Turnstile Anti-Bot Verification
```

## Validation and Evidence

The project includes Vitest automated tests verifying token hashing, RSVP status transitions, wishes deduplication, and database migrations. Manual and browser checks confirmed smooth rendering across mobile viewports (360px–430px) and desktop screens without horizontal overflow.

## Results

The invitation achieves optimal Lighthouse scores (100 SEO, 100 Best Practices) with minimal bundle weight. Invited guests can easily RSVP and share wishes on mobile devices, while event organizers have a centralized, secure SQLite database of guest responses.

## Limitations

- RSVP and wishes submissions require a valid invitation token.
- Background music playback requires an initial user interaction to comply with browser audio autoplay policies.
- Production publication requires finalizing event dates, venue coordinates, and custom domain DNS.

## Technology Stack

Next.js 16, React 19, TypeScript, Tailwind CSS v4, Motion, Lenis, Cloudflare Pages, Cloudflare Pages Functions, Cloudflare D1, Cloudflare Turnstile, Vitest.

## Code Repository

The complete invitation frontend, database migrations, and Cloudflare Pages Functions architecture are available on GitHub:  
[github.com/Arihkun/wedding-inv](https://github.com/Arihkun/wedding-inv)

## Privacy and Publication Note

Sample names and mock event dates are used for portfolio demonstration. Real guest contact details are never committed or published.
