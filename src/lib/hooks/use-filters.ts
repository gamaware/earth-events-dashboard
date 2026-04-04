import {
  useQueryStates,
  parseAsArrayOf,
  parseAsString,
  parseAsInteger,
  parseAsStringLiteral,
} from "nuqs";

const filtersParsers = {
  categories: parseAsArrayOf(parseAsString).withDefault([]),
  status: parseAsStringLiteral(["open", "closed", "all"] as const).withDefault("open"),
  days: parseAsInteger.withDefault(30),
  sources: parseAsArrayOf(parseAsString).withDefault([]),
  event: parseAsString.withDefault(""),
};

export function useFilters() {
  return useQueryStates(filtersParsers);
}

export type UseFiltersReturn = ReturnType<typeof useFilters>;
