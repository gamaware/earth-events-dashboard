import type {
  EONETEventsResponse,
  EONETGeoJSONResponse,
  EONETCategoriesResponse,
  EONETSourcesResponse,
} from "@/lib/api/types";

const BASE_URL = "https://eonet.gsfc.nasa.gov/api/v3";

export interface EONETParams {
  category?: string;
  status?: string;
  days?: number;
  source?: string;
  limit?: number;
}

function buildQueryString(params?: EONETParams): string {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  if (params.category !== undefined) searchParams.set("category", params.category);
  if (params.status !== undefined) searchParams.set("status", params.status);
  if (params.days !== undefined) searchParams.set("days", String(params.days));
  if (params.source !== undefined) searchParams.set("source", params.source);
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));

  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

export async function fetchEvents(params?: EONETParams): Promise<EONETEventsResponse> {
  const response = await fetch(`${BASE_URL}/events${buildQueryString(params)}`);
  if (!response.ok) {
    throw new Error(`EONET events request failed: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<EONETEventsResponse>;
}

export async function fetchGeoJSON(params?: EONETParams): Promise<EONETGeoJSONResponse> {
  const response = await fetch(`${BASE_URL}/events/geojson${buildQueryString(params)}`);
  if (!response.ok) {
    throw new Error(`EONET GeoJSON request failed: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<EONETGeoJSONResponse>;
}

export async function fetchCategories(): Promise<EONETCategoriesResponse> {
  const response = await fetch(`${BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error(`EONET categories request failed: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<EONETCategoriesResponse>;
}

export async function fetchSources(): Promise<EONETSourcesResponse> {
  const response = await fetch(`${BASE_URL}/sources`);
  if (!response.ok) {
    throw new Error(`EONET sources request failed: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<EONETSourcesResponse>;
}
