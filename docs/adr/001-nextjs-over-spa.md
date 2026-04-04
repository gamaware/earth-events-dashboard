# ADR-001: Next.js over plain React SPA

## Status

Accepted

## Context

Need to build a real-time dashboard consuming NASA EONET API. Options
considered: plain React SPA (Vite), Next.js (App Router), Astro + React islands.

## Decision

Use Next.js 16 with App Router.

## Rationale

- API routes provide a lightweight caching proxy (5-minute revalidation) to
  protect against EONET's 60 req/min rate limit
- Server Components pre-render the initial data for faster first paint
- Single deployable unit (no separate backend service)
- Flexible deployment: works on Vercel, AWS Amplify, or static export
- TypeScript and Tailwind CSS built-in

## Consequences

- Slightly larger initial bundle than a plain Vite SPA
- Must be deliberate about Server vs Client Component boundaries
- MapLibre GL JS requires `"use client"` (browser-only APIs)
