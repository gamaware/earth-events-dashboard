"use client";

import { CATEGORIES } from "@/lib/constants/categories";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  activeCategories: string[];
  onToggle: (id: string) => void;
}

export function CategoryFilter({
  activeCategories,
  onToggle,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {Object.entries(CATEGORIES).map(([id, config]) => {
        const isActive = activeCategories.includes(id);
        const Icon = config.icon;

        return (
          <button
            key={id}
            onClick={() => onToggle(id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
              "border hover:bg-muted",
              isActive
                ? "border-current bg-current/10 text-foreground"
                : "border-border text-muted-foreground",
            )}
            style={
              isActive
                ? { borderColor: config.color, color: config.color }
                : undefined
            }
            aria-label={`${isActive ? "Deselect" : "Select"} ${config.label} category`}
            aria-pressed={isActive}
          >
            <span
              className="inline-block h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: config.color }}
              aria-hidden="true"
            />
            <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span>{config.label}</span>
          </button>
        );
      })}
    </div>
  );
}
