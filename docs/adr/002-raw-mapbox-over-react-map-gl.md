# ADR-002: Raw maplibre-gl over react-map-gl

## Status

Accepted (updated: migrated from mapbox-gl to maplibre-gl)

## Context

Need to render an interactive map with GeoJSON events, clustering,
category-specific markers, and storm track LineStrings. Originally chose
mapbox-gl, but migrated to maplibre-gl (free, open-source fork) to avoid
requiring a Mapbox API key and credit card signup.

## Decision

Use `maplibre-gl` directly with a thin React wrapper, instead of `react-map-gl`.

## Rationale

- Clustering with category-colored aggregation requires custom expressions
- `setFilter()` for instant category toggling needs imperative API access
- Storm path LineStrings with temporal data need custom layer management
- react-map-gl abstracts away the precise control needed for these features
- maplibre-gl is API-compatible with mapbox-gl but free and open-source
- No API token or credit card required (uses free CartoDB dark tiles)

## Consequences

- Must manage map lifecycle (init, resize, cleanup) manually via useEffect
- Map instance shared via React context (MapProvider)
- Child components use imperative `map.addLayer()` / `map.setFilter()` calls
- Slightly more boilerplate than react-map-gl's declarative API
- Globe projection not available (MapLibre uses flat map projection)
