import useSWR from "swr";
import type { EONETCategoriesResponse } from "@/lib/api/types";

async function fetcher(url: string): Promise<EONETCategoriesResponse> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Categories fetch failed: ${response.status}`);
  }
  return response.json() as Promise<EONETCategoriesResponse>;
}

export function useCategories() {
  const { data, error, isLoading } = useSWR<EONETCategoriesResponse>(
    "/api/eonet/categories",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    },
  );

  return { data, error, isLoading };
}
