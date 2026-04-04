"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type maplibregl from "maplibre-gl";

interface MapContextValue {
  map: maplibregl.Map | null;
  setMap: (map: maplibregl.Map) => void;
  isLoaded: boolean;
  setIsLoaded: (loaded: boolean) => void;
}

const MapContext = createContext<MapContextValue | null>(null);

export function MapProvider({ children }: { children: ReactNode }) {
  const [map, setMapState] = useState<maplibregl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const setMap = useCallback((instance: maplibregl.Map) => {
    setMapState(instance);
  }, []);

  const setIsLoadedCb = useCallback((loaded: boolean) => {
    setIsLoaded(loaded);
  }, []);

  return (
    <MapContext.Provider
      value={{ map, setMap, isLoaded, setIsLoaded: setIsLoadedCb }}
    >
      {children}
    </MapContext.Provider>
  );
}

export function useMap(): MapContextValue {
  const ctx = useContext(MapContext);
  if (!ctx) {
    throw new Error("useMap must be used within MapProvider");
  }
  return ctx;
}
