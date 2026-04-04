export interface EONETEvent {
  id: string;
  title: string;
  description: string | null;
  link: string;
  closed: string | null;
  categories: EONETCategory[];
  sources: EONETSource[];
  geometry: EONETGeometry[];
}

export interface EONETCategory {
  id: string;
  title: string;
}

export interface EONETSource {
  id: string;
  url: string;
}

export interface EONETGeometry {
  magnitudeValue: number | null;
  magnitudeUnit: string | null;
  date: string;
  type: "Point" | "Polygon";
  coordinates: number[] | number[][];
}

export interface EONETEventsResponse {
  title: string;
  description: string;
  link: string;
  events: EONETEvent[];
}

export interface EONETCategoryDetail {
  id: string;
  title: string;
  link: string;
  description: string;
  layers: string;
}

export interface EONETCategoriesResponse {
  title: string;
  description: string;
  link: string;
  categories: EONETCategoryDetail[];
}

export interface EONETSourceDetail {
  id: string;
  title: string;
  source: string;
  link: string;
}

export interface EONETSourcesResponse {
  title: string;
  description: string;
  link: string;
  sources: EONETSourceDetail[];
}

export interface EONETGeoJSONFeature {
  type: "Feature";
  properties: {
    id: string;
    title: string;
    date: string;
    magnitudeValue: number | null;
    magnitudeUnit: string | null;
    categories: EONETCategory[];
    sources: EONETSource[];
  };
  geometry: {
    type: "Point" | "Polygon";
    coordinates: number[] | number[][];
  };
}

export interface EONETGeoJSONResponse {
  type: "FeatureCollection";
  features: EONETGeoJSONFeature[];
}

export interface FilterState {
  categories: string[];
  status: "open" | "closed" | "all";
  days: number;
  sources: string[];
  selectedEventId: string | null;
}
