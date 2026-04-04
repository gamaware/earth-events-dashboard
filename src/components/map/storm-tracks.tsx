"use client";

import { useEffect, useRef, useCallback } from "react";
import type { GeoJSONSource } from "mapbox-gl";

import type { EONETEvent } from "@/lib/api/types";
import { CATEGORIES } from "@/lib/constants/categories";
import { useMap } from "@/components/map/map-provider";

const SOURCE_ID = "storm-tracks";
const LAYER_ID = "storm-tracks-line";

function buildCategoryColorExpression(): mapboxgl.Expression {
  const entries: (string | mapboxgl.Expression)[] = [];
  for (const [id, config] of Object.entries(CATEGORIES)) {
    entries.push(id, config.color);
  }
  return ["match", ["get", "categoryId"], ...entries, "#9CA3AF"];
}

function buildTrackFeatureCollection(
  events: EONETEvent[],
): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = [];

  for (const event of events) {
    const points = event.geometry.filter((g) => g.type === "Point");
    if (points.length < 2) {
      continue;
    }

    const coordinates = points.map((g) => g.coordinates as [number, number]);
    const categoryId =
      event.categories.length > 0 ? event.categories[0].id : "unknown";

    features.push({
      type: "Feature",
      properties: {
        id: event.id,
        title: event.title,
        categoryId,
      },
      geometry: {
        type: "LineString",
        coordinates,
      },
    });
  }

  return {
    type: "FeatureCollection",
    features,
  };
}

interface StormTracksProps {
  events: EONETEvent[] | null;
  activeCategories: string[];
}

export function StormTracks({ events, activeCategories }: StormTracksProps) {
  const { map, isLoaded } = useMap();
  const layerAdded = useRef(false);

  const addSourceAndLayer = useCallback(
    (mapInstance: mapboxgl.Map, data: GeoJSON.FeatureCollection) => {
      if (mapInstance.getSource(SOURCE_ID)) {
        return;
      }

      mapInstance.addSource(SOURCE_ID, {
        type: "geojson",
        data,
      });

      mapInstance.addLayer(
        {
          id: LAYER_ID,
          type: "line",
          source: SOURCE_ID,
          paint: {
            "line-color": buildCategoryColorExpression(),
            "line-width": 2,
            "line-opacity": 0.7,
            "line-dasharray": [2, 2],
          },
          layout: {
            "line-cap": "round",
            "line-join": "round",
          },
        },
        "unclustered-point",
      );

      layerAdded.current = true;
    },
    [],
  );

  useEffect(() => {
    if (!map || !isLoaded || !events) {
      return;
    }

    const trackData = buildTrackFeatureCollection(events);

    if (!layerAdded.current) {
      addSourceAndLayer(map, trackData);
    } else {
      const source = map.getSource(SOURCE_ID) as GeoJSONSource | undefined;
      if (source) {
        source.setData(trackData);
      }
    }
  }, [map, isLoaded, events, addSourceAndLayer]);

  useEffect(() => {
    if (!map || !isLoaded || !layerAdded.current) {
      return;
    }

    if (activeCategories.length === 0) {
      map.setLayoutProperty(LAYER_ID, "visibility", "none");
      return;
    }

    map.setLayoutProperty(LAYER_ID, "visibility", "visible");
    map.setFilter(LAYER_ID, [
      "in",
      ["get", "categoryId"],
      ["literal", activeCategories],
    ]);
  }, [map, isLoaded, activeCategories]);

  useEffect(() => {
    return () => {
      if (!map) {
        return;
      }

      if (map.getLayer(LAYER_ID)) {
        map.removeLayer(LAYER_ID);
      }
      if (map.getSource(SOURCE_ID)) {
        map.removeSource(SOURCE_ID);
      }
      layerAdded.current = false;
    };
  }, [map]);

  return null;
}
