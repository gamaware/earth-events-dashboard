"use client";

import { useEffect, useRef, useCallback } from "react";
import type mapboxgl from "mapbox-gl";
import type { GeoJSONSource, MapMouseEvent } from "mapbox-gl";

import { CATEGORIES } from "@/lib/constants/categories";
import { useMap } from "@/components/map/map-provider";
import { MAP_CONFIG } from "@/lib/constants/map-config";

const SOURCE_ID = "events";
const LAYER_CLUSTERS = "clusters";
const LAYER_CLUSTER_COUNT = "cluster-count";
const LAYER_UNCLUSTERED = "unclustered-point";
const LAYER_PULSE = "unclustered-point-pulse";

function buildCategoryColorExpression(): mapboxgl.Expression {
  const entries: (string | mapboxgl.Expression)[] = [];
  for (const [id, config] of Object.entries(CATEGORIES)) {
    entries.push(id, config.color);
  }
  return ["match", ["get", "categoryId"], ...entries, "#9CA3AF"];
}

interface EventMarkersProps {
  geojsonData: GeoJSON.FeatureCollection | null;
  activeCategories: string[];
  onEventClick: (eventId: string) => void;
}

function enrichFeatureCollection(
  data: GeoJSON.FeatureCollection,
): GeoJSON.FeatureCollection {
  return {
    ...data,
    features: data.features.map((feature) => {
      const props = feature.properties ?? {};
      const categories = props.categories as Array<{ id: string }> | undefined;
      const categoryId =
        categories && categories.length > 0 ? categories[0].id : "unknown";
      const isOpen = !props.closed;
      return {
        ...feature,
        properties: {
          ...props,
          categoryId,
          isOpen: isOpen ? 1 : 0,
        },
      };
    }),
  };
}

