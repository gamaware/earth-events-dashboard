"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { MAP_CONFIG } from "@/lib/constants/map-config";
import { useMap } from "@/components/map/map-provider";

export function MapContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const { setMap, setIsLoaded } = useMap();

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container,
      style: MAP_CONFIG.style,
      center: [
        MAP_CONFIG.initialViewState.longitude,
        MAP_CONFIG.initialViewState.latitude,
      ],
      zoom: MAP_CONFIG.initialViewState.zoom,
      pitch: MAP_CONFIG.initialViewState.pitch,
      bearing: MAP_CONFIG.initialViewState.bearing,
      projection: MAP_CONFIG.projection,
    });

    mapRef.current = map;

    map.on("style.load", () => {
      map.setFog(MAP_CONFIG.fog as mapboxgl.FogSpecification);
    });

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

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!token) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-neutral-400">
        <p>
          Missing <code>NEXT_PUBLIC_MAPBOX_TOKEN</code> environment variable.
        </p>
      </div>
    );
  }

  return <div ref={containerRef} className="h-full w-full" />;
}
