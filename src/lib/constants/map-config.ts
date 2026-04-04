export const MAP_CONFIG = {
  style: "mapbox://styles/mapbox/dark-v11",
  initialViewState: {
    longitude: 0,
    latitude: 20,
    zoom: 1.8,
    pitch: 0,
    bearing: 0,
  },
  projection: "globe" as const,
  fog: {
    color: "rgb(5, 5, 15)",
    "high-color": "rgb(20, 20, 40)",
    "horizon-blend": 0.08,
    "space-color": "rgb(5, 5, 15)",
    "star-intensity": 0.6,
  },
  cluster: {
    radius: 50,
    maxZoom: 14,
  },
};
