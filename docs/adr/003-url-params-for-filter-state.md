# ADR-003: URL search params for filter state

## Status

Accepted

## Context

Dashboard has multiple filter dimensions (categories, status, date range,
source, selected event). Need a state management approach.

## Decision

Use `nuqs` library to sync all filter state with URL search params.

## Rationale

- Every filter combination produces a shareable URL
- Browser back/forward navigation works naturally
- SSR-compatible initial state (no hydration mismatch)
- No separate state management library needed (no zustand, no Redux)
- Type-safe parsers for arrays, enums, and numbers
- Eliminates serialization boilerplate

## Consequences

- URL can get long with many active filters (acceptable for a dashboard)
- All filter changes trigger URL updates (minimal overhead with `nuqs`)
- Must wrap app with `NuqsAdapter` provider
