import useSWR from "swr";
import type { EONETEventsResponse } from "@/lib/api/types";

interface UseEventsParams {
  category?: string;
  status?: string;
  days?: number;
  source?: string;
  limit?: number;
  refreshInterval?: number;
}

async function fetcher(url: string): Promise<EONETEventsResponse> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Events fetch failed: ${response.status}`);
  }
  return response.json() as Promise<EONETEventsResponse>;
}

function buildUrl(params?: UseEventsParams): string {
  const base = "/api/eonet/events";
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

export function useEvents(params?: UseEventsParams) {
  const url = buildUrl(params);

  const { data, error, isLoading } = useSWR<EONETEventsResponse>(
    url,
    fetcher,
    {
      refreshInterval: params?.refreshInterval,
    },
  );

  return { data, error, isLoading };
}
