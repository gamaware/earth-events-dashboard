"use client";

import type { EONETEvent } from "@/lib/api/types";
import { getCategoryConfig } from "@/lib/constants/categories";
import { timeAgo, formatMagnitude } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: EONETEvent;
  isSelected: boolean;
  onClick: () => void;
}

export function EventCard({ event, isSelected, onClick }: EventCardProps) {
  const primaryCategory =
    event.categories.length > 0 ? event.categories[0] : null;
  const categoryConfig = primaryCategory
    ? getCategoryConfig(primaryCategory.id)
    : null;
  const Icon = categoryConfig?.icon;

  const latestGeometry =
    event.geometry.length > 0
      ? event.geometry[event.geometry.length - 1]
      : null;

  const magnitude =
    latestGeometry?.magnitudeValue !== null && latestGeometry?.magnitudeValue !== undefined
      ? formatMagnitude(latestGeometry.magnitudeValue, latestGeometry.magnitudeUnit)
      : null;

  const date = latestGeometry ? timeAgo(latestGeometry.date) : "";

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-lg border p-3 text-left transition-colors",
        "hover:bg-[#1A2035]",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border bg-transparent",
      )}
      aria-label={`Select event: ${event.title}`}
      aria-pressed={isSelected}
    >
      <div className="flex items-start gap-2.5">
        {Icon && categoryConfig && (
          <div className="mt-0.5 shrink-0">
            <Icon
              className="h-4 w-4"
              style={{ color: categoryConfig.color }}
              aria-hidden="true"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {event.title}
          </p>

          <div className="mt-1 flex items-center gap-2">
            {primaryCategory && categoryConfig && (
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 border-current"
                style={{ color: categoryConfig.color }}
              >
                <span
                  className="mr-1 inline-block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: categoryConfig.color }}
                  aria-hidden="true"
                />
                {categoryConfig.label}
              </Badge>
            )}

            {date && (
              <span className="text-[10px] text-muted-foreground">{date}</span>
            )}
          </div>

          {magnitude && (
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">
              {magnitude}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
