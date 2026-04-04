"use client";

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

interface DateRangeFilterProps {
  days: number;
  onChange: (days: number) => void;
}

const RANGE_OPTIONS = [
  { value: 7, label: "7d" },
  { value: 30, label: "30d" },
  { value: 90, label: "90d" },
  { value: 365, label: "1y" },
  { value: 0, label: "All" },
] as const;

export function DateRangeFilter({ days, onChange }: DateRangeFilterProps) {
  return (
    <ToggleGroup
      value={[String(days)]}
      onValueChange={(value: readonly string[]) => {
        const current = String(days);
        const next = value.find((v) => v !== current);
        if (next) onChange(Number(next));
      }}
      className="justify-start"
    >
      {RANGE_OPTIONS.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={String(option.value)}
          aria-label={`Show events from last ${option.label}`}
          className="text-xs px-3"
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
