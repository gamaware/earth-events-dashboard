# ADR-002: Raw mapbox-gl over react-map-gl

## Status

Accepted

## Context

Need to render an interactive globe with GeoJSON events, clustering,
category-specific markers, storm track LineStrings, and WMTS satellite layers.

## Decision

Use `mapbox-gl` directly with a thin React wrapper, instead of `react-map-gl`.

## Rationale

- Globe projection requires full Mapbox GL API access
- WMTS layer integration from EONET needs direct `addSource`/`addLayer` calls
- Clustering with category-colored aggregation requires custom expressions
- `setFilter()` for instant category toggling needs imperative API access
- Storm path LineStrings with temporal data need custom layer management
- react-map-gl abstracts away the precise control needed for these features

## Consequences

- Must manage map lifecycle (init, resize, cleanup) manually via useEffect
- Map instance shared via React context (MapProvider)
- Child components use imperative `map.addLayer()` / `map.setFilter()` calls
- Slightly more boilerplate than react-map-gl's declarative API