export function EventMarkers({
  geojsonData,
  activeCategories,
  onEventClick,
}: EventMarkersProps) {
  const { map, isLoaded } = useMap();
  const layersAdded = useRef(false);

  const addSourceAndLayers = useCallback(
    (mapInstance: mapboxgl.Map, data: GeoJSON.FeatureCollection) => {
      if (mapInstance.getSource(SOURCE_ID)) {
        return;
      }

      mapInstance.addSource(SOURCE_ID, {
        type: "geojson",
        data,
        cluster: true,
        clusterRadius: MAP_CONFIG.cluster.radius,
        clusterMaxZoom: MAP_CONFIG.cluster.maxZoom,
      });

      mapInstance.addLayer({
        id: LAYER_CLUSTERS,
        type: "circle",
        source: SOURCE_ID,
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#6366F1",
          "circle-opacity": 0.85,
          "circle-radius": ["step", ["get", "point_count"], 15, 10, 25, 50, 35],
          "circle-stroke-width": 2,
          "circle-stroke-color": "rgba(99, 102, 241, 0.3)",
        },
      });

      mapInstance.addLayer({
        id: LAYER_CLUSTER_COUNT,
        type: "symbol",
        source: SOURCE_ID,
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["DIN Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
        paint: {
          "text-color": "#FFFFFF",
        },
      });

      mapInstance.addLayer({
        id: LAYER_UNCLUSTERED,
        type: "circle",
        source: SOURCE_ID,
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": buildCategoryColorExpression(),
          "circle-radius": 8,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#1E1E2E",
          "circle-opacity": 0.9,
        },
      });

      mapInstance.addLayer({
        id: LAYER_PULSE,
        type: "circle",
        source: SOURCE_ID,
        filter: [
          "all",
          ["!", ["has", "point_count"]],
          ["==", ["get", "isOpen"], 1],
        ],
        paint: {
          "circle-color": buildCategoryColorExpression(),
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["remainder", ["/", ["to-number", ["get", "date"], 0], 1000], 4],
            0,
            8,
            2,
            14,
            4,
            8,
          ],
          "circle-opacity": 0.3,
          "circle-stroke-width": 0,
        },
      });

      layersAdded.current = true;
    },
    [],
  );

  useEffect(() => {
    if (!map || !isLoaded || !geojsonData) {
      return;
    }

    const enriched = enrichFeatureCollection(geojsonData);

    if (!layersAdded.current) {
      addSourceAndLayers(map, enriched);
    } else {
      const source = map.getSource(SOURCE_ID) as GeoJSONSource | undefined;
      if (source) {
        source.setData(enriched);
      }
    }
  }, [map, isLoaded, geojsonData, addSourceAndLayers]);

  useEffect(() => {
    if (!map || !isLoaded || !layersAdded.current) {
      return;
    }

    if (activeCategories.length === 0) {
      map.setFilter(LAYER_UNCLUSTERED, ["literal", false]);
      map.setFilter(LAYER_PULSE, ["literal", false]);
      return;
    }

    const categoryFilter: mapboxgl.Expression = [
      "in",
      ["get", "categoryId"],
      ["literal", activeCategories],
    ];

    map.setFilter(LAYER_UNCLUSTERED, [
      "all",
      ["!", ["has", "point_count"]],
      categoryFilter,
    ]);
    map.setFilter(LAYER_PULSE, [
      "all",
      ["!", ["has", "point_count"]],
      ["==", ["get", "isOpen"], 1],
      categoryFilter,
    ]);
  }, [map, isLoaded, activeCategories]);

  useEffect(() => {
    if (!map || !isLoaded) {
      return;
    }

    const handleClusterClick = (e: MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [LAYER_CLUSTERS],
      });
      if (!features.length) {
        return;
      }

      const clusterId = features[0].properties?.cluster_id as
        | number
        | undefined;
      if (clusterId === undefined) {
        return;
      }

      const source = map.getSource(SOURCE_ID) as GeoJSONSource | undefined;
      if (!source) {
        return;
      }

      source.getClusterExpansionZoom(
        clusterId,
        (err: Error | null | undefined, zoom: number | null | undefined) => {
          if (err || zoom === null || zoom === undefined) {
            return;
          }
          const geometry = features[0].geometry;
          if (geometry.type !== "Point") {
            return;
          }
          map.easeTo({
            center: geometry.coordinates as [number, number],
            zoom,
          });
        },
      );
    };

    const handleUnclusteredClick = (e: MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [LAYER_UNCLUSTERED],
      });
      if (!features.length) {
        return;
      }

      const feature = features[0];
      const eventId = feature.properties?.id as string | undefined;
      if (!eventId) {
        return;
      }

      onEventClick(eventId);

      const geometry = feature.geometry;
      if (geometry.type === "Point") {
        map.flyTo({
          center: geometry.coordinates as [number, number],
          zoom: Math.max(map.getZoom(), 6),
        });
      }
    };

    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };
    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
    };

    map.on("click", LAYER_CLUSTERS, handleClusterClick);
    map.on("click", LAYER_UNCLUSTERED, handleUnclusteredClick);
    map.on("mouseenter", LAYER_CLUSTERS, handleMouseEnter);
    map.on("mouseenter", LAYER_UNCLUSTERED, handleMouseEnter);
    map.on("mouseleave", LAYER_CLUSTERS, handleMouseLeave);
    map.on("mouseleave", LAYER_UNCLUSTERED, handleMouseLeave);

    return () => {
      map.off("click", LAYER_CLUSTERS, handleClusterClick);
      map.off("click", LAYER_UNCLUSTERED, handleUnclusteredClick);
      map.off("mouseenter", LAYER_CLUSTERS, handleMouseEnter);
      map.off("mouseenter", LAYER_UNCLUSTERED, handleMouseEnter);
      map.off("mouseleave", LAYER_CLUSTERS, handleMouseLeave);
      map.off("mouseleave", LAYER_UNCLUSTERED, handleMouseLeave);
    };
  }, [map, isLoaded, onEventClick]);

  useEffect(() => {
    return () => {
      if (!map) {
        return;
      }

      const layerIds = [
        LAYER_PULSE,
        LAYER_UNCLUSTERED,
        LAYER_CLUSTER_COUNT,
        LAYER_CLUSTERS,
      ];
      for (const id of layerIds) {
        if (map.getLayer(id)) {
          map.removeLayer(id);
        }
      }
      if (map.getSource(SOURCE_ID)) {
        map.removeSource(SOURCE_ID);
      }
      layersAdded.current = false;
    };
  }, [map]);

  return null;
}
