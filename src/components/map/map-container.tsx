"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { MAP_CONFIG } from "@/lib/constants/map-config";
import { useMap } from "@/components/map/map-provider";

export function MapContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const { setMap, setIsLoaded } = useMap();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const map = new maplibregl.Map({
      container,
      style: MAP_CONFIG.style,
      center: [
        MAP_CONFIG.initialViewState.longitude,
        MAP_CONFIG.initialViewState.latitude,
      ],
      zoom: MAP_CONFIG.initialViewState.zoom,
      pitch: MAP_CONFIG.initialViewState.pitch,
      bearing: MAP_CONFIG.initialViewState.bearing,
    });

    mapRef.current = map;

    map.on("load", () => {
      setMap(map);
      setIsLoaded(true);
    });

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      setIsLoaded(false);
      map.remove();
      mapRef.current = null;
    };
  }, [setMap, setIsLoaded]);

  return <div ref={containerRef} className="h-full w-full" />;
}
