"use client";

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

interface StatusFilterProps {
  status: string;
  onChange: (status: string) => void;
}

const STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
  { value: "all", label: "All" },
] as const;

export function StatusFilter({ status, onChange }: StatusFilterProps) {
  return (
    <ToggleGroup
      value={[status]}
      onValueChange={(value: readonly string[]) => {
        const next = value.find((v) => v !== status);
        if (next) onChange(next);
      }}
      className="justify-start"
    >
      {STATUS_OPTIONS.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          aria-label={`Show ${option.label.toLowerCase()} events`}
          className="text-xs px-3"
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
