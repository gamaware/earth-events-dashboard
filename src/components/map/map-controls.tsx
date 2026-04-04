"use client";

import { useCallback } from "react";
import { ZoomIn, ZoomOut, Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MAP_CONFIG } from "@/lib/constants/map-config";
import { useMap } from "@/components/map/map-provider";

export function MapControls() {
  const { map, isLoaded } = useMap();

  const handleZoomIn = useCallback(() => {
    if (!map) return;
    map.zoomIn();
  }, [map]);

  const handleZoomOut = useCallback(() => {
    if (!map) return;
    map.zoomOut();
  }, [map]);

  const handleResetView = useCallback(() => {
    if (!map) return;
    map.flyTo({
      center: [
        MAP_CONFIG.initialViewState.longitude,
        MAP_CONFIG.initialViewState.latitude,
      ],
      zoom: MAP_CONFIG.initialViewState.zoom,
      pitch: MAP_CONFIG.initialViewState.pitch,
      bearing: MAP_CONFIG.initialViewState.bearing,
    });
  }, [map]);

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={handleZoomIn}
        aria-label="Zoom in"
        className="h-9 w-9 border-neutral-700 bg-neutral-900/80 text-neutral-300 backdrop-blur-sm hover:bg-neutral-800 hover:text-neutral-100"
      >
        <ZoomIn className="size-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleZoomOut}
        aria-label="Zoom out"
        className="h-9 w-9 border-neutral-700 bg-neutral-900/80 text-neutral-300 backdrop-blur-sm hover:bg-neutral-800 hover:text-neutral-100"
      >
        <ZoomOut className="size-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleResetView}
        aria-label="Reset view"
        className="h-9 w-9 border-neutral-700 bg-neutral-900/80 text-neutral-300 backdrop-blur-sm hover:bg-neutral-800 hover:text-neutral-100"
      >
        <Globe className="size-4" />
      </Button>
    </div>
  );
}
