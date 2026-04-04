import useSWR from "swr";
import type { EONETGeoJSONResponse } from "@/lib/api/types";

interface UseGeoJSONParams {
  category?: string;
  status?: string;
  days?: number;
  source?: string;
  limit?: number;
  refreshInterval?: number;
}

async function fetcher(url: string): Promise<EONETGeoJSONResponse> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`GeoJSON fetch failed: ${response.status}`);
  }
  return response.json() as Promise<EONETGeoJSONResponse>;
}

function buildUrl(params?: UseGeoJSONParams): string {
  const base = "/api/eonet/geojson";
  if (!params) return base;

  const searchParams = new URLSearchParams();
  if (params.category !== undefined)
    searchParams.set("category", params.category);
  if (params.status !== undefined) searchParams.set("status", params.status);
  if (params.days !== undefined) searchParams.set("days", String(params.days));
  if (params.source !== undefined) searchParams.set("source", params.source);
  if (params.limit !== undefined)
    searchParams.set("limit", String(params.limit));

  const qs = searchParams.toString();
  return qs ? `${base}?${qs}` : base;
}

export function useGeoJSON(params?: UseGeoJSONParams) {
  const url = buildUrl(params);

  const { data, error, isLoading } = useSWR<EONETGeoJSONResponse>(
    url,
    fetcher,
    {
      refreshInterval: params?.refreshInterval,
    },
  );

  return { data, error, isLoading };
}
