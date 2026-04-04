"use client";

import { useMemo } from "react";
import { Activity } from "lucide-react";
import type { EONETEvent } from "@/lib/api/types";
import { getCategoryConfig } from "@/lib/constants/categories";
import { StatCard } from "@/components/stats/stat-card";

interface StatsBarProps {
  events: EONETEvent[];
  isLoading: boolean;
}

export function StatsBar({ events, isLoading }: StatsBarProps) {
  const categoryBreakdown = useMemo(() => {
    const counts = new Map<string, number>();
    for (const event of events) {
      for (const cat of event.categories) {
        counts.set(cat.id, (counts.get(cat.id) ?? 0) + 1);
      }
    }

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, count]) => {
        const config = getCategoryConfig(id);
        const Icon = config.icon;
        return { id, count, label: config.label, color: config.color, Icon };
      });
  }, [events]);

  return (
    <div className="absolute left-4 right-4 top-4 z-10 pointer-events-none">
      <div className="pointer-events-auto inline-flex items-center gap-2 rounded-lg border border-border/50 bg-background/80 px-3 py-2 backdrop-blur-md">
        <StatCard
          label="Active Events"
          value={events.length}
          icon={<Activity className="h-3.5 w-3.5" aria-hidden="true" />}
          color="#2E86F2"
          isLoading={isLoading}
        />

        {categoryBreakdown.map((cat) => (
          <StatCard
            key={cat.id}
            label={cat.label}
            value={cat.count}
            icon={<cat.Icon className="h-3.5 w-3.5" aria-hidden="true" />}
            color={cat.color}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
}
